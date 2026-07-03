# DoD FM System Architecture Blueprints

Interactive Next.js blueprint suite for explaining DoD financial-management architecture, audit readiness, and Universe of Transactions traceability.

## What is included

- Multi-page navigation:
  - `/` system directory
  - `/systems/gfebs` GFEBS architecture blueprint
  - `/systems/gcss-army` GCSS-Army logistics-to-finance blueprint
  - `/systems/lmp` Logistics Modernization Program blueprint
  - `/systems/gcss-mc` GCSS-MC logistics-to-finance blueprint
  - `/systems/stars` STARS Navy legacy accounting blueprint
  - `/systems/sabrs` Marine Corps SABRS accounting, budgeting, and reporting blueprint
  - `/systems/famis` FAMIS-GF / FAMIS-WCF accounting blueprint
  - `/systems/ddrs` Defense Departmental Reporting System financial reporting blueprint
  - `/systems/navy-erp` Navy ERP architecture blueprint
  - `/systems/dai` Defense Agencies Initiative blueprint
  - `/systems/deams` Defense Enterprise Accounting and Management System blueprint
  - `/systems/gafs` GAFS-BL / GAFS-R legacy Air Force accounting blueprint
  - `/systems/gafs-jv` focused GAFS journal voucher control blueprint
  - `/systems/cefms` Corps of Engineers Financial Management System blueprint
  - `/systems/dla-ebs` Defense Logistics Agency Enterprise Business System blueprint
  - `/systems/abss` Automated Business Services System blueprint
- Shared controls across systems:
  - system navigation tabs
  - system profile cards for what it is, who uses it, how it is used, current status, why it is used, and modeled feeder-system count
  - architecture search
  - layer filters
  - scenario lineage explorer
  - audit lens
  - static reference image toggle
- Navy ERP assets appended from the static V2 build:
  - `/public/navy-erp-blueprint-v2.svg`
  - `/public/navy-erp-blueprint-v2.png`
  - `/public/navy-erp-blueprint-v2-hires.png`
- DAI static reference asset:
  - `/public/dai-blueprint-reference.svg`
- DEAMS static reference asset:
  - `/public/deams-blueprint-reference.svg`
- GAFS static reference asset:
  - `/public/gafs-blueprint-reference.svg`
- CEFMS static reference asset:
  - `/public/cefms-blueprint-reference.svg`
- DLA EBS static reference asset:
  - `/public/dla-ebs-blueprint-reference.svg`
- ABSS static reference asset:
  - `/public/abss-blueprint-reference.svg`
- GCSS static reference asset:
  - `/public/gcss-blueprint-reference.svg`
- LMP static reference asset:
  - `/public/lmp-blueprint-reference.svg`
- STARS static reference asset:
  - `/public/stars-blueprint-reference.svg`
- SABRS static reference asset:
  - `/public/sabrs-blueprint-reference.svg`
- FAMIS static reference asset:
  - `/public/famis-blueprint-reference.svg`
- DDRS static reference asset:
  - `/public/ddrs-blueprint-reference.svg`
- DAI verification notes:
  - `/docs/DAI_BLUEPRINT_VERIFICATION.md`
- Existing GFEBS static reference:
  - `/public/gfebs-blueprint-reference.png`

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Build

```bash
npm run build
```

## Deploy on Vercel through GitHub Actions

The repo includes `.github/workflows/vercel.yml`.

Add these repository secrets in GitHub:

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

The workflow builds pull requests and deploys pushes to `main` when the Vercel secrets are present.

You can also import the repository directly in Vercel and use the default Next.js settings.

## Suggested customization

- Add future DoD FM systems in `data/systems.js`.
- Edit `data/architecture.js` to change the GFEBS nodes, T-code examples, SAP tables, audit questions, or scenarios.
- Edit `app/globals.css` to change colors, layout, spacing, and print behavior.
- Replace or add reference images under `public`.

## Important disclaimer

This project is an educational architecture model. Exact tables, T-codes, custom reports, interfaces, and functionality vary by system configuration, role permissions, release, modernization state, and authoritative program data.
