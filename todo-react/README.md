# Todo - React

카카오테크 캠퍼스 4기 프리코스 2차 과제. 1차에서 만든 Vanilla JS Todo 앱을 React로 마이그레이션한 결과물.

## 실행

```bash
npm install
npm run dev
```

브라우저에서 http://localhost:5173/ 접속.

## 스택

- React 18
- Vite 5
- Tailwind CSS v4
- localStorage (Web Storage API)

## 구현한 기능

### 기본 미션
- 프로젝트 세팅 (Vite + Tailwind v4)
- Todo CRUD (생성 / 수정 / 완료 토글 / 삭제)
- 인라인 수정 (prompt 대신 isEditing 상태로 같은 위치에 입력창 분기 렌더)
- 상태별 필터링 (전체 / 진행 중 / 완료)
- 일간 뷰 (이전 / 다음 날짜 이동)
- localStorage 자동 동기화 (useEffect)

### 도전 미션
- 주간 뷰 (월~일 7일, 이전/다음 주 이동, 날짜별 개수 표시, 오늘 강조)

## 폴더 구조

```
todo-react/
├── docs/                       설계 문서 (코드 짜기 전 작성)
│   ├── functional_spec.md      기능 명세
│   ├── architecture_spec.md    컴포넌트 트리 / 상태 위치
│   ├── error_case.md           예외 케이스 정리
│   └── migration_plan.md       1차 함수 -> React 매핑
├── src/
│   ├── App.jsx                 상위 상태 보유 + 컴포넌트 조립
│   ├── main.jsx
│   ├── index.css               Tailwind import
│   ├── components/
│   │   ├── TodoForm.jsx        입력창 + 추가 버튼
│   │   ├── DateNavigator.jsx   이전 / 다음 날짜
│   │   ├── WeekView.jsx        주간 7일 그리드
│   │   ├── FilterTabs.jsx      전체 / 진행 중 / 완료
│   │   ├── TodoList.jsx        map 렌더 + 빈 상태
│   │   ├── TodoItem.jsx        체크박스 + 인라인 수정 + 삭제
│   │   └── Message.jsx         안내 메시지
│   ├── hooks/
│   │   └── useLocalStorageTodos.js  localStorage 자동 동기화
│   ├── utils/
│   │   └── date.js             날짜 유틸 (로컬 기준)
│   └── data/
│       └── todo.js             createTodo 팩토리 함수
├── CLAUDE.md                   AI 작업 규칙
├── index.html
├── package.json
└── vite.config.js
```

## 상태 위치

- `App.jsx` 가 보유 : `todos` / `currentFilter` / `selectedDate` / `message`
- `TodoItem` 로컬 상태 : `isEditing` / `editValue`
- `TodoForm` 로컬 상태 : `input`

## 1차에서 바뀐 부분

| 1차 (Vanilla JS) | 2차 (React) |
| --- | --- |
| `toISOString().split("T")[0]` (UTC 기준 → 시간대 버그) | `getFullYear / getMonth / getDate` 조합 (로컬 기준) |
| 객체 리터럴 `{ id, content, done, date }` 직접 생성 | `createTodo({ content, date })` 팩토리 함수 |
| `replaceWith` 로 DOM 노드 교체 (수정 모드) | `isEditing` 상태로 분기 렌더 |
| 함수마다 `save()` 호출 | `useEffect([todos])` 자동 저장 |
| 전역 변수 + `render()` 통째로 다시 그리기 | useState + React 자동 재렌더 |
| `document.createElement` + `addEventListener` | JSX + onXxx props |
