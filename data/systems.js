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

const deamsLayers = [
  { id: 'source', label: 'DAF Source / Feeder Systems', short: 'Source', description: 'Air Force, Space Force, DFAS, contracting, travel, payroll, logistics, and Treasury-facing systems where financial business events originate.' },
  { id: 'oracle', label: 'DEAMS Core Business Processes', short: 'DEAMS', description: 'Oracle-based federal financial management processes for budget execution, procure-to-pay, reimbursables, cost accounting, assets, and close.' },
  { id: 'transactions', label: 'Detailed Transaction Objects', short: 'Detail', description: 'Document, subledger, interface, and reconciliation records that preserve Universe of Transactions evidence before GL summarization.' },
  { id: 'accounting', label: 'Accounting Layer', short: 'Accounting', description: 'Oracle SLA, USSGL budgetary/proprietary accounting, GL journal lines, account derivation, and drillback controls.' },
  { id: 'reporting', label: 'Reporting / Treasury Layer', short: 'Reporting', description: 'DEAMS reporting, DDRS, GTAS, CARS/FBwT, USSGL crosswalks, G-Invoicing/IPAC, and external reporting outputs.' },
  { id: 'statements', label: 'DAF / DoD Financial Statements', short: 'Statements', description: 'Department of the Air Force and DoD statement outputs supported by reconciled trial balances, note schedules, and audit evidence.' }
];

const deamsNodes = [
  {
    id: 'dts',
    layer: 'source',
    title: 'DTS',
    subtitle: 'Travel authorizations and vouchers',
    icon: 'DTS',
    tags: ['travel', 'authorization', 'voucher', 'GTCC'],
    summary: 'Provides travel authorizations, vouchers, local vouchers, travel-card settlement references, and accounting strings that must trace to obligation, expense, and outlay records.',
    examples: ['Travel authorization', 'Travel voucher', 'Local voucher', 'GTCC split disbursement', 'Accounting classification'],
    auditQuestions: ['Does every approved voucher trace to a valid accounting string?', 'Were travel obligations liquidated or adjusted after voucher approval?', 'Do travel totals reconcile from DTS to DEAMS accounting?'],
    keyFields: ['authorization number', 'voucher number', 'traveler ID', 'LOA', 'approval date', 'trip dates', 'amount'],
    risks: ['Approved travel not obligated', 'Voucher paid but obligation remains open', 'Manual correction breaks source-to-GL lineage']
  },
  {
    id: 'piee',
    layer: 'source',
    title: 'PIEE / WAWF',
    subtitle: 'Invoice, receipt, and acceptance evidence',
    icon: 'P2P',
    tags: ['invoice', 'receipt', 'acceptance', 'procure-to-pay'],
    summary: 'Captures electronic invoice, receiving report, acceptance, and payment-support evidence used by DEAMS procure-to-pay and accounts payable processes.',
    examples: ['Vendor invoice', 'Receiving report', 'Acceptance document', 'Combo document', 'UID or asset-related receiving evidence'],
    auditQuestions: ['Does each payment have invoice, receipt, and acceptance support?', 'Do invoice quantities and prices agree to PO and receipt?', 'Are WAWF rejects resolved and reconciled?'],
    keyFields: ['PIID', 'CLIN', 'invoice number', 'receiving report', 'vendor CAGE/UEI', 'acceptance date'],
    risks: ['Payment without acceptance', 'Duplicate or unsupported invoice', 'Rejected interface record aged past close']
  },
  {
    id: 'contracting',
    layer: 'source',
    title: 'Contract Writing / EDA',
    subtitle: 'Awards, modifications, clauses, funding',
    icon: 'CTR',
    tags: ['contract', 'award', 'modification', 'obligation'],
    summary: 'Provides award, modification, line-item, funding, and contract evidence that should reconcile to DEAMS purchasing, obligation, and payment records.',
    examples: ['Award', 'Modification', 'Funding citation', 'CLIN/SLIN', 'Contract deliverable'],
    auditQuestions: ['Does each award or mod trace to DEAMS purchasing and obligation records?', 'Are funded lines complete and valid?', 'Can obligation changes be tied to contract modifications?'],
    keyFields: ['PIID', 'mod number', 'CLIN', 'SLIN', 'funding line', 'amount', 'award date'],
    risks: ['Award not obligated', 'Modification not reflected in DEAMS', 'Contract line detail lost in summary accounting']
  },
  {
    id: 'dcps',
    layer: 'source',
    title: 'DCPS / Personnel Pay Sources',
    subtitle: 'Civilian payroll, benefits, labor cost',
    icon: 'PAY',
    tags: ['payroll', 'labor', 'personnel', 'cost'],
    summary: 'Provides civilian payroll, benefit, withholding, labor distribution, and accrual source data for DAF cost and liability accounting.',
    examples: ['Civilian payroll', 'Benefits', 'Withholdings', 'Labor distribution', 'Payroll accrual'],
    auditQuestions: ['Do payroll totals reconcile to DEAMS postings?', 'Are labor costs mapped to valid organization, program, and cost objects?', 'Are accruals complete at period end?'],
    keyFields: ['person identifier', 'pay period', 'organization', 'funding line', 'gross pay', 'benefits', 'cost object'],
    risks: ['Payroll population mismatch', 'Invalid cost assignment', 'Missing or reversed accrual']
  },
  {
    id: 'mission-logistics',
    layer: 'source',
    title: 'Mission / Logistics / Asset Sources',
    subtitle: 'Operational events with financial impact',
    icon: 'OPS',
    tags: ['mission', 'logistics', 'asset', 'inventory', 'source system'],
    summary: 'Represents Air Force and Space Force operational, logistics, asset, inventory, and mission support systems that may generate cost, asset, or reimbursement accounting events.',
    examples: ['Asset receiving event', 'Inventory movement', 'Mission support order', 'Logistics batch', 'Property evidence'],
    auditQuestions: ['Are source populations complete and accepted?', 'Do financial-impact events reconcile to DEAMS?', 'Are rejected or suspense records resolved?'],
    keyFields: ['source document', 'batch ID', 'unit', 'project', 'asset identifier', 'quantity', 'amount'],
    risks: ['Incomplete feeder population', 'Aged rejects', 'Operational event not reflected financially']
  },
  {
    id: 'ginvoicing',
    layer: 'source',
    title: 'G-Invoicing / IPAC',
    subtitle: 'Intragovernmental buy/sell and settlement',
    icon: 'IGT',
    tags: ['intragovernmental', 'reimbursable', 'trading partner', 'IPAC'],
    summary: 'Supports intragovernmental agreements, orders, performance, settlement, and trading-partner reconciliation for reimbursable and buy/sell activity.',
    examples: ['GT&C agreement', 'Order', 'Performance', 'Settlement request', 'IPAC transfer'],
    auditQuestions: ['Do buyer and seller records agree?', 'Are trading partner attributes valid?', 'Are IPAC settlements properly applied and eliminated?'],
    keyFields: ['agreement number', 'order number', 'trading partner', 'BETC', 'TAS', 'amount', 'performance date'],
    risks: ['Trading partner mismatch', 'Elimination failure', 'Unbilled or unsettled intragovernmental activity']
  },
  {
    id: 'budget',
    layer: 'oracle',
    title: 'Budget-to-Report',
    subtitle: 'Funds control, budget execution, trial balance',
    icon: 'B2R',
    tags: ['budget', 'funds control', 'SBR', 'obligation', 'trial balance'],
    summary: 'Controls and reports budget authority, allotments, commitments, obligations, expenditures, and outlays, while preserving TAS, USSGL, and DAF reporting attributes.',
    examples: ['Budget authority', 'Allotment', 'Commitment', 'Obligation', 'Expenditure', 'Outlay', 'Trial-balance extract'],
    auditQuestions: ['Can budgetary resources be traced from authority to outlay?', 'Are funds checks and overrides supportable?', 'Do budgetary attributes support SBR and GTAS reporting?'],
    keyFields: ['fund', 'TAS', 'budget object class', 'organization', 'program', 'project', 'amount'],
    risks: ['Over-obligation', 'Invalid accounting string', 'Budgetary/proprietary imbalance']
  },
  {
    id: 'p2p',
    layer: 'oracle',
    title: 'Procure-to-Pay',
    subtitle: 'Requisition, PO, receipt, invoice, payment',
    icon: 'P2P',
    tags: ['procure-to-pay', 'requisition', 'purchase order', 'receipt', 'invoice', 'payment'],
    summary: 'Manages requisition demand, purchase orders and agreements, receiving, invoice matching, holds, approvals, AP accounting events, and payment-ready activity.',
    examples: ['Requisition demand', 'Purchase order', 'Agreement', 'Receipt', 'Invoice', 'Three-way match', 'Payment request'],
    auditQuestions: ['Does every invoice trace to award, PO, and receipt or acceptance?', 'Do obligation, receipt, invoice, and payment amounts agree?', 'Do PO and invoice approval paths retain evidence?'],
    keyFields: ['requisition', 'PO number', 'PO line', 'invoice number', 'vendor', 'receipt', 'payment reference'],
    risks: ['Invoice without receipt', 'Duplicate invoice', 'PO/award mismatch']
  },
  {
    id: 'reimbursables',
    layer: 'oracle',
    title: 'Order-to-Cash / Reimbursables',
    subtitle: 'Agreements, billing, AR, collections',
    icon: 'O2C',
    tags: ['AR', 'billing', 'collection', 'reimbursable', 'trading partner'],
    summary: 'Manages customer orders, reimbursable authority, billing, accounts receivable, collections, debt activity, and trading-partner attributes.',
    examples: ['Customer agreement', 'G-Invoicing order', 'Invoice', 'AR open item', 'Collection', 'Write-off'],
    auditQuestions: ['Are reimbursable orders valid and billable?', 'Do collections liquidate the right receivables?', 'Do trading-partner attributes support GTAS eliminations?'],
    keyFields: ['customer', 'agreement', 'invoice', 'collection', 'trading partner', 'fund', 'aging bucket'],
    risks: ['Unbilled reimbursable work', 'Unapplied collection', 'Aged receivable']
  },
  {
    id: 'costing',
    layer: 'oracle',
    title: 'Cost / Project / Labor Accounting',
    subtitle: 'Program cost, labor, allocations',
    icon: 'CST',
    tags: ['cost', 'project', 'labor', 'allocation', 'net cost'],
    summary: 'Captures program, project, labor, organization, and cost-object detail for management reporting, allocations, and Statement of Net Cost support.',
    examples: ['Labor cost', 'Project actual', 'Cost transfer', 'Allocation', 'Program cost report'],
    auditQuestions: ['Are costs assigned to valid programs and cost objects?', 'Are allocations documented?', 'Do cost reports reconcile to GL?'],
    keyFields: ['project', 'program', 'organization', 'expenditure type', 'cost object', 'amount'],
    risks: ['Wrong program cost', 'Unsupported allocation', 'Cost-to-GL reconciliation gap']
  },
  {
    id: 'assets',
    layer: 'oracle',
    title: 'Acquire-to-Retire / Fixed Assets',
    subtitle: 'Asset additions, depreciation, retirements',
    icon: 'FA',
    tags: ['asset', 'fixed assets', 'depreciation', 'PP&E'],
    summary: 'Supports asset lifecycle activity from receiving and capitalization through depreciation, transfers, retirements, and PP&E reporting schedules.',
    examples: ['Asset addition', 'Mass addition from AP', 'Capitalization', 'Depreciation', 'Transfer', 'Retirement'],
    auditQuestions: ['Do asset additions trace to procurement or source events?', 'Does depreciation post correctly?', 'Do asset balances reconcile to GL and note schedules?'],
    keyFields: ['asset number', 'book', 'category', 'cost center', 'location', 'acquisition value', 'useful life'],
    risks: ['Asset not capitalized', 'Wrong useful life', 'Asset subledger-to-GL mismatch']
  },
  {
    id: 'close',
    layer: 'oracle',
    title: 'Period Close / Reconciliation',
    subtitle: 'Subledger close, GL close, reporting controls',
    icon: 'CLS',
    tags: ['close', 'reconciliation', 'trial balance', 'control total'],
    summary: 'Coordinates interface resolution, subledger close, GL close, reconciliations, trial-balance extracts, and reporting package controls.',
    examples: ['Interface error report', 'SLA-to-GL reconciliation', 'AP/AR aging tie-out', 'Trial balance extract', 'Close checklist'],
    auditQuestions: ['Are all subledgers closed and transferred?', 'Do subledger balances reconcile to GL?', 'Are close adjustments approved and supported?'],
    keyFields: ['period', 'ledger', 'subledger', 'journal batch', 'control total', 'reconciliation owner'],
    risks: ['Unaccounted event at close', 'Unsupported adjustment', 'Subledger-to-GL break']
  },
  {
    id: 'po-detail',
    layer: 'transactions',
    title: 'PO / Receipt Detail',
    subtitle: 'Requisition, PO line, shipment, distribution',
    icon: 'PO',
    tags: ['purchase order', 'receipt', 'distribution', 'procurement'],
    summary: 'Detailed procurement records that connect requisition demand, award evidence, PO lines, shipments, distributions, receipts, and receiving acceptance.',
    examples: ['Requisition line', 'PO line', 'Shipment', 'Distribution', 'Receipt', 'Receiving correction'],
    auditQuestions: ['Do PO distributions carry valid accounting strings?', 'Do receipts trace to accepted goods or services?', 'Are PO changes approved and supported?'],
    keyFields: ['requisition line', 'PO line', 'shipment', 'distribution', 'receipt number', 'quantity', 'amount'],
    risks: ['PO distribution error', 'Receipt mismatch', 'Unauthorized PO change']
  },
  {
    id: 'ap-detail',
    layer: 'transactions',
    title: 'AP Invoice / Payment Detail',
    subtitle: 'Supplier invoice, match, hold, approval, payment',
    icon: 'AP',
    tags: ['AP', 'invoice', 'payment', 'supplier', 'hold'],
    summary: 'Supplier-level detail explaining invoices, distributions, validation, holds, approvals, accruals, payment-ready records, and payment clearing.',
    examples: ['Supplier invoice', 'Invoice distribution', 'Invoice hold', 'Payment', 'Accrual', 'Supplier site'],
    auditQuestions: ['Does AP reconcile to GL?', 'Are invoices supported by PO and receipt?', 'Do invoice distributions retain accounting string and source support?'],
    keyFields: ['supplier', 'invoice number', 'invoice line', 'PO', 'receipt', 'payment ID', 'due date'],
    risks: ['Duplicate invoice', 'Unsupported accrual', 'AP/GL mismatch']
  },
  {
    id: 'ar-detail',
    layer: 'transactions',
    title: 'AR / Collection Detail',
    subtitle: 'Billing, receivable, collection, debt',
    icon: 'AR',
    tags: ['AR', 'billing', 'collection', 'reimbursable'],
    summary: 'Customer-level detail explaining reimbursable billing, receivables, collections, adjustments, write-offs, and trading-partner attributes.',
    examples: ['Customer invoice', 'Open AR item', 'Collection', 'Adjustment', 'Write-off', 'IPAC settlement'],
    auditQuestions: ['Does AR reconcile to GL?', 'Are collections applied to valid receivables?', 'Are aged receivables supportable?'],
    keyFields: ['customer', 'invoice', 'collection document', 'aging bucket', 'trading partner', 'fund'],
    risks: ['Aged debt', 'Incorrect write-off', 'Unapplied collection']
  },
  {
    id: 'budget-detail',
    layer: 'transactions',
    title: 'Budgetary Detail',
    subtitle: 'Commitment, obligation, expenditure, outlay',
    icon: 'BD',
    tags: ['budgetary', 'commitment', 'obligation', 'outlay', 'SBR'],
    summary: 'Detailed budgetary activity explaining how authority becomes commitments, obligations, expenditures, and outlays.',
    examples: ['Budget authority', 'Commitment', 'Obligation', 'Expenditure', 'Outlay', 'Cancellation/adjustment'],
    auditQuestions: ['Can each SBR line be traced to valid budgetary documents?', 'Are obligations supported and valid?', 'Are cancellations and upward/downward adjustments explainable?'],
    keyFields: ['budgetary document', 'fund', 'TAS', 'BOC', 'organization', 'program', 'amount'],
    risks: ['Invalid budgetary status', 'Stale ULO', 'Broken document chain']
  },
  {
    id: 'cost-detail',
    layer: 'transactions',
    title: 'Cost / Labor Detail',
    subtitle: 'Project, program, cost object, labor distribution',
    icon: 'CD',
    tags: ['cost', 'labor', 'project', 'program'],
    summary: 'Cost-object detail showing labor distribution, project/task, program, organization, allocation, and expenditure activity.',
    examples: ['Labor cost', 'Project actual', 'Cost transfer', 'Allocation cycle', 'Program cost'],
    auditQuestions: ['Do costs support the Statement of Net Cost?', 'Are transfers approved?', 'Do program costs reconcile to GL?'],
    keyFields: ['project', 'program', 'cost object', 'organization', 'expenditure item', 'amount'],
    risks: ['Wrong cost object', 'Unsupported transfer', 'Net cost misclassification']
  },
  {
    id: 'asset-detail',
    layer: 'transactions',
    title: 'Asset Detail',
    subtitle: 'Asset master and transaction detail',
    icon: 'AD',
    tags: ['asset', 'PP&E', 'depreciation'],
    summary: 'Asset-level detail showing additions, depreciation, transfers, retirements, location, and physical-support attributes.',
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
    summary: 'Control detail used to prove completeness and accuracy between source systems, accepted records, rejected records, subledger objects, and GL.',
    examples: ['Batch control', 'Accepted record', 'Rejected record', 'Error queue', 'Source-to-target reconciliation'],
    auditQuestions: ['Were all source records accepted or resolved?', 'Do control totals reconcile?', 'Are manual corrections approved?'],
    keyFields: ['interface ID', 'batch ID', 'source key', 'status', 'control total', 'error code', 'processed date'],
    risks: ['Aged rejects', 'Incomplete population', 'Manual bypass of controls']
  },
  {
    id: 'sla',
    layer: 'accounting',
    title: 'Oracle Subledger Accounting',
    subtitle: 'Events, rules, supporting references',
    icon: 'SLA',
    tags: ['SLA', 'subledger accounting', 'accounting rules', 'supporting references'],
    summary: 'Transforms subledger accounting events into journal entries using accounting methods, journal line definitions, account derivation rules, and supporting references.',
    examples: ['Invoice validated event', 'Payment event', 'Receipt accrual event', 'AR invoice/receipt event', 'Asset depreciation event'],
    auditQuestions: ['Are accounting rules approved and current?', 'Do subledger events account completely?', 'Do supporting references preserve source, project, fund, and trading-partner lineage?'],
    keyFields: ['event ID', 'event class', 'ledger', 'accounting date', 'account combination', 'supporting reference', 'debit', 'credit'],
    risks: ['Unaccounted event', 'Invalid account derivation', 'Unsupported manual override']
  },
  {
    id: 'budgetary-accounting',
    layer: 'accounting',
    title: 'Budgetary Accounting',
    subtitle: 'USSGL authority, obligations, outlays',
    icon: 'BA',
    tags: ['budgetary', 'USSGL', 'SBR', 'obligation'],
    summary: 'Records budgetary resources, status of resources, commitments, obligations, expenditures, and outlays that support SBR and GTAS reporting.',
    examples: ['Budget authority', 'Commitment', 'Obligation', 'Expenditure', 'Outlay'],
    auditQuestions: ['Do budgetary USSGL balances support SBR lines?', 'Are obligations complete and valid?', 'Do outlays reconcile to Treasury reporting?'],
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
    summary: 'Records assets, liabilities, net position, revenues, financing sources, expenses, gains, and losses that support Balance Sheet and Net Cost reporting.',
    examples: ['Asset', 'Liability', 'Expense', 'Revenue', 'Net position', 'Gain/loss'],
    auditQuestions: ['Do proprietary balances reconcile to subledgers?', 'Are expenses and assets classified correctly?', 'Are liabilities complete?'],
    keyFields: ['USSGL', 'account combination', 'fund', 'organization', 'project', 'trading partner', 'amount'],
    risks: ['Unsupported balance', 'Net cost misclassification', 'AP/AR/asset reconciliation gap']
  },
  {
    id: 'gl',
    layer: 'accounting',
    title: 'General Ledger',
    subtitle: 'Journal header, line, ledger, close',
    icon: 'GL',
    tags: ['GL', 'journal', 'trial balance', 'period close'],
    summary: 'Official accounting journal lines where budgetary and proprietary activity lands for trial balance, close, reconciliation, and downstream reporting.',
    examples: ['Journal header', 'Journal line', 'Manual journal', 'Subledger journal import', 'Period close', 'Trial balance extract'],
    auditQuestions: ['Does every GL line have source support?', 'Do subledger journals reconcile to GL?', 'Was subledger transfer performed at detail or summary level and is drillback retained?'],
    keyFields: ['journal ID', 'journal line', 'ledger', 'accounting date', 'account combination', 'debit', 'credit', 'subledger link'],
    risks: ['Unsupported manual journal', 'Subledger-to-GL mismatch', 'Summary posting breaks lineage']
  },
  {
    id: 'ops-reporting',
    layer: 'reporting',
    title: 'DEAMS Operational Reporting',
    subtitle: 'Reports, dashboards, extracts, close packages',
    icon: 'BI',
    tags: ['reporting', 'dashboard', 'extract', 'close'],
    summary: 'Provides operational reports, dashboards, data extracts, and management analytics for transaction populations, open obligations, AP/AR aging, and close controls.',
    examples: ['AP aging', 'Open obligations', 'Interface error report', 'SLA-to-GL reconciliation', 'Trial balance extract'],
    auditQuestions: ['Are report definitions documented?', 'Do extracts reconcile to source objects?', 'Are report totals tied to GL, subledger, and interface control totals?'],
    keyFields: ['report ID', 'extract date', 'selection criteria', 'source object', 'control total'],
    risks: ['Undocumented logic', 'Wrong population', 'Extract not reconciled']
  },
  {
    id: 'ddrs',
    layer: 'reporting',
    title: 'DDRS',
    subtitle: 'DoD reporting edits and packages',
    icon: 'DDRS',
    tags: ['DDRS', 'trial balance', 'financial reporting'],
    summary: 'Receives DEAMS/GL trial-balance data and supports DoD reporting edits, validations, adjustments, and financial reporting packages.',
    examples: ['Trial balance', 'Validation edit', 'Adjustment', 'Reporting package'],
    auditQuestions: ['Does DDRS reconcile to DEAMS GL?', 'Are adjustments approved?', 'Do attributes support reporting rules?'],
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
    examples: ['GTAS ATB', 'Edit validation', 'Elimination', 'Reclassification', 'Attribute support'],
    auditQuestions: ['Do GTAS attributes align to USSGL and TAS?', 'Are edits resolved?', 'Are eliminations supported?'],
    keyFields: ['USSGL', 'TAS', 'trading partner', 'BETC', 'attribute', 'amount', 'edit status', 'reporting period'],
    risks: ['GTAS edit failure', 'Trading partner mismatch', 'Unsupported elimination']
  },
  {
    id: 'external-reporting',
    layer: 'reporting',
    title: 'USSGL / A-136 Crosswalks',
    subtitle: 'Statement mapping and note schedules',
    icon: 'EXT',
    tags: ['USSGL', 'crosswalk', 'statements', 'notes'],
    summary: 'Maps USSGL trial-balance amounts and attributes to financial statement lines, note schedules, statutory reports, and audit support packages.',
    examples: ['USSGL crosswalk', 'Statement line', 'Note schedule', 'Agency reporting package', 'Budget-accrual reconciliation support'],
    auditQuestions: ['Is crosswalk logic current?', 'Do statement lines reconcile to ATB?', 'Are notes tied to schedules?'],
    keyFields: ['statement line', 'USSGL', 'attribute', 'crosswalk rule', 'source balance'],
    risks: ['Wrong statement mapping', 'Incomplete note support', 'Crosswalk not updated']
  },
  {
    id: 'treasury',
    layer: 'reporting',
    title: 'FBwT / CARS / Treasury',
    subtitle: 'Fund balance, collections, disbursements',
    icon: 'TR',
    tags: ['FBwT', 'Treasury', 'CARS', 'cash', 'disbursement'],
    summary: 'Supports Fund Balance with Treasury, collections, disbursements, Treasury confirmations, and reconciliation to cash-related statement and note balances.',
    examples: ['Disbursement', 'Collection', 'CARS confirmation', 'FBwT reconciliation', 'Treasury adjustment'],
    auditQuestions: ['Do collections and disbursements reconcile to Treasury?', 'Are FBwT differences researched?', 'Do payment/collection schedules tie to GL?'],
    keyFields: ['TAS', 'BETC', 'ALC', 'schedule number', 'payment ID', 'collection ID', 'amount'],
    risks: ['Unreconciled FBwT', 'Unsupported disbursement', 'Collection not applied correctly']
  },
  {
    id: 'balance-sheet',
    layer: 'statements',
    title: 'Balance Sheet',
    subtitle: 'Assets, liabilities, net position',
    icon: 'BS',
    tags: ['balance sheet', 'assets', 'liabilities', 'net position'],
    summary: 'Reports assets, liabilities, and net position for Department of the Air Force reporting entities.',
    examples: ['Fund Balance with Treasury', 'Accounts receivable', 'PP&E', 'Accounts payable', 'Net position'],
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
    title: 'Notes / Required Schedules',
    subtitle: 'Disclosures, reconciliations, audit support',
    icon: 'NOTE',
    tags: ['notes', 'disclosure', 'schedule', 'audit support'],
    summary: 'Provides disclosures, note schedules, reconciliations, and supplementary information supporting statement lines.',
    examples: ['FBwT note', 'Accounts receivable note', 'PP&E note', 'Intragovernmental note', 'Reconciliation schedule'],
    auditQuestions: ['Do notes tie to ATB and schedules?', 'Are disclosures complete?', 'Are reconciliations retained?'],
    keyFields: ['note line', 'schedule', 'source amount', 'reconciliation', 'owner'],
    risks: ['Note does not tie', 'Unsupported disclosure', 'Incomplete schedule']
  }
];

const deamsLineageScenarios = [
  {
    id: 'p2p',
    title: 'Requisition -> Award -> Receipt -> Invoice -> Payment',
    short: 'Procure-to-Pay',
    description: 'Shows how DAF procurement activity moves from demand and award evidence through DEAMS purchasing, AP, SLA, GL, reporting, and statement support.',
    path: ['contracting', 'piee', 'p2p', 'po-detail', 'ap-detail', 'sla', 'gl', 'ddrs', 'gtas', 'balance-sheet', 'net-cost', 'sbr'],
    steps: [
      'Requisition demand and contract award/modification evidence establish the procurement requirement.',
      'DEAMS creates PO/agreement lines, shipments, distributions, and budgetary control records.',
      'PIEE/WAWF provides receipt, acceptance, and invoice evidence.',
      'AP validation, matching, holds, approvals, and payment-ready processing create accounting events for SLA.',
      'SLA creates subledger journal entries and transfers supported accounting to GL.',
      'Trial balance, GTAS, and statement lines rely on supported AP, expense, asset, and outlay populations.'
    ],
    exceptionTests: ['award without obligation', 'invoice without receipt or acceptance', 'SLA event not accounted', 'payment without AP support', 'subledger-to-GL transfer mismatch']
  },
  {
    id: 'travel',
    title: 'Travel Authorization -> Voucher -> Outlay',
    short: 'Travel',
    description: 'Shows how travel activity flows from DTS through DEAMS budgetary control, AP/payment activity, SLA, GL, SBR, and net-cost support.',
    path: ['dts', 'budget', 'budget-detail', 'budgetary-accounting', 'sla', 'gl', 'treasury', 'gtas', 'sbr', 'net-cost'],
    steps: [
      'DTS creates authorization and voucher with accounting string and approvals.',
      'DEAMS records or adjusts the obligation and budgetary status.',
      'Voucher approval and payment activity liquidate or adjust the obligation.',
      'SLA creates accounting from the approved travel/payment event and transfers it to GL.',
      'Treasury, SBR, and net-cost lines rely on valid travel populations and timing.'
    ],
    exceptionTests: ['approved travel without obligation', 'voucher paid but obligation remains open', 'wrong accounting string', 'period mismatch', 'travel source total not reconciled to DEAMS']
  },
  {
    id: 'reimbursables',
    title: 'Agreement -> Billing -> Collection -> Trading Partner Reporting',
    short: 'Reimbursables',
    description: 'Shows how reimbursable and intragovernmental activity flows through DEAMS AR, collections, SLA, GL, GTAS, notes, and eliminations.',
    path: ['ginvoicing', 'reimbursables', 'ar-detail', 'sla', 'proprietary-accounting', 'gl', 'treasury', 'gtas', 'balance-sheet', 'net-cost', 'notes'],
    steps: [
      'G-Invoicing agreement/order or customer order establishes reimbursable authority and trading-partner context.',
      'DEAMS records billable activity, invoice, AR, and collection detail.',
      'Collections, including IPAC where applicable, liquidate receivables and support FBwT reconciliation.',
      'SLA and GL postings preserve customer, project, fund, and trading-partner attributes.',
      'GTAS, notes, and statement lines tie to AR, revenue, collections, and trading-partner schedules.'
    ],
    exceptionTests: ['unbilled reimbursable work', 'aged AR', 'collection not applied', 'trading partner mismatch', 'G-Invoicing order not reconciled to DEAMS billing']
  },
  {
    id: 'payroll-cost',
    title: 'Payroll Source -> Cost Assignment -> Net Cost',
    short: 'Payroll Cost',
    description: 'Shows how payroll and labor source data becomes DEAMS cost assignment, SLA/GL expense or liability, and net-cost reporting.',
    path: ['dcps', 'costing', 'cost-detail', 'sla', 'proprietary-accounting', 'gl', 'ddrs', 'gtas', 'net-cost', 'balance-sheet'],
    steps: [
      'Payroll source provides pay, benefits, labor, and organization detail.',
      'DEAMS maps payroll and labor distribution to organization, program, project, and funding structures.',
      'Cost detail supports management reporting, allocations, and Statement of Net Cost.',
      'SLA and GL record expense, liability, and clearing activity.',
      'Net-cost and balance-sheet lines rely on complete population and valid assignment.'
    ],
    exceptionTests: ['payroll source total not reconciled', 'invalid program or cost object', 'wrong organization or fund', 'missing accrual', 'unsupported allocation']
  },
  {
    id: 'asset',
    title: 'Asset Source -> Capitalization -> Depreciation -> PP&E Support',
    short: 'Fixed Assets',
    description: 'Shows how asset events flow from source/receiving evidence through DEAMS fixed assets, accounting, GL, and PP&E reporting.',
    path: ['mission-logistics', 'piee', 'assets', 'asset-detail', 'sla', 'proprietary-accounting', 'gl', 'ddrs', 'gtas', 'balance-sheet', 'notes'],
    steps: [
      'Asset purchase, AP invoice distribution, or mission/logistics source event provides receiving and capitalization evidence.',
      'DEAMS creates mass additions or asset records and updates asset transaction detail.',
      'Capitalization, depreciation, transfers, and retirements create accounting events.',
      'SLA and GL postings support PP&E balances, depreciation expense, gains/losses, and retirements.',
      'Notes and schedules support existence, completeness, valuation, and disclosure.'
    ],
    exceptionTests: ['asset received but not capitalized', 'AP distribution not sent to assets', 'retired asset still active', 'asset ledger not reconciled to GL', 'missing physical evidence']
  },
  {
    id: 'close-report',
    title: 'Subledger Close -> GL Close -> Trial Balance -> Statements',
    short: 'Close / Report',
    description: 'Shows how DEAMS close controls move from interfaces and subledgers through GL, DDRS, GTAS, crosswalks, and statements.',
    path: ['interface-detail', 'close', 'sla', 'gl', 'ops-reporting', 'ddrs', 'gtas', 'external-reporting', 'balance-sheet', 'sbr', 'notes'],
    steps: [
      'Interface errors, rejected records, and subledger exceptions are resolved or explained.',
      'Subledger accounting is completed and reconciled to GL.',
      'GL closes by period and produces trial-balance extracts.',
      'DDRS/GTAS validations, adjustments, and crosswalks map balances to statement lines.',
      'Notes and audit packages tie statement lines back to reconciled populations.'
    ],
    exceptionTests: ['unaccounted SLA event at close', 'unsupported manual journal', 'DDRS/GTAS edit failure', 'trial balance not reconciled to GL', 'note schedule not tied to ATB']
  }
];

const deamsSupportServices = [
  { title: 'Oracle Master Data', detail: 'Suppliers, customers, organizations, projects, programs, funds, accounts, assets, and DAF accounting strings.' },
  { title: 'Interfaces & Controls', detail: 'Batch files, APIs, accepted/rejected records, control totals, suspense/error queues, and source-to-target reconciliation.' },
  { title: 'Workflow & Approvals', detail: 'Requisition, purchase, invoice, journal, travel, reimbursable, asset, and close-adjustment approval routing.' },
  { title: 'Security & Access', detail: 'Role-based access, segregation of duties, privileged access, system audit logs, and sensitive transaction monitoring.' },
  { title: 'Period Close', detail: 'Interface resolution, subledger close, GL close, reconciliations, trial-balance extracts, and reporting package controls.' },
  { title: 'Data Governance', detail: 'Authoritative sources, data definitions, SFIS/USSGL attributes, lineage, validation rules, stewardship, and issue remediation.' },
  { title: 'Modernization', detail: 'Cloud hosting, integration modernization, reporting automation, audit analytics, and AI-enabled UoT testing.' }
];

const deamsCaveats = [
  'DEAMS is modeled here as a public-information, representative Oracle-based Department of the Air Force financial-management architecture.',
  'Exact DEAMS modules, interfaces, ledgers, responsibilities, reports, accounting rules, and configurations require authoritative DEAMS program data.',
  'The blueprint uses Oracle EBS/Federal Financials process patterns plus DoD and Treasury reporting requirements rather than claiming exact DEAMS table names or implementation settings.',
  'Source systems may be feeders, authoritative mission systems, shared services, or peer systems depending on the business event and DAF organization.'
];

const gafsLayers = [
  { id: 'source', label: 'Source / Feeder Events', short: 'Source', description: 'Travel, contract, payroll, disbursing, collection, reimbursable, logistics, and manual source events that create Air Force accounting demand before GAFS processing.' },
  { id: 'base', label: 'GAFS-BL Base-Level Accounting', short: 'GAFS-BL', description: 'Base-level legacy accounting intake, editing, funds control, posting, suspense, and local close activity. Public information does not support calling this SAP or Oracle ERP.' },
  { id: 'central', label: 'GAFS-R / Central Profile', short: 'GAFS-R', description: 'Central/rehost/reporting profile that consolidates base-level accounting activity, produces trial-balance and status reporting, and supports transition or reconciliation to enterprise reporting.' },
  { id: 'accounting', label: 'Accounting / Journal Voucher Layer', short: 'Accounting', description: 'Budgetary and proprietary accounting, standard general ledger classification, manual journal vouchers, reversals, accruals, eliminations, and close adjustments.' },
  { id: 'reporting', label: 'Reporting / Treasury Layer', short: 'Reporting', description: 'DDRS, GTAS, USSGL crosswalks, CARS/FBwT reconciliation, IPAC/G-Invoicing settlement evidence, management reports, and audit populations.' },
  { id: 'statements', label: 'Financial Statement Support', short: 'Statements', description: 'Statement of Budgetary Resources, Balance Sheet, Statement of Net Cost, note schedules, and audit support tied back to GAFS source, posting, and reporting evidence.' }
];

const gafsNodes = [
  {
    id: 'dts-gafs',
    layer: 'source',
    title: 'DTS / Travel Feeds',
    subtitle: 'Travel authorization, voucher, and settlement events',
    icon: 'DTS',
    tags: ['travel', 'source', 'obligation', 'voucher'],
    summary: 'Provides travel authorizations, vouchers, local vouchers, advances, and travel-card settlement activity that should trace to GAFS budgetary and proprietary postings.',
    examples: ['Travel authorization', 'Travel voucher', 'Local voucher', 'Advance', 'Split disbursement'],
    auditQuestions: ['Does each approved voucher trace to a GAFS accounting event?', 'Are stale travel obligations reviewed and adjusted?', 'Do DTS totals reconcile to accepted GAFS postings?'],
    keyFields: ['authorization number', 'voucher number', 'traveler ID', 'LOA', 'TAS', 'amount', 'approval date'],
    risks: ['approved travel not posted', 'voucher paid but obligation not liquidated', 'invalid LOA', 'summary feed loses transaction detail']
  },
  {
    id: 'contract-vendor-gafs',
    layer: 'source',
    title: 'Contract / Vendor Pay Sources',
    subtitle: 'Award, receipt, invoice, acceptance, and payment evidence',
    icon: 'P2P',
    tags: ['contract', 'invoice', 'payment', 'procure-to-pay'],
    summary: 'Provides contract award, modification, receipt, acceptance, invoice, and payment-support data that must reconcile to obligations, expenditures, and disbursements.',
    examples: ['Contract award', 'Modification', 'Receiving report', 'Vendor invoice', 'Disbursement schedule'],
    auditQuestions: ['Can obligations trace to valid award and funding evidence?', 'Does payment activity have receipt/acceptance support?', 'Are rejected or suspense items cleared before close?'],
    keyFields: ['PIID', 'mod number', 'CLIN', 'invoice number', 'vendor', 'disbursement voucher', 'amount'],
    risks: ['unsupported payment', 'award not obligated', 'duplicate invoice', 'payment posted to wrong accounting classification']
  },
  {
    id: 'payroll-labor-gafs',
    layer: 'source',
    title: 'Payroll / Labor Sources',
    subtitle: 'Civilian pay, military pay support, and labor costing',
    icon: 'PAY',
    tags: ['payroll', 'labor', 'expense', 'accrual'],
    summary: 'Supplies pay-period cost, benefits, labor distribution, accrual, and adjustment data for expense recognition and net-cost reporting.',
    examples: ['Civilian payroll feed', 'Labor distribution', 'Benefits', 'Payroll accrual', 'Pay correction'],
    auditQuestions: ['Do payroll totals reconcile to GAFS postings?', 'Are labor costs assigned to valid organization and program values?', 'Are accruals recorded and reversed in the correct periods?'],
    keyFields: ['pay period', 'person identifier', 'organization', 'fund cite', 'program', 'gross pay', 'benefit amount'],
    risks: ['unreconciled payroll feed', 'wrong cost assignment', 'missing accrual', 'unsupported adjustment']
  },
  {
    id: 'disbursing-collections-gafs',
    layer: 'source',
    title: 'Disbursing / Collections',
    subtitle: 'Outlays, collections, IPAC, and cash activity',
    icon: 'CASH',
    tags: ['cash', 'outlay', 'collection', 'IPAC', 'FBwT'],
    summary: 'Provides payment, collection, cancellation, adjustment, and intragovernmental settlement activity that should reconcile to Fund Balance with Treasury and reporting outputs.',
    examples: ['Disbursement', 'Collection', 'Cancelled payment', 'IPAC settlement', 'Deposit ticket'],
    auditQuestions: ['Do disbursements and collections reconcile to Treasury records?', 'Are IPAC settlements tied to trading partner detail?', 'Are unmatched cash differences researched and resolved?'],
    keyFields: ['voucher number', 'disbursing station', 'TAS', 'BETC', 'ALC', 'trading partner', 'amount'],
    risks: ['FBwT unreconciled difference', 'unmatched collection', 'incorrect TAS/BETC', 'trading partner mismatch']
  },
  {
    id: 'manual-source-gafs',
    layer: 'source',
    title: 'Manual Requests / Exception Inputs',
    subtitle: 'Corrections, accruals, reclasses, and late source evidence',
    icon: 'REQ',
    tags: ['manual', 'journal voucher', 'exception', 'correction'],
    summary: 'Originates supported correction requests when source feeds are incomplete, late, classified incorrectly, or require accrual, reclassification, reversal, or close adjustment.',
    examples: ['Correction request', 'Accrual request', 'Reclassification', 'Reversal request', 'Unsupported transaction research'],
    auditQuestions: ['Is the request tied to a real source exception?', 'Does the package include preparer, reviewer, approver, and evidence?', 'Was the JV reversed or cleared when no longer valid?'],
    keyFields: ['request ID', 'source document', 'reason code', 'period', 'debit', 'credit', 'approval date'],
    risks: ['JV used as substitute for source processing', 'missing approval', 'late-period manual entry', 'reversal not processed']
  },
  {
    id: 'gafs-bl-intake',
    layer: 'base',
    title: 'GAFS-BL Intake / Edit',
    subtitle: 'Base-level batch and online transaction acceptance',
    icon: 'BL',
    tags: ['GAFS-BL', 'legacy', 'edit', 'interface'],
    summary: 'Accepts base-level transactions from local entry, feeders, batch files, or interface control processes and applies format, accounting, fund, period, and edit checks before posting.',
    examples: ['Accepted batch', 'Rejected batch', 'Online accounting input', 'Interface control total', 'Edit report'],
    auditQuestions: ['Are accepted and rejected records controlled?', 'Do feeder totals match GAFS-BL accepted totals?', 'Are rejects researched and reprocessed with evidence?'],
    keyFields: ['batch ID', 'document number', 'fiscal year', 'accounting classification', 'TAS', 'USSGL', 'amount'],
    risks: ['lost interface record', 'reject not corrected', 'control total mismatch', 'posting without valid edit evidence']
  },
  {
    id: 'gafs-bl-funds',
    layer: 'base',
    title: 'Funds Control / Budget Execution',
    subtitle: 'Authority, commitment, obligation, expenditure, outlay',
    icon: 'FUND',
    tags: ['funds control', 'budgetary', 'SBR', 'obligation'],
    summary: 'Supports budget execution lifecycle control from authority and allotment through commitments, obligations, expenditures, collections, recoveries, and outlays.',
    examples: ['Budget authority', 'Allotment', 'Commitment', 'Obligation', 'Expenditure', 'Outlay', 'Recovery'],
    auditQuestions: ['Can SBR lines trace to budgetary source events?', 'Are obligations valid, timely, and supported?', 'Are upward/downward adjustments documented?'],
    keyFields: ['appropriation', 'fund cite', 'program element', 'object class', 'commitment/obligation number', 'amount', 'period'],
    risks: ['over-obligation', 'stale ULO', 'unsupported upward adjustment', 'incorrect apportionment or allotment classification']
  },
  {
    id: 'gafs-bl-suspense',
    layer: 'base',
    title: 'Suspense / Reject Resolution',
    subtitle: 'Failed edits, unmatched postings, and exception queues',
    icon: 'ERR',
    tags: ['suspense', 'reject', 'exception', 'reconciliation'],
    summary: 'Tracks transactions that fail accounting edits, lack valid reference data, mismatch control totals, or require research before they can be posted or reported.',
    examples: ['Reject report', 'Suspense item', 'Invalid LOA', 'Unmatched disbursement', 'Correction batch'],
    auditQuestions: ['Are aged suspense items monitored?', 'Are corrections traceable to original rejects?', 'Do rejected populations reconcile to later accepted postings or removals?'],
    keyFields: ['reject code', 'batch ID', 'document number', 'reason', 'owner', 'aging', 'resolution date'],
    risks: ['aged suspense hides misstatement', 'duplicate reprocessing', 'unexplained deletion', 'manual workaround without evidence']
  },
  {
    id: 'gafs-r-consolidation',
    layer: 'central',
    title: 'GAFS-R Consolidation',
    subtitle: 'Central profile, rehost, and reporting accumulation',
    icon: 'G-R',
    tags: ['GAFS-R', 'central', 'consolidation', 'trial balance'],
    summary: 'Consolidates base-level activity into central accounting/reporting views, maintaining fiscal-period balances, summary detail, and extracts for enterprise reporting and reconciliation.',
    examples: ['Base-to-central feed', 'Accepted central load', 'Period balance', 'Trial balance extract', 'Historical archive'],
    auditQuestions: ['Do base-level totals reconcile to GAFS-R totals?', 'Are central loads complete and timely?', 'Are historical balances tied to current reporting extracts?'],
    keyFields: ['base identifier', 'period', 'TAS', 'USSGL', 'fund cite', 'document total', 'load date'],
    risks: ['base-to-central out of balance', 'missing central load', 'summary loses source reference', 'period cutoff mismatch']
  },
  {
    id: 'legacy-modern-bridge',
    layer: 'central',
    title: 'Legacy / Modernization Bridge',
    subtitle: 'Crosswalks, extracts, and coexistence controls',
    icon: 'XWALK',
    tags: ['modernization', 'crosswalk', 'migration', 'DEAMS'],
    summary: 'Provides mapping, extracts, historical data, and reconciliation controls where GAFS activity coexists with or migrates to modern target environments and enterprise reporting stores.',
    examples: ['Chart crosswalk', 'Historical extract', 'Balance conversion', 'Dual-run reconciliation', 'Audit archive'],
    auditQuestions: ['Are old and new accounting classifications crosswalked?', 'Do converted balances reconcile?', 'Is the audit archive complete enough to support source-to-statement testing?'],
    keyFields: ['legacy account', 'target account', 'TAS', 'USSGL', 'fund cite', 'conversion period', 'reconciliation total'],
    risks: ['crosswalk error', 'lost historical detail', 'unreconciled converted balance', 'duplicate posting during coexistence']
  },
  {
    id: 'gafs-jv',
    layer: 'accounting',
    title: 'GAFS Journal Voucher',
    subtitle: 'Manual accrual, reclass, correction, and close adjustment',
    icon: 'JV',
    tags: ['journal voucher', 'manual adjustment', 'accrual', 'reclass', 'close'],
    summary: 'Records supported debit/credit adjustments when normal source processing cannot fully or correctly represent the event before close or reporting.',
    examples: ['Accrual JV', 'Reclassification JV', 'Reversal JV', 'Elimination adjustment', 'Error correction'],
    auditQuestions: ['Is the JV linked to a real source condition and approved package?', 'Do debits equal credits and map to valid USSGL/TAS values?', 'Was a required reversal posted in the correct period?'],
    keyFields: ['JV number', 'document date', 'posting period', 'TAS', 'USSGL', 'debit amount', 'credit amount', 'approver'],
    risks: ['unsupported top-side adjustment', 'JV masks source-system defect', 'incorrect USSGL', 'missing reversal', 'SoD violation']
  },
  {
    id: 'budget-prop-accounting',
    layer: 'accounting',
    title: 'Budgetary / Proprietary Accounting',
    subtitle: 'USSGL classification and accounting equation support',
    icon: 'GL',
    tags: ['USSGL', 'budgetary', 'proprietary', 'GL'],
    summary: 'Classifies accepted activity into budgetary and proprietary accounts, supports debit/credit balance logic, and prepares balances for reporting crosswalks.',
    examples: ['Budgetary posting', 'Proprietary posting', 'Accrual', 'Liquidation', 'Reversal', 'Year-end closing entry'],
    auditQuestions: ['Do budgetary and proprietary postings remain in balance?', 'Are USSGL accounts valid for the transaction type?', 'Do adjustments preserve source lineage?'],
    keyFields: ['USSGL', 'TAS', 'fund cite', 'debit', 'credit', 'period', 'document number'],
    risks: ['invalid USSGL', 'out-of-balance posting', 'budget/proprietary mismatch', 'manual entry lacks source support']
  },
  {
    id: 'gafs-trial-balance',
    layer: 'reporting',
    title: 'Trial Balance / DDRS Feed',
    subtitle: 'Adjusted trial balance and DoD reporting support',
    icon: 'TB',
    tags: ['trial balance', 'DDRS', 'GTAS', 'reporting'],
    summary: 'Produces adjusted trial-balance and financial-reporting feeds used for DDRS, GTAS validation, management reporting, and financial-statement compilation.',
    examples: ['Adjusted trial balance', 'DDRS feed', 'GTAS extract', 'Edit report', 'Tie-point reconciliation'],
    auditQuestions: ['Does the trial balance reconcile to GAFS-R and GL balances?', 'Are DDRS/GTAS edits cleared with evidence?', 'Do reporting attributes support line-item crosswalks?'],
    keyFields: ['TAS', 'USSGL', 'period', 'beginning balance', 'debit', 'credit', 'ending balance', 'attribute'],
    risks: ['trial balance not tied to source', 'GTAS edit failure', 'incorrect reporting attribute', 'late adjustment after certified extract']
  },
  {
    id: 'treasury-gafs',
    layer: 'reporting',
    title: 'Treasury / Intragovernmental Reporting',
    subtitle: 'GTAS, FBwT, IPAC, trading partner, and USSGL controls',
    icon: 'TRY',
    tags: ['Treasury', 'GTAS', 'FBwT', 'IPAC', 'USSGL'],
    summary: 'Supports Treasury and intragovernmental reconciliation through TAS/BETC, USSGL, trading-partner, CARS/FBwT, GTAS, IPAC, and G-Invoicing alignment.',
    examples: ['GTAS submission', 'FBwT reconciliation', 'IPAC settlement', 'Trading-partner elimination', 'USSGL crosswalk'],
    auditQuestions: ['Do TAS/BETC values reconcile to Treasury?', 'Are trading partner attributes complete?', 'Can USSGL balances pass GTAS edits and crosswalk to statements?'],
    keyFields: ['TAS', 'BETC', 'ALC', 'USSGL', 'trading partner', 'GTAS attribute', 'amount'],
    risks: ['FBwT difference', 'GTAS edit failure', 'trading partner mismatch', 'missing intragovernmental support']
  },
  {
    id: 'gafs-sbr',
    layer: 'statements',
    title: 'Statement of Budgetary Resources',
    subtitle: 'Authority-to-outlay statement support',
    icon: 'SBR',
    tags: ['SBR', 'budgetary', 'statement', 'audit'],
    summary: 'Uses GAFS budgetary activity to support beginning unobligated balance, budget authority, obligations incurred, outlays, recoveries, and unobligated balance reporting.',
    examples: ['Budgetary resources', 'Obligations incurred', 'Unpaid obligations', 'Outlays', 'Recoveries'],
    auditQuestions: ['Can each SBR line trace to GAFS budgetary transactions?', 'Are obligations valid and supported?', 'Do outlays reconcile to Treasury?'],
    keyFields: ['TAS', 'USSGL budgetary account', 'fund cite', 'period', 'SBR line', 'amount'],
    risks: ['unsupported obligation', 'stale ULO', 'misclassified outlay', 'budgetary trial balance mismatch']
  },
  {
    id: 'gafs-financial-statements',
    layer: 'statements',
    title: 'Balance Sheet / Net Cost / Notes',
    subtitle: 'Proprietary statement and note support',
    icon: 'FS',
    tags: ['balance sheet', 'net cost', 'notes', 'audit'],
    summary: 'Supports proprietary balances, expenses, assets, liabilities, net cost, note schedules, and audit evidence packages using GAFS and reporting-layer data.',
    examples: ['Fund Balance with Treasury', 'Accounts payable', 'Accounts receivable', 'Expense', 'Net cost', 'Note schedule'],
    auditQuestions: ['Do proprietary balances reconcile to trial balance?', 'Are note schedules tied to supporting detail?', 'Do manual adjustments have approved evidence?'],
    keyFields: ['USSGL proprietary account', 'TAS', 'line item', 'note schedule', 'document number', 'amount'],
    risks: ['unsupported account balance', 'note schedule does not tie', 'late manual adjustment', 'classification error']
  }
];

const gafsLineageScenarios = [
  {
    id: 'gafs-jv-control',
    short: 'JV control',
    title: 'GAFS Journal Voucher Control Path',
    description: 'Shows how a GAFS correction, accrual, reclass, or reversal should move from a real source exception to a controlled JV package, posting, reporting, and audit evidence.',
    path: ['manual-source-gafs', 'gafs-bl-intake', 'gafs-jv', 'budget-prop-accounting', 'gafs-trial-balance', 'gafs-financial-statements'],
    steps: [
      'A source exception, period-end estimate, reconciliation difference, or classification error is identified and documented.',
      'The preparer assembles source evidence, reason code, accounting classification, debit/credit lines, and reversal instructions when needed.',
      'Review and approval verify authority, segregation of duties, accounting validity, and period cutoff.',
      'GAFS-BL accepts or rejects the JV input; exceptions are corrected through controlled resubmission.',
      'GAFS-R and trial-balance extracts reflect the accepted posting and support DDRS, GTAS, or statement reporting.',
      'Auditors trace from statement line to trial balance, JV record, approval package, and original source condition.'
    ],
    exceptionTests: ['JV without source exception', 'debits do not equal credits', 'invalid TAS/USSGL', 'missing approval', 'reversal not posted', 'late close adjustment not in reporting package']
  },
  {
    id: 'gafs-budget-execution',
    short: 'budget execution',
    title: 'GAFS Budget Execution Path',
    description: 'Shows how budgetary resources move through GAFS-BL funds control, GAFS-R consolidation, trial balance, Treasury reporting, and SBR support.',
    path: ['contract-vendor-gafs', 'gafs-bl-intake', 'gafs-bl-funds', 'gafs-r-consolidation', 'gafs-trial-balance', 'gafs-sbr'],
    steps: [
      'A funded procurement, travel, payroll, or local requirement creates a valid accounting classification and source document.',
      'GAFS-BL validates the input and records commitment, obligation, expenditure, outlay, recovery, or adjustment activity.',
      'Rejects and suspense items are researched until accepted, corrected, or formally removed.',
      'GAFS-R consolidates accepted base-level activity and prepares period balances.',
      'Trial-balance and reporting extracts support DDRS, GTAS validation, and SBR line-item crosswalks.',
      'Audit testing traces SBR lines back to source documents and base-level posting evidence.'
    ],
    exceptionTests: ['source amount not in GAFS-BL', 'base-to-central imbalance', 'stale obligation', 'budgetary/proprietary mismatch', 'GTAS edit failure']
  },
  {
    id: 'gafs-cash-recon',
    short: 'cash recon',
    title: 'GAFS Disbursing, Collections, and FBwT Path',
    description: 'Shows how disbursement, collection, IPAC, and Treasury cash activity should reconcile to GAFS postings and statement balances.',
    path: ['disbursing-collections-gafs', 'gafs-bl-intake', 'gafs-bl-suspense', 'gafs-r-consolidation', 'treasury-gafs', 'gafs-financial-statements'],
    steps: [
      'Payment, collection, cancellation, or IPAC activity is received with TAS/BETC, ALC, voucher, and trading-partner detail.',
      'GAFS-BL accepts valid cash activity or routes mismatches to suspense and reject resolution.',
      'Cash and accounting totals reconcile from base records to central profile balances.',
      'Treasury, CARS/FBwT, GTAS, and intragovernmental evidence are matched to reporting balances.',
      'Statement support packages tie FBwT, payable, receivable, and expense balances to transaction evidence.'
    ],
    exceptionTests: ['cash record without accounting posting', 'wrong TAS/BETC', 'aged unmatched disbursement', 'IPAC trading partner mismatch', 'FBwT difference lacks research']
  },
  {
    id: 'gafs-modernization',
    short: 'modernization',
    title: 'GAFS Legacy-to-Modernization Reconciliation Path',
    description: 'Shows how GAFS-BL/GAFS-R history, extracts, crosswalks, and balances should be controlled when activity coexists with or migrates to a modern target environment.',
    path: ['gafs-r-consolidation', 'legacy-modern-bridge', 'budget-prop-accounting', 'gafs-trial-balance', 'treasury-gafs', 'gafs-financial-statements'],
    steps: [
      'Legacy GAFS balances and transaction populations are extracted with stable control totals and metadata.',
      'Legacy chart values are crosswalked to target accounting classifications, USSGL, TAS, fund, organization, and program values.',
      'Converted balances and open items are reconciled before and after migration or dual-run reporting.',
      'Historical support remains available for source-to-statement testing after transition.',
      'Differences are tracked as data-conversion, timing, configuration, or manual-adjustment issues.'
    ],
    exceptionTests: ['crosswalk not approved', 'converted balance does not reconcile', 'historical detail unavailable', 'duplicate posting in coexistence period', 'audit extract missing source keys']
  }
];

const gafsJvScenarios = [
  gafsLineageScenarios[0],
  {
    id: 'gafs-accrual-reversal',
    short: 'accrual reversal',
    title: 'GAFS Accrual and Reversal Path',
    description: 'Focuses on period-end accruals, later reversal, and tie-back to subsequent source-system activity.',
    path: ['manual-source-gafs', 'gafs-jv', 'budget-prop-accounting', 'gafs-trial-balance', 'gafs-financial-statements'],
    steps: [
      'A period-end estimate is prepared because goods, services, payroll, or other activity occurred before complete source processing.',
      'The accrual package documents method, source basis, estimate logic, approver, and reversal requirement.',
      'The JV posts the accrual to valid USSGL/TAS and period values.',
      'The reversal or clearing entry is posted when the source transaction is recorded or the estimate is no longer valid.',
      'The trial balance, statements, and note schedules show the net effect without double counting.'
    ],
    exceptionTests: ['accrual lacks estimate support', 'reversal not posted', 'source transaction and accrual double count expense', 'wrong period', 'unsupported method']
  },
  {
    id: 'gafs-reclass',
    short: 'reclass',
    title: 'GAFS Reclassification and Error-Correction Path',
    description: 'Focuses on moving an amount from an incorrect accounting classification to a valid classification without breaking the source trail.',
    path: ['manual-source-gafs', 'gafs-bl-suspense', 'gafs-jv', 'budget-prop-accounting', 'gafs-trial-balance'],
    steps: [
      'A reconciliation, edit failure, reporting review, or audit test identifies a wrong fund, program, object class, USSGL, TAS, or trading-partner value.',
      'The correction package explains the original error, correct accounting, evidence, and whether the source system also needs remediation.',
      'The JV reverses the incorrect classification and posts the correct classification.',
      'GAFS-R and reporting extracts reflect the corrected balance for the correct period.',
      'The audit trail preserves both the original transaction and correction reason.'
    ],
    exceptionTests: ['correction lacks original document reference', 'source defect not remediated', 'same error repeats', 'wrong period correction', 'trading partner still invalid']
  }
];

const gafsSupportServices = [
  { title: 'Legacy Platform Profile', detail: 'Public sources do not support treating GAFS as SAP or Oracle ERP. This blueprint models it as a legacy Air Force accounting/reporting suite with base-level and central/rehost profiles, batch/file interfaces, reports, and reconciliation controls.' },
  { title: 'Interface Control', detail: 'Accepted/rejected batch totals, source-to-target reconciliations, suspense queues, load reports, edit reports, and resubmission evidence.' },
  { title: 'Journal Voucher Governance', detail: 'Preparer, reviewer, approver, reason code, source support, debit/credit balancing, period controls, reversal tracking, and SoD monitoring.' },
  { title: 'Reference Data & Crosswalks', detail: 'TAS, USSGL, fund citation, organization, program, object class, trading partner, GTAS attributes, and legacy-to-modernization mappings.' },
  { title: 'Close & Reporting', detail: 'Base-level close, central consolidation, adjusted trial balance, DDRS/GTAS edit resolution, Treasury reconciliation, and statement support packages.' },
  { title: 'Audit Evidence', detail: 'Source documents, batch logs, edit reports, JV packages, reconciliations, trial-balance extracts, reporting submissions, and management review sign-offs.' }
];

const gafsCaveats = [
  'GAFS public technical documentation is limited; this blueprint is a high-confidence business-process model, not an official system configuration baseline.',
  'The public evidence supports modeling GAFS as a legacy Air Force accounting suite with GAFS-BL base-level processing and GAFS-R central/rehost/reporting profile, not as SAP or Oracle ERP.',
  'Exact transaction codes, database schemas, interface names, reports, roles, and hosting details require authoritative Air Force, DFAS, or program-office documentation.',
  'JV examples are control patterns for manual accounting adjustments; they should be validated against local policy, DoD FMR requirements, and system operating procedures before operational use.'
];

const gafsSources = [
  { name: 'DFAS public mission and payment services', url: 'https://www.dfas.mil/' },
  { name: 'Secretary of the Air Force Financial Management mission', url: 'https://www.saffm.hq.af.mil/' },
  { name: 'DoD Financial Management Regulation', url: 'https://comptroller.defense.gov/FMR/' },
  { name: 'Treasury GTAS', url: 'https://fiscal.treasury.gov/accounting/government-wide-treasury-account-symbol-gtas' },
  { name: 'Treasury USSGL', url: 'https://fiscal.treasury.gov/accounting/us-standard-general-ledger-ussgl' },
  { name: 'Treasury G-Invoicing / IPAC', url: 'https://fiscal.treasury.gov/accounting/intragov' }
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
  },
  {
    slug: 'deams',
    shortName: 'DEAMS',
    name: 'DEAMS',
    longName: 'DEAMS / Defense Enterprise Accounting and Management System Blueprint',
    agency: 'Department of the Air Force',
    eyebrow: 'DEAMS blueprint for Air Force and Space Force financial management',
    description: 'Explore DEAMS as a representative Oracle-based Department of the Air Force financial-management system, connecting DAF source systems, procure-to-pay, reimbursables, cost accounting, assets, SLA, GL, Treasury reporting, and statement support.',
    metric: '6',
    metricLabel: 'Core DEAMS lineage scenarios',
    metricDetail: 'Source -> SLA -> GL -> GTAS',
    referenceImage: '/deams-blueprint-reference.svg',
    referenceTitle: 'DEAMS static blueprint reference',
    downloadLinks: [
      { label: 'Download SVG', href: '/deams-blueprint-reference.svg' }
    ],
    layers: deamsLayers,
    nodes: deamsNodes,
    lineageScenarios: deamsLineageScenarios,
    supportServices: deamsSupportServices,
    caveats: deamsCaveats,
    sources: [
      { name: 'Air Force FM mission', url: 'https://www.saffm.hq.af.mil/' },
      { name: 'Oracle Purchasing buyer work center', url: 'https://docs.oracle.com/cd/E26401_01/doc.122/e48931/T446883T443956.htm' },
      { name: 'Oracle Subledger Accounting business flows', url: 'https://docs.oracle.com/cd/E18727_01/doc.121/e13628/T149412T149415.htm' },
      { name: 'DoD Financial Management Regulation', url: 'https://comptroller.defense.gov/FMR/' },
      { name: 'Treasury GTAS', url: 'https://fiscal.treasury.gov/accounting/government-wide-treasury-account-symbol-gtas' },
      { name: 'Treasury USSGL', url: 'https://fiscal.treasury.gov/accounting/us-standard-general-ledger-ussgl' },
      { name: 'Treasury G-Invoicing / IPAC', url: 'https://fiscal.treasury.gov/accounting/intragov' }
    ]
  },
  {
    slug: 'gafs',
    shortName: 'GAFS',
    name: 'GAFS Suite',
    longName: 'GAFS Suite / GAFS-BL and GAFS-R Full Profile Blueprint',
    agency: 'Legacy Air Force',
    eyebrow: 'GAFS blueprint for legacy Air Force accounting and reporting',
    description: 'Explore GAFS as a legacy Air Force accounting suite, not a SAP or Oracle ERP, connecting GAFS-BL base-level processing, GAFS-R central reporting, source feeds, suspense, journal vouchers, Treasury reporting, and statement support.',
    metric: '4',
    metricLabel: 'Core GAFS lineage scenarios',
    metricDetail: 'Source -> GAFS-BL -> GAFS-R -> Statement',
    referenceImage: '/gafs-blueprint-reference.svg',
    referenceTitle: 'GAFS suite static blueprint reference',
    downloadLinks: [
      { label: 'Download SVG', href: '/gafs-blueprint-reference.svg' }
    ],
    layers: gafsLayers,
    nodes: gafsNodes,
    lineageScenarios: gafsLineageScenarios,
    supportServices: gafsSupportServices,
    caveats: gafsCaveats,
    sources: gafsSources
  },
  {
    slug: 'gafs-jv',
    shortName: 'GAFS JV',
    name: 'GAFS JV',
    longName: 'GAFS Journal Voucher Control Blueprint',
    agency: 'Legacy Air Force',
    eyebrow: 'Focused GAFS subpage for manual accounting adjustments',
    description: 'Focus on the GAFS journal voucher lifecycle: source exception, support package, preparer/reviewer/approver control, GAFS-BL posting, GAFS-R reporting, reversal tracking, and audit evidence.',
    metric: '3',
    metricLabel: 'Focused JV control paths',
    metricDetail: 'Exception -> Approve -> Post -> Report',
    referenceImage: '/gafs-blueprint-reference.svg',
    referenceTitle: 'GAFS JV static blueprint reference',
    downloadLinks: [
      { label: 'Download SVG', href: '/gafs-blueprint-reference.svg' }
    ],
    layers: gafsLayers,
    nodes: gafsNodes,
    lineageScenarios: gafsJvScenarios,
    supportServices: gafsSupportServices,
    caveats: [
      ...gafsCaveats,
      'This subpage isolates JV control because manual GAFS adjustments are high-risk and can obscure source-system defects if not tied to evidence, approval, reversal, and reconciliation.'
    ],
    sources: gafsSources
  }
];

export function getSystem(slug) {
  return systems.find((system) => system.slug === slug) || systems[0];
}

export function getSystemSlugs() {
  return systems.map((system) => system.slug);
}
