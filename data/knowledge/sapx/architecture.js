import { h2, h3, p, list, steps, callout, table, figure } from '../blocks';

const posting = {
  id: 'sapx-luw',
  cols: 5,
  colWidth: 178,
  colGap: 36,
  rowGap: 56,
  rowLabels: ['Dialog: the user or interface works through screens', 'Update: the document is written', 'Result: what exists in the database'],
  nodes: [
    { id: 'd1', col: 0, row: 0, tone: 'source', title: 'Dialog step 1', lines: ['Screen input', 'Work process A', 'Own database commit at the end'] },
    { id: 'd2', col: 1, row: 0, tone: 'source', title: 'Dialog step 2', lines: ['Checks, derivations, funds check', 'May run in work process B'] },
    { id: 'd3', col: 2, row: 0, tone: 'source', title: 'Save', lines: ['Number assigned from NRIV', 'Update modules registered', 'COMMIT WORK'] },
    { id: 'lock', col: 3, row: 0, tone: 'detail', title: 'Enqueue locks', lines: ['Held across dialog steps', 'Passed to the update task', 'Released when the update ends'] },
    { id: 'auth', col: 4, row: 0, tone: 'detail', title: 'Authorization checks', lines: ['AUTHORITY-CHECK at transaction start and before save', 'Failures shown in SU53'] },
    { id: 'v1', col: 2, row: 1, tone: 'process', title: 'V1 update', lines: ['Update work process', 'All inserts in one database transaction', 'All or nothing'] },
    { id: 'v2', col: 3, row: 1, tone: 'process', title: 'V2 and collective update', lines: ['Statistics and info structures', 'Runs after V1 succeeds'] },
    { id: 'err', col: 1, row: 1, tone: 'statements', title: 'Update failure', lines: ['Entry stays in VBHDR and VBMOD', 'Express mail to the user', 'Document number is consumed with no document'] },
    { id: 'fi', col: 1, row: 2, kind: 'entity', tone: 'accounting', title: 'FI document', lines: ['BKPF, BSEG', 'FAGLFLEXA or ACDOCA'] },
    { id: 'fm', col: 2, row: 2, kind: 'entity', tone: 'accounting', title: 'FM document', lines: ['FMIFIIT, FMIOI', 'FMIT, FMAVCT'] },
    { id: 'co', col: 3, row: 2, kind: 'entity', tone: 'accounting', title: 'CO document', lines: ['COBK, COEP', 'COSP, COSS'] },
    { id: 'log', col: 4, row: 2, kind: 'entity', tone: 'reporting', title: 'Change and status logs', lines: ['CDHDR, CDPOS', 'JEST, JCDS', 'Workflow log'] }
  ],
  edges: [
    { from: 'd1', to: 'd2' }, { from: 'd2', to: 'd3' },
    { from: 'd3', to: 'v1', label: 'update request' },
    { from: 'v1', to: 'v2' },
    { from: 'v1', to: 'err', dashed: true, label: 'on error' },
    { from: 'v1', to: 'fm' },
    { from: 'v1', to: 'fi', sx: -50, tx: 40 },
    { from: 'v1', to: 'co', sx: 50, tx: -40 },
    { from: 'v2', to: 'log', sx: 50, tx: -30 }
  ]
};

const ddic = {
  id: 'sapx-ddic',
  cols: 4,
  colWidth: 222,
  colGap: 64,
  rowGap: 56,
  nodes: [
    { id: 'dom', col: 0, row: 0, kind: 'entity', tone: 'detail', title: 'Domain  BUKRS', lines: ['Technical type CHAR 4', 'Value table T001', 'Conversion routine, if any', 'Fixed values, if any'] },
    { id: 'de', col: 1, row: 0, kind: 'entity', tone: 'process', title: 'Data element  BUKRS', lines: ['Semantic meaning', 'Field labels: Company Code', 'F1 help documentation', 'Search help', 'Change document flag'] },
    { id: 'fld', col: 2, row: 0, kind: 'entity', tone: 'accounting', title: 'Table field  BSEG-BUKRS', lines: ['Position in the table', 'Key flag', 'Foreign key to T001', 'Reference field for amounts'] },
    { id: 'tab', col: 3, row: 0, kind: 'entity', tone: 'accounting', title: 'Table  BSEG', lines: ['Category: cluster in ECC,', 'transparent in S/4HANA', 'Delivery class A', 'Technical settings: buffering,', 'logging, size category'] },
    { id: 'struct', col: 0, row: 1, kind: 'entity', tone: 'reporting', title: 'Structure  COBL', lines: ['Coding block', 'No data of its own', 'Included in BSEG, EKKN,', 'KBLP, MSEG', 'Customer include CI_COBL'] },
    { id: 'view', col: 1, row: 1, kind: 'entity', tone: 'reporting', title: 'View  V_T001', lines: ['Database, projection, help,', 'or maintenance view', 'Maintenance views drive SM30'] },
    { id: 'sh', col: 2, row: 1, kind: 'entity', tone: 'reporting', title: 'Search help  C_T001', lines: ['F4 value list', 'Elementary or collective'] },
    { id: 'lockobj', col: 3, row: 1, kind: 'entity', tone: 'reporting', title: 'Lock object  EFBKPF', lines: ['Generates ENQUEUE_ and', 'DEQUEUE_ function modules', 'Logical lock on a document'] }
  ],
  edges: [
    { from: 'dom', to: 'de', label: 'typed by' },
    { from: 'de', to: 'fld', label: 'used by' },
    { from: 'fld', to: 'tab', label: 'part of' },
    { from: 'struct', to: 'fld', sx: 60, tx: -70, my: -12, label: 'included', dashed: true },
    { from: 'sh', to: 'de', sx: -50, tx: 50, my: 10, dashed: true },
    { from: 'lockobj', to: 'tab', dashed: true }
  ]
};

const s4 = {
  id: 'sapx-s4',
  cols: 4,
  colWidth: 215,
  colGap: 50,
  rowGap: 56,
  rowLabels: ['User experience', 'Application server', 'SAP HANA database'],
  nodes: [
    { id: 'flp', col: 0, row: 0, tone: 'source', title: 'Fiori launchpad', lines: ['Tiles from catalogs and groups', 'Transactional, analytical, and fact sheet apps'] },
    { id: 'gui', col: 1, row: 0, tone: 'source', title: 'SAP GUI and Web GUI', lines: ['Classic transactions remain', 'Some are replaced or redirected'] },
    { id: 'api', col: 2, row: 0, tone: 'source', title: 'APIs and integration', lines: ['OData and SOAP services', 'IDoc and BAPI still supported'] },
    { id: 'bi', col: 3, row: 0, tone: 'source', title: 'Analytics clients', lines: ['Analysis for Office, analytics cloud tools, BW queries'] },
    { id: 'gw', col: 0, row: 1, tone: 'process', title: 'Gateway', lines: ['Front-end server', 'Publishes OData services', 'Embedded or hub deployment'] },
    { id: 'abap', col: 1, row: 1, span: 2, tone: 'process', title: 'ABAP platform', lines: ['Business logic, authorization checks, posting interfaces', 'CDS views define the virtual data model, for example I_JournalEntryItem', 'Code pushdown: aggregation runs in the database'] },
    { id: 'emb', col: 3, row: 1, tone: 'process', title: 'Embedded analytics', lines: ['Analytical queries on CDS views', 'No separate warehouse load for operational reports'] },
    { id: 'acd', col: 0, row: 2, kind: 'entity', tone: 'statements', title: 'ACDOCA', lines: ['One line item table for', 'G/L, CO, assets, material', 'ledger'] },
    { id: 'mat', col: 1, row: 2, kind: 'entity', tone: 'statements', title: 'MATDOC', lines: ['Material documents', 'Stock computed on read'] },
    { id: 'fmt', col: 2, row: 2, kind: 'entity', tone: 'statements', title: 'FMIOI, FMIFIIT, BCS', lines: ['Funds Management tables', 'carry over'] },
    { id: 'cv', col: 3, row: 2, kind: 'entity', tone: 'statements', title: 'Compatibility views', lines: ['BSIS, BSIK, GLT0, COSP,', 'MKPF, MSEG as views', 'Old reads still work'] }
  ],
  edges: [
    { from: 'flp', to: 'gw' }, { from: 'gw', to: 'abap' },
    { from: 'gui', to: 'abap', tx: -130 },
    { from: 'api', to: 'abap', tx: 130 },
    { from: 'bi', to: 'emb' },
    { from: 'abap', to: 'emb' },
    { from: 'abap', to: 'mat', sx: -130 },
    { from: 'abap', to: 'fmt', sx: 130 },
    { from: 'abap', to: 'acd', sx: -180, my: 8 }
  ]
};

export const sapArchitecturePage = {
  slug: 'sap-architecture',
  prefix: 'SA',
  group: 'SAP expert series',
  eyebrow: 'SAP expert series, part 1',
  navTitle: 'SAP Technical Architecture in Depth',
  shortTitle: 'SAP Architecture',
  blurb: 'Product generations, the runtime that turns a screen entry into a committed document, the ABAP Dictionary, enhancement points, landscapes, authorizations, logging, archiving, and what changes on HANA and S/4HANA.',
  appliesTo: ['gfebs', 'navy-erp', 'gcss-army', 'lmp', 'dla-ebs'],
  blocks: [
    h2('1. Product generations'),
    table('SAP ERP generations relevant to DoD programs', ['Generation', 'Technical base', 'Database', 'What it means for a DoD system'], [
      ['R/3 4.x', 'SAP Basis', 'Any supported database', 'Where LMP and the DLA modernization began in the early 2000s.'],
      ['ERP 6.0 (ECC 6.0) with enhancement packages', 'NetWeaver 7.0x to 7.5 Application Server ABAP', 'Oracle, DB2, SQL Server, MaxDB, later HANA', 'The release family the DoD SAP systems were built and fielded on. Enhancement packages switch on new functions through business functions (`SFW5`).'],
      ['Business Suite on HANA', 'NetWeaver 7.4 or 7.5', 'HANA', 'Same application and tables as ECC with the database replaced. Navy ERP moved to HANA in the cloud in 2019.'],
      ['S/4HANA', 'ABAP platform', 'HANA only', 'Simplified data model with the Universal Journal. The target of Army convergence planning.']
    ], 'SAP announced in 2020 that mainstream maintenance for Business Suite 7, which includes ERP 6.0, runs to the end of 2027 with optional extended maintenance to the end of 2030. An Army article in 2025 cites the pending end of service life of its current ERP systems as a driver for modernization.'),

    h2('2. From screen to committed document'),
    p('An SAP transaction spans several screens. Each screen is a dialog step and may run in a different work process, and each dialog step ends with its own database commit. SAP therefore cannot rely on one database transaction to keep a document consistent. It uses the SAP logical unit of work: changes are collected during the dialog and written together by an update work process after the user saves.'),
    figure('Life of a posting: dialog steps, update task, and the documents written', posting),
    table('Runtime behavior and its audit consequence', ['Mechanism', 'How it works', 'Audit or operations consequence'], [
      ['Number assignment', 'The document number is drawn from the number range table `NRIV` at save, before the update runs. Buffered number ranges hand out blocks of numbers to each application server.', 'Gaps in document numbers are normal. A gap is not evidence of a deleted document. Legal gap-free numbering needs unbuffered ranges.'],
      ['Update task', 'Function modules registered with IN UPDATE TASK run together in an update work process. If one fails, the whole V1 update rolls back.', 'A failed update leaves no partial document. Failed requests sit in `SM13` until reprocessed or deleted. Review `SM13` at period end.'],
      ['Enqueue locks', 'Logical locks sit in a lock table in memory, not in the database. They block a second user from the same document or master record.', 'Orphaned locks block postings and interfaces. `SM12` shows them.'],
      ['Integrated update', 'One business event posts to FI, FM, CO, and logistics in the same update.', 'The ledgers agree by construction when the update succeeds. Differences come from configuration, direct postings to one ledger, or repair programs.'],
      ['Background processing', 'Jobs run the same programs without a user. Job definition, start condition, and log are kept in `TBTCO` and `TBTCP`.', 'The job log is the evidence that a scheduled control ran, such as an interface load or the depreciation run.'],
      ['Batch input', 'A session replays screen input from a file.', 'Sessions in error stay in `SM35`. Unprocessed sessions are unrecorded transactions.']
    ]),

    h2('3. The ABAP Dictionary'),
    p('Every table, field, and value list is defined in the ABAP Dictionary. Knowing its layers is what lets an analyst read an unfamiliar table, including a custom one.'),
    figure('ABAP Dictionary objects, using company code as the example', ddic, 'A field gets its technical type from a domain and its meaning from a data element. The same data element is reused in every table that carries the field, which is why field names repeat across the system.'),
    table('ABAP Dictionary object types', ['Object', 'What it defines', 'How to use it in analysis'], [
      ['Domain', 'Data type, length, value range, conversion routine', 'The conversion routine explains why a value looks different on screen and in the database. Example: `ALPHA` pads document numbers with leading zeros. WBS elements are stored as an 8-digit internal number and shown as an external ID.'],
      ['Data element', 'Meaning, labels, documentation, search help', 'Search the data element in `SE11` and use the where-used list to find every table that holds that field.'],
      ['Transparent table', 'A table that exists one-to-one in the database', 'Can be queried and joined directly.'],
      ['Cluster and pooled table', 'Several logical tables stored together in one physical table', 'In ECC, `BSEG` sits in cluster `RFBLG` and cannot be joined in database SQL. Read it through the application or use the index tables.'],
      ['Structure', 'A field list with no stored data', 'Structures such as `COBL` show which account assignment fields travel together.'],
      ['Append structure', 'Customer fields added to a standard table without modifying it', 'Custom fields on standard tables usually start with `ZZ` or `YY`.'],
      ['Customer include', 'A named slot SAP reserves for customer fields, such as `CI_COBL`', 'Fields added to `CI_COBL` appear on every line item table that includes the coding block.'],
      ['View', 'A join or projection, or a maintenance dialog over tables', 'Maintenance views are how configuration is entered through `SM30`.'],
      ['Lock object', 'The definition of a logical lock', 'Explains which key is locked when a document is in use.']
    ]),
    table('Table delivery classes and what they imply', ['Class', 'Content', 'Transported between systems', 'Change evidence'], [
      ['A', 'Application data: master data and documents', 'No', 'Change documents and the document itself'],
      ['C', 'Customizing', 'Yes, by transport request', 'Transport log, and table logging when switched on'],
      ['G', 'Customizing protected against SAP upgrades', 'Yes', 'Transport log'],
      ['E', 'Control tables with customer namespaces', 'Yes', 'Transport log'],
      ['S', 'System tables', 'With SAP deliveries', 'SAP notes and upgrades'],
      ['L', 'Temporary data', 'No', 'None']
    ], 'Table logging needs two switches: the logging flag in the technical settings of the table and the profile parameter `rec/client`. Logged changes are written to `DBTABLOG` and read with `SCU3`.'),

    h2('4. Where programs change standard behavior'),
    p('A DoD SAP system is standard software plus configuration plus custom development. Custom objects are often called RICEFW: reports, interfaces, conversions, enhancements, forms, and workflows. The table below lists the places where behavior can differ from the standard, in the order an analyst should check them.'),
    table('Configuration and enhancement points', ['Point', 'What it does', 'Where to look', 'Typical DoD use'], [
      ['Customizing', 'Settings in configuration tables', '`SPRO`, table views in `SM30`', 'Document types, number ranges, account determination, release strategies, FM update profile'],
      ['Account determination', 'Decides the G/L account for automatic postings', '`OBYC` for materials, `VKOA` for sales, `AO90` for assets, table `T030`', 'Mapping stock movements and receipts to DoD chart of accounts posting accounts'],
      ['Validation and substitution', 'Rules that reject or overwrite field values at posting', '`GGB0`, `GGB1`, `OB28`, `OBBH`', 'Forcing a business area or blocking invalid fund and account combinations'],
      ['FM derivation', 'Derives funds center, commitment item, and functional area from other fields', '`FMDERIVE`, trace with `FMDERIVATIONANALYSIS`', 'Deriving the commitment item from the G/L account or material group, as the GFEBS procedures describe'],
      ['Document splitting', 'Splits lines so every document balances by fund or segment', 'Splitting configuration, tables `FAGL_SPLINFO` and `FAGL_SPLINFO_VAL`', 'Balanced books by fund in the new G/L'],
      ['Customer exits and BAdIs', 'SAP-provided hooks for custom code', '`SMOD`, `CMOD`, `SE18`, `SE19`', 'Interface checks, extra authorizations, custom derivations'],
      ['Coding block extension', 'Adds customer account assignment fields', 'Customer include `CI_COBL`, transaction `OXK3`', 'Carrying standard line of accounting elements that have no SAP field'],
      ['Custom programs and tables', 'Objects in the Z and Y namespace', 'Package assignment in `TADIR`, source in `SE38`', 'Trial balance extracts, status of funds reports, interface loaders'],
      ['Modifications', 'Changes to SAP source code', 'Modification browser `SE95`', 'Should be rare. Each one needs re-testing at every upgrade.']
    ]),

    h2('5. Landscapes, clients, and change control'),
    list(
      'A production system is reached only through a transport route from development and quality assurance. Direct changes in production are blocked by the client setting in `SCC4` and the system change option.',
      'Workbench requests carry programs and dictionary objects. Customizing requests carry table entries from one client.',
      'Each transport request records its owner, objects, and import history in `E070`, `E071`, and the transport logs.',
      'Solution Manager adds change request management, test management, and system monitoring on top of the transport system.',
      'Sandbox, training, and pre-production copies are created by client copy or system copy. Copies of production data carry the same sensitivity as production.',
      'An emergency or firefighter account gives temporary elevated access with a log of every action. Auditors ask for the list of firefighter sessions and their reviews.'
    ),

    h2('6. Authorization concept'),
    p('SAP checks authorization in program code. A check names an authorization object and field values. The user passes if any role assigned to the user contains a matching authorization.'),
    table('Building blocks of SAP authorizations', ['Element', 'Meaning', 'Example'], [
      ['Authorization object', 'A group of up to ten fields checked together', '`F_BKPF_BUK`: accounting document by company code'],
      ['Activity field `ACTVT`', 'What the user may do', '01 create, 02 change, 03 display, 06 delete, 77 pre-enter (park)'],
      ['Organizational level', 'A field maintained once per role and applied to every object in it', 'Company code, FM area, plant, purchasing organization'],
      ['Single role', 'Menu plus authorizations, generated into a profile', 'Built in `PFCG`'],
      ['Derived role', 'Copy of a master role with different organizational levels', 'One purchasing role per command'],
      ['Composite role', 'A bundle of single roles', 'A job position'],
      ['`S_TCODE`', 'The object checked when any transaction starts', 'Lists the transaction codes a user may start']
    ]),
    table('Authorization objects that matter most for financial controls', ['Object', 'Controls', 'Why it is sensitive'], [
      ['`F_BKPF_BUK`, `F_BKPF_KOA`, `F_BKPF_BLA`', 'Posting by company code, account type, and document type', 'Who can post manual journals'],
      ['`F_BKPF_BUP`', 'Posting period authorization group', 'Who can post to closed or special periods'],
      ['`F_KNA1_BUK`, `F_LFA1_BUK`, `F_LFA1_APP`', 'Customer and vendor master data', 'Who can create or change a payee'],
      ['`F_REGU_BUK`, `F_REGU_KOA`', 'Payment program actions', 'Who can propose, run, and release payments'],
      ['`F_FICB_FKR`, `F_FICA_FCD`, `F_FICA_FSG`, `F_FICA_FPG`', 'FM area, funds center, fund group, commitment item group', 'Who can post and view budget by organization and fund'],
      ['`F_FMBU_ACC`, `F_FMBU_DOC`', 'BCS budget entry by budget address and document type', 'Who can load, transfer, or return budget'],
      ['`M_BEST_BSA`, `M_BEST_EKO`, `M_BEST_EKG`, `M_BEST_WRK`', 'Purchase orders by document type, purchasing organization, group, plant', 'Who can obligate'],
      ['`M_BANF_FRG`, `M_EINK_FRG`', 'Release codes for requisitions and purchase orders', 'Who can approve and certify'],
      ['`M_MSEG_BWA`, `M_MSEG_WWA`', 'Goods movements by movement type and plant', 'Who can receive'],
      ['`M_RECH_WRK`, `M_RECH_AKZ`', 'Invoice verification and tolerance acceptance', 'Who can enter invoices and override match differences'],
      ['`K_CSKS`, `K_ORDER`, `K_KA03`', 'Cost centers, orders, cost element planning', 'Cost object maintenance'],
      ['`A_S_ANLKL`, `A_B_ANLKL`', 'Asset master and asset postings by class', 'Who can capitalize and retire'],
      ['`S_TABU_DIS`, `S_TABU_NAM`', 'Table maintenance and display', 'Direct table access bypasses application controls'],
      ['`S_DEVELOP`, `S_PROGRAM`, `S_TRANSPRT`', 'Development, program execution, transports', 'Code changes and debug-change access in production'],
      ['`S_USER_GRP`, `S_USER_AGR`', 'User and role administration', 'Who can grant access'],
      ['`S_RFC`, `S_ICF`', 'Remote function calls and web services', 'What interface accounts can execute'],
      ['`S_BTCH_JOB`, `S_BTCH_NAM`', 'Background jobs and the user a job runs under', 'Running programs under another identity']
    ], 'Object names are standard SAP. Each program decides which checks and organizational levels it uses.'),
    table('Segregation of duties conflicts usually tested first', ['Function A', 'Function B', 'Risk'], [
      ['Maintain vendor master (`XK01`, `XK02`, `FK02`)', 'Enter vendor invoice or run payments (`FB60`, `MIRO`, `F110`)', 'Create a payee and pay it'],
      ['Create purchase order (`ME21N`)', 'Post goods receipt (`MIGO`)', 'Order and confirm receipt of goods that never arrived'],
      ['Post goods receipt (`MIGO`)', 'Enter invoice (`MIRO`)', 'Complete a three-way match alone'],
      ['Enter journal (`FB50`, `FV50`)', 'Post parked journal (`FBV0`) for the same document', 'Prepare and approve an adjustment'],
      ['Load or transfer budget (`FMBB`)', 'Create obligations (`ME21N`, `FMZ1`)', 'Fund and spend without independent control'],
      ['Maintain customer master (`XD01`)', 'Post incoming payments or credit memos (`F-28`, `FB75`)', 'Misapply or write off receivables'],
      ['Maintain asset master (`AS01`)', 'Post asset transactions (`ABAVN`, `ABUMN`)', 'Conceal loss or transfer of property'],
      ['Develop programs (`SE38`)', 'Import transports to production (`STMS`)', 'Unreviewed code in production'],
      ['Administer users (`SU01`)', 'Administer roles (`PFCG`)', 'Self-granted access'],
      ['Open posting periods (`OB52`)', 'Post documents', 'Backdated postings']
    ]),

    h2('7. Evidence the system keeps'),
    table('Logs and where they are stored', ['Evidence', 'Tables', 'Read with', 'Retention concern'], [
      ['Who posted a document and how', '`BKPF` fields `USNAM`, `TCODE`, `CPUDT`, `CPUTM`', '`FB03`, `SE16N`', 'Kept with the document until archived'],
      ['Changes to documents and master data', '`CDHDR`, `CDPOS`', '`FB04`, `XK04`, report `RSSCD100`', 'Kept until archived or deleted by a housekeeping job'],
      ['Status changes on orders, projects, earmarked funds', '`JEST`, `JCDS`', 'Status display in the object', 'Only if change documents are active for the status profile'],
      ['Approval steps', 'Workflow tables such as `SWWWIHEAD`, release fields on `EBAN` and `EKKO`', 'Workflow log, `ME53N`, `ME23N`', 'Workflow logs are often purged first'],
      ['Configuration table changes', '`DBTABLOG`', '`SCU3`', 'Only for tables with logging switched on'],
      ['Transports', '`E070`, `E071`, transport logs', '`STMS`, `SE09`', 'Permanent unless cleaned up'],
      ['Security events', 'Security audit log files', '`SM20`', 'File-based. Retention is an operations setting.'],
      ['User and role changes', 'Change documents for users and roles', '`SUIM`', 'Kept until archived'],
      ['Interface messages', '`EDIDC`, `EDID4`, `EDIDS`', '`WE02`, `BD87`', 'IDocs are archived or deleted on a schedule. Agree the schedule with audit retention needs.'],
      ['Job runs', '`TBTCO`, `TBTCP`, job logs, spool', '`SM37`, `SP01`', 'Job logs and spool are deleted after days or weeks by default'],
      ['Attachments', '`SRGBTBREL`, `SOOD`, content repository', 'Services for object in the document', 'Depends on the content server']
    ]),
    h3('Archiving'),
    list(
      'Data archiving moves closed documents out of the database into archive files through archiving objects. Examples: `FI_DOCUMNT` for accounting documents, `MM_EKKO` for purchasing documents, `MM_MATBEL` for material documents, `IDOC` for IDocs, `CHANGEDOCU` for change documents.',
      'Archiving runs in `SARA`. Archived data stays readable through the archive information system when an archive infostructure exists.',
      'An extract or replication taken after archiving will not contain the archived documents. A universe of transactions for an open audit period must be taken before archiving, or must read the archive.',
      'Residence times are configuration. They should be set against record retention rules, which for federal financial records run for years after the period.'
    ),

    h2('8. HANA and S/4HANA architecture'),
    figure('S/4HANA layers and the simplified data model', s4),
    table('What HANA and S/4HANA change technically', ['Topic', 'ECC on a row database', 'HANA and S/4HANA'], [
      ['Storage', 'Row store on disk with secondary indexes', 'Column store in memory with compression. Aggregates are computed on request.'],
      ['Totals and index tables', 'Stored and updated with every posting', 'Removed. Same-named compatibility views read the line items.'],
      ['Cluster tables', '`BSEG` in cluster `RFBLG`', 'Transparent tables'],
      ['Reporting model', 'ABAP reports, Report Writer, BW extracts', 'CDS views expose a virtual data model. Analytical apps read line items directly.'],
      ['Extraction', 'Delta extractors and trigger-based replication', 'CDS-based extraction and replication. Table-level replication still works.'],
      ['User interface', 'SAP GUI', 'Fiori launchpad plus SAP GUI. Access is granted through business catalogs as well as roles.'],
      ['Custom code', 'Reads of standard tables in any form', 'Must be checked. Code that relied on implicit sort order or wrote to removed tables needs remediation.'],
      ['Business partner', 'Separate vendor and customer masters', 'Business partner is the leading object, synchronized to `LFA1` and `KNA1`.'],
      ['Field lengths', 'Material number 18, amounts 13 digits plus 2 decimals', 'Material number up to 40, amounts up to 23 digits']
    ], 'USNI News reported in August 2019 that Navy ERP moved about 72,000 users at six commands to SAP HANA in the cloud, and that a report that had taken five to six hours then ran in about 30 minutes.')
  ],
  sources: [
    { name: 'SAP NetWeaver documentation: work processes and the application server', url: 'https://help.sap.com/saphelp_nw73/helpdata/en/fc/eb2e7d358411d1829f0000e829fbfe/content.htm' },
    { name: 'SAP News: maintenance commitment for Business Suite 7 and S/4HANA (February 2020)', url: 'https://news.sap.com/2020/02/sap-s4hana-maintenance-2040-clarity-choice-sap-business-suite-7/' },
    { name: 'SAP Press: S/4HANA Finance and the universal journal', url: 'https://blog.sap-press.com/sap-s/4hana-finance-innovations-part-3-the-universal-journal' },
    { name: 'SAP Community: ECC tables after migration to S/4HANA Finance', url: 'https://blogs.sap.com/2019/10/30/ecc-tables-after-migration-to-s4-hanasimple-finance/' },
    { name: 'USNI News: six Navy commands on cloud-based Navy ERP (August 2019)', url: 'https://news.usni.org/2019/08/26/six-major-navy-commands-now-using-cloud-based-system-for-financial-and-supply-management' },
    { name: 'Army.mil: EBS-C goes live for ammunition (July 2025)', url: 'https://www.army.mil/article/287007/enterprise_business_systems_convergence_goes_live_ahead_of_schedule_modernizing_army_ammunition' }
  ]
};
