# 에러 케이스 (Error Cases)

> 입력 / 데이터 / 환경 / 풀스택 통신 단의 예외 처리 정리

## 입력 단

| 케이스 | 처리 |
| --- | --- |
| 빈 입력 (공백만) | 생성 안 함 + 안내 메시지 |
| 너무 긴 입력 (1000자 초과) | 백엔드 Pydantic 에서 validation error 반환 + 프론트 안내 |
| 특수문자 / 이모지 | 그대로 저장 (DB UTF-8) |
| 수정 중 빈 값 | 원본 유지 + 수정 모드 종료 |
| ESC | 변경 없이 종료 |
| **한글 IME 조합 중 Enter** (Ian 2차 피드백) | `e.nativeEvent.isComposing` 체크 후 무시 |

## 데이터 단 (백엔드)

| 케이스 | 처리 |
| --- | --- |
| 존재하지 않는 todo id 조회 | FastAPI 404 + 프론트 error.tsx 표시 |
| 동시 수정 (낙관적 동시성) | last-write-wins 로 단순화. 다음 차수에 updatedAt 검사 추가 |
| SQLite 쓰기 충돌 | SQLAlchemy 가 트랜잭션 자동 처리. db.rollback() |
| DB 파일 없음 | Base.metadata.create_all 이 자동 생성 |

## 환경 단

| 케이스 | 처리 |
| --- | --- |
| `.env.local` 누락 | 명확한 에러 메시지 ("BACKEND_URL is required") |
| `NEXT_PUBLIC_` 누락 (Client) | 클라이언트에서 process.env.X 가 undefined |
| 가상환경 미활성화 | (.venv) 표시 확인 안내 |
| 백엔드 서버 꺼짐 | axios 가 ECONNREFUSED → error.tsx 또는 안내 |

## React / Next.js 단

| 케이스 | 처리 |
| --- | --- |
| Server Component 에서 useState 사용 시도 | 컴포넌트에 `"use client"` 추가 |
| Server Component 에서 이벤트 핸들러 prop | Client 로 옮기거나 Server Action 으로 |
| `useSearchParams` Suspense boundary 누락 | `<Suspense fallback={...}>` 로 감싸기 |
| map key 누락 | todo.id 사용 |
| 이벤트 핸들러 즉시 호출 (`onClick={fn()}`) | `onClick={() => fn()}` |
| 객체/함수를 useEffect deps 에 그대로 | 원시값만 deps. useMemo/useCallback 으로 안정화 |

## TypeScript 단

| 케이스 | 처리 |
| --- | --- |
| 프론트 타입과 백엔드 스키마 불일치 | lib/types.ts 와 schemas.py 동기화. checklist 에 점검 항목 |
| axios 응답 any 로 들어옴 | `axios.get<Todo[]>(...)` 제네릭 명시 |
| searchParams 가 undefined | `searchParams?.filter ?? "all"` 폴백 |

## CORS

| 케이스 | 처리 |
| --- | --- |
| Client Component 에서 직접 BACKEND_URL fetch | 반드시 route.ts 또는 Server Action 경유 (CORS 회피) |
| 배포 시 FRONTEND_URL 변경 | backend 환경변수에서 분리 |

## UX 빈 상태

| 케이스 | 처리 |
| --- | --- |
| Todo 0개 | "할 일이 없습니다" 안내 |
| 필터 결과 0개 | "조건에 맞는 할 일이 없습니다" + 현재 필터 명시 |
| 검색 결과 0개 | "검색 결과가 없습니다" |
| 로딩 중 | loading.tsx (Streaming) |
| 에러 발생 | error.tsx + 다시 시도 버튼 |

## AI 가 만든 코드에서 자주 발견되는 함정 (Robert 2차 피드백)

- 함수 안에 setState 호출하면서 "순수함수"라고 주장 → 검수
- 객체 생성 시 createdAt/updatedAt 같은 거 인자로 받음 → 함수 내부 default 로
- 주석으로 동작 설명 → 함수명/구조로 자명하게
- 학습한 적 없는 라이브러리 갑자기 가져옴 → 거부
