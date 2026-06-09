# 마이그레이션 플랜 (1차 → 2차)

> 1차 todo-vanilla/app.js 의 각 부분을 React 어디로 옮길지 매핑

## 상태 (전역 변수 → useState)

| 1차 (전역) | 2차 (App.jsx useState) |
| --- | --- |
| `let todos = []` | `const [todos, setTodos] = useState(() => loadFromStorage())` |
| `let currentFilter = "all"` | `const [currentFilter, setCurrentFilter] = useState("all")` |
| `let selectedDate = ...` | `const [selectedDate, setSelectedDate] = useState(toDateString(new Date()))` |
| `const today = ...` | `const today = toDateString(new Date())` (변수 그대로) |
| (없음) | `const [message, setMessage] = useState("")` |

## 함수

| 1차 함수 | 2차 위치 | 변환 방식 |
| --- | --- | --- |
| `toDateString` | `utils/date.js` | **로컬 기준으로 교체** (Ian 피드백) |
| `formatDateLabel` | `utils/date.js` | 그대로 |
| `getWeekDates` | `utils/date.js` | 그대로 |
| `countByDate(date)` | `WeekView` 내부 | `todos.filter(t => t.date === date).length` |
| `load` / `save` | `useEffect` | `useEffect(() => localStorage.setItem(...), [todos])` |
| `showMessage` | App 핸들러 | `setMessage(text); setTimeout(() => setMessage(""), 2000)` |
| `getVisibleTodos` | 파생값 | App에서 `useMemo` 또는 그냥 변수로 |
| `render` / `renderWeek` | 삭제 | React가 자동 |
| `addTodo` | App 핸들러 | `setTodos(prev => [...prev, createTodo({...})])` |
| `toggleDone` | App 핸들러 | `setTodos(prev => prev.map(t => t.id === id ? {...t, done: !t.done} : t))` |
| `removeTodo` | App 핸들러 | `setTodos(prev => prev.filter(t => t.id !== id))` |
| `startEdit` (replaceWith) | `TodoItem` 로컬 상태 | `isEditing` 토글 + 같은 위치에 input 렌더 |
| `setFilter` | App 핸들러 | `setCurrentFilter(filter)` |
| `shiftDay` / `shiftWeek` | App 핸들러 | `setSelectedDate(...)` |

## Todo 객체 생성 (튜터 Robert 권고)

1차:
```js
todos.push({ id: Date.now(), content: trimmed, done: false, date: selectedDate });
```

2차 (객체 리터럴 직접 생성 X, 팩토리 함수로):
```js
// data/todo.js
export function createTodo({ content, date }) {
  return {
    id: Date.now(),
    content: content.trim(),
    done: false,
    date,
    createdAt: Date.now(),
  };
}
```

## DOM 조작 → JSX

| 1차 | 2차 |
| --- | --- |
| `document.createElement("li")` 후 append | JSX 안에서 `<li>...</li>` |
| `innerHTML = "..."` | JSX 표현식 `{...}` |
| `classList.add/remove/toggle` | className 삼항 `${A} ${B ? C : ""}` |
| `addEventListener("click", fn)` | JSX `onClick={fn}` |
| `replaceWith(input)` | 상태로 분기 렌더 `{isEditing ? <input/> : <span/>}` |

## 기능 단위 작업 순서 (커밋 단위)

1. **세팅** — Vite + Tailwind v4 + 폴더 구조
2. **utils/date.js + data/todo.js** — 순수 함수부터 (테스트 가능)
3. **TodoForm + 미션 0~1 (구조 + 입력만)** — 화면에 텍스트만 추가되게
4. **TodoList + TodoItem + CRUD** — 토글 / 삭제 / 인라인 수정
5. **FilterTabs** — 필터 상태별 표시
6. **DateNavigator** — 날짜 이동 + 날짜별 분기
7. **useLocalStorageTodos hook + useEffect 동기화**
8. **WeekView (도전 미션)** — 1차 코드 이식
9. **빈 상태 UI / 안내 메시지 / 시각 정리**
10. **README + Issue 회고 작성**

## "직접 수정한 줄" 후보 (Ian 피드백 → Issue 작성용)

미리 의도하고 들어가는 직접 수정 포인트:
- **`utils/date.js` 의 `toDateString`** — 1차의 `toISOString` 대신 로컬 기준으로 직접 교체
- **`data/todo.js` 의 `createTodo` 팩토리** — AI 가 객체 리터럴 박는 거 막고 함수로
- **`TodoItem` 의 인라인 수정** — `prompt()` / `replaceWith` 대신 `isEditing` 패턴
