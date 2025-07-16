# MirrorRoid ERP 개발 로드맵

## 📋 현재 상태 분석 (2024-01-15)

### ✅ 완료된 기능
- [x] 기본 UI 프레임워크 (Next.js 14 + TypeScript + Tailwind CSS)
- [x] 레이아웃 시스템 (반응형 사이드바 네비게이션)
- [x] 대시보드 (KPI 카드, 차트 시스템)
- [x] 매출/매입 관리 (기본 리스트 뷰, 필터링, 검색)
- [x] 재고 관리 (기본 리스트 뷰)
- [x] UI 컴포넌트 (Card, Button 등)
- [x] 유틸리티 함수 (통화 포맷팅, 날짜 포맷팅, 사업자번호 검증)
- [x] 타입 정의 (완전한 TypeScript 인터페이스)
- [x] 상태 관리 (Zustand)
- [x] 폼 검증 (React Hook Form + Zod)

### ⚠️ 현재 제한사항
- **Mock 데이터**: 실제 데이터베이스 연결 없음
- **인증 시스템**: 로그인/로그아웃 기능 없음
- **CRUD 작업**: 생성/수정/삭제 기능 미구현
- **국세청 API**: 연동 로직 없음
- **파일 업로드**: 첨부파일 기능 없음
- **실시간 알림**: 알림 시스템 없음
- **보고서**: PDF/Excel 생성 없음

## 🎯 Phase 1: 핵심 기능 구현 (우선순위 높음) - 4-6주

### 1.1 데이터베이스 연동 (Week 1-2)

#### 1.1.1 Supabase 설정
- [x] 환경변수 설정 (.env.local)
- [x] 데이터베이스 스키마 생성 (타입 정의)
- [ ] RLS(Row Level Security) 정책 설정
- [ ] 테이블 생성:
  - [x] users (사용자) - 타입 정의 완료
  - [x] sales_invoices (매출 계산서) - 타입 정의 완료
  - [x] purchase_invoices (매입 계산서) - 타입 정의 완료
  - [x] inventory_items (재고 상품) - 타입 정의 완료
  - [x] stock_movements (재고 이동) - 타입 정의 완료
  - [x] customers (고객) - 타입 정의 완료
  - [x] suppliers (공급업체) - 타입 정의 완료

#### 1.1.2 API 클라이언트 구현
- [x] `src/lib/supabase.ts` - Supabase 클라이언트 설정
- [x] `src/lib/api/` 디렉토리 생성 및 API 함수들:
  - [x] `src/lib/api/auth.ts` - 인증 API
  - [x] `src/lib/api/sales.ts` - 매출 API
  - [ ] `src/lib/api/purchase.ts` - 매입 API
  - [ ] `src/lib/api/inventory.ts` - 재고 API
  - [ ] `src/lib/api/customers.ts` - 고객 API
  - [ ] `src/lib/api/suppliers.ts` - 공급업체 API

#### 1.1.3 데이터 페칭 최적화
- [x] React Query 설정 및 구성
- [x] 캐시 전략 수립
- [x] 에러 처리 및 재시도 로직

### 1.2 인증 시스템 (Week 2-3)

#### 1.2.1 사용자 인증
- [ ] 로그인 페이지 (`src/app/login/page.tsx`)
- [ ] 회원가입 페이지 (`src/app/signup/page.tsx`)
- [x] 사용자 세션 관리 (`src/hooks/useAuth.ts`)
- [x] 로그아웃 기능
- [x] 비밀번호 재설정 기능

#### 1.2.2 역할 기반 접근 제어
- [ ] 역할 정의 (admin, staff, accounting)
- [ ] 권한 확인 미들웨어
- [ ] 보호된 라우트 구현
- [ ] 컴포넌트 레벨 권한 체크

### 1.3 CRUD 작업 구현 (Week 3-5)

#### 1.3.1 매출 관리
- [ ] 매출 등록 모달 (`src/components/modals/CreateSalesInvoiceModal.tsx`)
- [ ] 매출 수정 모달 (`src/components/modals/EditSalesInvoiceModal.tsx`)
- [ ] 매출 상세 뷰 개선 (실제 데이터 연동)
- [ ] 매출 삭제 기능 (소프트 딜리트)
- [ ] 매출 상태 변경 (임시저장 → 승인대기 → 발행완료)

#### 1.3.2 매입 관리
- [ ] 매입 등록 모달 (`src/components/modals/CreatePurchaseInvoiceModal.tsx`)
- [ ] 매입 수정 모달 (`src/components/modals/EditPurchaseInvoiceModal.tsx`)
- [ ] 매입 상세 뷰 개선
- [ ] 매입 삭제 기능
- [ ] 매입 상태 변경

#### 1.3.3 재고 관리
- [ ] 상품 등록 모달 (`src/components/modals/CreateInventoryItemModal.tsx`)
- [ ] 상품 수정 모달 (`src/components/modals/EditInventoryItemModal.tsx`)
- [ ] 재고 이동 모달 (`src/components/modals/StockMovementModal.tsx`)
- [ ] 재고 조정 기능
- [ ] 재고 히스토리 추적

#### 1.3.4 고객/공급업체 관리
- [ ] 고객 등록/수정 모달
- [ ] 공급업체 등록/수정 모달
- [ ] 고객/공급업체 검색 기능
- [ ] 거래 내역 조회

### 1.4 폼 검증 및 에러 처리 (Week 5-6)

#### 1.4.1 폼 검증 강화
- [ ] Zod 스키마 검증 확장
- [ ] 실시간 폼 검증
- [ ] 에러 메시지 표시 개선
- [ ] 중복 데이터 검증

#### 1.4.2 에러 처리 시스템
- [ ] 전역 에러 핸들러
- [ ] 네트워크 에러 처리
- [ ] 사용자 친화적 에러 메시지
- [ ] 로그인 세션 만료 처리

## 🔧 Phase 2: 고급 기능 구현 (우선순위 중간) - 3-4주

### 2.1 국세청 API 연동 (Week 7-8)
- [ ] NTS API 클라이언트 구현 (`src/lib/nts-api.ts`)
- [ ] 세금계산서 발행 기능
- [ ] 매입세금계산서 조회 기능
- [ ] 사업자등록번호 실시간 검증
- [ ] API 에러 처리 및 재시도 로직

### 2.2 알림 시스템 (Week 9)
- [ ] 알림 센터 컴포넌트 (`src/components/NotificationCenter.tsx`)
- [ ] 실시간 알림 (재고 부족, 결제 마감일 등)
- [ ] 브라우저 알림 권한 요청
- [ ] 알림 설정 페이지

### 2.3 보고서 시스템 (Week 10)
- [ ] 보고서 컴포넌트 (`src/components/reports/`)
- [ ] PDF 생성 기능 (jsPDF)
- [ ] Excel 내보내기 (xlsx)
- [ ] 인쇄 최적화 스타일

## 🎨 Phase 3: UI/UX 개선 (우선순위 낮음) - 2-3주

### 3.1 UI 컴포넌트 확장 (Week 11-12)
- [ ] 고급 UI 컴포넌트:
  - [ ] `src/components/ui/Modal.tsx` 개선
  - [ ] `src/components/ui/Table.tsx` 가상화
  - [ ] `src/components/ui/Input.tsx` 다양한 타입
  - [ ] `src/components/ui/Select.tsx` 검색 기능
  - [ ] `src/components/ui/DatePicker.tsx`
  - [ ] `src/components/ui/Badge.tsx`
  - [ ] `src/components/ui/Pagination.tsx`

### 3.2 반응형 디자인 개선 (Week 13)
- [ ] 모바일 네비게이션 개선
- [ ] 터치 인터페이스 최적화
- [ ] 테이블 반응형 처리
- [ ] 다크 모드 지원

## 🔍 Phase 4: 최적화 및 고급 기능 (2-3주)

### 4.1 성능 최적화 (Week 14-15)
- [ ] React.memo 적용
- [ ] 가상화 테이블 (react-window)
- [ ] 이미지 최적화
- [ ] 코드 스플리팅 확장

### 4.2 고급 검색 기능 (Week 16)
- [ ] 전체 텍스트 검색 (Supabase FTS)
- [ ] 다중 필터 조합
- [ ] 저장된 검색 조건
- [ ] 검색 히스토리

## 📊 Phase 5: 분석 및 모니터링 (1-2주)

### 5.1 대시보드 고도화 (Week 17)
- [ ] 실시간 데이터 업데이트
- [ ] 사용자 정의 대시보드
- [ ] 드릴다운 차트
- [ ] 예측 분석

### 5.2 감사 로그 (Week 18)
- [ ] 사용자 활동 추적
- [ ] 시스템 이벤트 로깅
- [ ] 로그 검색 및 필터링

## 🧪 Phase 6: 테스트 및 배포 (1-2주)

### 6.1 테스트 구현 (Week 19)
- [ ] 단위 테스트 작성
- [ ] 통합 테스트 구현
- [ ] E2E 테스트 (Playwright)

### 6.2 배포 및 CI/CD (Week 20)
- [ ] Vercel 배포 설정
- [ ] GitHub Actions CI/CD
- [ ] 환경별 배포 (dev, staging, prod)

## 📅 즉시 시작할 작업 (우선순위 순서)

### 🚀 1순위: 데이터베이스 연동
1. **환경변수 설정**
2. **Supabase 클라이언트 설정**
3. **데이터베이스 스키마 생성**
4. **API 함수 구현**

### 🔐 2순위: 인증 시스템
1. **로그인/회원가입 페이지**
2. **세션 관리**
3. **보호된 라우트**

### 📝 3순위: CRUD 기능
1. **매출 관리 CRUD**
2. **매입 관리 CRUD**
3. **재고 관리 CRUD**

---

**작성일**: 2024년 1월 15일
**예상 완료**: 2024년 6월 15일 (약 20주)
**다음 업데이트**: 매주 금요일