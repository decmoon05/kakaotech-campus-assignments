# 아키텍처 (Architecture Spec)

## 폴더 구조

```
todo-react/
├── docs/                       ← 설계 문서 (이 폴더)
├── public/
├── src/
│   ├── App.jsx                 ← 최상위 상태 보유 + 컴포넌트 조립
│   ├── main.jsx                ← 진입점
│   ├── index.css               ← Tailwind import
│   ├── components/
│   │   ├── TodoForm.jsx        ← 입력창 + 추가 버튼
│   │   ├── DateNavigator.jsx   ← 이전/다음 날짜 + 라벨
│   │   ├── WeekView.jsx        ← 주간 7일 + 개수 표시
│   │   ├── FilterTabs.jsx      ← 전체/진행중/완료
│   │   ├── TodoList.jsx        ← map 렌더
│   │   ├── TodoItem.jsx        ← 체크박스 + 텍스트(인라인 수정) + 삭제
│   │   └── Message.jsx         ← 안내 메시지
│   ├── hooks/
│   │   └── useLocalStorageTodos.js  ← localStorage 자동 동기화
│   ├── utils/
│   │   └── date.js             ← toDateString, formatDateLabel, getWeekDates
│   └── data/
│       └── todo.js             ← createTodo 팩토리 함수
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## 컴포넌트 트리

```
App
├── TodoForm           (props: onAdd, message)
├── DateNavigator      (props: selectedDate, onPrev, onNext)
├── WeekView           (props: selectedDate, todos, onSelectDate, onShiftWeek)
├── FilterTabs         (props: filter, onChange)
└── TodoList           (props: todos)
    └── TodoItem * N   (props: todo, onToggle, onRemove, onEdit)
```

## 상태 위치 (Lifting State Up)

**App.jsx 가 소유**:
- `todos` — 전체 Todo 배열 (localStorage 동기화 대상)
- `currentFilter` — "all" | "active" | "done"
- `selectedDate` — "YYYY-MM-DD"
- `message` — 안내 메시지 (빈 입력 등)

**컴포넌트 로컬 상태**:
- `TodoItem` 의 `isEditing` (수정 모드 토글)
- `TodoItem` 의 `editValue` (수정 중 입력값)
- `TodoForm` 의 `input` (입력 중인 텍스트)

## 데이터 흐름

```
사용자 입력
  ↓
컴포넌트가 onXxx 콜백 호출 (props로 받은 함수)
  ↓
App.jsx 의 핸들러가 setState
  ↓
React가 변경된 부분만 자동 재렌더
  ↓
useEffect([todos]) 가 트리거되어 localStorage 동기화
```

## 1차 함수 → React 매핑 (자세한 건 migration_plan.md)

| 1차 함수 | 2차 위치 |
| --- | --- |
| 전역 변수 (todos, currentFilter, selectedDate) | `App.jsx` 의 useState |
| `load` / `save` | `useEffect` 자동 동기화 |
| `render` / `renderWeek` | 자동 (state 변경 시 React가) |
| `addTodo` / `toggleDone` / `removeTodo` | App.jsx 핸들러 |
| `startEdit` (replaceWith 패턴) | `TodoItem` 의 `isEditing` 상태 |
| `toDateString` / `formatDateLabel` / `getWeekDates` | `utils/date.js` |
| 이벤트 바인딩 (`addEventListener`) | JSX 의 `onClick` / `onSubmit` |

## 시간대 버그 처리 (Ian 피드백 반영)

1차의 `toISOString().split("T")[0]` → **로컬 기준으로 교체**:

```js
function toDateString(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
```
