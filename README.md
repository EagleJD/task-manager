# My Task Diary

쿠로미 스티커 테마의 개인 태스크 매니저 다이어리. 로그인 인증 후 카테고리·우선순위별로 태스크를 관리한다.

## 기술 스택

| 분류 | 기술 |
|---|---|
| 프레임워크 | Next.js 16.2.1 (App Router) |
| 데이터베이스 | Neon (Serverless PostgreSQL) |
| 배포 | Vercel |
| 인증 | 커스텀 JWT + httpOnly 쿠키 (jose, bcryptjs) |

## 시작하기

```bash
npm install
npm run dev
```

### 환경변수 설정 (`.env.local`)

```
DATABASE_URL=<Neon 연결 문자열>
JWT_SECRET=<32바이트 이상 랜덤값>
```

`JWT_SECRET` 생성: `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`

### 첫 유저 생성

```bash
SEED_PASSWORD=비밀번호 node scripts/seed-user.js
# 기본 username: admin (변경: SEED_USERNAME=이름)
```

## 문서

- [docs/services.md](docs/services.md) — 외부 서비스 및 패키지 정리
- [docs/auth-system.md](docs/auth-system.md) — 로그인 시스템 로직·알고리즘 문서

## 프로젝트 구조

```
src/
├── proxy.js                    ← 라우트 보호 (모든 요청의 진입점)
├── app/
│   ├── page.js                 ← 홈 (DiaryApp 렌더링)
│   ├── login/page.js           ← 로그인 페이지
│   ├── api/
│   │   ├── tasks/              ← 태스크 CRUD API
│   │   └── auth/               ← 로그인·로그아웃 API
│   └── globals.css             ← 디자인 시스템 (CSS 커스텀 프로퍼티)
├── components/
│   ├── DiaryApp.js             ← 메인 앱 (상태 관리, 북마크 필터)
│   ├── TaskManager.js          ← 태스크 폼 + 칸반 보드
│   ├── KuromiStickers.js       ← 배경 스티커 렌더링
│   └── LoginForm.js            ← 로그인 폼
└── lib/
    ├── auth.js                 ← JWT 헬퍼
    ├── db.js                   ← DB 연결
    └── taskOptions.js          ← 카테고리·우선순위 상수
scripts/
├── seed-user.js                ← 최초 유저 생성
└── generate-images.js          ← 히어로 이미지·파비콘 생성
```
