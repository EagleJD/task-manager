<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Documentation Update Rule

**메이저한 변경사항이 있을 때마다 `docs/` 폴더의 관련 문서를 업데이트해야 한다.**

메이저 변경의 기준:
- 새 외부 서비스, 패키지, API 추가 또는 제거
- 인증·라우팅·DB 스키마 등 아키텍처 변경
- 새 기능 모듈 추가 (로그인, 회원가입, 태스크 개인화 등)
- 보안 관련 로직 변경

업데이트 대상 파일:
- `docs/services.md` — 서비스·패키지 추가/변경 시
- `docs/auth-system.md` — 인증 관련 로직 변경 시
- 새 기능이 기존 문서 범위를 벗어나면 `docs/` 아래 새 파일 생성

업데이트 형식: 각 문서의 **변경 이력** 섹션에 날짜·변경 내용·이유를 한 줄로 추가한다.
