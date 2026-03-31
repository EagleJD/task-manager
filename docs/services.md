# 외부 서비스 정리

## 변경 이력

| 날짜 | 변경 내용 | 이유 |
|---|---|---|
| 2026-03-31 | 문서 최초 작성. Next.js, Neon, Vercel, Sharp, Lucide, Google Fonts 정리 | 프로젝트 서비스 현황 문서화 |
| 2026-03-31 | `jose`, `bcryptjs` 추가 | 로그인 시스템 구현 |
| 2026-03-31 | 스티커 캐릭터 추가 가이드 정비 (My Melody, Cinnamoroll, Little Twin Stars, Pompompurin 추천) | 파스텔 테마 캐릭터 확장 방향 문서화 |

## 현재 사용 중인 서비스

| 분류 | 서비스 | 역할 |
|---|---|---|
| **웹 프레임워크** | [Next.js 16.2.1](https://nextjs.org) | 풀스택 React 프레임워크. App Router, API Routes, Proxy(Middleware) 제공 |
| **UI 라이브러리** | [React 19.2.4](https://react.dev) | 컴포넌트 기반 UI 렌더링 |
| **데이터베이스** | [Neon](https://neon.tech) | Serverless PostgreSQL. 연결 풀링 내장, Vercel과 공식 통합 지원 |
| **DB 클라이언트** | [@neondatabase/serverless](https://github.com/neondatabase/serverless) | Neon 전용 PostgreSQL 드라이버. Edge/Serverless 환경에서 WebSocket 기반 쿼리 |
| **클라우드 배포** | [Vercel](https://vercel.com) | Next.js 앱 호스팅. git push 시 자동 빌드·배포, 환경변수 관리 |
| **이미지 처리** | [Sharp](https://sharp.pixelplumbing.com) | Node.js 기반 고성능 이미지 변환 (SVG → PNG 변환, 리사이징) |
| **아이콘** | [Lucide React](https://lucide.dev) | SVG 기반 아이콘 라이브러리 |
| **폰트** | [Google Fonts](https://fonts.google.com) | Gaegu, M PLUS Rounded 1c |

## 로그인 시스템에서 새로 추가한 패키지

| 패키지 | 역할 |
|---|---|
| [jose](https://github.com/panva/jose) | 순수 JS JWT 라이브러리. HS256 서명/검증 (Edge/Serverless 호환) |
| [bcryptjs](https://github.com/dcodeIO/bcrypt.js) | 순수 JS bcrypt. 비밀번호 해싱 (native addon 없이 Vercel 빌드 가능) |

## 추후 서브 목표 구현 시 추천 서비스

| 목표 | 추천 서비스 | 이유 |
|---|---|---|
| CAPTCHA | [hCaptcha](https://www.hcaptcha.com) 또는 [Cloudflare Turnstile](https://www.cloudflare.com/products/turnstile/) | 무료, 봇 차단, React 연동 쉬움. Turnstile은 사용자에게 문제 풀기 없이 투명하게 동작 |
| Rate Limiting (로그인 시도 제한) | [Upstash Redis](https://upstash.com) | Serverless Redis. Vercel Edge에서 IP별 요청 횟수 카운팅에 적합 |
| OTP / 이메일 인증 | [Resend](https://resend.com) | 개발자 친화적 이메일 API. 무료 플랜 3,000건/월 |
| 소셜 로그인 (Google 등) | [NextAuth.js v5](https://authjs.dev) | Next.js 공식 인증 라이브러리. 현재 커스텀 JWT 구조와 통합 가능 |
| MCP 연동 | [Vercel MCP](https://vercel.com/docs/mcp) / [Figma MCP](https://www.figma.com/developers/mcp) | 현재 `.mcp.json`에 이미 설정됨. 배포 자동화, 디자인 반영에 활용 가능 |
