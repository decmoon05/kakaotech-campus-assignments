# CLAUDE.md

> Claude Code 전용. AGENTS.md 의 모든 규칙 + Claude Code 작업 시 추가 가이드.

## AGENTS.md 먼저 읽을 것

이 폴더에서 작업하는 모든 AI 에이전트는 `AGENTS.md` 의 규칙을 따른다.
Claude Code 도 동일. CLAUDE.md 는 그 위에 Claude Code 환경에서만 의미 있는 항목을 추가.

## Claude Code 전용

### 도구 사용 우선순위
- 파일 탐색은 Glob / Grep 우선. find/grep CLI 호출 금지
- 파일 읽기는 Read. cat/head/tail 금지
- 파일 수정은 Edit. sed/awk 금지
- 파일 생성은 Write
- 코드베이스 탐색 시 사용 가능하면 code-review-graph MCP 활용

### Bash 사용
- 명령어 한 줄로 결과 확인 가능한 작업만 Bash
- npm install / uv pip install 같은 시간 걸리는 작업은 run_in_background
- 인터랙티브 명령어 (npm create vite 의 prompt 등) 피하기. 파일 직접 작성으로 대체

### TodoWrite
- 다단계 작업이면 TodoWrite 로 추적
- 작업 단위가 명확하면 굳이 안 써도 OK

## 본 프로젝트 작업 흐름

1. 작업 들어가기 전 docs/ 4개 + AGENTS.md 컨텍스트 확인
2. migration_plan.md 의 단계별 순서 따르기
3. 각 단계 끝나면:
   - 동작 확인 (브라우저 또는 Swagger UI)
   - checklist.md 항목 체크
   - 기능 단위 커밋
4. 에러 발생 시 trouble_shooting.md 에 기록
5. 마지막에 ISSUE_DRAFT.md (Issue 본문) 작성. `.gitignore` 에 추가해서 푸시 제외

## 푸시 정책

- 모든 깃 푸시는 **사용자 명시적 확인 후**
- 커밋은 단계 단위로 자동 진행 OK
- 푸시 전 git status / git log 확인해서 사용자에게 보여주기

## 회고 톤 규칙 (Issue 본문 작성 시)

본인이 학습일지에 확립한 톤. 절대 어기지 말 것.

- `~다 / ~었다 / ~음` 위주. `~거` 어색
- 점 70% 만. 모든 문장 끝에 점 찍지 말 것
- 백틱은 코드블록에서만. 평문 안의 함수명/키워드는 그냥 텍스트
- 화살표 (→), em dash (—) 사용 금지. 줄바꿈으로 분리
- 강조 큰따옴표 금지 ("어쩌고" 식)

### AI tell 블랙리스트 (한 번이라도 들어가면 톤 깨짐)

- "정곡", "무서웠다", "와닿았다"
- "인상 깊었음", "흥미로웠다", "재밌었다", "유익했다", "의미 있었다"
- "충격", "가장 인상적이었던 부분"
- 과장 부사: "정말", "굉장히", "엄청"
- 마무리 클리셰: "앞으로 ~하겠다", "꼭 ~하고 싶다"

### 허용되는 본인 톤
- "신기했다", "처음 본 흐름", "정리됨", "잡혔음"
- "양이 많았다", "진도가 빨랐다"
- 솔직한 아쉬움 ("커밋이 두꺼워졌다", "다 소화는 못 함")
