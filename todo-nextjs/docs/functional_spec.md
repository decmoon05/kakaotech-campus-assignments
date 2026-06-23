# 기능 명세 (Functional Spec)

> 2차 React Todo를 Next.js + FastAPI 풀스택으로 옮기는 것.
> localStorage 가 FastAPI + SQLite 로 대체되고, 컴포넌트는 Server/Client 로 구분된다.

## 마이그레이션 스코프

### 2차에서 그대로 가져갈 것
- Todo CRUD (생성/수정/완료 토글/삭제)
- 인라인 수정 (isEditing 상태)
- 빈 입력 시 안내 메시지

### 2차에서 바뀔 것
- localStorage → FastAPI + SQLAlchemy + SQLite
- React 단일 SPA → Next.js App Router (Server/Client 분리)
- JS → TypeScript
- 직접 fetch → axios + route.ts 프록시
- 필터/검색 상태 → URL 파라미터 (도전 미션)

### 2차에서 빠질 것
- 일간/주간 뷰 (명세에 없음 → 단순 목록으로 회귀)
- localStorage 자동 동기화 hook

## 필수 미션

### 0. 전체 구조
- frontend/ (Next.js 15) + backend/ (FastAPI) 분리
- 2차 코드에서 옮길 부분 / 백엔드로 분리할 부분 정리

### 1. 프론트 세팅 (Next.js)
- TypeScript, ESLint, Tailwind v4, App Router, src/ X
- localhost:3000 기본 화면 확인

### 2. 백엔드 세팅 (FastAPI)
- python venv + requirements.txt
- main.py 단일 파일 (Hello World 부터)
- localhost:8000 + /docs Swagger UI 확인

### 3. FastAPI Todo CRUD API
- 모델: Todo (id, content, done, createdAt)
- Pydantic 스키마: TodoCreate, TodoUpdate, TodoResponse
- 엔드포인트: GET /todos, POST /todos, PUT /todos/{id}, DELETE /todos/{id}
- todos.db SQLite 파일 자동 생성

### 4. Next.js Todo 페이지 (Server/Client 구분)
- app/todos/page.tsx (목록, Server Component + 데이터 페칭)
- app/todos/new/page.tsx (생성)
- app/todos/[todoId]/page.tsx (수정)
- app/todos/loading.tsx + error.tsx
- 이벤트 핸들러 필요한 곳만 "use client"

### 5. 프론트-백엔드 연동
- app/api/todos/route.ts (브라우저 -> Next 서버 -> FastAPI 프록시)
- app/actions.ts (Server Action, 페이지에서 직접 호출)
- 둘의 역할 차이 명확히

### 6. 환경변수
- frontend/.env.local: BACKEND_URL, NEXT_PUBLIC_API_URL
- backend/.env.local: DATABASE_URL
- 코드 내 하드코딩 없음

## 도전 미션

### 1. 서버 기반 필터링
- URL 파라미터 ?filter=active | completed
- FastAPI 에서 쿼리 파라미터로 받아 DB 조회 (클라이언트 필터링 X)
- useSearchParams 로 상태 관리

### 2. 서버 기반 검색
- ?search=키워드
- FastAPI 에 검색 엔드포인트, DB LIKE 조회
- 필터 + 검색 동시 적용 (?filter=active&search=...)

## 1, 2차 피드백 반영 (3차에서 처리)

| 출처 | 피드백 | 적용 위치 |
| --- | --- | --- |
| Ian (1차) | toISOString 시간대 버그 | 백엔드 SQLite 가 처리, 프론트는 ISO 받아 로컬 변환 |
| Ian (1차) | render 재호출 → 변경 영역만 갱신 | Server Component + Suspense + Streaming |
| Ian (1차) | AI 코드 직접 바꾼 줄 명시 | Issue 회고 5번 섹션 (강제) |
| Ian (2차) | WeekView 재렌더 | 부모에서 미리 계산 + React.memo 적용 |
| Ian (2차) | 한글 IME Enter 버그 | TodoItem 에 e.nativeEvent.isComposing 체크 |
| Ian (2차) | 커밋 메시지 AI 활용 | 기능 단위 커밋마다 AI 에 메시지까지 |
| Robert (1차) | object literal X, 함수로 | createTodo 팩토리 |
| Robert (1차) | plan-first | docs/ + AGENTS.md + CLAUDE.md |
| Robert (2차) | AGENTS.md / CLAUDE.md 적극 사용 | 둘 다 작성 |
| Robert (2차) | plan 문서 깃허브 업로드 | docs/ 통째로 푸시 |
| Robert (2차) | AI 코드 검증 | checklist.md + trouble_shooting.md |
| Robert (2차) | 카테캠 배운 내용 적용 | Server Component, SQLAlchemy 트랜잭션 등 |

## 비기능 요구사항

- TypeScript 엄격 모드 (strict: true)
- 컴포넌트는 한 파일 한 컴포넌트
- 객체 생성은 팩토리 함수
- 변수명/함수명만으로 의도 전달 (주석으로 보충 X — Robert 권고)
- 콘솔 에러 0
- 기능 단위 커밋
