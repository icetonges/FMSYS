import {
  layers as gfebsLayers,
  lineageScenarios as gfebsLineageScenarios,
  nodes as gfebsNodes,
  supportServices as gfebsSupportServices
} from './architecture';

const navyLayers = [
  { id: 'source', label: 'Source / Peer / Interface Systems', short: 'Source', description: 'Operational, feeder, peer ERP, and interface systems where Navy business events originate before accounting lineage is established.' },
  { id: 'capabilities', label: 'Navy ERP Core Business Capabilities', short: 'Core', description: 'SAP-based Navy ERP capabilities that validate, control, and transform financial and supply-chain activity.' },
  { id: 'transactions', label: 'Detailed Transaction Objects', short: 'Detail', description: 'Document-level objects and subsidiary detail that preserve the Universe of Transactions before GL summarization.' },
  { id: 'accounting', label: 'Accounting Layer', short: 'Accounting', description: 'Budgetary, proprietary, and GL journal postings using USSGL / DoD SCOA logic.' },
  { id: 'reporting', label: 'Reporting Layer', short: 'Reporting', description: 'Operational reporting, DDRS, GTAS, crosswalks, and external financial reporting outputs.' },
  { id: 'statements', label: 'DON / DoD Financial Statements', short: 'Statements', description: 'Department of the Navy and DoD statement outputs supported by trial balances, crosswalks, notes, and audit evidence.' }
];

const navyNodes = [
  {
    id: 'dts',
    layer: 'source',
    title: 'DTS',
    subtitle: 'Defense Travel System',
    icon: 'DTS',
    tags: ['travel', 'feeder', 'authorization', 'voucher'],
    summary: 'Creates travel authorizations, vouchers, advances, local vouchers, and travel-card settlement activity that must trace to obligation, expense, and outlay records.',
    examples: ['Travel authorization', 'Travel voucher', 'Local voucher', 'GTCC split disbursement'],
    auditQuestions: ['Does every approved travel event have a valid LOA?', 'Did approved vouchers post or settle in the accounting environment?', 'Are stale travel obligations still supportable?'],
    keyFields: ['authorization number', 'voucher number', 'traveler ID', 'LOA', 'approval date', 'trip dates', 'amount'],
    risks: ['Approved travel not obligated', 'Voucher paid but obligation not liquidated', 'Manual adjustment breaks lineage']
  },
  {
    id: 'wawf',
    layer: 'source',
    title: 'WAWF / PIEE',
    subtitle: 'Invoice, receipt, acceptance',
    icon: 'P2P',
    tags: ['invoice', 'receipt', 'acceptance', 'procure-to-pay'],
    summary: 'Captures vendor invoice, receiving, acceptance, and payment-support evidence for Navy procure-to-pay activity.',
    examples: ['Vendor invoice', 'Receiving report', 'Acceptance document', 'Combo document'],
    auditQuestions: ['Does every paid invoice have receipt and acceptance evidence?', 'Do invoice quantities and prices agree to PO and receipt?', 'Are rejected interface records resolved?'],
    keyFields: ['contract number', 'CLIN', 'invoice number', 'receiving report number', 'vendor CAGE/UEI', 'acceptance date'],
    risks: ['Unsupported payments', 'Timing mismatches', 'Failed interface or IDoc records']
  },
  {
    id: 'sps',
    layer: 'source',
    title: 'SPS / PD2 / EDA',
    subtitle: 'Awards and modifications',
    icon: 'CTR',
    tags: ['contract', 'award', 'obligation', 'procurement'],
    summary: 'Maintains contract award and modification data that should reconcile to obligations, purchasing documents, and later payment activity.',
    examples: ['Award', 'Modification', 'Funding citation', 'CLIN/SLIN structure'],
    auditQuestions: ['Does each award modification reconcile to obligation changes?', 'Are funding lines complete and valid?', 'Can award lines trace to P2P documents?'],
    keyFields: ['PIID', 'mod number', 'CLIN', 'SLIN', 'funding line', 'amount', 'award date'],
    risks: ['Award not obligated', 'Modification not reflected in ERP', 'Line detail lost in summary posting']
  },
  {
    id: 'dcps',
    layer: 'source',
    title: 'DCPS / HR / Personnel',
    subtitle: 'Labor and personnel pay sources',
    icon: 'LAB',
    tags: ['payroll', 'labor', 'personnel', 'timekeeping'],
    summary: 'Provides payroll, labor, timekeeping, personnel, benefits, and entitlement activity for cost capture and accounting.',
    examples: ['Civilian payroll', 'Labor hours', 'Benefits', 'Withholdings', 'Timekeeping extract'],
    auditQuestions: ['Do labor costs trace to a valid source population?', 'Are costs assigned to the right organization and cost object?', 'Are accruals complete at period end?'],
    keyFields: ['person identifier', 'pay period', 'organization', 'funding line', 'gross pay', 'labor hours', 'benefits'],
    risks: ['Invalid labor population', 'Incorrect cost object mapping', 'Missing payroll accrual']
  },
  {
    id: 'fleet-logistics',
    layer: 'source',
    title: 'R-Supply / SMMM / NALCOMIS',
    subtitle: 'Fleet, maintenance, and logistics sources',
    icon: 'LOG',
    tags: ['fleet', 'logistics', 'maintenance', 'inventory', 'supply'],
    summary: 'Maintains fleet supply, shipboard maintenance, aviation maintenance, inventory, and operational events that can drive accounting or valuation impacts.',
    examples: ['Supply issue', 'Inventory movement', 'Maintenance event', 'Shipboard logistics record', 'Aviation maintenance record'],
    auditQuestions: ['Do logistics events with financial impact trace to accounting?', 'Are inventory and maintenance populations reconciled?', 'Are interface control totals monitored?'],
    keyFields: ['material number', 'document number', 'unit or command', 'quantity', 'valuation', 'work order', 'interface batch'],
    risks: ['Inventory valuation gap', 'Operational event not reflected financially', 'Interface control failure']
  },
  {
    id: 'ginvoicing',
    layer: 'source',
    title: 'One-Touch / G-Invoicing / IPAC',
    subtitle: 'Intragovernmental activity',
    icon: 'IGT',
    tags: ['reimbursable', 'trading partner', 'intragovernmental', 'IPAC'],
    summary: 'Supports intragovernmental agreements, orders, billing, settlement, and trading-partner reconciliation.',
    examples: ['General terms and conditions', 'Orders', 'Performance', 'IPAC settlement', 'One-Touch record'],
    auditQuestions: ['Do buyer and seller records agree?', 'Are eliminations supported by trading partner attributes?', 'Are IPAC settlements properly applied?'],
    keyFields: ['agreement number', 'order number', 'trading partner', 'BETC', 'TAS', 'amount'],
    risks: ['Trading partner mismatch', 'Elimination failure', 'Unbilled or uncollected reimbursable activity']
  },
  {
    id: 'financials',
    layer: 'capabilities',
    title: 'Financials',
    subtitle: 'FI / GL / AP / AR',
    icon: 'FI',
    tags: ['financials', 'general ledger', 'AP', 'AR', 'close'],
    summary: 'Maintains financial accounting activity, including GL, AP, AR, cash accounting close, and financial-reporting support.',
    examples: ['GL posting', 'Vendor invoice', 'Customer invoice', 'Payment clearing', 'Financial close'],
    auditQuestions: ['Does each GL posting have source support?', 'Do AP and AR subsidiary ledgers reconcile to GL control accounts?'],
    keyFields: ['company code', 'document number', 'fiscal year', 'line item', 'GL account', 'document type', 'posting key'],
    sapTables: ['BKPF', 'BSEG', 'FAGLFLEXA/FAGLFLEXT', 'BSIK/BSAK', 'BSID/BSAD', 'LFA1', 'KNA1'],
    tcodes: ['FB03', 'FBL1N', 'FBL3N', 'FBL5N', 'FB60', 'FB50'],
    risks: ['Unsupported journal vouchers', 'Control-account reconciliation failures', 'Misclassification']
  },
  {
    id: 'budget',
    layer: 'capabilities',
    title: 'Budget / Funds Management',
    subtitle: 'Budgetary execution and funds control',
    icon: 'FM',
    tags: ['budget', 'funds control', 'SBR', 'commitment', 'obligation'],
    summary: 'Controls budget authority, allotments, commitments, obligations, expenditures, and outlays.',
    examples: ['Budget authority', 'Allotment', 'Commitment', 'Obligation', 'Expenditure', 'Outlay'],
    auditQuestions: ['Can budgetary resources be traced from authority to outlay?', 'Are commitments and obligations valid, timely, and supported?'],
    keyFields: ['fund', 'fund center', 'functional area', 'commitment item', 'funded program', 'FM document'],
    sapTables: ['FMIFIIT', 'FMIOI', 'FMFCTR', 'FMBH/FMBL', 'FMDERIVE configuration examples'],
    tcodes: ['FMZ1', 'FMZ2', 'FMZ3', 'FMAVCR01'],
    risks: ['Over-obligation', 'Stale commitments', 'Invalid LOA', 'Unliquidated obligations']
  },
  {
    id: 'p2p',
    layer: 'capabilities',
    title: 'Procure-to-Pay',
    subtitle: 'MM / P2P',
    icon: 'MM',
    tags: ['procure-to-pay', 'PR', 'PO', 'receipt', 'invoice'],
    summary: 'Manages purchase requisitions, purchase orders, goods receipts, service entries, invoices, three-way match, and payments.',
    examples: ['Purchase requisition', 'Purchase order', 'Goods receipt', 'Service entry sheet', 'Vendor invoice', 'Three-way match'],
    auditQuestions: ['Does every payment trace to PO, receipt or acceptance, and invoice?', 'Do obligations agree to contract awards and modifications?'],
    keyFields: ['PR number', 'PO number', 'PO line', 'contract number', 'goods receipt', 'invoice number', 'vendor'],
    sapTables: ['EBAN', 'EKKO', 'EKPO', 'EKBE', 'MKPF', 'MSEG', 'RBKP', 'RSEG'],
    tcodes: ['ME51N', 'ME23N', 'MIGO', 'MIRO'],
    risks: ['Payment without receipt', 'Obligation mismatch', 'Duplicate invoice', 'Unmatched interface record']
  },
  {
    id: 'supply-chain',
    layer: 'capabilities',
    title: 'Supply Chain / Inventory',
    subtitle: 'Material management and valuation',
    icon: 'INV',
    tags: ['supply chain', 'inventory', 'material', 'valuation'],
    summary: 'Maintains material master, stock, movement, warehouse, and valuation activity that supports inventory and cost reporting.',
    examples: ['Material movement', 'Goods issue', 'Goods receipt', 'Inventory adjustment', 'Valuation change'],
    auditQuestions: ['Do quantities and valuation reconcile to financial inventory balances?', 'Are movements supported by approved logistics events?'],
    keyFields: ['material', 'plant', 'storage location', 'movement type', 'quantity', 'valuation amount'],
    sapTables: ['MARA', 'MARC', 'MARD', 'MBEW', 'MSEG'],
    risks: ['Quantity/value mismatch', 'Unapproved movement', 'Inventory completeness gap']
  },
  {
    id: 'ppe',
    layer: 'capabilities',
    title: 'PP&E / Asset Management',
    subtitle: 'Asset accounting and evidence support',
    icon: 'AA',
    tags: ['asset', 'PPE', 'depreciation', 'capitalization'],
    summary: 'Manages asset master data, acquisitions, depreciation, transfers, retirements, disposals, and support for PP&E reporting.',
    examples: ['Asset acquisition', 'Asset transfer', 'Depreciation', 'Retirement', 'Real or personal property record'],
    auditQuestions: ['Do assets exist and are they complete?', 'Are acquisitions and retirements reflected in the asset subsidiary ledger and GL?'],
    keyFields: ['asset number', 'subnumber', 'serial/location', 'acquisition value', 'useful life', 'fund', 'cost center'],
    sapTables: ['ANLA', 'ANLB', 'ANEK', 'ANEP'],
    tcodes: ['AS01', 'AS02', 'AS03', 'AW01N', 'AFAB'],
    risks: ['Asset existence gaps', 'Wrong capitalization', 'Depreciation errors', 'Disposal not recorded']
  },
  {
    id: 'revenue',
    layer: 'capabilities',
    title: 'Reimbursables / Revenue',
    subtitle: 'AR, billing, collections',
    icon: 'REV',
    tags: ['reimbursable', 'revenue', 'AR', 'collections', 'trading partner'],
    summary: 'Manages customer orders, reimbursable authority, billings, collections, accounts receivable, debt, and intragovernmental activity.',
    examples: ['Customer order', 'Reimbursable agreement', 'Billing', 'Collection', 'Write-off', 'Debt management'],
    auditQuestions: ['Are reimbursable orders valid and billable?', 'Do collections properly liquidate AR and reimbursable activity?'],
    keyFields: ['customer order', 'trading partner', 'agreement', 'AR document', 'billing document', 'collection', 'fund'],
    risks: ['Unbilled reimbursables', 'Trading partner mismatch', 'Aged receivables', 'Collections not applied']
  },
  {
    id: 'labor-cost',
    layer: 'capabilities',
    title: 'Labor / Timekeeping / Cost Capture',
    subtitle: 'Labor costing and assignment',
    icon: 'CO',
    tags: ['labor', 'timekeeping', 'cost', 'cost center'],
    summary: 'Captures labor hours and payroll-related costs for assignment to cost centers, programs, WBS elements, internal orders, and reporting objects.',
    examples: ['Labor hour feed', 'Payroll cost assignment', 'Benefits allocation', 'Cost center actuals'],
    auditQuestions: ['Are labor costs tied to valid source records?', 'Are costs assigned to the right program and organization?', 'Do allocations have documented basis?'],
    keyFields: ['employee/person identifier', 'pay period', 'labor hours', 'cost center', 'WBS', 'internal order', 'amount'],
    sapTables: ['CSKS/CSKT', 'COBK', 'COEP', 'AUFK', 'PRPS/PROJ'],
    risks: ['Misstated program cost', 'Invalid labor population', 'Unsupported allocation']
  },
  {
    id: 'reporting-analytics-core',
    layer: 'capabilities',
    title: 'Reporting / Analytics',
    subtitle: 'ERP reports and audit extracts',
    icon: 'BI',
    tags: ['reporting', 'analytics', 'extract', 'dashboard'],
    summary: 'Provides standard reports, ad hoc queries, dashboards, audit populations, and management analytics sourced from ERP and reporting stores.',
    examples: ['Standard report', 'Ad hoc query', 'Dashboard', 'Audit analytics extract'],
    auditQuestions: ['Are report definitions tied to authoritative source tables?', 'Are filters and prompts documented?', 'Do extracts reconcile to control totals?'],
    keyFields: ['report ID', 'extract date', 'selection criteria', 'source table/view', 'reconciliation total'],
    risks: ['Undocumented report logic', 'Extract not tied to source', 'Wrong population']
  },
  {
    id: 'budget-detail',
    layer: 'transactions',
    title: 'Budgetary Detail',
    subtitle: 'FM documents and budgetary activity',
    icon: 'BD',
    tags: ['budgetary', 'commitment', 'obligation', 'FM'],
    summary: 'Detailed FM activity explaining how budget authority becomes commitments, obligations, expenditures, and outlays.',
    examples: ['FM document', 'Funds commitment', 'Commitment', 'Obligation', 'Expenditure/outlay detail'],
    auditQuestions: ['Can each SBR line be traced to valid budgetary documents?', 'Are open obligations still valid?'],
    keyFields: ['FM document', 'fund', 'fund center', 'commitment item', 'functional area', 'amount', 'status'],
    risks: ['Stale ULO', 'Invalid budgetary status', 'Document chain broken']
  },
  {
    id: 'ap-detail',
    layer: 'transactions',
    title: 'AP / P2P Detail',
    subtitle: 'Invoice, receipt, and payment detail',
    icon: 'AP',
    tags: ['AP', 'P2P', 'vendor', 'invoice', 'payment'],
    summary: 'Vendor-level detail explaining invoices, payables, withholdings, accruals, receipt evidence, and payment clearing.',
    examples: ['Vendor invoice', 'AP open item', 'Payment clearing', 'Withholding', 'Accrual'],
    auditQuestions: ['Does AP reconcile to GL control accounts?', 'Are invoices supported by PO, receipt, and acceptance?'],
    keyFields: ['vendor', 'invoice number', 'FI document', 'payment document', 'PO', 'receipt', 'due date'],
    risks: ['Duplicate invoices', 'Unmatched AP', 'Unsupported accrual']
  },
  {
    id: 'ar-detail',
    layer: 'transactions',
    title: 'AR / Reimbursable Detail',
    subtitle: 'Customer invoice, collections, write-offs',
    icon: 'AR',
    tags: ['AR', 'customer', 'collection', 'reimbursable'],
    summary: 'Customer-level detail explaining reimbursable billing, receivables, collections, adjustments, and write-offs.',
    examples: ['Customer invoice', 'Open AR item', 'Collection', 'Adjustment', 'Write-off'],
    auditQuestions: ['Does AR reconcile to GL?', 'Are collections applied to valid receivables?'],
    keyFields: ['customer', 'invoice', 'collection document', 'aging bucket', 'trading partner', 'fund'],
    risks: ['Aged debt', 'Incorrect write-off', 'Unapplied collection']
  },
  {
    id: 'asset-detail',
    layer: 'transactions',
    title: 'Asset Detail',
    subtitle: 'Asset acquisition to retirement',
    icon: 'AS',
    tags: ['asset', 'PPE', 'depreciation'],
    summary: 'Asset-level record showing acquisition, capitalization, depreciation, transfers, retirements, location, and support attributes.',
    examples: ['Asset acquisition', 'Capitalization', 'Depreciation', 'Transfer', 'Retirement'],
    auditQuestions: ['Can asset balances be supported by asset records and existence evidence?', 'Do capital events post correctly to GL?'],
    keyFields: ['asset number', 'subnumber', 'acquisition date', 'cost center', 'location', 'useful life', 'depreciation area'],
    risks: ['Incomplete asset population', 'Unrecorded retirement', 'Wrong useful life']
  },
  {
    id: 'inventory-detail',
    layer: 'transactions',
    title: 'Inventory / Material Detail',
    subtitle: 'Material movement and valuation',
    icon: 'MT',
    tags: ['material', 'inventory', 'valuation'],
    summary: 'Material and inventory movement detail showing quantities, valuation, warehouses, stock status, and source logistics references.',
    examples: ['Material movement', 'Goods issue', 'Goods receipt', 'Inventory count', 'Valuation change'],
    auditQuestions: ['Do quantities and valuation reconcile to financial balances?', 'Are movements supported by approved logistics events?'],
    keyFields: ['material number', 'plant', 'storage location', 'movement type', 'quantity', 'valuation amount'],
    risks: ['Quantity/value mismatch', 'Unapproved movement', 'Inventory completeness gap']
  },
  {
    id: 'cost-object-detail',
    layer: 'transactions',
    title: 'Cost Object Detail',
    subtitle: 'Cost center, internal order, WBS',
    icon: 'CD',
    tags: ['CO', 'cost', 'WBS', 'internal order'],
    summary: 'Cost-object detail showing how costs are assigned, accumulated, allocated, and reported for management and net-cost reporting.',
    examples: ['Cost center actuals', 'Internal order actuals', 'WBS actuals', 'Allocation cycle'],
    auditQuestions: ['Does cost assignment support the Statement of Net Cost?', 'Are allocation bases reasonable and documented?'],
    keyFields: ['cost center', 'internal order', 'WBS', 'cost element', 'allocation cycle', 'amount'],
    risks: ['Incorrect program cost', 'Unsupported allocation', 'Wrong receiving object']
  },
  {
    id: 'interface-control-detail',
    layer: 'transactions',
    title: 'Interface Control Detail',
    subtitle: 'IDoc, API, batch, reconciliation logs',
    icon: 'IF',
    tags: ['interface', 'IDoc', 'control total', 'reconciliation'],
    summary: 'Interface-level detail used to prove completeness and accuracy between source systems, peer systems, and Navy ERP posting objects.',
    examples: ['IDoc control', 'Batch run log', 'API message', 'Error queue', 'Source-to-target reconciliation'],
    auditQuestions: ['Were all source records accepted or resolved?', 'Do batch totals reconcile from source to target?', 'Are error records aged and remediated?'],
    keyFields: ['interface ID', 'batch ID', 'source record key', 'message status', 'control total', 'error code', 'processed date'],
    sapTables: ['EDIDC', 'EDID4', 'EDIDS'],
    tcodes: ['WE02', 'WE09', 'BD87'],
    risks: ['Incomplete interface population', 'Aged rejects', 'Manual bypass of control totals']
  },
  {
    id: 'budgetary-accounting',
    layer: 'accounting',
    title: 'Budgetary Accounting',
    subtitle: 'USSGL 400000 series',
    icon: 'BA',
    tags: ['SBR', 'budgetary', 'USSGL', 'obligation'],
    summary: 'Records budgetary resources, status of resources, obligations, expenditures, and outlays that support the Statement of Budgetary Resources.',
    examples: ['Budget authority', 'Allotments', 'Commitments', 'Obligations', 'Outlays'],
    auditQuestions: ['Does every SBR amount trace to valid budgetary USSGL and SFIS attributes?', 'Are obligations complete and valid?'],
    keyFields: ['USSGL 4xxxxx', 'fund', 'TAS', 'budget object class', 'program', 'amount', 'period'],
    risks: ['SBR misstatement', 'Invalid status of resources', 'Unreconciled obligations']
  },
  {
    id: 'proprietary-accounting',
    layer: 'accounting',
    title: 'Proprietary Accounting',
    subtitle: 'USSGL assets, liabilities, expenses, revenue',
    icon: 'PA',
    tags: ['balance sheet', 'net cost', 'proprietary', 'USSGL'],
    summary: 'Records assets, liabilities, net position, revenues, financing sources, expenses, gains, and losses.',
    examples: ['Assets', 'Liabilities', 'Net position', 'Expense', 'Revenue', 'Gains/losses'],
    auditQuestions: ['Do proprietary balances reconcile to subsidiary ledgers?', 'Are expenses and assets classified correctly?'],
    keyFields: ['USSGL', 'account extension', 'fund', 'cost object', 'trading partner', 'amount'],
    risks: ['Balance sheet unsupported', 'Net cost misclassified', 'FBwT/AP/AR reconciliation gaps']
  },
  {
    id: 'gl',
    layer: 'accounting',
    title: 'GL Journal Line',
    subtitle: 'Accounting document header and line items',
    icon: 'GL',
    tags: ['GL', 'journal', 'BKPF', 'BSEG', 'USSGL'],
    summary: 'Official journal lines where validated budgetary and proprietary entries land for trial balance and reporting.',
    examples: ['GL document header', 'GL line item', 'Journal voucher', 'Adjusting entry', 'Posting period'],
    auditQuestions: ['Does every GL posting have source support?', 'Can GL lines trace forward to financial statement lines?'],
    keyFields: ['document number', 'line item', 'fiscal year', 'posting date', 'document type', 'USSGL', 'debit/credit', 'amount'],
    sapTables: ['BKPF', 'BSEG', 'FAGLFLEXA/FAGLFLEXT', 'SKA1', 'SKB1', 'T001'],
    tcodes: ['FB03', 'FBL3N', 'FB50'],
    risks: ['Unsupported JV', 'Summary posting breaks lineage', 'Incorrect USSGL mapping']
  },
  {
    id: 'ops-reporting',
    layer: 'reporting',
    title: 'Operational Reporting',
    subtitle: 'ERP reporting and analytics',
    icon: 'OR',
    tags: ['reporting', 'analytics', 'dashboard', 'extract'],
    summary: 'Provides standard reports, ad hoc queries, dashboards, data mining, and management analytics.',
    examples: ['Standard report', 'Ad hoc query', 'Dashboard', 'Audit analytics extract'],
    auditQuestions: ['Are report definitions reconciled to authoritative source tables?', 'Are report filters and prompts documented?'],
    keyFields: ['report ID', 'extract date', 'selection criteria', 'source table/view', 'reconciliation total'],
    risks: ['Report logic undocumented', 'Data extract not tied to source', 'Wrong population']
  },
  {
    id: 'ddrs',
    layer: 'reporting',
    title: 'DDRS',
    subtitle: 'Defense Departmental Reporting System',
    icon: 'DDRS',
    tags: ['DDRS', 'trial balance', 'financial reporting'],
    summary: 'Receives trial-balance data and supports standardized edits, validation, adjustments, and reporting packages.',
    examples: ['Trial balance', 'Validation edits', 'Adjustments', 'Financial reporting package'],
    auditQuestions: ['Does the DDRS trial balance reconcile to ERP?', 'Are adjustments documented and approved?'],
    keyFields: ['USSGL', 'fund/TAS', 'attribute', 'ending balance', 'adjustment ID', 'reporting period'],
    risks: ['Trial balance reconciliation gap', 'Unsupported reporting adjustment', 'Attribute error']
  },
  {
    id: 'gtas',
    layer: 'reporting',
    title: 'GTAS',
    subtitle: 'Adjusted trial balance / Treasury reporting',
    icon: 'GTAS',
    tags: ['GTAS', 'Treasury', 'adjusted trial balance'],
    summary: 'External Treasury reporting layer for adjusted trial balance, validations, eliminations, reclassifications, and audit adjustments.',
    examples: ['GTAS ATB', 'Validation edit', 'Elimination', 'Reclassification', 'Audit adjustment'],
    auditQuestions: ['Do GTAS attributes align to USSGL and SFIS?', 'Are eliminations and reclassifications explainable?'],
    keyFields: ['USSGL', 'TAS', 'trading partner', 'BETC', 'attribute', 'amount', 'edit status'],
    risks: ['GTAS edit failure', 'Intragovernmental mismatch', 'Unsupported elimination']
  },
  {
    id: 'external-reporting',
    layer: 'reporting',
    title: 'External Reporting',
    subtitle: 'OMB A-136 / USSGL crosswalks',
    icon: 'EXT',
    tags: ['crosswalk', 'OMB', 'Treasury', 'financial statement'],
    summary: 'Maps USSGL accounts and attributes to financial statement line items, notes, and statutory reports.',
    examples: ['USSGL crosswalk', 'Financial statement note', 'Congressional/statutory report'],
    auditQuestions: ['Is the crosswalk logic documented and current?', 'Do statement lines reconcile to the adjusted trial balance?'],
    keyFields: ['statement line', 'USSGL', 'attribute', 'crosswalk rule', 'source balance'],
    risks: ['Wrong statement mapping', 'Incomplete note support', 'Crosswalk not updated']
  },
  {
    id: 'balance-sheet',
    layer: 'statements',
    title: 'Balance Sheet',
    subtitle: 'Statement of financial position',
    icon: 'BS',
    tags: ['balance sheet', 'assets', 'liabilities', 'net position'],
    summary: 'Reports assets, liabilities, and net position.',
    examples: ['Fund Balance with Treasury', 'Accounts receivable', 'Inventory', 'PP&E', 'Accounts payable', 'Net position'],
    auditQuestions: ['Are asset and liability populations complete, valued, and supported?', 'Do subsidiary ledgers reconcile to GL?'],
    keyFields: ['USSGL 100000', 'USSGL 200000', 'USSGL 300000', 'TAS', 'fund', 'entity'],
    risks: ['Unsupported FBwT', 'Unreconciled AP/AR', 'PP&E existence and completeness gaps']
  },
  {
    id: 'net-cost',
    layer: 'statements',
    title: 'Statement of Net Cost',
    subtitle: 'Program cost and earned revenue',
    icon: 'SNC',
    tags: ['net cost', 'expense', 'revenue'],
    summary: 'Reports gross program cost, earned revenue, gains/losses, and net cost of operations.',
    examples: ['Program expenses', 'Depreciation', 'Payroll costs', 'Earned revenue', 'Net cost'],
    auditQuestions: ['Are costs assigned to the correct program or object?', 'Are revenues matched to earned activity?'],
    keyFields: ['USSGL 500000', 'USSGL 600000', 'USSGL 700000', 'program', 'cost object'],
    risks: ['Misstated program cost', 'Unsupported allocation', 'Revenue/cost mismatch']
  },
  {
    id: 'net-position',
    layer: 'statements',
    title: 'Statement of Changes in Net Position',
    subtitle: 'Financing sources and net cost bridge',
    icon: 'SCNP',
    tags: ['net position', 'financing sources', 'appropriations'],
    summary: 'Explains movement from beginning net position to ending net position using financing sources, transfers, and net cost.',
    examples: ['Appropriations used', 'Financing sources', 'Net cost', 'Transfers', 'Adjustments'],
    auditQuestions: ['Do financing sources and net cost reconcile across statements?', 'Are transfers and corrections documented?'],
    keyFields: ['USSGL 300000', 'USSGL 500000', 'net cost', 'adjustments'],
    risks: ['SCNP does not tie to BS/SNC', 'Unsupported prior-period correction', 'Misclassified financing source']
  },
  {
    id: 'sbr',
    layer: 'statements',
    title: 'Statement of Budgetary Resources',
    subtitle: 'Budgetary resources, obligations, outlays',
    icon: 'SBR',
    tags: ['SBR', 'budgetary resources', 'obligations', 'outlays'],
    summary: 'Reports budgetary resources, status of resources, obligations incurred, and net outlays.',
    examples: ['Budgetary resources', 'Status of resources', 'Obligations incurred', 'Outlays net'],
    auditQuestions: ['Can authority, allotment, obligation, and outlay activity be traced end-to-end?', 'Are open obligations valid?'],
    keyFields: ['USSGL 400000', 'TAS', 'fund', 'budgetary resource attribute', 'outlay amount'],
    risks: ['Invalid obligations', 'Unliquidated obligation problems', 'SBR-to-Treasury differences']
  },
  {
    id: 'notes',
    layer: 'statements',
    title: 'Notes to Financial Statements',
    subtitle: 'Disclosures and supplementary information',
    icon: 'NOTES',
    tags: ['notes', 'disclosure', 'RSI'],
    summary: 'Provides required disclosures, note schedules, reconciliations, and supplementary information supporting the statements.',
    examples: ['FBwT note', 'PP&E note', 'Intragovernmental note', 'Reconciliation of net cost to net outlays'],
    auditQuestions: ['Do notes tie to the ATB and subsidiary schedules?', 'Are disclosures complete and supported?'],
    keyFields: ['note line', 'schedule', 'source amount', 'reconciliation', 'disclosure owner'],
    risks: ['Note does not tie', 'Unsupported disclosure', 'Incomplete supplementary information']
  }
];

const navyLineageScenarios = [
  {
    id: 'p2p',
    title: 'Contract Award -> Receipt -> Invoice -> Payment',
    short: 'Procure-to-Pay',
    description: 'Shows how a Navy procurement event moves from award data and WAWF evidence through Navy ERP P2P, AP, GL, reporting, and statements.',
    path: ['sps', 'wawf', 'p2p', 'ap-detail', 'gl', 'ddrs', 'gtas', 'balance-sheet', 'net-cost', 'sbr'],
    steps: [
      'Requirement and funding produce a contract award or modification.',
      'Navy ERP creates purchasing and budgetary records and controls funds.',
      'WAWF/PIEE provides receiving, acceptance, and invoice evidence.',
      'AP and payment clearing post to GL and trial balance reporting.',
      'Statement lines rely on supported AP, expense, asset, outlay, and SBR populations.'
    ],
    exceptionTests: ['award without obligation', 'invoice without receipt or acceptance', 'payment without AP support', 'PO amount mismatch', 'duplicate invoice']
  },
  {
    id: 'inventory',
    title: 'Fleet Logistics Event -> Inventory Valuation -> Statement Support',
    short: 'Inventory',
    description: 'Shows how fleet, maintenance, or supply events can drive material movement, valuation, GL, and inventory reporting.',
    path: ['fleet-logistics', 'supply-chain', 'inventory-detail', 'proprietary-accounting', 'gl', 'ddrs', 'gtas', 'balance-sheet', 'notes'],
    steps: [
      'Operational logistics source records a supply, maintenance, or inventory event.',
      'Interface controls establish accepted, rejected, and reconciled populations.',
      'Navy ERP material movement and valuation detail updates inventory records.',
      'GL and trial-balance reporting carry balances to financial statements.',
      'Notes and audit schedules support existence, completeness, and valuation assertions.'
    ],
    exceptionTests: ['source movement missing from ERP', 'valuation mismatch', 'aged interface reject', 'unapproved adjustment', 'inventory balance unsupported']
  },
  {
    id: 'reimbursables',
    title: 'Agreement -> Billing -> Collection -> Trading Partner Reporting',
    short: 'Reimbursables',
    description: 'Shows how reimbursable and intragovernmental activity connects customer orders, billing, AR, collections, GTAS, and notes.',
    path: ['ginvoicing', 'revenue', 'ar-detail', 'proprietary-accounting', 'gl', 'ddrs', 'gtas', 'balance-sheet', 'net-cost', 'notes'],
    steps: [
      'Agreement or order establishes reimbursable activity.',
      'Navy ERP records reimbursable authority and billable work.',
      'Billing creates AR and revenue or financing impacts.',
      'Collections liquidate receivables and support FBwT reconciliation.',
      'Trading partner attributes support GTAS, eliminations, and disclosure notes.'
    ],
    exceptionTests: ['unbilled reimbursable work', 'aged AR', 'trading partner mismatch', 'collection not applied', 'buyer/seller disagreement']
  },
  {
    id: 'labor',
    title: 'Labor Source -> Cost Object -> Net Cost',
    short: 'Labor Cost',
    description: 'Shows how labor and timekeeping source data becomes cost assignment, GL expense, trial balance, and net-cost reporting.',
    path: ['dcps', 'labor-cost', 'cost-object-detail', 'proprietary-accounting', 'gl', 'ddrs', 'gtas', 'net-cost', 'balance-sheet'],
    steps: [
      'Payroll, HR, or timekeeping sources provide labor and cost population data.',
      'Navy ERP maps labor costs to organization, fund, program, and cost object structures.',
      'Cost-object records support program management and net-cost reporting.',
      'GL postings record expense, liabilities, and clearing activity.',
      'Trial balance and statements rely on complete population and valid assignment logic.'
    ],
    exceptionTests: ['source total not reconciled', 'invalid cost center', 'wrong fund or program', 'missing accrual', 'unsupported allocation']
  },
  {
    id: 'asset',
    title: 'Asset Receiving -> Capitalization -> Depreciation -> Disposal',
    short: 'PP&E Asset',
    description: 'Shows how asset-related events move from receipt or logistics evidence to asset accounting, GL, and PP&E statement support.',
    path: ['wawf', 'fleet-logistics', 'ppe', 'asset-detail', 'proprietary-accounting', 'gl', 'ddrs', 'gtas', 'balance-sheet', 'notes'],
    steps: [
      'Asset acquisition or receiving evidence originates in procurement or logistics sources.',
      'Navy ERP creates or updates asset master and transaction detail.',
      'Capitalization, depreciation, transfer, and retirement activity posts to accounting.',
      'GL and trial balance reporting support PP&E line items.',
      'Schedules and notes support existence, completeness, valuation, and disclosure.'
    ],
    exceptionTests: ['asset received but not capitalized', 'retired asset still active', 'asset ledger not reconciled to GL', 'wrong useful life', 'missing location or serial evidence']
  }
];

const navySupportServices = [
  { title: 'Master Data Management', detail: 'Vendor, customer, material, cost center, WBS, asset, fund, and LOA master data governance.' },
  { title: 'Interfaces & Integration', detail: 'IDocs, APIs, web services, file interfaces, batch monitoring, and error resolution.' },
  { title: 'Workflow & Approvals', detail: 'Purchase, invoice, travel, labor, asset, and role-based approval routing.' },
  { title: 'Security & Access', detail: 'RBAC, PFCG roles, segregation of duties, data authorization, and audit logging.' },
  { title: 'System Administration', detail: 'Client management, transport management, job scheduling, monitoring, and performance tuning.' },
  { title: 'Data Quality & Governance', detail: 'Authoritative sources, reconciliation rules, ownership, validation, lineage, and issue remediation.' },
  { title: 'Modernization', detail: 'Cloud modernization, SAP HANA, ERP convergence, data enablement, and AI analytics.' }
];

const navyCaveats = [
  'Navy ERP is shown using public information and generalized SAP architecture; exact configuration is controlled by DON/Navy ERP program data.',
  'Source systems may be feeders, peer ERPs, operational systems of record, or interfaces depending on the transaction and command.',
  'Table names are representative SAP ECC examples, not a certified Navy ERP extract or full data dictionary.',
  'PP&E / military equipment treatment can vary by asset class and implemented process.'
];

const daiLayers = [
  { id: 'source', label: 'Fourth Estate Source / Feeder Systems', short: 'Source', description: 'Agency, payroll, acquisition, travel, logistics, and partner systems where Defense Agency business events originate.' },
  { id: 'oracle', label: 'DAI Oracle EBS / Federal Financial Capabilities', short: 'Oracle', description: 'Oracle-based federal financial capabilities used to validate, control, account for, and report Fourth Estate business activity.' },
  { id: 'transactions', label: 'Detailed Transaction Objects', short: 'Detail', description: 'Document, subledger, and interface objects that preserve transaction-level evidence before summarization.' },
  { id: 'accounting', label: 'Accounting Layer', short: 'Accounting', description: 'SLA, subledger accounting, budgetary/proprietary accounting, and GL journal lines.' },
  { id: 'reporting', label: 'Reporting & Treasury Layer', short: 'Reporting', description: 'Operational reporting, DDRS, GTAS, Treasury, and external reporting outputs.' },
  { id: 'statements', label: 'Fourth Estate / DoD Financial Statements', short: 'Statements', description: 'Statement and note outputs supported by trial balances, crosswalks, and reconciled source populations.' }
];

const daiNodes = [
  {
    id: 'dts',
    layer: 'source',
    title: 'DTS',
    subtitle: 'Travel authorization and voucher source',
    icon: 'DTS',
    tags: ['travel', 'voucher', 'feeder', 'authorization'],
    summary: 'Provides travel authorizations, vouchers, local vouchers, and travel-card settlement activity for DAI-supported agencies.',
    examples: ['Travel authorization', 'Travel voucher', 'Local voucher', 'GTCC split disbursement'],
    auditQuestions: ['Does every approved voucher have a valid accounting string?', 'Did travel obligations and payments post to the correct period?', 'Are old travel obligations still valid?'],
    keyFields: ['authorization number', 'voucher number', 'traveler ID', 'LOA', 'approval date', 'trip dates', 'amount'],
    risks: ['Approved travel not obligated', 'Payment not liquidated against obligation', 'Manual correction breaks source lineage']
  },
  {
    id: 'piee',
    layer: 'source',
    title: 'PIEE / WAWF',
    subtitle: 'Invoice, receipt, and acceptance evidence',
    icon: 'P2P',
    tags: ['invoice', 'receipt', 'acceptance', 'procure-to-pay'],
    summary: 'Captures invoice, receiving, and acceptance evidence that should trace to procurement, AP, payment, and GL activity.',
    examples: ['Vendor invoice', 'Receiving report', 'Acceptance document', 'Combo document'],
    auditQuestions: ['Does each payment have invoice and acceptance support?', 'Do invoice amounts agree to award and receipt?', 'Are rejected interface records resolved?'],
    keyFields: ['PIID', 'CLIN', 'invoice number', 'receiving report', 'vendor CAGE/UEI', 'acceptance date'],
    risks: ['Unsupported payment', 'Timing mismatch', 'Failed interface record']
  },
  {
    id: 'contracting',
    layer: 'source',
    title: 'Contract Writing / EDA',
    subtitle: 'Awards, modifications, and obligations',
    icon: 'CTR',
    tags: ['contract', 'award', 'modification', 'obligation'],
    summary: 'Provides award, modification, CLIN, SLIN, and funding data that should reconcile to DAI purchasing and obligation records.',
    examples: ['Award', 'Modification', 'Funding citation', 'CLIN/SLIN structure'],
    auditQuestions: ['Does each contract action trace to a DAI purchasing or obligation record?', 'Are funding changes reflected in DAI?', 'Do line-item totals reconcile?'],
    keyFields: ['PIID', 'mod number', 'CLIN', 'SLIN', 'funding line', 'amount', 'award date'],
    risks: ['Award not obligated', 'Modification not reflected', 'Contract line detail lost in posting']
  },
  {
    id: 'dcps',
    layer: 'source',
    title: 'DCPS / HR Sources',
    subtitle: 'Civilian payroll and personnel cost source',
    icon: 'PAY',
    tags: ['payroll', 'labor', 'personnel', 'cost'],
    summary: 'Provides payroll, benefits, organization, labor, and accrual source data for Fourth Estate cost and liability accounting.',
    examples: ['Civilian payroll', 'Benefits', 'Withholdings', 'Labor distribution', 'Payroll accrual'],
    auditQuestions: ['Do payroll totals reconcile to DAI postings?', 'Are labor costs mapped to valid cost objects?', 'Are period-end accruals complete?'],
    keyFields: ['person identifier', 'pay period', 'organization', 'funding line', 'gross pay', 'benefits', 'cost object'],
    risks: ['Population mismatch', 'Invalid cost assignment', 'Missing accrual']
  },
  {
    id: 'agency-systems',
    layer: 'source',
    title: 'Agency Mission Systems',
    subtitle: 'Defense Agency operational sources',
    icon: 'AGY',
    tags: ['agency', 'mission', 'reimbursable', 'logistics', 'services'],
    summary: 'Represents Defense Agency mission, logistics, grant, service, or operational systems that may create reimbursable, cost, asset, or procurement events.',
    examples: ['Mission service order', 'Logistics event', 'Customer request', 'Asset event', 'Agency feeder batch'],
    auditQuestions: ['Are source populations complete?', 'Do accepted and rejected records reconcile?', 'Are agency-specific attributes retained?'],
    keyFields: ['agency code', 'source document', 'batch ID', 'customer', 'project', 'amount', 'event date'],
    risks: ['Incomplete feeder population', 'Aged rejects', 'Agency attributes lost in summary posting']
  },
  {
    id: 'g-invoicing',
    layer: 'source',
    title: 'G-Invoicing / IPAC',
    subtitle: 'Intragovernmental agreements and settlement',
    icon: 'IGT',
    tags: ['intragovernmental', 'reimbursable', 'trading partner', 'IPAC'],
    summary: 'Supports intragovernmental agreements, orders, performance, settlement, and trading-partner reconciliation.',
    examples: ['General terms and conditions', 'Order', 'Performance', 'IPAC settlement'],
    auditQuestions: ['Do buyer and seller records agree?', 'Are trading partner attributes valid?', 'Are collections and eliminations supported?'],
    keyFields: ['agreement number', 'order number', 'trading partner', 'BETC', 'TAS', 'amount'],
    risks: ['Trading partner mismatch', 'Elimination failure', 'Unbilled or uncollected activity']
  },
  {
    id: 'budget',
    layer: 'oracle',
    title: 'Budget-to-Report / Budgetary Control',
    subtitle: 'Funds control, budget execution, reporting',
    icon: 'BUD',
    tags: ['budget', 'funds control', 'obligation', 'SBR'],
    summary: 'Controls and reports budget authority, allotments, commitments, obligations, expenditures, and outlays for supported agencies.',
    examples: ['Budget authority', 'Allotment', 'Commitment', 'Obligation', 'Expenditure', 'Outlay', 'Trial-balance attribute support'],
    auditQuestions: ['Can budgetary resources be traced from authority to outlay?', 'Are funds checks and overrides supportable?', 'Are open obligations valid?', 'Do budgetary attributes support SBR and GTAS reporting?'],
    keyFields: ['fund', 'TAS', 'budget object class', 'organization', 'program', 'project', 'amount'],
    risks: ['Over-obligation', 'Invalid accounting string', 'Stale ULO']
  },
  {
    id: 'procurement',
    layer: 'oracle',
    title: 'Procure-to-Pay',
    subtitle: 'Requisition, PO, receipt, invoice, payment',
    icon: 'P2P',
    tags: ['procure-to-pay', 'purchase order', 'receipt', 'invoice', 'payment'],
    summary: 'Manages requisition demand, purchase orders and agreements, receiving, invoices, matching, approvals, and payment-ready AP activity.',
    examples: ['Requisition demand', 'Purchase order', 'Agreement', 'Receipt', 'Invoice', 'Three-way match', 'Payment request'],
    auditQuestions: ['Does every invoice trace to award, PO, and receipt or acceptance?', 'Do obligation and invoice amounts agree?', 'Are duplicate invoices prevented?', 'Do PO approval and invoice approval paths retain evidence?'],
    keyFields: ['requisition', 'PO number', 'PO line', 'invoice number', 'vendor', 'receipt', 'payment reference'],
    risks: ['Invoice without receipt', 'Duplicate invoice', 'PO/award mismatch']
  },
  {
    id: 'projects',
    layer: 'oracle',
    title: 'Project Costing / Cost Accounting',
    subtitle: 'Project, task, cost object, allocation',
    icon: 'PRJ',
    tags: ['project', 'cost', 'task', 'allocation'],
    summary: 'Captures costs by project, task, organization, program, and cost object for management reporting and net-cost support.',
    examples: ['Project cost', 'Task actuals', 'Labor distribution', 'Allocation', 'Cost transfer'],
    auditQuestions: ['Are costs assigned to valid projects and tasks?', 'Are allocation bases documented?', 'Do project costs reconcile to GL?'],
    keyFields: ['project', 'task', 'organization', 'expenditure type', 'award/funding source', 'amount'],
    risks: ['Wrong project assignment', 'Unsupported allocation', 'Project-to-GL reconciliation gap']
  },
  {
    id: 'receivables',
    layer: 'oracle',
    title: 'Order-to-Cash / Reimbursables',
    subtitle: 'Agreements, billing, AR, collections',
    icon: 'AR',
    tags: ['AR', 'billing', 'collection', 'reimbursable'],
    summary: 'Manages reimbursable agreements, customer billing, accounts receivable, collections, debt activity, and trading-partner attributes.',
    examples: ['Customer agreement', 'G-Invoicing order', 'Invoice', 'AR open item', 'Collection', 'Write-off'],
    auditQuestions: ['Are reimbursable orders billable and valid?', 'Do collections liquidate the right receivables?', 'Are aged receivables supportable?', 'Do trading-partner attributes support GTAS eliminations?'],
    keyFields: ['customer', 'agreement', 'invoice', 'collection', 'trading partner', 'fund', 'aging bucket'],
    risks: ['Unbilled reimbursable work', 'Unapplied collection', 'Aged receivable']
  },
  {
    id: 'assets',
    layer: 'oracle',
    title: 'Acquire-to-Retire / Fixed Assets',
    subtitle: 'Capitalization, depreciation, retirement',
    icon: 'FA',
    tags: ['asset', 'fixed assets', 'depreciation', 'PP&E'],
    summary: 'Maintains asset master records and supports the asset lifecycle from acquisition/capitalization through depreciation, transfer, retirement, and PP&E reporting.',
    examples: ['Asset addition', 'Capitalization', 'Mass addition from AP', 'Depreciation', 'Transfer', 'Retirement'],
    auditQuestions: ['Do assets exist and are they complete?', 'Do asset additions trace to procurement or source events?', 'Does depreciation post correctly?'],
    keyFields: ['asset number', 'book', 'category', 'cost center', 'location', 'acquisition value', 'useful life'],
    risks: ['Asset not capitalized', 'Wrong useful life', 'Retired asset still active']
  },
  {
    id: 'payables-detail',
    layer: 'transactions',
    title: 'AP Invoice / Payment Detail',
    subtitle: 'Supplier invoice, match, hold, approval, payment',
    icon: 'AP',
    tags: ['AP', 'invoice', 'payment', 'supplier'],
    summary: 'Supplier-level detail explaining invoices, distributions, holds, approvals, accruals, payment-ready records, and payment clearing.',
    examples: ['Supplier invoice', 'Invoice distribution', 'Invoice hold', 'Payment', 'Accrual', 'Supplier site'],
    auditQuestions: ['Does AP reconcile to GL?', 'Are invoices supported by PO and receipt?', 'Are payment holds resolved timely?', 'Do invoice distributions retain accounting string and source-document support?'],
    keyFields: ['supplier', 'invoice number', 'invoice line', 'PO', 'receipt', 'payment ID', 'due date'],
    risks: ['Duplicate invoice', 'Unsupported accrual', 'AP/GL mismatch']
  },
  {
    id: 'budget-detail',
    layer: 'transactions',
    title: 'Budgetary Detail',
    subtitle: 'Commitment, obligation, expenditure, outlay',
    icon: 'BD',
    tags: ['budgetary', 'commitment', 'obligation', 'SBR'],
    summary: 'Detailed budgetary activity explaining how authority becomes commitments, obligations, expenditures, and outlays.',
    examples: ['Budget authority', 'Commitment', 'Obligation', 'Expenditure', 'Outlay'],
    auditQuestions: ['Can each SBR line be traced to valid budgetary documents?', 'Are obligations supported?', 'Are cancellations and adjustments explainable?'],
    keyFields: ['budgetary document', 'fund', 'TAS', 'BOC', 'organization', 'program', 'amount'],
    risks: ['Invalid budgetary status', 'Stale ULO', 'Broken document chain']
  },
  {
    id: 'project-detail',
    layer: 'transactions',
    title: 'Project / Cost Detail',
    subtitle: 'Project expenditure and allocation detail',
    icon: 'CD',
    tags: ['project', 'cost', 'allocation', 'net cost'],
    summary: 'Cost-object detail showing project, task, labor, allocation, and expenditure activity.',
    examples: ['Project actual', 'Labor cost', 'Cost transfer', 'Allocation cycle', 'Task cost'],
    auditQuestions: ['Do costs support the Statement of Net Cost?', 'Are transfers approved?', 'Do projects reconcile to GL?'],
    keyFields: ['project', 'task', 'expenditure item', 'cost center', 'program', 'amount'],
    risks: ['Wrong cost object', 'Unsupported cost transfer', 'Net cost misclassification']
  },
  {
    id: 'asset-detail',
    layer: 'transactions',
    title: 'Asset Detail',
    subtitle: 'Asset master and transaction detail',
    icon: 'AD',
    tags: ['asset', 'PP&E', 'depreciation'],
    summary: 'Asset-level detail showing additions, depreciation, transfers, retirements, and location/support attributes.',
    examples: ['Asset addition', 'Depreciation', 'Transfer', 'Retirement', 'Physical inventory evidence'],
    auditQuestions: ['Do asset balances trace to asset records?', 'Are retirements recorded?', 'Are physical existence attributes complete?'],
    keyFields: ['asset number', 'asset book', 'category', 'location', 'serial', 'cost', 'accumulated depreciation'],
    risks: ['Incomplete asset population', 'Unrecorded retirement', 'Asset/GL reconciliation gap']
  },
  {
    id: 'interface-detail',
    layer: 'transactions',
    title: 'Interface Control Detail',
    subtitle: 'Batch, API, error, and reconciliation logs',
    icon: 'IF',
    tags: ['interface', 'batch', 'control total', 'reconciliation'],
    summary: 'Control detail used to prove completeness and accuracy between source systems and DAI posting objects.',
    examples: ['Batch control', 'Accepted record', 'Rejected record', 'Error queue', 'Source-to-target reconciliation'],
    auditQuestions: ['Were all source records accepted or resolved?', 'Do control totals reconcile?', 'Are manual corrections approved?'],
    keyFields: ['interface ID', 'batch ID', 'source key', 'status', 'control total', 'error code', 'processed date'],
    risks: ['Aged rejects', 'Incomplete population', 'Manual bypass of controls']
  },
  {
    id: 'sla',
    layer: 'accounting',
    title: 'Subledger Accounting',
    subtitle: 'Oracle SLA accounting rules',
    icon: 'SLA',
    tags: ['SLA', 'subledger accounting', 'accounting rules'],
    summary: 'Transforms subledger accounting events into journal entries using configured accounting methods, journal line definitions, account derivation rules, and supporting references.',
    examples: ['AP invoice validated event', 'Payment event', 'AR invoice or receipt event', 'Project cost event', 'Asset addition or depreciation event'],
    auditQuestions: ['Are accounting rules approved and current?', 'Do subledger events account completely?', 'Are exceptions resolved?', 'Do supporting references preserve agency, project, trading partner, and document lineage?'],
    keyFields: ['event ID', 'event class', 'ledger', 'accounting date', 'account combination', 'supporting reference', 'debit', 'credit', 'source'],
    risks: ['Accounting rule error', 'Unaccounted event', 'Invalid account derivation', 'Unsupported manual override']
  },
  {
    id: 'budgetary-accounting',
    layer: 'accounting',
    title: 'Budgetary Accounting',
    subtitle: 'USSGL budgetary postings',
    icon: 'BA',
    tags: ['budgetary', 'USSGL', 'SBR', 'obligation'],
    summary: 'Records budgetary resources, status of resources, obligations, expenditures, and outlays.',
    examples: ['Budget authority', 'Commitment', 'Obligation', 'Expenditure', 'Outlay'],
    auditQuestions: ['Do budgetary USSGL balances support SBR lines?', 'Are obligations complete and valid?', 'Do outlays reconcile?'],
    keyFields: ['USSGL 4xxxxx', 'fund', 'TAS', 'BOC', 'program', 'period', 'amount'],
    risks: ['SBR misstatement', 'Invalid USSGL mapping', 'Budgetary/proprietary imbalance']
  },
  {
    id: 'proprietary-accounting',
    layer: 'accounting',
    title: 'Proprietary Accounting',
    subtitle: 'Assets, liabilities, expense, revenue',
    icon: 'PA',
    tags: ['proprietary', 'balance sheet', 'net cost', 'USSGL'],
    summary: 'Records assets, liabilities, net position, revenues, financing sources, expenses, gains, and losses.',
    examples: ['Asset', 'Liability', 'Expense', 'Revenue', 'Net position'],
    auditQuestions: ['Do proprietary balances reconcile to subledgers?', 'Are expenses and assets classified correctly?', 'Are liabilities complete?'],
    keyFields: ['USSGL', 'account combination', 'fund', 'organization', 'project', 'trading partner', 'amount'],
    risks: ['Unsupported balance', 'Net cost misclassification', 'AP/AR/asset reconciliation gap']
  },
  {
    id: 'gl',
    layer: 'accounting',
    title: 'General Ledger',
    subtitle: 'GL journal header and line',
    icon: 'GL',
    tags: ['GL', 'journal', 'trial balance', 'USSGL'],
    summary: 'Official accounting journal lines where budgetary and proprietary activity lands for trial balance, period close, and downstream reporting.',
    examples: ['Journal header', 'Journal line', 'Manual journal', 'Subledger journal import', 'Period close', 'Trial balance extract'],
    auditQuestions: ['Does every GL line have source support?', 'Do subledger journals reconcile to GL?', 'Can GL lines trace to statement lines?', 'Was subledger transfer performed at detail or summary level and is drillback retained?'],
    keyFields: ['journal ID', 'journal line', 'ledger', 'accounting date', 'account combination', 'debit', 'credit', 'subledger link'],
    risks: ['Unsupported manual journal', 'Subledger-to-GL mismatch', 'Summary posting breaks lineage', 'Closed-period adjustment without support']
  },
  {
    id: 'operational-reporting',
    layer: 'reporting',
    title: 'Operational Reporting',
    subtitle: 'Oracle reports, BI, extracts',
    icon: 'BI',
    tags: ['reporting', 'BI', 'extract', 'dashboard'],
    summary: 'Provides operational reports, dashboards, data extracts, and management analytics for DAI transaction populations and reconciliations.',
    examples: ['Trial balance extract', 'AP aging', 'Open obligations', 'Project cost report', 'Interface error report', 'SLA-to-GL reconciliation'],
    auditQuestions: ['Are report definitions documented?', 'Do extracts reconcile to source tables?', 'Are prompts and filters retained?', 'Are report totals tied to GL, subledger, and interface control totals?'],
    keyFields: ['report ID', 'extract date', 'selection criteria', 'source object', 'control total'],
    risks: ['Undocumented logic', 'Wrong population', 'Extract not reconciled']
  },
  {
    id: 'ddrs',
    layer: 'reporting',
    title: 'DDRS',
    subtitle: 'Defense Departmental Reporting System',
    icon: 'DDRS',
    tags: ['DDRS', 'trial balance', 'financial reporting'],
    summary: 'Receives DAI/GL trial-balance data and supports reporting edits, validations, adjustments, and financial reporting packages.',
    examples: ['Trial balance', 'Validation edit', 'Adjustment', 'Reporting package'],
    auditQuestions: ['Does DDRS reconcile to DAI GL?', 'Are adjustments approved?', 'Do attributes support reporting rules?'],
    keyFields: ['USSGL', 'fund/TAS', 'attribute', 'ending balance', 'adjustment ID', 'period'],
    risks: ['Trial balance mismatch', 'Unsupported adjustment', 'Attribute error']
  },
  {
    id: 'gtas',
    layer: 'reporting',
    title: 'GTAS',
    subtitle: 'Treasury adjusted trial balance',
    icon: 'GTAS',
    tags: ['GTAS', 'Treasury', 'adjusted trial balance'],
    summary: 'Treasury reporting layer where federal entities submit adjusted trial-balance data and supporting attributes for budget execution and proprietary reporting.',
    examples: ['GTAS ATB', 'Edit validation', 'Elimination', 'Reclassification'],
    auditQuestions: ['Do GTAS attributes align to USSGL and TAS?', 'Are edits resolved?', 'Are eliminations supported?'],
    keyFields: ['USSGL', 'TAS', 'trading partner', 'BETC', 'attribute', 'amount', 'edit status', 'reporting period'],
    risks: ['GTAS edit failure', 'Trading partner mismatch', 'Unsupported elimination']
  },
  {
    id: 'external-reporting',
    layer: 'reporting',
    title: 'External Reporting / USSGL Crosswalks',
    subtitle: 'Crosswalks, notes, financial reports',
    icon: 'EXT',
    tags: ['external reporting', 'crosswalk', 'statements', 'notes'],
    summary: 'Maps USSGL trial-balance amounts and attributes to financial statement lines, note schedules, and statutory reporting outputs.',
    examples: ['USSGL crosswalk', 'Statement line', 'Note schedule', 'Agency reporting package', 'Schedule F / budget-accrual reconciliation support'],
    auditQuestions: ['Is crosswalk logic current?', 'Do statement lines reconcile to ATB?', 'Are notes tied to schedules?'],
    keyFields: ['statement line', 'USSGL', 'attribute', 'crosswalk rule', 'source balance'],
    risks: ['Wrong statement mapping', 'Incomplete note support', 'Crosswalk not updated']
  },
  {
    id: 'balance-sheet',
    layer: 'statements',
    title: 'Balance Sheet',
    subtitle: 'Assets, liabilities, net position',
    icon: 'BS',
    tags: ['balance sheet', 'assets', 'liabilities', 'net position'],
    summary: 'Reports assets, liabilities, and net position for supported Fourth Estate reporting entities.',
    examples: ['FBwT', 'Accounts receivable', 'PP&E', 'Accounts payable', 'Net position'],
    auditQuestions: ['Are asset and liability populations complete?', 'Do subledgers reconcile to GL?', 'Are FBwT differences explained?'],
    keyFields: ['USSGL 100000', 'USSGL 200000', 'USSGL 300000', 'TAS', 'fund', 'entity'],
    risks: ['Unsupported FBwT', 'Unreconciled AP/AR', 'PP&E completeness gap']
  },
  {
    id: 'net-cost',
    layer: 'statements',
    title: 'Statement of Net Cost',
    subtitle: 'Program costs and earned revenue',
    icon: 'SNC',
    tags: ['net cost', 'expense', 'revenue', 'program'],
    summary: 'Reports program costs, earned revenue, gains/losses, and net cost of operations.',
    examples: ['Program expense', 'Labor cost', 'Depreciation', 'Earned revenue', 'Net cost'],
    auditQuestions: ['Are costs assigned to the correct program?', 'Are revenues matched to earned activity?', 'Are allocations supported?'],
    keyFields: ['USSGL 500000', 'USSGL 600000', 'USSGL 700000', 'program', 'project', 'cost object'],
    risks: ['Misstated program cost', 'Unsupported allocation', 'Revenue/cost mismatch']
  },
  {
    id: 'sbr',
    layer: 'statements',
    title: 'Statement of Budgetary Resources',
    subtitle: 'Authority, obligations, outlays',
    icon: 'SBR',
    tags: ['SBR', 'budgetary resources', 'obligations', 'outlays'],
    summary: 'Reports budgetary resources, status of resources, obligations incurred, and net outlays.',
    examples: ['Budgetary resources', 'Status of resources', 'Obligations incurred', 'Outlays'],
    auditQuestions: ['Can authority, obligation, and outlay trace end-to-end?', 'Are open obligations valid?', 'Do Treasury balances reconcile?'],
    keyFields: ['USSGL 400000', 'TAS', 'fund', 'BOC', 'budgetary attribute', 'outlay amount'],
    risks: ['Invalid obligation', 'Unliquidated obligation issue', 'SBR-to-Treasury difference']
  },
  {
    id: 'notes',
    layer: 'statements',
    title: 'Notes to Financial Statements',
    subtitle: 'Disclosures and schedules',
    icon: 'NOTE',
    tags: ['notes', 'disclosure', 'schedule', 'RSI'],
    summary: 'Provides disclosures, note schedules, reconciliations, and supplementary information supporting statement lines.',
    examples: ['FBwT note', 'Accounts receivable note', 'PP&E note', 'Intragovernmental note'],
    auditQuestions: ['Do notes tie to the ATB and schedules?', 'Are disclosures complete?', 'Are reconciliations retained?'],
    keyFields: ['note line', 'schedule', 'source amount', 'reconciliation', 'owner'],
    risks: ['Note does not tie', 'Unsupported disclosure', 'Incomplete schedule']
  }
];

const daiLineageScenarios = [
  {
    id: 'p2p',
    title: 'Award -> PO -> Receipt -> Invoice -> Payment',
    short: 'Procure-to-Pay',
    description: 'Shows how a Fourth Estate procurement event flows from contract source and PIEE evidence through DAI purchasing, AP, SLA, GL, reporting, and statements.',
    path: ['contracting', 'piee', 'procurement', 'payables-detail', 'sla', 'gl', 'ddrs', 'gtas', 'balance-sheet', 'net-cost', 'sbr'],
    steps: [
      'Contract action and funding create award, modification, and line-item support.',
      'DAI creates requisition, purchase order/agreement, distribution, and budgetary control records.',
      'PIEE/WAWF provides receipt, acceptance, and invoice evidence.',
      'AP validation, matching, holds, approvals, and payment-ready processing create accounting events for SLA.',
      'SLA creates subledger journal entries and transfers supported accounting to GL.',
      'Trial balance, GTAS, and statement lines rely on supported AP, expense, asset, and outlay populations.'
    ],
    exceptionTests: ['award without obligation', 'invoice without receipt or acceptance', 'SLA event not accounted', 'payment without AP support', 'PO amount mismatch', 'subledger-to-GL transfer mismatch']
  },
  {
    id: 'travel',
    title: 'Travel Authorization -> Voucher -> Outlay',
    short: 'Travel',
    description: 'Shows how travel activity flows from DTS through DAI budgetary control, AP/payment activity, GL, and SBR support.',
    path: ['dts', 'budget', 'budget-detail', 'budgetary-accounting', 'sla', 'gl', 'ddrs', 'gtas', 'sbr', 'net-cost'],
    steps: [
      'DTS creates authorization and voucher with accounting string and approvals.',
      'DAI records or adjusts the obligation and budgetary status.',
      'Voucher approval and payment activity liquidate or adjust the obligation.',
      'SLA creates accounting from the approved travel/payment event and transfers it to GL.',
      'SBR and net-cost lines rely on valid travel populations and timing.'
    ],
    exceptionTests: ['approved travel without obligation', 'voucher paid but obligation remains open', 'wrong accounting string', 'manual adjustment outside source flow', 'period mismatch', 'travel source total not reconciled to DAI']
  },
  {
    id: 'reimbursables',
    title: 'Agreement -> Billing -> Collection -> Trading Partner Reporting',
    short: 'Reimbursables',
    description: 'Shows how reimbursable and intragovernmental activity flows through DAI receivables, collections, GL, GTAS, and notes.',
    path: ['g-invoicing', 'receivables', 'budget-detail', 'sla', 'proprietary-accounting', 'gl', 'ddrs', 'gtas', 'balance-sheet', 'net-cost', 'notes'],
    steps: [
      'G-Invoicing agreement/order or customer order establishes reimbursable authority and trading-partner context.',
      'DAI records reimbursable authority, billable activity, invoice, and AR detail.',
      'Collections, including IPAC where applicable, liquidate receivables and support FBwT reconciliation.',
      'SLA and GL postings preserve customer, project, fund, and trading-partner attributes.',
      'GTAS, notes, and statement lines tie to AR, revenue, collections, and trading-partner schedules.'
    ],
    exceptionTests: ['unbilled reimbursable work', 'aged AR', 'collection not applied', 'trading partner mismatch', 'buyer/seller disagreement', 'G-Invoicing order not reconciled to DAI billing']
  },
  {
    id: 'payroll-cost',
    title: 'Payroll Source -> Project Cost -> Net Cost',
    short: 'Payroll Cost',
    description: 'Shows how civilian payroll and labor costs move through DAI project/cost accounting, SLA, GL, and net-cost reporting.',
    path: ['dcps', 'projects', 'project-detail', 'sla', 'proprietary-accounting', 'gl', 'ddrs', 'gtas', 'net-cost', 'balance-sheet'],
    steps: [
      'Payroll source provides pay, benefits, labor, and organization detail.',
      'DAI maps payroll and labor distribution to project, task, organization, program, and funding structures.',
      'Project and cost detail support management reporting and allocations.',
      'SLA and GL record expense, liability, and clearing activity.',
      'Net-cost and balance-sheet lines rely on complete population and valid assignment.'
    ],
    exceptionTests: ['payroll source total not reconciled', 'invalid project/task', 'wrong organization or fund', 'missing accrual', 'unsupported allocation']
  },
  {
    id: 'assets',
    title: 'Source Asset Event -> Capitalization -> Depreciation -> Statement Support',
    short: 'Fixed Assets',
    description: 'Shows how asset events flow from agency or procurement sources into DAI fixed assets, accounting, GL, and PP&E reporting.',
    path: ['agency-systems', 'piee', 'assets', 'asset-detail', 'sla', 'proprietary-accounting', 'gl', 'ddrs', 'gtas', 'balance-sheet', 'notes'],
    steps: [
      'Asset purchase, AP invoice distribution, or agency source event provides receiving and capitalization evidence.',
      'DAI creates mass additions or asset records and updates asset transaction detail.',
      'Capitalization, depreciation, transfers, and retirements create accounting events.',
      'SLA and GL postings support PP&E balances, depreciation expense, gains/losses, and retirements.',
      'Notes and schedules support existence, completeness, valuation, and disclosure.'
    ],
    exceptionTests: ['asset received but not capitalized', 'AP distribution not sent to assets', 'retired asset still active', 'asset ledger not reconciled to GL', 'wrong useful life', 'missing physical evidence']
  }
];

const daiSupportServices = [
  { title: 'Oracle Master Data', detail: 'Suppliers, customers, projects, tasks, organizations, funds, accounts, assets, and accounting strings.' },
  { title: 'Interfaces & Controls', detail: 'Batch files, APIs, accepted/rejected records, control totals, and source-to-target reconciliation.' },
  { title: 'Workflow & Approvals', detail: 'Requisition, purchase, invoice, journal, travel, asset, and adjustment approval routing.' },
  { title: 'Security & Access', detail: 'Role-based access, segregation of duties, privileged access, and audit logging.' },
  { title: 'Period Close', detail: 'Subledger close, GL close, reconciliations, trial-balance extracts, and reporting package controls.' },
  { title: 'Data Governance', detail: 'Authoritative sources, lineage, definitions, validation rules, stewardship, and issue remediation.' },
  { title: 'Modernization', detail: 'Cloud hosting, integration modernization, reporting automation, audit analytics, and AI-enabled UoT testing.' }
];

const daiCaveats = [
  'DAI is modeled here as a public-information, representative Oracle-based Fourth Estate financial/accounting architecture.',
  'Exact DAI modules, interfaces, reports, tables, ledgers, and agency configurations vary by Defense Agency, role, release, and authoritative program data.',
  'Oracle table/module names are intentionally generalized because this is not an official DAI data dictionary or audit assertion package.',
  'Source systems may be feeders, agency mission systems, shared services, or peer authoritative systems depending on the supported Defense Agency.'
];

export const systems = [
  {
    slug: 'gfebs',
    shortName: 'GFEBS',
    name: 'GFEBS',
    longName: 'GFEBS / SAP-Based Financial Management Architecture Blueprint',
    agency: 'Army',
    eyebrow: 'Interactive DoD FM architecture',
    description: 'Explore how feeder systems, GFEBS business process areas, detailed transaction objects, USSGL accounting, reporting layers, and DoD financial statements connect for audit readiness and Universe of Transactions traceability.',
    metric: '6',
    metricLabel: 'Core GFEBS business process areas',
    metricDetail: 'Feeder -> Detail -> GL -> Statement',
    referenceImage: '/gfebs-blueprint-reference.png',
    referenceTitle: 'Original corrected GFEBS blueprint image',
    layers: gfebsLayers,
    nodes: gfebsNodes,
    lineageScenarios: gfebsLineageScenarios,
    supportServices: gfebsSupportServices,
    caveats: [
      'This is an educational architecture model. Exact GFEBS tables, T-codes, custom reports, interfaces, and functionality vary by Army configuration, role permissions, release, and modernization state.'
    ],
    sources: []
  },
  {
    slug: 'navy-erp',
    shortName: 'Navy ERP',
    name: 'Navy ERP',
    longName: 'Navy ERP / SAP-Based Financial Management Architecture Blueprint',
    agency: 'Department of the Navy',
    eyebrow: 'Navy ERP blueprint appended to the DoD FM suite',
    description: 'Explore Navy ERP financial, accounting, supply-chain, PP&E, reimbursable, labor, reporting, and UoT traceability patterns using the same multi-page DoD FM system model.',
    metric: '8',
    metricLabel: 'Core Navy ERP business capabilities',
    metricDetail: 'Source -> Detail -> GL -> Statement',
    referenceImage: '/navy-erp-blueprint-v2.png',
    referenceTitle: 'Navy ERP static blueprint reference',
    downloadLinks: [
      { label: 'Download SVG', href: '/navy-erp-blueprint-v2.svg' },
      { label: 'Download PNG', href: '/navy-erp-blueprint-v2.png' },
      { label: 'Download high-res PNG', href: '/navy-erp-blueprint-v2-hires.png' }
    ],
    layers: navyLayers,
    nodes: navyNodes,
    lineageScenarios: navyLineageScenarios,
    supportServices: navySupportServices,
    caveats: navyCaveats,
    sources: [
      { name: 'DFAS Navy ERP', url: 'https://www.dfas.mil/PDI/NavyERP/' },
      { name: 'Navy ERP cloud modernization', url: 'https://www.navy.mil/Press-Office/News-Stories/display-news/Article/2239583/modernization-takes-navy-erp-to-the-cloud/' },
      { name: 'Navy completes largest cloud migration', url: 'https://www.navy.mil/Press-Office/Press-Releases/display-pressreleases/Article/2237045/navy-completes-its-largest-cloud-migration-to-date/' },
      { name: 'PEO MLB Portfolio Book April 2025', url: 'https://www.peomlb.navy.mil/Portals/97/Documents/PEO%20MLB%20Portfolio%20Book%20April%202025%20%28Online%29.pdf' }
    ]
  },
  {
    slug: 'dai',
    shortName: 'DAI',
    name: 'DAI',
    longName: 'Defense Agencies Initiative / Oracle-Based Financial Accounting Blueprint',
    agency: 'Fourth Estate',
    eyebrow: 'DAI blueprint for Defense Agencies and Field Activities',
    description: 'Explore DAI as a representative Oracle-based Fourth Estate financial accounting system, connecting agency source systems, Oracle financial capabilities, subledger accounting, GL, reporting, and DoD statement support.',
    metric: '5',
    metricLabel: 'Core DAI lineage scenarios',
    metricDetail: 'Source -> SLA -> GL -> Statement',
    referenceImage: '/dai-blueprint-reference.svg',
    referenceTitle: 'DAI static blueprint reference',
    downloadLinks: [
      { label: 'Download SVG', href: '/dai-blueprint-reference.svg' }
    ],
    layers: daiLayers,
    nodes: daiNodes,
    lineageScenarios: daiLineageScenarios,
    supportServices: daiSupportServices,
    caveats: daiCaveats,
    sources: [
      { name: 'Oracle Purchasing buyer work center', url: 'https://docs.oracle.com/cd/E26401_01/doc.122/e48931/T446883T443956.htm' },
      { name: 'Oracle Subledger Accounting event model', url: 'https://docs.oracle.com/cd/E18727_01/doc.121/e13628/T149412T149415.htm' },
      { name: 'Treasury GTAS', url: 'https://fiscal.treasury.gov/accounting/government-wide-treasury-account-symbol-gtas' },
      { name: 'Treasury USSGL', url: 'https://fiscal.treasury.gov/accounting/us-standard-general-ledger-ussgl' },
      { name: 'Treasury G-Invoicing / IPAC', url: 'https://fiscal.treasury.gov/accounting/intragov' }
    ]
  }
];

export function getSystem(slug) {
  return systems.find((system) => system.slug === slug) || systems[0];
}

export function getSystemSlugs() {
  return systems.map((system) => system.slug);
}
