# 마이그레이션 후 점검 체크리스트

> 진미나 회고 패턴. 각 기능 완성 후 체크.
> ✅ = curl / pytest / SSR HTML 으로 검증 완료
> ☐ = 본인 PC 브라우저에서 직접 확인 필요

## 백엔드 (FastAPI)

- ✅ `localhost:8000/docs` Swagger UI 정상 (서버 health check)
- ✅ GET /todos 빈 배열 반환 (pytest: test_list_empty)
- ✅ POST /todos 새 항목 생성 + id 반환 (pytest: test_create_todo)
- ✅ GET /todos 생성한 항목 포함 (pytest: test_list_after_create)
- ✅ PUT /todos/{id} 수정 반영 (pytest: test_update_content)
- ✅ DELETE /todos/{id} 204 + 목록에서 제거 (pytest: test_delete)
- ✅ 존재하지 않는 id PUT/DELETE 시 404 (pytest: test_update_not_found, test_delete_not_found)
- ✅ todos.db 파일 backend/ 에 생성
- ✅ CORS 가 FRONTEND_URL 환경변수 기반
- ✅ 가상환경 (.venv) 활성화 상태에서 실행
- ✅ 빈 입력 422 (pytest: test_create_validates_empty)
- ✅ 1000자 초과 입력 422 (pytest: test_create_validates_too_long)
- ✅ 정렬: created_at desc (pytest: test_list_orders_by_created_desc)
- ✅ updated_at 자동 갱신 (pytest: test_update_updated_at_changes)

## 프론트엔드 (Next.js)

- ✅ `localhost:3000` 기본 화면 (dev server 검증)
- ✅ `/` 접속 시 `/todos` 리다이렉트 (curl: 307 -> /todos)
- ✅ `/todos` 목록 표시 (curl: SSR HTML 에 todo content 포함)
- ✅ `/todos/new` 생성 페이지 (SSR HTML 확인)
- ✅ `/todos/[todoId]` 수정 페이지 (기존 content 가 input value 에)
- ✅ `/todos/[todoId]` 존재하지 않는 id 시 not-found.tsx 표시
- ☐ loading.tsx Streaming 동작 (브라우저에서만 체감)
- ✅ 생성 후 목록 자동 갱신 (revalidatePath, API 시나리오 검증)
- ✅ 수정 후 목록 자동 갱신
- ✅ 삭제 후 목록 자동 갱신

## TypeScript / 타입 정합성

- ✅ `lib/types.ts` 와 `backend/schemas.py` 필드 1:1 일치
- ✅ axios 호출 시 제네릭 명시 (`axios.get<Todo[]>`)
- ✅ strict: true 에서 컴파일 통과 (npm run build)
- ✅ any 사용 0
- ✅ vitest 타입 단위 테스트 4개 통과

## React 패턴

- ✅ Server / Client Component 구분 명확
- ✅ "use client" 가 필요한 곳에만
- ✅ map 의 key 가 todo.id
- ✅ 이벤트 핸들러 `onClick={() => fn()}` 패턴
- ✅ useEffect 의존성 배열 명시
- ✅ **TodoForm/TodoItem/SearchInput/EditTodoForm 4곳에 `e.nativeEvent.isComposing` 체크** (Ian 2차 피드백)
- ✅ **TodoItem 에 React.memo 적용** (Ian 2차 피드백)

## URL 파라미터 (도전 미션)

- ✅ `?filter=active` 동작 (curl + pytest: test_filter_active)
- ✅ `?filter=completed` 동작 (curl + pytest: test_filter_completed)
- ✅ `?search=키워드` 동작 (curl + pytest: test_search)
- ✅ `?filter=...&search=...` 조합 (pytest: test_filter_and_search_combined)
- ☐ 새로고침 후 필터 유지 (브라우저에서 확인)
- ✅ `useSearchParams` Suspense boundary

## 환경변수

- ✅ `.env.local` 이 `.gitignore` 에 포함
- ✅ 코드 내 `http://localhost:8000` 하드코딩 0 (BACKEND_URL 사용)
- ✅ `NEXT_PUBLIC_` 접두사 의도적 사용 (BACKEND_URL 은 서버 전용)
- ✅ 환경변수 변경 후 dev 서버 재시작 (검증 시 적용)

## 코드 품질

- ✅ 불필요한 `console.log` 제거
- ✅ 사용 안 하는 import 제거
- ✅ 변수/함수명만으로 의도 전달 (주석 보충 X — Robert 권고)
- ✅ 들여쓰기/포맷 일관
- ✅ 객체 생성은 팩토리 함수 (백엔드 ORM 모델로 통일)

## 테스트 (신규)

- ✅ Backend pytest 20개 케이스 통과 (0.57s)
- ✅ Frontend Vitest 7개 케이스 통과 (1.19s)
- ✅ in-memory SQLite 로 테스트 격리 (conftest fixture)

## Git / 제출

- ✅ 기능 단위 커밋 (8개 + 테스트 추가 커밋)
- ✅ 커밋 메시지 한국어 동사 시작
- ✅ docs/ 통째로 푸시 (Robert 권고)
- ✅ AGENTS.md + CLAUDE.md 푸시
- ✅ README.md 작성
- ✅ trouble_shooting.md 6건 실제 기록 (양식만 두지 않음)
- ☐ Issue 회고 7개 섹션 (공식 템플릿)
- ☐ LXP 에 Issue URL 제출
