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
  }
];

export function getSystem(slug) {
  return systems.find((system) => system.slug === slug) || systems[0];
}

export function getSystemSlugs() {
  return systems.map((system) => system.slug);
}
