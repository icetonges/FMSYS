import { h2, h3, p, list, steps, callout, table, figure } from './blocks';

const architecture = {
  id: 'ora-arch',
  cols: 4,
  colWidth: 215,
  colGap: 46,
  rowGap: 56,
  rowLabels: ['Client tier', 'Application tier', 'Database tier'],
  nodes: [
    { id: 'browser', col: 0, row: 0, tone: 'source', title: 'Web browser', lines: ['HTML pages built on Oracle Application Framework', 'Self-service and workflow approvals'] },
    { id: 'forms', col: 1, row: 0, tone: 'source', title: 'Forms client', lines: ['Java-based professional forms', 'Used by most accounting screens'] },
    { id: 'ext', col: 2, row: 0, tone: 'source', title: 'External systems', lines: ['Files through GEX', 'Web services', 'Data loads into interface tables'] },
    { id: 'ohs', col: 0, row: 1, tone: 'process', title: 'Oracle HTTP Server', lines: ['Entry point for all web requests', 'Routes to WebLogic'] },
    { id: 'wls', col: 1, row: 1, tone: 'process', title: 'Oracle WebLogic Server', lines: ['Managed servers: oacore, oafm, forms, forms-c4ws', 'Admin server controls the domain'] },
    { id: 'cp', col: 2, row: 1, tone: 'process', title: 'Concurrent Processing', lines: ['Internal Concurrent Manager', 'Standard and specialized managers', 'Conflict resolution manager', 'Runs imports, Create Accounting, reports'] },
    { id: 'fs', col: 3, row: 1, tone: 'reporting', title: 'Application file system', lines: ['fs1 and fs2: run and patch copies', 'fs_ne: logs, output, import files', 'AutoConfig context file'] },
    { id: 'db', col: 0, row: 2, span: 2, tone: 'statements', title: 'Oracle Database', lines: ['APPS schema: synonyms, views, and PL/SQL packages that all code connects through', 'Product schemas own the tables: GL, AP, AR, PO, FA, XLA, FV, INV, PA', 'APPLSYS owns the FND foundation tables: users, responsibilities, flexfields, concurrent requests'] },
    { id: 'intf', col: 2, row: 2, tone: 'detail', title: 'Open interface tables', lines: ['GL_INTERFACE', 'AP_INVOICES_INTERFACE', 'PO_HEADERS_INTERFACE', 'FV_BE_INTERFACE'] },
    { id: 'ed', col: 3, row: 2, tone: 'reporting', title: 'Database editions', lines: ['Run, patch, and old editions', 'Online patching with adop: prepare, apply, finalize, cutover, cleanup'] }
  ],
  edges: [
    { from: 'browser', to: 'ohs' },
    { from: 'forms', to: 'wls' },
    { from: 'ext', to: 'cp', label: 'files, loads' },
    { from: 'ohs', to: 'wls' },
    { from: 'wls', to: 'db', sx: -40, tx: 90, label: 'JDBC' },
    { from: 'cp', to: 'intf' },
    { from: 'intf', to: 'db', label: 'import' },
    { from: 'fs', to: 'ed', dashed: true, label: 'cutover swaps both' }
  ]
};

const orgModel = {
  id: 'ora-org',
  cols: 3,
  colWidth: 250,
  colGap: 70,
  rowGap: 60,
  nodes: [
    { id: 'bg', col: 0, row: 0, tone: 'source', title: 'Business group', lines: ['HR_ALL_ORGANIZATION_UNITS', 'Top of the HR organization model'] },
    { id: 'ledger', col: 1, row: 0, tone: 'accounting', title: 'Ledger', lines: ['GL_LEDGERS', 'Chart of accounts, calendar, currency, accounting method', 'Budgetary control switch'] },
    { id: 'le', col: 2, row: 0, tone: 'accounting', title: 'Legal entity', lines: ['XLE_ENTITY_PROFILES', 'Owner of the books'] },
    { id: 'aff', col: 0, row: 1, tone: 'detail', title: 'Accounting Flexfield', lines: ['GL_CODE_COMBINATIONS', 'SEGMENT1 to SEGMENT30', 'One row per valid account string'] },
    { id: 'ou', col: 1, row: 1, tone: 'process', title: 'Operating unit', lines: ['HR_OPERATING_UNITS', 'ORG_ID on every _ALL table', 'Partitions AP, AR, PO, and Projects data'] },
    { id: 'resp', col: 2, row: 1, tone: 'reporting', title: 'Responsibility', lines: ['FND_RESPONSIBILITY', 'Menu, data group, request group', 'Profile MO: Security Profile sets which operating units a user sees'] },
    { id: 'inv', col: 1, row: 2, tone: 'process', title: 'Inventory organization', lines: ['MTL_PARAMETERS', 'ORGANIZATION_ID on item, stock, and receiving tables'] }
  ],
  edges: [
    { from: 'ledger', to: 'ou', label: 'primary ledger', ly: 12 },
    { from: 'le', to: 'ou', label: 'default legal context', my: -16, tx: 60 },
    { from: 'ou', to: 'inv' },
    { from: 'ledger', to: 'aff', sx: -60, label: 'chart of accounts', my: -16 },
    { from: 'resp', to: 'ou', label: 'grants access' }
  ]
};

const slaModel = {
  id: 'ora-sla',
  cols: 4,
  colWidth: 226,
  colGap: 64,
  rowGap: 62,
  rowLabels: ['Subledger transaction and Subledger Accounting (XLA)', 'Link from subledger journal to GL journal', 'General Ledger'],
  nodes: [
    { id: 'src', col: 0, row: 0, kind: 'entity', tone: 'detail', title: 'AP_INVOICE_DISTRIBUTIONS_ALL', lines: ['*INVOICE_DISTRIBUTION_ID', 'INVOICE_ID', 'PO_DISTRIBUTION_ID', 'DIST_CODE_COMBINATION_ID', 'ACCOUNTING_EVENT_ID', '(example source table)'] },
    { id: 'ent', col: 1, row: 0, kind: 'entity', tone: 'process', title: 'XLA_TRANSACTION_ENTITIES', lines: ['*ENTITY_ID', 'APPLICATION_ID', 'ENTITY_CODE  AP_INVOICES', 'SOURCE_ID_INT_1  invoice id', 'LEDGER_ID'] },
    { id: 'evt', col: 2, row: 0, kind: 'entity', tone: 'process', title: 'XLA_EVENTS', lines: ['*EVENT_ID', 'ENTITY_ID', 'EVENT_TYPE_CODE', 'EVENT_DATE', 'EVENT_STATUS_CODE', 'PROCESS_STATUS_CODE'] },
    { id: 'aeh', col: 3, row: 0, kind: 'entity', tone: 'process', title: 'XLA_AE_HEADERS', lines: ['*AE_HEADER_ID', 'EVENT_ID, ENTITY_ID', 'LEDGER_ID', 'ACCOUNTING_DATE', 'BALANCE_TYPE_CODE  A, B, E', 'GL_TRANSFER_STATUS_CODE'] },
    { id: 'dl', col: 0, row: 1, kind: 'entity', tone: 'process', title: 'XLA_DISTRIBUTION_LINKS', lines: ['*APPLICATION_ID, EVENT_ID,', '*AE_HEADER_ID, AE_LINE_NUM,', '*TEMP_LINE_NUM', 'SOURCE_DISTRIBUTION_TYPE', 'SOURCE_DISTRIBUTION_ID_NUM_1'] },
    { id: 'jel', col: 1, row: 1, kind: 'entity', tone: 'accounting', title: 'GL_JE_LINES', lines: ['*JE_HEADER_ID, JE_LINE_NUM', 'CODE_COMBINATION_ID', 'ENTERED_DR, ENTERED_CR', 'ACCOUNTED_DR, ACCOUNTED_CR', 'GL_SL_LINK_ID'] },
    { id: 'gir', col: 2, row: 1, kind: 'entity', tone: 'accounting', title: 'GL_IMPORT_REFERENCES', lines: ['*JE_HEADER_ID, JE_LINE_NUM', 'GL_SL_LINK_ID', 'GL_SL_LINK_TABLE', 'JE_BATCH_ID'] },
    { id: 'ael', col: 3, row: 1, kind: 'entity', tone: 'process', title: 'XLA_AE_LINES', lines: ['*AE_HEADER_ID, AE_LINE_NUM', 'CODE_COMBINATION_ID', 'ACCOUNTING_CLASS_CODE', 'ENTERED_DR, ENTERED_CR', 'ACCOUNTED_DR, ACCOUNTED_CR', 'GL_SL_LINK_ID'] },
    { id: 'bal', col: 0, row: 2, kind: 'entity', tone: 'statements', title: 'GL_BALANCES', lines: ['*LEDGER_ID, CODE_COMBINATION_ID,', '*CURRENCY_CODE, PERIOD_NAME,', '*ACTUAL_FLAG, ...', 'BEGIN_BALANCE_DR / CR', 'PERIOD_NET_DR / CR'] },
    { id: 'jeh', col: 1, row: 2, kind: 'entity', tone: 'accounting', title: 'GL_JE_HEADERS', lines: ['*JE_HEADER_ID', 'JE_BATCH_ID, LEDGER_ID', 'JE_SOURCE, JE_CATEGORY', 'PERIOD_NAME, STATUS', 'ACTUAL_FLAG  A, B, E'] },
    { id: 'jeb', col: 2, row: 2, kind: 'entity', tone: 'accounting', title: 'GL_JE_BATCHES', lines: ['*JE_BATCH_ID', 'NAME, STATUS', 'POSTED_DATE', 'APPROVAL_STATUS_CODE'] },
    { id: 'ccid', col: 3, row: 2, kind: 'entity', tone: 'detail', title: 'GL_CODE_COMBINATIONS', lines: ['*CODE_COMBINATION_ID', 'CHART_OF_ACCOUNTS_ID', 'SEGMENT1 .. SEGMENT30', 'ACCOUNT_TYPE', 'ENABLED_FLAG'] }
  ],
  edges: [
    { from: 'src', to: 'ent', label: 'invoice id' },
    { from: 'ent', to: 'evt', label: 'ENTITY_ID' },
    { from: 'evt', to: 'aeh', label: 'EVENT_ID' },
    { from: 'aeh', to: 'ael', label: 'AE_HEADER_ID' },
    { from: 'ael', to: 'gir', label: 'GL_SL_LINK_ID' },
    { from: 'gir', to: 'jel', label: 'hdr + line' },
    { from: 'src', to: 'dl', label: 'distribution id' },
    { from: 'jel', to: 'jeh', label: 'JE_HEADER_ID' },
    { from: 'jeh', to: 'jeb', label: 'JE_BATCH_ID' },
    { from: 'jel', to: 'bal', sx: -70, label: 'posting' },
    { from: 'ael', to: 'ccid', label: 'CCID' }
  ]
};

const p2p = {
  id: 'ora-p2p',
  cols: 5,
  colWidth: 178,
  colGap: 34,
  rowGap: 50,
  rowLabels: ['Business step', 'Tables written', 'Accounting effect through Subledger Accounting'],
  nodes: [
    { id: 's1', col: 0, row: 0, tone: 'source', title: 'Requisition', lines: ['iProcurement or Purchasing form', 'Funds reserved on approval'] },
    { id: 's2', col: 1, row: 0, tone: 'source', title: 'Purchase order', lines: ['AutoCreate or contract interface', 'Approval workflow'] },
    { id: 's3', col: 2, row: 0, tone: 'source', title: 'Receipt', lines: ['Receiving transaction', 'Accept, deliver'] },
    { id: 's4', col: 3, row: 0, tone: 'source', title: 'Invoice', lines: ['Payables invoice or open interface', 'Match to PO or receipt, validate'] },
    { id: 's5', col: 4, row: 0, tone: 'source', title: 'Payment', lines: ['Payment process request', 'Treasury confirmation in Federal'] },
    { id: 't1', col: 0, row: 1, kind: 'entity', tone: 'detail', title: 'PO_REQUISITION_', lines: ['HEADERS_ALL', 'LINES_ALL', 'PO_REQ_DISTRIBUTIONS_ALL', '*DISTRIBUTION_ID'] },
    { id: 't2', col: 1, row: 1, kind: 'entity', tone: 'detail', title: 'PO_HEADERS_ALL', lines: ['PO_LINES_ALL', 'PO_LINE_LOCATIONS_ALL', 'PO_DISTRIBUTIONS_ALL', '*PO_DISTRIBUTION_ID'] },
    { id: 't3', col: 2, row: 1, kind: 'entity', tone: 'detail', title: 'RCV_TRANSACTIONS', lines: ['RCV_SHIPMENT_HEADERS', 'RCV_SHIPMENT_LINES', '*TRANSACTION_ID', 'PO_DISTRIBUTION_ID'] },
    { id: 't4', col: 3, row: 1, kind: 'entity', tone: 'detail', title: 'AP_INVOICES_ALL', lines: ['AP_INVOICE_LINES_ALL', 'AP_INVOICE_', 'DISTRIBUTIONS_ALL', '*INVOICE_DISTRIBUTION_ID'] },
    { id: 't5', col: 4, row: 1, kind: 'entity', tone: 'detail', title: 'AP_CHECKS_ALL', lines: ['AP_INVOICE_PAYMENTS_ALL', 'IBY_PAYMENTS_ALL', 'FV_TREASURY_', 'CONFIRMATIONS_ALL'] },
    { id: 'a1', col: 0, row: 2, tone: 'accounting', title: 'Commitment', lines: ['USSGL 4610 to 4700', 'Funds check in GL_BC_PACKETS'] },
    { id: 'a2', col: 1, row: 2, tone: 'accounting', title: 'Obligation', lines: ['USSGL 4700 to 4801', 'Requisition commitment reversed'] },
    { id: 'a3', col: 2, row: 2, tone: 'accounting', title: 'Accrued expenditure', lines: ['USSGL 4801 to 4901', 'Expense or asset and accrued liability'] },
    { id: 'a4', col: 3, row: 2, tone: 'accounting', title: 'Payable', lines: ['USSGL 2110 accounts payable', 'Accrual cleared on match'] },
    { id: 'a5', col: 4, row: 2, tone: 'accounting', title: 'Outlay', lines: ['USSGL 4901 to 4902', '2110 to 1010 FBWT at confirmation'] }
  ],
  edges: [
    { from: 's1', to: 's2' }, { from: 's2', to: 's3' }, { from: 's3', to: 's4' }, { from: 's4', to: 's5' },
    { from: 's1', to: 't1' }, { from: 's2', to: 't2' }, { from: 's3', to: 't3' }, { from: 's4', to: 't4' }, { from: 's5', to: 't5' },
    { from: 't1', to: 'a1' }, { from: 't2', to: 'a2' }, { from: 't3', to: 'a3' }, { from: 't4', to: 'a4' }, { from: 't5', to: 'a5' }
  ]
};

const federal = {
  id: 'ora-fed',
  cols: 4,
  colWidth: 222,
  colGap: 62,
  rowGap: 60,
  rowLabels: ['Fund identity', 'Budget execution transactions', 'Load and report'],
  nodes: [
    { id: 'tas', col: 0, row: 0, kind: 'entity', tone: 'detail', title: 'FV_TREASURY_SYMBOLS', lines: ['*TREASURY_SYMBOL_ID', 'TREASURY_SYMBOL', 'Agency, main account, sub', 'Period of availability', 'Expiration and cancel dates'] },
    { id: 'fund', col: 1, row: 0, kind: 'entity', tone: 'detail', title: 'FV_FUND_PARAMETERS', lines: ['*FUND_VALUE, ledger', 'TREASURY_SYMBOL_ID', 'Fund category', 'Fund attributes for', 'budgetary reporting'] },
    { id: 'ccid', col: 2, row: 0, kind: 'entity', tone: 'accounting', title: 'GL_CODE_COMBINATIONS', lines: ['*CODE_COMBINATION_ID', 'Balancing segment = fund', 'Natural account = USSGL', 'Other segments: org,', 'program, object class'] },
    { id: 'attr', col: 3, row: 0, kind: 'entity', tone: 'detail', title: 'FV_FACTS_ATTRIBUTES', lines: ['USSGL account attributes', 'required for Treasury', 'reporting (GTAS, formerly', 'FACTS I and II)'] },
    { id: 'lvl', col: 0, row: 1, kind: 'entity', tone: 'process', title: 'FV_BUDGET_LEVELS', lines: ['*BUDGET_LEVEL_ID, ledger', 'Appropriation', 'Apportionment', 'Allotment', 'Lower distribution levels'] },
    { id: 'hdr', col: 1, row: 1, kind: 'entity', tone: 'process', title: 'FV_BE_TRX_HDRS', lines: ['*DOC_ID', 'DOC_NUMBER', 'BUDGET_LEVEL_ID', 'FUND_VALUE', 'Approval status'] },
    { id: 'dtl', col: 2, row: 1, kind: 'entity', tone: 'process', title: 'FV_BE_TRX_DTLS', lines: ['*TRANSACTION_ID', 'DOC_ID', 'Transaction type, sub type', 'BUDGETING_SEGMENTS', 'AMOUNT, GL_DATE', 'Increase or decrease flag'] },
    { id: 'gl', col: 3, row: 1, tone: 'accounting', title: 'Subledger Accounting to GL', lines: ['Create Accounting builds the 4000-series entry', 'Posts to GL_JE_LINES and GL_BALANCES'] },
    { id: 'intf', col: 1, row: 2, kind: 'entity', tone: 'source', title: 'FV_BE_INTERFACE', lines: ['SOURCE, GROUP_ID', 'RECORD_NUMBER', 'BUDGET_LEVEL_ID', 'FUND_VALUE, AMOUNT', 'STATUS, ERROR_CODE', 'FV_BE_INTERFACE_CONTROL'] },
    { id: 'rpt', col: 3, row: 2, tone: 'statements', title: 'Federal reports', lines: ['SF-133 budget execution', 'GTAS bulk file', 'Fund Balance with Treasury', 'Funds availability', 'Year-end closing'] }
  ],
  edges: [
    { from: 'tas', to: 'fund', label: 'TAS id' },
    { from: 'fund', to: 'ccid', label: 'fund value' },
    { from: 'lvl', to: 'hdr', label: 'level' },
    { from: 'hdr', to: 'dtl', label: 'DOC_ID' },
    { from: 'dtl', to: 'gl', label: 'events' },
    { from: 'intf', to: 'hdr', label: 'import' },
    { from: 'gl', to: 'rpt' },
    { from: 'attr', to: 'gl', dashed: true, label: 'attributes' }
  ]
};

export const oraclePage = {
  slug: 'oracle-ebs',
  prefix: 'O',
  eyebrow: 'Platform reference',
  navTitle: 'Oracle E-Business Suite and Federal Financials: Architecture, Data Model, and Tables',
  shortTitle: 'Oracle E-Business Suite',
  blurb: 'How Oracle EBS Release 12 is built, how ledgers, operating units, and the Accounting Flexfield work, how Subledger Accounting links every transaction to the GL, and which tables hold the data behind DAI, DEAMS, and GCSS-MC.',
  appliesTo: ['dai', 'deams', 'gcss-mc'],
  blocks: [
    h2('1. What runs on Oracle in DoD'),
    p('Three systems in this suite run on Oracle E-Business Suite: DAI, DEAMS, and GCSS-MC. DAI and DEAMS use the Oracle U.S. Federal Financials extension for budget execution, Treasury reporting, and prompt payment. CEFMS is a custom Army Corps of Engineers application. It does not use the EBS data model, and the public sources reviewed for this site do not confirm its database product.'),
    table('Oracle-based systems in this suite', ['System', 'Owner', 'Main Oracle scope', 'Role in the reporting chain'], [
      ['DAI', 'Defense agencies, hosted by DLA', 'General Ledger, Federal Financials, Purchasing, Payables, Receivables, Projects, Assets, Time and Labor, with OBIEE and Hyperion', 'General ledger for most Fourth Estate agencies. Sends daily and month-end trial balances to DDRS through GEX.'],
      ['DEAMS', 'Air Force and USTRANSCOM', 'General Ledger, Federal Financials, Purchasing, Payables, Receivables, Projects, Assets', 'Air Force general fund and transportation working capital accounting. Runs in parallel with GAFS-R.'],
      ['GCSS-MC', 'Marine Corps', 'Supply chain, maintenance, and service management on Oracle E-Business Suite, upgraded to R12 in 2015', 'Marine Corps logistics ERP. Its financial effect posts to the Marine Corps accounting system.']
    ], 'The DAI module list follows DCMA Manual 4301-05, Volume 8. The GCSS-MC platform follows the DOT&E fiscal year 2015 annual report. Other scope lines summarize public program descriptions.'),
    callout('How to read the table names on this page', 'Table names come from the standard Oracle EBS product. Tables for General Ledger, Subledger Accounting, Purchasing, Payables, Receivables, Assets, and Projects are documented in the Oracle eTRM. For Federal Financials, Table O-10 marks which names appear in Oracle user guides and which should be confirmed in the eTRM for the release in use.'),

    h2('2. Technical architecture'),
    p('Oracle EBS is a three-tier system. A browser or Forms client talks to the application tier. The application tier runs web pages, forms, and batch programs. All business data sits in one Oracle database.'),
    figure('Oracle E-Business Suite Release 12.2: tiers and components', architecture, 'Dual file system, editions, and the adop phases follow the Oracle E-Business Suite Concepts guide. WebLogic managed server names are the Release 12.2 defaults.'),
    table('Application tier components', ['Component', 'What it does', 'Why a financial manager should care'], [
      ['Oracle HTTP Server', 'Accepts web requests and passes them to WebLogic.', 'Single sign-on and CAC authentication attach here.'],
      ['WebLogic managed servers', '`oacore` runs self-service pages. `forms` runs Forms sessions. `oafm` runs web services and maps.', 'Explains why forms and self-service pages can fail separately.'],
      ['Concurrent Processing', 'Runs batch programs as concurrent requests under managers.', 'Journal Import, Create Accounting, AutoInvoice, and payment batches are all concurrent requests. `FND_CONCURRENT_REQUESTS` is the run log.'],
      ['Workflow', 'Routes approvals for requisitions, purchase orders, invoices, and journals.', 'Approval history is audit evidence. See `WF_ITEM_ACTIVITY_STATUSES` and `PO_ACTION_HISTORY`.'],
      ['Application file system', 'Two full copies, fs1 and fs2, plus fs_ne for logs and data files.', 'Online patching applies to the patch copy while users work on the run copy.'],
      ['AutoConfig', 'Generates configuration files from one context file.', 'Change control scope for technical settings.']
    ]),
    h3('Schemas, editions, and patching'),
    list(
      'Each product owns its tables in its own schema: `GL`, `AP`, `AR`, `PO`, `FA`, `XLA`, `FV`, and so on. All programs connect as `APPS`, which holds synonyms to every table and the PL/SQL code.',
      '`APPLSYS` owns the foundation tables. `FND_USER` holds users. `FND_RESPONSIBILITY` holds responsibilities. `FND_USER_RESP_GROUPS_DIRECT` holds assignments. These support an access review.',
      'Release 12.2 uses **edition-based redefinition**. Users work in the run edition while a patch is applied to the patch edition. Cutover swaps both the file system and the edition. The `adop` utility runs five phases: prepare, apply, finalize, cutover, cleanup.',
      'Because of editions, queries should read tables through the `APPS` synonym. Reading the physical table directly can return obsolete columns.'
    ),

    h2('3. Organizational model'),
    p('Oracle separates who owns the books from who does the transactions. A ledger owns balances. An operating unit owns subledger transactions. An inventory organization owns stock.'),
    figure('Ledger, legal entity, operating unit, and inventory organization', orgModel),
    table('Organizational objects and their tables', ['Object', 'Table', 'Key', 'Meaning in a DoD implementation'], [
      ['Ledger', '`GL_LEDGERS`', '`LEDGER_ID`', 'One set of books defined by chart of accounts, calendar, currency, and subledger accounting method. Budgetary control is enabled here.'],
      ['Legal entity', '`XLE_ENTITY_PROFILES`', '`LEGAL_ENTITY_ID`', 'The agency or reporting entity that owns the ledger.'],
      ['Operating unit', '`HR_OPERATING_UNITS`', '`ORGANIZATION_ID`, stored as `ORG_ID`', 'Partitions Payables, Receivables, Purchasing, and Projects. Tables that end in `_ALL` hold every operating unit.'],
      ['Inventory organization', '`MTL_PARAMETERS`', '`ORGANIZATION_ID`', 'A warehouse, depot, or receiving location.'],
      ['Accounting calendar', '`GL_PERIODS`, `GL_PERIOD_STATUSES`', 'Period set, period name', 'Fiscal periods and their open or closed status by application.'],
      ['Responsibility', '`FND_RESPONSIBILITY`', '`RESPONSIBILITY_ID`', 'What a user can do: a menu, a data group, and a request group.']
    ]),
    h3('The Accounting Flexfield'),
    p('The chart of accounts is a key flexfield with up to 30 segments. Each program defines its own segments. A federal chart usually has a fund segment as the balancing segment, a natural account segment that holds the USSGL account, and segments for organization, program, object class, and budget year. Every distinct combination that has been used is one row in `GL_CODE_COMBINATIONS`, identified by `CODE_COMBINATION_ID`. Every transaction table stores that ID, not the segment values.'),
    table('Flexfield and value tables', ['Table', 'Holds', 'Use it to'], [
      ['`GL_CODE_COMBINATIONS`', 'One row per account string: `CODE_COMBINATION_ID`, `SEGMENT1` to `SEGMENT30`, account type, enabled flag', 'Translate any transaction account ID into segment values.'],
      ['`FND_ID_FLEX_STRUCTURES`', 'Flexfield structures. The Accounting Flexfield has code `GL#`.', 'Find the chart of accounts ID for a ledger.'],
      ['`FND_ID_FLEX_SEGMENTS`', 'Segment definitions: name, column, value set', 'Learn which `SEGMENTn` column holds fund, account, or organization.'],
      ['`FND_FLEX_VALUE_SETS`, `FND_FLEX_VALUES`, `FND_FLEX_VALUES_TL`', 'Value sets, values, and descriptions', 'Validate segment values and read descriptions.'],
      ['`FND_FLEX_VALUE_HIERARCHIES`', 'Parent and child value ranges', 'Roll accounts up for reports.'],
      ['Descriptive flexfields', '`ATTRIBUTE1` to `ATTRIBUTE15` columns on most tables', 'Find program-specific data such as contract numbers or SLOA elements stored on a transaction.']
    ]),

    h2('4. General Ledger data model'),
    table('General Ledger tables', ['Table', 'Holds', 'Key fields', 'Use it to'], [
      ['`GL_JE_BATCHES`', 'Journal batches', '`JE_BATCH_ID`', 'See batch status, approval, and posting date.'],
      ['`GL_JE_HEADERS`', 'Journal headers', '`JE_HEADER_ID`', 'Identify source and category. `JE_SOURCE` says which subledger or whether it was manual.'],
      ['`GL_JE_LINES`', 'Journal lines', '`JE_HEADER_ID`, `JE_LINE_NUM`', 'Read each debit and credit by account.'],
      ['`GL_BALANCES`', 'Period balances by account', '`LEDGER_ID`, `CODE_COMBINATION_ID`, `CURRENCY_CODE`, `PERIOD_NAME`, `ACTUAL_FLAG`', 'Build the trial balance.'],
      ['`GL_INTERFACE`', 'Staging for Journal Import', '`GROUP_ID`, `USER_JE_SOURCE_NAME`', 'Check what was loaded from outside and what was rejected.'],
      ['`GL_IMPORT_REFERENCES`', 'Link from journal line to subledger journal line', '`JE_HEADER_ID`, `JE_LINE_NUM`, `GL_SL_LINK_ID`, `GL_SL_LINK_TABLE`', 'Drill from a GL line to Subledger Accounting.'],
      ['`GL_BC_PACKETS`', 'Funds check and reservation packets', '`PACKET_ID`', 'See why a transaction passed or failed budgetary control.'],
      ['`GL_JE_SOURCES`, `GL_JE_CATEGORIES`', 'Journal source and category definitions', 'Source name, category name', 'Separate system-generated journals from manual ones.'],
      ['`GL_PERIOD_STATUSES`', 'Open and closed periods per application', '`APPLICATION_ID`, `LEDGER_ID`, `PERIOD_NAME`', 'Prove cutoff control.'],
      ['`GL_BUDGET_VERSIONS`, `GL_ENCUMBRANCE_TYPES`', 'Budget and encumbrance definitions', 'Version ID, type ID', 'Interpret `ACTUAL_FLAG` B and E balances.']
    ]),
    p('`ACTUAL_FLAG` separates three kinds of balance in the same tables. `A` is actual. `B` is budget. `E` is encumbrance. In a federal ledger, the USSGL budgetary accounts in the 4000 series are posted as actual journals to budgetary accounts, so a federal trial balance reads `ACTUAL_FLAG = A` for both proprietary and budgetary accounts.'),

    h2('5. Subledger Accounting: the bridge from transaction to GL'),
    p('In Release 12 no subledger writes to the GL directly. Each transaction raises an accounting event. The Create Accounting program reads the event, applies the rules in the subledger accounting method, and writes a subledger journal entry in the XLA tables. A second step transfers those entries to the GL. The link IDs written at each step are what allow a drill from a GL balance to the source transaction.'),
    figure('Entity relationships: source transaction, Subledger Accounting, and General Ledger', slaModel, '`XLA_DISTRIBUTION_LINKS` also carries `AE_HEADER_ID` and `AE_LINE_NUM`, which join it to `XLA_AE_LINES`. That edge is omitted from the drawing for legibility.'),
    table('Subledger Accounting (XLA) tables', ['Table', 'Holds', 'Key fields', 'Use it to'], [
      ['`XLA_TRANSACTION_ENTITIES`', 'One row per accountable transaction', '`ENTITY_ID`, `APPLICATION_ID`', 'Go from a subledger transaction ID (`SOURCE_ID_INT_1`) to its accounting.'],
      ['`XLA_EVENTS`', 'Accounting events for an entity', '`EVENT_ID`', 'See whether each event has been accounted. Unprocessed events are unposted activity.'],
      ['`XLA_AE_HEADERS`', 'Subledger journal entry headers', '`AE_HEADER_ID`', 'Check accounting date, ledger, and GL transfer status.'],
      ['`XLA_AE_LINES`', 'Subledger journal entry lines', '`AE_HEADER_ID`, `AE_LINE_NUM`', 'Read the debit and credit lines with accounting class.'],
      ['`XLA_DISTRIBUTION_LINKS`', 'Link from each journal line to the source distribution', '`APPLICATION_ID`, `EVENT_ID`, `AE_HEADER_ID`, `AE_LINE_NUM`, `TEMP_LINE_NUM`', 'Tie a journal line to one invoice distribution, receipt, or payment line.'],
      ['`XLA_ACCOUNTING_ERRORS`', 'Errors from Create Accounting', '`EVENT_ID`', 'Work the accounting exception queue.'],
      ['`XLA_TRIAL_BALANCES`', 'Open account balances by source, used for the payables trial balance', 'Definition code, source entity', 'Reconcile the liability account to open invoices.']
    ]),
    steps(
      'Start from a balance in `GL_BALANCES`. Find the lines in `GL_JE_LINES` for that `CODE_COMBINATION_ID` and period.',
      'Join `GL_JE_LINES` to `GL_IMPORT_REFERENCES` on `JE_HEADER_ID` and `JE_LINE_NUM`.',
      'Join `GL_IMPORT_REFERENCES` to `XLA_AE_LINES` on `GL_SL_LINK_ID` and `GL_SL_LINK_TABLE`.',
      'Join `XLA_AE_LINES` to `XLA_AE_HEADERS` on `AE_HEADER_ID`, then to `XLA_EVENTS` and `XLA_TRANSACTION_ENTITIES`.',
      'Read `ENTITY_CODE` and `SOURCE_ID_INT_1`. For `AP_INVOICES` the ID is `AP_INVOICES_ALL.INVOICE_ID`. For `AP_PAYMENTS` it is `AP_CHECKS_ALL.CHECK_ID`. For receiving it is the receiving transaction.',
      'Use `XLA_DISTRIBUTION_LINKS` when the test needs one specific distribution line and not the whole transaction.'
    ),
    p('Journals with a `JE_SOURCE` of Manual or Spreadsheet have no rows in `GL_IMPORT_REFERENCES`. That absence is how an analyst separates subledger-supported postings from manual journals in the universe of transactions.'),

    h2('6. Procure-to-pay document flow'),
    figure('Oracle procure-to-pay: steps, tables, and accounting effect', p2p, 'USSGL accounts show the standard budgetary progression. Accounting timing for receipts depends on whether the program accrues at receipt or at period end.'),
    table('Purchasing and receiving tables', ['Table', 'Holds', 'Key fields', 'Link forward'], [
      ['`PO_REQUISITION_HEADERS_ALL`', 'Requisition header', '`REQUISITION_HEADER_ID`, number in `SEGMENT1`', 'Lines'],
      ['`PO_REQUISITION_LINES_ALL`', 'Requisition lines', '`REQUISITION_LINE_ID`', '`LINE_LOCATION_ID` once placed on an order'],
      ['`PO_REQ_DISTRIBUTIONS_ALL`', 'Requisition accounting distributions', '`DISTRIBUTION_ID`', '`PO_DISTRIBUTIONS_ALL.REQ_DISTRIBUTION_ID`'],
      ['`PO_HEADERS_ALL`', 'Purchase order or agreement header', '`PO_HEADER_ID`, number in `SEGMENT1`', 'Lines, shipments, distributions'],
      ['`PO_LINES_ALL`', 'Order lines', '`PO_LINE_ID`', 'Item, quantity, price'],
      ['`PO_LINE_LOCATIONS_ALL`', 'Shipment schedules', '`LINE_LOCATION_ID`', 'Quantity received and billed, match option'],
      ['`PO_DISTRIBUTIONS_ALL`', 'Order accounting distributions', '`PO_DISTRIBUTION_ID`', 'Charge account, budget account, encumbered flag and amount'],
      ['`PO_ACTION_HISTORY`', 'Approval and action history', 'Object ID, sequence', 'Who submitted, approved, or rejected'],
      ['`RCV_SHIPMENT_HEADERS` / `RCV_SHIPMENT_LINES`', 'Receipt header and lines', '`SHIPMENT_HEADER_ID`, `SHIPMENT_LINE_ID`', 'Receipt number'],
      ['`RCV_TRANSACTIONS`', 'Receive, accept, deliver, return, correct', '`TRANSACTION_ID`', '`PO_DISTRIBUTION_ID` and parent transaction']
    ]),
    table('Payables and payment tables', ['Table', 'Holds', 'Key fields', 'Link forward'], [
      ['`AP_SUPPLIERS` / `AP_SUPPLIER_SITES_ALL`', 'Supplier and pay site', '`VENDOR_ID`, `VENDOR_SITE_ID`', 'Party in `HZ_PARTIES`'],
      ['`AP_INVOICES_ALL`', 'Invoice header', '`INVOICE_ID`', 'Lines, distributions, payment schedules'],
      ['`AP_INVOICE_LINES_ALL`', 'Invoice lines', '`INVOICE_ID`, `LINE_NUMBER`', 'Matched order line and receipt'],
      ['`AP_INVOICE_DISTRIBUTIONS_ALL`', 'Invoice accounting distributions', '`INVOICE_DISTRIBUTION_ID`', '`PO_DISTRIBUTION_ID`, `ACCOUNTING_EVENT_ID`'],
      ['`AP_HOLDS_ALL`', 'Invoice holds', '`INVOICE_ID`, hold code', 'Why an invoice could not be paid'],
      ['`AP_PAYMENT_SCHEDULES_ALL`', 'Amounts due by date', '`INVOICE_ID`, `PAYMENT_NUM`', 'Due date used for prompt payment'],
      ['`AP_CHECKS_ALL`', 'Payments', '`CHECK_ID`', 'Payment number, date, Treasury pay number in Federal'],
      ['`AP_INVOICE_PAYMENTS_ALL`', 'Which payment paid which invoice', '`INVOICE_PAYMENT_ID`', '`INVOICE_ID`, `CHECK_ID`'],
      ['`IBY_PAYMENTS_ALL` / `IBY_PAY_INSTRUCTIONS_ALL`', 'Oracle Payments records and payment instructions', '`PAYMENT_ID`, `PAYMENT_INSTRUCTION_ID`', 'Payment file sent to the disbursing office'],
      ['`AP_INVOICES_INTERFACE` / `AP_INVOICE_LINES_INTERFACE`', 'Staging for Payables Open Interface Import', '`INVOICE_ID` in the interface', 'Invoices arriving from WAWF or another feeder']
    ]),

    h2('7. Other module data models'),
    table('Receivables and reimbursable billing tables', ['Table', 'Holds', 'Key fields'], [
      ['`HZ_PARTIES` / `HZ_CUST_ACCOUNTS` / `HZ_CUST_SITE_USES_ALL`', 'Customer party, account, and bill-to site', '`PARTY_ID`, `CUST_ACCOUNT_ID`, `SITE_USE_ID`'],
      ['`RA_CUSTOMER_TRX_ALL`', 'Invoice, credit memo, debit memo header', '`CUSTOMER_TRX_ID`'],
      ['`RA_CUSTOMER_TRX_LINES_ALL`', 'Transaction lines', '`CUSTOMER_TRX_LINE_ID`'],
      ['`RA_CUST_TRX_LINE_GL_DIST_ALL`', 'Revenue and receivable distributions', '`CUST_TRX_LINE_GL_DIST_ID`'],
      ['`AR_PAYMENT_SCHEDULES_ALL`', 'Open balance by transaction', '`PAYMENT_SCHEDULE_ID`'],
      ['`AR_CASH_RECEIPTS_ALL`', 'Receipts, including IPAC collections', '`CASH_RECEIPT_ID`'],
      ['`AR_RECEIVABLE_APPLICATIONS_ALL`', 'Applications of receipts and credits', '`RECEIVABLE_APPLICATION_ID`'],
      ['`RA_INTERFACE_LINES_ALL`', 'AutoInvoice staging', 'Interface line context and attributes']
    ]),
    table('Assets, Projects, Inventory, and time tables', ['Table', 'Holds', 'Key fields'], [
      ['`FA_ADDITIONS_B`', 'Asset master', '`ASSET_ID`'],
      ['`FA_BOOKS`', 'Financial rules per book: cost, date placed in service, method', '`ASSET_ID`, `BOOK_TYPE_CODE`, `TRANSACTION_HEADER_ID_IN`'],
      ['`FA_DISTRIBUTION_HISTORY`', 'Assignment to account, location, and employee', '`DISTRIBUTION_ID`'],
      ['`FA_TRANSACTION_HEADERS`', 'Asset transactions: addition, adjustment, transfer, retirement', '`TRANSACTION_HEADER_ID`'],
      ['`FA_DEPRN_SUMMARY` / `FA_DEPRN_DETAIL`', 'Depreciation by period, total and by distribution', '`ASSET_ID`, `BOOK_TYPE_CODE`, `PERIOD_COUNTER`'],
      ['`FA_MASS_ADDITIONS`', 'Staging for assets created from Payables or Projects', '`MASS_ADDITION_ID`'],
      ['`PA_PROJECTS_ALL` / `PA_TASKS`', 'Projects and work breakdown', '`PROJECT_ID`, `TASK_ID`'],
      ['`PA_EXPENDITURE_ITEMS_ALL`', 'Cost transactions charged to a project', '`EXPENDITURE_ITEM_ID`'],
      ['`PA_COST_DISTRIBUTION_LINES_ALL`', 'Accounting for each expenditure item', '`EXPENDITURE_ITEM_ID`, `LINE_NUM`'],
      ['`PA_AGREEMENTS_ALL` / `PA_PROJECT_FUNDINGS`', 'Customer agreements and funding, used for reimbursable orders', '`AGREEMENT_ID`'],
      ['`MTL_SYSTEM_ITEMS_B`', 'Item master', '`INVENTORY_ITEM_ID`, `ORGANIZATION_ID`'],
      ['`MTL_MATERIAL_TRANSACTIONS`', 'Every stock movement', '`TRANSACTION_ID`'],
      ['`MTL_ONHAND_QUANTITIES_DETAIL`', 'On-hand quantity by location and lot', '`ONHAND_QUANTITIES_ID`'],
      ['`MTL_TRANSACTION_ACCOUNTS`', 'Accounting distributions for stock movements', '`TRANSACTION_ID`'],
      ['`OE_ORDER_HEADERS_ALL` / `OE_ORDER_LINES_ALL`', 'Sales and internal orders', '`HEADER_ID`, `LINE_ID`'],
      ['`HXC_TIME_BUILDING_BLOCKS`', 'Time and Labor timecard entries', '`TIME_BUILDING_BLOCK_ID`, version']
    ], 'Projects charge accounts are built from project, task, expenditure type, and expenditure organization. Project programs often call this set POET, or POETA when an award is added.'),

    h2('8. Oracle U.S. Federal Financials'),
    p('Federal Financials is an add-on product with its own schema, `FV`. It adds what a commercial ledger lacks: Treasury Account Symbols, multi-level budget execution, Treasury reporting attributes, prompt payment, Treasury payment confirmation, and federal year-end closing.'),
    figure('Federal Financials: fund identity, budget execution, and reporting', federal, 'Column lists for FV tables other than the interface tables are abbreviated and descriptive. Confirm exact column names in the eTRM.'),
    table('Federal Financials setup objects, in the order Oracle lists them', ['Step', 'Setup', 'What it defines'], [
      ['32', 'Federal seed data', 'Loads lookups and predefined federal values.'],
      ['33', 'Federal options', 'Agency-wide choices for payables, receivables, and reporting behavior.'],
      ['34', 'Treasury Account Symbols', 'Each component of the TAS under the Common Government-wide Accounting Classification: agency, main account, sub-account, period of availability.'],
      ['35', 'Budget codes', 'Budget codes and their link to a TAS.'],
      ['36', 'Fund attributes', 'Extra attributes for each value of the balancing segment, which is the fund.'],
      ['37', 'Trading partner TAS', 'TAS components for intragovernmental partners.'],
      ['38', 'TAS and BETC mapping', 'Business Event Type Codes assigned to agency and trading partner TAS.'],
      ['41', 'Budget execution', 'Budget levels, transaction types, and budget users for distributing funds.'],
      ['42', 'Federal report definitions', 'Funds availability, USSGL account, GTAS attribute, and reimbursable activity report tables.'],
      ['54', 'Year-end closing definitions', 'Closing sequences for expired, cancelled, and unexpired funds.']
    ], 'Step numbers and descriptions follow the setup checklist in the Oracle U.S. Federal Financials Implementation Guide, Release 12.2.'),
    table('Federal Financials (FV) tables', ['Table', 'Holds', 'Basis'], [
      ['`FV_BE_INTERFACE`', 'Open interface for budget execution transactions: source, group, record number, budget level, fund value, amount, GL date, public law code, status, error code', 'Named and described in the Oracle Federal Financials User Guide'],
      ['`FV_BE_INTERFACE_CONTROL`', 'One row per source and group to be imported, with status and processed date', 'Named in the User Guide'],
      ['`FV_BE_TRX_HDRS`', 'Budget execution document headers. Destination of the import.', 'Named in the User Guide'],
      ['`FV_BE_TRX_DTLS`', 'Budget execution transaction detail lines', 'Named in the User Guide'],
      ['`FV_BUDGET_LEVELS`', 'Budget levels such as appropriation, apportionment, and allotment', 'Named in the User Guide'],
      ['`FV_TREASURY_SYMBOLS`', 'Treasury Account Symbol master', 'Standard product table. Confirm in eTRM.'],
      ['`FV_FUND_PARAMETERS`', 'Fund attributes: links each fund value to a TAS and fund category', 'Standard product table. Confirm in eTRM.'],
      ['`FV_FACTS_ATTRIBUTES`', 'Reporting attributes by USSGL account', 'Standard product table. Confirm in eTRM.'],
      ['`FV_FACTS_USSGL_ACCOUNTS`', 'USSGL account list used for Treasury reporting', 'Standard product table. Confirm in eTRM.'],
      ['`FV_TREASURY_CONFIRMATIONS_ALL`', 'Treasury confirmation of payment batches', 'Standard product table. Confirm in eTRM.'],
      ['`FV_INTERAGENCY_FUNDS_ALL`', 'Interagency transfer records for IPAC and similar transactions', 'Standard product table. Confirm in eTRM.'],
      ['`FV_YE_GROUPS`, `FV_YE_GROUP_SEQUENCES`, `FV_YE_SEQUENCE_ACCOUNTS`', 'Year-end closing definitions', 'Standard product tables. Confirm in eTRM.']
    ]),
    h3('How budget execution works'),
    steps(
      'An appropriation is entered at the top budget level. The transaction type decides which USSGL budgetary accounts are debited and credited.',
      'Funds are distributed down through apportionment, allotment, and any lower levels the agency defined. Each distribution is a document in `FV_BE_TRX_HDRS` with lines in `FV_BE_TRX_DTLS`.',
      'External budget tools can load the same transactions through `FV_BE_INTERFACE`. The import validates every record in a group and loads the group only when all records pass.',
      'Approved transactions raise accounting events. Create Accounting posts them to the budgetary accounts in the GL.',
      'Budgetary control in the GL then checks every requisition, order, and invoice against the allotted balance for its fund and budget segments.'
    ),
    p('In Release 11i, federal postings were driven by USSGL transaction codes entered on each transaction. In Release 12 that logic moved into Subledger Accounting rules, so the proprietary and budgetary lines are both derived when accounting is created.'),

    h2('9. Interfaces and open interface tables'),
    table('Open interfaces used by feeder systems', ['Interface table', 'Import program', 'Destination', 'Typical DoD feeder'], [
      ['`GL_INTERFACE`', 'Journal Import', '`GL_JE_BATCHES`, `GL_JE_HEADERS`, `GL_JE_LINES`', 'Payroll summaries, legacy conversions, external accruals'],
      ['`AP_INVOICES_INTERFACE`, `AP_INVOICE_LINES_INTERFACE`', 'Payables Open Interface Import', '`AP_INVOICES_ALL` and children', 'WAWF invoices and receiving reports, travel settlements'],
      ['`PO_HEADERS_INTERFACE`, `PO_LINES_INTERFACE`, `PO_DISTRIBUTIONS_INTERFACE`', 'Import Standard Purchase Orders', '`PO_HEADERS_ALL` and children', 'Contract awards and modifications from contract writing systems'],
      ['`PO_REQUISITIONS_INTERFACE_ALL`', 'Requisition Import', '`PO_REQUISITION_HEADERS_ALL` and children', 'Purchase requests from external request systems'],
      ['`RCV_HEADERS_INTERFACE`, `RCV_TRANSACTIONS_INTERFACE`', 'Receiving Transaction Processor', '`RCV_SHIPMENT_HEADERS`, `RCV_TRANSACTIONS`', 'Acceptance from WAWF'],
      ['`RA_INTERFACE_LINES_ALL`', 'AutoInvoice', '`RA_CUSTOMER_TRX_ALL` and children', 'Reimbursable billings from Projects'],
      ['`FV_BE_INTERFACE`', 'Budget Execution Open Interface Import', '`FV_BE_TRX_HDRS`, `FV_BE_TRX_DTLS`', 'Funding documents from budget distribution systems'],
      ['`FA_MASS_ADDITIONS`', 'Post Mass Additions', '`FA_ADDITIONS_B` and children', 'Capital assets from Payables and Projects'],
      ['`PA_TRANSACTION_INTERFACE_ALL`', 'Transaction Import', '`PA_EXPENDITURE_ITEMS_ALL`', 'Labor and usage from time systems']
    ], 'Every interface follows one pattern: load rows, run the import as a concurrent request, review the error report, correct, rerun. Rows left in an interface table at period end are unrecorded activity.'),

    h2('10. Security and controls'),
    list(
      'Access is granted by assigning **responsibilities** to users. A responsibility fixes the menu of functions, the operating units through `MO: Security Profile`, and the ledgers through a data access set.',
      'Segregation of duties is tested at the function level: for example, holding both supplier entry and payment functions. Oracle Advanced Controls or a GRC tool applies the rule set.',
      'Flexfield **security rules** limit which segment values a responsibility can use. **Cross-validation rules** block invalid account combinations at entry.',
      'Standard `WHO` columns on every table record `CREATED_BY`, `CREATION_DATE`, `LAST_UPDATED_BY`, and `LAST_UPDATE_DATE`. They show the last change only.',
      'Full history needs **AuditTrail**, which writes shadow tables for chosen columns, or database auditing.',
      'Journal approval, purchase order approval, and invoice approval run on Oracle Workflow. The approval hierarchy and limits are configuration and belong in the control documentation.'
    ),

    h2('11. Trial balance and universe of transactions queries'),
    steps(
      'Read `GL_BALANCES` for the ledger and period with `ACTUAL_FLAG = A` and the ledger currency. Join to `GL_CODE_COMBINATIONS` for the segments.',
      'Compute the ending balance as beginning balance plus period net, debits less credits.',
      'Group by fund segment, USSGL account segment, and the other segments that carry SFIS attributes. Join the fund to `FV_FUND_PARAMETERS` and `FV_TREASURY_SYMBOLS` to add the TAS.',
      'For the universe of transactions, read `GL_JE_LINES` joined to `GL_JE_HEADERS` for the same ledger and period with status posted. The sum by account must equal the period net in `GL_BALANCES`.',
      'Extend each line to its source through `GL_IMPORT_REFERENCES` and the XLA tables as described in section 5.',
      'List `XLA_EVENTS` that are not processed and interface rows that are not imported. Those are transactions that exist in the system and are not yet in the trial balance.'
    )
  ],
  sources: [
    { name: 'Oracle E-Business Suite Concepts, Release 12.2: patching and management tools', url: 'https://docs.oracle.com/cd/E26401_01/doc.122/e22949/T120505T120512.htm' },
    { name: 'Oracle U.S. Federal Financials Implementation Guide, Release 12.2', url: 'https://docs.oracle.com/cd/E26401_01/doc.122/e48804/toc.htm' },
    { name: 'Oracle U.S. Federal Financials User Guide: Budget Execution Open Interface', url: 'https://docs.oracle.com/cd/E18727-01/doc.121/e13551/T343342T343463.htm' },
    { name: 'Oracle U.S. Federal Financials User Guide: Budget Execution Open Interface Tables', url: 'https://docs.oracle.com/cd/E18727_01/doc.121/e13551/T343342T345297.htm' },
    { name: 'Oracle E-Business Suite Technology blog: eTRM for Release 12.2', url: 'https://blogs.oracle.com/ebstech/updated-etrm-for-ebs-122-now-available-feb-2022' },
    { name: 'DOT&E FY2015 annual report: GCSS-MC', url: 'https://www.dote.osd.mil/Portals/97/pub/reports/FY2015/navy/2015gcss-mc.pdf' },
    { name: 'DCMA Manual 4301-05, Volume 8: Financial Systems and Interfaces (DAI modules and interfaces)', url: 'https://www.dcma.mil/Portals/31/Documents/Policy/DCMA_MAN_4301-05_VOL8.pdf' }
  ]
};
