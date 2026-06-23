# Todo - Next.js + FastAPI

카카오테크 캠퍼스 4기 프리코스 3차 과제. 2차에서 만든 React Todo 를 Next.js App Router + FastAPI 백엔드 + SQLite 풀스택 구조로 재구축.

## 실행

### 백엔드
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
# http://localhost:8000 + Swagger UI: http://localhost:8000/docs
```

### 프론트엔드
```bash
cd frontend
npm install
npm run dev
# http://localhost:3000
```

### 환경변수
```
# backend/.env.local
DATABASE_URL=sqlite:///./todos.db
FRONTEND_URL=http://localhost:3000

# frontend/.env.local
BACKEND_URL=http://localhost:8000
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

## 스택

| Frontend | Backend |
| --- | --- |
| Next.js 15 (App Router) | FastAPI 0.111+ |
| React 18 | Uvicorn |
| TypeScript 5 (strict) | SQLAlchemy 2.x |
| Tailwind CSS 4 | SQLite |
| Axios | Pydantic v2 |

## 구현 기능

### 필수
- FastAPI Todo CRUD (GET / POST / PUT / DELETE)
- Next.js App Router 페이지: 목록 / 생성 / 수정 + loading / error
- Server Component (목록 페이지) + Client Component (폼, 입력) 구분
- Route Handler (`/api/todos/route.ts`) 프록시 + Server Action (`app/actions.ts`)
- 환경변수 분리 (.env.local)

### 도전
- URL 파라미터 기반 서버 필터링 (`?filter=active`)
- URL 파라미터 기반 서버 검색 (`?search=키워드`)

## 폴더 구조

```
todo-nextjs/
├── docs/                       설계 문서 (코드 짜기 전)
│   ├── functional_spec.md
│   ├── architecture_spec.md
│   ├── error_case.md
│   ├── migration_plan.md       2차 -> 3차 매핑 + 5단계 전략
│   ├── checklist.md            마이그 후 점검 항목
│   └── trouble_shooting.md     작업 중 발생한 에러 기록
├── AGENTS.md                   AI 에이전트 작업 규칙
├── CLAUDE.md                   Claude Code 전용
├── frontend/                   Next.js
└── backend/                    FastAPI
```

## 1, 2차에서 받은 피드백 반영

| 출처 | 피드백 | 적용 |
| --- | --- | --- |
| Ian (1차) | toISOString 시간대 버그 | 백엔드가 처리, 프론트는 로컬 변환만 |
| Ian (1차) | render 재호출 → 변경 영역만 | Server Component + Suspense + Streaming |
| Ian (2차) | WeekView 재렌더 | 부모에서 미리 계산 + React.memo |
| Ian (2차) | 한글 IME Enter 버그 | TodoItem 의 isComposing 체크 |
| Ian (2차) | 커밋 메시지 AI 활용 | 기능 단위 커밋마다 AGENTS.md 규칙 적용 |
| Robert (1차) | object literal X | 팩토리 함수로 생성 |
| Robert (1차) | plan-first | docs/ 6개 + AGENTS.md + CLAUDE.md |
| Robert (2차) | AGENTS.md / CLAUDE.md | 둘 다 작성 |
| Robert (2차) | plan 문서 깃허브 푸시 | docs/ 통째로 |
| Robert (2차) | AI 코드 검증 | checklist.md + trouble_shooting.md |
| Robert (2차) | 카테캠 배운 내용 적용 | Server Component, SQLAlchemy 트랜잭션 |
