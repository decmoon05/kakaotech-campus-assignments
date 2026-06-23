# AGENTS.md

> AI 에이전트 (Claude, Codex 등) 가 이 폴더에서 코드를 작성할 때 따라야 할 규칙.
> Robert 튜터 권고 (2차 피드백) 로 명시 작성.
> CLAUDE.md 는 이 파일의 Claude Code 전용 확장본.

## 작업 시작 전 반드시 읽을 것

1. `docs/functional_spec.md` — 무엇을 만들지
2. `docs/architecture_spec.md` — 폴더 구조 / 컴포넌트 분배 / 데이터 흐름
3. `docs/error_case.md` — 처리해야 할 예외
4. `docs/migration_plan.md` — 2차 -> 3차 매핑과 5단계 전략

## 코드 스타일

### 공통
- 객체는 항상 **팩토리 함수**로 생성. 객체 리터럴 직접 박지 말 것 (Robert 1차 피드백)
- 함수명 / 변수명만으로 의도가 전달되도록. **주석으로 보충하지 말 것** (Robert 2차 피드백)
- 한 파일 한 책임
- 들여쓰기는 2칸

### TypeScript (frontend)
- strict: true 가정
- any 사용 금지. 명확한 타입 또는 unknown
- axios 호출 시 제네릭 명시: `axios.get<Todo[]>(url)`
- props 는 구조분해로
- 컴포넌트는 `function Name() {}` 또는 `export default function`

### Python (backend)
- type hint 적극 (`Mapped[str]`, `Session`, `Todo | None`)
- Pydantic v2 문법
- SQLAlchemy 2.x 스타일 (`select(Todo)`, `db.scalars(...)`)

## React / Next.js 규칙

- 기본 Server Component. 인터랙션 / Hook 필요할 때만 `"use client"`
- 이벤트 핸들러 prop 이름은 `on + 동사` (`onAdd`, `onToggle`, `onRemove`)
- 이벤트 핸들러 즉시 호출 금지: `onClick={() => fn()}` 만
- `map` 의 key 는 todo.id
- 객체 / 함수를 useEffect deps 에 그대로 넣지 말 것
- **한글 입력 이벤트는 `e.nativeEvent.isComposing` 체크** (Ian 2차 피드백)
- 재렌더 최적화: 부모에서 미리 계산 + React.memo + useCallback (Ian 2차 피드백)

## 데이터 흐름 규칙

- 브라우저에서 백엔드 직접 호출 금지. 항상 Server Action 또는 `route.ts` 경유
- 환경변수에 백엔드 주소 하드코딩 금지
- `NEXT_PUBLIC_` 접두사는 의도적으로 (브라우저 노출 OK 한 값만)

## 커밋

- **기능 단위 커밋**. 한 커밋에 여러 기능 섞지 말 것
- 커밋 메시지는 한국어 + 동사로 시작
- 좋은 예: "FastAPI Todo CRUD 엔드포인트 추가", "한글 IME 조합 중 Enter 버그 수정"
- 안 좋은 예: "fix", "update", "wip"
- **기능 하나 완성하면 커밋 메시지까지 AI 에게 작성 시켜서 docs/CLAUDE 규칙 그대로 따르게** (Ian 2차 피드백)

## 금지 항목

- `prompt()` / `confirm()` / `alert()` 같은 브라우저 다이얼로그
- `document.querySelector` 직접 DOM 조작
- 의미 없는 div 중첩 (Fragment 활용)
- 광범위한 `try / except: pass`
- 학습한 적 없는 라이브러리 무단 도입
- 주석으로 함수 동작 설명 (이름과 구조로 자명하게)
- TypeScript any
- 하드코딩된 URL

## AI 가 자주 빠지는 함정 (점검 대상)

- 함수 안에 setState 호출하면서 "순수함수" 라고 주석
- 객체 생성 시 createdAt/updatedAt 같은 거 인자로 받게 만듦 → 함수 내부 default 처리
- 학습 데이터에서 본 다른 프로젝트 패턴을 그대로 가져옴 → 우리 docs 와 어긋남
- 라이브러리 버전 가정으로 deprecated API 사용
- 카테캠에서 배운 내용 적용 안 됨 (Robert 2차) — Server Component, SQLAlchemy 트랜잭션, useEffect cleanup 등

## 작업 끝나면

1. `docs/checklist.md` 해당 항목 체크
2. 새 에러 만났으면 `docs/trouble_shooting.md` 에 기록
3. 기능 단위 커밋
4. dev 서버 띄워서 동작 확인
