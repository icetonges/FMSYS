# DAI Blueprint Verification Notes

## Verification scope

This pass validates the DAI page as a representative public-information architecture model for Defense Agencies Initiative financial accounting. It is not an official DAI configuration baseline, system security boundary, data dictionary, or audit assertion package.

## Source-backed model decisions

- Oracle procurement flow: DAI procure-to-pay should be modeled as requisition demand, purchase order or agreement creation, supplier/contract support, approval, receipt/acceptance, invoice, AP, and payment-ready activity. Oracle Purchasing documentation describes requisition demand, orders/agreements, supplier information, approval routing, and purchasing document defaults.
- Oracle accounting flow: DAI accounting should flow through subledger accounting events before GL reporting. Oracle Subledger Accounting documentation describes accounting events with financial impact, such as Payables invoices, and how events create subledger journal entries that link originating transactions to accounting entries.
- Oracle SLA setup and reconciliation: DAI should emphasize accounting methods, journal line definitions, account derivation rules, supporting references, and ledger/accounting-flexfield structures. Oracle documentation describes these as the core controls for subledger journal creation and reconciliation support.
- Federal reporting flow: DAI output should trace to USSGL, adjusted trial balance, GTAS, DDRS/Treasury reporting, statement crosswalks, and notes. Treasury describes GTAS as the system agencies use to provide proprietary financial reporting and budget execution information, and describes USSGL as uniform chart-of-accounts and technical guidance for standardizing federal agency accounting.
- Intragovernmental flow: DAI reimbursables should include G-Invoicing/IPAC trading-partner and settlement logic. Treasury describes IPAC as standardized fund transfer between federal trading partners and maintains G-Invoicing/IPAC specifications and validation materials.

## Changes made

- Renamed the DAI capability layer to `DAI Oracle EBS / Federal Financial Capabilities`.
- Refined business-process labels:
  - Budget-to-Report / Budgetary Control
  - Procure-to-Pay
  - Project Costing / Cost Accounting
  - Order-to-Cash / Reimbursables
  - Acquire-to-Retire / Fixed Assets
- Expanded SLA and GL descriptions to include event classes, accounting methods, journal line definitions, account derivation rules, supporting references, subledger transfer, and drillback risk.
- Expanded DAI lineage scenarios to reflect real process chains:
  - Award -> PO -> Receipt -> Invoice -> Payment
  - Travel Authorization -> Voucher -> Outlay
  - Agreement -> Billing -> Collection -> Trading Partner Reporting
  - Payroll Source -> Project Cost -> Net Cost
  - Source Asset Event -> Capitalization -> Depreciation -> Statement Support
- Updated the static DAI SVG reference to match the corrected business process labels.
- Replaced weak placeholder links with Oracle and Treasury process/reporting references.

## Remaining caveats

- Public DAI-specific implementation detail is limited. The blueprint therefore uses Oracle EBS/Federal Financials process patterns plus federal reporting requirements instead of claiming exact DAI table names, responsibilities, workflows, or agency configuration.
- Supported agencies can have different interfaces, ledgers, projects, accounting strings, reporting extracts, and source systems.
- Payroll, travel, and disbursing may be source/shared-service-driven in practice; the blueprint models DAI accounting, reconciliation, and reporting impact rather than claiming DAI is the authoritative source for every upstream event.
