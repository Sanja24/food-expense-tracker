# Daily Food Expense Tracker (DSK & HSK) 🍲

A mobile-first daily food expense and payment tracking application built for **Dineth Sandeepa (DSK)** and **Heshan Sanjeewa (HSK)**.

Designed for seamless expense sharing with **zero backend required**—all state is persisted automatically in browser `LocalStorage`, with one-click CSV export/import and automated GitHub Actions deployment.

Synchronized with the [Shared Food Expense Google Sheet](https://docs.google.com/spreadsheets/d/1X1uqgoVtgnia4sPfgL8M9wkt8M4wTWVP5lL-_J5SafA/edit?usp=sharing).

---

## 🍽️ Meal Pricing & Sharing Model

| Meal | Full Base Rate | Shared (50/50 Split) | Separate (Two Meals) |
| :--- | :--- | :--- | :--- |
| **Breakfast** (Morning) | **Rs 250.00** | **Rs 125.00** each | **Rs 250.00** each |
| **Lunch** (Day) | **Rs 350.00** | **Rs 175.00** each | **Rs 350.00** each |
| **Dinner** (Night) | **Rs 350.00** | **Rs 175.00** each | **Rs 350.00** each |

### Supported Daily Scenarios:
- **Shared Meals:** When both share a single meal dish/packet, each person contributes half (e.g., Breakfast: Rs 125 each).
- **Separate Meals:** When both take separate full meals, each incurs the full meal price (e.g., Lunch: Rs 350 each).
- **Individual Eaters:** If only DSK or only HSK eats, the eater incurs the full price while the other incurs Rs 0.
- **Skipped Meals:** Neither ate (Rs 0 for both).
- **Custom Price Overrides:** Dedicated drawer to specify exact rupee amounts if an extra portion or unusual receipt was purchased.

---

## 🚀 Key Features

### 1. 📊 Interactive Dashboard
- **Individual Food Costs:** Real-time expense tracking for **DSK** and **HSK**.
- **Combined Metrics:** Combined food expenditure and total settled payments.
- **Clear Net Balance Calculation:** Automatically calculates who owes whom and the exact amount needed for complete balance settlement.
- **Monthly Summary Table:** Grouped by month with status badges (`Settled`, `Partial`, `Unpaid`), expandable daily breakdown, and year filters.
- **Expense Distribution Chart:** Visual split ratio showing each roommate's consumption share and payment coverage.

### 2. 📝 Daily Tracker
- **Smart Date Picker:** Defaults to today's date with previous/next day stepping.
- **1-Tap Presets:** Quick buttons for:
  - ✨ *All 3 Meals Shared* (Rs 475 each)
  - 🍽️ *All 3 Meals Separate* (Rs 950 each)
  - 🌅 *Breakfast & Lunch Shared, Dinner Skipped* (Rs 300 each)
- **Meal Selectors:** Dedicated cards for Breakfast, Lunch, and Dinner with 5 quick modes: *Shared*, *Separate*, *DSK Only*, *HSK Only*, and *None*.
- **Manual Payment Logger:** Log cash or bank transfer payments made on any day for DSK or HSK, along with notes.
- **Recent Day Logs:** View and edit past entries with one tap.

### 3. ⚙️ Settings & Data Export/Import
- **Adjust Flat Rates:** Customize default costs for Morning, Day, and Night meals anytime.
- **Export CSV:** One-click backup of all logged daily records in standard CSV format.
- **Import CSV:** Restore or merge historical data from CSV files (supports app backups and Google Sheet format).
- **Google Sheet Historical Seed Data:** One-click pre-load button for verified historical records (September & October 2026).

---

## 🛠️ Tech Stack

- **Framework:** React 19 + Vite 8
- **Styling:** Tailwind CSS v4 (Mobile-First, Dark Glass Theme)
- **Icons:** `lucide-react`
- **Date Handling:** `date-fns`
- **Persistence:** Browser `LocalStorage`
- **CI/CD:** GitHub Actions (Automated build and deployment to GitHub Pages)

---

## 🏃 Running Locally

```bash
cd C:\Users\hesha\.gemini\antigravity\scratch\food-expense-tracker
npm install
npm run dev
```

Visit the local URL shown in your terminal (usually `http://localhost:5173`).

---

## 🌐 Deploying to GitHub Pages

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Food Expense Tracker"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo-name>.git
   git push -u origin main
   ```

2. **Automated Deployment**:
   The included workflow in `.github/workflows/deploy.yml` triggers on every push to `main` and deploys automatically to `gh-pages`.
