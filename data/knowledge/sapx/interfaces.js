import { h2, h3, p, list, steps, callout, table, figure } from '../blocks';

const inbound = {
  id: 'sapx-idocin',
  cols: 5,
  colWidth: 180,
  colGap: 40,
  rowGap: 58,
  rowLabels: ['Transport and translation', 'IDoc interface in the ERP', 'Application posting and evidence'],
  nodes: [
    { id: 'src', col: 0, row: 0, tone: 'source', title: 'Sending system', lines: ['Travel, invoicing, payroll, contract writing, disbursing'] },
    { id: 'gex', col: 1, row: 0, tone: 'source', title: 'Global Exchange (GEX)', lines: ['Routes files', 'Translates formats', 'Can validate the line of accounting'] },
    { id: 'pi', col: 2, row: 0, tone: 'source', title: 'Middleware', lines: ['SAP PI/PO or file adapter', 'Maps to an IDoc or a proxy call'] },
    { id: 'port', col: 3, row: 0, tone: 'detail', title: 'Port and partner profile', lines: ['Port: file, tRFC, or XML', 'Partner profile names the sender, message type, and process code'] },
    { id: 'mon', col: 4, row: 0, tone: 'reporting', title: 'Monitoring', lines: ['WE02, WE05, BD87', 'Alerts and workflow to interface owners'] },
    { id: 'ctl', col: 1, row: 1, kind: 'entity', tone: 'detail', title: 'EDIDC control', lines: ['*DOCNUM', 'MESTYP, IDOCTP', 'SNDPRN, RCVPRN', 'STATUS, CREDAT'] },
    { id: 'dat', col: 2, row: 1, kind: 'entity', tone: 'detail', title: 'EDID4 data', lines: ['*DOCNUM, SEGNUM', 'SEGNAM  segment type', 'SDATA  1000 characters', 'Parent and child segments'] },
    { id: 'sta', col: 3, row: 1, kind: 'entity', tone: 'detail', title: 'EDIDS status', lines: ['*DOCNUM, LOGDAT,', '*LOGTIM, COUNTR', 'STATUS', 'STAMID, STAMNO  message', 'STAPA1..4  variables'] },
    { id: 'pc', col: 4, row: 1, tone: 'process', title: 'Process code', lines: ['Points to the inbound function module', 'Runs immediately or by background job RBDAPP01'] },
    { id: 'bapi', col: 1, row: 2, tone: 'process', title: 'Application function', lines: ['Same checks as online entry: master data, period, authorization of the interface user, funds availability'] },
    { id: 'ok', col: 2, row: 2, tone: 'accounting', title: 'Status 53', lines: ['Document posted', 'Status record carries the document number', 'BKPF-AWTYP or XBLNR carries the reference'] },
    { id: 'bad', col: 3, row: 2, tone: 'statements', title: 'Status 51', lines: ['Set when the application function fails', 'Not posted', 'Error message stored', 'Fix data, then reprocess in BD87'] },
    { id: 'rec', col: 4, row: 2, tone: 'reporting', title: 'Reconciliation', lines: ['Count and amount sent versus posted, in error, and waiting'] }
  ],
  edges: [
    { from: 'src', to: 'gex' }, { from: 'gex', to: 'pi' }, { from: 'pi', to: 'port' },
    { from: 'port', to: 'ctl' },
    { from: 'ctl', to: 'dat', label: '1 : N' }, { from: 'dat', to: 'sta' }, { from: 'sta', to: 'pc' },
    { from: 'pc', to: 'bapi', my: 0 },
    { from: 'bapi', to: 'ok', label: 'success' }, { from: 'bad', to: 'rec' },
    { from: 'mon', to: 'pc', dashed: true }
  ]
};

const gfebsMap = {
  id: 'sapx-gfebsint',
  cols: 5,
  colWidth: 180,
  colGap: 40,
  rowGap: 60,
  rowLabels: ['Inbound sources', 'GFEBS business process areas', 'Outbound targets'],
  nodes: [
    { id: 'i1', col: 0, row: 0, tone: 'source', title: 'Budget and funding', lines: ['Approved funding program retraction', 'Fund control module'] },
    { id: 'i2', col: 1, row: 0, tone: 'source', title: 'Contracting and requirements', lines: ['Contract writing systems', 'Logistics ERPs for stock procurement'] },
    { id: 'i3', col: 2, row: 0, tone: 'source', title: 'Invoicing and acceptance', lines: ['Invoices and receiving reports through GEX'] },
    { id: 'i4', col: 3, row: 0, tone: 'source', title: 'Pay and travel', lines: ['Civilian payroll', 'Travel systems', 'Transportation payment'] },
    { id: 'i5', col: 4, row: 0, tone: 'source', title: 'Treasury and cash', lines: ['IPAC', 'Cash accountability data', 'Vendor registration data'] },
    { id: 'fm', col: 0, row: 1, tone: 'process', title: 'Funds Management', lines: ['Budget, funds control, status of funds'] },
    { id: 'sc', col: 1, row: 1, span: 2, tone: 'process', title: 'Spending Chain', lines: ['Requisitions, orders, receipts, invoices, payments, funds commitments'] },
    { id: 'cm', col: 3, row: 1, tone: 'process', title: 'Cost Management and Reimbursables', lines: ['Cost objects, labor, sales orders, billing'] },
    { id: 'fi', col: 4, row: 1, tone: 'process', title: 'Financials and PP&E', lines: ['General ledger, cash balancing, assets, real property'] },
    { id: 'o1', col: 0, row: 2, tone: 'statements', title: 'DDRS', lines: ['SFIS and DDRS trial balance extracts'] },
    { id: 'o2', col: 1, row: 2, tone: 'statements', title: 'Disbursing', lines: ['Payment files', 'Vendor EFT validation'] },
    { id: 'o3', col: 2, row: 2, tone: 'statements', title: 'Trading partners', lines: ['Outbound MIPR, DD Form 448', 'SF 1080 and 1081 files'] },
    { id: 'o4', col: 3, row: 2, tone: 'statements', title: 'Treasury reports', lines: ['Receivables report', 'Form 1099 data', 'Treasury offset file'] },
    { id: 'o5', col: 4, row: 2, tone: 'statements', title: 'Analytics', lines: ['SAP BI', 'Advana replication'] }
  ],
  edges: [
    { from: 'i1', to: 'fm' }, { from: 'i2', to: 'sc', tx: -110 }, { from: 'i3', to: 'sc', tx: 110 },
    { from: 'i4', to: 'cm' }, { from: 'i5', to: 'fi' },
    { from: 'fm', to: 'o1', dashed: true }, { from: 'sc', to: 'o2', sx: -110 }, { from: 'sc', to: 'o3', sx: 110 },
    { from: 'cm', to: 'o4' }, { from: 'fi', to: 'o5' }
  ]
};

export const sapInterfacesPage = {
  slug: 'sap-interfaces',
  prefix: 'SI',
  group: 'SAP expert series',
  eyebrow: 'SAP expert series, part 7',
  navTitle: 'SAP Interfaces in Depth: IDocs, BAPIs, Middleware, and DoD Interface Partners',
  shortTitle: 'SAP Interfaces',
  blurb: 'Every interface technology an SAP ERP uses, the anatomy and status model of an IDoc, the standard message types and BAPIs behind financial and logistics postings, and what public sources show about the interfaces of each DoD SAP system.',
  appliesTo: ['gfebs', 'navy-erp', 'gcss-army', 'lmp', 'dla-ebs', 'piee'],
  blocks: [
    h2('1. Why interfaces decide auditability'),
    p('A DoD SAP system does not originate most of its transactions. Contracts are written elsewhere. Invoices and receiving reports are captured elsewhere. Payroll and travel are computed elsewhere. Most payments are disbursed elsewhere. Each of those events reaches the ledger through an interface, and each interface is a place where a transaction can be lost, duplicated, changed, or delayed.'),
    list(
      'DoD IG reported in 2024 that DoD relied on more than 2,000 interfaces between systems, and that feeder systems add complexity because DoD implemented only portions of its commercial ERP systems.',
      'The same report notes that no DoD Component used its ERP to write contracts, so procure-to-pay transactions leave the ERP and come back.',
      'When the Marine Corps relied more on its ERP for entitlement, unmatched disbursements fell by tens of millions of dollars, according to that report.'
    ),

    h2('2. Interface technologies'),
    table('SAP interface technologies', ['Technology', 'How it works', 'Synchronous', 'Typical use', 'Evidence'], [
      ['IDoc over ALE or EDI', 'A structured document is stored in the database, then processed by a function module', 'No', 'Invoices, orders, master data, goods movements, accounting documents', '`EDIDC`, `EDID4`, `EDIDS`'],
      ['BAPI', 'A released, stable function module that represents a business object method', 'Yes, or wrapped in an IDoc', 'Create orders, receipts, invoices, accounting documents from another system', 'Return table of messages. Application log if written.'],
      ['RFC', 'Remote call of any enabled function module. Variants: synchronous, transactional, queued, background', 'Depends on the variant', 'System-to-system calls, middleware adapters', '`SM58` for transactional RFC, `SMQ1` and `SMQ2` for queues'],
      ['Web services and OData', 'SOAP or REST calls through the Internet Communication Manager', 'Yes', 'Portals, Fiori apps, modern integrations', 'Web service logs, gateway error log'],
      ['File interface', 'A program reads or writes a flat file on the application server or a transfer directory', 'No', 'Payment files, trial balance extracts, legacy feeds', 'Program log, job log, file archive'],
      ['Batch input', 'A recorded screen sequence is replayed with data from a file', 'No', 'Conversions and low-volume loads', '`SM35` session log'],
      ['Legacy System Migration Workbench', 'A tool that maps a file to batch input, BAPI, or IDoc', 'No', 'Data conversion at go-live', 'Project logs'],
      ['SLT replication', 'Database triggers capture changes and a replication server applies them to a target', 'Near real time', 'Analytics platforms', 'Replication monitor `LTRC`'],
      ['BW extraction', 'DataSources deliver full or delta loads', 'No', 'Data warehouse reporting', '`RSA3`, delta queue monitors'],
      ['Change pointers', 'Master data changes are logged and turned into IDocs', 'No', 'Distributing vendors, materials, cost centers', '`BDCP2`, `BD21`']
    ]),

    h2('3. Anatomy of an IDoc'),
    figure('Inbound IDoc processing from the sending system to a posted document', inbound),
    table('IDoc building blocks', ['Element', 'What it is', 'Where defined'], [
      ['Message type', 'The business meaning of the message, for example an invoice', '`WE81`'],
      ['Basic type', 'The structure: an ordered tree of segments with repeat rules', '`WE30`'],
      ['Extension', 'Customer segments added to a basic type', '`WE30`'],
      ['Segment', 'One record of up to 1,000 characters with named fields', '`WE31`'],
      ['Control record', 'One per IDoc: sender, receiver, message type, basic type, status, dates', '`EDIDC`'],
      ['Status records', 'The history of every processing step', '`EDIDS`'],
      ['Partner profile', 'Per partner and message type: the process code inbound, the port and output mode outbound', '`WE20`, tables `EDP21` and `EDP13`'],
      ['Port', 'The technical channel: file, transactional RFC, XML', '`WE21`'],
      ['Process code', 'Links the message type to the function module that posts it', '`WE42` inbound, `WE41` outbound'],
      ['Logical system', 'The name of a system in the distribution model', '`BD54`, `BD64`']
    ]),
    table('IDoc status codes', ['Status', 'Direction', 'Meaning', 'What to do'], [
      ['01', 'Outbound', 'IDoc created', 'Wait for dispatch'],
      ['02', 'Outbound', 'Error passing data to port', 'Check the port and file system or RFC destination'],
      ['03', 'Outbound', 'Data passed to port', 'Dispatched. Confirm receipt at the target.'],
      ['12', 'Outbound', 'Dispatch OK', 'None'],
      ['26', 'Outbound', 'Syntax error in IDoc', 'Fix the mapping or segment definition'],
      ['29', 'Outbound', 'Error in ALE service', 'Check the partner profile and distribution model'],
      ['30', 'Outbound', 'Ready for dispatch', 'Collected. Run the dispatch job.'],
      ['50', 'Inbound', 'IDoc added', 'Being created'],
      ['51', 'Inbound', 'Application document not posted', 'Read the message, correct master data or the IDoc, reprocess'],
      ['52', 'Inbound', 'Application document not fully posted', 'Check what posted and what did not'],
      ['53', 'Inbound', 'Application document posted', 'None. The status record names the document.'],
      ['56', 'Inbound', 'IDoc with errors added', 'Partner profile or control data problem'],
      ['60', 'Inbound', 'Syntax error', 'Fix the sending map'],
      ['62', 'Inbound', 'Passed to application', 'In process'],
      ['64', 'Inbound', 'Ready to be transferred to application', 'Waiting for the processing job'],
      ['65', 'Inbound', 'Error in ALE service', 'Check the inbound configuration'],
      ['66', 'Inbound', 'Waiting for predecessor IDoc', 'Serialization. Process the earlier IDoc first.'],
      ['68', 'Inbound', 'Error, no further processing', 'Closed by a person. Requires a documented reason.'],
      ['69', 'Inbound', 'IDoc was edited', 'The original is kept as a copy with status 70'],
      ['70', 'Inbound', 'Original of an edited IDoc', 'Evidence of what was changed']
    ], 'Status 51 and 64 at period end are unrecorded transactions. Status 68 and 69 are manual interventions and belong in the population an auditor tests.'),

    h2('4. Standard message types and BAPIs'),
    table('Message types and basic types behind common DoD interfaces', ['Message type', 'Basic type', 'Business content', 'Typical direction'], [
      ['`ORDERS`', '`ORDERS05`', 'Purchase order or sales order', 'Out to vendors or contract systems, in as sales orders'],
      ['`ORDCHG`', '`ORDERS05`', 'Order change', 'Both'],
      ['`ORDRSP`', '`ORDERS05`', 'Order confirmation', 'In'],
      ['`PREQCR`', '`PREQCR1xx`', 'Purchase requisition create', 'In from requirements systems'],
      ['`PORDCR`', '`PORDCR1xx`', 'Purchase order create through BAPI', 'In from contract writing systems'],
      ['`INVOIC`', '`INVOIC02`', 'Vendor invoice or customer bill', 'In from invoicing systems, out to customers'],
      ['`DESADV`', '`DELVRY03`', 'Shipping notification or delivery', 'Both'],
      ['`WMMBXY`', '`WMMBID02`', 'Goods movements from an external system', 'In from warehouse or acceptance systems'],
      ['`MBGMCR`', '`MBGMCR0x`', 'Goods movement create through BAPI', 'In'],
      ['`ACC_DOCUMENT`', '`ACC_DOCUMENT0x`', 'Accounting document through the accounting BAPI', 'In from payroll, travel, and legacy feeders'],
      ['`FIDCC1`, `FIDCC2`', '`FIDCCP02`', 'Complete FI documents between systems', 'Between SAP systems'],
      ['`PAYEXT`, `REMADV`', '`PEXR2002`', 'Payment order and remittance advice', 'Out to disbursing or banks'],
      ['`FINSTA`', '`FINSTA01`', 'Bank or account statement', 'In'],
      ['`MATMAS`', '`MATMAS05`', 'Material master', 'From the master data hub'],
      ['`CREMAS`', '`CREMAS0x`', 'Vendor master', 'From the master data hub'],
      ['`DEBMAS`', '`DEBMAS0x`', 'Customer master', 'From the master data hub'],
      ['`COSMAS`', '`COSMAS01`', 'Cost center master', 'Between finance and logistics ERPs'],
      ['`GLMAST`', '`GLMAST01`', 'G/L account master', 'Between ERPs'],
      ['`INTERNAL_ORDER`', '`INTERNAL_ORDER01`', 'Internal order master', 'Between ERPs'],
      ['`PROJECT`', '`PROJECT0x`', 'Project and WBS master', 'Between ERPs'],
      ['`HRMD_A`', '`HRMD_A0x`', 'Personnel master data', 'From personnel systems'],
      ['`EXCHANGE_RATE`', '`EXCHANGE_RATE01`', 'Exchange rates', 'In']
    ], 'These are SAP-delivered message types. A suffix shown as x varies by release. DoD programs also define custom message types and extend basic types with custom segments for line of accounting data. Those definitions are not public.'),
    table('BAPIs and function modules behind financial and logistics postings', ['Function', 'Creates or changes', 'Tables written'], [
      ['`BAPI_ACC_DOCUMENT_POST`', 'Accounting document with any mix of G/L, vendor, customer, and tax lines', '`BKPF`, `BSEG`, FM and CO line items. `AWTYP` is supplied by the caller.'],
      ['`BAPI_ACC_DOCUMENT_REV_POST`', 'Reversal of such a document', 'New reversing document'],
      ['`BAPI_PR_CREATE`, `BAPI_PR_CHANGE`', 'Purchase requisition', '`EBAN`, `EBKN`, `FMIOI`'],
      ['`BAPI_PO_CREATE1`, `BAPI_PO_CHANGE`', 'Purchase order', '`EKKO`, `EKPO`, `EKKN`, `EKET`, `FMIOI`'],
      ['`BAPI_GOODSMVT_CREATE`', 'Goods movement', '`MKPF`, `MSEG`, `EKBE`, `BKPF`, `BSEG`'],
      ['`BAPI_ENTRYSHEET_CREATE`', 'Service entry sheet', '`ESSR`, `ESLL`'],
      ['`BAPI_INCOMINGINVOICE_CREATE`, `BAPI_INCOMINGINVOICE_PARK`', 'Logistics invoice', '`RBKP`, `RSEG`, `EKBE`, `BKPF`, `BSEG`'],
      ['`BAPI_SALESORDER_CREATEFROMDAT2`', 'Sales order', '`VBAK`, `VBAP`, `VBKD`'],
      ['`BAPI_BILLINGDOC_CREATEMULTIPLE`', 'Billing documents', '`VBRK`, `VBRP`, `BKPF`, `BSEG`'],
      ['`BAPI_FIXEDASSET_CREATE1`, `BAPI_FIXEDASSET_CHANGE`', 'Asset master', '`ANLA`, `ANLZ`, `ANLB`'],
      ['`BAPI_COSTCENTER_CREATEMULTIPLE`', 'Cost centers', '`CSKS`, `CSKT`'],
      ['`BAPI_INTERNALORDER_CREATE`', 'Internal order', '`AUFK`'],
      ['`BAPI_BUS2054_CREATE_MULTI`', 'WBS elements', '`PRPS`, `PRHI`'],
      ['`BAPI_ALM_ORDER_MAINTAIN`', 'Maintenance order', '`AUFK`, `AFIH`, `AFVC`, `RESB`'],
      ['`BAPI_ALM_NOTIF_CREATE`', 'Maintenance notification', '`QMEL`, `QMFE`'],
      ['`BAPI_0050_CREATE`', 'Budget entry document in the Budget Control System', '`FMBH`, `FMBL`, `FMBDT`'],
      ['`BAPI_TRANSACTION_COMMIT`', 'Commits the work of preceding BAPI calls', 'None of its own. Without it nothing is saved.']
    ], 'BAPI names are standard SAP. A posting made through the accounting BAPI carries the reference the sender supplied, which is why the interface design decides whether a ledger line can be traced to a feeder record.'),

    h2('5. Middleware and DoD exchange standards'),
    table('What sits between the feeder and the ERP', ['Layer', 'Role', 'Notes'], [
      ['Global Exchange (GEX)', 'DoD file routing and translation service', 'DCMA lists trial balance and other files to and from its accounting system as moving through GEX. The SLOA validation service runs as a GEX component.'],
      ['SLOA validation', 'Checks each line of accounting element against SFIS rules and value lists', 'Returns results in the acknowledgment and feeds a reporting data mart'],
      ['Procurement Data Standard and Purchase Request Data Standard', 'Standard structures for contract awards and purchase requests', 'Used between contract writing systems and accounting systems'],
      ['Defense Logistics Management Standards', 'Standard logistics transactions for requisitions, shipment status, receipts, and interfund billing', 'Used between logistics ERPs, DLA, and financial systems'],
      ['SAP PI/PO', 'Maps external formats to IDocs or proxies and routes them', 'Message monitoring holds the technical delivery evidence'],
      ['Master data hub', 'Central maintenance and distribution of materials, vendors, customers, and organizational data', 'The Army Enterprise Systems Integration Program provides this for GFEBS, GCSS-Army, and LMP'],
      ['Translation service for legacy systems', 'Converts non-SFIS data elements to SFIS', 'Allowed by DoD FMR Volume 1, Chapter 4 to reduce the number of interfaces']
    ]),

    h2('6. What public sources show about each DoD SAP system'),
    figure('GFEBS interface map built from public transaction names and procedures', gfebsMap, 'Each box reflects an interface or extract that is named in the public GFEBS role-to-transaction mapping or desktop procedures. It is not the program\'s interface control inventory.'),
    table('GFEBS interfaces evidenced in public material', ['Partner or output', 'Direction', 'Evidence', 'Business content'], [
      ['DDRS', 'Out', 'Custom transactions for an SFIS trial balance extract and two DDRS trial balance extracts', 'Period trial balance by TAS, account, and attributes'],
      ['Defense Cash Accountability System', 'Out and in', 'Custom extract and identification transactions, SF 1080 and SF 1081 extracts under cash balancing', 'Collections, transfers, cash reconciliation'],
      ['Civilian payroll system', 'In', 'Custom payroll error transaction under period-end reports', 'Payroll expense and liabilities'],
      ['Defense Travel System', 'In', 'Custom travel interface error transaction under reimbursables', 'Travel obligations and vouchers'],
      ['Integrated Automated Travel System', 'In and out', 'Funds commitment document type for travel, vendor record for the travel system', 'Travel settlement payments'],
      ['Transportation payment system', 'In', 'Funds commitment document type for transportation', 'Transportation charges'],
      ['Contract writing system', 'Out and in', 'Requisition document type for the standard procurement system, contract number and line item fields on the purchase order', 'Purchase requests out, awards in'],
      ['Other federal and DoD buyers and sellers', 'Out', 'Custom transaction that prints DD Form 448', 'Military Interdepartmental Purchase Requests'],
      ['Disbursing', 'Out', 'Payment run step that sends payments to the deployable disbursing system, payment list for the federal payment run', 'Payment files'],
      ['Electronic funds transfer vendor file', 'In', 'Vendor validation against the corporate EFT file', 'Payee banking data'],
      ['Treasury IPAC', 'Both', 'Federal IPAC transaction, IPAC payment method on sales orders', 'Intragovernmental collections and payments'],
      ['Treasury Offset Program', 'Out and in', 'Offset file and update programs', 'Delinquent debt referral'],
      ['Internal Revenue Service reporting', 'Out', 'Custom Form 1099 report and withholding load', 'Vendor income reporting'],
      ['Fund control module', 'In and out', 'Custom fund control module transactions, legacy commitment document type', 'Legacy commitments'],
      ['Budget formulation', 'In', 'Custom retraction transaction, steps to upload data to SAP BI', 'Approved funding program'],
      ['Entitlement system', 'In', 'Custom entitlement system report', 'Entitlement and payment status'],
      ['GCSS-Army', 'Not stated', 'DoD IG lists GCSS-Army as executing standard stock procurement', 'Logistics obligations and expenses'],
      ['Corps of Engineers Financial Management System', 'None', 'DoD IG reported no interface sending construction costs to GFEBS', 'Construction in progress recorded by other means'],
      ['Advana', 'Out', 'Army article on replication pipelines', 'Transaction-level replication']
    ], 'Evidence comes from a public role-to-transaction mapping, the Army Financial Management School desktop procedures of 2013, DoD IG reports, and an Army news article. System names behind custom transaction abbreviations are this page\'s reading of those abbreviations.'),
    table('Interface facts for the other DoD SAP systems', ['System', 'What public sources state'], [
      ['GCSS-Army', 'Replaced the tactical supply, property book, and maintenance systems and two tactical financial systems. DOT&E states that the Army Enterprise Systems Integration Program provides hub services, centralized master data, and cross-functional business intelligence for the Army ERPs. Tactical users connect by satellite terminals. Replicates to Advana with GFEBS.'],
      ['LMP', 'In July 2025 the Army released an interface between the Army Contract Writing System and LMP for working capital fund purchases: awards and financial data flow to LMP, purchase request updates synchronize in both directions, and users enter data once in the contract system.'],
      ['Navy ERP', 'DoD IG describes it as a mixed logistics and financial system that prepares Navy General Fund and Working Capital Fund statements. The Navy had not implemented all 70 SFIS data elements as of 2017 and was working on the last nine.'],
      ['DLA EBS', 'DoD IG reported that EBS could not generate trial balances for direct DDRS reporting. DFAS downloaded EBS data monthly and used manual uploads and journal vouchers. EBS handled about 114,000 requisitions and 11,200 contract actions a day.']
    ]),

    h2('7. Interface controls and reconciliation'),
    table('Controls every interface needs and the SAP evidence for each', ['Control', 'Question it answers', 'SAP evidence'], [
      ['Completeness', 'Did everything sent arrive?', 'Count and amount by batch from the sender compared with IDocs created in `EDIDC`'],
      ['Accuracy', 'Did it post with the same values?', 'IDoc data in `EDID4` compared with the posted document'],
      ['Validity', 'Was the sender authorized?', 'Partner profile, RFC destination, interface user and its role'],
      ['Timeliness', 'Was it posted in the right period?', 'IDoc creation date against document posting date'],
      ['Error handling', 'Are failures worked to closure?', 'Aging of status 51 and 64. Reprocessing history in `EDIDS`.'],
      ['No duplicates', 'Could the same record post twice?', 'Duplicate check on reference number, for example vendor invoice number in `XBLNR`'],
      ['Restricted change', 'Can an IDoc be edited before posting?', 'Status 69 and 70. Authorization for `WE19` and IDoc editing in production.'],
      ['Traceability', 'Can a ledger line be tied to a feeder record?', '`BKPF-XBLNR`, `BKTXT`, `AWKEY`, and custom reference fields'],
      ['Retention', 'Are messages kept long enough for audit?', 'IDoc archiving and deletion schedule']
    ]),
    steps(
      'Get the feeder system population for the period: count and amount by transaction type.',
      'Select `EDIDC` by message type, partner, and creation date. Count by status.',
      'For status 53, read the application document number from the status record and confirm it exists.',
      'Sum the amounts on the posted documents and compare with the feeder total.',
      'List status 51, 56, 60, 64, and 66. These are received and not posted.',
      'List status 68, 69, and 70. These were handled by a person. Ask for the reason and approval.',
      'List documents posted by the interface user that have no IDoc. These came through a different path.',
      'Compare what the feeder sent with what the ERP received. Records missing on the ERP side never arrived.'
    )
  ],
  sources: [
    { name: 'DODIG-2024-047: DoD Plans to Address Longstanding Issues with Outdated Financial Management Systems', url: 'https://media.defense.gov/2024/Jan/23/2003380087/-1/-1/1/DODIG-2024-047%20SECURE.PDF' },
    { name: 'GFEBS role to transaction code mapping (public copy)', url: 'https://pdfcoffee.com/role-to-t-code-mapping-pdf-free.html' },
    { name: 'U.S. Army Financial Management School: GFEBS Desktop SOP (public copy)', url: 'https://silo.tips/download/us-army-financial-management-school-gfebs-desktop-sop' },
    { name: 'SFIS SLOA Validation Service Functional Description Document v1.2.4', url: 'https://comptroller.war.gov/Portals/45/Documents/ODCFO/SFIS/SLOA_FDD_v1_2.4_12222022.pdf' },
    { name: 'DCMA Manual 4301-05, Volume 8: Financial Systems and Interfaces', url: 'https://www.dcma.mil/Portals/31/Documents/Policy/DCMA_MAN_4301-05_VOL8.pdf' },
    { name: 'DOT&E FY2012 annual report: GCSS-Army', url: 'https://www.dote.osd.mil/Portals/97/pub/reports/FY2012/army/2012gcss-a.pdf?ver=2019-08-22-111732-487' },
    { name: 'Army.mil: Army Contract Writing System interface to LMP (July 2025)', url: 'https://www.army.mil/article/287415/u_s_army_continues_to_streamline_procurement_and_financial_processes_with_release_of_new_interface' },
    { name: 'DODIG-2017-068: Strategic Plan Needed for Navy Financial Management Systems', url: 'https://media.defense.gov/2017/Dec/19/2001858354/-1/-1/1/DODIG-2017-068.PDF' },
    { name: 'DODIG-2013-057: DLA Enterprise Business System and the USSGL', url: 'https://media.defense.gov/2013/Mar/20/2001712815/-1/-1/1/DODIG-2013-057.pdf' },
    { name: 'DODIG-2020-035: Followup audit of GFEBS Acquire-to-Retire and Budget-to-Report', url: 'https://media.defense.gov/2019/Dec/02/2002218762/-1/-1/1/DODIG-2020-035.PDF' }
  ]
};
