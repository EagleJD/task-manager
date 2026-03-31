# 로그인 시스템 기술 문서

## 변경 이력

| 날짜 | 변경 내용 | 이유 |
|---|---|---|
| 2026-03-31 | 문서 최초 작성. JWT + bcrypt + httpOnly 쿠키 방식으로 로그인 시스템 구현 | URL만 알면 누구나 접근 가능하던 앱에 인증 레이어 추가 |

## 개요

URL만 알면 누구나 접근 가능하던 앱에 인증 레이어를 추가했다. 외부 인증 서비스(NextAuth, Clerk 등) 없이 **커스텀 JWT + httpOnly 쿠키** 방식으로 구현했으며, 향후 회원가입·태스크 개인화·CAPTCHA를 추가할 수 있도록 구조를 설계했다.

---

## 전체 흐름

```
브라우저 요청
    │
    ▼
[src/proxy.js]  ← Next.js Proxy (모든 요청의 진입점)
    │
    ├─ auth-token 쿠키 없음 → /login 리다이렉트
    ├─ 쿠키 있음 + JWT 유효 → 요청 통과
    └─ 쿠키 있음 + JWT 만료/변조 → 쿠키 삭제 후 /login 리다이렉트

[/login 페이지] → LoginForm 컴포넌트
    │
    └─ 폼 제출 → POST /api/auth/login
                     │
                     ├─ DB에서 username 조회
                     ├─ bcrypt 비밀번호 검증
                     ├─ JWT 서명 (jose HS256)
                     └─ auth-token 쿠키 설정 → / 리다이렉트
```

---

## 핵심 알고리즘

### 1. 비밀번호 해싱 — bcrypt

**사용 위치:** `scripts/seed-user.js` (유저 생성), `src/app/api/auth/login/route.js` (검증)

bcrypt는 단방향 해시 함수로, 원본 비밀번호를 복원할 수 없다.

```
비밀번호 "1028"
    │
    ▼
bcrypt.hash("1028", saltRounds=12)
    │
    ├─ 랜덤 salt 생성 (22자 base64)
    ├─ 비밀번호 + salt → Blowfish 암호화 2^12 = 4096회 반복
    └─ "$2a$12$[22자 salt][31자 해시]" 형식으로 저장
```

- **salt rounds = 12**: 해시 1회당 약 300ms 소요. 초당 수백만 번 시도 가능한 GPU 무차별 대입 공격(brute force)을 현실적으로 불가능하게 만든다.
- **salt**: 동일한 비밀번호도 매번 다른 해시값을 생성. 레인보우 테이블 공격 무력화.
- DB에 저장되는 것: 해시값만. 원본 비밀번호는 어디에도 저장되지 않는다.

**검증 시:**
```
입력된 비밀번호 "1028" + DB의 해시값
    │
    ▼
bcrypt.compare("1028", "$2a$12$...") → true / false
```

#### 타이밍 공격(Timing Attack) 방어

```js
// 존재하지 않는 유저도 더미 해시로 bcrypt.compare 실행
const hashToCompare =
  user?.password_hash ?? '$2a$12$invalidhashfortimingattackprevention00...';
const valid = await bcrypt.compare(password, hashToCompare);
```

유저가 없을 때 즉시 "없음" 응답을 반환하면, 공격자가 응답 시간으로 "이 아이디는 존재한다/없다"를 구별할 수 있다. 더미 해시를 사용해 항상 동일한 시간이 걸리게 만들어 이를 방지한다.

---

### 2. JWT (JSON Web Token) — HS256

**사용 라이브러리:** `jose`  
**사용 위치:** `src/lib/auth.js`, `src/proxy.js`, `src/app/api/auth/login/route.js`

JWT는 서버가 발급하는 서명된 토큰으로, 별도의 DB 조회 없이 사용자 신원을 검증할 수 있다.

```
JWT 구조 (점으로 구분된 3부분):
eyJhbGciOiJIUzI1NiJ9          ← Header (알고리즘 정보, base64)
.eyJ1c2VySWQiOjEsInVzZXJuY...  ← Payload (데이터, base64)
.M9z8Kp3jR2Lq1N4Xt7Vh...       ← Signature (HMAC-SHA256 서명)
```

**발급 (로그인 성공 시):**
```
Payload: { userId: 1, username: "admin" }
    │
    ▼
SignJWT(payload)
  .setAlgorithm("HS256")
  .setIssuedAt()           ← 발급 시각
  .setExpirationTime("1d") ← 만료 시각 (rememberMe면 "30d")
  .sign(JWT_SECRET)        ← HMAC-SHA256으로 서명
```

**검증 (매 요청마다 proxy.js에서):**
```
auth-token 쿠키의 JWT
    │
    ▼
jwtVerify(token, JWT_SECRET)
    ├─ 서명 검증: Header+Payload를 JWT_SECRET으로 다시 서명해서 일치 여부 확인
    ├─ 만료 시각 확인: exp > 현재시각
    └─ 성공: payload 반환 / 실패: 예외 발생
```

- **HS256**: HMAC-SHA256. 동일한 비밀키로 서명하고 검증하는 대칭 방식. 단일 서버 앱에 적합.
- **JWT_SECRET**: `.env.local`에 저장된 32바이트 랜덤값. 이 값을 모르면 유효한 토큰을 위조할 수 없다.
- JWT는 DB를 조회하지 않아도 검증 가능 → Serverless/Edge 환경에서 빠른 응답.

---

### 3. httpOnly 쿠키

**사용 위치:** `src/app/api/auth/login/route.js`, `src/app/api/auth/logout/route.js`

```
Set-Cookie: auth-token=<JWT>; HttpOnly; SameSite=Lax; Path=/; Max-Age=86400
```

| 속성 | 값 | 역할 |
|---|---|---|
| `HttpOnly` | true | JavaScript에서 `document.cookie`로 읽기 불가 → XSS 공격으로 토큰 탈취 불가 |
| `SameSite=Lax` | lax | 타 도메인에서 폼 제출 시 쿠키 미전송 → CSRF 공격 방어 |
| `Secure` | production에서 true | HTTPS 연결에서만 쿠키 전송 |
| `Max-Age` | 86400 (1일) 또는 2592000 (30일) | "로그인 유지" 여부에 따라 결정 |
| `Path=/` | / | 앱 전체 경로에서 쿠키 전송 |

로그아웃 시 `Max-Age=0`으로 쿠키를 즉시 만료시킨다.

---

### 4. Next.js Proxy (라우트 보호)

**사용 위치:** `src/proxy.js`

Next.js 16의 Proxy(구 Middleware)는 모든 요청이 실제 페이지/API에 도달하기 전에 실행되는 네트워크 경계 계층이다.

```
요청 흐름:
인터넷 → Vercel Edge → [proxy.js 실행] → Next.js 앱

판단 로직:
if (인증 API 경로) → 통과
if (쿠키 없음 && 공개 경로) → 통과
if (쿠키 없음 && 보호 경로) → /login 리다이렉트
if (JWT 유효) → 통과 (로그인 페이지면 / 리다이렉트)
if (JWT 만료·변조) → 쿠키 삭제 + /login 리다이렉트
```

**Matcher 설정:**
```js
matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.svg$|.*\\.ico$).*)']
```
정적 파일(이미지, JS 번들 등)은 Proxy를 거치지 않도록 제외해 성능을 최적화했다.

---

## 데이터베이스 구조

```sql
-- 기존 테이블
tasks (id, text, completed, category, priority, position, created_at, due_date)

-- 새로 추가
users (
  id            SERIAL PRIMARY KEY,
  username      VARCHAR(50) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at    TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
)
```

- `password_hash`: bcrypt 해시값만 저장. 원본 비밀번호 없음.
- 향후 태스크 개인화 시 `tasks.user_id INTEGER REFERENCES users(id)` 컬럼 추가 예정.

---

## 보안 위협 대응 요약

| 위협 | 대응 |
|---|---|
| 패스워드 DB 유출 | bcrypt 해싱 (복원 불가) |
| 토큰 위조 | JWT HS256 서명 검증 |
| XSS로 토큰 탈취 | httpOnly 쿠키 (JS 접근 불가) |
| CSRF | SameSite=Lax 쿠키 |
| 타이밍 공격 | 더미 해시 비교로 응답 시간 균등화 |
| 만료 토큰 재사용 | JWT exp 검증 + 만료 시 쿠키 삭제 |
| 중간자 공격 | Secure 쿠키 (HTTPS 전용, production) |

---

## 파일 구조

```
src/
├── proxy.js                    ← 라우트 보호 (매 요청마다 실행)
├── lib/
│   ├── auth.js                 ← JWT signToken / verifyToken
│   └── db.js                   ← Neon DB 연결 공통 모듈
├── app/
│   ├── login/page.js           ← 로그인 페이지 (서버 컴포넌트)
│   └── api/auth/
│       ├── login/route.js      ← POST: 인증 + 쿠키 발급
│       └── logout/route.js     ← POST: 쿠키 삭제
└── components/
    └── LoginForm.js            ← 로그인 폼 UI (클라이언트 컴포넌트)
scripts/
└── seed-user.js                ← 최초 유저 생성 스크립트
```

---

## 향후 추가 예정 (서브 목표)

| 기능 | 구현 방법 |
|---|---|
| 로그인 유지 | 이미 구현됨 — "로그인 유지" 체크박스로 30일 쿠키 |
| 회원가입 | `POST /api/auth/register` 라우트 추가, users 테이블에 INSERT |
| 태스크 개인화 | tasks에 `user_id` 컬럼 추가, JWT payload의 userId로 필터링 |
| CAPTCHA | hCaptcha 또는 Cloudflare Turnstile — login 폼에 위젯 삽입 |
| Rate Limiting | Upstash Redis로 IP별 로그인 시도 횟수 제한 |
