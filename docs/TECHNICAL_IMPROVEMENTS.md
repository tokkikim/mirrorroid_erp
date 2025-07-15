# 기술적 개선사항 및 리팩토링 계획

## 🔍 코드 분석 결과

### 현재 코드 구조 분석
```
src/
├── app/                    # Next.js 13+ App Router
│   ├── globals.css        # 전역 스타일
│   ├── layout.tsx         # 루트 레이아웃
│   └── page.tsx           # 메인 페이지 (단일 페이지 앱)
├── components/            # React 컴포넌트
│   ├── ui/               # 재사용 가능한 UI 컴포넌트
│   └── [feature].tsx    # 기능별 컴포넌트
├── lib/                  # 유틸리티 함수
├── types/                # TypeScript 타입 정의
└── hooks/                # 커스텀 훅 (현재 비어있음)
```

## 🚨 즉시 개선이 필요한 사항

### 1. 코드 구조 개선

#### 1.1 현재 문제점
```typescript
// src/app/page.tsx - 모든 라우팅이 단일 컴포넌트에서 처리됨
export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard')
  
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />
      case 'sales': return <SalesManagement />
      // ...
    }
  }
}
```

#### 1.2 개선 방안
```typescript
// 제안: App Router 활용한 실제 라우팅
src/app/
├── dashboard/page.tsx
├── sales/page.tsx
├── purchase/page.tsx
└── inventory/page.tsx
```

### 2. 상태 관리 개선

#### 2.1 현재 문제점
- 각 컴포넌트에서 로컬 상태로 데이터 관리
- 컴포넌트 간 데이터 공유 어려움
- Mock 데이터가 컴포넌트 내부에 하드코딩

#### 2.2 개선 방안
```typescript
// src/store/useStore.ts - Zustand 활용
import { create } from 'zustand'

interface AppState {
  user: User | null
  salesInvoices: SalesInvoice[]
  purchaseInvoices: PurchaseInvoice[]
  inventoryItems: InventoryItem[]
  
  // Actions
  setUser: (user: User) => void
  addSalesInvoice: (invoice: SalesInvoice) => void
  updateSalesInvoice: (id: string, updates: Partial<SalesInvoice>) => void
  deleteSalesInvoice: (id: string) => void
}

export const useStore = create<AppState>((set) => ({
  // ... implementation
}))
```

### 3. 컴포넌트 구조 개선

#### 3.1 현재 문제점
- 컴포넌트가 너무 크고 복잡함 (200+ 라인)
- 비즈니스 로직과 UI 로직이 혼재
- 재사용성 부족

#### 3.2 개선 방안
```typescript
// 기능별 폴더 구조
src/components/
├── dashboard/
│   ├── DashboardStats.tsx
│   ├── DashboardCharts.tsx
│   ├── UrgentItems.tsx
│   └── index.tsx
├── sales/
│   ├── SalesInvoiceList.tsx
│   ├── SalesInvoiceForm.tsx
│   ├── SalesInvoiceDetail.tsx
│   └── index.tsx
└── shared/
    ├── SearchBar.tsx
    ├── FilterPanel.tsx
    └── DataTable.tsx
```

### 4. 타입 안전성 개선

#### 4.1 현재 문제점
```typescript
// 타입이 너무 관대함
const [filterStatus, setFilterStatus] = useState<string>('all')

// 하드코딩된 상태 값들
const statusColors = {
  draft: 'bg-gray-100 text-gray-800',
  pending: 'bg-yellow-100 text-yellow-800',
  // ...
}
```

#### 4.2 개선 방안
```typescript
// 더 엄격한 타입 정의
export type InvoiceStatus = 'draft' | 'pending' | 'issued' | 'paid' | 'overdue'
export type FilterStatus = InvoiceStatus | 'all'

// 상수로 관리
export const INVOICE_STATUS_CONFIG: Record<InvoiceStatus, {
  label: string
  color: string
}> = {
  draft: { label: '임시저장', color: 'bg-gray-100 text-gray-800' },
  pending: { label: '승인대기', color: 'bg-yellow-100 text-yellow-800' },
  // ...
}
```

## 🔧 리팩토링 계획

### Phase 1: 기본 구조 개선 (1-2주)

#### 1.1 라우팅 개선
- [ ] App Router 활용한 실제 라우팅 구현
- [ ] 레이아웃 컴포넌트 분리
- [ ] 네비게이션 상태 관리 개선

#### 1.2 컴포넌트 분리
- [ ] 대형 컴포넌트를 작은 단위로 분리
- [ ] 공통 컴포넌트 추출
- [ ] 커스텀 훅 생성

### Phase 2: 상태 관리 개선 (1-2주)

#### 2.1 전역 상태 관리 도입
```typescript
// src/store/slices/salesSlice.ts
export interface SalesState {
  invoices: SalesInvoice[]
  loading: boolean
  error: string | null
  filters: SalesFilters
}

// src/store/slices/authSlice.ts
export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
}
```

#### 2.2 데이터 페칭 로직 분리
```typescript
// src/hooks/useSalesInvoices.ts
export function useSalesInvoices() {
  const { data, error, isLoading } = useQuery({
    queryKey: ['salesInvoices'],
    queryFn: () => api.sales.getAll(),
  })
  
  return {
    invoices: data || [],
    loading: isLoading,
    error,
  }
}
```

### Phase 3: UI/UX 개선 (1-2주)

#### 3.1 디자인 시스템 구축
```typescript
// src/components/ui/design-system.ts
export const colors = {
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
  },
  status: {
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  },
} as const

export const spacing = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
} as const
```

#### 3.2 컴포넌트 라이브러리 확장
- [ ] Modal 컴포넌트
- [ ] Table 컴포넌트 (정렬, 페이징 포함)
- [ ] Form 컴포넌트들
- [ ] Loading 컴포넌트

### Phase 4: 성능 최적화 (1주)

#### 4.1 메모화 적용
```typescript
// 컴포넌트 메모화
export const SalesInvoiceRow = memo(({ invoice, onEdit, onDelete }) => {
  // ...
})

// 계산 결과 메모화
const filteredInvoices = useMemo(() => {
  return invoices.filter(invoice => {
    // filtering logic
  })
}, [invoices, searchTerm, filterStatus])
```

#### 4.2 번들 최적화
- [ ] 동적 임포트 적용
- [ ] 트리 쉐이킹 최적화
- [ ] 이미지 최적화

## 📊 코드 품질 개선

### 1. 린팅 및 포맷팅 강화

#### 1.1 ESLint 설정 개선
```json
// .eslintrc.json
{
  "extends": [
    "next/core-web-vitals",
    "@typescript-eslint/recommended",
    "@typescript-eslint/recommended-requiring-type-checking"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/explicit-function-return-type": "warn",
    "prefer-const": "error",
    "no-var": "error"
  }
}
```

#### 1.2 Prettier 설정
```json
// .prettierrc
{
  "semi": false,
  "trailingComma": "es5",
  "singleQuote": true,
  "tabWidth": 2,
  "printWidth": 80
}
```

### 2. 타입 안전성 강화

#### 2.1 엄격한 TypeScript 설정
```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

#### 2.2 런타임 타입 검증
```typescript
// src/lib/validation.ts
import { z } from 'zod'

export const SalesInvoiceSchema = z.object({
  customer_name: z.string().min(1, '고객명은 필수입니다'),
  customer_business_number: z.string().regex(/^\d{3}-\d{2}-\d{5}$/, '올바른 사업자번호를 입력하세요'),
  total_amount: z.number().positive('금액은 0보다 커야 합니다'),
})
```

### 3. 에러 처리 개선

#### 3.1 에러 바운더리 구현
```typescript
// src/components/ErrorBoundary.tsx
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />
    }
    return this.props.children
  }
}
```

#### 3.2 전역 에러 핸들링
```typescript
// src/lib/errorHandler.ts
export function handleApiError(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  
  if (typeof error === 'string') {
    return error
  }
  
  return '알 수 없는 오류가 발생했습니다'
}
```

## 🧪 테스트 전략

### 1. 단위 테스트
```typescript
// src/lib/__tests__/utils.test.ts
import { formatCurrency, validateBusinessNumber } from '../utils'

describe('Utils', () => {
  describe('formatCurrency', () => {
    it('should format Korean currency correctly', () => {
      expect(formatCurrency(1000000)).toBe('₩1,000,000')
    })
  })

  describe('validateBusinessNumber', () => {
    it('should validate correct business number', () => {
      expect(validateBusinessNumber('123-45-67890')).toBe(true)
    })
  })
})
```

### 2. 컴포넌트 테스트
```typescript
// src/components/__tests__/Dashboard.test.tsx
import { render, screen } from '@testing-library/react'
import { Dashboard } from '../Dashboard'

describe('Dashboard', () => {
  it('should render KPI cards', () => {
    render(<Dashboard />)
    
    expect(screen.getByText('총 매출')).toBeInTheDocument()
    expect(screen.getByText('총 매입')).toBeInTheDocument()
  })
})
```

### 3. E2E 테스트
```typescript
// e2e/sales.spec.ts
import { test, expect } from '@playwright/test'

test('sales invoice creation flow', async ({ page }) => {
  await page.goto('/sales')
  
  await page.click('[data-testid="create-invoice-button"]')
  await page.fill('[data-testid="customer-name"]', '테스트 고객')
  await page.click('[data-testid="save-button"]')
  
  await expect(page.locator('[data-testid="success-message"]')).toBeVisible()
})
```

## 📈 성능 모니터링

### 1. 핵심 지표 추적
- [ ] First Contentful Paint (FCP)
- [ ] Largest Contentful Paint (LCP)
- [ ] Cumulative Layout Shift (CLS)
- [ ] First Input Delay (FID)

### 2. 번들 분석
```bash
# 번들 크기 분석
npm run build:analyze

# 성능 프로파일링
npm run dev:profile
```

## 🔒 보안 개선

### 1. 입력 검증 강화
```typescript
// src/lib/sanitizer.ts
import DOMPurify from 'dompurify'

export function sanitizeInput(input: string): string {
  return DOMPurify.sanitize(input)
}

export function validateInput(input: string, pattern: RegExp): boolean {
  return pattern.test(input)
}
```

### 2. 환경 변수 관리
```typescript
// src/lib/env.ts
const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'NTS_API_KEY',
] as const

export function validateEnv(): void {
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      throw new Error(`Missing required environment variable: ${envVar}`)
    }
  }
}
```

## 📅 구현 우선순위

### 🔴 High Priority (즉시 구현)
1. 컴포넌트 분리 및 구조 개선
2. 타입 안전성 강화
3. 에러 처리 개선
4. 기본 테스트 구현

### 🟡 Medium Priority (1-2주 내)
1. 상태 관리 개선
2. 성능 최적화
3. 디자인 시스템 구축
4. 보안 강화

### 🟢 Low Priority (장기 계획)
1. 고급 테스트 구현
2. 성능 모니터링 시스템
3. 접근성 개선
4. 국제화 준비

---

**마지막 업데이트**: 2024년 1월  
**작성자**: 개발팀  
**검토자**: 시니어 개발자  
**상태**: 리뷰 완료