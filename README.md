# Mirrorroid ERP System

> 한국 국세청 API 연동을 통한 매출/매입 관리 및 재고 관리 시스템

## 📋 프로젝트 개요

Mirrorroid ERP는 중소기업을 위한 통합 관리 시스템으로, 매출/매입 관리, 재고 관리, 그리고 한국 국세청 API 연동을 통한 세금계산서 자동화 기능을 제공합니다.

### 🎯 핵심 기능

- **📊 실시간 대시보드**: KPI 모니터링, 차트 분석, 알림 시스템
- **💰 매출 관리**: 세금계산서 발행, 국세청 API 연동, 결제 추적
- **📦 매입 관리**: 공급업체 관리, 자동 세금계산서 확인, 결제 관리
- **📋 재고 관리**: 실시간 재고 추적, 자동 부족 알림, 재고 이동 관리
- **🔔 알림 시스템**: 마감일 알림, 재고 부족 알림, 미처리 업무 알림

### 🛠️ 기술 스택

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **API Integration**: 한국 국세청 API
- **Deployment**: Vercel

## 🚀 빠른 시작

### 사전 요구사항

- Node.js 18.0 이상
- npm 또는 yarn
- Supabase 계정 (데이터베이스 연동 시)

### 설치 및 실행

```bash
# 저장소 클론
git clone https://github.com/tokkikim/mirrorroid_erp.git
cd mirrorroid_erp

# 의존성 설치
npm install

# 환경 변수 설정
cp .env.example .env.local
# .env.local 파일에 필요한 환경 변수 설정

# 개발 서버 실행
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

### 환경 변수 설정

```env
# Supabase 설정
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# 국세청 API 설정 (선택사항)
NTS_API_KEY=your_nts_api_key
NTS_API_URL=https://api.nts.go.kr

# 기타 설정
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

## 📁 프로젝트 구조

```
src/
├── app/                    # Next.js 13+ App Router
│   ├── globals.css        # 전역 스타일
│   ├── layout.tsx         # 루트 레이아웃
│   └── page.tsx           # 메인 페이지
├── components/            # React 컴포넌트
│   ├── ui/               # 재사용 가능한 UI 컴포넌트
│   │   ├── Button.tsx
│   │   └── Card.tsx
│   ├── Dashboard.tsx      # 대시보드 컴포넌트
│   ├── SalesManagement.tsx    # 매출 관리
│   ├── PurchaseManagement.tsx # 매입 관리
│   ├── InventoryManagement.tsx # 재고 관리
│   └── Layout.tsx         # 메인 레이아웃
├── lib/                   # 유틸리티 함수
│   └── utils.ts          # 공통 유틸리티
├── types/                 # TypeScript 타입 정의
│   └── index.ts          # 전역 타입 정의
└── hooks/                 # 커스텀 훅
    └── (추후 구현)
```

## 🔧 주요 컴포넌트

### Dashboard
- 실시간 KPI 표시
- 매출/매입 차트
- 긴급 처리 항목 알림

### SalesManagement
- 매출 계산서 목록
- 필터링 및 검색
- 상태별 관리

### PurchaseManagement
- 매입 계산서 목록
- 공급업체 관리
- 국세청 API 연동 상태 확인

### InventoryManagement
- 재고 현황 모니터링
- 재고 부족 알림
- 재고 이동 관리

## 📊 데이터베이스 스키마

### 주요 테이블

```sql
-- 사용자 테이블
users (
  id UUID PRIMARY KEY,
  email VARCHAR UNIQUE,
  name VARCHAR,
  role VARCHAR CHECK (role IN ('admin', 'staff', 'accounting')),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- 매출 계산서 테이블
sales_invoices (
  id UUID PRIMARY KEY,
  invoice_number VARCHAR UNIQUE,
  customer_name VARCHAR,
  customer_business_number VARCHAR,
  total_amount DECIMAL,
  status VARCHAR,
  nts_status VARCHAR,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- 매입 계산서 테이블
purchase_invoices (
  id UUID PRIMARY KEY,
  invoice_number VARCHAR UNIQUE,
  supplier_name VARCHAR,
  supplier_business_number VARCHAR,
  total_amount DECIMAL,
  status VARCHAR,
  nts_status VARCHAR,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- 재고 테이블
inventory_items (
  id UUID PRIMARY KEY,
  product_code VARCHAR UNIQUE,
  product_name VARCHAR,
  category VARCHAR,
  current_stock INTEGER,
  minimum_stock INTEGER,
  unit_price DECIMAL,
  status VARCHAR,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

## 🔌 API 연동

### 국세청 API 연동 기능

1. **세금계산서 발행 확인**
   - 매출 세금계산서 발행 상태 실시간 확인
   - 발행 실패 시 자동 재시도

2. **매입 세금계산서 조회**
   - 공급업체 발행 세금계산서 자동 확인
   - 미수신 계산서 알림

3. **사업자등록번호 검증**
   - 실시간 사업자등록번호 유효성 검사
   - 폐업/휴업 상태 확인

## 🧪 테스트

```bash
# 단위 테스트 실행
npm run test

# E2E 테스트 실행
npm run test:e2e

# 테스트 커버리지 확인
npm run test:coverage
```

## 📦 빌드 및 배포

```bash
# 프로덕션 빌드
npm run build

# 빌드 결과 실행
npm run start

# 정적 내보내기 (선택사항)
npm run export
```

### Vercel 배포

1. Vercel 계정 연결
2. 환경 변수 설정
3. 자동 배포 설정

## 🔒 보안 고려사항

- 모든 API 요청에 인증 토큰 필요
- 사업자등록번호 등 민감 정보 암호화
- SQL 인젝션 방지
- XSS 공격 방지
- CSRF 토큰 구현

## 📈 성능 최적화

- Next.js 이미지 최적화
- 코드 스플리팅
- 메모화 적용
- 가상화 테이블 (대용량 데이터)

## 🤝 기여 방법

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 개발 계획

자세한 개발 계획은 다음 문서를 참고하세요:

- [개발 계획서](docs/DEVELOPMENT_PLAN.md)
- [기술적 개선사항](docs/TECHNICAL_IMPROVEMENTS.md)

## 🐛 알려진 이슈

- 현재 Mock 데이터로 동작 (실제 데이터베이스 연동 필요)
- 국세청 API 연동 로직 구현 필요
- 실시간 알림 시스템 구현 필요

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 👥 팀

- **개발자**: [Your Name]
- **디자이너**: [Designer Name]
- **프로젝트 매니저**: [PM Name]

## 📞 지원

문제가 발생하거나 질문이 있으시면:

- 이슈 트래커: [GitHub Issues](https://github.com/tokkikim/mirrorroid_erp/issues)
- 이메일: support@mirrorroid.com
- 문서: [Wiki](https://github.com/tokkikim/mirrorroid_erp/wiki)

---

**마지막 업데이트**: 2024년 1월  
**버전**: 1.0.0  
**상태**: 개발 중
