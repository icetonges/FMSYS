import { h2, h3, p, list, steps, callout, table, figure } from './blocks';

const enterprise = {
  id: 'int-enterprise',
  cols: 5,
  colWidth: 184,
  colGap: 36,
  rowGap: 64,
  rowLabels: ['Business event and feeder systems', 'General ledger systems of record', 'Departmental and Treasury reporting'],
  nodes: [
    { id: 'cws', col: 0, row: 0, tone: 'source', title: 'Contract writing and EDA', lines: ['Awards and modifications', 'PDS and PRDS data standards'] },
    { id: 'piee', col: 1, row: 0, tone: 'source', title: 'PIEE / WAWF', lines: ['Invoices, receiving reports, acceptance'] },
    { id: 'dts', col: 2, row: 0, tone: 'source', title: 'DTS', lines: ['Travel authorizations and vouchers'] },
    { id: 'pay', col: 3, row: 0, tone: 'source', title: 'DCPS and military pay', lines: ['Payroll and benefits'] },
    { id: 'disb', col: 4, row: 0, tone: 'source', title: 'Entitlement and disbursing', lines: ['MOCAS, ADS, DDS, DCAS', 'Treasury Direct Disbursing, IPAC'] },
    { id: 'sap', col: 0, row: 1, span: 2, tone: 'process', title: 'SAP family', lines: ['GFEBS, Navy ERP, GCSS-Army, LMP, DLA EBS', 'Documents in BKPF / BSEG, budget use in FMIOI / FMIFIIT'] },
    { id: 'ora', col: 2, row: 1, span: 2, tone: 'process', title: 'Oracle E-Business Suite family', lines: ['DAI, DEAMS, GCSS-MC', 'Journals in GL_JE_LINES, subledger entries in XLA tables'] },
    { id: 'leg', col: 4, row: 1, tone: 'process', title: 'Legacy and custom', lines: ['GAFS-R, SABRS, CEFMS, FAMIS', 'Status-of-funds records'] },
    { id: 'advana', col: 0, row: 2, tone: 'detail', title: 'Advana', lines: ['Replicated transactions', 'Reconciliation workbooks'] },
    { id: 'b', col: 1, row: 2, tone: 'accounting', title: 'DDRS-B', lines: ['Trial balance intake, crosswalk, JVs, SF 133'] },
    { id: 'afs', col: 2, row: 2, tone: 'accounting', title: 'DDRS-AFS', lines: ['Statements, notes, eliminations'] },
    { id: 'gtas', col: 3, row: 2, tone: 'accounting', title: 'GTAS and CARS', lines: ['Adjusted trial balance, FBWT'] },
    { id: 'out', col: 4, row: 2, tone: 'statements', title: 'Published outputs', lines: ['DoD Agency Financial Report', 'Financial Report of the U.S. Government'] }
  ],
  edges: [
    { from: 'cws', to: 'sap', tx: -110 },
    { from: 'piee', to: 'sap', tx: 110 },
    { from: 'dts', to: 'ora', tx: -110 },
    { from: 'pay', to: 'ora', tx: 110 },
    { from: 'disb', to: 'leg' },
    { from: 'sap', to: 'advana', sx: -110, label: 'replication', ly: 14 },
    { from: 'sap', to: 'b', sx: 110, label: 'trial balance', ly: 14 },
    { from: 'ora', to: 'b', sx: -110, my: -8 },
    { from: 'leg', to: 'b', my: -8 },
    { from: 'b', to: 'afs' }, { from: 'afs', to: 'gtas' }, { from: 'gtas', to: 'out' }
  ]
};

const keyChain = {
  id: 'int-keys',
  cols: 4,
  colWidth: 226,
  colGap: 64,
  rowGap: 56,
  colLabels: ['General ledger line', 'SFIS trial balance line', 'DDRS adjusted balance', 'GTAS record'],
  nodes: [
    { id: 'sap', col: 0, row: 0, kind: 'entity', tone: 'process', title: 'SAP: BSEG / ACDOCA', lines: ['*BUKRS, BELNR, GJAHR, BUZEI', 'HKONT  DoD SCOA account', 'GEBER  fund', 'FISTL  funds center', 'FIPOS  commitment item', 'FKBER  functional area'] },
    { id: 'ora', col: 0, row: 1, kind: 'entity', tone: 'process', title: 'Oracle: GL_JE_LINES', lines: ['*JE_HEADER_ID, JE_LINE_NUM', 'CODE_COMBINATION_ID', '  fund segment', '  USSGL account segment', '  org, program, object class'] },
    { id: 'tb', col: 1, row: 0, kind: 'entity', tone: 'accounting', title: 'Trial balance line', lines: ['*TAS: A1 A2 A3 A4 A27 A28 A29', '*account: 6-digit + 4-digit', '*SFIS attributes', 'ending balance', 'debit/credit'] },
    { id: 'ddrs', col: 2, row: 0, kind: 'entity', tone: 'accounting', title: 'Adjusted TB line', lines: ['*entity, period, TAS', '*USSGL account, attributes', 'unadjusted balance', 'JV adjustments by category', 'adjusted balance'] },
    { id: 'gtas', col: 3, row: 0, kind: 'entity', tone: 'statements', title: 'ATB bulk record (98 chars)', lines: ['*fiscal year, period', '*TAS components', '*USSGL account', '*attribute domain values', 'amount, D/C, begin/end'] },
    { id: 'src', col: 1, row: 1, kind: 'entity', tone: 'detail', title: 'Source document keys', lines: ['SAP: AWTYP + AWKEY, EBELN', 'Oracle: GL_SL_LINK_ID to', '  XLA_AE_LINES to source id', 'Contract: PIID, CLIN', 'Travel: authorization number'] },
    { id: 'jv', col: 2, row: 1, kind: 'entity', tone: 'detail', title: 'Journal voucher support', lines: ['JV number, category', 'root cause code', 'preparer and approver', 'support package'] },
    { id: 'stmt', col: 3, row: 1, kind: 'entity', tone: 'statements', title: 'Statement line', lines: ['USSGL crosswalk for the', 'Balance Sheet, SNC, SCNP, SBR', 'SF 133 line from the same', 'GTAS data'] }
  ],
  edges: [
    { from: 'sap', to: 'tb', label: 'sum by attributes' },
    { from: 'ora', to: 'tb', sx: 70, tx: -70, label: 'sum by segments' },
    { from: 'tb', to: 'ddrs', label: 'load' },
    { from: 'ddrs', to: 'gtas', label: 'submit' },
    { from: 'ora', to: 'src', label: 'drill back', dashed: true },
    { from: 'jv', to: 'ddrs', label: 'adjusts' },
    { from: 'gtas', to: 'stmt', label: 'crosswalk' }
  ]
};

export const integrationPage = {
  slug: 'integration',
  prefix: 'X',
  eyebrow: 'Cross-system reference',
  navTitle: 'How Tables, Data Models, and Systems Fit Together',
  shortTitle: 'Tables, Models, and Systems',
  blurb: 'One business event traced across SAP and Oracle tables, the SFIS and SLOA data standards, the DDRS trial balance, and the Treasury GTAS record, with the join keys that connect each layer.',
  appliesTo: ['dod-treasury-close', 'ddrs', 'gtas-cars', 'gfebs', 'dai'],
  blocks: [
    h2('1. The enterprise picture'),
    p('DoD has no single general ledger. Each Component records transactions in its own system. Those systems run on two commercial products and a set of legacy and custom platforms. A common data standard and one departmental reporting system pull them into one set of statements.'),
    figure('DoD financial management data flow by platform family', enterprise, 'Feeder-to-ledger arrows are grouped for legibility. Every feeder in the top row interfaces with every ledger family.'),
    table('Platform behind each system in this suite', ['System', 'Owner', 'Platform', 'General ledger role', 'Reference'], [
      ['GFEBS', 'Army', 'SAP ERP', 'General ledger of record', '[SAP reference](/knowledge/sap)'],
      ['Navy ERP', 'Navy', 'SAP ERP', 'General ledger of record', '[SAP reference](/knowledge/sap)'],
      ['GCSS-Army', 'Army', 'SAP ERP', 'Logistics ERP with finance component', '[SAP reference](/knowledge/sap)'],
      ['LMP', 'Army Materiel Command', 'SAP ERP', 'Working capital fund ledger', '[SAP reference](/knowledge/sap)'],
      ['DLA EBS', 'Defense Logistics Agency', 'SAP ERP', 'Working capital fund ledger', '[SAP reference](/knowledge/sap)'],
      ['DAI', 'Defense agencies', 'Oracle E-Business Suite with Federal Financials', 'General ledger of record', '[Oracle reference](/knowledge/oracle-ebs)'],
      ['DEAMS', 'Air Force, USTRANSCOM', 'Oracle E-Business Suite with Federal Financials', 'General ledger of record', '[Oracle reference](/knowledge/oracle-ebs)'],
      ['GCSS-MC', 'Marine Corps', 'Oracle E-Business Suite', 'Logistics ERP', '[Oracle reference](/knowledge/oracle-ebs)'],
      ['CEFMS', 'Army Corps of Engineers', 'Custom Corps application. Database product not confirmed in public sources.', 'General ledger of record', '[Other platforms](/knowledge/other-platforms)'],
      ['GAFS-R, GAFS-BL', 'Air Force', 'Legacy', 'Status-of-funds ledger feeding DDRS', '[Other platforms](/knowledge/other-platforms)'],
      ['SABRS', 'Marine Corps', 'Legacy', 'Ledger in migration to DAI', '[Other platforms](/knowledge/other-platforms)'],
      ['STARS', 'Navy', 'Legacy mainframe', 'Retired. Balances remain in DDRS.', '[Other platforms](/knowledge/other-platforms)'],
      ['FAMIS', 'DISA', 'Legacy', 'Working capital and general fund accounting', '[Other platforms](/knowledge/other-platforms)'],
      ['ABSS', 'Air Force', 'Legacy', 'Commitment and document preparation feeder to GAFS', '[Other platforms](/knowledge/other-platforms)'],
      ['MOCAS', 'DCMA and DFAS', 'Legacy mainframe', 'Contract administration and entitlement. No general ledger.', '[Other platforms](/knowledge/other-platforms)'],
      ['ADS, DDS, DCAS', 'DFAS', 'DFAS systems', 'Disbursing and cash accountability', '[Other platforms](/knowledge/other-platforms)'],
      ['PIEE', 'DLA', 'Web application suite', 'Invoice, receipt, and acceptance feeder', '[Other platforms](/knowledge/other-platforms)'],
      ['IPAC', 'Treasury', 'Treasury system', 'Intragovernmental settlement', '[Other platforms](/knowledge/other-platforms)'],
      ['DDRS', 'DFAS', 'Web-based departmental reporting application', 'Trial balance consolidation and statements', '[DDRS deep dive](/knowledge/ddrs)'],
      ['GTAS and CARS', 'Treasury', 'Treasury systems', 'Governmentwide trial balance and central accounting', '[DDRS deep dive](/knowledge/ddrs)']
    ], 'Platform labels follow the cross-system comparison matrix in the research paper appendix, Section 4.'),

    h2('2. The common language: SFIS, SLOA, and the DoD chart of accounts'),
    list(
      '**SFIS** is the Standard Financial Information Structure. It is the DoD data standard for budgeting, accounting, cost, and external reporting. Target accounting systems must comply with it and must post with the required USSGL accounts.',
      '**SLOA** is the Standard Line of Accounting. It is the subset of SFIS that must travel with every business event that has an accounting effect, from commitment through disbursement. Systems must send, receive, and store SLOA elements as discrete data.',
      'The **DoD Standard Chart of Accounts** is the account list: a six-digit USSGL account plus a four-digit DoD extension.',
      'The **DoD USSGL Transaction Library** defines the debit and credit pairs for each business event. Each pair set has a DoD Transaction Code. Components must not combine several codes into one posting.',
      'The **SFIS Values Library** holds the allowed values for each element. DFAS maintains it.',
      'Legacy systems may use a translation service to convert non-SFIS data to SFIS elements.'
    ),
    table('The 26 SLOA data elements', ['#', 'Element', 'SFIS key', 'Format', 'Group'], [
      ['1', 'Department Regular Code', 'A1', '3 numeric', 'Appropriation account'],
      ['2', 'Department Transfer Code', 'A2', '3 numeric', 'Appropriation account'],
      ['3', 'Main Account Code', 'A3', '4 numeric', 'Appropriation account'],
      ['4', 'Sub-Account Code', 'A4', '3 numeric', 'Appropriation account'],
      ['5', 'Sub Class Code', 'A7', '2 numeric', 'Appropriation account'],
      ['6', 'Reimbursable Flag Indicator', 'A9', '1 alphabetic, R or D', 'Appropriation account'],
      ['7', 'Period of Availability Beginning, or Program Year', 'A27', '4 numeric', 'Appropriation account'],
      ['8', 'Period of Availability Ending', 'A28', '4 numeric', 'Appropriation account'],
      ['9', 'Availability Type Code', 'A29', '1 alphabetic', 'Appropriation account'],
      ['10', 'Budget Line Item Identifier', 'B4', 'Up to 16 alphanumeric', 'Budget program'],
      ['11', 'Object Class Code', 'B6', '3 to 6 characters', 'Budget program'],
      ['12', 'Sub-Allocation Holder Identifier', 'B12', '4 alphanumeric', 'Budget program'],
      ['13', 'Agency Disbursing Identifier Code', 'O2', 'Up to 8 numeric', 'Organization'],
      ['14', 'Agency Accounting Identifier Code', 'O3', '6 numeric', 'Organization'],
      ['15', 'Business Event Type Code', 'T20', 'Up to 8 alphabetic', 'Transaction'],
      ['16', 'Security Cooperation Customer Code', 'T21', '2 to 3 alphanumeric', 'Transaction'],
      ['17', 'Security Cooperation Case Designator', 'T22', '3 to 4 alphanumeric', 'Transaction'],
      ['18', 'Security Cooperation Case Line Item Identifier', 'T23', '3 alphanumeric', 'Transaction'],
      ['19', 'Security Cooperation Implementing Agency Code', 'T27', '1 alphabetic', 'Transaction'],
      ['20', 'Funding Center Identifier', 'CA1', 'Up to 16 alphanumeric', 'Cost accounting'],
      ['21', 'Cost Center Identifier', 'CA3', 'Up to 16 alphanumeric', 'Cost accounting'],
      ['22', 'Project Identifier', 'CA4', 'Up to 25 alphanumeric', 'Cost accounting'],
      ['23', 'Activity Identifier', 'CA5', 'Up to 16 alphanumeric', 'Cost accounting'],
      ['24', 'Cost Element Code', 'CA6', 'Up to 16 alphanumeric', 'Cost accounting'],
      ['25', 'Work Order Number', 'CA7', 'Up to 16 alphanumeric', 'Cost accounting'],
      ['26', 'Functional Area Identifier', 'CA15', 'Up to 16 alphanumeric', 'Cost accounting']
    ], 'Elements and formats follow the SFIS SLOA Validation Service Functional Description Document, version 1.2.4. The group column is this page\'s label based on the SFIS key prefix.'),
    table('Where each SLOA element usually lives in SAP and in Oracle', ['SLOA element', 'SAP object and field', 'Oracle object', 'GTAS bulk file field'], [
      ['Department, main account, sub-account, period of availability (A1, A3, A4, A27 to A29)', 'Derived from the fund master `FMFINCODE` through the fund\'s Treasury account assignment', 'Fund segment value, then `FV_FUND_PARAMETERS` and `FV_TREASURY_SYMBOLS`', 'Fields 4 to 9: agency identifier, period of availability, availability type, main account, sub-account'],
      ['Department Transfer Code (A2)', 'Fund master attribute', 'Treasury symbol attribute', 'Field 3: allocation transfer agency identifier'],
      ['Reimbursable Flag (A9)', 'Fund type or customer order assignment', 'Fund attribute or agreement', 'Field 15: reimbursable flag indicator'],
      ['Budget Line Item (B4)', 'Funded program `FMMEASURE` or a fund attribute', 'Program or budget line segment', 'Not reported'],
      ['Object Class (B6)', 'Commitment item `FIPEX` in `FMCI`', 'Object class segment', 'Field 33: budget object class'],
      ['Funding Center (CA1)', 'Funds center `FISTL` in `FMFCTR`', 'Organization or budget organization segment', 'Not reported'],
      ['Cost Center (CA3)', 'Cost center `KOSTL` in `CSKS`', 'Cost center or organization segment', 'Not reported'],
      ['Project (CA4)', 'WBS element `POSID` in `PRPS`', 'Project in `PA_PROJECTS_ALL`, or a project segment', 'Not reported'],
      ['Activity (CA5)', 'Network activity or activity type', 'Task in `PA_TASKS`', 'Not reported'],
      ['Cost Element (CA6)', 'Cost element `KSTAR`, which mirrors the GL account', 'Natural account segment or expenditure type', 'Not reported'],
      ['Work Order (CA7)', 'Order `AUFNR` in `AUFK`', 'Work order or job', 'Not reported'],
      ['Functional Area (CA15)', 'Functional area `FKBER` in `TFKB`', 'Program or function segment', 'Not reported'],
      ['Business Event Type Code (T20)', 'Derived for Treasury cash reporting', '`TAS` and `BETC` mapping in Federal Financials', 'Reported to CARS with payments and collections, not in the GTAS file'],
      ['Trading partner', 'Trading partner on vendor, customer, or line item', 'Trading partner TAS in Federal Financials', 'Fields 19 to 21: federal indicator, partner agency, partner main account']
    ], 'This is a representative mapping. Each program\'s SFIS compliance documentation holds its authoritative crosswalk, and programs differ in which SAP field or Oracle segment carries an element.'),

    h2('3. One obligation, traced across both platforms'),
    p('The table follows a single contract purchase through its life. Each row is one stage. The USSGL column shows the standard entry. The next two columns show where the same event is stored in each product.'),
    table('Transaction lifecycle with USSGL postings and the tables that hold each stage', ['Stage', 'USSGL entry', 'SAP tables', 'Oracle tables', 'What DDRS and GTAS see'], [
      ['Appropriation received', 'Dr `411900` Cr `445000`. Dr `101000` Cr `310100`.', '`FMBH`, `FMBL`, `FMBDT`. FI document in `BKPF`, `BSEG`.', '`FV_BE_TRX_HDRS`, `FV_BE_TRX_DTLS`, then `GL_JE_LINES`.', 'Budget authority by TAS'],
      ['Apportionment and allotment', 'Dr `445000` Cr `451000`. Dr `451000` Cr `461000`.', 'BCS budget documents in `FMBH`, `FMBL`. Availability in `FMAVCT`.', 'Lower budget levels in `FV_BE_TRX_DTLS`.', 'Apportioned and allotted balances'],
      ['Commitment', 'Dr `461000` Cr `470000`.', '`EBAN`, `EBKN`, or `KBLK`, `KBLP`. `FMIOI` value type 50 or 65.', '`PO_REQ_DISTRIBUTIONS_ALL`. Funds check in `GL_BC_PACKETS`.', 'Commitments, USSGL 4700'],
      ['Obligation', 'Dr `470000` Cr `480100`.', '`EKKO`, `EKPO`, `EKKN`. `FMIOI` value type 51.', '`PO_HEADERS_ALL`, `PO_DISTRIBUTIONS_ALL`.', 'Undelivered orders, USSGL 4801'],
      ['Receipt and acceptance', 'Dr `480100` Cr `490100`. Dr `610000` Cr `211000`. Dr `310700` Cr `570000`.', '`MKPF`, `MSEG`, `EKBE`. FI document in `BKPF`, `BSEG`.', '`RCV_TRANSACTIONS`. Accrual through XLA tables.', 'Delivered orders unpaid, expense, payable'],
      ['Invoice', 'No new budgetary entry when receipt already accrued. Payable confirmed.', '`RBKP`, `RSEG`, `BSIK`. `FMIFIIT` value type 54.', '`AP_INVOICES_ALL`, `AP_INVOICE_DISTRIBUTIONS_ALL`.', 'Accounts payable, USSGL 2110'],
      ['Disbursement', 'Dr `490100` Cr `490200`. Dr `211000` Cr `101000`.', '`REGUH`, `REGUP`, `BSAK`. `FMIFIIT` value type 57.', '`AP_CHECKS_ALL`, `AP_INVOICE_PAYMENTS_ALL`, `FV_TREASURY_CONFIRMATIONS_ALL`.', 'Outlays and Fund Balance with Treasury. CARS shows the same cash by TAS and BETC.'],
      ['Year-end close', 'Closing entries move expended and unexpended balances.', 'Carryforward programs in FI and FM.', 'Federal year-end closing definitions.', 'Beginning balances for the next year']
    ], 'USSGL accounts: 4119 other appropriations realized, 4450 unapportioned authority, 4510 apportionments, 4610 allotments, 4700 commitments, 4801 undelivered orders unpaid, 4901 delivered orders unpaid, 4902 delivered orders paid, 1010 Fund Balance with Treasury, 2110 accounts payable, 3101 unexpended appropriations received, 3107 unexpended appropriations used, 5700 expended appropriations, 6100 operating expenses.'),
    callout('Why both products can post the same entry', 'The USSGL entry is the same in SAP and Oracle because both follow the DoD USSGL Transaction Library. The mechanics differ. SAP derives the budgetary entry from the Funds Management update through its budgetary ledger. Oracle derives it from an accounting event through Subledger Accounting rules. In both, the budgetary and proprietary lines come from one business event.'),

    h2('4. The key chain from statement line back to source document'),
    figure('Keys that connect a general ledger line to a trial balance line, a DDRS balance, and a GTAS record', keyChain),
    table('Join keys at each hop', ['From', 'To', 'Key', 'Notes'], [
      ['Statement line', 'Adjusted trial balance', 'Statement crosswalk: USSGL account and attributes', 'Published by Treasury for each statement and by OMB Circular A-136 for form and content.'],
      ['GTAS record', 'Adjusted trial balance', 'TAS components, USSGL account, attribute values', 'DDRS summarizes the DoD ten-digit account to six digits for Treasury.'],
      ['Adjusted trial balance', 'Unadjusted trial balance', 'Same keys, plus the journal voucher lines', 'The difference must equal the logged journal vouchers.'],
      ['Unadjusted trial balance', 'General ledger balance', 'Entity, TAS, DoD SCOA account, attributes', 'SAP: `FAGLFLEXT` or `ACDOCA` summed. Oracle: `GL_BALANCES` joined to `GL_CODE_COMBINATIONS`.'],
      ['General ledger balance', 'General ledger line', 'SAP: company code, account, fund, period. Oracle: ledger, code combination, period.', 'The universe of transactions.'],
      ['General ledger line', 'Subledger entry', 'SAP: `BKPF-AWTYP` and `AWKEY`. Oracle: `GL_SL_LINK_ID` through `GL_IMPORT_REFERENCES`.', 'Manual journals stop here.'],
      ['Subledger entry', 'Business document', 'SAP: `EBELN`, `MBLNR`, `RBKP-BELNR`. Oracle: `SOURCE_ID_INT_1` on `XLA_TRANSACTION_ENTITIES`.', 'Order, receipt, invoice, payment.'],
      ['Business document', 'Feeder system record', 'Contract number (PIID) and line, WAWF shipment or invoice number, travel authorization number, IDoc number or interface batch', 'Stored in reference fields such as `BKPF-XBLNR`, or in descriptive flexfields in Oracle.']
    ]),

    h2('5. Interface standards'),
    table('Standards and transports that connect the systems', ['Standard or transport', 'What it carries', 'Used between'], [
      ['GEX (Global Exchange)', 'File routing and format translation. Also hosts the SLOA validation service.', 'Nearly every feeder and accounting system, and accounting systems to DDRS'],
      ['PDS (Procurement Data Standard)', 'Contract award and modification data', 'Contract writing systems to accounting and entitlement systems'],
      ['PRDS (Purchase Request Data Standard)', 'Purchase request data', 'Accounting or requirements systems to contract writing systems'],
      ['DLMS', 'Defense logistics transactions: requisitions, shipments, receipts, billing', 'Logistics systems, DLA, and financial systems'],
      ['SAP IDoc', 'Structured inbound and outbound messages', 'GEX or middleware to SAP ERPs'],
      ['Oracle open interface tables', 'Staged rows for import programs', 'GEX or middleware to Oracle EBS'],
      ['SFIS trial balance', 'Period balances by TAS, account, and attributes', 'Accounting systems to DDRS'],
      ['GTAS bulk file', '98-character adjusted trial balance records', 'DoD to Treasury'],
      ['IPAC and G-Invoicing', 'Intragovernmental payment, collection, orders, and performance', 'Federal trading partners through Treasury'],
      ['CARS reporting with TAS and BETC', 'Classified payments and collections', 'Disbursing offices to Treasury'],
      ['SLT and other replication', 'Row-level copies of ERP tables', 'ERPs to Advana']
    ], 'GEX, PDS, and PRDS roles follow DCMA Manual 4301-05, Volume 8 and the SLOA Validation Service description.'),

    h2('6. Where the chain breaks'),
    table('Common break points and the tables that prove them', ['Break', 'Symptom', 'SAP evidence', 'Oracle evidence'], [
      ['Interface record not posted', 'Feeder shows an event the ledger does not', 'IDocs in status 51 or 64 in `EDIDS`', 'Rows left in interface tables with an error status'],
      ['Posted to one ledger and not the other', 'Budgetary and proprietary accounts fail tie points', '`FMIFIIT` or `FMIOI` with no matching FI document, or the reverse', 'Unprocessed rows in `XLA_EVENTS`, or accounting errors in `XLA_ACCOUNTING_ERRORS`'],
      ['Obligation without a contract', 'Unsupported undelivered orders', '`EKKO` with no external contract reference. Old open items in `FMIOI`.', '`PO_HEADERS_ALL` with no contract number. Old encumbrances.'],
      ['Payment without matching obligation', 'Unmatched disbursement', '`BSAK` payment with no `EKBE` history', '`AP_INVOICE_DISTRIBUTIONS_ALL` with no `PO_DISTRIBUTION_ID`'],
      ['Manual journal over a system defect', 'Recurring adjustment with the same cause', '`BKPF` with `AWTYP = BKPF` and manual document types', '`GL_JE_HEADERS` with source Manual and no `GL_IMPORT_REFERENCES` rows'],
      ['Attribute missing or invalid', 'GTAS fatal validation, DDRS edit failure', 'Fund or commitment item master without required attributes', 'Fund without a TAS in `FV_FUND_PARAMETERS`'],
      ['Reporting adjustment not pushed back', 'DDRS balance differs from the ledger', 'No matching entry in the ERP', 'No matching entry in the ERP']
    ])
  ],
  sources: [
    { name: 'DoD FMR Volume 1, Chapter 4: Standard Financial Information Structure', url: 'https://comptroller.defense.gov/Portals/45/documents/fmr/current/01/01_04.pdf' },
    { name: 'DoD FMR Volume 1, Chapter 7: DoD Standard Chart of Accounts', url: 'https://comptroller.defense.gov/Portals/45/documents/fmr/current/01/01_07.pdf' },
    { name: 'SFIS SLOA Validation Service Functional Description Document v1.2.4', url: 'https://comptroller.war.gov/Portals/45/Documents/ODCFO/SFIS/SLOA_FDD_v1_2.4_12222022.pdf' },
    { name: 'OUSD(C) SFIS resources page', url: 'https://comptroller.war.gov/ODCFO/sfis/' },
    { name: 'SLOA Accounting Classification memo', url: 'https://comptroller.defense.gov/Portals/45/Documents/ODCFO/SFIS/SLoA_Accounting_Class_Memo.pdf' },
    { name: 'DCMA Manual 4301-05, Volume 8: Financial Systems and Interfaces', url: 'https://www.dcma.mil/Portals/31/Documents/Policy/DCMA_MAN_4301-05_VOL8.pdf' },
    { name: 'Treasury: GTAS bulk file format, fiscal year 2026', url: 'https://fiscal.treasury.gov/system/files/2026-04/bulk-file-format-b.pdf' },
    { name: 'Treasury: USSGL', url: 'https://fiscal.treasury.gov/accounting/us-standard-general-ledger-ussgl' }
  ]
};
