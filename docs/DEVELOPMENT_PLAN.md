# Mirrorroid ERP 시스템 개발 계획서

## 📋 현재 상태 분석

### ✅ 완료된 기능
- **기본 UI 프레임워크**: Next.js 14 + TypeScript + Tailwind CSS
- **레이아웃 시스템**: 반응형 사이드바 네비게이션
- **대시보드**: KPI 카드, 차트, 알림 시스템
- **매출 관리**: 기본 리스트 뷰, 필터링, 검색
- **매입 관리**: 기본 리스트 뷰, 필터링, 검색  
- **재고 관리**: 기본 리스트 뷰, 재고 상태 표시
- **UI 컴포넌트**: Card, Button 기본 컴포넌트
- **유틸리티**: 통화 포맷팅, 날짜 포맷팅, 사업자번호 검증
- **타입 정의**: 완전한 TypeScript 인터페이스

### ⚠️ 현재 제한사항
- **Mock 데이터**: 실제 데이터베이스 연결 없음
- **인증 시스템**: 로그인/로그아웃 기능 없음
- **CRUD 작업**: 생성/수정/삭제 기능 미구현
- **국세청 API**: 연동 로직 없음
- **파일 업로드**: 첨부파일 기능 없음
- **알림 시스템**: 실시간 알림 없음
- **보고서**: 인쇄/PDF 생성 없음

## 🎯 1단계: 핵심 기능 구현 (우선순위 높음)

### 1.1 데이터베이스 연동
- **Supabase 설정**
  - [ ] 데이터베이스 스키마 생성
  - [ ] 테이블 생성 (users, sales_invoices, purchase_invoices, inventory_items, stock_movements)
  - [ ] RLS(Row Level Security) 정책 설정
  - [ ] 환경변수 설정

- **API 클라이언트 구현**
  - [ ] `src/lib/supabase.ts` - Supabase 클라이언트 설정
  - [ ] `src/lib/api/` - API 함수들 (CRUD 작업)
  - [ ] React Query 또는 SWR 도입으로 데이터 페칭 최적화

### 1.2 인증 시스템
- **사용자 인증**
  - [ ] 로그인/로그아웃 페이지 (`src/app/login/page.tsx`)
  - [ ] 사용자 세션 관리 (`src/hooks/useAuth.ts`)
  - [ ] 역할 기반 접근 제어 (admin, staff, accounting)
  - [ ] 보호된 라우트 구현

### 1.3 CRUD 작업 구현
- **매출 관리**
  - [ ] 매출 등록 모달 (`src/components/modals/CreateSalesInvoiceModal.tsx`)
  - [ ] 매출 수정 모달 (`src/components/modals/EditSalesInvoiceModal.tsx`)
  - [ ] 매출 상세 뷰 (`src/components/SalesInvoiceDetail.tsx`)
  - [ ] 삭제 확인 모달

- **매입 관리**
  - [ ] 매입 등록 모달 (`src/components/modals/CreatePurchaseInvoiceModal.tsx`)
  - [ ] 매입 수정 모달 (`src/components/modals/EditPurchaseInvoiceModal.tsx`)
  - [ ] 매입 상세 뷰 (`src/components/PurchaseInvoiceDetail.tsx`)

- **재고 관리**
  - [ ] 상품 등록 모달 (`src/components/modals/CreateInventoryItemModal.tsx`)
  - [ ] 재고 이동 모달 (`src/components/modals/StockMovementModal.tsx`)
  - [ ] 재고 조정 기능

### 1.4 폼 검증 및 에러 처리
- **폼 라이브러리 활용**
  - [ ] React Hook Form 완전 통합
  - [ ] Zod 스키마 검증 도입
  - [ ] 실시간 폼 검증
  - [ ] 에러 메시지 표시

## 🔧 2단계: 고급 기능 구현 (우선순위 중간)

### 2.1 국세청 API 연동
- **NTS API 구현**
  - [ ] `src/lib/nts-api.ts` - 국세청 API 클라이언트
  - [ ] 세금계산서 발행 기능
  - [ ] 매입세금계산서 조회 기능
  - [ ] 사업자등록번호 실시간 검증
  - [ ] API 에러 처리 및 재시도 로직

### 2.2 알림 시스템
- **실시간 알림**
  - [ ] `src/components/NotificationCenter.tsx`
  - [ ] 브라우저 알림 권한 요청
  - [ ] 이메일 알림 (선택사항)
  - [ ] 알림 설정 페이지

### 2.3 보고서 시스템
- **리포트 생성**
  - [ ] `src/components/reports/` - 보고서 컴포넌트들
  - [ ] PDF 생성 (react-pdf 또는 jsPDF)
  - [ ] Excel 내보내기 (xlsx)
  - [ ] 인쇄 최적화 스타일

### 2.4 파일 관리
- **첨부파일 시스템**
  - [ ] 파일 업로드 컴포넌트
  - [ ] Supabase Storage 연동
  - [ ] 이미지 미리보기
  - [ ] 파일 다운로드

## 🎨 3단계: UI/UX 개선 (우선순위 낮음)

### 3.1 UI 컴포넌트 확장
- **추가 컴포넌트**
  - [ ] `src/components/ui/Modal.tsx`
  - [ ] `src/components/ui/Table.tsx`
  - [ ] `src/components/ui/Input.tsx`
  - [ ] `src/components/ui/Select.tsx`
  - [ ] `src/components/ui/DatePicker.tsx`
  - [ ] `src/components/ui/Badge.tsx`
  - [ ] `src/components/ui/Pagination.tsx`

### 3.2 반응형 디자인 개선
- **모바일 최적화**
  - [ ] 모바일 네비게이션 개선
  - [ ] 터치 인터페이스 최적화
  - [ ] 테이블 반응형 처리
  - [ ] 모바일 전용 컴포넌트

### 3.3 다크 모드
- **테마 시스템**
  - [ ] 다크/라이트 모드 토글
  - [ ] 테마 컨텍스트 구현
  - [ ] 로컬 스토리지 테마 저장

## 🔍 4단계: 고급 기능 및 최적화

### 4.1 검색 및 필터링 개선
- **고급 검색**
  - [ ] 전체 텍스트 검색 (Supabase FTS)
  - [ ] 다중 필터 조합
  - [ ] 저장된 검색 조건
  - [ ] 검색 히스토리

### 4.2 성능 최적화
- **성능 개선**
  - [ ] React.memo 적용
  - [ ] 가상화 테이블 (react-window)
  - [ ] 이미지 최적화
  - [ ] 코드 스플리팅 확장

### 4.3 접근성 개선
- **웹 접근성**
  - [ ] 키보드 네비게이션
  - [ ] 스크린 리더 지원
  - [ ] 색상 대비 개선
  - [ ] ARIA 레이블 추가

## 📊 5단계: 분석 및 모니터링

### 5.1 대시보드 고도화
- **고급 분석**
  - [ ] 실시간 데이터 업데이트
  - [ ] 사용자 정의 대시보드
  - [ ] 드릴다운 차트
  - [ ] 예측 분석

### 5.2 감사 로그
- **사용자 활동 추적**
  - [ ] 모든 CRUD 작업 로깅
  - [ ] 사용자 접근 로그
  - [ ] 시스템 이벤트 추적
  - [ ] 로그 검색 및 필터링

## 🧪 6단계: 테스트 및 배포

### 6.1 테스트 구현
- **테스트 전략**
  - [ ] Jest + React Testing Library 설정
  - [ ] 단위 테스트 작성
  - [ ] 통합 테스트 구현
  - [ ] E2E 테스트 (Playwright)

### 6.2 배포 및 CI/CD
- **배포 파이프라인**
  - [ ] Vercel 배포 설정
  - [ ] GitHub Actions CI/CD
  - [ ] 환경별 배포 (dev, staging, prod)
  - [ ] 자동 백업 시스템

## 📅 개발 일정 (예상)

### Phase 1: 핵심 기능 (4-6주)
- Week 1-2: 데이터베이스 연동 및 인증
- Week 3-4: CRUD 작업 구현
- Week 5-6: 폼 검증 및 에러 처리

### Phase 2: 고급 기능 (3-4주)
- Week 7-8: 국세청 API 연동
- Week 9-10: 알림 및 보고서 시스템

### Phase 3: UI/UX 개선 (2-3주)
- Week 11-12: UI 컴포넌트 확장
- Week 13: 반응형 및 다크 모드

### Phase 4: 최적화 및 고급 기능 (2-3주)
- Week 14-15: 성능 최적화
- Week 16: 접근성 개선

### Phase 5: 분석 및 모니터링 (1-2주)
- Week 17: 대시보드 고도화
- Week 18: 감사 로그 구현

### Phase 6: 테스트 및 배포 (1-2주)
- Week 19: 테스트 구현
- Week 20: 배포 및 CI/CD

## 🛠️ 기술 스택 확장 계획

### 추가 예정 라이브러리
- **상태 관리**: Zustand 또는 Redux Toolkit
- **폼 관리**: React Hook Form + Zod
- **데이터 페칭**: React Query 또는 SWR
- **차트**: Recharts 확장 또는 Chart.js
- **PDF 생성**: react-pdf 또는 jsPDF
- **파일 업로드**: react-dropzone
- **날짜 처리**: date-fns 확장
- **테스트**: Jest + React Testing Library + Playwright

### 개발 도구
- **코드 품질**: ESLint + Prettier + Husky
- **타입 체크**: TypeScript strict mode
- **번들 분석**: @next/bundle-analyzer
- **성능 모니터링**: Vercel Analytics

## 📝 주요 고려사항

### 보안
- [ ] 입력 데이터 검증 강화
- [ ] SQL 인젝션 방지
- [ ] XSS 공격 방지
- [ ] CSRF 토큰 구현
- [ ] 민감 데이터 암호화

### 성능
- [ ] 데이터베이스 쿼리 최적화
- [ ] 이미지 최적화
- [ ] 캐싱 전략 수립
- [ ] 번들 크기 최적화

### 사용자 경험
- [ ] 로딩 상태 표시
- [ ] 에러 메시지 개선
- [ ] 키보드 단축키
- [ ] 오프라인 지원 (PWA)

### 확장성
- [ ] 마이크로서비스 아키텍처 고려
- [ ] API 버전 관리
- [ ] 다국어 지원 준비
- [ ] 멀티 테넌시 고려

---

**마지막 업데이트**: 2024년 1월
**작성자**: 개발팀
**상태**: 계획 수립 완료