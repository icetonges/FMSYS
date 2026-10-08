import { h2, h3, p, list, steps, callout, table, figure } from '../blocks';

const fmUpdate = {
  id: 'sapx-fmupd',
  cols: 4,
  colWidth: 222,
  colGap: 60,
  rowGap: 58,
  rowLabels: ['Business document carries the coding block', 'Funds Management decides what it is and whether budget exists', 'Ledgers updated'],
  nodes: [
    { id: 'doc', col: 0, row: 0, tone: 'source', title: 'Source document', lines: ['Requisition, order, earmarked funds, invoice, payment, journal, payroll, travel'] },
    { id: 'cobl', col: 1, row: 0, kind: 'entity', tone: 'source', title: 'Coding block (COBL)', lines: ['HKONT  G/L account', 'KOSTL, AUFNR, PS_PSP_PNR', 'GEBER  fund', 'FISTL  funds center', 'FIPOS  commitment item', 'FKBER  functional area', 'MEASURE  funded program'] },
    { id: 'der', col: 2, row: 0, tone: 'process', title: 'Derivation (FMDERIVE)', lines: ['Fills missing FM fields from account, cost object, material group, or custom rules', 'Result is stored on the document'] },
    { id: 'val', col: 3, row: 0, tone: 'process', title: 'Master data checks', lines: ['Fund validity dates and expiration', 'Budget object status', 'Commitment item financial transaction and category'] },
    { id: 'prof', col: 0, row: 1, tone: 'process', title: 'Update profile', lines: ['Sets the value type and the date that decides the budget year', 'Payment budget and commitment budget settings'] },
    { id: 'avc', col: 1, row: 1, tone: 'process', title: 'Availability control', lines: ['Compares consumable budget to consumed and committed amounts', 'Warning or error by tolerance profile'] },
    { id: 'chain', col: 2, row: 1, tone: 'process', title: 'Commitment chain', lines: ['A follow-on document reduces its predecessor', 'Order reduces requisition, invoice reduces order'] },
    { id: 'bl', col: 3, row: 1, tone: 'process', title: 'Budgetary ledger derivation', lines: ['Maps the FM event to USSGL 4000-series debit and credit'] },
    { id: 'ioi', col: 0, row: 2, kind: 'entity', tone: 'accounting', title: 'FMIOI', lines: ['Open commitments', 'value types 50, 51, 65, 80-82'] },
    { id: 'fiit', col: 1, row: 2, kind: 'entity', tone: 'accounting', title: 'FMIFIIT', lines: ['Actuals', 'value types 54, 57, 58, 61, 66'] },
    { id: 'tot', col: 2, row: 2, kind: 'entity', tone: 'accounting', title: 'FMIT, FMAVCT', lines: ['Totals by budget address', 'Availability control ledger'] },
    { id: 'gl', col: 3, row: 2, kind: 'entity', tone: 'statements', title: 'BKPF, BSEG, ledgers', lines: ['Proprietary and budgetary lines', 'Federal reporting ledgers'] }
  ],
  edges: [
    { from: 'doc', to: 'cobl' }, { from: 'cobl', to: 'der' }, { from: 'der', to: 'val' },
    { from: 'val', to: 'bl', dashed: true },
    { from: 'prof', to: 'avc' }, { from: 'avc', to: 'chain' }, { from: 'chain', to: 'bl' },
    { from: 'doc', to: 'prof', dashed: true },
    { from: 'prof', to: 'ioi' }, { from: 'avc', to: 'fiit' }, { from: 'chain', to: 'tot' }, { from: 'bl', to: 'gl' }
  ]
};

const budgetChain = {
  id: 'sapx-budget',
  cols: 5,
  colWidth: 180,
  colGap: 40,
  rowGap: 56,
  rowLabels: ['Authority', 'SAP record', 'USSGL budgetary accounts'],
  nodes: [
    { id: 'a1', col: 0, row: 0, tone: 'source', title: 'Appropriation', lines: ['Public law, Treasury warrant'] },
    { id: 'a2', col: 1, row: 0, tone: 'source', title: 'Apportionment', lines: ['OMB SF 132'] },
    { id: 'a3', col: 2, row: 0, tone: 'source', title: 'Allotment and sub-allotment', lines: ['Funding authorization documents down the funds center hierarchy'] },
    { id: 'a4', col: 3, row: 0, tone: 'source', title: 'Commitment', lines: ['Certified requisition or funds commitment'] },
    { id: 'a5', col: 4, row: 0, tone: 'source', title: 'Obligation to outlay', lines: ['Order, receipt, invoice, payment'] },
    { id: 's1', col: 0, row: 1, kind: 'entity', tone: 'process', title: 'FMBH / FMBL', lines: ['Process ENTR', 'Budget type: appropriation', 'Top funds center'] },
    { id: 's2', col: 1, row: 1, kind: 'entity', tone: 'process', title: 'FMBH / FMBL', lines: ['Budget type: apportionment', 'or status change of', 'the same budget'] },
    { id: 's3', col: 2, row: 1, kind: 'entity', tone: 'process', title: 'FMBH / FMBL', lines: ['Process TRAN or SEND/RECV', 'Sender and receiver', 'funds centers'] },
    { id: 's4', col: 3, row: 1, kind: 'entity', tone: 'process', title: 'EBAN or KBLK/KBLP', lines: ['FMIOI value type 50', 'or 65, 81, 82'] },
    { id: 's5', col: 4, row: 1, kind: 'entity', tone: 'process', title: 'EKKO, BKPF', lines: ['FMIOI value type 51', 'FMIFIIT 54 and 57'] },
    { id: 'u1', col: 0, row: 2, tone: 'accounting', title: '4119 to 4450', lines: ['Appropriation realized, unapportioned'] },
    { id: 'u2', col: 1, row: 2, tone: 'accounting', title: '4450 to 4510', lines: ['Apportioned, available for allotment'] },
    { id: 'u3', col: 2, row: 2, tone: 'accounting', title: '4510 to 4610', lines: ['Allotted, available for commitment'] },
    { id: 'u4', col: 3, row: 2, tone: 'accounting', title: '4610 to 4700', lines: ['Committed'] },
    { id: 'u5', col: 4, row: 2, tone: 'accounting', title: '4700 to 4801, 4901, 4902', lines: ['Obligated, delivered, paid'] }
  ],
  edges: [
    { from: 'a1', to: 'a2' }, { from: 'a2', to: 'a3' }, { from: 'a3', to: 'a4' }, { from: 'a4', to: 'a5' },
    { from: 'a1', to: 's1' }, { from: 'a2', to: 's2' }, { from: 'a3', to: 's3' }, { from: 'a4', to: 's4' }, { from: 'a5', to: 's5' },
    { from: 's1', to: 'u1' }, { from: 's2', to: 'u2' }, { from: 's3', to: 'u3' }, { from: 's4', to: 'u4' }, { from: 's5', to: 'u5' }
  ]
};

export const sapFederalPage = {
  slug: 'sap-federal',
  prefix: 'SF',
  group: 'SAP expert series',
  eyebrow: 'SAP expert series, part 3',
  navTitle: 'SAP Funds Management and US Federal Accounting in Depth',
  shortTitle: 'SAP Federal Accounting',
  blurb: 'How SAP Public Sector Management records budget authority, checks funds, tracks commitments through outlay, derives USSGL budgetary accounts, closes the year, and supports Treasury reporting, with the DoD IG findings that show where it breaks.',
  appliesTo: ['gfebs', 'navy-erp', 'gcss-army', 'lmp', 'dla-ebs'],
  blocks: [
    h2('1. Why a commercial ledger is not enough'),
    p('A commercial general ledger answers what the entity owns, owes, earned, and spent. Federal accounting adds a second question for every dollar: what legal authority allowed it, and what stage of use has that authority reached. SAP answers the second question in Funds Management and turns the answer into USSGL budgetary accounts through the US Federal extension.'),
    table('The two accounting views of one event', ['View', 'Question', 'SAP component', 'USSGL accounts', 'Statement'], [
      ['Proprietary', 'What happened to assets, liabilities, net position, revenue, and expense', 'FI General Ledger with subledgers', '1000 to 3000 and 5000 to 7000', 'Balance Sheet, Statement of Net Cost, Statement of Changes in Net Position'],
      ['Budgetary', 'What happened to budget authority', 'Funds Management, with the budgetary ledger writing to FI', '4000', 'Statement of Budgetary Resources, SF 133'],
      ['Memorandum', 'Statistical tracking', 'FI statistical postings', '8000', 'Supporting schedules']
    ]),

    h2('2. Funds Management master data'),
    table('FM account assignment elements', ['Element', 'Field', 'Master table', 'Meaning', 'What GFEBS public procedures show'], [
      ['FM area', '`FIKRS`', '`FM01`', 'Scope of budget control', 'Company code and business area both appear as ARMY'],
      ['Fund', '`GEBER`', '`FMFINCODE`', 'A source of funding with its own legal restrictions and validity', 'Examples `202010D12`, `202011D12`, and `202010A12`. Reading the examples, the value holds Treasury main account 2020, a two-digit qualifier, a funding-type letter, and a two-digit fiscal year. That structure is inferred from the examples and is not stated in the source.'],
      ['Funds center', '`FISTL`', '`FMFCTR`, hierarchy `FMHISV`', 'An organization that receives and manages budget', 'Examples `A76DD` and `A2ABM`'],
      ['Commitment item', '`FIPOS`, `FIPEX`', '`FMCI`', 'What the money is spent on or where revenue comes from', 'Four-character values such as `21T0` for travel and `22NL`. Derived from the element of resource. The G/L account appears as `6100.21T0`.'],
      ['Functional area', '`FKBER`', '`TFKB`', 'Purpose or program', 'Examples `131096QLOG` and `121018TTDY`. Built from the Army management structure code and the management decision package.'],
      ['Funded program', '`MEASURE`', '`FMMEASURE`', 'A lower-level program or project that is funded separately', 'Set equal to the WBS element for projects. `ARMY` is the default holding value.'],
      ['Budget period', '`BUDGET_PD`', '`FMBUDGETPD`', 'Period of availability for multi-year funds', 'Not shown in the public material'],
      ['Grant', '`GRANT_NBR`', '`GMGR`', 'Sponsor-funded agreement', 'Not shown in the public material']
    ], 'GFEBS examples come from the U.S. Army Financial Management School desktop procedures dated 2013. Values and structures can have changed since.'),
    list(
      'A commitment item has a **financial transaction** and a **commitment item category**. Financial transaction 30 with category 3 is an expenditure. Category 2 is revenue. Financial transaction 90 marks cash and bank accounts, and 60 and 80 mark receivables, payables, and clearing accounts that do not consume budget.',
      'A fund has a validity period and, in the federal extension, expiration and cancellation dates. Posting to an expired fund is limited to adjustments. Posting to a cancelled fund is blocked.',
      'Funds centers form one hierarchy per variant. Budget is distributed down the hierarchy and availability can be checked at any level.',
      'Cost objects can carry a fixed FM assignment in `FMZUOB`, so that a cost center or WBS element always posts to the same funds center and fund.'
    ),
    h3('Derivation'),
    p('Users rarely key every FM field. The derivation strategy in `FMDERIVE` fills them. A strategy is an ordered list of steps: derivation rules, which are lookup tables, table lookups, assignments, function calls, and enhancements. `FMDERIVATIONANALYSIS` replays a posting and shows which step set each field. When an obligation lands on the wrong fund or commitment item, the derivation trace is the first place to look.'),

    h2('3. How a posting updates Funds Management'),
    figure('Funds Management update: from coding block to ledgers', fmUpdate),
    table('Value types and the documents that create them', ['Value type', 'Name', 'Created by', 'Table', 'Budgetary meaning'], [
      ['50', 'Purchase requisition', '`ME51N`, requisition interfaces', '`FMIOI`', 'Commitment'],
      ['51', 'Purchase order', '`ME21N`, contract interfaces', '`FMIOI`', 'Obligation, undelivered order'],
      ['52', 'Business trip commitment', 'Travel request', '`FMIOI`', 'Obligation'],
      ['80', 'Funds block', '`FMW1`', '`FMIOI`', 'Administrative hold'],
      ['81', 'Funds reservation', '`FMX1`', '`FMIOI`', 'Reservation or commitment'],
      ['82', 'Funds precommitment', '`FMY1`', '`FMIOI`', 'Commitment'],
      ['65', 'Funds commitment', '`FMZ1`', '`FMIOI`', 'Obligation without a purchase order'],
      ['83', 'Forecast of revenue', '`FMV1`', '`FMIOI`', 'Anticipated collection'],
      ['54', 'Invoice', '`MIRO`, `FB60`, goods receipt depending on profile', '`FMIFIIT`', 'Accrued expenditure, delivered order unpaid'],
      ['57', 'Payment', 'Payment document, payment conversion `FMF0`', '`FMIFIIT`', 'Outlay'],
      ['58 / 61', 'Down payment request / down payment', '`F-47` / `F-48`', '`FMIFIIT`', 'Advance'],
      ['66', 'Transfer posting', '`FB50` and reclassifications', '`FMIFIIT`', 'Adjustment between FM addresses'],
      ['95', 'Secondary cost posting', 'CO allocations when CO integration is active', '`FMICOIT`', 'Internal cost movement']
    ]),
    list(
      'The **update profile** on the FM area decides two things for each value type: whether it consumes payment budget, commitment budget, or both, and which date sets the budget year. A profile can use the posting date, the delivery date, or the due date.',
      'The **commitment chain** keeps consumption from double counting. A purchase order created from a requisition reduces the requisition in `FMIOI` and adds itself. An invoice reduces the order. Each reduction is its own line with amount type `0200`.',
      'When an invoice is paid, **payment conversion** changes the invoice line from value type 54 to 57. With online payment update it happens at payment posting. Otherwise the program behind `FMF0` does it in a batch.',
      'Statistical lines, flagged in `STATS`, appear in reports and do not consume budget.'
    ),

    h2('4. Budget Control System'),
    figure('Budget authority from appropriation to outlay: SAP records and USSGL accounts', budgetChain, 'Budget types, statuses, and the exact account pairs are configuration. The DoD USSGL Transaction Library defines the required entries.'),
    table('Budget Control System concepts', ['Concept', 'What it is', 'Where stored or set'], [
      ['Budget category', 'Payment budget (`9F`) or commitment budget (`9G`)', 'FM area settings'],
      ['Budget type', 'A classification of budget, such as appropriation, apportionment, allotment, reimbursable authority, continuing resolution', 'Customizing. Federal attributes of each type in `FMFG_BUTYPE`.'],
      ['Budgeting process', 'What the entry does: enter, supplement, return, transfer, with send and receive sides, carry over', 'Field on the entry document line'],
      ['Entry document', 'The record of one budget action with header, lines, and optional workflow', '`FMBH`, `FMBL`. Entered in `FMBB`.'],
      ['Document type', 'Classifies entry documents and sets number range and authorization', 'Customizing. GFEBS procedures show type ALLT for allotment.'],
      ['Version', 'Budget versions allow a working version and the version of record, version 000', 'Field on totals and documents'],
      ['Budget address', 'The combination of fund, funds center, commitment item, functional area, funded program, and grant that holds budget', '`FMBDT`'],
      ['Posting address', 'The combination a document posts to. It is mapped to a budget address by a derivation.', 'Budget structure and derivation'],
      ['Availability control ledger', 'Totals of consumable budget and consumed amounts by control address. `9H` for payment budget, `9I` for commitment budget.', '`FMAVCT`'],
      ['Tolerance profile', 'Thresholds that issue a warning, an error, or a notification, by activity group', 'Customizing'],
      ['Status', 'Preposted, posted, and reversed entry documents. Budget can be held until released.', 'Entry document header']
    ]),
    list(
      'Availability control reads `FMAVCT`, not the line items. If the ledger is out of step after a configuration change or a failed update, `FMAVCREINIT` rebuilds it.',
      '`FMAVCR01` shows consumable budget, consumed amount, and available amount by control object for a year. It is the system view of status of funds.',
      'The GFEBS role map shows budget distribution in `FMBB` together with custom distribution and threshold transactions, and a year-end certification step.',
      'DoD IG reported that GFEBS became the Army General Fund system of record for fund distribution in fiscal year 2013, and that 22 appropriations totaling $176.5 billion were not recorded in it on time that year.'
    ),

    h2('5. Earmarked funds'),
    p('Earmarked funds documents commit or obligate budget without a purchasing document. They are the SAP record behind miscellaneous obligations, travel orders, training, and transportation charges.'),
    table('Earmarked funds categories', ['Category', 'Create', 'Value type', 'Use', 'GFEBS document types in public procedures'], [
      ['Funds block', '`FMW1`', '80', 'Hold budget so it cannot be used', 'Not shown'],
      ['Funds reservation', '`FMX1`', '81', 'Reserve budget for a purpose not yet defined in detail', 'Not shown'],
      ['Funds precommitment', '`FMY1`', '82', 'Commit budget for a planned requirement', 'M1, labeled FCM commitment'],
      ['Funds commitment', '`FMZ1`', '65', 'Obligate budget when there is a legal liability and no purchase order', 'F9 miscellaneous obligation, F1 travel obligation paid through the Integrated Automated Travel System, F6 PowerTrack transportation obligation'],
      ['Forecast of revenue', '`FMV1`', '83', 'Record expected revenue', 'Not shown']
    ]),
    list(
      'Header `KBLK`, items `KBLP`, consumption history `KBLE`. Each item carries its own fund, funds center, commitment item, G/L account, and cost object.',
      'An invoice entered in `FB60` references the earmarked funds number and item. The reference is stored on the invoice line in `BSEG-KBLNR` and `KBLPOS`, and the consumption appears in `KBLE`.',
      'The completion indicator on the item closes the remaining amount. Setting it releases unliquidated budget, which is a deobligation.',
      'Because there is no contract or receiving report behind a funds commitment, auditors test these documents for a valid obligating event and for timely liquidation. They are the SAP equivalent of the miscellaneous obligation document.'
    ),

    h2('6. The budgetary ledger'),
    p('The budgetary ledger is the part of the US Federal extension that writes USSGL 4000-series lines. It listens to FM updates and derives a debit and credit account pair from the event, the value type, the budget type, and fund attributes.'),
    table('Budgetary ledger objects named in the SAP US Federal component', ['Object', 'Purpose'], [
      ['`FMFGBLAREA`, `FMFGBLAREAT`, `FMFGBLAREAFLD`', 'Budgetary ledger areas: the kinds of event the ledger posts for, and the fields each uses'],
      ['`FMFGBLAREADOCTY`', 'FI document type used for budgetary ledger postings in each area'],
      ['`FMFG_BUTYPE`', 'Budgetary ledger attributes of each budget type'],
      ['`FMFGBLDRVAREAEAA`', 'Derivation rule that sets expended appropriations for actuals'],
      ['`FMSGLCLASS`', 'Classification of SGL accounts'],
      ['`FMFG_BL_YRCL`, `FMFGYECLAA`', 'Year-end closing rules for the budgetary ledger and pre-closing of anticipated accounts'],
      ['`FMFG_ABP`, `FMFG_ABP_HDR_DEF`, `FMABP_AREAS`', 'Automatic budget postings, for example budget created automatically from reimbursable orders or collections'],
      ['`FMFONDS`, `FMFONDST`', 'Assignment of a cancelled fund to a current fund, used to pay old obligations from current authority']
    ], 'Object names and descriptions come from a public listing of the SAP PSM-FG component tables.'),
    table('Standard event-to-account logic the budgetary ledger must reproduce', ['Event', 'Budgetary entry', 'Proprietary entry in the same or a linked document'], [
      ['Appropriation enacted', 'Dr 4119 Cr 4450', 'Dr 1010 Cr 3101'],
      ['Apportionment', 'Dr 4450 Cr 4510', 'None'],
      ['Allotment', 'Dr 4510 Cr 4610', 'None'],
      ['Commitment', 'Dr 4610 Cr 4700', 'None'],
      ['Obligation', 'Dr 4700 Cr 4801', 'None'],
      ['Goods or services received', 'Dr 4801 Cr 4901', 'Dr 6100 or asset Cr 2110. Dr 3107 Cr 5700.'],
      ['Payment', 'Dr 4901 Cr 4902', 'Dr 2110 Cr 1010'],
      ['Advance paid', 'Dr 4801 Cr 4802', 'Dr 1410 Cr 1010'],
      ['Reimbursable order accepted, without advance', 'Dr 4221 Cr 4210', 'None'],
      ['Reimbursable earned and billed', 'Dr 4251 Cr 4221', 'Dr 1310 Cr 5200'],
      ['Reimbursable collected', 'Dr 4252 Cr 4251', 'Dr 1010 Cr 1310'],
      ['Downward adjustment of a prior-year unpaid obligation', 'Dr 4801 Cr 4871', 'None'],
      ['Upward adjustment of a prior-year unpaid obligation', 'Dr 4881 Cr 4801', 'None'],
      ['Rescission of new authority', 'Dr 4450 Cr 4392', 'Dr 3106 Cr 1010 where funds are returned'],
      ['Temporary reduction under a continuing resolution', 'Dr 4450 Cr 4395', 'None']
    ], 'Account pairs follow the USSGL as cited in DoD IG reports on GFEBS and in the Treasury Financial Manual. The DoD USSGL Transaction Library is the authoritative list, by DoD Transaction Code.'),
    callout('What DoD IG found when it tested this logic in GFEBS', 'DODIG-2014-090 reported $6.3 billion of budget-to-report transactions that were not configured correctly: $4.1 billion of prior-year funding posted to account 4119, which is for current-year appropriations, and $2.2 billion posted to summary-level accounts instead of detail-level accounts. Staff used a job aid that offset 4395 against 4119 instead of 4450. The follow-up report DODIG-2020-035 found seven noncompliant debit and credit combinations still in use, 19,771 times for $917.4 million, and at least $20.8 billion of fourth-quarter fiscal year 2018 adjustments made by DFAS to correct posting logic.'),

    h2('7. Federal reporting ledgers and Treasury attributes'),
    list(
      'The federal extension keeps special ledgers that hold balances with reporting attributes. A public table listing ties ledger 95 to totals table `FMUSFGT`, ledger 96 to `FMUSFGFACTS1T`, and ledger 97 to `FMUSFGFACTS2T`. The attribute keys are in `FMFGKEY`, `FMFGKEY96`, and `FMFGKEY97`.',
      'The names refer to FACTS I and FACTS II, the Treasury systems that GTAS replaced. The attribute concept is the same: each balance carries values such as federal or non-federal, trading partner, apportionment category, and authority type.',
      'DoD IG described the same design in GFEBS: the standard general ledger did not meet federal reporting needs, Special Ledger 95 was built for Treasury reporting, and a custom Z1 ledger was added in April 2010 to carry the DoD reporting attributes.',
      'Attributes are derived when the document posts. If a derivation is missing or wrong, the balance carries a blank or invalid attribute, which fails a GTAS validation or a DDRS edit.',
      'DoD IG tested 20 required attributes in GFEBS. Eleven were inconsistent in Special Ledger 95 and eight in the Z1 ledger, including trading partner, custodial indicator, and prior-year adjustment code.'
    ),
    table('Treasury-facing functions in the SAP US Federal component', ['Function', 'What it supports', 'Objects named in the component'], [
      ['Treasury account symbol structure', 'Application of funds groups funds into the Treasury account they belong to', 'Application of funds master, `FM1081_FUND_ROW`'],
      ['Fiscal station and Agency Location Code', 'Identifies the accounting station and the disbursing or reporting office', '`FMFGT_FSN`, `FMFGT_ALC_GWA`'],
      ['Governmentwide accounting reporter rules', 'Whether an office reports classification at the time of the transaction', '`FMUSFG_GWA_ACTIO`, `FMUSFG_GWA_ELIGI`, `FMUSFG_GWA_RCVAL`'],
      ['Treasury subclass', 'Subclass codes by document type, account, and fund', '`FMUSFG_TS`, `FMUSFG_TSA`'],
      ['IPAC', 'Outgoing IPAC files, incoming IPAC transactions, automatic document creation', '`FMFGT_IPACED`, `FMFGT_IPAC_FILE`, `FMFGT_IPAC_STATS`, `FMFGT_IPAC_ACCT`, transaction `FMFG_IPAC`'],
      ['SF 1081', 'Voucher and schedule of withdrawals and credits between appropriations', '`FM1081_FUND_ROW` and form interface'],
      ['Prior reported data', 'Keeps what was already reported so only changes go out', '`FMFG_PRIOR_RPT`, `FMFG_PRIOR_RPTKF`'],
      ['Trading partner exceptions', 'Non-federal partners that would otherwise look federal', '`FMFG_TRADE_ID`'],
      ['Reporting layouts', 'Definitions for federal report formats', '`FMFGRLAYOUT`, `FMFGRLAYOUT_DEF`']
    ]),

    h2('8. Payables functions required by federal law'),
    table('Prompt Payment Act and related functions', ['Function', 'Rule it supports', 'Objects named in the component'], [
      ['Due date calculation', 'Payment is due a set number of days after the later of invoice receipt and acceptance', 'Baseline date `ZFBDT`, payment terms, material group to payment terms mapping `T023P`'],
      ['Interest penalty', 'Late payments accrue interest at the Treasury rate', 'Rates `T023R`, minimum and maximum `T023B`, reason codes `T023U`'],
      ['Fast pay and accelerated pay', 'Certain invoices are paid before acceptance or on shortened terms', '`T023Q`, exclusion table `FMFGT_EXCL`'],
      ['Reason codes', 'Why an invoice was paid late, early, or adjusted', '`FMFGRC`, `FMFG_REASONS`, `FMFG_PPA_INV_HD`, `FMFG_PPA_INV_LN`'],
      ['Statistical sampling', 'Low-value invoices may be certified by sample', '`FMFGT_SS04`'],
      ['Contractor registration', 'Vendor data must match the governmentwide registration', '`FMCCRTVENDOR`, `FMCCRTUPDATES`, `FMFG_LFACCR`, display-only fields `FMFG_CCRFDDISP`'],
      ['Pending purchase order changes', 'Changes that need approval before they take effect', '`FMFG_VEKPO`, `FMFG_MM_PEND_CHG`'],
      ['Recurring obligations', 'Obligations recorded on a schedule, such as leases and utilities', '`FMROHDR`, `FMROLINE`, `FMROPOS`'],
      ['Treasury offset', 'Delinquent debts are referred for offset', 'Programs listed in the GFEBS role map: `RTREAS_OFFSET_FILE`, `RTREAS_OFFSET_UPDATE`']
    ]),

    h2('9. Period-end and year-end'),
    steps(
      'Clear interface queues. Reprocess or resolve IDocs in error and batch input sessions.',
      'Complete goods receipts and service entry sheets for the period. Post accruals for received and unbilled items.',
      'Run the payment conversion so paid invoices show as outlays.',
      'Run depreciation, settlement of orders and projects, and allocations.',
      'Reconcile Funds Management to the general ledger. The GFEBS role map lists two federal reconciliation reports and an abnormal balance report under reconciliation postings.',
      'Reconcile Fund Balance with Treasury by Treasury account symbol.',
      'Close posting periods in FI (`OB52`), materials (`MMPV`), CO (`OKP1`), and FM.',
      'Produce the trial balance extract for DDRS. The GFEBS role map lists custom SFIS trial balance and DDRS trial balance transactions.'
    ),
    table('Year-end steps specific to a federal system', ['Step', 'What happens', 'Transactions seen in the GFEBS role map'], [
      ['Review open commitments and obligations', 'Close items that are complete. Deobligate invalid balances.', '`FMMC`, `FMY2`, `FMZ2`, custom open commitment and open obligation reports'],
      ['Carry forward open documents', 'Requisitions, orders, and earmarked funds move to the new year with their budget, per fund rules', 'Commitment carryforward in FM'],
      ['Unfilled customer orders', 'Report and carry forward reimbursable orders not yet earned', '`FMFG_RPT_E_UNFILLED`, custom unfilled orders report'],
      ['Cancelling appropriations', 'Five years after expiration, remaining balances cancel. Open payables and receivables move to the cancelled-fund treatment.', '`FMFG_CANCELED_AP`, `FMFG_CANCELED_AP_MM`, `FMFG_CANCELED_AR`'],
      ['Pre-closing and closing entries', 'Anticipated accounts are closed. Budgetary and proprietary closing entries post.', '`FMFG_YEAR_END_CLOSE`, `F.80`'],
      ['Close orders', 'Set orders to technically complete and closed', '`CO99`'],
      ['Year-end certification', 'Budget holders certify status of funds', '`FMB_B01`'],
      ['Balance carryforward', 'General ledger and special ledger balances roll to the new year. Fund balances carry forward in FM.', '`FAGLGVTR`, `GVTR`, `FMSU`'],
      ['Rebuild availability control', 'Recompute the control ledger for the new year', '`FMAVCREINIT`']
    ], 'The step descriptions are the standard federal year-end sequence. The transaction column lists what the public GFEBS role-to-transaction mapping places under its year-end close activity.'),

    h2('10. Reconciling Funds Management to the general ledger'),
    table('Checks that prove the two views agree', ['Check', 'Compare', 'A difference means'], [
      ['Obligations', 'Open `FMIOI` value type 51 and 65 by fund to USSGL 4801', 'Budgetary ledger did not post for some documents, or manual 4801 journals exist'],
      ['Commitments', 'Open `FMIOI` value type 50, 81, 82 to USSGL 4700', 'Same causes'],
      ['Delivered orders unpaid', '`FMIFIIT` value type 54 not yet converted to USSGL 4901, and to payables 2110', 'Payment conversion not run, or invoices posted without FM assignment'],
      ['Outlays', '`FMIFIIT` value type 57 to USSGL 4902 and to Fund Balance with Treasury activity', 'Payments posted outside the payment program, or disbursing returns not matched'],
      ['Budget', '`FMBDT` by budget type to USSGL 4119, 4450, 4510, 4610', 'Budget entered without budgetary ledger posting, or the wrong account pair'],
      ['Tie points', 'Budgetary to proprietary relationships, for example 4801 change against undelivered order activity, 4902 against expended appropriations', 'One side of a dual entry is missing'],
      ['Document level', '`FMIFIIT-KNBELNR` to `BKPF-BELNR`', 'FM lines without an FI document or FI lines with an FM assignment and no FM line']
    ])
  ],
  sources: [
    { name: 'SAP PSM-FG component tables (public listing)', url: 'https://www.testingbrain.com/sap/psm-module/sap-psm-fg-functions-for-u-s-federal-government-in-psm-tables.html' },
    { name: 'SAP Help: US Federal Government (PSM-FG)', url: 'https://help.sap.com/docs/SAP_ERP/bd38163d92fe479186780e21c3605544/cbf5cc53a8b77214e10000000a174cb4.html?version=6.17.latest' },
    { name: 'SAP Help: Customizing the Budgetary Ledger', url: 'https://help.sap.com/docs/SAP_S4HANA_ON-PREMISE/d56edf94353d4beeabb7f9b90adf081a/2ceccc53a8b77214e10000000a174cb4.html' },
    { name: 'U.S. Army Financial Management School: GFEBS Desktop SOP (public copy)', url: 'https://silo.tips/download/us-army-financial-management-school-gfebs-desktop-sop' },
    { name: 'GFEBS role to transaction code mapping (public copy)', url: 'https://pdfcoffee.com/role-to-t-code-mapping-pdf-free.html' },
    { name: 'DODIG-2012-066: GFEBS did not provide required financial information', url: 'https://apps.dtic.mil/sti/pdfs/ADA559121.pdf' },
    { name: 'DODIG-2014-090: GFEBS Budget-to-Report business process', url: 'https://media.defense.gov/2014/Jul/02/2001713378/-1/-1/1/DODIG-2014-090.pdf' },
    { name: 'DODIG-2020-035: Followup audit of GFEBS Acquire-to-Retire and Budget-to-Report', url: 'https://media.defense.gov/2019/Dec/02/2002218762/-1/-1/1/DODIG-2020-035.PDF' },
    { name: 'DoD FMR Volume 1, Chapter 7: DoD Standard Chart of Accounts', url: 'https://comptroller.defense.gov/Portals/45/documents/fmr/current/01/01_07.pdf' },
    { name: 'Treasury: USSGL', url: 'https://fiscal.treasury.gov/accounting/us-standard-general-ledger-ussgl' }
  ]
};
