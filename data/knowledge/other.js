import { h2, h3, p, list, steps, callout, table, figure } from './blocks';

const statusOfFunds = {
  id: 'leg-sof',
  cols: 4,
  colWidth: 224,
  colGap: 62,
  rowGap: 58,
  rowLabels: ['Legacy status-of-funds system', 'Conversion in DDRS-B', 'Result'],
  nodes: [
    { id: 'fund', col: 0, row: 0, kind: 'entity', tone: 'source', title: 'FUND_CITE', lines: ['*appropriation, limit,', '*fiscal year, allotment', 'authority received', 'authority distributed'] },
    { id: 'doc', col: 1, row: 0, kind: 'entity', tone: 'source', title: 'DOCUMENT_RECORD', lines: ['*document number', 'fund cite, object class', 'vendor or payee', 'commitment amount', 'obligation amount', 'accrued expenditure unpaid', 'accrued expenditure paid'] },
    { id: 'hist', col: 2, row: 0, kind: 'entity', tone: 'source', title: 'TRANSACTION_HISTORY', lines: ['*document number, sequence', 'transaction type code', 'amount, date, batch', 'input source'] },
    { id: 'sum', col: 3, row: 0, kind: 'entity', tone: 'detail', title: 'STATUS_SUMMARY', lines: ['*fund cite, period', 'stage totals by', 'Report Data Type or', 'General Ledger Account Code'] },
    { id: 'feeder', col: 3, row: 1, tone: 'process', title: 'Feeder file', lines: ['One record per fund cite and RDT or GLAC'] },
    { id: 'xwalk', col: 2, row: 1, tone: 'process', title: 'Crosswalk', lines: ['Each stage becomes a budgetary account and, where needed, a proprietary pair'] },
    { id: 'jv', col: 1, row: 1, tone: 'process', title: 'Edits and journal vouchers', lines: ['Abnormal balances and missing attributes are corrected by adjustment'] },
    { id: 'tb', col: 1, row: 2, tone: 'accounting', title: 'USSGL trial balance', lines: ['Derived in DDRS. Not posted at the transaction level in the source system.'] }
  ],
  edges: [
    { from: 'fund', to: 'doc', label: '1 : N' },
    { from: 'doc', to: 'hist', label: '1 : N' },
    { from: 'hist', to: 'sum', label: 'summarize' },
    { from: 'sum', to: 'feeder' },
    { from: 'feeder', to: 'xwalk' },
    { from: 'xwalk', to: 'jv' },
    { from: 'jv', to: 'tb' }
  ]
};

export const otherPage = {
  slug: 'other-platforms',
  prefix: 'L',
  eyebrow: 'Platform reference',
  navTitle: 'Legacy, Custom, Treasury, and Analytics Platforms',
  shortTitle: 'Legacy, Treasury, and Analytics',
  blurb: 'How status-of-funds legacy systems differ from a transaction-level general ledger, what is public about CEFMS, MOCAS, the disbursing systems, and PIEE, and how the Treasury systems and Advana fit around the ERPs.',
  appliesTo: ['gafs', 'gafs-jv', 'sabrs', 'stars', 'famis', 'abss', 'cefms', 'mocas', 'piee', 'disbursing-cash', 'ipac'],
  blocks: [
    h2('1. Two kinds of accounting system'),
    p('The SAP and Oracle ERPs post a balanced debit and credit for every business event. Most legacy DoD accounting systems do something different. They keep a record per obligation document and update stage amounts on it. That design answers the question of how much of an allotment is left. It does not produce a general ledger.'),
    table('Transaction-level general ledger compared with a status-of-funds system', ['Topic', 'ERP general ledger', 'Status-of-funds system'], [
      ['Unit of record', 'A balanced document with debit and credit lines', 'A document record with stage amounts: committed, obligated, accrued, paid'],
      ['USSGL accounts', 'Posted on every line when the event occurs', 'Not stored. Derived later by crosswalk.'],
      ['Proprietary accounts', 'Posted with the budgetary entry', 'Partly or not captured'],
      ['Trial balance', 'Sum of posted lines', 'Built in DDRS-B from feeder file totals'],
      ['Drill-down', 'Balance to line to source document inside one database', 'Balance to feeder file to source record, across systems'],
      ['FFMIA status', 'Can comply', 'Cannot comply at the transaction level, per DoD IG'],
      ['Typical technology', 'Relational database with a commercial application', 'Mainframe or rehosted batch programs with fixed-format records']
    ]),
    figure('Logical model of a status-of-funds system and its conversion to a USSGL trial balance', statusOfFunds, 'This is a logical pattern drawn from DoD IG descriptions of feeder files, Report Data Types, and General Ledger Account Codes. It is not the schema of any one system.'),
    table('Illustrative crosswalk from accounting stage to USSGL accounts', ['Stage reported by the legacy system', 'Budgetary account', 'Proprietary effect'], [
      ['Allotment received', '4610 Allotments, realized resources', 'None'],
      ['Commitment outstanding', '4700 Commitments', 'None'],
      ['Obligation, undelivered', '4801 Undelivered orders, unpaid', 'None'],
      ['Accrued expenditure, unpaid', '4901 Delivered orders, unpaid', '6100 expense and 2110 accounts payable'],
      ['Accrued expenditure, paid', '4902 Delivered orders, paid', '2110 cleared against 1010 Fund Balance with Treasury']
    ], 'Illustrative only. The actual DDRS-B crosswalk rules are maintained by DFAS and are not public.'),

    h2('2. Legacy general ledger systems still in the reporting chain'),
    table('Legacy systems named by DoD IG, with reported balances and retirement dates', ['System', 'Owner', 'Fund Balance with Treasury', 'Transactions', 'Planned retirement'], [
      ['GAFS-R', 'Air Force', '$222.7 billion', '5,326,910', 'September 30, 2031'],
      ['STANFINS', 'Army', '$57.2 billion', '2,058,106', 'September 30, 2031'],
      ['SOMARDS', 'Army', '$16.6 billion', '18,290', 'September 30, 2025'],
      ['STARS', 'Navy', 'Retired December 2022', 'Data moved to three systems', 'Retired']
    ], 'Source: DODIG-2024-047, Table 1 and related text, using fiscal year 2023 data. Dates were plans as of that report. Other pages on this site carry different retirement information for some systems from other sources. Check the current DoD system inventory before relying on a date.'),
    list(
      'DoD IG counted five outdated general ledger systems in fiscal year 2023. They track status of funds and do not post to all accounts with the needed attributes.',
      'DoD relied on at least 405 systems and micro-applications outside the general ledger systems, with more than 2,000 interfaces.',
      'At least 109 feeder systems were scheduled to remain after fiscal year 2028 or had no retirement date.',
      'When a system retires, its balances can remain in DDRS. See the [DDRS deep dive](/knowledge/ddrs), section 8.',
      'For system-by-system history, see the research paper appendix, [Section 3](/appendix/sec-3).'
    ),
    table('Legacy and custom systems in this suite', ['System', 'What is public about the platform', 'Data it holds', 'How it reaches the statements'], [
      ['GAFS-BL, GAFS-R', 'Legacy Air Force accounting. GAFS-R is the rehosted central system.', 'Fund, document, and stage records. Journal vouchers for adjustments.', 'Feeder files to DDRS-B. Runs alongside DEAMS.'],
      ['ABSS', 'Air Force document preparation and commitment system', 'Requests, commitments, funding certifications', 'Feeds commitment and obligation documents to Air Force accounting'],
      ['SABRS', 'Marine Corps legacy accounting, budgeting, and reporting system', 'Fund control, document records, reimbursables', 'Migrating to DAI'],
      ['STARS', 'Navy legacy mainframe family. Retired.', 'Historical balances', 'Residual balances carried in DDRS'],
      ['FAMIS', 'Legacy accounting family with general fund and working capital fund variants', 'Fund, cost, and billing records', 'Feeder to DDRS'],
      ['CEFMS', 'Custom Army Corps of Engineers system. GAO described two processing centers with a database per Corps site in 2002.', 'Corps general ledger, project cost, and funds control', 'Trial balance to DDRS'],
      ['MOCAS', 'Legacy contract administration and payment system used by DCMA and DFAS', 'Contract, line item, accounting classification, shipment, invoice, and payment records', 'Sends disbursement data to accounting systems. Holds no general ledger.']
    ], 'Platform statements are limited to what public sources say. The existing blueprint pages for each system carry the detailed process model.'),

    h2('3. Entitlement, disbursing, and cash systems'),
    table('Disbursing and cash systems as described by DCMA', ['System', 'Function', 'Data exchanged'], [
      ['Automated Disbursing System (ADS)', 'DFAS system that processes disbursements and collections and reports payments as check and EFT files', 'In: advice of collection, refund acknowledgement, exchange rates. Out: IPAC, collection data, refund data.'],
      ['Treasury Direct Disbursing (TDD)', 'Sends and receives transactions directly with Treasury systems for commercial supplier disbursements', 'Payment requests and confirmations'],
      ['Defense Cash Accountability System (DCAS)', 'Processes and reports DoD disbursements and collections to Treasury. Used for cash management and Fund Balance with Treasury reconciliation.', 'Cash transactions by TAS'],
      ['Payment prevalidation', 'Checks that an obligation exists before a payment is made, to prevent unmatched disbursements', 'Prevalidation requests and responses between entitlement and accounting systems'],
      ['Deployable Disbursing System (DDS)', 'Disbursing in deployed locations', 'Vouchers, collections, and accountability reports']
    ], 'ADS, TDD, DCAS, and prevalidation descriptions follow DCMA Manual 4301-05, Volume 8. DoD IG reported that 21.4 percent of disbursements had converted to Treasury Direct Disbursing as of fiscal year 2022.'),
    p('The audit significance is the same for all of them. A payment made outside the general ledger system must come back and match an obligation in that ledger. A payment that does not match is an unmatched disbursement. Cash reported to Treasury that the ledger has not recorded is an undistributed disbursement, which DDRS records with a category D journal voucher.'),

    h2('4. PIEE'),
    table('PIEE modules and the evidence each one holds', ['Module', 'Holds', 'Audit use'], [
      ['WAWF', 'Vendor invoices, receiving reports, acceptance', 'Proof of receipt and acceptance for a payment'],
      ['EDA', 'Contracts, modifications, and vouchers', 'Proof of obligation'],
      ['GFP module', 'Government furnished property records', 'Existence and completeness of property held by contractors'],
      ['IUID registry', 'Unique item identifiers', 'Asset identity'],
      ['myInvoice', 'Invoice and payment status', 'Payment research'],
      ['MDO', 'Modifications and delivery orders', 'Changes to the obligation'],
      ['JAM', 'Joint Appointment Module records for contracting officer representative appointments', 'Authority of the person who accepted'],
      ['SPM', 'Surveillance and Performance Monitoring reports', 'Evidence that services were performed'],
      ['Contract Closeout', 'Closeout checklist, final invoice, release', 'Support for deobligation of remaining funds']
    ], 'Module list follows the PIEE blueprint page on this site.'),

    h2('5. Treasury systems'),
    table('Treasury systems DoD reports to', ['System', 'What it is', 'What DoD sends or receives', 'Key identifiers'], [
      ['CARS', 'Central Accounting Reporting System. Treasury\'s record of each agency\'s Fund Balance with Treasury.', 'Payments and collections classified at the time of the transaction', 'TAS, BETC, Agency Location Code'],
      ['GTAS', 'Governmentwide Treasury Account Symbol Adjusted Trial Balance System', 'Adjusted trial balance with budgetary and proprietary accounts', 'TAS, USSGL account, attribute domain values'],
      ['IPAC', 'Intragovernmental Payment and Collection', 'Transfers between federal trading partners', 'Agency Location Code, TAS, BETC, document reference'],
      ['G-Invoicing', 'Treasury system for intragovernmental buy and sell agreements', 'General terms and conditions, orders, performance, settlement through IPAC', 'Agreement number, order number, trading partner TAS']
    ]),

    h2('6. Advana'),
    list(
      'DoD FMR Volume 1, Chapter 10 names Advana the common enterprise data repository for the Department.',
      'Components use Advana workbooks for monthly feeder-to-general-ledger reconciliations and quarterly general-ledger-to-trial-balance reconciliations.',
      'DoD IG describes Advana as the central repository for financial management data, including the notice of findings and recommendations database.',
      'In September 2023 the Army reported two real-time replication pipelines from GFEBS and GCSS-Army into Advana using its existing SAP replication services, with plans to federate data to an SAP HANA layer.',
      'The same Army article lists the Advana tool stack as Databricks, MLflow, DataRobot, C3 AI, Qlik, Tableau, SageMaker, Collibra, Apigee, and GitLab.',
      'Advana does not replace DDRS or GTAS. It sits beside them as a reconciliation and analytics layer. The research paper appendix, [Section 11](/appendix/sec-11), covers its current governance and audit status.'
    ),
    table('What an Advana transaction universe needs from each platform', ['Platform', 'Tables to replicate first', 'Reconcile to'], [
      ['SAP', '`BKPF`, `BSEG` or `ACDOCA`, `FAGLFLEXA`, `FMIOI`, `FMIFIIT`, `EKKO`, `EKPO`, `EKKN`, `EKBE`', '`FAGLFLEXT` totals and the trial balance sent to DDRS'],
      ['Oracle EBS', '`GL_JE_HEADERS`, `GL_JE_LINES`, `GL_CODE_COMBINATIONS`, `GL_IMPORT_REFERENCES`, `XLA_AE_HEADERS`, `XLA_AE_LINES`, `XLA_TRANSACTION_ENTITIES`', '`GL_BALANCES` and the trial balance sent to DDRS'],
      ['Legacy', 'Document and transaction history files, feeder files', 'DDRS-B unadjusted trial balance'],
      ['DDRS', 'Unadjusted trial balance, journal voucher logs, adjusted trial balance', 'GTAS submission and published statements']
    ])
  ],
  sources: [
    { name: 'DODIG-2024-047: DoD Plans to Address Longstanding Issues with Outdated Financial Management Systems', url: 'https://media.defense.gov/2024/Jan/23/2003380087/-1/-1/1/DODIG-2024-047%20SECURE.PDF' },
    { name: 'DODIG-2012-096: DDRS-Budgetary and Army General Fund feeder files', url: 'https://media.defense.gov/2012/May/31/2001712372/-1/-1/1/DODIG-2012-096.pdf' },
    { name: 'DCMA Manual 4301-05, Volume 8: Financial Systems and Interfaces', url: 'https://www.dcma.mil/Portals/31/Documents/Policy/DCMA_MAN_4301-05_VOL8.pdf' },
    { name: 'GAO-02-589: Corps of Engineers information security (CEFMS description)', url: 'https://www.govinfo.gov/content/pkg/GAOREPORTS-GAO-02-589/html/GAOREPORTS-GAO-02-589.htm' },
    { name: 'Army.mil: GFEBS and GCSS-Army replication pipelines to Advana (Sept 2023)', url: 'https://www.army.mil/article/270109/the_u_s_army_and_dod_chief_digital_and_artificial_intelligence_office_cdao_accelerate_the_speed_and_efficiency_of_data_with_two_data_replication_pipelines' },
    { name: 'Treasury: GTAS', url: 'https://fiscal.treasury.gov/accounting/government-wide-treasury-account-symbol-gtas' },
    { name: 'Treasury: intragovernmental transactions, IPAC and G-Invoicing', url: 'https://fiscal.treasury.gov/accounting/intragov' }
  ]
};
