import { h2, p, list, callout, table, figure } from '../blocks';

const integrationMap = {
  id: 'sapx-modmap',
  cols: 5,
  colWidth: 180,
  colGap: 40,
  rowGap: 60,
  rowLabels: ['Logistics execution: where business events start', 'Subledgers and cost objects', 'Ledgers that the financial statements read'],
  nodes: [
    { id: 'mm', col: 0, row: 0, tone: 'source', title: 'MM purchasing and inventory', lines: ['Requisition, order, goods receipt, invoice verification'] },
    { id: 'sd', col: 1, row: 0, tone: 'source', title: 'SD sales and billing', lines: ['Reimbursable orders, customer orders, billing'] },
    { id: 'pm', col: 2, row: 0, tone: 'source', title: 'PM and PP', lines: ['Maintenance and repair orders, confirmations, parts issues'] },
    { id: 'hr', col: 3, row: 0, tone: 'source', title: 'Time and labor', lines: ['CATS time sheets, payroll interface postings'] },
    { id: 're', col: 4, row: 0, tone: 'source', title: 'RE-FX and asset events', lines: ['Real property, leases, capital projects'] },
    { id: 'ap', col: 0, row: 1, tone: 'detail', title: 'FI-AP', lines: ['Vendor open items, payment run'] },
    { id: 'ar', col: 1, row: 1, tone: 'detail', title: 'FI-AR', lines: ['Customer open items, collections, dunning'] },
    { id: 'co', col: 2, row: 1, tone: 'detail', title: 'CO and PS', lines: ['Cost centers, orders, WBS elements, settlement'] },
    { id: 'aa', col: 4, row: 1, tone: 'detail', title: 'FI-AA', lines: ['Asset master, depreciation, construction in progress'] },
    { id: 'fm', col: 3, row: 1, tone: 'process', title: 'PSM-FM', lines: ['Budget, availability control, commitments, actuals by fund'] },
    { id: 'gl', col: 1, row: 2, span: 2, tone: 'accounting', title: 'FI-GL', lines: ['Proprietary accounts. New G/L ledgers with splitting by fund. Universal Journal in S/4HANA.'] },
    { id: 'bl', col: 3, row: 2, tone: 'accounting', title: 'Budgetary ledger (PSM-FG)', lines: ['USSGL 4000-series entries derived from FM updates'] },
    { id: 'rep', col: 4, row: 2, tone: 'statements', title: 'Federal reporting ledgers', lines: ['Attribute-level balances for Treasury and DDRS'] }
  ],
  edges: [
    { from: 'mm', to: 'ap' }, { from: 'sd', to: 'ar' }, { from: 'pm', to: 'co' },
    { from: 'hr', to: 'fm', dashed: true },
    { from: 're', to: 'aa' },
    { from: 'ap', to: 'gl', tx: -180 },
    { from: 'ar', to: 'gl', tx: -110 },
    { from: 'co', to: 'gl', tx: 110, both: true },
    { from: 'fm', to: 'bl' },
    { from: 'gl', to: 'bl', both: true },
    { from: 'bl', to: 'rep' },
    { from: 'aa', to: 'rep', dashed: true }
  ]
};

const aspects = ['Aspect', 'Detail'];
const mod = (caption, rows, note) => table(caption, aspects, rows, note);

export const sapModulesPage = {
  slug: 'sap-modules',
  prefix: 'SM',
  group: 'SAP expert series',
  eyebrow: 'SAP expert series, part 2',
  navTitle: 'SAP Modules in Depth: Master Data, Documents, Tables, Transactions, and Configuration',
  shortTitle: 'SAP Modules',
  blurb: 'Every SAP module a DoD ERP uses, each described the same way: purpose, organizational units, master data, document flow, tables, transactions, key configuration, integration, and audit notes.',
  appliesTo: ['gfebs', 'navy-erp', 'gcss-army', 'lmp', 'dla-ebs'],
  blocks: [
    h2('1. How the modules fit together'),
    p('SAP modules are views over one database. A goods receipt in Materials Management writes a material document, an accounting document, a Funds Management line, and a Controlling line in one update. The module boundaries matter for configuration and authorization. They do not matter for data consistency.'),
    figure('Module integration: which component posts to which ledger', integrationMap, 'Funds Management is updated by every component that carries a fund, funds center, or commitment item. The arrows show the main document flows only.'),
    table('Module scope by DoD SAP system', ['Module', 'GFEBS', 'Navy ERP', 'GCSS-Army', 'LMP', 'DLA EBS'], [
      ['FI General Ledger', 'Core', 'Core', 'Finance component', 'Core', 'Core'],
      ['FI Accounts Payable and Receivable', 'Core', 'Core', 'Limited', 'Core', 'Core'],
      ['FI Asset Accounting', 'Core', 'Core', 'Not the property book', 'Core', 'Used'],
      ['PSM Funds Management and US Federal', 'Core', 'Core', 'Finance component', 'Used', 'Public sector finance added in 2010'],
      ['Controlling', 'Core', 'Core', 'Used', 'Core', 'Core'],
      ['Project System', 'Core', 'Core', 'Limited', 'Core', 'Limited'],
      ['MM Purchasing', 'Core', 'Core', 'Core', 'Core', 'Core, with eProcurement'],
      ['MM Inventory Management', 'Limited', 'Core since the supply release', 'Core', 'Core', 'Core'],
      ['Sales and Distribution', 'Reimbursable orders', 'Core', 'Stock transport and issues', 'Core', 'Core'],
      ['Plant Maintenance', 'Used for real property', 'Used', 'Core', 'Core for depots', 'Limited'],
      ['Production Planning', 'No', 'Limited', 'MRP for shop stock', 'Core for depots and arsenals', 'Planning add-ons'],
      ['Warehouse Management', 'No', 'Used', 'Used at supply support activities', 'Used', 'Distribution handled by a separate DLA system'],
      ['Real Estate', 'Core for real property', 'No', 'No', 'No', 'Real property added in 2009 and 2011'],
      ['Defense Forces and Public Security', 'No', 'No', 'Core', 'No', 'No']
    ], 'Scope labels are this site\'s reading of public program descriptions, DoD IG reports, and public transaction lists. "Core" means the function is central to the program\'s published purpose. Program offices hold the authoritative list.'),

    h2('2. FI General Ledger (FI-GL)'),
    mod('FI-GL module profile', [
      ['Purpose', 'Record every proprietary and, with the federal extension, budgetary posting in balanced documents, and produce the trial balance.'],
      ['Organizational units', 'Company code, chart of accounts, ledger, business area, segment, profit center.'],
      ['Master data', 'G/L account at chart level (`SKA1`) and company code level (`SKB1`). In a DoD system the account number carries the six-digit USSGL account and the four-digit DoD extension.'],
      ['Documents', 'Header `BKPF`, lines `BSEG`. Ledger view in `FAGLFLEXA` (ECC new G/L) or `ACDOCA` (S/4HANA). Parked documents in `VBKPF` and `VBSEG*` until posted.'],
      ['Main tables', '`BKPF`, `BSEG`, `BSIS`, `BSAS`, `FAGLFLEXA`, `FAGLFLEXT`, `GLT0`, `SKA1`, `SKB1`, `T001`, `T003`, `T001B`'],
      ['Main transactions', '`FB50`, `FV50`, `FBV0`, `FB03`, `FB08`, `FBS1`, `F.81`, `F.13`, `FAGLL03`, `FAGLB03`, `FS00`, `OB52`, `FAGLGVTR`'],
      ['Key configuration', 'Document types and number ranges. Posting keys. Field status groups. Tolerance groups. Ledgers and ledger groups. Document splitting characteristics, which in public sector are fund and business area. Open item management. Financial statement versions.'],
      ['Integration', 'Receives automatic postings from MM, SD, AA, HR, and CO real-time integration. Sends every line with an FM account assignment to Funds Management.'],
      ['Special purpose ledger', 'FI-SL holds user-defined ledgers fed from FI. DoD IG reported that GFEBS used Special Ledger 95 for Treasury reporting and added a Z1 ledger in April 2010 for DoD reporting attributes.'],
      ['Audit notes', 'Manual journals are documents whose `AWTYP` is `BKPF` with a manual document type. Parked documents are not in balances. Posting period control in `T001B` is the cutoff control.']
    ]),
    table('Common FI document types and posting keys', ['Code', 'Kind', 'Meaning'], [
      ['SA', 'Document type', 'G/L account document'],
      ['AB', 'Document type', 'Accounting document, used for clearing and transfers'],
      ['KR / KG', 'Document type', 'Vendor invoice / vendor credit memo'],
      ['KZ / ZP', 'Document type', 'Vendor payment / payment run posting'],
      ['DR / DG / DZ', 'Document type', 'Customer invoice / credit memo / payment'],
      ['RE', 'Document type', 'Invoice from logistics invoice verification'],
      ['WE / WA', 'Document type', 'Goods receipt / goods issue'],
      ['RV', 'Document type', 'Billing document transfer from SD'],
      ['AA / AF', 'Document type', 'Asset posting / depreciation posting'],
      ['40 / 50', 'Posting key', 'G/L debit / G/L credit'],
      ['31 / 21', 'Posting key', 'Vendor invoice credit / vendor credit memo debit'],
      ['25 / 35', 'Posting key', 'Vendor outgoing payment debit / vendor incoming payment credit'],
      ['01 / 11', 'Posting key', 'Customer invoice debit / customer credit memo credit'],
      ['15 / 05', 'Posting key', 'Customer incoming payment credit / customer outgoing payment debit'],
      ['70 / 75', 'Posting key', 'Asset debit / asset credit'],
      ['86 / 96', 'Posting key', 'GR/IR clearing debit / credit'],
      ['89 / 99', 'Posting key', 'Stock inward movement debit / stock outward movement credit']
    ], 'These are SAP-delivered values. The GFEBS desktop procedures show program-specific document types as well, such as SB for G/L postings and MP for miscellaneous payments.'),

    h2('3. FI Accounts Payable (FI-AP)'),
    mod('FI-AP module profile', [
      ['Purpose', 'Hold vendor accounts, record invoices and credit memos, and pay them.'],
      ['Master data', 'Vendor master in three segments: general `LFA1`, company code `LFB1`, purchasing `LFM1`. Bank details in `LFBK`. Account group `KTOKK` controls numbering and field status. The reconciliation account in `LFB1-AKONT` is the payables G/L account.'],
      ['Documents', 'Invoices arrive from logistics invoice verification (`MIRO`), direct entry (`FB60`), or interface. Each creates a vendor line in `BSEG` and an open item in `BSIK`. Payment clears it and moves it to `BSAK`.'],
      ['Payment run', '`F110`: parameters, proposal, edit, payment run, payment medium. Results in `REGUH` and `REGUP`. Payment file through the payment medium workbench or a custom extract to the disbursing system.'],
      ['Main tables', '`LFA1`, `LFB1`, `LFBK`, `BSIK`, `BSAK`, `REGUH`, `REGUP`, `PAYR`, `WITH_ITEM`'],
      ['Main transactions', '`XK01` to `XK03`, `FB60`, `FB65`, `F-47`, `F-48`, `F-54`, `F110`, `FBL1N`, `FK10N`, `MRBR`'],
      ['Key configuration', 'Payment methods and house banks (`FBZP`). Terms of payment. Tolerances. Dual control for sensitive vendor fields. Duplicate invoice check on the vendor master.'],
      ['Federal functions', 'Prompt Payment Act due date and interest penalty, fast pay, payment statistical sampling, Treasury confirmation, vendor data from the central contractor registration. See the federal page.'],
      ['Audit notes', 'Payee changes are in `CDHDR` and `CDPOS` under object class `KRED`. One-time vendor payments carry the payee on the document in `BSEC`. Where disbursing is external, the clearing document is posted from a returned file and should carry the Treasury or disbursing voucher reference.']
    ]),

    h2('4. FI Accounts Receivable (FI-AR)'),
    mod('FI-AR module profile', [
      ['Purpose', 'Hold customer accounts, record bills and collections, age and dun receivables.'],
      ['Master data', 'Customer master `KNA1`, `KNB1`, sales data `KNVV`. Federal customers carry a trading partner in `VBUND`.'],
      ['Documents', 'Bills come from SD billing (`VF01`) or direct entry (`FB70`). Open items in `BSID`, cleared items in `BSAD`.'],
      ['Main tables', '`KNA1`, `KNB1`, `BSID`, `BSAD`, `MHNK`, `MHND`'],
      ['Main transactions', '`XD01` to `XD03`, `FB70`, `FB75`, `F-28`, `F-32`, `FBL5N`, `FD10N`, `F150`, `F103`, `F104`, `FINT`'],
      ['Key configuration', 'Dunning procedure, interest calculation, payment terms, tolerance and write-off limits, lockbox or collection file processing.'],
      ['Federal functions', 'IPAC collections, SF 1080 and SF 1081 billing and transfer forms, Treasury Offset Program referral, Treasury Report on Receivables. The GFEBS role map lists custom transactions for the 1080 and 1081 extracts and for the receivables report.'],
      ['Audit notes', 'Reimbursable receivables must tie to unfilled customer orders and earned revenue. Intragovernmental receivables need the trading partner for eliminations. DoD IG found $48.7 billion reported from GFEBS without a trading partner in fiscal year 2010.']
    ]),

    h2('5. FI Asset Accounting (FI-AA)'),
    mod('FI-AA module profile', [
      ['Purpose', 'Hold the fixed asset subledger: acquisition, transfer, retirement, depreciation, and construction in progress.'],
      ['Organizational units', 'Chart of depreciation with depreciation areas. Area 01 normally posts to the general ledger.'],
      ['Master data', 'Asset class `ANKA` sets account determination and default depreciation terms. Asset master `ANLA`, time-dependent data such as cost center and fund in `ANLZ`, depreciation terms in `ANLB`.'],
      ['Documents', 'Asset line items `ANEP` with header `ANEK`. Annual values `ANLC`. Periodic depreciation `ANLP`. Each posting also creates an FI document.'],
      ['Main transactions', '`AS01` to `AS03`, `AW01N`, `ABZON`, `F-90`, `ABUMN`, `ABAVN`, `AIAB`, `AIBU`, `AFAB`, `AJRW`, `AJAB`, `ABST2`'],
      ['Key configuration', 'Account determination (`AO90`). Depreciation keys. Capitalization thresholds through maximum low-value amounts and screen rules. Asset under construction settlement profile. Transaction types `TABWA`.'],
      ['Integration', 'Purchase orders with account assignment category A capitalize directly. Projects and orders settle to assets under construction, then to final assets. Equipment in Plant Maintenance can synchronize with the asset master.'],
      ['Audit notes', 'Existence, completeness, and valuation of General PP&E depend on the asset master agreeing to the accountable property system. DoD IG reported that a GFEBS real property universe differed from the DDRS trial balance by $2.0 billion in acquisition cost at June 30, 2018, and that in-house construction costs were not flowing to project construction-in-progress accounts.']
    ]),

    h2('6. Bank accounting and cash (FI-BL)'),
    mod('FI-BL module profile', [
      ['Purpose', 'House banks, payment media, check register, bank statement processing.'],
      ['Main tables', '`T012`, `T012K`, `BNKA`, `PAYR`, `FEBKO`, `FEBEP`'],
      ['Main transactions', '`FI01` to `FI03`, `FI12`, `FCH1`, `FCHN`, `FF_5`, `FEBAN`'],
      ['Federal difference', 'A federal entity does not hold commercial bank balances for appropriated funds. Cash is Fund Balance with Treasury, USSGL 1010, by Treasury account symbol. The house bank and bank clearing accounts represent the disbursing office and disbursements in transit.'],
      ['Audit notes', 'The reconciliation is to Treasury, not to a bank statement. The GFEBS role map shows a cash balancing activity built on custom DCAS extract and identification transactions and SF 1081 processing.']
    ]),

    h2('7. Funds Management (PSM-FM) and US Federal (PSM-FG)'),
    mod('PSM-FM and PSM-FG module profile', [
      ['Purpose', 'Control and report the use of budget authority by fund, organization, and object, and derive the USSGL budgetary accounts.'],
      ['Organizational units', 'FM area, assigned to company codes and controlling area.'],
      ['Master data', 'Fund `FMFINCODE`, funds center `FMFCTR` in a hierarchy, commitment item `FMCI`, functional area `TFKB`, funded program `FMMEASURE`, budget period, grant. Application of funds in the federal extension.'],
      ['Budget', 'Budget Control System: entry documents `FMBH` and `FMBL`, totals `FMBDT`, availability control ledger `FMAVCT`.'],
      ['Commitments and actuals', 'Commitment line items `FMIOI`, actual line items `FMIFIIT`, totals `FMIT`. Earmarked funds documents `KBLK` and `KBLP`.'],
      ['Main transactions', '`FMBB`, `FMAVCR01`, `FMX1`, `FMY1`, `FMZ1`, `FMRP_RFFMEP1AX`, `FMJ2`, `FM5I`, `FMSA`, `FMCIA`, `FMDERIVE`'],
      ['Key configuration', 'Update profile, which decides when each value type consumes budget. Derivation strategy. Budget categories and types. Availability control tolerance profiles and activity groups. Budgetary ledger account derivation.'],
      ['Integration', 'Updated by purchasing, FI, CO, travel, and payroll postings. Feeds the budgetary ledger and the federal reporting ledgers.'],
      ['Where to read more', 'The [federal accounting page](/knowledge/sap-federal) covers this module in full.']
    ]),

    h2('8. Controlling (CO)'),
    mod('CO module profile', [
      ['Purpose', 'Collect cost by responsibility and by purpose, allocate it, and settle it. In a federal system this supports the Statement of Net Cost and reimbursable pricing.'],
      ['Organizational units', 'Controlling area, assigned to company codes. Operating concern is rarely used in DoD.'],
      ['Master data', 'Cost center `CSKS` in a standard hierarchy. Cost element `CSKA` and `CSKB`: primary elements mirror G/L expense accounts, secondary elements exist only in CO. Activity type `CSLA`. Statistical key figure. Internal order `AUFK`. Groups stored as sets in `SETHEADER`, `SETNODE`, `SETLEAF`.'],
      ['Documents', 'Header `COBK`, line items `COEP`, totals `COSP` for primary and `COSS` for secondary costs. Commitments in `COOI`.'],
      ['Main transactions', '`KS01` to `KS03`, `KO01` to `KO03`, `KA01`, `KL01`, `KB21N`, `KB11N`, `KSU5`, `KSV5`, `KO88`, `KSB1`, `KOB1`, `OKP1`'],
      ['Key configuration', 'Order types and settlement profiles. Allocation cycles `T811C` and `T811S`. Activity prices. Real and statistical account assignment rules. Period lock.'],
      ['Integration', 'Every expense posting needs one real cost object. The cost object usually drives the FM account assignment through `FMZUOB` or derivation rules.'],
      ['DoD specifics', 'The GFEBS role map lists custom cost center attribute tables for unit identification code, table of distribution and allowances, program area, and organization identifiers. That shows how Army force structure is attached to cost centers.'],
      ['Audit notes', 'Secondary allocations move cost without an FI document in classic CO. Reconcile CO to FI with the reconciliation ledger in classic G/L, or real-time integration in the new G/L. In S/4HANA both are in `ACDOCA`.']
    ]),

    h2('9. Project System (PS)'),
    mod('PS module profile', [
      ['Purpose', 'Plan, fund, and track cost for projects: construction, modernization, research, and reimbursable work.'],
      ['Master data', 'Project definition `PROJ`. WBS elements `PRPS` in a hierarchy `PRHI`. Networks and activities for scheduling. System and user status in `JEST`.'],
      ['Documents', 'Costs and commitments post to WBS elements through CO. Project totals in `RPSCO`. Budget in `BPGE` and `BPJA`.'],
      ['Main transactions', '`CJ20N`, `CJ01` to `CJ03`, `CJ30`, `CJ32`, `CJ88`, `CJI3`, `CJI5`, `CN41`'],
      ['Key configuration', 'Project profile, coding mask, status profile, settlement profile, budget profile and availability control, results analysis.'],
      ['DoD specifics', 'GFEBS procedures show the funded program set to the same value as the WBS element, for example `S.0000056`, with the project released and a user status of funded before it can be charged. The budget for it is loaded in `FMBB`.'],
      ['Audit notes', 'Construction in progress sits on WBS elements until settled to an asset under construction and then to a final asset. Late settlement overstates construction in progress and understates depreciation.']
    ]),

    h2('10. MM Purchasing (MM-PUR)'),
    mod('MM-PUR module profile', [
      ['Purpose', 'Record requirements, commitments, obligations, and contract data.'],
      ['Organizational units', 'Purchasing organization, purchasing group, plant.'],
      ['Master data', 'Vendor purchasing data `LFM1`, info records `EINA` and `EINE`, source list `EORD`, material group `T023`, service master.'],
      ['Documents', 'Requisition `EBAN` with account assignment `EBKN`. Purchasing document `EKKO`, `EKPO`, `EKKN`, `EKET`. Category in `EKKO-BSTYP`: F purchase order, K contract, L scheduling agreement, A request for quotation. History `EKBE`.'],
      ['Main transactions', '`ME51N`, `ME54N`, `ME21N`, `ME22N`, `ME23N`, `ME29N`, `ME2N`, `ME2K`, `ME5A`, `ME31K`'],
      ['Key configuration', 'Document types and number ranges. Account assignment categories: K cost center, P project, F order, A asset. Item categories: standard, D service, B limit. Release strategies with classification. Tolerance keys. Field selection.'],
      ['Integration', 'Each account-assigned item updates FM (`FMIOI` value type 50 for requisitions, 51 for orders) and CO commitments (`COOI`). Availability control runs at save.'],
      ['DoD specifics', 'Contracts are written in separate contract writing systems. The award comes back by interface and creates or updates the purchase order. GFEBS procedures show requisition types for the standard procurement system, miscellaneous pay, and outbound MIPRs, with funds certification as a release step in `ME54N` and contract number and line item stored on customer data tabs.'],
      ['Audit notes', 'The purchase order is the obligation record. It must agree with the contract in the contract repository by number, line, amount, and funding citation. Old open items with the delivery-completed or final-invoice indicator unset are deobligation candidates.']
    ]),

    h2('11. MM Inventory Management and valuation (MM-IM)'),
    mod('MM-IM module profile', [
      ['Purpose', 'Record every stock movement by quantity and value.'],
      ['Organizational units', 'Plant, storage location, valuation area, which is normally the plant.'],
      ['Master data', 'Material master by view: basic `MARA`, plant `MARC`, storage location `MARD`, accounting `MBEW`. Batch `MCHA`. Serial numbers linked to equipment.'],
      ['Documents', 'Material document `MKPF` and `MSEG`, or `MATDOC` in S/4HANA. The movement type `BWART` decides quantity and value updates and the account determination.'],
      ['Main transactions', '`MIGO`, `MB51`, `MB52`, `MB5B`, `MMBE`, `MB21`, `MI01` to `MI07`, `MR21`, `MMPV`'],
      ['Key configuration', 'Movement types `T156`. Automatic account determination `OBYC` using valuation class and transaction keys such as BSX stock, WRX GR/IR clearing, GBB offsetting, PRD price difference. Price control: standard or moving average.'],
      ['Integration', 'A valuated movement creates an FI document with `AWTYP` MKPF. Issues to cost centers and orders create CO and FM lines.'],
      ['Audit notes', 'Inventory and operating materials and supplies are valued from `MBEW`. Federal standards call for moving average or historical cost. Standard price with unresolved price differences is a recurring finding. Physical inventory documents `IKPF` and `ISEG` are the count evidence.']
    ]),
    table('Movement types seen most often in logistics-to-finance tracing', ['Movement type', 'Meaning', 'Accounting effect'], [
      ['101 / 102', 'Goods receipt for purchase order / reversal', 'Stock or expense debit, GR/IR clearing credit'],
      ['103 / 105', 'Receipt into blocked stock / release from blocked stock', 'Value posts at 105'],
      ['122', 'Return delivery to vendor', 'Reverses the receipt'],
      ['201 / 202', 'Issue to cost center / reversal', 'Expense debit, stock credit'],
      ['221 / 222', 'Issue to project / reversal', 'Project cost debit, stock credit'],
      ['261 / 262', 'Issue to order / reversal', 'Order cost debit, stock credit'],
      ['301 / 311', 'Transfer plant to plant / storage location to storage location', 'Value moves between plants for 301. No value change for 311.'],
      ['351', 'Goods issue to stock in transit for a stock transport order', 'Stock in transit'],
      ['501', 'Receipt without purchase order', 'Stock debit, offset credit'],
      ['551', 'Scrapping', 'Loss debit, stock credit'],
      ['561', 'Initial entry of stock balances', 'Used at data conversion'],
      ['601', 'Goods issue for delivery', 'Cost of goods sold debit, stock credit'],
      ['701 / 702', 'Physical inventory gain / loss', 'Inventory adjustment']
    ]),

    h2('12. Invoice verification and services (MM-IV, MM-SRV)'),
    mod('Logistics invoice verification and service entry profile', [
      ['Purpose', 'Match the vendor invoice to the order and the receipt, and record acceptance of services.'],
      ['Documents', 'Invoice document `RBKP` and `RSEG`, with an FI document of type RE. Service entry sheet `ESSR` with lines `ESLL`, accepted with a material document.'],
      ['Main transactions', '`MIRO`, `MIR7`, `MIR4`, `MRBR`, `MR8M`, `MR11`, `ML81N`'],
      ['Key configuration', 'Tolerance keys for price, quantity, and date variances. Payment block reasons. GR-based invoice verification flag on the order item. Evaluated receipt settlement.'],
      ['How the match works', 'Receipt debits stock or expense and credits GR/IR clearing. Invoice debits GR/IR clearing and credits the vendor. A balance left on GR/IR clearing is goods received and not invoiced, or invoiced and not received.'],
      ['DoD specifics', 'Invoices and receiving reports usually arrive from the invoicing and acceptance system by interface and post through IDocs or BAPIs. GFEBS procedures show manual `MIGO` with movement type 101 and `MIRO` for locally entered cases.'],
      ['Audit notes', 'Blocked invoices in `RBKP_BLOCKED` and aged GR/IR balances are accrual and cutoff indicators. `MR11` write-offs of GR/IR differences need approval evidence.']
    ]),

    h2('13. Sales and Distribution (SD)'),
    mod('SD module profile', [
      ['Purpose', 'In a working capital fund, sell supplies and services to customers. In a general fund system, manage reimbursable orders and bill for them.'],
      ['Organizational units', 'Sales organization, distribution channel, division, which together form the sales area.'],
      ['Documents', 'Sales order `VBAK` and `VBAP`. Delivery `LIKP` and `LIPS`. Billing `VBRK` and `VBRP`. Document flow `VBFA`. Pricing conditions `KONV`.'],
      ['Main transactions', '`VA01` to `VA03`, `VL01N`, `VL02N`, `VF01`, `VF04`, `VF11`, `DP91`, `DP96`, `VFX3`'],
      ['Key configuration', 'Sales document types, item categories, pricing procedure, account determination `VKOA`, billing types, copy control, dynamic item processor profile for resource-related billing.'],
      ['Reimbursable pattern', 'The customer order is a sales order that carries the customer funding document. Work is charged to a WBS element or order. Resource-related billing (`DP91`, `DP96`) turns the costs into a billing request and then a bill. The bill posts revenue and a receivable or an IPAC collection.'],
      ['DoD specifics', 'GFEBS procedures show sales orders for direct cite and reimbursable work, approval by entering a condition value in `VA02`, a fund for automatic reimbursable authority, and custom reimbursable status reports. Payment methods identify IPAC and SF 1080 collections.'],
      ['Audit notes', 'Unfilled customer orders, USSGL 4221 and 4222, must agree with open sales order values. Revenue must match costs incurred on the linked cost object.']
    ]),

    h2('14. Plant Maintenance and Production (PM, PP)'),
    mod('PM and PP module profile', [
      ['Purpose', 'Maintain equipment and facilities, and run depot repair and manufacturing.'],
      ['Master data', 'Functional location `IFLOT`, equipment `EQUI` with time segments `EQUZ`, bills of material `STKO` and `STPO`, task lists `PLKO` and `PLPO`, work centers `CRHD`, maintenance plans `MPLA` and `MPOS`, measuring points `IMPTT`.'],
      ['Documents', 'Notification `QMEL`. Order `AUFK` with `AFIH` for maintenance or `AFKO` and `AFPO` for production. Operations `AFVC`. Reservations `RESB`. Confirmations `AFRU`.'],
      ['Main transactions', '`IW21`, `IW31`, `IW32`, `IW41`, `IW38`, `IE01` to `IE03`, `IP10`, `CO01`, `CO11N`, `MD04`'],
      ['Key configuration', 'Order types, planning plants, settlement rules, costing variants, activity prices for labor, confirmation parameters, MRP types.'],
      ['Integration', 'Parts issued to an order post movement type 261. Labor confirmations post activity allocation from the work center cost center. The order settles to a cost center, WBS element, asset, or to inventory for repaired items.'],
      ['DoD specifics', 'The public GCSS-Army maintenance transaction reference lists standard PM transactions next to Army custom reports for equipment status and overage reparables, and Defense Forces transactions for equipment and material situation.'],
      ['Audit notes', 'Work in process at depots is order cost not yet settled. Repair cost capitalized to inventory depends on settlement rules and on carcass and reparable pricing.']
    ]),

    h2('15. Real Estate (RE-FX)'),
    mod('RE-FX module profile', [
      ['Purpose', 'Hold real property inventory and contracts: sites, buildings, land, usable spaces, leases, and occupancy agreements.'],
      ['Master data', 'Business entity `VIBDBE`, building `VIBDBU`, land `VIBDPR`, rental object `VIBDRO`, architectural objects `VIBDAO`, measurements `VIBDMEAS`. Business partners in `BUT000`.'],
      ['Documents', 'Contract `VICNCN` with conditions `VICDCOND` and cash flow `VICDCFPAY`. Periodic posting creates FI documents.'],
      ['Main transactions', '`RE80`, `REBDBE`, `REBDBU`, `REBDPR`, `REBDRO`, `RECN`, `REISBE`, `REISCN`'],
      ['DoD specifics', 'The GFEBS role map places real property under RE-FX, with custom transactions to create installations and business partners and to produce the DD Form 1354 transfer and acceptance of real property and the DA Form 337 for disposal. Each real property object links to an asset master for valuation.'],
      ['Audit notes', 'The real property unique identifier, facility number, acquisition cost, and placed-in-service date must be complete and must agree between the RE object, the asset master, and the accountable property system of record.']
    ]),

    h2('16. Time, labor, and personnel (HCM, CATS)'),
    mod('HCM and CATS module profile', [
      ['Purpose', 'Record working time against cost objects. Full SAP payroll is not used for DoD civilian or military pay.'],
      ['Master data', 'Mini personnel master: infotypes 0000, 0001, 0002, 0105 in `PA*` tables. Organizational management objects in `HRP1000` and `HRP1001`.'],
      ['Documents', 'Time sheet records `CATSDB`. Transfers to Controlling create activity allocations. Transfers to PM or PS create confirmations.'],
      ['Main transactions', '`CAT2`, `CAT3`, `CAT7`, `CAT5`, `PA20`, `PA30`'],
      ['DoD specifics', 'Civilian pay is computed in the Defense Civilian Pay System. The ERP receives payroll results by interface and posts expense and liability. Labor distribution to cost objects comes from the time system or from CATS. The GFEBS role map lists a custom payroll interface error transaction.'],
      ['Audit notes', 'Payroll expense in the ledger must reconcile to the payroll system gross-to-net file by pay period. DoD IG counted 148 noncompliant civilian pay postings and 223 noncompliant military pay postings in its 2019 review of GFEBS posting logic.']
    ]),

    h2('17. Defense Forces and Public Security (DFPS)'),
    mod('DFPS industry solution profile', [
      ['Purpose', 'Add military organization and deployment concepts to SAP logistics: force elements, authorized and actual equipment, support relationships, deployed operation with temporary disconnection.'],
      ['Objects', 'Force element as an extension of the organizational unit. Structures for peacetime and operations. Material and equipment situation by force element. Transactions and tables sit in the `/ISDFPS/` namespace.'],
      ['Main transactions', '`/ISDFPS/LSP2` logistical mission support, `/ISDFPS/DISP_EQU_SIT`, `/ISDFPS/DISP_MAT_SIT`, `/ISDFPS/SREL1` support relationships, `/ISDFPS/TOEP2`'],
      ['DoD specifics', 'These transactions appear in the public GCSS-Army maintenance transaction reference, which is direct evidence that GCSS-Army uses the Defense Forces solution.'],
      ['Audit notes', 'Authorized versus on-hand equipment by force element supports existence and completeness testing of general equipment and of operating materials and supplies held by units.']
    ]),

    h2('18. Technical and analytical components'),
    table('Supporting SAP components around the ERP', ['Component', 'Role', 'Where it shows up in DoD programs'], [
      ['Business Warehouse (BW) and BusinessObjects', 'Data warehouse and reporting. Extractors load ERP data to InfoProviders. Queries run in BEx or web reporting.', 'GFEBS training material refers to BEx web reports for Funds Management. The GFEBS role map has steps to upload plan data to SAP BI.'],
      ['Process Integration or Process Orchestration (PI/PO)', 'Message mapping and routing between SAP and other systems.', 'Sits between the ERP and the DoD Global Exchange.'],
      ['Solution Manager', 'Application lifecycle: change control, testing, monitoring.', 'Change evidence for IT general controls.'],
      ['Governance, Risk, and Compliance (GRC)', 'Access risk analysis, emergency access, access requests.', 'Segregation of duties rule sets and firefighter logs.'],
      ['Landscape Transformation Replication Server (SLT)', 'Trigger-based table replication.', 'The Army described SLT-based streaming from GFEBS and GCSS-Army to Advana in 2023.'],
      ['Master Data Governance and ALE distribution', 'Central maintenance and distribution of master data.', 'The Army Enterprise Systems Integration Program provides the master data hub for the Army ERPs.'],
      ['Business Planning and Consolidation or BW Integrated Planning', 'Budget formulation and planning.', 'The GFEBS role map has budget formulation steps with retraction of the approved plan into execution.']
    ])
  ],
  sources: [
    { name: 'GFEBS role to transaction code mapping (public copy)', url: 'https://pdfcoffee.com/role-to-t-code-mapping-pdf-free.html' },
    { name: 'U.S. Army Financial Management School: GFEBS Desktop SOP (public copy)', url: 'https://silo.tips/download/us-army-financial-management-school-gfebs-desktop-sop' },
    { name: 'GCSS-Army Maintenance T-Code Favorites Reference', url: 'https://ordoteststorageaccount.blob.core.windows.net/cohort-website/GCSS-Army%20Maintenance%20T-Code%20Favorites%20Reference.pdf' },
    { name: 'DODIG-2012-066: GFEBS did not provide required financial information', url: 'https://apps.dtic.mil/sti/pdfs/ADA559121.pdf' },
    { name: 'DODIG-2020-035: Followup audit of GFEBS Acquire-to-Retire and Budget-to-Report', url: 'https://media.defense.gov/2019/Dec/02/2002218762/-1/-1/1/DODIG-2020-035.PDF' },
    { name: 'DODIG-2013-057: DLA Enterprise Business System and the USSGL', url: 'https://media.defense.gov/2013/Mar/20/2001712815/-1/-1/1/DODIG-2013-057.pdf' },
    { name: 'SAP Learning: development history of Defense and Security', url: 'https://learning.sap.com/courses/exploring-organizational-flexibility-in-sap-s-4hana-defense-security/describing-the-development-history-of-defense-security' },
    { name: 'Army.mil: GFEBS and GCSS-Army replication pipelines to Advana (Sept 2023)', url: 'https://www.army.mil/article/270109/the_u_s_army_and_dod_chief_digital_and_artificial_intelligence_office_cdao_accelerate_the_speed_and_efficiency_of_data_with_two_data_replication_pipelines' }
  ]
};
