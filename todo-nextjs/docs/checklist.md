# 마이그레이션 후 점검 체크리스트

> 진미나 회고 패턴. 각 기능 완성 후 체크.

## 백엔드 (FastAPI)

- [ ] `localhost:8000/docs` Swagger UI 정상
- [ ] GET /todos 빈 배열 반환
- [ ] POST /todos 새 항목 생성 + id 반환
- [ ] GET /todos 생성한 항목 포함
- [ ] PUT /todos/{id} 수정 반영
- [ ] DELETE /todos/{id} 204 + 목록에서 제거
- [ ] 존재하지 않는 id PUT/DELETE 시 404
- [ ] todos.db 파일 backend/ 에 생성
- [ ] CORS 가 FRONTEND_URL 환경변수 기반
- [ ] 가상환경 (.venv) 활성화 상태에서 실행

## 프론트엔드 (Next.js)

- [ ] `localhost:3000` 기본 화면
- [ ] `/` 접속 시 `/todos` 리다이렉트
- [ ] `/todos` 목록 표시
- [ ] `/todos/new` 생성 페이지
- [ ] `/todos/[todoId]` 수정 페이지 (존재하는 id)
- [ ] `/todos/[todoId]` 존재하지 않는 id 시 error.tsx
- [ ] loading.tsx Streaming 동작
- [ ] 생성 후 목록 자동 갱신 (revalidatePath)
- [ ] 수정 후 목록 자동 갱신
- [ ] 삭제 후 목록 자동 갱신

## TypeScript / 타입 정합성

- [ ] `lib/types.ts` 와 `backend/schemas.py` 필드 1:1 일치
- [ ] axios 호출 시 제네릭 명시 (`axios.get<Todo[]>`)
- [ ] strict: true 에서 컴파일 통과
- [ ] any 사용 0

## React 패턴

- [ ] Server / Client Component 구분 명확
- [ ] "use client" 가 필요한 곳에만
- [ ] map 의 key 가 todo.id
- [ ] 이벤트 핸들러 `onClick={() => fn()}` 패턴
- [ ] useEffect 의존성 배열 명시
- [ ] **TodoItem 에 `e.nativeEvent.isComposing` 체크** (Ian 2차 피드백)
- [ ] **React.memo + useCallback 으로 재렌더 최적화** (Ian 2차 피드백)

## URL 파라미터 (도전 미션)

- [ ] `?filter=active` 클릭 시 URL 변경
- [ ] URL 직접 입력 시 해당 필터 적용
- [ ] 새로고침 후 필터 유지
- [ ] `?search=키워드` 필터링
- [ ] `?filter=active&search=...` 조합 동작
- [ ] `useSearchParams` Suspense boundary

## 환경변수

- [ ] `.env.local` 이 `.gitignore` 에 포함
- [ ] 코드 내 `http://localhost:8000` 하드코딩 0
- [ ] `NEXT_PUBLIC_` 접두사 의도적 사용
- [ ] 환경변수 변경 후 dev 서버 재시작

## 코드 품질

- [ ] 불필요한 `console.log` 제거
- [ ] 사용 안 하는 import 제거
- [ ] 변수/함수명만으로 의도 전달 (주석 보충 X — Robert 권고)
- [ ] 들여쓰기/포맷 일관
- [ ] 객체 생성은 팩토리 함수

## Git / 제출

- [ ] 기능 단위 커밋
- [ ] 커밋 메시지 한국어 동사 시작
- [ ] docs/ 통째로 푸시 (Robert 권고)
- [ ] AGENTS.md + CLAUDE.md 푸시
- [ ] README.md 작성
- [ ] Issue 회고 7개 섹션 (공식 템플릿)
- [ ] LXP 에 Issue URL 제출
