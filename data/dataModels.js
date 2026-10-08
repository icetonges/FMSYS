// Table-level data model for each system page.
// SAP and Oracle entries list standard product tables. Legacy, DFAS, and Treasury
// entries list logical records, because their physical schemas are not public.

const sapFinance = [
  ['BKPF', 'Finance', 'Accounting document header', 'BUKRS, BELNR, GJAHR', 'BSEG; source object through AWTYP and AWKEY'],
  ['BSEG', 'Finance', 'Accounting document line items with all account assignments', 'BUKRS, BELNR, GJAHR, BUZEI', 'FAGLFLEXA or ACDOCA; FMIFIIT through KNBELNR'],
  ['FAGLFLEXA / FAGLFLEXT', 'Finance', 'New GL line items and totals by ledger. ACDOCA replaces both in S/4HANA.', 'RLDNR, RBUKRS, RYEAR, DOCNR, DOCLN', 'Trial balance extract to DDRS'],
  ['SKA1 / SKB1', 'Finance', 'GL account master holding the DoD Standard Chart of Accounts', 'KTOPL, SAKNR / BUKRS, SAKNR', 'BSEG-HKONT']
];

const sapFunds = [
  ['FMFINCODE', 'Funds Management', 'Fund master', 'FIKRS, FINCODE', 'Treasury Account Symbol on the trial balance'],
  ['FMFCTR', 'Funds Management', 'Funds center master', 'FIKRS, FICTR, DATBIS', 'SLOA funding center'],
  ['FMCI', 'Funds Management', 'Commitment item master', 'FIKRS, GJAHR, FIPEX', 'Object class'],
  ['FMBH / FMBL / FMBDT', 'Funds Management', 'Budget entry documents and budget totals', 'FM_AREA, DOCYEAR, DOCNR', 'Availability control in FMAVCT'],
  ['FMIOI', 'Funds Management', 'Open commitments and obligations', 'REFBN, REFBT, RFORG, RFPOS', 'EKKO, EBAN, KBLK by reference number'],
  ['FMIFIIT', 'Funds Management', 'Invoices, payments, and other actuals against budget', 'FMBELNR, FIKRS, FMBUZEI', 'BKPF through KNBELNR and KNGJAHR'],
  ['KBLK / KBLP', 'Funds Management', 'Earmarked funds: reservations and funds commitments', 'BELNR, BLPOS', 'FMIOI value types 65, 80, 81, 82']
];

const sapPurchasing = [
  ['EBAN / EBKN', 'Purchasing', 'Purchase requisition items and account assignment', 'BANFN, BNFPO', 'EKPO-BANFN'],
  ['EKKO / EKPO', 'Purchasing', 'Purchase order header and items', 'EBELN, EBELP', 'EKKN, EKBE'],
  ['EKKN', 'Purchasing', 'Purchase order account assignment: GL account, cost object, fund', 'EBELN, EBELP, ZEKKN', 'FMIOI'],
  ['EKBE', 'Purchasing', 'Purchase order history: goods receipts and invoice receipts', 'EBELN, EBELP, VGABE, GJAHR, BELNR', 'MSEG, RSEG'],
  ['MKPF / MSEG', 'Inventory', 'Material document header and items. MATDOC in S/4HANA.', 'MBLNR, MJAHR, ZEILE', 'BKPF-AWKEY'],
  ['RBKP / RSEG', 'Invoice verification', 'Logistics invoice header and items', 'BELNR, GJAHR', 'BKPF-AWKEY'],
  ['REGUH / REGUP', 'Payments', 'Payment run header and paid items', 'LAUFD, LAUFI, VBLNR', 'BSAK cleared items']
];

const sapCost = [
  ['CSKS', 'Controlling', 'Cost center master', 'KOKRS, KOSTL, DATBI', 'BSEG-KOSTL'],
  ['AUFK', 'Controlling', 'Order master', 'AUFNR', 'BSEG-AUFNR'],
  ['PRPS', 'Project System', 'WBS element', 'PSPNR, POSID', 'BSEG-PROJK'],
  ['COEP / COBK', 'Controlling', 'CO line items and document header', 'KOKRS, BELNR, BUZEI', 'ACDOCA in S/4HANA']
];

const sapSales = [
  ['VBAK / VBAP', 'Sales', 'Sales order header and items, used for reimbursable and customer orders', 'VBELN, POSNR', 'VBFA'],
  ['VBRK / VBRP', 'Billing', 'Billing document header and items', 'VBELN, POSNR', 'BKPF-AWKEY'],
  ['VBFA', 'Sales', 'Document flow from order to delivery to bill', 'VBELV, POSNV, VBELN, POSNN', 'LIKP, VBRK']
];

const sapAssets = [
  ['ANLA / ANLZ', 'Asset Accounting', 'Asset master and time-dependent assignments', 'BUKRS, ANLN1, ANLN2', 'ANEP'],
  ['ANEP / ANEK', 'Asset Accounting', 'Asset line items and document header', 'BUKRS, ANLN1, GJAHR, LNRAN', 'BKPF'],
  ['ANLC / ANLP', 'Asset Accounting', 'Annual values and periodic depreciation', 'BUKRS, ANLN1, GJAHR', 'General ledger asset accounts']
];

const sapLogistics = [
  ['MARA / MARC / MARD', 'Material master', 'Material general data, plant data, storage location stock', 'MATNR, WERKS, LGORT', 'MSEG'],
  ['MBEW', 'Valuation', 'Material valuation: price control, moving average or standard price, stock value', 'MATNR, BWKEY, BWTAR', 'Inventory GL accounts'],
  ['EQUI / EQUZ', 'Plant Maintenance', 'Equipment master and time segments', 'EQUNR', 'Maintenance orders'],
  ['AFIH / AFKO / AFVC', 'Plant Maintenance', 'Maintenance order header, order data, operations', 'AUFNR, AUFPL', 'AUFK, RESB'],
  ['RESB', 'Inventory', 'Reservations and parts requirements', 'RSNUM, RSPOS', 'MSEG goods issue']
];

const sapProduction = [
  ['AFKO / AFPO', 'Production', 'Production or repair order header and items', 'AUFNR, POSNR', 'AUFK, MSEG'],
  ['CKMLHD / CKMLCR', 'Material Ledger', 'Material ledger header and period values', 'KALNR', 'MBEW'],
  ['LIKP / LIPS', 'Shipping', 'Delivery header and items', 'VBELN, POSNR', 'VBFA, MSEG']
];

const sapIdoc = [
  ['EDIDC / EDID4 / EDIDS', 'Interfaces', 'IDoc control record, data segments, and status history', 'DOCNUM', 'Application document named in status 53']
];

const sapJoins = [
  'Financial document to source: read BKPF-AWTYP and BKPF-AWKEY. MKPF points to a material document, RMRP to a logistics invoice, VBRK to a billing document.',
  'Invoice to purchase order: RSEG-EBELN and RSEG-EBELP, then EKBE for every receipt and invoice on that item.',
  'Budget consumption to financial document: FMIFIIT-KNBELNR and KNGJAHR equal BKPF-BELNR and GJAHR.',
  'Open obligation to purchase order: FMIOI-REFBN equals EKKO-EBELN.',
  'Trial balance: sum FAGLFLEXA (ECC) or ACDOCA (S/4HANA) by account, fund, and functional area, and agree it to FAGLFLEXT.'
];

const oraLedger = [
  ['GL_JE_BATCHES / GL_JE_HEADERS / GL_JE_LINES', 'General Ledger', 'Journal batch, header, and lines', 'JE_BATCH_ID, JE_HEADER_ID, JE_LINE_NUM', 'GL_BALANCES; GL_IMPORT_REFERENCES'],
  ['GL_BALANCES', 'General Ledger', 'Period balances by account combination', 'LEDGER_ID, CODE_COMBINATION_ID, PERIOD_NAME, ACTUAL_FLAG', 'Trial balance extract to DDRS'],
  ['GL_CODE_COMBINATIONS', 'General Ledger', 'Account strings: fund, USSGL account, and other segments', 'CODE_COMBINATION_ID', 'Every transaction distribution'],
  ['GL_IMPORT_REFERENCES', 'General Ledger', 'Link from a journal line to a subledger journal line', 'JE_HEADER_ID, JE_LINE_NUM, GL_SL_LINK_ID', 'XLA_AE_LINES'],
  ['XLA_AE_HEADERS / XLA_AE_LINES', 'Subledger Accounting', 'Subledger journal entries', 'AE_HEADER_ID, AE_LINE_NUM', 'XLA_EVENTS, XLA_TRANSACTION_ENTITIES'],
  ['XLA_TRANSACTION_ENTITIES', 'Subledger Accounting', 'One row per accounted transaction, with the source transaction ID', 'ENTITY_ID', 'AP_INVOICES_ALL, AP_CHECKS_ALL, RCV_TRANSACTIONS'],
  ['XLA_DISTRIBUTION_LINKS', 'Subledger Accounting', 'Link from a journal line to one source distribution', 'AE_HEADER_ID, AE_LINE_NUM, SOURCE_DISTRIBUTION_ID_NUM_1', 'AP_INVOICE_DISTRIBUTIONS_ALL']
];

const oraFederal = [
  ['FV_TREASURY_SYMBOLS', 'Federal Financials', 'Treasury Account Symbol master', 'TREASURY_SYMBOL_ID', 'FV_FUND_PARAMETERS'],
  ['FV_FUND_PARAMETERS', 'Federal Financials', 'Fund attributes: fund value to TAS and fund category', 'Fund value, ledger', 'Fund segment of GL_CODE_COMBINATIONS'],
  ['FV_BE_TRX_HDRS / FV_BE_TRX_DTLS', 'Federal Financials', 'Budget execution documents: appropriation, apportionment, allotment', 'DOC_ID, TRANSACTION_ID', 'Subledger Accounting, then GL'],
  ['FV_BUDGET_LEVELS', 'Federal Financials', 'Budget distribution levels', 'BUDGET_LEVEL_ID', 'FV_BE_TRX_HDRS'],
  ['FV_BE_INTERFACE', 'Federal Financials', 'Open interface for funding documents from budget systems', 'SOURCE, GROUP_ID, RECORD_NUMBER', 'FV_BE_TRX_HDRS'],
  ['FV_FACTS_ATTRIBUTES', 'Federal Financials', 'USSGL attributes for Treasury reporting', 'Account and attribute set', 'GTAS bulk file']
];

const oraP2p = [
  ['PO_REQUISITION_HEADERS_ALL / LINES_ALL / PO_REQ_DISTRIBUTIONS_ALL', 'Purchasing', 'Requisitions and their accounting distributions', 'REQUISITION_HEADER_ID, DISTRIBUTION_ID', 'PO_DISTRIBUTIONS_ALL.REQ_DISTRIBUTION_ID'],
  ['PO_HEADERS_ALL / PO_LINES_ALL / PO_LINE_LOCATIONS_ALL', 'Purchasing', 'Purchase order header, lines, and shipments', 'PO_HEADER_ID, PO_LINE_ID, LINE_LOCATION_ID', 'PO_DISTRIBUTIONS_ALL'],
  ['PO_DISTRIBUTIONS_ALL', 'Purchasing', 'Order accounting distributions and encumbrance', 'PO_DISTRIBUTION_ID', 'RCV_TRANSACTIONS, AP_INVOICE_DISTRIBUTIONS_ALL'],
  ['RCV_TRANSACTIONS', 'Receiving', 'Receive, accept, deliver, return', 'TRANSACTION_ID', 'PO_DISTRIBUTION_ID'],
  ['AP_INVOICES_ALL / AP_INVOICE_LINES_ALL / AP_INVOICE_DISTRIBUTIONS_ALL', 'Payables', 'Invoice header, lines, and distributions', 'INVOICE_ID, INVOICE_DISTRIBUTION_ID', 'AP_INVOICE_PAYMENTS_ALL'],
  ['AP_CHECKS_ALL / AP_INVOICE_PAYMENTS_ALL', 'Payables', 'Payments and the invoices each one paid', 'CHECK_ID, INVOICE_PAYMENT_ID', 'FV_TREASURY_CONFIRMATIONS_ALL'],
  ['AP_INVOICES_INTERFACE', 'Payables', 'Staging for invoices from WAWF and other feeders', 'Interface INVOICE_ID', 'AP_INVOICES_ALL']
];

const oraOther = [
  ['RA_CUSTOMER_TRX_ALL / RA_CUSTOMER_TRX_LINES_ALL', 'Receivables', 'Customer invoices, including reimbursable billings', 'CUSTOMER_TRX_ID', 'AR_PAYMENT_SCHEDULES_ALL'],
  ['AR_CASH_RECEIPTS_ALL', 'Receivables', 'Receipts and collections', 'CASH_RECEIPT_ID', 'AR_RECEIVABLE_APPLICATIONS_ALL'],
  ['PA_PROJECTS_ALL / PA_TASKS / PA_EXPENDITURE_ITEMS_ALL', 'Projects', 'Projects, tasks, and cost transactions', 'PROJECT_ID, TASK_ID, EXPENDITURE_ITEM_ID', 'PA_COST_DISTRIBUTION_LINES_ALL'],
  ['FA_ADDITIONS_B / FA_BOOKS / FA_DEPRN_SUMMARY', 'Assets', 'Asset master, financial rules, depreciation', 'ASSET_ID, BOOK_TYPE_CODE', 'FA_DISTRIBUTION_HISTORY']
];

const oraLogistics = [
  ['MTL_SYSTEM_ITEMS_B', 'Inventory', 'Item master', 'INVENTORY_ITEM_ID, ORGANIZATION_ID', 'MTL_MATERIAL_TRANSACTIONS'],
  ['MTL_MATERIAL_TRANSACTIONS', 'Inventory', 'Every stock movement', 'TRANSACTION_ID', 'MTL_TRANSACTION_ACCOUNTS'],
  ['MTL_ONHAND_QUANTITIES_DETAIL', 'Inventory', 'On-hand quantity by location', 'ONHAND_QUANTITIES_ID', 'Inventory valuation'],
  ['OE_ORDER_HEADERS_ALL / OE_ORDER_LINES_ALL', 'Order Management', 'Supply requests and orders', 'HEADER_ID, LINE_ID', 'Shipping and receiving'],
  ['PO_HEADERS_ALL / PO_DISTRIBUTIONS_ALL', 'Purchasing', 'Purchase orders and their accounting', 'PO_HEADER_ID, PO_DISTRIBUTION_ID', 'RCV_TRANSACTIONS'],
  ['RCV_TRANSACTIONS', 'Receiving', 'Receipts and deliveries', 'TRANSACTION_ID', 'MTL_MATERIAL_TRANSACTIONS']
];

const oraJoins = [
  'GL line to subledger: GL_JE_LINES to GL_IMPORT_REFERENCES on JE_HEADER_ID and JE_LINE_NUM, then to XLA_AE_LINES on GL_SL_LINK_ID.',
  'Subledger entry to transaction: XLA_AE_HEADERS to XLA_TRANSACTION_ENTITIES on ENTITY_ID. SOURCE_ID_INT_1 is the invoice, payment, or receipt ID.',
  'Invoice to obligation: AP_INVOICE_DISTRIBUTIONS_ALL.PO_DISTRIBUTION_ID equals PO_DISTRIBUTIONS_ALL.PO_DISTRIBUTION_ID.',
  'Obligation to commitment: PO_DISTRIBUTIONS_ALL.REQ_DISTRIBUTION_ID equals PO_REQ_DISTRIBUTIONS_ALL.DISTRIBUTION_ID.',
  'Account to Treasury symbol: fund segment of GL_CODE_COMBINATIONS to FV_FUND_PARAMETERS, then to FV_TREASURY_SYMBOLS.',
  'Trial balance: GL_BALANCES joined to GL_CODE_COMBINATIONS with ACTUAL_FLAG A, and agreed to posted GL_JE_LINES.'
];

const sapBasis = 'Standard SAP product tables. Custom Z-tables, enhancements, and the exact module scope of this program are not public. Confirm in the program data dictionary.';
const oraBasis = 'Standard Oracle E-Business Suite product tables. Program-specific extensions and descriptive flexfield usage are not public. Confirm in the eTRM for the release in use.';
const logicalBasis = 'Logical records reconstructed from public process descriptions. The physical schema of this system is not public, so names below are descriptive and are not table names.';

const legacyLedger = (system) => [
  ['Fund control record', 'Funds', 'Authority received and distributed by appropriation, limit, and fiscal year', 'Fund cite', 'Document records'],
  ['Document record', 'Execution', 'One obligation document with commitment, obligation, accrual, and paid amounts', 'Document number', 'Transaction history'],
  ['Transaction history', 'Execution', 'Each update to a document: type code, amount, date, batch', 'Document number, sequence', 'Document record'],
  ['Journal voucher', 'Adjustment', 'Manual adjustment with preparer, approver, and support', 'Voucher number', 'Affected fund and account'],
  ['Feeder file to DDRS', 'Reporting', `${system} balances by fund cite and Report Data Type or General Ledger Account Code`, 'File, period', 'DDRS-B crosswalk']
];

const legacyJoins = [
  'DDRS balance to feeder file: match on entity, period, and fund cite, then on Report Data Type or General Ledger Account Code.',
  'Feeder file total to document records: sum stage amounts by fund cite.',
  'Document record to source evidence: document number to the contract, travel order, or requisition held in the feeder system.'
];

export const dataModels = {
  gfebs: {
    platform: 'sap', platformLabel: 'SAP ERP', basis: sapBasis,
    tables: [...sapFinance, ...sapFunds, ...sapPurchasing, ...sapCost, ...sapSales, ...sapAssets, ...sapIdoc],
    joins: sapJoins
  },
  'navy-erp': {
    platform: 'sap', platformLabel: 'SAP ERP', basis: sapBasis,
    tables: [...sapFinance, ...sapFunds, ...sapPurchasing, ...sapCost, ...sapSales, ...sapLogistics.slice(0, 2), ...sapIdoc],
    joins: sapJoins
  },
  'gcss-army': {
    platform: 'sap', platformLabel: 'SAP ERP', basis: sapBasis,
    tables: [...sapLogistics, ...sapPurchasing.slice(0, 5), ...sapFinance.slice(0, 2), ...sapFunds.slice(4, 6), ...sapIdoc],
    joins: [
      'Stock movement to financial document: MKPF and MSEG to BKPF through AWTYP MKPF and AWKEY.',
      'Maintenance order to parts: AFIH and AUFK to RESB by reservation, then to MSEG goods issues.',
      'Receipt to purchase order: MSEG-EBELN and EBELP, with history in EKBE.',
      'Inventory value: MARD quantity times MBEW price, agreed to the inventory GL accounts.'
    ]
  },
  lmp: {
    platform: 'sap', platformLabel: 'SAP ERP', basis: sapBasis,
    tables: [...sapLogistics.slice(0, 2), ...sapProduction, ...sapPurchasing.slice(1, 6), ...sapSales, ...sapFinance, ...sapCost.slice(1)],
    joins: [
      'Sale to revenue: VBAK to VBFA to VBRK, then BKPF through AWTYP VBRK.',
      'Depot order cost: AUFK and AFKO to COEP line items, or ACDOCA in S/4HANA.',
      'Inventory value: MBEW and the material ledger, agreed to inventory GL accounts.',
      'Purchase to payable: EKKO to EKBE to RBKP to BKPF.'
    ]
  },
  'dla-ebs': {
    platform: 'sap', platformLabel: 'SAP ERP', basis: sapBasis,
    tables: [...sapSales, ...sapProduction.slice(2), ...sapLogistics.slice(0, 2), ...sapPurchasing.slice(1), ...sapFinance],
    joins: [
      'Customer order to bill: VBAK to LIKP to VBRK through VBFA.',
      'Bill to revenue and receivable: VBRK to BKPF through AWKEY, open items in BSID.',
      'Supplier order to payment: EKKO to EKBE to RBKP to REGUP.',
      'Inventory value: MARD and MBEW, agreed to inventory GL accounts.'
    ]
  },
  dai: {
    platform: 'oracle-ebs', platformLabel: 'Oracle E-Business Suite', basis: oraBasis,
    tables: [...oraLedger, ...oraFederal, ...oraP2p, ...oraOther],
    joins: oraJoins
  },
  deams: {
    platform: 'oracle-ebs', platformLabel: 'Oracle E-Business Suite', basis: oraBasis,
    tables: [...oraLedger, ...oraFederal, ...oraP2p, ...oraOther],
    joins: oraJoins
  },
  'gcss-mc': {
    platform: 'oracle-ebs', platformLabel: 'Oracle E-Business Suite', basis: oraBasis,
    tables: [...oraLogistics, ...oraLedger.slice(4, 7)],
    joins: [
      'Stock movement to accounting: MTL_MATERIAL_TRANSACTIONS to MTL_TRANSACTION_ACCOUNTS on TRANSACTION_ID.',
      'Receipt to order: RCV_TRANSACTIONS.PO_DISTRIBUTION_ID to PO_DISTRIBUTIONS_ALL.',
      'Logistics event to the Marine Corps ledger: subledger journal in the XLA tables, then the interface to the accounting system.'
    ]
  },
  ddrs: {
    platform: 'ddrs', platformLabel: 'DDRS deep dive', basis: logicalBasis,
    tables: [
      ['Feeder file', 'DDRS-B intake', 'One file per source system and period, with record count and control total', 'File, source system, period', 'Feeder records'],
      ['Feeder record', 'DDRS-B intake', 'Balance by TAS and Report Data Type, General Ledger Account Code, or DoD SCOA account', 'File, line', 'Crosswalk rule'],
      ['Crosswalk rule', 'DDRS-B processing', 'Mapping from a legacy code to budgetary and proprietary USSGL accounts', 'Source code, attributes', 'Trial balance line'],
      ['Trial balance line', 'DDRS-B processing', 'Unadjusted ending balance', 'Entity, period, TAS, account, attributes', 'Adjusted trial balance'],
      ['Journal voucher and lines', 'Adjustment', 'Category A to M, system or manual, root cause, preparer, approver', 'JV number, line', 'Adjusted trial balance'],
      ['Adjustment logs', 'Adjustment', 'Journal Voucher, Feeder Trial Balance, Pre-Closing, and Undistributed logs', 'Log type, period', 'Journal vouchers'],
      ['Data call (DCM)', 'DDRS-AFS input', 'Amounts collected outside accounting systems', 'Call, entity, period', 'Category M journal voucher'],
      ['Elimination pair', 'DDRS-AFS processing', 'Buyer and seller balances by trading partner', 'Entity, partner, category', 'Category C journal voucher'],
      ['Statement line map', 'DDRS-AFS processing', 'USSGL account and attributes to statement line', 'Statement, line, account', 'Statement and note amounts'],
      ['GTAS bulk record', 'Treasury output', '98-character adjusted trial balance record with 33 fields', 'Fiscal year, period, TAS, USSGL account, attributes', 'Treasury GTAS']
    ],
    joins: [
      'Statement line to adjusted trial balance: statement crosswalk on USSGL account and attributes.',
      'Adjusted to unadjusted trial balance: same keys. The difference equals the logged journal vouchers.',
      'Unadjusted trial balance to source ledger: entity, TAS, DoD SCOA account, attributes.',
      'GTAS record to adjusted trial balance: TAS components and six-digit USSGL account.'
    ]
  },
  'gtas-cars': {
    platform: 'ddrs', platformLabel: 'DDRS deep dive (GTAS record layout)', basis: 'GTAS fields follow the Treasury bulk file format for fiscal year 2026. CARS records are described logically.',
    tables: [
      ['GTAS ATB record: TAS', 'GTAS', 'Allocation transfer agency, agency identifier, period of availability, availability type, main account, sub-account', 'Positions 7 to 28', 'Treasury TAS master'],
      ['GTAS ATB record: account and amount', 'GTAS', 'Six-digit USSGL account, amount with two implied decimals, debit or credit, beginning or ending', 'Positions 29 to 57', 'USSGL attribute table'],
      ['GTAS ATB record: budgetary attributes', 'GTAS', 'Authority type, reimbursable flag, apportionment category, program, year of budget authority, BEA category', 'Positions 58 to 66, 75 to 79', 'SF 133 lines'],
      ['GTAS ATB record: trading partner', 'GTAS', 'Federal indicator, partner agency, partner main account', 'Positions 67 to 74', 'Intragovernmental eliminations'],
      ['GTAS ATB record: other attributes', 'GTAS', 'Exchange, custodial, budget impact, prior year adjustment, cohort year, emergency fund code, reduction type, object class', 'Positions 80 to 98', 'Statement crosswalks'],
      ['CARS account statement', 'CARS', 'Fund Balance with Treasury activity and balance by TAS', 'TAS, period', 'USSGL 1010 by TAS'],
      ['CARS classified transaction', 'CARS', 'Payment or collection with its classification', 'Agency Location Code, TAS, BETC', 'Disbursing system voucher']
    ],
    joins: [
      'GTAS to DDRS: TAS components and six-digit USSGL account.',
      'GTAS to CARS: USSGL 1010 by TAS equals the CARS balance for that TAS.',
      'CARS transaction to disbursing voucher: Agency Location Code, date, and voucher or schedule number.'
    ]
  },
  'dod-treasury-close': {
    platform: 'integration', platformLabel: 'Tables, models, and systems', basis: 'This page is a cross-system process. The records below name where each close step is stored.',
    tables: [
      ['General ledger balance', 'Component ledger', 'SAP: FAGLFLEXT or ACDOCA. Oracle: GL_BALANCES.', 'Entity, account, fund, period', 'Trial balance extract'],
      ['SFIS trial balance', 'Extract', 'Balance by TAS, DoD SCOA account, and attributes', 'Entity, period, TAS, account', 'DDRS-B'],
      ['Disbursing voucher', 'Disbursing', 'Payment or collection processed by ADS, DDS, or Treasury', 'Agency Location Code, voucher number', 'CARS and the ledger payment'],
      ['DDRS journal voucher', 'DDRS', 'Reporting adjustment with category and approval', 'JV number', 'Adjusted trial balance'],
      ['GTAS bulk record', 'Treasury', '98-character adjusted trial balance record', 'TAS, USSGL account, attributes', 'SF 133 and governmentwide statements'],
      ['CARS account statement', 'Treasury', 'Fund Balance with Treasury by TAS', 'TAS, period', 'USSGL 1010']
    ],
    joins: [
      'Ledger payment to disbursing voucher to CARS: voucher number and TAS.',
      'Ledger balance to trial balance to DDRS to GTAS: TAS and account at each step.',
      'SF 133 to Statement of Budgetary Resources: both built from the same adjusted balances.'
    ]
  },
  stars: { platform: 'other-platforms', platformLabel: 'Legacy platforms', basis: logicalBasis, tables: legacyLedger('STARS'), joins: legacyJoins },
  sabrs: { platform: 'other-platforms', platformLabel: 'Legacy platforms', basis: logicalBasis, tables: legacyLedger('SABRS'), joins: legacyJoins },
  famis: { platform: 'other-platforms', platformLabel: 'Legacy platforms', basis: logicalBasis, tables: legacyLedger('FAMIS'), joins: legacyJoins },
  gafs: { platform: 'other-platforms', platformLabel: 'Legacy platforms', basis: logicalBasis, tables: legacyLedger('GAFS'), joins: legacyJoins },
  'gafs-jv': {
    platform: 'other-platforms', platformLabel: 'Legacy platforms', basis: logicalBasis,
    tables: [
      ['Journal voucher header', 'Adjustment', 'Voucher number, type, period, preparer, approver, reason', 'Voucher number', 'Voucher lines'],
      ['Journal voucher line', 'Adjustment', 'Fund cite, account or stage, debit or credit amount', 'Voucher number, line', 'Fund and document records'],
      ['Support package', 'Evidence', 'Source reports, reconciliation, and approval evidence', 'Voucher number', 'Journal voucher header'],
      ['Reversal link', 'Adjustment', 'Reference from an accrual or temporary voucher to its reversal', 'Original and reversing voucher numbers', 'Journal voucher header'],
      ['Feeder file to DDRS', 'Reporting', 'Post-adjustment balances by fund cite', 'File, period', 'DDRS-B']
    ],
    joins: [
      'Voucher to balance: fund cite and account on the voucher line to the adjusted balance.',
      'Voucher to support: voucher number to the retained package.',
      'GAFS voucher to DDRS: confirm the same adjustment is not also recorded as a DDRS journal voucher.'
    ]
  },
  cefms: {
    platform: 'other-platforms', platformLabel: 'Legacy and custom platforms', basis: logicalBasis,
    tables: [
      ['Funding account', 'Funds', 'Appropriation and work item funding', 'Appropriation, work item', 'Obligations'],
      ['Purchase request and commitment', 'Execution', 'Request with certified funds', 'Request number', 'Obligation'],
      ['Obligation', 'Execution', 'Contract or order obligation with line detail', 'Obligation number, line', 'Receiving report, invoice'],
      ['Receiving report and invoice', 'Execution', 'Receipt, acceptance, and vendor invoice', 'Document number', 'Disbursement'],
      ['Labor and project cost', 'Cost', 'Labor charges and project cost transactions', 'Project, work item, period', 'General ledger'],
      ['General ledger entry', 'Ledger', 'USSGL posting for each event', 'Entry number', 'Trial balance to DDRS']
    ],
    joins: [
      'Obligation to payment: obligation number through receiving report and invoice to disbursement.',
      'Project cost to ledger: work item and period to general ledger entries.',
      'Trial balance to DDRS: entity, TAS, account.'
    ]
  },
  abss: {
    platform: 'other-platforms', platformLabel: 'Legacy platforms', basis: logicalBasis,
    tables: [
      ['Request document', 'Requirements', 'Purchase request or funding document with line items', 'Document number', 'Funding lines'],
      ['Funding line', 'Funds', 'Line of accounting and amount on a request', 'Document number, line', 'Commitment'],
      ['Approval and certification', 'Control', 'Approver, certifier, date, and action', 'Document number, step', 'Request document'],
      ['Commitment record', 'Execution', 'Certified commitment sent to accounting', 'Document number', 'Accounting system document record'],
      ['Contracting handoff', 'Execution', 'Reference from the request to the award', 'Request number, contract number', 'Obligation in accounting']
    ],
    joins: [
      'Commitment to accounting: document number to the accounting system document record.',
      'Request to award: request number to the contract number in EDA.',
      'Approval evidence: document number to the certification record.'
    ]
  },
  mocas: {
    platform: 'other-platforms', platformLabel: 'Legacy platforms', basis: logicalBasis,
    tables: [
      ['Contract record', 'Contract administration', 'Contract header and administration data', 'Contract number (PIID)', 'Line items, accounting lines'],
      ['Contract line item', 'Contract administration', 'CLIN and SLIN quantity, price, delivery', 'PIID, CLIN', 'Shipments, invoices'],
      ['Accounting classification line', 'Funds', 'Line of accounting and obligated amount by ACRN', 'PIID, ACRN', 'Disbursement by line of accounting'],
      ['Shipment and acceptance', 'Performance', 'Receiving report data from WAWF', 'PIID, shipment number', 'Invoice entitlement'],
      ['Invoice and financing request', 'Entitlement', 'Invoices, progress payments, performance-based payments', 'PIID, invoice number', 'Payment'],
      ['Payment and disbursement', 'Disbursing', 'Voucher with amounts by ACRN', 'Voucher number', 'Accounting system and Treasury']
    ],
    joins: [
      'Payment to obligation: PIID and ACRN on the voucher to the accounting system obligation.',
      'Invoice to acceptance: PIID, CLIN, and shipment number.',
      'Contract to EDA: PIID and modification number.'
    ]
  },
  piee: {
    platform: 'other-platforms', platformLabel: 'Legacy and feeder platforms', basis: logicalBasis,
    tables: [
      ['Contract document (EDA)', 'Award', 'Contract and modification with funding lines', 'PIID, modification number', 'Accounting system obligation'],
      ['Invoice (WAWF)', 'Payment evidence', 'Vendor invoice with line items', 'PIID, invoice number', 'Entitlement system'],
      ['Receiving report (WAWF)', 'Payment evidence', 'Shipment, inspection, and acceptance', 'PIID, shipment number', 'Invoice, property record'],
      ['Workflow history', 'Control', 'Each action by vendor, inspector, acceptor, and pay official', 'Document, step', 'Invoice and receiving report'],
      ['Property transfer (GFP)', 'Property', 'Government furnished property shipments and receipts', 'PIID, item identifier', 'Property system of record'],
      ['Interface transaction', 'Integration', 'Outbound file to accounting and entitlement systems through GEX', 'Transaction set, control number', 'IDoc or open interface row']
    ],
    joins: [
      'Invoice to obligation: PIID and CLIN to the purchase order in the accounting system.',
      'Invoice to acceptance: PIID and shipment number.',
      'Interface transaction to ledger: control number to the IDoc or interface batch.'
    ]
  },
  'disbursing-cash': {
    platform: 'other-platforms', platformLabel: 'Legacy and DFAS platforms', basis: logicalBasis,
    tables: [
      ['Payment voucher', 'Disbursing', 'Certified payment with payee and amounts by line of accounting', 'Agency Location Code, voucher number', 'Accounting system payment'],
      ['Collection voucher', 'Disbursing', 'Collection with source and line of accounting', 'Agency Location Code, voucher number', 'Accounting system receipt'],
      ['Payment file', 'Treasury', 'Check and EFT schedule', 'Schedule number', 'Treasury confirmation'],
      ['Statement of accountability', 'Accountability', 'Disbursing officer cash accountability for the period', 'Agency Location Code, period', 'CARS'],
      ['Cash transaction (DCAS)', 'Cash accountability', 'Disbursement or collection by TAS reported to Treasury', 'TAS, voucher number', 'Fund Balance with Treasury reconciliation'],
      ['Undistributed item', 'Reconciliation', 'Cash reported to Treasury and not yet matched in accounting', 'Voucher number, TAS', 'DDRS category D journal voucher']
    ],
    joins: [
      'Voucher to ledger: voucher number and line of accounting to the payment document.',
      'Voucher to Treasury: Agency Location Code and TAS to CARS.',
      'Undistributed item to DDRS: TAS and amount to the category D journal voucher.'
    ]
  },
  ipac: {
    platform: 'other-platforms', platformLabel: 'Treasury platforms', basis: logicalBasis,
    tables: [
      ['IPAC transaction', 'Settlement', 'Payment or collection between two agencies', 'IPAC document reference number', 'Buyer and seller ledger entries'],
      ['Sender and receiver', 'Settlement', 'Agency Location Codes of both parties', 'Sender ALC, receiver ALC', 'Trading partner'],
      ['TAS and BETC lines', 'Classification', 'Treasury account and business event type for each side', 'TAS, BETC', 'CARS'],
      ['Descriptive data', 'Reference', 'Obligating document number, purchase order, invoice, contact', 'Document numbers', 'MIPR or G-Invoicing order'],
      ['G-Invoicing order and performance', 'Agreement', 'Order and delivered or received performance that triggers settlement', 'Order number, performance number', 'IPAC transaction']
    ],
    joins: [
      'IPAC to ledger: document reference number and obligating document number.',
      'IPAC to CARS: Agency Location Code, TAS, and BETC.',
      'Buyer to seller: trading partner TAS on both sides for elimination.'
    ]
  }
};

export function getDataModel(slug) {
  return dataModels[slug] || null;
}
