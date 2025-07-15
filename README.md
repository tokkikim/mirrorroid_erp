# Mirrorroid ERP System

A modern, comprehensive Enterprise Resource Planning (ERP) system built with Next.js, React, and Supabase. This application provides essential business management tools for sales, purchasing, and inventory management.

## 🚀 Features

- **Dashboard** - Real-time business overview and analytics
- **Sales Management** - Complete sales order processing and customer management
- **Purchase Management** - Vendor management and purchase order processing
- **Inventory Management** - Stock tracking and inventory control
- **Responsive Design** - Works seamlessly on desktop and mobile devices

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Backend**: Supabase (Database & Authentication)
- **Styling**: Tailwind CSS
- **UI Components**: Lucide React Icons
- **Charts**: Recharts
- **Form Handling**: React Hook Form
- **Notifications**: React Hot Toast
- **Date Handling**: date-fns

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager
- Supabase account and project

## 🔧 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd mirrorroid-erp
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory and add your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔨 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 📁 Project Structure

```
src/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── Dashboard.tsx
│   ├── SalesManagement.tsx
│   ├── PurchaseManagement.tsx
│   ├── InventoryManagement.tsx
│   ├── Layout.tsx
│   └── ui/
├── lib/
└── types/
```

## 🚀 Deployment

This application can be deployed on platforms like Vercel, Netlify, or any platform that supports Next.js applications.

For Vercel deployment:
```bash
npm run build
```

## 📄 License

This project is private and proprietary.

## 🤝 Contributing

For contributing guidelines, please contact the development team.
