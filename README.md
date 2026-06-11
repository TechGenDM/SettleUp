# SettleUP - Premium Finance Platform

A world-class expense splitting and debt minimization platform.

## Accessibility Compliance

The "SettleUP" platform is built with a commitment to accessibility (WCAG 2.2 AA standards).

- **Keyboard Navigation**: All interactive elements (buttons, inputs, group cards) are fully accessible via `Tab` and include clear visual focus indicators.
- **Color Contrast**: All text and interactive elements maintain a contrast ratio of at least 4.5:1 against their backgrounds in both dark and light modes.
- **ARIA Labels**: Interactive components like `ThemeToggle` and `CustomButton` use appropriate ARIA labels for screen reader support.
- **Tabular Numbers**: Financial data uses `tabular-nums` for consistent vertical alignment, aiding readability for users with cognitive or visual impairments.
- **Motion Controls**: All animations are optimized for 60fps and respect `prefers-reduced-motion` settings where applicable.

## Technology Stack

- **React 18+**: Modern functional components with hooks.
- **Tailwind CSS v4**: Utility-first styling with custom theme variables.
- **Framer Motion**: Fluid UI transitions and micro-interactions.
- **Lucide React**: Consistent, high-quality iconography.
- **Firebase**: Secure authentication and real-time database.

## Design System

- **Glassmorphism**: 24px backdrop blur with subtle borders.
- **Bento Grid**: Responsive layout for dashboard and details.
- **Typography**: Inter Variable font for maximum legibility.

---

## 🎯 Problem Statement

Managing shared expenses in groups (trips, roommates, events) often leads to confusion and unnecessary transactions.

People typically:

* forget who paid for what
* struggle to track balances
* make multiple redundant payments

SettleUp solves this by:

* tracking all expenses in a structured way
* calculating exact balances for each user
* minimizing the number of transactions required to settle debts

---

## 🚀 Features

### 🔐 Authentication

* Secure user login & signup using Firebase Authentication
* Protected routes for authorized access

---

### 👥 Group Management

* Create and manage groups
* Add members to groups
* View all groups a user is part of

---

### 💰 Expense Management

* Add expenses with:

  * amount
  * payer
  * participants
  * description
* Real-time updates using Firestore

---

### 📊 Balance Calculation Engine

* Automatically computes how much each user owes or should receive
* Handles multiple expenses and participants

---

### 🔥 Debt Simplification (Core Feature)

* Minimizes the number of transactions required to settle balances
* Uses a greedy algorithm to match largest debtor with largest creditor

Example:

Before:
A → B ₹100
B → C ₹100

After:
A → C ₹100

---

## 🧠 How It Works

### Step 1: Expense Tracking

All expenses are stored in Firestore under:

```
groups/{groupId}/expenses
```

---

### Step 2: Balance Calculation

* Each expense is split equally
* Net balance is computed per user

---

### Step 3: Debt Simplification

* Users are divided into:

  * creditors (positive balance)
  * debtors (negative balance)
* Largest debtor is matched with largest creditor
* Transactions are generated until all balances become zero

---

## 🏗️ Tech Stack

* **Frontend:** React (Vite)
* **State Management:** Context API
* **Backend:** Firebase

  * Authentication
  * Firestore Database
* **Routing:** React Router
* **Styling:** Tailwind CSS

---

## 📁 Project Structure

```
/src
  /components
  /pages
  /context
  /services
  /hooks
  /utils
```

---

## ⚛️ Key React Concepts Used

* Functional Components
* useState, useEffect
* Context API (global state)
* Custom Hooks (useGroups, useExpenses)
* useMemo (performance optimization)
* Controlled Components
* Routing (React Router)

---

## 📦 Installation & Setup

```bash
git clone https://github.com/your-username/settleup.git
cd settleup
npm install
npm run dev
```

---

### 🔑 Environment Variables

Create a `.env` file and add your Firebase config:

```
VITE_API_KEY=your_key
VITE_AUTH_DOMAIN=your_domain
VITE_PROJECT_ID=your_project_id
```

---

## 🧪 Future Improvements

* Split by percentage or custom amounts
* Group invitations via email
* Expense categories & analytics
* Mobile responsiveness improvements

---

## 🎥 Demo

> Add your demo video link here

---

## 🌐 Live Deployment

> Add your deployed link (Vercel / Netlify)

---

## 🧑‍💻 Author

**Your Name**

---

## 💡 Final Note

This project focuses on solving a real-world problem using clean architecture and efficient algorithms, rather than just building UI.

It demonstrates:

* system design thinking
* optimization techniques
* real-world problem solving

---
