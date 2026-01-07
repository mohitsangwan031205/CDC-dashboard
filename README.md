# Ecommerce Admin Dashboard

A modern **Ecommerce Admin Dashboard** built with **Next.js App Router**, focused on efficient product management, inventory monitoring, and analytics.  
The application uses secure authentication, server-side rendering, and internal API routing for performance and scalability.

---

## ✨ Features

### 🔐 Admin Authentication
- Secure, cookie-based authentication
- Protected admin routes
## Dummy admin credentials
email id :- admin@dummy.com

password :- 123dummy

### 📊 Dashboard Overview
- Total products count  
- Product categories overview  
- Low stock alerts  

### 📦 Product Management
- Add new products  
- View and manage inventory  

### 📈 Analytics
- Dedicated analytics page for insights  

### ⚙️ Core Capabilities
- Server Components with App Router  
- Dynamic data fetching (no caching)  
- Modern black & yellow UI theme using Tailwind CSS  

---

## 🛠 Tech Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** MongoDB
- **Authentication:** Cookie-based auth
- **Runtime:** Node.js
- **Bundler:** Turbopack

---

## 📂 Project Structure

```text
src/
├── app/
│   ├── api/
│   │   ├── admin/
│   │   │   └── login/
│   │   └── products/
│   ├── analytics/
│   ├── products/
│   ├── page.tsx        # Admin Dashboard
│   └── proxy.ts        # Request interceptor
├── components/
├── lib/
└── styles/

```

## Deployment
https://cdc-dashboard-gamma.vercel.app/
