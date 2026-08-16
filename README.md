#  Safe Spend

<p align="center">
  <strong>A modern personal finance management application built for real-world use.</strong>
</p>

<p align="center">
  Track your income and expenses, manage multiple currencies, analyze your spending, and keep your finances under control — all in one place.
</p>

<p align="center">
  <a href="https://safe-spend.vercel.app">🚀 Live Demo</a>
  &nbsp;•&nbsp;
  <a href="https://www.anas-attoum.com/en/projects/safe-spend">🌐 Portfolio</a>
</p>

---

## ✨ Overview

**Safe Spend** is a modern personal finance management web application designed to make tracking and understanding your finances simple.

Instead of being just a basic expense tracker, Safe Spend combines **transaction management, categorization, multi-currency support, currency conversion, financial analytics, exchange rates, and gold prices** into one application.

The project was built with a focus on:

* 🎯 Clean and intuitive user experience
* 🔐 Secure authentication
* 📊 Meaningful financial analytics
* 🌍 Multi-currency financial management
* 📱 Responsive and installable experience
* 🧩 Scalable and maintainable architecture

---

## 🚀 Features

### 💳 Income & Expense Management

Create and manage your financial transactions with dedicated categories.

* Add income
* Add expenses
* Edit existing transactions
* Delete transactions
* Categorize transactions
* Track transaction dates
* Manage transaction currencies

### 📊 Financial Analytics

Understand where your money goes through visual representations of your financial data.

* Income overview
* Expense overview
* Category-based analysis
* Spending trends
* Interactive charts

### 🌍 Multi-Currency Support

Safe Spend is designed for users who deal with multiple currencies.

* Store transactions in different currencies
* Convert between currencies
* Display financial information using exchange rates
* Support financial tracking across different currencies

### 💱 Exchange Rates

The application provides current exchange-rate information, including rates against the **Syrian Pound (SYP)**.

This makes Safe Spend particularly useful for users who manage finances across different currencies.

### 🪙 Gold Prices

Safe Spend also provides current gold-price information directly inside the application.

This gives users an additional financial reference point alongside currency exchange rates.

### 🔐 Authentication

User accounts are securely managed through **Clerk**, allowing each user to access their own financial data.

### 📱 Progressive Web App

Safe Spend is built as a **PWA**, allowing the application to provide an app-like experience on supported devices.

---

## 🛠️ Tech Stack

| Technology               | Purpose                                |
| ------------------------ | -------------------------------------- |
| **Next.js**              | Full-stack React framework             |
| **TypeScript**           | Type-safe development                  |
| **Tailwind CSS**         | Styling and responsive UI              |
| **Prisma ORM**           | Database access and type-safe queries  |
| **Neon Database**        | Serverless PostgreSQL database         |
| **Clerk**                | Authentication and user management     |
| **React Hook Form**      | Form management                        |
| **Zod**                  | Schema validation                      |
| **TanStack React Query** | Server-state management                |
| **shadcn/ui**            | Reusable UI components                 |
| **Recharts**             | Data visualization                     |
| **next-themes**          | Theme management                       |
| **PWA**                  | Installable web application experience |

---

## 🏗️ Architecture

Safe Spend follows a modern full-stack architecture built around the Next.js App Router.

```text
┌──────────────────────────────────────┐
│              Client                  │
│                                      │
│  React + Next.js + TypeScript        │
│  Tailwind CSS + shadcn/ui            │
│  React Hook Form + Zod               │
└──────────────────┬───────────────────┘
                   │
                   ▼
┌──────────────────────────────────────┐
│          Application Layer           │
│                                      │
│         Next.js App Router           │
│         Server Components            │
│         Server-side logic            │
│        API / data operations         │
└──────────────────┬───────────────────┘
                   │
          ┌────────┴────────┐
          ▼                 ▼
┌─────────────────┐  ┌─────────────────┐
│     Prisma      │  │     External    │
│      ORM        │  │      Data       │
└────────┬────────┘  └─────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│          Neon PostgreSQL             │
└──────────────────────────────────────┘
```

---

## 📈 Data Visualization

Financial data is presented through interactive charts using **Recharts**.

The goal is not simply to show numbers, but to make financial patterns easier to understand at a glance.

Examples include:

* Expense distribution
* Income vs. expenses
* Category analysis
* Financial trends

---

## 🎨 User Experience

The interface was designed with simplicity and usability in mind.

### Design principles

* Minimal visual clutter
* Clear financial information
* Responsive layouts
* Reusable components
* Consistent UI patterns
* Light / dark theme support
* Mobile-friendly experience

---

## 🔒 Authentication & Data

Safe Spend uses **Clerk** for authentication and **Prisma + Neon PostgreSQL** for persistent application data.

The architecture separates user-specific financial information and application-level data to provide a scalable foundation for future features.

---

## 📱 Responsive & PWA

Safe Spend is designed to work across different screen sizes:

```text
  Desktop       Tablet      Mobile
┌─────────┐   ┌────────┐   ┌────┐
│         │   │        │   │    │
│Dashboard│   │  Dash  │   │Dash│
│         │   │        │   │    │
└─────────┘   └────────┘   └────┘
```

As a Progressive Web App, Safe Spend can also provide an app-like experience without requiring a traditional native mobile application.

---


## 🧠 Why Safe Spend?

Many personal finance applications focus only on recording transactions.

Safe Spend takes a broader approach:

> **Record → Understand → Analyze → Make better financial decisions**

The application combines everyday expense tracking with financial information such as exchange rates and gold prices, making it particularly useful in environments where users frequently deal with multiple currencies.

---

## 🔮 Future Improvements

Possible future improvements include:

* 📅 Advanced financial reports
* 📤 Export transactions to CSV / PDF
* 🔔 Budget and spending notifications
* 🎯 Monthly spending limits
* 💰 Savings goals
* 📊 More advanced analytics
* 🔄 Automated recurring transactions
* 📱 Improved mobile experience
* 🌐 Additional currencies and financial data sources

---

## 🌐 Links

* 🚀 **Live Demo:** https://safe-spend.vercel.app
* 🌐 **Portfolio:** https://www.anas-attoum.com/en/projects/safe-spend

---

## 👨‍💻 Author

**Anas Attoum**

Built with ❤️ using modern web technologies.

---

<p align="center">
  <strong>Safe Spend</strong>
  <br />
  Take control of your finances.
</p>
