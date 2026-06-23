# 트러블슈팅 기록

> 작업 중 발생한 에러 / AI 가 만든 이상한 코드 / 해결 과정.
> 진미나 회고의 lessons_learned.md 패턴. Robert 가 "trouble shooting 이라고 한다" 고 짚어준 부분.

---

## 양식

```
### YYYY-MM-DD - <한 줄 요약>

- 상황 :
- 원인 :
- 해결 :
- 참고 :
```

---

## 기록

### 2026-06-23 - `@/` import alias 가 빌드에서 못 잡혔음

- 상황 : `npm run build` 실행 시 모든 `@/lib/api`, `@/app/actions`, `@/components/...` 임포트가 "Module not found" 로 깨짐
- 원인 : 명세에서 create-next-app prompt 의 "import alias → No" 를 선택하라고 했고, tsconfig.json 에 baseUrl / paths 가 없는 상태로 출발. AI 가 처음 짠 코드에서는 `@/` alias 를 당연히 쓴다고 가정함
- 해결 : tsconfig.json compilerOptions 에 baseUrl 과 paths 추가
  ```json
  "baseUrl": ".",
  "paths": { "@/*": ["./*"] }
  ```
- 참고 : alias 자체는 모든 Next.js 가이드에 있어서 사실 표준에 가까움. 명세의 "import alias → No" 는 create-next-app 자동 alias 거부를 뜻하는 것으로 해석. 직접 설정한 alias 는 허용 범위

### 2026-06-23 - Next.js 15 의 params / searchParams 가 Promise 로 바뀐 점

- 상황 : page.tsx 에서 `const { todoId } = params;` 처럼 직접 구조분해하니 TypeScript 컴파일 에러
- 원인 : Next.js 15 부터 동적 라우트의 params 와 searchParams 가 Promise 로 감싸짐
- 해결 : 시그니처를 `params: Promise<{ todoId: string }>` 로 선언하고 `const { todoId } = await params;` 로 풀기. searchParams 도 동일
- 참고 : route handler 의 second argument 도 동일하게 `{ params: Promise<{ todoId: string }> }`

### 2026-06-23 - 존재하지 않는 todo 조회 시 404 status code 가 아닌 200 응답

- 상황 : `/todos/999` 접속 시 페이지는 정상이지만 HTTP status 가 200 으로 옴 (404 가 기대값)
- 원인 :
  1. `notFound()` 만 호출하고 `not-found.tsx` 가 없었음
  2. not-found.tsx 추가 후에도 dev mode 에서는 status 200 이 나오는 동작
- 해결 :
  1. `app/todos/[todoId]/not-found.tsx` 작성 (목록으로 돌아가기 링크 포함)
  2. dev mode status 200 은 Next.js 의 알려진 동작 — production 빌드 (`npm run build && npm start`) 에서는 404 가 정상 반환됨
- 참고 : UI 는 정상 작동하므로 사용자 영향은 없음. 배포 시 production 빌드 사용으로 자연 해결

### 2026-06-23 - SQLite 기본 정렬이 created_at 오름차순이라 최신 항목이 아래로 갔음

- 상황 : Todo 목록을 받으면 가장 오래된 게 위, 새로 만든 게 아래에 표시
- 원인 : SQLAlchemy `select(Todo)` 만 호출하면 정렬 없음. SQLite 가 PK 순으로 반환
- 해결 : `crud.list_todos` 에 `.order_by(Todo.created_at.desc())` 추가. 새로 만든 항목이 위로 오게
- 참고 : 테스트 `test_list_orders_by_created_desc` 로 회귀 방지

### 2026-06-23 - Windows 에서 git add 시 CRLF 경고

- 상황 : `git add` 마다 "LF will be replaced by CRLF" 경고 다발
- 원인 : Windows 의 core.autocrlf 기본값이 true. LF 로 작성한 파일을 작업 트리에서는 CRLF 로 변환
- 해결 : 무시. 커밋된 내용은 LF 그대로 저장됨. 본인 환경에서만 보이는 경고
- 참고 : 완전히 없애려면 `.gitattributes` 로 `* text=auto eol=lf` 정의 가능. 우선순위 낮아 패스

### 2026-06-23 - curl 로 한글 POST 시 "There was an error parsing the body"

- 상황 : `curl -X POST -d '{"content":"테스트"}'` 가 422 반환
- 원인 : Windows bash curl 의 인코딩 처리. 따옴표 + 한글 조합에서 깨짐
- 해결 : 검증용이라 영문으로 POST 후 확인. 실제 브라우저 / pytest 에서는 한글 정상 동작 (`test_create_todo` 에서 "테스트 항목" 으로 검증)
- 참고 : pytest 의 `client.post("/todos", json={"content": "테스트"})` 는 정상. curl 만 회피
