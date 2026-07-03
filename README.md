# GFEBS / SAP-Based Financial Management Architecture Blueprint

Interactive Next.js blueprint for explaining GFEBS financial-management architecture, DoD audit readiness, and Universe of Transactions traceability.

## What is included

- Clickable architecture cards across six layers:
  1. Source / Feeder / Peer Systems
  2. GFEBS Business Process Areas
  3. Detailed Transaction Objects / Subsidiary Ledgers
  4. Accounting Layer
  5. Reporting & External Layer
  6. DoD Financial Statements
- Scenario lineage explorer:
  - DTS Travel
  - Procure-to-Pay
  - Reimbursables
  - PP&E Asset
  - Payroll Cost
- Search and layer filters
- Audit lens for common UoT exception tests
- Static blueprint reference image under `/public/gfebs-blueprint-reference.png`

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Deploy on Vercel through GitHub

1. Create a new GitHub repository.
2. Copy this project into the repository root.
3. Commit and push:

```bash
git init
git add .
git commit -m "Add interactive GFEBS blueprint"
git branch -M main
git remote add origin https://github.com/<your-user>/<your-repo>.git
git push -u origin main
```

4. In Vercel, import the GitHub repository.
5. Keep the default Next.js settings unless your organization requires a custom build command.
6. Deploy.

## Suggested customization

- Edit `data/architecture.js` to change nodes, T-code examples, SAP tables, audit questions, or scenarios.
- Edit `app/globals.css` to change colors, layout, spacing, and print behavior.
- Replace `/public/gfebs-blueprint-reference.png` with an updated static diagram if needed.

## Important disclaimer

This project is an educational architecture model. Exact GFEBS tables, T-codes, custom reports, interfaces, and functionality vary by Army configuration, role permissions, release, and modernization state.
