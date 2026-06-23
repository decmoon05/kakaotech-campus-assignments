# 마이그레이션 플랜 (2차 -> 3차)

> 진미나 회고의 5단계 점진적 전환 전략 + Robert 코멘트 반영
> 한 호흡에 다 만들지 말고 단계별로 검증 후 다음 단계

## 5단계 전환 전략 (진미나 패턴)

```
1단계: 환경 구성 (frontend Next.js + backend FastAPI)
2단계: 재사용 코드 이식 (utils, types — 테스트 통과 후)
3단계: 백엔드 CRUD 완성 (Swagger UI 로 검증)
4단계: 프론트 컴포넌트 작성 (Server/Client 분리)
5단계: route.ts + actions.ts 로 조합 + E2E 검증
```

각 단계 끝날 때마다 커밋 + 동작 확인. 두 단계 합치지 말 것.

## 2차 코드 -> 3차 매핑

### 상태 (useState -> 백엔드 + URL 파라미터)

| 2차 | 3차 |
| --- | --- |
| `useState(todos)` + useLocalStorageTodos | FastAPI + SQLite (영속화는 백엔드) |
| `useState(currentFilter)` | URL 파라미터 `?filter=active` |
| `useState(selectedDate)` | (제거, 명세에 일간 뷰 없음) |
| `useState(message)` | 동일 (UI 안내) |
| `useState(isEditing)` (TodoItem) | 동일 (수정 모드) |

### 함수

| 2차 | 3차 |
| --- | --- |
| `addTodo` | actions.ts 의 createTodo (Server Action) |
| `toggleDone` | actions.ts 의 toggleTodo |
| `removeTodo` | actions.ts 의 deleteTodo |
| `editTodo` | actions.ts 의 updateTodo |
| `createTodo({content, date})` 팩토리 | 백엔드 main.py 의 `Todo(content=..., done=False)` |
| `useLocalStorageTodos` 훅 | 제거 (백엔드가 영속화) |
| `useMemo(visibleTodos)` | URL 파라미터를 FastAPI 에 그대로 전달 (서버 필터링) |

### 컴포넌트

| 2차 | 3차 |
| --- | --- |
| `App.jsx` (전체 조립) | `app/todos/page.tsx` (Server) + `app/layout.tsx` |
| `TodoForm.jsx` | `components/TodoForm.tsx` (Client) — Server Action 호출 |
| `TodoList.jsx` | `components/TodoList.tsx` (Server) |
| `TodoItem.jsx` | `components/TodoItem.tsx` (Client) — IME 처리 추가 |
| `FilterTabs.jsx` | `components/FilterTabs.tsx` (Client) — useSearchParams |
| `DateNavigator.jsx` | 제거 |
| `WeekView.jsx` | 제거 |
| `Message.jsx` | 제거 (toast 라이브러리 검토) |

## 의도적으로 직접 수정할 부분 (Issue 회고용)

Ian 2차 피드백: "AI 코드에서 내가 직접 바꾼 줄 명시" — 미리 박아둠

1. **`components/TodoItem.tsx` 의 IME 처리**
   - 1차/2차 둘 다 빠졌던 부분. `e.nativeEvent.isComposing` 명시적 추가
2. **`components/FilterTabs.tsx` 의 useSearchParams + router.replace**
   - useState 가 아니라 URL 동기화 패턴 직접 선택
3. **`backend/main.py` 의 CORS 환경변수화**
   - `allow_origins=["*"]` 거부. FRONTEND_URL 환경변수로 분리
4. **`backend/crud.py` 의 트랜잭션 패턴**
   - try/db.commit/db.rollback 명시적으로
5. **`lib/types.ts` 와 `backend/schemas.py` 동기화 점검**
   - checklist.md 에 항목으로 박음

## 단계별 커밋 계획

```
[1] Next.js + FastAPI 초기 세팅
[2] backend: SQLAlchemy 모델 + Pydantic 스키마 + GET/POST
[3] backend: PUT/DELETE + CORS + 환경변수
[4] frontend: lib/types.ts + lib/api.ts (axios 인스턴스)
[5] frontend: app/todos/page.tsx + TodoList + TodoItem
[6] frontend: TodoForm + actions.ts (Server Action)
[7] frontend: route.ts 프록시 + 수정/삭제 연동
[8] frontend: loading.tsx + error.tsx
[9] (도전) FilterTabs + 서버 필터링
[10] (도전) SearchInput + 서버 검색
[11] README + Issue 회고
```

## 검증 단계 (각 단계 끝마다)

- [ ] 백엔드: /docs Swagger UI 에서 직접 호출 → 성공
- [ ] 프론트: 브라우저에서 직접 동작 확인
- [ ] 콘솔 에러 0
- [ ] checklist.md 의 해당 항목 체크

## 다음 차수에 시도해볼 것 (3차 회고용 미리 적기)

- Vitest 단위 테스트 (createTodo, axios wrapper)
- Playwright E2E (목록 -> 생성 -> 삭제 시나리오)
- llm wiki 패턴으로 docs 양방향 참조 (Robert 권고)
