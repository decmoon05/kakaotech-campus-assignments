# 에러 케이스 (Error Cases)

> 사용자 입력 / 데이터 / 환경 단에서 발생 가능한 케이스 정리

## 입력 단

| 케이스 | 처리 |
| --- | --- |
| 빈 입력 (공백만) | Todo 생성 안 함 + 안내 메시지 2초 노출 |
| 매우 긴 텍스트 | 생성은 허용. CSS `word-break`로 줄바꿈 처리 |
| 특수문자 / 이모지 | 그대로 저장 (JSON 직렬화 가능) |
| 수정 중 빈 값 저장 | 원본 유지 + 수정 모드 종료 |
| 수정 중 ESC | 변경 없이 수정 모드 종료 |

## 데이터 단

| 케이스 | 처리 |
| --- | --- |
| localStorage 깨진 JSON | `try / catch` 로 잡고 빈 배열로 초기화 |
| localStorage 키 없음 | 빈 배열로 시작 |
| localStorage 용량 초과 | `try / catch` 로 잡고 안내 메시지 노출 |
| Todo id 충돌 | 생성 시 `Date.now()` 기반이라 사실상 발생 X. 그래도 새 Todo의 id는 항상 기존 max + 1 보장 (보강) |

## 날짜 단

| 케이스 | 처리 |
| --- | --- |
| 자정 근처 생성 (시간대 버그) | 로컬 기준 `toDateString` 으로 회피 (Ian 피드백) |
| 윤년 / 월말 이동 | `Date` 객체에 위임, 자동 처리 |
| `weekStartDate` 가 일요일 시작 시스템과 충돌 | 항상 월요일 기준으로 계산 (`day === 0 ? 6 : day - 1`) |

## React 단

| 케이스 | 처리 |
| --- | --- |
| `map` 에서 key 누락 → 경고 | `todo.id` 를 key 로 사용 |
| 이벤트 핸들러 즉시 호출 (`onClick={fn()}`) → 무한 루프 | 항상 `onClick={() => fn()}` 패턴 |
| `useEffect` 의존성 빠짐 → stale closure | 의존성 배열에 사용한 모든 state/props 명시 |
| props undefined → `Cannot read properties` | 기본값 `{ todos = [] }` 또는 부모에서 항상 전달 보장 |
| 함수형 초기화 안 함 → 매 렌더마다 localStorage 읽음 | `useState(() => JSON.parse(...))` 함수형 초기화 |
| 객체/함수를 useEffect deps에 그대로 → 무한 렌더 | 원시값만 deps에 넣고, 필요 시 `useMemo` / `useCallback` |

## UX

| 케이스 | 처리 |
| --- | --- |
| Todo 0개인 날 | 빈 상태 안내 ("이 날짜의 할 일이 없습니다") |
| 모든 필터 결과가 0개 | 빈 상태 안내 + 현재 필터 명시 |
| 안내 메시지 중복 노출 | `setTimeout` 으로 2초 후 자동 제거 |
