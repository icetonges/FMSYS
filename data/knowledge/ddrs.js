import { h2, h3, p, list, steps, callout, table, figure } from './blocks';

const flow = {
  id: 'ddrs-flow',
  cols: 4,
  colWidth: 222,
  colGap: 56,
  rowGap: 58,
  rowLabels: ['Monthly budgetary cycle', 'Quarterly and annual statement cycle', 'Treasury and governmentwide reporting'],
  nodes: [
    { id: 'gl', col: 0, row: 0, tone: 'source', title: 'Component accounting systems', lines: ['GFEBS, Navy ERP, DEAMS, DAI', 'LMP, DLA EBS, CEFMS', 'GAFS-R, SABRS, other legacy', 'Balances of retired systems still carried'] },
    { id: 'gex', col: 1, row: 0, tone: 'source', title: 'Trial balance and feeder files', lines: ['SFIS-compliant trial balance from target systems', 'Legacy feeder files in RDT or GLAC format', 'Sent through GEX'] },
    { id: 'b', col: 2, row: 0, tone: 'process', title: 'DDRS-B (Budgetary)', lines: ['Import and inventory control', 'Crosswalk to USSGL and DoD SCOA', 'Edits and abnormal balance checks', 'System-generated and manual JVs', 'Tie-point reconciliation'] },
    { id: 'bout', col: 3, row: 0, tone: 'reporting', title: 'Budget execution reports', lines: ['SF 133', 'AR(M) 1002 Appropriation Status', 'AR(M) 725 Reimbursements', 'AR(M) 1307 for working capital funds'] },
    { id: 'call', col: 0, row: 1, tone: 'source', title: 'Data calls', lines: ['Amounts that do not start as system transactions', 'Property, OM&S, environmental and contingent liabilities, note data'] },
    { id: 'dcm', col: 1, row: 1, tone: 'process', title: 'DCM (Data Collection Module)', lines: ['Collects data call amounts from Components', 'Feeds JV category M'] },
    { id: 'afs', col: 2, row: 1, tone: 'process', title: 'DDRS-AFS (Audited Financial Statements)', lines: ['Receives the DDRS-B export file', 'Statement and note crosswalks', 'Eliminations and adjustments', 'Component and agency-wide consolidation'] },
    { id: 'stmt', col: 3, row: 1, tone: 'statements', title: 'Financial statements', lines: ['Balance Sheet', 'Statement of Net Cost', 'Changes in Net Position', 'Statement of Budgetary Resources', 'Notes and required supplementary information'] },
    { id: 'advana', col: 0, row: 2, tone: 'detail', title: 'Advana', lines: ['Feeder-to-GL and GL-to-trial-balance reconciliation workbooks', 'Reads accounting systems and DDRS data'] },
    { id: 'cars', col: 1, row: 2, tone: 'accounting', title: 'Treasury CARS', lines: ['Fund Balance with Treasury', 'TAS and BETC classified cash activity'] },
    { id: 'gtas', col: 2, row: 2, tone: 'accounting', title: 'Treasury GTAS', lines: ['Adjusted trial balance bulk file', 'Fatal validations against the USSGL attribute table and the TAS master', 'Edits against CARS and other sources'] },
    { id: 'gov', col: 3, row: 2, tone: 'statements', title: 'Governmentwide outputs', lines: ['OMB SF 133', 'Financial Report of the U.S. Government', 'Intragovernmental differences reports'] }
  ],
  edges: [
    { from: 'gl', to: 'gex' }, { from: 'gex', to: 'b' }, { from: 'b', to: 'bout' },
    { from: 'call', to: 'dcm' }, { from: 'dcm', to: 'afs' }, { from: 'afs', to: 'stmt' },
    { from: 'b', to: 'afs', label: 'export file' },
    { from: 'afs', to: 'gtas', label: 'DDRS data to GTAS' },
    { from: 'cars', to: 'gtas', label: 'FBWT edits' },
    { from: 'gtas', to: 'gov' }
  ]
};

const logical = {
  id: 'ddrs-ldm',
  cols: 4,
  colWidth: 224,
  colGap: 62,
  rowGap: 60,
  rowLabels: ['Intake and conversion', 'Adjustment', 'Statement production'],
  nodes: [
    { id: 'file', col: 0, row: 0, kind: 'entity', tone: 'source', title: 'FEEDER_FILE', lines: ['*file id', 'source system, submitter', 'reporting period', 'record count, control total', 'load status, load date'] },
    { id: 'rec', col: 1, row: 0, kind: 'entity', tone: 'source', title: 'FEEDER_RECORD', lines: ['*file id, line number', 'TAS or fund cite', 'RDT or GLAC, or SCOA account', 'SFIS attributes', 'amount, debit/credit'] },
    { id: 'xwalk', col: 2, row: 0, kind: 'entity', tone: 'process', title: 'CROSSWALK_RULE', lines: ['*source code, attributes', 'budgetary USSGL account', 'proprietary USSGL account', 'effective period'] },
    { id: 'tb', col: 3, row: 0, kind: 'entity', tone: 'accounting', title: 'TB_LINE', lines: ['*entity, period, TAS,', '*SCOA account, attributes', 'ending balance', 'debit/credit indicator', 'source file reference'] },
    { id: 'log', col: 0, row: 1, kind: 'entity', tone: 'detail', title: 'JV_LOG', lines: ['*log type, period', 'Journal Voucher Adjustment', 'Feeder Trial Balance Adj.', 'Pre-Closing Adjustment', 'Undistributed Adjustment'] },
    { id: 'jv', col: 1, row: 1, kind: 'entity', tone: 'process', title: 'JOURNAL_VOUCHER', lines: ['*JV number', 'category A to M', 'system-generated or manual', 'root cause code', 'preparer, approver, dates', 'support reference'] },
    { id: 'jvl', col: 2, row: 1, kind: 'entity', tone: 'process', title: 'JV_LINE', lines: ['*JV number, line', 'entity, TAS', 'SCOA account, attributes', 'debit amount, credit amount'] },
    { id: 'atb', col: 3, row: 1, kind: 'entity', tone: 'accounting', title: 'ADJUSTED_TB_LINE', lines: ['*entity, period, TAS,', '*USSGL account, attributes', 'unadjusted balance', 'adjustments', 'adjusted balance'] },
    { id: 'dc', col: 0, row: 2, kind: 'entity', tone: 'source', title: 'DATA_CALL', lines: ['*call id, entity, period', 'topic and note reference', 'amount, narrative', 'submitter, certifier'] },
    { id: 'elim', col: 1, row: 2, kind: 'entity', tone: 'detail', title: 'ELIMINATION_PAIR', lines: ['*entity, trading partner,', '*reciprocal category', 'buyer amount, seller amount', 'difference, explanation'] },
    { id: 'map', col: 2, row: 2, kind: 'entity', tone: 'reporting', title: 'STATEMENT_LINE_MAP', lines: ['*statement, line, account', 'attribute conditions', 'sign, version, fiscal year'] },
    { id: 'stmt', col: 3, row: 2, kind: 'entity', tone: 'statements', title: 'STATEMENT_LINE / NOTE', lines: ['*entity, period, statement,', '*line', 'amount', 'supporting TB and JV lines'] }
  ],
  edges: [
    { from: 'file', to: 'rec', label: '1 : N' },
    { from: 'rec', to: 'xwalk', label: 'lookup' },
    { from: 'xwalk', to: 'tb', label: 'produces' },
    { from: 'log', to: 'jv', label: '1 : N' },
    { from: 'jv', to: 'jvl', label: '1 : N' },
    { from: 'jvl', to: 'atb', label: 'adjusts' },
    { from: 'tb', to: 'atb' },
    { from: 'atb', to: 'stmt' },
    { from: 'map', to: 'stmt', label: 'maps' },
    { from: 'dc', to: 'jv', sx: 60, tx: -60, label: 'category M' },
    { from: 'elim', to: 'jv', label: 'category C' }
  ]
};

export const ddrsPage = {
  slug: 'ddrs',
  prefix: 'D',
  eyebrow: 'System deep dive',
  navTitle: 'DDRS: Modules, Data Flow, Journal Vouchers, and Reporting Model',
  shortTitle: 'DDRS',
  blurb: 'How the Defense Departmental Reporting System turns Component trial balances into budget execution reports, financial statements, and the Treasury GTAS submission, with the module structure, record model, journal voucher rules, and audit history.',
  appliesTo: ['ddrs', 'gtas-cars', 'dod-treasury-close'],
  blocks: [
    h2('1. What DDRS is'),
    p('The Defense Departmental Reporting System is the DoD departmental reporting system. DFAS runs the monthly and quarterly reporting process in it. Every DoD accounting system reports to it. DDRS does not record business transactions. It receives balances, converts and edits them, records reporting adjustments, and produces budget execution reports and financial statements.'),
    list(
      'DoD FMR Volume 1, Chapter 4 requires target accounting systems to interface with DDRS using an SFIS-compliant trial balance.',
      'DoD FMR Volume 1, Chapter 7 states that all DoD accounting systems report to DDRS using the DoD Standard Chart of Accounts structure, and that DDRS summarizes the data into six-digit USSGL accounts and GTAS standard attributes for external reporting.',
      'DCMA describes DDRS as a web-based application that standardizes the departmental reporting process and produces quarterly and annual departmental reports based on the USSGL.',
      'DDRS belongs to the Business Enterprise Information Services family, together with the DFAS Corporate Database and DFAS Corporate Warehouse. DoD IG reported in 2012 that DLA managed that family after the Business Transformation Agency closed in 2011.'
    ),
    table('DDRS modules', ['Module', 'Cycle', 'Input', 'Processing', 'Output'], [
      ['DDRS-B (Budgetary)', 'Monthly', 'Component trial balances and legacy feeder files', 'Import, crosswalk of legacy codes to USSGL, edits, abnormal balance checks, system-generated and manual journal vouchers, tie-point reconciliation', 'SF 133, Accounting Report (M) 1002, Accounting Report (M) 725, Accounting Report (M) 1307, and the export file to DDRS-AFS'],
      ['DDRS-AFS (Audited Financial Statements)', 'Quarterly and year end', 'DDRS-B export file, data call amounts, elimination data', 'Statement and note crosswalks, eliminations, adjustments, Component and agency-wide consolidation', 'Balance Sheet, Statement of Net Cost, Statement of Changes in Net Position, Statement of Budgetary Resources, notes'],
      ['DCM (Data Collection Module)', 'Quarterly and year end', 'Data call submissions from Components', 'Collects amounts that do not start as accounting-system transactions', 'Data for journal voucher category M and for note disclosures']
    ], 'Module roles follow DoD FMR Volume 6A, Chapter 2 and DoD IG Report DODIG-2012-096. The FMR names the Accounting Report (M) 1307 as a report Components sign. Its placement under DDRS-B is this page\'s reading and should be confirmed with DFAS.'),

    h2('2. End-to-end data flow'),
    figure('DDRS data flow: accounting systems to budget reports, statements, and Treasury', flow, 'Public sources describe DDRS as the source of DoD data reported to Treasury. The sources reviewed for this page do not state which DDRS module builds the GTAS bulk file, so the arrow is labeled at the system level.'),
    steps(
      'Each Component accounting system closes the period and produces a trial balance. Target systems send an SFIS-compliant trial balance. Legacy systems send feeder files.',
      'DDRS-B imports the files and logs them on an inventory control report. Legacy records identified by Report Data Type or General Ledger Account Code are crosswalked to USSGL budgetary and proprietary accounts.',
      'Edits flag invalid attribute combinations and abnormal balances. DFAS researches differences and records journal vouchers.',
      'DDRS-B produces the budget execution reports and an export file.',
      'DDRS-AFS loads the export file, adds data call amounts and eliminations, and maps each account to a statement line and note.',
      'DoD data is submitted to Treasury GTAS as an adjusted trial balance. GTAS validates every record and runs edits against CARS and other sources.',
      'Treasury and OMB use GTAS data for the SF 133 and the Financial Report of the U.S. Government. DoD publishes the Agency Financial Report from DDRS-AFS output.'
    ),

    h2('3. What goes in: trial balances and feeder files'),
    table('Input formats', ['Input', 'Who sends it', 'Record identifier', 'What DDRS must do'], [
      ['SFIS-compliant trial balance', 'Target accounting systems such as GFEBS, Navy ERP, DEAMS, and DAI', 'TAS components, DoD SCOA account (six-digit USSGL plus four-digit DoD extension), SFIS attributes', 'Validate and load. No account conversion is needed.'],
      ['Feeder file with Report Data Types', 'Legacy status-of-funds systems', 'RDT, which represents an accounting stage such as commitment, obligation, or disbursement', 'Crosswalk each RDT to budgetary and proprietary USSGL accounts.'],
      ['Feeder file with General Ledger Account Codes', 'Legacy general ledger systems', 'GLAC, which represents a general ledger account', 'Map to the DoD SCOA and add missing attributes.'],
      ['Balances of retired systems and obsolete files', 'No active sender. Balances remain in DDRS after a system retires.', 'System or file identifier', 'Carry forward, adjust, or archive.']
    ], 'DoD IG found more than 200 Army General Fund feeder files processed in a single month in 2010. DCMA sends DAI trial balance data to DDRS daily and at month end through GEX.'),
    callout('Why the crosswalk matters to an auditor', 'When DDRS-B converts status-of-funds data into USSGL accounts, the general ledger balances reported for that entity are derived in DDRS and do not come from transaction-level postings in the source system. DoD IG reported in 2012 that this process did not meet FFMIA and OMB Circular A-127 requirements for the Army General Fund. DODIG-2024-047 makes the same point about the remaining legacy general ledger systems: they track status of funds, cannot apply the USSGL at the transaction level, and force DoD to rely on crosswalks, adjustments, and reconciliations.'),
    h3('DoD Standard Chart of Accounts and attribute alignment'),
    list(
      'Each DoD account is a six-digit USSGL account, a period, and a four-digit DoD extension. Example: `101000.9000`. Extension `.9000` is the Treasury-level account. Other extensions are DoD posting accounts.',
      'Account classes: `100000` assets, `200000` liabilities, `300000` net position, `400000` budgetary, `500000` revenue and financing sources, `600000` expenses, `700000` gains and losses, `800000` memorandum.',
      'The SFIS Attribute Alignment file lists which SFIS attributes each account requires and which value combinations are allowed.',
      'Normal balance can differ by level. USSGL `101000` is a debit account. DoD posting account `101000.0120` for disbursements carries a credit normal balance. DDRS applies the Treasury-level normal balance.',
      'The alignment instructions state that DDRS accepts ending balances only.',
      'Components must run tie-point validations on a self-balancing trial balance and resolve exceptions before reporting.'
    ),

    h2('4. Journal vouchers'),
    p('A DDRS journal voucher adjusts a reported balance. It does not change the source accounting system. That makes journal vouchers the most tested population in the DoD financial reporting audit.'),
    table('Journal voucher categories in DoD FMR Volume 6A, Chapter 2', ['Category', 'Name', 'Typical use'], [
      ['A', 'Reversing Entries for Prior Reporting Period', 'Reverse an accrual or adjustment that was recorded for the prior period only.'],
      ['B', 'Data Call Entry', 'Record amounts gathered by data call.'],
      ['C', 'Balancing Entries for Eliminations', 'Force buyer and seller sides of intragovernmental activity to agree.'],
      ['D', 'Recognition of Undistributed Disbursements and Collections', 'Record cash activity reported by Treasury that the accounting system has not yet matched.'],
      ['E', 'Reconciliation of Trial Balance and Budget Execution Reports', 'Bring the trial balance and budget execution data into agreement using tie points.'],
      ['F', 'Supply Management Inventory', 'Adjust inventory values for supply management activities.'],
      ['G', 'Reclassification of Accounts', 'Correct USSGL account or attribute so the balance aligns with the DoD Standard Chart of Accounts and SFIS.'],
      ['H', 'Identified Errors and Reasonableness Checks', 'Correct errors found during review.'],
      ['I', 'Adjustment to Balance Reports Internally', 'Make a report balance internally.'],
      ['J', 'Other Accruals', 'Record accruals not captured by the source system.'],
      ['M', 'Data Collection Module', 'Record amounts collected in DCM.']
    ], 'The chapter has no categories K or L.'),
    table('Journal voucher approval thresholds', ['Amount (sum of absolute debit entries)', 'Approving official'], [
      ['Under $100 million', 'Branch Chief'],
      ['$100 million to $500 million', 'Supervisor of the Branch Chief'],
      ['Over $500 million to $1 billion', 'Director for Accounting or Finance'],
      ['Over $1 billion', 'Site Director, with coordination with the affected Component unless a memorandum of understanding sets a lower threshold']
    ], 'From Table 2-1 of DoD FMR Volume 6A, Chapter 2. The preparer and the approver must be different people.'),
    table('Recurring system-generated journal voucher types in DDRS-B', ['Type', 'Purpose as the name indicates'], [
      ['Army Legacy', 'Entries needed to report Army legacy system balances.'],
      ['Extended Appropriation', 'Entries for appropriations with extended availability.'],
      ['Flowback', 'Entries that return balances to a prior reporting relationship.'],
      ['Funding', 'Entries that record funding distribution.'],
      ['Pre-close Cancelling Appropriation', 'Entries that prepare cancelling appropriations for year-end close.'],
      ['Reapportionment', 'Entries that reflect reapportioned authority.'],
      ['Reversal', 'Automatic reversal of prior-period entries.'],
      ['Undistributed', 'Entries for undistributed disbursements and collections.']
    ], 'The eight type names are listed in DoD FMR Volume 6A, Chapter 2. The FMR does not publish the posting logic for each type. The purpose column restates the name and should be confirmed with DFAS.'),
    h3('Controls around journal vouchers'),
    list(
      'Every manual adjustment in DDRS-B and DDRS-AFS needs a root cause code.',
      'DFAS keeps four logs: Journal Voucher Adjustment, Feeder Trial Balance Adjustment, Pre-Closing Adjustment, and Undistributed Adjustment.',
      'DFAS may correct amounts under $1 billion without referral and must notify the Component at least monthly.',
      'DFAS reconciles at least monthly and continues until unreconciled differences fall below $1 million.',
      'DFAS reviews the quality of manual journal vouchers within 30 calendar days after statements are issued.',
      'Components review draft reports, approve or disapprove proposed adjustments by the reporting cutoff, and sign the Accounting Report (M) 1307.',
      'Quarterly integrity reviews are due within 10 workdays after first through third quarter statements are issued.'
    ),

    h2('5. Logical data model'),
    p('DFAS does not publish the DDRS database schema. The model below is a logical reconstruction from the FMR, the SFIS alignment instructions, and DoD IG reports. Use it to plan data requests and reconciliations. Do not treat the entity names as physical table names.'),
    figure('DDRS logical data model (reconstructed, not the physical schema)', logical),
    table('Logical entities and the audit question each one answers', ['Entity', 'Grain', 'Audit question'], [
      ['FEEDER_FILE', 'One file per source system, submitter, and period', 'Were all expected files received and retained? DoD IG found files kept on the server for only three months in 2010.'],
      ['FEEDER_RECORD', 'One line in a feeder file', 'Does the record count and total agree to the source system?'],
      ['CROSSWALK_RULE', 'One mapping from a legacy code to USSGL accounts', 'Is the mapping approved, versioned, and consistent with the DoD USSGL Transaction Library?'],
      ['TB_LINE', 'One balance per entity, period, TAS, account, and attribute set', 'Does the unadjusted trial balance agree to the general ledger?'],
      ['JOURNAL_VOUCHER and JV_LINE', 'One adjustment and its debit and credit lines', 'Is each adjustment supported, categorized, approved at the right level, and traceable to a root cause?'],
      ['JV_LOG', 'One log per type and period', 'Is the population of adjustments complete?'],
      ['ADJUSTED_TB_LINE', 'Unadjusted balance plus adjustments', 'Does the adjusted balance equal what was sent to Treasury and what appears on the statements?'],
      ['DATA_CALL', 'One submission per topic, entity, and period', 'Who certified the amount and where is the support?'],
      ['ELIMINATION_PAIR', 'One buyer and seller pairing by trading partner', 'Do both sides agree, and are differences explained?'],
      ['STATEMENT_LINE_MAP', 'One account-to-line rule per statement and year', 'Does the map follow the USSGL crosswalks and OMB Circular A-136?'],
      ['STATEMENT_LINE / NOTE', 'One reported amount', 'Can the amount be rebuilt from adjusted trial balance lines?']
    ]),

    h2('6. What goes out to Treasury: the GTAS bulk file'),
    p('GTAS accepts an adjusted trial balance as a fixed-width bulk file. Each record is one USSGL account balance for one TAS with its attributes. The record is 98 characters long. Treasury publishes the layout each fiscal year in the USSGL supplement to the Treasury Financial Manual.'),
    table('GTAS bulk file record layout, fiscal year 2026', ['#', 'Field', 'Start', 'Length', 'Content'], [
      ['1', 'Fiscal Year', '1', '4', 'Fiscal year of the data'],
      ['2', 'Reporting Period', '5', '2', '01 is October through 12 for September'],
      ['3', 'Allocation Transfer Agency Identifier', '7', '3', 'Agency receiving funds by allocation transfer'],
      ['4', 'Agency Identifier', '10', '3', 'Agency responsible for the TAS'],
      ['5', 'Beginning Period of Availability', '13', '4', 'First year the account may incur new obligations'],
      ['6', 'Ending Period of Availability', '17', '4', 'Last year the account may incur new obligations'],
      ['7', 'Availability Type Code', '21', '1', 'X no-year, F clearing or suspense, C default'],
      ['8', 'Main Account Code', '22', '4', 'Type and purpose of the fund'],
      ['9', 'Sub Account Code', '26', '3', '000 when there is no sub-account'],
      ['10', 'USSGL Account Number', '29', '6', 'Six-digit USSGL account'],
      ['11', 'Dollar Amount', '35', '21', 'Numeric with two implied decimals'],
      ['12', 'Debit Credit Indicator', '56', '1', 'D or C'],
      ['13', 'Begin End Indicator', '57', '1', 'B beginning, E ending'],
      ['14', 'Authority Type Code', '58', '1', 'Type of budgetary resource'],
      ['15', 'Reimbursable Flag Indicator', '59', '1', 'D direct, R reimbursable'],
      ['16', 'Apportionment Category Code', '60', '1', 'A quarterly, B other, E exempt'],
      ['17', 'Apportionment Category B Program', '61', '4', 'Program code from the SF 132'],
      ['18', 'Program Report Category Number', '65', '2', 'Program reporting category'],
      ['19', 'Federal Nonfederal Indicator', '67', '1', 'F federal, N non-federal, G General Fund, Z non-reciprocating federal, E non-federal exception'],
      ['20', 'Trading Partner Agency Identifier', '68', '3', 'Required when the indicator is F or G'],
      ['21', 'Trading Partner Main Account Code', '71', '4', 'Main account of the trading partner'],
      ['22', 'Year of Budget Authority Code', '75', '3', 'BAL or NEW'],
      ['23', 'Availability Time Indicator', '78', '1', 'A current period, S subsequent period'],
      ['24', 'BEA Category Indicator', '79', '1', 'D discretionary, M mandatory'],
      ['25', 'Borrowing Source', '80', '1', 'F Federal Financing Bank, P public, T Treasury'],
      ['26', 'Exchange or Nonexchange Indicator', '81', '1', 'X exchange, T nonexchange, E exchange without associated costs'],
      ['27', 'Custodial Noncustodial Indicator', '82', '1', 'S custodial, A non-custodial'],
      ['28', 'Budget Impact Indicator', '83', '1', 'D budgetary impact, E non-budgetary impact'],
      ['29', 'Prior Year Adjustment Code', '84', '1', 'B backdated, P not backdated, X not an adjustment'],
      ['30', 'Credit Cohort Year', '85', '4', 'Year loans were obligated or guarantees committed'],
      ['31', 'Disaster Emergency Fund Code', '89', '3', 'OMB-approved code'],
      ['32', 'Reduction Type', '92', '3', 'ATB, OTR, SEQ, or XXX'],
      ['33', 'Budget Object Class', '95', '4', 'Category of items or services purchased']
    ], 'Source: Treasury Financial Manual USSGL supplement, bulk file format for fiscal year 2026. Start positions are computed from the published field lengths.'),
    list(
      'GTAS validations are fatal. A record with an attribute combination that is not in the USSGL attribute table, or a TAS that is not in the Treasury master file, blocks the submission.',
      'GTAS edits compare the trial balance to USSGL rules and to other authoritative data, including CARS for Fund Balance with Treasury.',
      'The SF 133 is generated from the GTAS submission. OMB Circular A-136 expects the SF 133 and the Statement of Budgetary Resources to agree.',
      'The trading partner fields in positions 67 through 74 drive governmentwide intragovernmental eliminations.'
    ),

    h2('7. Tie points and reconciliations'),
    table('Reconciliations that surround DDRS', ['Reconciliation', 'Compares', 'Frequency', 'Where it is defined'], [
      ['Feeder to general ledger', 'Disbursing, obligation, funding, and entitlement systems to the general ledger', 'Monthly', 'DoD FMR Volume 1, Chapter 10, using Advana audit workbooks'],
      ['General ledger to unadjusted trial balance', 'General ledger system to the trial balance it submits', 'Quarterly', 'DoD FMR Volume 1, Chapter 10, using Advana audit workbooks'],
      ['Tie points', 'Budgetary accounts to proprietary accounts within one trial balance', 'Every submission', 'DoD FMR Volume 1, Chapter 7. Tie points are revised each year on the SFIS page.'],
      ['Trial balance to budget execution', 'Trial balance to budget execution data', 'Monthly', 'DoD FMR Volume 6A, Chapter 2, journal voucher category E'],
      ['Fund Balance with Treasury', 'USSGL 1010 by TAS to Treasury CARS', 'Monthly', 'Treasury Financial Manual and DoD FMR'],
      ['SF 133 to Statement of Budgetary Resources', 'Budget execution report to the audited statement', 'Quarterly and year end', 'OMB Circular A-136'],
      ['Intragovernmental', 'Buyer balances to seller balances by trading partner', 'Quarterly', 'Treasury Financial Manual intragovernmental guidance']
    ]),

    h2('8. Audit history and current condition'),
    table('Public findings about DDRS', ['Report', 'Date', 'Finding'], [
      ['DODIG-2012-096', 'May 2012', 'DDRS-B was not effectively implemented for the Army General Fund. In one month, 256,359 automated adjustments totaling $713.9 billion were made from a desktop tool with no supporting error report. 78 of 117 journal vouchers, worth $26.2 billion, were unsupported. Feeder files were not retained.'],
      ['DODIG-2024-047', 'January 2024', 'DoD relies on at least 405 systems and micro-applications outside its general ledger systems and more than 2,000 interfaces. Legacy general ledger systems cannot apply the USSGL at the transaction level.'],
      ['DODIG-2026-013', 'November 2025', 'In the first quarter of fiscal year 2025, DDRS still carried and adjusted balances from 10 retired systems and 57 obsolete files, $4.2 trillion net. Over 490,000 adjustments touched those balances. A further 2.2 million adjustments did not identify the system or file they affected. An archiving change requested in 2017 is now targeted for September 30, 2027.']
    ], 'The DODIG-2026-013 figures are carried from the research paper appendix on this site, Section 3.13.'),
    callout('What this means for the fiscal year 2028 audit goal', 'Three conditions decide whether a DDRS balance is auditable. The unadjusted balance must tie to a general ledger that posts at the transaction level. Every adjustment must have a category, a root cause, support, and the right approval. The adjusted balance must equal what went to GTAS and what the statements show. Each legacy feeder that is retired, and each recurring journal voucher that is replaced by a source-system fix, removes a point where those conditions fail.'),

    h2('9. Data requests that work'),
    steps(
      'Ask for the feeder file inventory control report for the period. It lists every file received, by source system.',
      'Ask for the unadjusted trial balance by entity, TAS, DoD SCOA account, and attributes, and tie it to the source general ledger.',
      'Ask for all four adjustment logs with category, root cause code, preparer, approver, amount, and system-generated flag.',
      'Ask for the adjusted trial balance and recompute it from the unadjusted balance plus the logged adjustments.',
      'Ask for the GTAS bulk file as submitted and compare it to the adjusted trial balance at the six-digit USSGL level.',
      'Ask for the statement crosswalk version used, and rebuild one statement line from the adjusted trial balance.'
    )
  ],
  sources: [
    { name: 'DoD FMR Volume 6A, Chapter 2: Financial Reports Roles and Responsibilities', url: 'https://comptroller.war.gov/Portals/45/documents/fmr/current/06a/06a_02.pdf' },
    { name: 'DoD FMR Volume 1, Chapter 4: Standard Financial Information Structure', url: 'https://comptroller.defense.gov/Portals/45/documents/fmr/current/01/01_04.pdf' },
    { name: 'DoD FMR Volume 1, Chapter 7: DoD Standard Chart of Accounts', url: 'https://comptroller.defense.gov/Portals/45/documents/fmr/current/01/01_07.pdf' },
    { name: 'DoD COA SFIS Attribute Alignment Instructions', url: 'https://comptroller.defense.gov/Portals/45/Documents/ODCFO/SFIS/DoD_COA_SFIS_10.0_MRAA_Instructions.pdf' },
    { name: 'DODIG-2012-096: DDRS-Budgetary Was Not Effectively Implemented for the Army General Fund', url: 'https://media.defense.gov/2012/May/31/2001712372/-1/-1/1/DODIG-2012-096.pdf' },
    { name: 'DODIG-2024-047: DoD Plans to Address Longstanding Issues with Outdated Financial Management Systems', url: 'https://media.defense.gov/2024/Jan/23/2003380087/-1/-1/1/DODIG-2024-047%20SECURE.PDF' },
    { name: 'DODIG-2026-013: Data Remaining After the Retirement of DoD Financial Management Systems', url: 'https://media.defense.gov/2025/Nov/20/2003827135/-1/-1/1/DODIG-2026-013_REDACTED%20V2%20SECURE.PDF' },
    { name: 'DCMA Manual 4301-05, Volume 8: Financial Systems and Interfaces', url: 'https://www.dcma.mil/Portals/31/Documents/Policy/DCMA_MAN_4301-05_VOL8.pdf' },
    { name: 'Treasury: GTAS bulk file format, fiscal year 2026', url: 'https://fiscal.treasury.gov/system/files/2026-04/bulk-file-format-b.pdf' },
    { name: 'Treasury: USSGL attribute table, fiscal year 2026', url: 'https://fiscal.treasury.gov/system/files/2026-04/p1sec4-attribtable-2026.pdf' },
    { name: 'Treasury: GTAS validations summary, fiscal year 2026', url: 'https://tfx.treasury.gov/system/files/2026-01/p1sec7-validationssum-2026.pdf' }
  ]
};
