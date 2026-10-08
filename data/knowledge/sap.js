import { h2, h3, p, list, steps, callout, table, figure } from './blocks';

const architecture = {
  id: 'sap-arch',
  cols: 4,
  colWidth: 215,
  colGap: 46,
  rowGap: 56,
  rowLabels: ['Presentation tier', 'Application tier: one or more AS ABAP instances', 'Central services, database, and landscape'],
  nodes: [
    { id: 'gui', col: 0, row: 0, tone: 'source', title: 'SAP GUI', lines: ['DIAG protocol', 'Transaction codes such as ME21N, FB03, FMRP_RFFMEP1AX'] },
    { id: 'fiori', col: 2, row: 0, tone: 'source', title: 'Fiori launchpad / browser', lines: ['HTTPS and OData services', 'Web Dynpro and BSP pages'] },
    { id: 'ext', col: 3, row: 0, tone: 'source', title: 'External systems', lines: ['RFC, IDoc, SOAP, file drops', 'GEX, PI/PO, DTS, PIEE, DCPS'] },
    { id: 'disp', col: 0, row: 1, tone: 'process', title: 'Dispatcher', lines: ['Queues each request', 'Hands it to a free work process of the right type'] },
    { id: 'wp', col: 1, row: 1, tone: 'process', title: 'Work processes', lines: ['DIA dialog, UPD and UP2 update', 'BGD background, SPO spool', 'Each has a screen processor, ABAP processor, and database interface'] },
    { id: 'icm', col: 2, row: 1, span: 2, tone: 'process', title: 'ICM and RFC gateway', lines: ['Internet Communication Manager serves HTTP(S) and SMTP', 'Gateway serves RFC and tRFC/qRFC calls, including inbound IDocs'] },
    { id: 'ascs', col: 0, row: 2, tone: 'accounting', title: 'ABAP Central Services (ASCS)', lines: ['Message server: logon groups and load balancing', 'Enqueue server: the lock table'] },
    { id: 'buf', col: 1, row: 2, tone: 'accounting', title: 'Shared memory', lines: ['Program, table, and number-range buffers', 'Synchronized across instances'] },
    { id: 'db', col: 2, row: 2, tone: 'statements', title: 'Database', lines: ['ECC 6.0: Oracle, DB2, SQL Server, MaxDB, or HANA', 'S/4HANA: HANA only', 'Every application table is keyed by client (MANDT)'] },
    { id: 'tms', col: 3, row: 2, tone: 'reporting', title: 'Landscape and transports', lines: ['DEV to QAS to PRD', 'Change requests move code and configuration through STMS'] }
  ],
  edges: [
    { from: 'gui', to: 'disp' },
    { from: 'fiori', to: 'icm', tx: -130 },
    { from: 'ext', to: 'icm', tx: 130 },
    { from: 'disp', to: 'wp' },
    { from: 'icm', to: 'wp' },
    { from: 'disp', to: 'ascs', label: 'locks, logon' },
    { from: 'wp', to: 'buf' },
    { from: 'wp', to: 'db', sx: 60, label: 'Open SQL' }
  ]
};

const orgModel = {
  id: 'sap-org',
  cols: 4,
  colWidth: 215,
  colGap: 46,
  rowGap: 58,
  nodes: [
    { id: 'client', col: 1, row: 0, span: 2, tone: 'source', title: 'Client (MANDT)', lines: ['Top of the hierarchy. All master data and documents are stored per client.'] },
    { id: 'cc', col: 0, row: 1, tone: 'accounting', title: 'Company code (BUKRS)', lines: ['Table T001', 'Legal books: one balanced set of accounts', 'Chart of accounts KTOPL, fiscal year variant'] },
    { id: 'ca', col: 1, row: 1, tone: 'detail', title: 'Controlling area (KOKRS)', lines: ['Table TKA01', 'Scope for cost accounting'] },
    { id: 'fm', col: 2, row: 1, tone: 'process', title: 'FM area (FIKRS)', lines: ['Table FM01', 'Scope for budget and funds control'] },
    { id: 'log', col: 3, row: 1, tone: 'reporting', title: 'Logistics units', lines: ['Plant WERKS (T001W)', 'Purchasing org EKORG (T024E)', 'Sales org VKORG (TVKO)'] },
    { id: 'ccobj', col: 0, row: 2, tone: 'accounting', title: 'GL account, business area, profit center', lines: ['SKA1 / SKB1, TGSB, CEPC', 'Segment and ledger (RLDNR) in the new GL'] },
    { id: 'caobj', col: 1, row: 2, tone: 'detail', title: 'Cost objects', lines: ['Cost center CSKS', 'Internal order AUFK', 'WBS element PRPS'] },
    { id: 'fmobj', col: 2, row: 2, tone: 'process', title: 'FM account assignment', lines: ['Fund FMFINCODE', 'Funds center FMFCTR', 'Commitment item FMCI', 'Functional area TFKB', 'Funded program FMMEASURE'] },
    { id: 'logobj', col: 3, row: 2, tone: 'reporting', title: 'Stock and purchasing detail', lines: ['Storage location LGORT (T001L)', 'Purchasing group (T024)', 'Material master MARA, MARC, MARD'] }
  ],
  edges: [
    { from: 'client', to: 'cc' },
    { from: 'client', to: 'ca', sx: -130 },
    { from: 'client', to: 'fm', sx: 130 },
    { from: 'client', to: 'log' },
    { from: 'cc', to: 'ca', label: 'assigned', both: true },
    { from: 'ca', to: 'fm', label: 'assigned', both: true },
    { from: 'cc', to: 'ccobj' },
    { from: 'ca', to: 'caobj' },
    { from: 'fm', to: 'fmobj' },
    { from: 'log', to: 'logobj' }
  ]
};

const financeModel = {
  id: 'sap-fi-fm',
  cols: 4,
  colWidth: 222,
  colGap: 62,
  rowGap: 60,
  rowLabels: ['Financial Accounting (FI)', 'Funds Management actuals and commitments (PSM-FM)', 'FM master data and budget (BCS)'],
  nodes: [
    { id: 'skb1', col: 0, row: 0, kind: 'entity', tone: 'accounting', title: 'SKA1 / SKB1  GL account', lines: ['*KTOPL, SAKNR', '*BUKRS, SAKNR', 'XBILK  balance sheet flag', 'MITKZ  reconciliation type'] },
    { id: 'bkpf', col: 1, row: 0, kind: 'entity', tone: 'accounting', title: 'BKPF  document header', lines: ['*BUKRS, BELNR, GJAHR', 'BLART  document type', 'BUDAT  posting date', 'AWTYP, AWKEY  source object', 'XBLNR  reference', 'USNAM, TCODE, CPUDT'] },
    { id: 'bseg', col: 2, row: 0, kind: 'entity', tone: 'accounting', title: 'BSEG  line item', lines: ['*BUKRS, BELNR, GJAHR, BUZEI', 'BSCHL, SHKZG  key, D/C', 'HKONT  GL account', 'DMBTR, WRBTR  amounts', 'GEBER, FISTL, FIPOS, FKBER', 'KOSTL, AUFNR, PROJK', 'LIFNR, KUNNR, EBELN'] },
    { id: 'ledger', col: 3, row: 0, kind: 'entity', tone: 'accounting', title: 'FAGLFLEXA / ACDOCA', lines: ['*RLDNR, RBUKRS, GJAHR,', '*BELNR / DOCNR, DOCLN', 'RACCT  account', 'HSL  local currency amount', 'RFUND, RFAREA, PRCTR', 'Totals: FAGLFLEXT (ECC)'] },
    { id: 'kblp', col: 0, row: 1, kind: 'entity', tone: 'process', title: 'Commitment sources', lines: ['EBAN / EBKN  requisition', 'EKKO / EKPO / EKKN  order', 'KBLK / KBLP  earmarked funds'] },
    { id: 'fmioi', col: 1, row: 1, kind: 'entity', tone: 'process', title: 'FMIOI  commitment items', lines: ['*REFBN, REFBT, RFORG,', '*RFPOS, RFKNT, RFETE, ...', 'FIKRS, FONDS, FISTL, FIPEX', 'WRTTP  value type (50, 51, 65)', 'FKBTR  FM area amount', 'BTART  amount type'] },
    { id: 'fmifiit', col: 2, row: 1, kind: 'entity', tone: 'process', title: 'FMIFIIT  FI line items in FM', lines: ['*FMBELNR, FIKRS, FMBUZEI,', '*BTART, RLDNR, GJAHR, STUNR', 'KNBELNR, KNGJAHR, BUKRS', 'VREFBN, VREFBT  predecessor', 'FONDS, FISTL, FIPEX, FAREA', 'WRTTP  value type (54, 57)'] },
    { id: 'fmit', col: 3, row: 1, kind: 'entity', tone: 'process', title: 'FMIT  FM totals', lines: ['*RLDNR, RVERS, RYEAR,', '*RFIKRS, RFUND, RFUNDSCTR,', '*RCMMTITEM, RFUNCAREA', 'RWRTTP  value type', 'TSL01..16, HSL01..16'] },
    { id: 'fund', col: 0, row: 2, kind: 'entity', tone: 'detail', title: 'FMFINCODE  fund', lines: ['*FIKRS, FINCODE', 'TYPE  fund type', 'DATAB, DATBIS  validity'] },
    { id: 'fctr', col: 1, row: 2, kind: 'entity', tone: 'detail', title: 'FMFCTR  funds center', lines: ['*FIKRS, FICTR, DATBIS', 'Hierarchy: FMHISV'] },
    { id: 'fmci', col: 2, row: 2, kind: 'entity', tone: 'detail', title: 'FMCI  commitment item', lines: ['*FIKRS, GJAHR, FIPEX', 'FIVOR  financial trans.', 'POTYP  item category'] },
    { id: 'bcs', col: 3, row: 2, kind: 'entity', tone: 'detail', title: 'BCS budget', lines: ['FMBH  entry doc header', 'FMBL  entry doc lines', 'FMBDT  budget totals', 'FMAVCT  availability control'] }
  ],
  edges: [
    { from: 'skb1', to: 'bkpf', dashed: true },
    { from: 'bkpf', to: 'bseg', label: '1 : N' },
    { from: 'bseg', to: 'ledger', label: 'ledger view' },
    { from: 'bseg', to: 'fmifiit', label: 'KNBELNR = BELNR' },
    { from: 'kblp', to: 'fmioi', label: 'REFBN' },
    { from: 'fmioi', to: 'fmifiit', label: 'VREFBN' },
    { from: 'fmifiit', to: 'fmit', label: 'totals' },
    { from: 'fctr', to: 'fmioi', label: 'FISTL' },
    { from: 'fmci', to: 'fmifiit', label: 'FIPEX' },
    { from: 'bcs', to: 'fmit', label: 'budget vs. use' }
  ]
};

const p2p = {
  id: 'sap-p2p',
  cols: 5,
  colWidth: 178,
  colGap: 34,
  rowGap: 50,
  rowLabels: ['Business step and transaction code', 'Tables written', 'Budgetary and proprietary effect'],
  nodes: [
    { id: 's1', col: 0, row: 0, tone: 'source', title: 'Requisition', lines: ['ME51N', 'or funds commitment FMZ1'] },
    { id: 's2', col: 1, row: 0, tone: 'source', title: 'Purchase order', lines: ['ME21N / ME22N', 'Often created by the contract interface'] },
    { id: 's3', col: 2, row: 0, tone: 'source', title: 'Goods receipt', lines: ['MIGO', 'Services: ML81N entry sheet'] },
    { id: 's4', col: 3, row: 0, tone: 'source', title: 'Invoice', lines: ['MIRO or WAWF IDoc', 'Three-way match'] },
    { id: 's5', col: 4, row: 0, tone: 'source', title: 'Payment', lines: ['F110 payment run', 'or external disbursing return'] },
    { id: 't1', col: 0, row: 1, kind: 'entity', tone: 'detail', title: 'EBAN, EBKN', lines: ['*BANFN, BNFPO', 'KBLK, KBLP for', 'earmarked funds'] },
    { id: 't2', col: 1, row: 1, kind: 'entity', tone: 'detail', title: 'EKKO, EKPO', lines: ['*EBELN, EBELP', 'EKKN  account assign.', 'EKET  schedule lines'] },
    { id: 't3', col: 2, row: 1, kind: 'entity', tone: 'detail', title: 'MKPF, MSEG', lines: ['*MBLNR, MJAHR, ZEILE', 'EKBE  VGABE = 1', 'BKPF, BSEG  (WE)'] },
    { id: 't4', col: 3, row: 1, kind: 'entity', tone: 'detail', title: 'RBKP, RSEG', lines: ['*BELNR, GJAHR', 'EKBE  VGABE = 2', 'BKPF, BSEG, BSIK'] },
    { id: 't5', col: 4, row: 1, kind: 'entity', tone: 'detail', title: 'REGUH, REGUP', lines: ['*LAUFD, LAUFI, ...', 'PAYR  check register', 'BSAK  cleared items'] },
    { id: 'a1', col: 0, row: 2, tone: 'accounting', title: 'Commitment', lines: ['FMIOI value type 50 or 65', 'USSGL 4610 to 4700'] },
    { id: 'a2', col: 1, row: 2, tone: 'accounting', title: 'Obligation', lines: ['FMIOI value type 51', 'USSGL 4700 to 4801'] },
    { id: 'a3', col: 2, row: 2, tone: 'accounting', title: 'Accrued expenditure', lines: ['USSGL 4801 to 4901', 'Expense or asset, GR/IR or payable'] },
    { id: 'a4', col: 3, row: 2, tone: 'accounting', title: 'Payable', lines: ['FMIFIIT value type 54', 'USSGL 2110 accounts payable'] },
    { id: 'a5', col: 4, row: 2, tone: 'accounting', title: 'Outlay', lines: ['FMIFIIT value type 57', 'USSGL 4901 to 4902', '2110 to 1010 FBWT'] }
  ],
  edges: [
    { from: 's1', to: 's2' }, { from: 's2', to: 's3' }, { from: 's3', to: 's4' }, { from: 's4', to: 's5' },
    { from: 's1', to: 't1' }, { from: 's2', to: 't2' }, { from: 's3', to: 't3' }, { from: 's4', to: 't4' }, { from: 's5', to: 't5' },
    { from: 't1', to: 'a1' }, { from: 't2', to: 'a2' }, { from: 't3', to: 'a3' }, { from: 't4', to: 'a4' }, { from: 't5', to: 'a5' }
  ]
};

const integration = {
  id: 'sap-int',
  cols: 4,
  colWidth: 215,
  colGap: 50,
  rowGap: 56,
  rowLabels: ['Inbound: business events arrive', 'Replication for analytics', 'Outbound: departmental reporting'],
  nodes: [
    { id: 'feed', col: 0, row: 0, tone: 'source', title: 'Feeder systems', lines: ['DTS, PIEE / WAWF, DCPS', 'Contract writing systems', 'Bank and disbursing returns'] },
    { id: 'gex', col: 1, row: 0, tone: 'source', title: 'GEX and middleware', lines: ['Global Exchange translates and routes files', 'SAP PI/PO maps to IDoc or proxy calls'] },
    { id: 'idoc', col: 2, row: 0, tone: 'detail', title: 'IDoc layer', lines: ['EDIDC control record', 'EDID4 data segments', 'EDIDS status history', 'Monitor: WE02, BD87'] },
    { id: 'post', col: 3, row: 0, tone: 'accounting', title: 'Application posting', lines: ['BAPIs and function modules create purchasing, FI, and FM documents', 'Status 53 posted, 51 error'] },
    { id: 'advana', col: 1, row: 1, tone: 'reporting', title: 'Advana', lines: ['Near-real-time copies of ERP tables for reconciliation and analytics'] },
    { id: 'slt', col: 2, row: 1, tone: 'reporting', title: 'SLT replication', lines: ['Database triggers and logging tables capture each insert, update, delete'] },
    { id: 'docs', col: 3, row: 1, tone: 'accounting', title: 'ERP document tables', lines: ['BKPF, BSEG, FAGLFLEXA', 'FMIOI, FMIFIIT, FMIT', 'EKKO, EKPO, EKBE', 'BW extractors read the same data'] },
    { id: 'gtas', col: 0, row: 2, tone: 'statements', title: 'GTAS', lines: ['Adjusted trial balance bulk file to Treasury'] },
    { id: 'ddrs', col: 1, row: 2, tone: 'statements', title: 'DDRS-B and DDRS-AFS', lines: ['Crosswalk, edits, journal vouchers, statements'] },
    { id: 'gex2', col: 2, row: 2, tone: 'source', title: 'GEX', lines: ['File transfer to DFAS'] },
    { id: 'tb', col: 3, row: 2, tone: 'accounting', title: 'Trial balance extract', lines: ['SFIS-compliant file by TAS, DoD SCOA account, and attributes'] }
  ],
  edges: [
    { from: 'feed', to: 'gex' }, { from: 'gex', to: 'idoc' }, { from: 'idoc', to: 'post' },
    { from: 'post', to: 'docs' },
    { from: 'docs', to: 'slt' }, { from: 'slt', to: 'advana' },
    { from: 'docs', to: 'tb' },
    { from: 'tb', to: 'gex2' }, { from: 'gex2', to: 'ddrs' }, { from: 'ddrs', to: 'gtas' }
  ]
};

export const sapPage = {
  slug: 'sap',
  prefix: 'S',
  eyebrow: 'Platform reference',
  navTitle: 'SAP ERP: Architecture, Data Model, and Tables',
  shortTitle: 'SAP ERP',
  blurb: 'How SAP ECC 6.0 and S/4HANA are built, how the organizational and document models work, and which tables hold the data behind GFEBS, Navy ERP, GCSS-Army, LMP, and DLA EBS.',
  appliesTo: ['gfebs', 'navy-erp', 'gcss-army', 'lmp', 'dla-ebs'],
  blocks: [
    h2('1. What runs on SAP in DoD'),
    p('Five systems in this suite run on SAP ERP: GFEBS, Navy ERP, GCSS-Army, LMP, and DLA EBS. They share one product data model. A purchase order sits in `EKKO` and `EKPO` in all five. A financial document sits in `BKPF` and `BSEG` in all five. What differs between programs is configuration, custom Z-tables, interfaces, and which modules are switched on.'),
    table('SAP-based systems in this suite', ['System', 'Owner', 'Main SAP scope', 'Role in the reporting chain'], [
      ['GFEBS', 'Army', 'FI, PSM-FM, CO, MM purchasing, SD for reimbursables, asset accounting, real estate', 'Army General Fund general ledger. Sends its trial balance to DDRS.'],
      ['Navy ERP', 'Navy', 'FI, PSM-FM, CO, MM, PS, SD, plant maintenance, HR time', 'General ledger for Navy systems commands and working capital activities.'],
      ['GCSS-Army', 'Army', 'MM inventory and purchasing, PM maintenance, property book, with a finance component', 'Tactical logistics ERP. Its financial postings follow the GFEBS finance template.'],
      ['LMP', 'Army Materiel Command', 'MM, PP, SD, PM, FI and CO for the Army Working Capital Fund', 'National-level logistics and the AWCF general ledger.'],
      ['DLA EBS', 'Defense Logistics Agency', 'MM, SD, FI, CO, plus planning and procurement add-ons', 'DLA supply chain and working capital fund accounting.']
    ], 'Scope lines summarize public program descriptions. Each program office holds the authoritative module and release list.'),
    callout('How to read the table names on this page', 'Every table named here is a standard SAP product table. Programs add custom tables and fields that start with Z or Y. Those are not public. Use this page to know where to look first, then confirm against the program data dictionary (transaction `SE11`).'),

    h2('2. Technical architecture'),
    p('SAP ERP is a three-tier client-server system. Users and interfaces reach an application server. The application server runs ABAP programs in work processes. Only the application server talks to the database.'),
    figure('SAP NetWeaver Application Server ABAP: tiers and components', architecture, 'Work process types and the database interface follow the SAP NetWeaver documentation. Program-specific sizing and hosting are not shown.'),
    table('Application server components', ['Component', 'What it does', 'Why a financial manager should care'], [
      ['Dispatcher', 'Receives each request and assigns it to a free work process of the right type.', 'Long queues at month end show up as slow screens and delayed postings.'],
      ['Dialog work process (DIA)', 'Runs one screen step of an online transaction.', 'Each step is its own database commit unit, which is why SAP uses update tasks.'],
      ['Update work process (UPD, UP2)', 'Writes the document to the database after the dialog ends. V1 updates are time-critical. V2 updates are statistical.', 'A failed update leaves a document number with no document. Transaction `SM13` lists them.'],
      ['Background work process (BGD)', 'Runs scheduled jobs: payment runs, interface loads, depreciation, period-end programs.', 'Job logs in `SM37` are audit evidence that a control ran.'],
      ['Enqueue server', 'Holds the logical lock table so two users cannot change the same document.', 'Stuck locks block postings. `SM12` shows them.'],
      ['Message server', 'Balances logons across instances.', 'No direct audit relevance.'],
      ['ICM', 'Handles HTTP, HTTPS, and SMTP for Fiori, web services, and OData.', 'Web-service interfaces authenticate here.'],
      ['Gateway', 'Handles RFC calls from other systems, including IDoc delivery.', 'Interface user accounts and RFC destinations (`SM59`) are access-control scope.'],
      ['Database interface', 'Translates Open SQL into the database dialect and manages table buffers.', 'Explains why the same ABAP program runs on Oracle or HANA.']
    ]),
    h3('Clients, landscapes, and transports'),
    list(
      'A **client** is a self-contained business tenant inside one SAP system. The client number is the first key field (`MANDT`) of almost every application table. Any direct SQL against an SAP database must filter on it.',
      'A standard landscape has three systems: development, quality assurance, and production. Configuration and code move between them in **transport requests**. The transport log is the change-management evidence auditors ask for.',
      'Configuration lives in tables too. The Implementation Guide (`SPRO`) is a menu over thousands of customizing tables such as `T001` (company codes) and `T003` (document types).',
      'The **ABAP Dictionary** (`SE11`) defines every table. ECC has three physical kinds: transparent tables, pooled tables, and cluster tables. `BSEG` is a cluster table in ECC, which is why it cannot be joined in plain SQL there. In S/4HANA it is transparent.'
    ),

    h2('3. Organizational structure'),
    p('SAP separates the legal view, the cost view, the budget view, and the logistics view of an organization. Each view has its own top-level unit. Assignments between them decide which postings are allowed.'),
    figure('SAP organizational units and the master data under each', orgModel),
    table('Organizational units and their configuration tables', ['Unit', 'Field', 'Config table', 'Meaning in a DoD implementation'], [
      ['Client', '`MANDT`', '`T000`', 'The production tenant. Usually one per program.'],
      ['Company code', '`BUKRS`', '`T001`', 'A balanced set of books. Often one per reporting entity or fund group.'],
      ['Chart of accounts', '`KTOPL`', '`T004`', 'The account list. DoD programs load the DoD Standard Chart of Accounts: a six-digit USSGL account plus a four-digit DoD extension.'],
      ['Ledger', '`RLDNR`', '`T881`', 'New GL ledgers. A leading ledger carries the statutory view.'],
      ['Controlling area', '`KOKRS`', '`TKA01`', 'Cost accounting scope for cost centers, orders, and WBS elements.'],
      ['FM area', '`FIKRS`', '`FM01`', 'Budget control scope. Holds funds, funds centers, and commitment items.'],
      ['Business area', '`GSBER`', '`TGSB`', 'Cross-company-code segment for balance sheets below company code.'],
      ['Plant', '`WERKS`', '`T001W`', 'A site that holds stock or performs maintenance.'],
      ['Storage location', '`LGORT`', '`T001L`', 'Where stock sits inside a plant.'],
      ['Purchasing organization', '`EKORG`', '`T024E`', 'The unit that negotiates and issues purchase orders.'],
      ['Sales organization', '`VKORG`', '`TVKO`', 'The unit that sells. Used for reimbursable orders and working capital sales.']
    ]),

    h2('4. The document principle'),
    p('Every posting in SAP creates a numbered document that cannot be deleted. A correction is a new reversing document. Each document has a header and line items, and each carries a link back to the document that caused it. That chain is what makes transaction-level audit support possible.'),
    list(
      'A financial document is identified by company code, document number, and fiscal year: `BUKRS` + `BELNR` + `GJAHR`.',
      'The header field `AWTYP` names the kind of source object. `AWKEY` holds its key. `AWTYP = MKPF` points to a material document. `RMRP` points to a logistics invoice. `VBRK` points to a billing document. `BKPF` means the posting was made directly in FI.',
      'The document type `BLART` classifies the posting. Common values: `SA` general ledger, `KR` vendor invoice, `KZ` vendor payment, `RE` logistics invoice, `WE` goods receipt, `ZP` payment run, `AA` asset posting.',
      'Posting keys (`BSCHL`) set debit or credit and the account type. `40` debits a GL account. `50` credits one. `31` credits a vendor. `25` debits a vendor for payment.',
      'Changes to master data and documents are logged in `CDHDR` and `CDPOS`. These two tables answer the question of who changed what, and when.'
    ),

    h2('5. Finance and Funds Management data model'),
    p('Three ledgers update together when a business event posts. Financial Accounting records the proprietary entry. Funds Management records budget consumption against fund, funds center, and commitment item. Controlling records cost against a cost center, order, or WBS element. The line item in `BSEG` carries the account assignments for all three.'),
    figure('Entity relationships: FI documents, FM line items, FM master data, and budget', financeModel, 'Key fields are marked at the top of each entity. Field lists are abbreviated. Confirm the full key in SE11 for the release in use.'),
    table('Financial Accounting (FI) tables', ['Table', 'Holds', 'Key fields', 'Use it to'], [
      ['`BKPF`', 'Accounting document header', '`BUKRS`, `BELNR`, `GJAHR`', 'Find who posted, when, with which transaction, and from which source object.'],
      ['`BSEG`', 'Accounting document line items', '`BUKRS`, `BELNR`, `GJAHR`, `BUZEI`', 'Read every debit and credit with its account assignment.'],
      ['`BSIS` / `BSAS`', 'GL open and cleared item index', '`BUKRS`, `HKONT`, `AUGDT`, `GJAHR`, `BELNR`', 'List line items by GL account without reading `BSEG`.'],
      ['`BSIK` / `BSAK`', 'Vendor open and cleared items', '`BUKRS`, `LIFNR`, `GJAHR`, `BELNR`', 'Age accounts payable and prove payment clearing.'],
      ['`BSID` / `BSAD`', 'Customer open and cleared items', '`BUKRS`, `KUNNR`, `GJAHR`, `BELNR`', 'Age receivables, including reimbursable billings.'],
      ['`FAGLFLEXA`', 'New GL line items per ledger', '`RYEAR`, `DOCNR`, `RLDNR`, `RBUKRS`, `DOCLN`', 'Read the ledger view with segment and fund on every line.'],
      ['`FAGLFLEXT`', 'New GL totals', '`RYEAR`, `RLDNR`, `RBUKRS`, `RACCT`, plus dimensions', 'Build a trial balance by period.'],
      ['`GLT0`', 'Classic GL totals', '`BUKRS`, `RYEAR`, `RACCT`, `RBUSA`', 'Legacy totals where the new GL is not active.'],
      ['`SKA1` / `SKB1` / `SKAT`', 'GL account master: chart, company code, text', '`KTOPL`, `SAKNR` / `BUKRS`, `SAKNR`', 'Check account type, reconciliation flag, and open-item management.'],
      ['`LFA1` / `LFB1` / `LFBK`', 'Vendor master: general, company code, bank', '`LIFNR`', 'Validate payee data.'],
      ['`KNA1` / `KNB1`', 'Customer master', '`KUNNR`', 'Identify trading partners on receivables.'],
      ['`REGUH` / `REGUP`', 'Payment run header and paid items', '`LAUFD`, `LAUFI`, `ZBUKR`, `LIFNR`, `VBLNR`', 'Tie a payment to the invoices it cleared.'],
      ['`PAYR`', 'Payment medium register', '`ZBUKR`, `HBKID`, `HKTID`, `CHECT`', 'Trace check or EFT numbers.'],
      ['`T001B`', 'Posting period control', '`BUKRS`, account type, period range', 'Show which periods were open when a document posted.'],
      ['`CDHDR` / `CDPOS`', 'Change document header and items', '`OBJECTCLAS`, `OBJECTID`, `CHANGENR`', 'Prove who changed a master record or document field.']
    ]),
    table('Public Sector Management: Funds Management (PSM-FM) tables', ['Table', 'Holds', 'Key or main fields', 'Use it to'], [
      ['`FM01`', 'FM area definition', '`FIKRS`', 'Find the update profile and fiscal year variant.'],
      ['`FMFINCODE`', 'Fund master', '`FIKRS`, `FINCODE`', 'Map a fund to its appropriation and validity dates.'],
      ['`FMFCTR`', 'Funds center master', '`FIKRS`, `FICTR`, `DATBIS`', 'Identify the organization that holds budget.'],
      ['`FMCI`', 'Commitment item master', '`FIKRS`, `GJAHR`, `FIPEX`', 'Classify spending by object class or expenditure type.'],
      ['`TFKB`', 'Functional area', '`FKBER`', 'Classify by program or mission.'],
      ['`FMMEASURE`', 'Funded program', '`FMAREA`, `MEASURE`', 'Track budget below the fund for a program or project.'],
      ['`FMIOI`', 'Commitment and funds transfer line items', 'Reference document fields `REFBN`, `REFBT`, `RFORG`, `RFPOS`, `RFKNT`, `RFETE`', 'Read open commitments and obligations from requisitions, orders, and earmarked funds.'],
      ['`FMIFIIT`', 'FI line items in FM', '`FMBELNR`, `FIKRS`, `FMBUZEI`, `BTART`, `RLDNR`, `GJAHR`, `STUNR`', 'Read invoices, payments, and other actuals against budget. `KNBELNR` links to the FI document.'],
      ['`FMIT`', 'FM totals', 'Ledger, year, FM area, fund, funds center, commitment item, value type', 'Summarize commitments and actuals by budget address.'],
      ['`FMBH` / `FMBL`', 'BCS budget entry document header and lines', '`FM_AREA`, `DOCYEAR`, `DOCNR`', 'Trace each budget load, transfer, supplement, and return.'],
      ['`FMBDT`', 'BCS budget totals', 'FM area, year, budget address, budget category, budget type', 'Read current budget by address.'],
      ['`FMAVCT`', 'Availability control totals', 'Control ledger, FM area, control address', 'Compare consumable budget to consumed amount. This is what the funds check reads.'],
      ['`KBLK` / `KBLP`', 'Earmarked funds header and lines', '`BELNR`, `BLPOS`', 'Trace funds reservations, precommitments, and commitments not tied to a purchase order.'],
      ['`KBLE`', 'Earmarked funds consumption history', '`BELNR`, `BLPOS`, reference document', 'See which documents drew down a reservation.']
    ]),
    table('FM value types (`WRTTP`) seen on commitment and actual line items', ['Value type', 'Meaning', 'Typical source', 'Budgetary stage'], [
      ['50', 'Purchase requisition', '`EBAN`', 'Commitment'],
      ['51', 'Purchase order', '`EKKO` / `EKPO`', 'Obligation'],
      ['52', 'Business trip commitment', 'Travel management', 'Obligation'],
      ['54', 'Invoice', '`BKPF` / `BSEG`, `RBKP`', 'Expenditure accrued'],
      ['57', 'Payment', 'Payment document', 'Outlay'],
      ['58', 'Down payment request', 'FI', 'Advance requested'],
      ['61', 'Down payment', 'FI', 'Advance paid'],
      ['65', 'Funds commitment', '`KBLK` / `KBLP`', 'Obligation without a purchase order'],
      ['66', 'Transfer posting', 'FI', 'Reclassification'],
      ['80 / 81 / 82', 'Funds block, funds reservation, funds precommitment', '`KBLK` / `KBLP`', 'Administrative reservation and commitment'],
      ['95', 'Secondary cost posting', 'CO', 'Cost allocation with FM update']
    ], 'Value types are standard PSM-FM values. Which ones post, and at which date, depends on the FM update profile set in the FM area.'),
    h3('How SAP produces USSGL budgetary accounts'),
    p('Standard FI only records proprietary accounts. The US Federal extension of Public Sector Management adds a budgetary ledger. When an FM event posts, such as an obligation or a payment, the budgetary ledger derives the matching 4000-series entry and posts it in the same FI document or a linked one. The result is that one business event carries both the proprietary and the budgetary entry, which is what FFMIA requires at the transaction level.'),

    h2('6. Procure-to-pay document flow'),
    p('Procure-to-pay is the largest transaction population in most DoD general fund audits. The flow below shows the SAP step, the tables each step writes, and the accounting effect.'),
    figure('SAP procure-to-pay: steps, tables, and accounting effect', p2p, 'USSGL accounts show the standard budgetary progression. In several DoD programs entitlement or disbursing happens outside the ERP and returns by interface.'),
    table('Materials Management and purchasing tables', ['Table', 'Holds', 'Key fields', 'Link forward'], [
      ['`EBAN`', 'Purchase requisition items', '`BANFN`, `BNFPO`', '`EKPO-BANFN` on the purchase order item'],
      ['`EBKN`', 'Requisition account assignment', '`BANFN`, `BNFPO`, `ZEBKN`', 'Fund, funds center, commitment item for the commitment'],
      ['`EKKO`', 'Purchasing document header', '`EBELN`', '`EKPO`, `EKBE`'],
      ['`EKPO`', 'Purchasing document item', '`EBELN`, `EBELP`', 'Item price, quantity, plant, material group'],
      ['`EKKN`', 'Purchase order account assignment', '`EBELN`, `EBELP`, `ZEKKN`', 'GL account, cost object, and FM address for the obligation'],
      ['`EKET`', 'Delivery schedule lines', '`EBELN`, `EBELP`, `ETENR`', 'Delivery dates and quantities'],
      ['`EKBE`', 'Purchase order history', '`EBELN`, `EBELP`, `ZEKKN`, `VGABE`, `GJAHR`, `BELNR`, `BUZEI`', '`VGABE` 1 is a goods receipt. `VGABE` 2 is an invoice receipt.'],
      ['`MKPF` / `MSEG`', 'Material document header and items', '`MBLNR`, `MJAHR`, `ZEILE`', '`BKPF-AWKEY` holds the material document number and year'],
      ['`ESSR` / `ESLL`', 'Service entry sheet header and lines', '`LBLNI`', 'Acceptance of services against a purchase order'],
      ['`RBKP` / `RSEG`', 'Logistics invoice header and items', '`BELNR`, `GJAHR`', '`BKPF-AWKEY` holds the invoice number and year'],
      ['`MARA` / `MARC` / `MARD` / `MBEW`', 'Material master: general, plant, storage location, valuation', '`MATNR`', 'Stock quantities and moving average or standard price']
    ]),
    steps(
      'Start from the invoice or payment in the sample. Read `BKPF` for the document and note `AWTYP` and `AWKEY`.',
      'If `AWTYP` is `RMRP`, split `AWKEY` into invoice number and year and read `RBKP` and `RSEG`. `RSEG` gives the purchase order and item.',
      'Read `EKBE` for that order item. It lists every goods receipt and invoice posted against it.',
      'Read `EKKO`, `EKPO`, and `EKKN` for the obligation amount and the funding line.',
      'Read `FMIOI` by `REFBN` equal to the order number for the open obligation, and `FMIFIIT` by `KNBELNR` equal to the FI document for the expenditure.',
      'Read `EKPO-BANFN` to step back to the requisition in `EBAN`, or `KBLP` if the commitment was an earmarked funds document.'
    ),

    h2('7. Other module data models'),
    table('Controlling (CO) and Project System (PS) tables', ['Table', 'Holds', 'Key fields'], [
      ['`CSKS` / `CSKT`', 'Cost center master and text', '`KOKRS`, `KOSTL`, `DATBI`'],
      ['`CSKA` / `CSKB`', 'Cost element master', '`KTOPL`, `KSTAR` / `KOKRS`, `KSTAR`, `DATBI`'],
      ['`AUFK`', 'Order master: internal, maintenance, production', '`AUFNR`'],
      ['`COBK`', 'CO document header', '`KOKRS`, `BELNR`'],
      ['`COEP`', 'CO actual line items', '`KOKRS`, `BELNR`, `BUZEI`'],
      ['`COSP` / `COSS`', 'CO totals for primary and secondary costs', '`OBJNR`, `GJAHR`, `WRTTP`, `KSTAR`'],
      ['`COOI`', 'CO commitment line items', '`REFBT`, `REFBN`, `RFPOS`'],
      ['`PROJ`', 'Project definition', '`PSPNR`, external key `PSPID`'],
      ['`PRPS`', 'WBS element', '`PSPNR`, external key `POSID`'],
      ['`PRHI`', 'WBS hierarchy', '`POSNR`'],
      ['`RPSCO`', 'Project totals', '`OBJNR`, `WRTTP`, `GJAHR`']
    ]),
    table('Sales and Distribution (SD) tables used for reimbursable and working capital sales', ['Table', 'Holds', 'Key fields'], [
      ['`VBAK` / `VBAP`', 'Sales order header and items', '`VBELN`, `POSNR`'],
      ['`LIKP` / `LIPS`', 'Delivery header and items', '`VBELN`, `POSNR`'],
      ['`VBRK` / `VBRP`', 'Billing document header and items', '`VBELN`, `POSNR`'],
      ['`VBFA`', 'Sales document flow', '`VBELV`, `POSNV`, `VBELN`, `POSNN`, `VBTYP_N`'],
      ['`KONV`', 'Pricing conditions', '`KNUMV`, `KPOSN`, `STUNR`']
    ], '`VBFA` is the SD equivalent of `EKBE`. It links order, delivery, and bill in one table.'),
    table('Asset Accounting (FI-AA), Plant Maintenance (PM), and inventory tables', ['Table', 'Holds', 'Key fields'], [
      ['`ANLA`', 'Asset master', '`BUKRS`, `ANLN1`, `ANLN2`'],
      ['`ANLZ`', 'Time-dependent asset assignments', '`BUKRS`, `ANLN1`, `ANLN2`, `BDATU`'],
      ['`ANLB` / `ANLC`', 'Depreciation terms and annual values', '`BUKRS`, `ANLN1`, `ANLN2`, `AFABE`'],
      ['`ANEK` / `ANEP`', 'Asset document header and line items', '`BUKRS`, `ANLN1`, `GJAHR`, `LNRAN`'],
      ['`ANLP`', 'Periodic depreciation postings', '`BUKRS`, `GJAHR`, `PERAF`, `ANLN1`'],
      ['`EQUI` / `EQUZ`', 'Equipment master and time segments', '`EQUNR`'],
      ['`IFLOT`', 'Functional location', '`TPLNR`'],
      ['`AFIH` / `AFKO` / `AFVC`', 'Maintenance order header, order header data, operations', '`AUFNR`, `AUFPL`'],
      ['`QMEL`', 'Maintenance or quality notification', '`QMNUM`'],
      ['`RESB`', 'Reservations and dependent requirements', '`RSNUM`, `RSPOS`'],
      ['`MCHB`', 'Batch stock', '`MATNR`, `WERKS`, `LGORT`, `CHARG`'],
      ['`LAGP` / `LQUA`', 'Warehouse bins and quants', '`LGNUM`, `LGTYP`, `LGPLA` / `LQNUM`']
    ]),

    h2('8. ECC 6.0 compared with S/4HANA'),
    p('S/4HANA keeps the document principle and most table names, and changes where totals and line items live. One table, `ACDOCA`, holds the line items that ECC spread across FI, the new GL, CO, asset accounting, and the material ledger. Totals are computed on read.'),
    table('What changes in the data model when a program moves from ECC to S/4HANA', ['Area', 'ECC 6.0', 'S/4HANA', 'Effect on extracts and audit queries'], [
      ['GL line items', '`BSEG`, `FAGLFLEXA`', '`ACDOCA` universal journal. `BSEG` remains as the entry view.', 'Point trial balance and universe queries at `ACDOCA`.'],
      ['GL totals', '`GLT0`, `FAGLFLEXT`', 'No stored totals. Same-named compatibility views read `ACDOCA`.', 'Old queries still run, with different performance.'],
      ['Open item indexes', '`BSIS`, `BSAS`, `BSIK`, `BSAK`, `BSID`, `BSAD`', 'Compatibility views', 'No longer physical tables.'],
      ['CO line items and totals', '`COEP`, `COSP`, `COSS`', 'Actuals in `ACDOCA`. `COEP` keeps some value types.', 'FI and CO reconcile by design because they share one line.'],
      ['Asset line items', '`ANEP`, `ANLC`, `ANLP`', 'Actuals in `ACDOCA`. Plan values in `FAAT_PLAN_VALUES`.', 'Asset subledger ties to GL without a reconciliation program.'],
      ['Material documents', '`MKPF`, `MSEG`', '`MATDOC`', 'One table for header and item.'],
      ['Vendor and customer master', '`LFA1`, `KNA1`', 'Business partner `BUT000` is the lead object, linked through `CVI_VEND_LINK` and `CVI_CUST_LINK`.', 'Payee validation must read the business partner.'],
      ['Funds Management', '`FMIOI`, `FMIFIIT`, `FMIT`, BCS tables', 'Same tables remain in use.', 'FM queries carry over.'],
      ['Database', 'Several supported', 'HANA only, column store, in memory', 'Line-item reporting replaces batch extracts.'],
      ['User interface', 'SAP GUI', 'Fiori apps over OData, SAP GUI still available', 'Access reviews must cover Fiori catalogs as well as roles.']
    ], 'Sources: SAP material on the universal journal and migration to S/4HANA Finance listed at the end of this page.'),

    h2('9. Integration technologies'),
    figure('How data enters an SAP ERP, leaves for analytics, and reaches departmental reporting', integration, 'The Army has publicly described SLT streaming from GFEBS and GCSS-Army into Advana. Other programs may use different extraction methods.'),
    table('Interface technologies and where their evidence lives', ['Technology', 'What it is', 'Evidence tables or transactions'], [
      ['IDoc', 'Structured message with a control record, data segments, and status records. Used for inbound invoices, travel, pay, and outbound orders.', '`EDIDC`, `EDID4`, `EDIDS`. Monitor with `WE02`, `WE05`, `BD87`.'],
      ['RFC and BAPI', 'Remote function calls. A BAPI is a stable business interface, for example to create a purchase order.', '`SM59` destinations, `SM58` transactional RFC errors.'],
      ['PI/PO', 'SAP middleware that maps and routes messages between systems.', 'Message monitoring in the PI system.'],
      ['Batch input and LSMW', 'Simulated screen entry for mass loads.', '`SM35` session logs.'],
      ['SLT', 'Trigger-based replication server that copies table changes to another database in near real time.', 'Replication configuration and logging tables in the SLT system.'],
      ['BW extraction', 'Delivered extractors feed a data warehouse. Examples: `0FI_GL_14` new GL line items, `0PU_IS_PS_31` FM commitment line items, `0PU_IS_PS_32` FM actual line items.', '`RSA3` extractor checker, delta queue `ODQMON` or `RSA7`.'],
      ['OData and CDS views', 'S/4HANA exposes data through Core Data Services views and OData services.', 'Service catalog and view definitions.']
    ]),
    table('IDoc status codes most often seen in interface reconciliations', ['Status', 'Direction', 'Meaning', 'Action'], [
      ['03', 'Outbound', 'Data passed to port', 'Sent. Confirm receipt downstream.'],
      ['12', 'Outbound', 'Dispatch OK', 'None.'],
      ['51', 'Inbound', 'Application document not posted', 'Read the error, fix data or master data, reprocess with `BD87`.'],
      ['53', 'Inbound', 'Application document posted', 'None. The status record names the document created.'],
      ['64', 'Inbound', 'Ready to be passed to application', 'Waiting for a background job. Check the job.'],
      ['68', 'Inbound', 'Error, no further processing', 'Closed manually. Needs documented justification.']
    ]),

    h2('10. Security and controls'),
    list(
      'Access is granted through **roles** built in `PFCG`. A role bundles transaction codes and **authorization objects**. Examples: `F_BKPF_BUK` controls posting by company code. `F_FICB_FKR` controls FM area access. `M_BEST_EKO` controls purchase orders by purchasing organization.',
      'Role assignments sit in `AGR_USERS`. Role contents sit in `AGR_1251`. User master data sits in `USR02`. These three tables support a user access review.',
      'Segregation of duties is tested by checking whether one user holds conflicting transactions, such as creating a vendor (`XK01`) and running payments (`F110`). SAP GRC Access Control automates the rule set.',
      'The security audit log (`SM20`) and table change logging (`DBTABLOG`, read through `SCU3`) record sensitive actions and configuration changes.',
      'Direct table maintenance through `SE16N` or `SM30` in production is a common audit finding. Review who holds `S_TABU_DIS`.'
    ),

    h2('11. Trial balance and universe of transactions queries'),
    p('A defensible trial balance from SAP reads the ledger line items and sums them by the reporting dimensions. The universe of transactions is the same query without the sum.'),
    steps(
      'Pick the ledger table: `FAGLFLEXA` in ECC with the new GL, `ACDOCA` in S/4HANA.',
      'Filter on client, company code, ledger, fiscal year, and posting period.',
      'Group by GL account, fund, functional area, and any other attribute the SFIS trial balance needs.',
      'Compare the totals to `FAGLFLEXT` or to transaction `FAGLB03`. They must agree to the cent.',
      'Join the line items to `BKPF` for user, date, document type, and `AWTYP` / `AWKEY`. This gives every balance a path to its source document.',
      'Compare FM totals in `FMIT` to the budgetary accounts in the ledger. Differences point to documents that updated one ledger and not the other.'
    )
  ],
  sources: [
    { name: 'SAP NetWeaver documentation: work processes and the application server', url: 'https://help.sap.com/saphelp_nw73/helpdata/en/fc/eb2e7d358411d1829f0000e829fbfe/content.htm' },
    { name: 'SAP Press: S/4HANA Finance and the universal journal', url: 'https://blog.sap-press.com/sap-s/4hana-finance-innovations-part-3-the-universal-journal' },
    { name: 'SAP Community: ECC tables after migration to S/4HANA Finance', url: 'https://blogs.sap.com/2019/10/30/ecc-tables-after-migration-to-s4-hanasimple-finance/' },
    { name: 'Table reference: FMIFIIT', url: 'https://leanx.eu/en/sap/table/fmifiit.html' },
    { name: 'Table reference: FMIOI', url: 'https://leanx.eu/en/sap/table/fmioi.html' },
    { name: 'Table reference: FMIT', url: 'https://leanx.eu/en/sap/table/fmit.html' },
    { name: 'Army.mil: GFEBS and GCSS-Army replication pipelines to Advana (Sept 2023)', url: 'https://www.army.mil/article/270109/the_u_s_army_and_dod_chief_digital_and_artificial_intelligence_office_cdao_accelerate_the_speed_and_efficiency_of_data_with_two_data_replication_pipelines' },
    { name: 'DoD FMR Volume 1, Chapter 7: DoD Standard Chart of Accounts', url: 'https://comptroller.defense.gov/Portals/45/documents/fmr/current/01/01_07.pdf' }
  ]
};
