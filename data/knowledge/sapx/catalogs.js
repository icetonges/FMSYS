import { h2, p, list, steps, callout, table, catalog } from '../blocks';
import { sapTables, sapTableColumns } from './tables';
import { sapTcodes, sapTcodeColumns } from './tcodes';
import { sapFields, sapFieldColumns } from './fields';

const areaKey = table('Area codes used in the catalogs', ['Code', 'Component'], [
  ['BC', 'Basis: system administration, security, dictionary, jobs, transports'],
  ['CA', 'Cross-application: IDocs, change documents, status, business partner, workflow'],
  ['FI, FI-GL, FI-AP, FI-AR, FI-BL, FI-AA, FI-SL', 'Financial Accounting: general ledger, payables, receivables, bank, assets, special ledger'],
  ['PSM-FM, PSM-FG, FM', 'Public Sector Management: Funds Management and the US Federal extension'],
  ['CO', 'Controlling'],
  ['PS', 'Project System'],
  ['MM, MM-PUR, MM-IM, MM-IV, MM-SRV', 'Materials Management: purchasing, inventory, invoice verification, services'],
  ['SD, LE', 'Sales and Distribution, Logistics Execution'],
  ['PM, PP, QM', 'Plant Maintenance, Production Planning, Quality Management'],
  ['RE, RE-FX', 'Flexible Real Estate Management'],
  ['HCM', 'Human Capital Management, including the time sheet'],
  ['BW', 'Business Warehouse extraction and replication'],
  ['DFPS', 'Defense Forces and Public Security industry solution']
]);

export const sapTablesPage = {
  slug: 'sap-tables',
  prefix: 'ST',
  group: 'SAP expert series',
  eyebrow: 'SAP expert series, part 4',
  navTitle: 'SAP Table Catalog',
  shortTitle: 'SAP Table Catalog',
  blurb: `A searchable catalog of ${sapTables.length} standard SAP tables across Basis, finance, Funds Management, US Federal, controlling, projects, purchasing, inventory, sales, maintenance, real estate, and interfaces, with what each holds and its key fields.`,
  appliesTo: ['gfebs', 'navy-erp', 'gcss-army', 'lmp', 'dla-ebs'],
  blocks: [
    h2('1. Scope and how to use this catalog'),
    p(`SAP ERP contains tens of thousands of tables. Most are configuration or technical tables that an analyst never reads. This catalog lists ${sapTables.length} tables that carry the master data, documents, totals, logs, and interface records behind financial reporting and logistics-to-finance tracing in a DoD SAP system. Type a table name, a field, or a word such as invoice into the search box, or filter by area.`),
    list(
      'Every entry is a standard SAP product table. Program-specific tables in the Z and Y namespace are not public and are not listed.',
      'Key fields are abbreviated for long keys. Client (`MANDT`) is the first key field of every client-dependent table and is left out.',
      'To confirm a table in your own system, open it in `SE11` and read the field list, the key, the technical settings, and the where-used list.',
      'To find the tables behind a screen field, press F1 on the field and choose technical information.'
    ),
    table('Table name patterns', ['Pattern', 'Meaning', 'Examples'], [
      ['T followed by digits or letters', 'Customizing and check tables', '`T001` company codes, `T003` document types, `T156` movement types'],
      ['Ends in K and P, or K and O', 'Header (Kopf) and item (Position)', '`EKKO` and `EKPO`, `VBAK` and `VBAP`, `RBKP` and `RSEG`, `MKPF` and `MSEG`'],
      ['BSI* and BSA*', 'Open-item (I) and cleared-item (A) indexes by account type: S general ledger, K vendor, D customer', '`BSIS`, `BSAS`, `BSIK`, `BSAK`, `BSID`, `BSAD`'],
      ['Ends in T', 'Text table for a master or configuration table, or a totals table in ledgers', '`SKAT`, `CSKT`, `FAGLFLEXT`, `FMIT`'],
      ['Ends in A in ledger tables', 'Actual line items', '`FAGLFLEXA`, `FMUSFGA`, `GLPCA`'],
      ['LF* and KN*', 'Vendor (Lieferant) and customer (Kunde) master', '`LFA1`, `LFB1`, `KNA1`, `KNB1`'],
      ['MA*', 'Material master segments', '`MARA`, `MARC`, `MARD`, `MAKT`'],
      ['AN*', 'Asset accounting (Anlagen)', '`ANLA`, `ANLC`, `ANEP`'],
      ['CO*', 'Controlling documents and totals', '`COBK`, `COEP`, `COSP`, `COSS`'],
      ['FM*', 'Funds Management', '`FMIOI`, `FMIFIIT`, `FMBH`'],
      ['FMFG* and FMUSFG*', 'US Federal extension', '`FMFGBLAREA`, `FMUSFGT`'],
      ['ED*', 'Electronic data interchange and IDocs', '`EDIDC`, `EDID4`, `EDIDS`'],
      ['Starts with Z or Y', 'Customer-developed table', 'Program specific'],
      ['Starts with a slash and a namespace', 'Add-on or industry solution', '`/ISDFPS/` for Defense Forces']
    ], 'Many SAP names abbreviate German words. Beleg is document, Buchung is posting, Konto is account, Kopf is header, Position is item, Bestellung is purchase order, Bedarf is requirement.'),
    areaKey,

    h2('2. The catalog'),
    catalog('SAP tables by area', sapTableColumns, sapTables, 'In S/4HANA some entries are compatibility views over ACDOCA or MATDOC and are no longer physical tables. See the architecture page.'),

    h2('3. The twenty tables to learn first'),
    table('Core tables for tracing a balance to its source', ['Order', 'Table', 'Why it comes first'], [
      ['1', '`BKPF`', 'Every posting has a header here, with who, when, how, and the pointer to the source object.'],
      ['2', '`BSEG`', 'Every debit and credit with its full account assignment.'],
      ['3', '`FAGLFLEXA` or `ACDOCA`', 'The ledger view the trial balance is built from.'],
      ['4', '`SKA1` and `SKB1`', 'What each account is.'],
      ['5', '`FMIFIIT`', 'Budget consumption by actuals, with the link to the FI document.'],
      ['6', '`FMIOI`', 'Open commitments and obligations.'],
      ['7', '`FMBL`', 'Every budget movement.'],
      ['8', '`FMFINCODE`, `FMFCTR`, `FMCI`', 'The meaning of fund, funds center, and commitment item values.'],
      ['9', '`EKKO`, `EKPO`, `EKKN`', 'The obligation and its funding line.'],
      ['10', '`EKBE`', 'Every receipt and invoice against an order item.'],
      ['11', '`EBAN`', 'The requirement and commitment before the order.'],
      ['12', '`MKPF` and `MSEG`', 'Receipt and issue evidence.'],
      ['13', '`RBKP` and `RSEG`', 'The vendor invoice as matched.'],
      ['14', '`BSIK` and `BSAK`', 'What is owed and what was paid.'],
      ['15', '`REGUH` and `REGUP`', 'Which payment paid which invoice.'],
      ['16', '`KBLK` and `KBLP`', 'Obligations without a purchase order.'],
      ['17', '`VBAK`, `VBRK`, `VBFA`', 'Reimbursable orders and bills.'],
      ['18', '`ANLA` and `ANEP`', 'Property records and their transactions.'],
      ['19', '`CDHDR` and `CDPOS`', 'Who changed what.'],
      ['20', '`EDIDC` and `EDIDS`', 'What arrived by interface and whether it posted.']
    ])
  ],
  sources: [
    { name: 'SAP PSM-FG component tables (public listing)', url: 'https://www.testingbrain.com/sap/psm-module/sap-psm-fg-functions-for-u-s-federal-government-in-psm-tables.html' },
    { name: 'Table reference: FMIFIIT', url: 'https://leanx.eu/en/sap/table/fmifiit.html' },
    { name: 'Table reference: FMIOI', url: 'https://leanx.eu/en/sap/table/fmioi.html' },
    { name: 'Table reference: FMIT', url: 'https://leanx.eu/en/sap/table/fmit.html' },
    { name: 'SAP Community: ECC tables after migration to S/4HANA Finance', url: 'https://blogs.sap.com/2019/10/30/ecc-tables-after-migration-to-s4-hanasimple-finance/' }
  ]
};

export const sapTcodesPage = {
  slug: 'sap-tcodes',
  prefix: 'SC',
  group: 'SAP expert series',
  eyebrow: 'SAP expert series, part 5',
  navTitle: 'SAP Transaction Code Catalog',
  shortTitle: 'SAP Transaction Codes',
  blurb: `A searchable catalog of ${sapTcodes.length} SAP transaction codes by area and kind, flagged where the code appears in public GFEBS or GCSS-Army material, plus the documented Army custom transactions.`,
  appliesTo: ['gfebs', 'navy-erp', 'gcss-army', 'lmp', 'dla-ebs'],
  blocks: [
    h2('1. Scope and how to use this catalog'),
    p(`A transaction code starts a program or a screen sequence. SAP delivers many tens of thousands. This catalog lists ${sapTcodes.length} that matter for financial management, logistics-to-finance tracing, interfaces, and IT controls. The last column shows whether the code is listed in a public GFEBS role-to-transaction mapping or desktop procedure, or in a public GCSS-Army maintenance transaction reference. A blank means the code is standard SAP and was not found in that public material. It does not mean a program does not use it.`),
    table('Transaction code naming patterns', ['Pattern', 'Meaning', 'Examples'], [
      ['Ends in 01, 02, 03', 'Create, change, display', '`XK01`, `XK02`, `XK03`. `FMZ1`, `FMZ2`, `FMZ3` use the same idea with one digit.'],
      ['Ends in N', 'Newer single-screen version of an older transaction', '`ME21N`, `FBL3N`, `KB21N`'],
      ['F- followed by digits', 'FI posting with a preset document type and posting key', '`F-28` incoming payment, `F-47` down payment request'],
      ['F. followed by digits', 'FI periodic program or report', '`F.13` automatic clearing, `F.80` mass reversal'],
      ['FB*', 'FI document entry and display', '`FB50`, `FB60`, `FB03`'],
      ['FM*', 'Funds Management', '`FMBB`, `FMX1`, `FMAVCR01`'],
      ['FMFG*', 'US Federal extension', '`FMFG_IPAC`, `FMFG_YEAR_END_CLOSE`'],
      ['ME*', 'Purchasing', '`ME51N`, `ME21N`, `ME2K`'],
      ['MI*, MB*', 'Inventory', '`MIGO`, `MB51`, `MI04`'],
      ['MIR*, MR*', 'Invoice verification', '`MIRO`, `MRBR`, `MR11`'],
      ['K*', 'Controlling', '`KS01`, `KO01`, `KSB1`'],
      ['CJ*, CN*', 'Project System', '`CJ20N`, `CJI3`, `CN41`'],
      ['VA*, VL*, VF*', 'Sales order, delivery, billing', '`VA01`, `VL02N`, `VF01`'],
      ['IW*, IE*, IP*', 'Maintenance orders and notifications, equipment, maintenance plans', '`IW31`, `IE03`, `IP10`'],
      ['A*', 'Asset accounting', '`AS01`, `AW01N`, `AFAB`'],
      ['RE*', 'Real estate', '`RE80`, `RECN`'],
      ['S_ALR_*, S_P99_*, S_KI4_*', 'Report transactions generated for the information system menu', '`S_ALR_87012277`'],
      ['S*, SM*, SE*, SU*', 'Basis administration, development, security', '`SM37`, `SE16N`, `SU01`'],
      ['WE*, BD*', 'IDoc and ALE', '`WE02`, `BD87`'],
      ['Starts with Z or Y', 'Customer-developed', '`ZFSC5`, `ZSFI_DDRS_TRL_BAL`'],
      ['Starts with a slash', 'Add-on namespace', '`/ISDFPS/LSP2`']
    ]),
    list(
      'Type `/n` before a code to leave the current transaction and start a new one. Type `/o` to open it in a new session.',
      'Table `TSTC` lists every transaction code and the program it starts. `TSTCT` holds the descriptions.',
      'A user can start a transaction only if a role grants it under authorization object `S_TCODE`. The role-to-transaction mapping is in `AGR_TCODES`.',
      'The transaction that created a financial document is stored in `BKPF-TCODE`. That field shows whether a posting came from a user transaction, a payment run, an interface, or a background program.'
    ),

    h2('2. The catalog'),
    catalog('SAP transaction codes by area', sapTcodeColumns, sapTcodes, 'Descriptions are functional summaries. For a few Funds Management and US Federal codes the description states only where the public GFEBS role map lists the code, because the source gives no description.'),

    h2('3. Army custom transactions documented in public material'),
    p('Custom transaction names show how a program extends the standard. The Army names below follow a visible convention: a Z, usually an S, then an abbreviation of the business process area (FI, FM, SC, RM, PPE, CM, BF), then the function.'),
    table('GFEBS custom transaction families', ['Family', 'Business process area', 'Examples', 'What the names indicate'], [
      ['`ZFSC1` to `ZFSC9`, `ZFSNC1` to `ZFSNC6`', 'Funds Management reporting', '`ZFSC5` Cumulative Status by Fund Center, Detailed', 'Status of funds reports, cumulative and non-cumulative'],
      ['`ZRFSC1`, `ZRFSC2`, `ZRFSNC1`, `ZRFSNC2`, `Z_RM_FUND_STATUS`', 'Reimbursables reporting', '`ZRFSC1` Reimbursable Cumulative Status by Fund Center', 'Reimbursable status of funds'],
      ['`Z_FUND_STATUS`, `Z_FUND_STATUS_NC`, `Z_OPEN_COM`, `Z_OPEN_OB`', 'Funds control', 'Open commitments, open obligations', 'Unliquidated balance review'],
      ['`ZSFM_*`', 'Funds Management', '`ZSFM_DISTBUDGET`, `ZSFM_THRESHOLD`, `ZSFM_ASN`, `ZSFM_POA`, `ZSFM_SFISLOAREPORT`, `ZSFM_FCTR_SECURITY`, `ZSFM_RPT_E_UNFILLED`', 'Budget distribution, thresholds, allotment serial number and POA maintenance, SFIS line of accounting report, funds center security, unfilled orders'],
      ['`ZSFI_*`', 'Financials', '`ZSFI_DDRS_TRL_BAL`, `ZSFI_DDRS_TRL_BAL2`, `ZSFI_SFIS_TRLBAL_EXT`, `ZSFI_SFISREPORT`, `ZSFI_LOA`, `ZSFI_LOAXREFLOAD`, `ZSFI_TROR`, `ZSFI_JV_UPLOAD`, `ZSFI_JV_EDIT_ORG`, `ZSFI_ABNORMAL_BALRPT`, `ZSFI_DCAS_EXT_01`, `ZSFI_DCAS_ID`, `ZSFI_1081`, `ZSFI_REP_1081`, `ZSFI_Auto_Sweep`', 'DDRS and SFIS trial balance extracts, line of accounting cross-reference, receivables report, journal voucher upload, abnormal balance report, cash accountability extracts, SF 1081 processing'],
      ['`ZSSC_*`', 'Spending Chain', '`ZSSC_DD448`, `ZSSC_DCAS1081_EXTRCT`, `ZSSC_CAPSRPT`, `ZSSC_1099_REPORT`, `ZSSC_1099_WH_LOAD`, `ZSSC_FCM_FP`, `ZSSC_FCM_OUT`, `ZSSC_WF_USERS`', 'Military Interdepartmental Purchase Request form, cash accountability extract, entitlement system report, Form 1099 reporting, fund control module interfaces, workflow users'],
      ['`ZSRM_*`', 'Reimbursables', '`ZSRM_DCAS1080_EXTRCT`, `ZSRM_DTS_ERRORS`, `ZSRM_TAS_DSP`, `ZSRM_TAS_MNT`, `ZSRM_ASR`', 'SF 1080 collection extract, travel system interface errors, Treasury account symbol display and maintenance'],
      ['`ZSPPE_*`', 'Property, Plant and Equipment', '`ZSPPE_DD1354`, `ZSPPE_DA337`, `ZSPPE_RE_INST`, `ZSPPE_INST_CREATE`, `ZSPPE_RPUID_STATUS`, `ZSPPE_UICDATA`', 'Real property transfer and acceptance form, disposal form, installation creation, real property unique identifier status, unit identification code data'],
      ['`ZSCM_*`', 'Cost Management', '`ZSCM_DCPS_ERROR`, `ZSCM_TABLE_UIC`, `ZSCM_TABLE_TDA`, `ZSCM_TABLE_PRGAREA`, `ZSCM_TABLE_OUID`, `ZSCM_TABLE_DMISID`', 'Civilian payroll interface errors, cost center attribute tables for unit, table of distribution and allowances, program area, organization and medical facility identifiers'],
      ['`ZSBF_*`', 'Budget formulation', '`ZSBF_AFP_RETRACTION`', 'Retraction of the approved funding program into execution'],
      ['`ZPMT_*`, `ZOS_*`', 'Payments and operations support', '`ZPMT_WAREHOUSE`, `ZOS_METRICS`, `ZOS_IFV`, `ZOS_IST`', 'Payment data warehouse, operations metrics']
    ], 'Transaction names come from a public copy of a GFEBS role-to-transaction mapping and from the Army Financial Management School desktop procedures. Three descriptions are quoted from the desktop procedures: ZFSC5, ZRFSC1, and ZSSC_DD448. The other meanings are read from the names and should be confirmed in the system.'),
    table('GCSS-Army custom transactions in the public maintenance reference', ['Transaction', 'Description as listed'], [
      ['`ZAMW`', 'Assignments Maintenance Workbench'],
      ['`Z_EQUST`', 'Equipment Status Report'],
      ['`ZOAREP`', 'Overage Reparables Report'],
      ['`ZPROSTAT`', 'Order Status Report'],
      ['`ZEDF`', 'Extended Document Flow'],
      ['`ZMB59`', 'Material Document List'],
      ['`ZUSAGE`', 'Usage Report'],
      ['`ZAIT`', 'Automatic identification technology user maintenance'],
      ['`ZNONSTD`', 'Add Non-Standard Materials'],
      ['`ZINIT`', 'Initial Issue purchase requisition creation'],
      ['`ZCON1`, `ZCONB`', 'Supervisor forecasting requirements, and the batch job for it'],
      ['`ZATF`, `ZSAF`, `ZMMRP`, `ZMM02F`', 'Authorized to forecast, MRP command adds, MRP area material master data'],
      ['`ZFE`, `ZSPTX`', 'Force element details, organization and force element table'],
      ['`ZOPID`, `ZOPLR`, `ZPEPP`, `ZFNQ`', 'Operator permit ID, permit ledger, operator qualification record, find qualified operators'],
      ['`ZMAWK`', 'Manhour Accounting Worksheet'],
      ['`ZSEC1`', 'Security Reports'],
      ['`YOBUX`', 'Monitor Recoverables']
    ], 'Source: GCSS-Army Maintenance T-Code Favorites Reference.'),

    h2('4. Transactions for a first walk through any SAP financial system'),
    steps(
      '`FB03` to display a financial document. Use the document header button to see the source object and the environment menu to jump to the original document.',
      '`FAGLL03` or `FBL3N` to list line items for an account.',
      '`FAGLB03` or `FS10N` for account balances by period.',
      '`FMRP_RFFMEP1AX` for all Funds Management postings on a fund and funds center.',
      '`FMAVCR01` for budget, consumed, and available by control object.',
      '`ME23N` to display a purchase order. The item detail has the account assignment tab and the purchase order history tab.',
      '`ME2K` to list purchasing documents by fund, cost center, or WBS element.',
      '`MB51` to list material documents.',
      '`MIR4` to display a logistics invoice.',
      '`FBL1N` for vendor line items and payment status.',
      '`FMZ3` to display a funds commitment and its consumption.',
      '`WE02` to see interface messages and their status.',
      '`SE16N` to read any table directly, where authorized.'
    )
  ],
  sources: [
    { name: 'GFEBS role to transaction code mapping (public copy)', url: 'https://pdfcoffee.com/role-to-t-code-mapping-pdf-free.html' },
    { name: 'U.S. Army Financial Management School: GFEBS Desktop SOP (public copy)', url: 'https://silo.tips/download/us-army-financial-management-school-gfebs-desktop-sop' },
    { name: 'GCSS-Army Maintenance T-Code Favorites Reference', url: 'https://ordoteststorageaccount.blob.core.windows.net/cohort-website/GCSS-Army%20Maintenance%20T-Code%20Favorites%20Reference.pdf' },
    { name: 'GFEBS transaction code cheat sheet (secondary source)', url: 'https://studyaround.blog/gfebs-transaction-codes-cheat-sheet' }
  ]
};

export const sapFieldsPage = {
  slug: 'sap-fields',
  prefix: 'SD',
  group: 'SAP expert series',
  eyebrow: 'SAP expert series, part 6',
  navTitle: 'SAP Field and Data Element Catalog',
  shortTitle: 'SAP Fields and Data Elements',
  blurb: `A searchable catalog of ${sapFields.length} SAP fields with type, length, meaning, the tables that carry them, and how each one supports SFIS, SLOA, GTAS, or audit testing.`,
  appliesTo: ['gfebs', 'navy-erp', 'gcss-army', 'lmp', 'dla-ebs'],
  blocks: [
    h2('1. Scope and how to use this catalog'),
    p(`In SAP a field on a table is typed by a data element, and the data element is typed by a domain. The same field name usually means the same thing in every table. Learning about two hundred field names lets an analyst read most financial and logistics tables without documentation. This catalog lists ${sapFields.length} of them.`),
    list(
      'Type and length are the ECC 6.0 values. `CHAR` is character, `NUMC` is numeric text with leading zeros, `DATS` is a date stored as YYYYMMDD, `CURR` is an amount tied to a currency field, `QUAN` is a quantity tied to a unit field, `CUKY` is a currency key, `UNIT` is a unit of measure.',
      'Amounts are stored without sign in most document tables. The debit or credit indicator (`SHKZG`, `DRCRK`, `BEKNZ`) gives the sign. Ledger tables such as `FAGLFLEXA`, `ACDOCA`, and FM tables store signed amounts.',
      'Document numbers are stored with leading zeros. A purchase order shown as 4500001234 is stored that way, and a ten-digit accounting document shown as 100000012 is stored as 0100000012.',
      'The same business object can have several field names. Fund is `GEBER` on line items, `FINCODE` in the master, `FONDS` in FM line items, and `RFUND` in ledgers. The catalog lists each.',
      'The last column states the reporting or audit use, including the SFIS or SLOA element the field usually supports. The mapping is representative. Each program defines its own.'
    ),

    h2('2. The catalog'),
    catalog('SAP fields by area', sapFieldColumns, sapFields, 'In S/4HANA the material number can be up to 40 characters and amount fields up to 23 digits. Program-specific customer fields, usually prefixed ZZ, are not listed.'),

    h2('3. Value lists worth memorizing'),
    table('Reference procedure (`AWTYP`) values on the accounting document header', ['Value', 'Source object', 'Key in `AWKEY`', 'Where to read the source'], [
      ['`BKPF`', 'Direct FI posting', 'Document number, company code, fiscal year', 'The document itself'],
      ['`MKPF`', 'Material document', 'Material document number and year', '`MKPF`, `MSEG`'],
      ['`RMRP`', 'Logistics invoice', 'Invoice number and fiscal year', '`RBKP`, `RSEG`'],
      ['`VBRK`', 'Billing document', 'Billing document number', '`VBRK`, `VBRP`'],
      ['`AMDP`, `AMBU`, `ANLA`', 'Asset depreciation run, asset posting, asset transaction', 'Asset document reference', '`ANEK`, `ANEP`, `ANLP`'],
      ['`COBK`', 'Controlling document through real-time integration', 'CO document number', '`COBK`, `COEP`'],
      ['`AUAK`', 'Settlement document', 'Settlement document number', 'Settlement tables and the sender object'],
      ['`PRCHG`', 'Material price change', 'Price change document', 'Material ledger documents'],
      ['`IDOC`', 'Posting created from an IDoc', 'IDoc number', '`EDIDC`, `EDID4`'],
      ['`BKPFF`', 'Posting through the accounting BAPI or interface', 'Reference key supplied by the sender', 'Sending system and interface log'],
      ['`HRPAY`', 'Payroll posting', 'Posting run reference', 'Payroll posting documents']
    ], 'Values are standard reference procedures. Which ones a program uses depends on its interfaces and configuration.'),
    table('Document status and indicator values', ['Field', 'Value', 'Meaning'], [
      ['`BKPF-BSTAT`', 'blank', 'Normal posted document'],
      ['`BKPF-BSTAT`', 'V', 'Parked document'],
      ['`BKPF-BSTAT`', 'W', 'Parked document, saved as complete'],
      ['`BKPF-BSTAT`', 'Z', 'Parked document that was deleted'],
      ['`BKPF-BSTAT`', 'S', 'Noted item'],
      ['`BKPF-BSTAT`', 'D', 'Recurring entry document'],
      ['`BKPF-BSTAT`', 'L', 'Posting to non-leading ledgers only'],
      ['`BSEG-SHKZG`', 'S / H', 'Debit (Soll) / credit (Haben)'],
      ['`BSEG-KOART`', 'S, K, D, A, M', 'G/L, vendor, customer, asset, material'],
      ['`EKKO-BSTYP`', 'F, K, L, A', 'Purchase order, contract, scheduling agreement, request for quotation'],
      ['`EKBE-VGABE`', '1, 2, 3, 4, 9', 'Goods receipt, invoice receipt, subsequent debit or credit, down payment, service entry'],
      ['`EKPO-KNTTP`', 'K, P, F, A, U', 'Cost center, project, order, asset, unknown'],
      ['`EBAN-STATU`', 'N, B, A', 'Not edited, purchase order created, request for quotation created'],
      ['`VBAK-VBTYP`', 'C, J, M, O, K, L', 'Order, delivery, invoice, credit memo, credit memo request, debit memo request'],
      ['`JEST-STAT`', 'I0001, I0002, I0045, I0046', 'Created, released, technically completed, closed']
    ])
  ],
  sources: [
    { name: 'SFIS SLOA Validation Service Functional Description Document v1.2.4', url: 'https://comptroller.war.gov/Portals/45/Documents/ODCFO/SFIS/SLOA_FDD_v1_2.4_12222022.pdf' },
    { name: 'DoD FMR Volume 1, Chapter 4: Standard Financial Information Structure', url: 'https://comptroller.defense.gov/Portals/45/documents/fmr/current/01/01_04.pdf' },
    { name: 'Treasury: GTAS bulk file format, fiscal year 2026', url: 'https://fiscal.treasury.gov/system/files/2026-04/bulk-file-format-b.pdf' },
    { name: 'Table reference: FMIFIIT', url: 'https://leanx.eu/en/sap/table/fmifiit.html' }
  ]
};
