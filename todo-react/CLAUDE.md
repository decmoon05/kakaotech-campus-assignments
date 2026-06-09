# 2차 과제 (React Todo) — 작업 규칙

이 폴더 안에서 AI 가 코드를 만들 때 따라야 할 규칙.

## 코드 스타일

- 객체는 항상 **팩토리 함수**로 생성. 객체 리터럴 직접 박지 말 것
  - 안 좋은 예: `todos.push({ id: ..., content: ..., done: false })`
  - 좋은 예: `todos.push(createTodo({ content, date }))`
- 컴포넌트는 한 파일 한 컴포넌트
- props 는 항상 구조분해로 받기: `function TodoItem({ todo, onToggle })`
- 함수형 컴포넌트만. 클래스 컴포넌트 사용 X
- 화살표 함수와 일반 함수 둘 다 OK, 컴포넌트는 `function Name() {}` 선호

## 상태 관리

- 같은 데이터를 두 컴포넌트가 쓰면 **공통 부모로 끌어올리기** (Lifting State Up)
- 배열 / 객체 상태는 항상 새 참조로 갱신 (spread / map / filter), mutate 금지
- localStorage 초기값은 **함수형 초기화** 사용
  ```js
  const [todos, setTodos] = useState(() => loadFromStorage())
  ```

## useEffect

- 의존성 배열에 사용한 모든 state/props 명시
- cleanup 함수가 필요한 부수효과는 반드시 반환
- 객체 / 함수를 deps 에 넣지 말 것 (무한 렌더 위험)

## 이벤트 핸들러

- `onClick={() => fn(args)}` 패턴. `onClick={fn(args)}` 절대 금지
- 이벤트 핸들러 prop 이름은 `on + 동사` 컨벤션 (`onAdd`, `onToggle`, `onRemove`)

## 날짜

- **항상 로컬 기준** `toDateString` 사용. `toISOString` 사용 금지 (1차 시간대 버그)
- 주차 계산은 월요일 기준 (`day === 0 ? 6 : day - 1`)

## 커밋

- 기능 단위 커밋. 한 커밋에 여러 기능 섞지 말 것
- 커밋 메시지는 한국어 + 동사로 시작
  - 좋은 예: "TodoForm 컴포넌트 추가", "시간대 버그 수정 (로컬 기준)"
  - 안 좋은 예: "fix", "update"

## 금지 항목

- `prompt()` / `confirm()` / `alert()` — 모두 컴포넌트로 대체
- `document.querySelector` 등 직접 DOM 조작 — JSX + state 로
- 의미 없는 div 중첩 — Fragment `<>...</>` 활용
- `any` 식의 광범위한 catch — 구체적 처리

## docs/ 참조

코드 작성 전 반드시 확인:
- `docs/functional_spec.md` — 무엇을 만들지
- `docs/architecture_spec.md` — 어떻게 분리할지
- `docs/error_case.md` — 어떤 케이스를 처리할지
- `docs/migration_plan.md` — 1차에서 어떻게 옮길지
