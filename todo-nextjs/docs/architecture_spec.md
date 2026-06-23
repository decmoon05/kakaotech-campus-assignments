# 아키텍처 (Architecture Spec)

## 전체 폴더 구조

```
todo-nextjs/
├── docs/                           ← 설계 문서 (이 폴더)
│   ├── functional_spec.md
│   ├── architecture_spec.md
│   ├── error_case.md
│   ├── migration_plan.md
│   ├── checklist.md                ← 마이그 후 점검 체크리스트
│   └── trouble_shooting.md         ← 작업 중 발생한 에러 기록
├── AGENTS.md                       ← AI 에이전트 작업 규칙 (Robert 권고)
├── CLAUDE.md                       ← Claude Code 전용 (AGENTS.md 참조)
├── README.md
├── frontend/                       ← Next.js 15 + TypeScript
│   ├── app/
│   │   ├── api/
│   │   │   └── todos/
│   │   │       ├── route.ts        ← 컬렉션 (GET, POST)
│   │   │       └── [todoId]/
│   │   │           └── route.ts    ← 단건 (PUT, DELETE)
│   │   ├── todos/
│   │   │   ├── page.tsx            ← 목록 (Server Component)
│   │   │   ├── loading.tsx
│   │   │   ├── error.tsx
│   │   │   ├── new/
│   │   │   │   └── page.tsx        ← 생성
│   │   │   └── [todoId]/
│   │   │       └── page.tsx        ← 수정
│   │   ├── actions.ts              ← Server Actions (CRUD)
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx                ← / -> /todos 리다이렉트
│   ├── components/
│   │   ├── TodoForm.tsx            ← 입력 폼 (Client)
│   │   ├── TodoList.tsx            ← 목록 (Server)
│   │   ├── TodoItem.tsx            ← 항목 (Client, isEditing + IME)
│   │   ├── FilterTabs.tsx          ← 필터 탭 (Client, useSearchParams)
│   │   └── SearchInput.tsx         ← 검색창 (Client)
│   ├── lib/
│   │   ├── api.ts                  ← axios 인스턴스, 백엔드 호출 wrapper
│   │   └── types.ts                ← Todo, TodoCreate, TodoUpdate
│   └── .env.local
└── backend/                        ← FastAPI
    ├── main.py                     ← 앱 + CORS + 라우터
    ├── db.py                       ← engine, SessionLocal, Base, get_db
    ├── models.py                   ← SQLAlchemy Todo 모델
    ├── schemas.py                  ← Pydantic 스키마
    ├── crud.py                     ← CRUD 함수 (트랜잭션 처리)
    ├── requirements.txt
    └── .env.local
```

## 데이터 흐름 (두 가지 경로)

### 경로 A: Server Component 가 직접 페칭 (목록 페이지)
```
브라우저 GET /todos
  -> Next.js Server (app/todos/page.tsx 가 async function)
  -> actions.ts 의 getTodos() 호출
  -> axios.get(`${BACKEND_URL}/todos`)
  -> FastAPI
  -> SQLAlchemy db.scalars(select(Todo)).all()
  -> SQLite
  -> JSON 반환
  -> Server Component 가 HTML 조립
  -> 브라우저는 완성된 HTML 만 수신
```

### 경로 B: Client -> Route Handler -> FastAPI (생성/수정/삭제)
```
브라우저 (TodoForm 의 axios.post)
  -> /api/todos (Next.js route.ts)
  -> axios.post(`${BACKEND_URL}/todos`)
  -> FastAPI
  -> SQLAlchemy db.add + db.commit
  -> SQLite
  -> JSON 반환
  -> route.ts 가 그대로 전달
  -> 브라우저
  -> revalidatePath("/todos") 또는 router.refresh()
```

## Server Component vs Client Component 분배

| 컴포넌트 | 종류 | 이유 |
| --- | --- | --- |
| `app/todos/page.tsx` | Server | 데이터 페칭, JSX 만 반환 |
| `app/todos/new/page.tsx` | Server | layout 만 그림 |
| `app/todos/[todoId]/page.tsx` | Server | 초기 데이터 페칭 |
| `app/todos/loading.tsx` | Server | 정적 |
| `app/todos/error.tsx` | Client | onClick(reset) 있어서 강제 |
| `TodoForm` | Client | input, submit 핸들러 |
| `TodoList` | Server | map 만 |
| `TodoItem` | Client | isEditing, IME, onClick |
| `FilterTabs` | Client | useSearchParams + router.push |
| `SearchInput` | Client | onChange + debounce |

## Custom Hook (필요 시 추가, 진미나 패턴 참조)

3차는 백엔드가 상태 관리를 하므로 2차만큼 hook 분리 불필요. 단:
- `useTodoMutations.ts` — axios 호출 묶음 (create/update/delete) — Client Component 들이 공유

## URL 파라미터 (도전 미션)

```
/todos                            ← 전체
/todos?filter=active              ← 진행중
/todos?filter=completed           ← 완료
/todos?search=공부                 ← 검색
/todos?filter=active&search=공부   ← 조합
```

- 페이지 컴포넌트의 props.searchParams 로 받음
- FastAPI 호출 시 그대로 query string 전달

## TypeScript 타입 위치

```
lib/types.ts
  export type Todo = {...}
  export type TodoCreate = {...}
  export type TodoUpdate = {...}
  export type Filter = "all" | "active" | "completed"
```

FastAPI 스키마(backend/schemas.py)와 1:1 매칭. 어긋나면 런타임 에러로 즉시 드러나도록.

## 재렌더 최적화 (Ian 2차 피드백)

- 부모에서 미리 계산해서 props 로 전달 (필터링 결과, 카운트)
- TodoItem 에 React.memo 적용
- onToggle, onRemove 같은 콜백은 useCallback 으로 안정화

## CORS 처리

- Direct Fetch X — 항상 route.ts 또는 Server Action 경유
- FastAPI 의 CORSMiddleware 는 `allow_origins=["http://localhost:3000"]` 최소만
- 환경변수 FRONTEND_URL 로 분리
