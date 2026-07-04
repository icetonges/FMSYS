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

const cefmsLayers = [
  { id: 'source', label: 'Source / Mission / Feeder Events', short: 'Source', description: 'USACE project, procurement, labor, disbursing, reimbursable, real-property, regulatory, and customer activity that creates accounting demand.' },
  { id: 'core', label: 'CEFMS Core Financial Processing', short: 'CEFMS', description: 'USACE funds control, commitments, obligations, AP, AR, disbursing, collections, project accounting, and close processing in the Corps of Engineers Financial Management System.' },
  { id: 'detail', label: 'Project / Cost / Subsidiary Detail', short: 'Detail', description: 'Project, cost, reimbursable, contract, asset, customer, and management-reporting detail needed to preserve source-to-statement lineage.' },
  { id: 'accounting', label: 'Accounting Layer', short: 'Accounting', description: 'Budgetary and proprietary USSGL classification, journal vouchers, trial balance, accruals, reversals, eliminations, and close adjustments.' },
  { id: 'reporting', label: 'Reporting / Treasury Layer', short: 'Reporting', description: 'CEEMIS, operational reporting, DDRS, GTAS, Treasury/CARS/FBwT, IPAC/G-Invoicing, and audit extracts.' },
  { id: 'statements', label: 'Financial Statement Support', short: 'Statements', description: 'Civil Works, Military Programs, revolving/trust-fund, SBR, Balance Sheet, Net Cost, and note-support reporting.' }
];

const cefmsNodes = [
  {
    id: 'project-systems',
    layer: 'source',
    title: 'P2 / PROMIS / Project Sources',
    subtitle: 'Planning, programming, project and schedule evidence',
    icon: 'PRJ',
    tags: ['project', 'planning', 'Civil Works', 'Military Programs'],
    summary: 'Provides project, program, work item, schedule, funding, and execution context for Civil Works, Military Programs, and other USACE mission work.',
    examples: ['Project authorization', 'work item', 'project schedule', 'program funding record', 'milestone update'],
    auditQuestions: ['Does each project cost trace to a valid project/work item?', 'Are project funding and execution records aligned?', 'Do project totals reconcile to financial postings?'],
    keyFields: ['project ID', 'work item', 'program', 'appropriation', 'district', 'fiscal year', 'amount'],
    risks: ['project and accounting records out of sync', 'cost posted to wrong work item', 'missing funding authority']
  },
  {
    id: 'cefms-contract-sources',
    layer: 'source',
    title: 'SPS / Procurement Sources',
    subtitle: 'Awards, modifications, funding, and contract line detail',
    icon: 'CTR',
    tags: ['contract', 'procurement', 'obligation', 'award'],
    summary: 'Provides contract awards, modifications, CLIN/SLIN detail, funding citations, and obligation-supporting evidence used by CEFMS procure-to-pay activity.',
    examples: ['award', 'modification', 'funding document', 'CLIN/SLIN', 'purchase request'],
    auditQuestions: ['Does each obligation trace to valid award and funding evidence?', 'Are contract modifications reflected in CEFMS?', 'Do funded lines preserve project/cost-object detail?'],
    keyFields: ['PIID', 'mod number', 'CLIN', 'fund cite', 'vendor', 'project ID', 'amount'],
    risks: ['award not obligated', 'modification not reflected', 'line detail lost in accounting summary']
  },
  {
    id: 'cefms-wawf',
    layer: 'source',
    title: 'WAWF / PIEE',
    subtitle: 'Invoice, receipt, acceptance, and payment support',
    icon: 'P2P',
    tags: ['invoice', 'receipt', 'acceptance', 'payment'],
    summary: 'Captures vendor invoice, receipt, acceptance, and payment-support evidence for contract and purchase activity that should reconcile to CEFMS AP and disbursing records.',
    examples: ['vendor invoice', 'receiving report', 'acceptance record', 'combo document', 'payment request'],
    auditQuestions: ['Does every payment have invoice, receipt, and acceptance support?', 'Do invoice quantities and prices agree to contract terms?', 'Are rejected interface items resolved?'],
    keyFields: ['invoice number', 'receiving report', 'PIID', 'CLIN', 'vendor', 'acceptance date', 'amount'],
    risks: ['payment without acceptance', 'duplicate invoice', 'failed interface not resolved']
  },
  {
    id: 'cefms-labor',
    layer: 'source',
    title: 'Labor / Payroll Sources',
    subtitle: 'Time, payroll, benefits, and labor distribution',
    icon: 'LAB',
    tags: ['labor', 'payroll', 'cost', 'expense'],
    summary: 'Provides time, payroll, labor-distribution, benefits, and cost-assignment activity used for project cost, reimbursable billing, and statement expense recognition.',
    examples: ['labor hours', 'payroll cost', 'benefits', 'labor distribution', 'pay correction'],
    auditQuestions: ['Do labor totals reconcile to accepted CEFMS postings?', 'Are labor costs assigned to the correct project and program?', 'Are accruals complete and reversed?'],
    keyFields: ['person identifier', 'pay period', 'labor hours', 'project ID', 'organization', 'fund cite', 'amount'],
    risks: ['labor population incomplete', 'misassigned project cost', 'missing accrual']
  },
  {
    id: 'cefms-cash-igt',
    layer: 'source',
    title: 'Collections / IPAC / Treasury',
    subtitle: 'Cash, reimbursable settlement, and intragovernmental activity',
    icon: 'CASH',
    tags: ['collections', 'IPAC', 'FBwT', 'reimbursable'],
    summary: 'Provides collections, disbursement evidence, intragovernmental settlement, Treasury cash activity, and customer/trading-partner records for reconciliation.',
    examples: ['collection', 'deposit', 'IPAC settlement', 'Treasury cash record', 'trading-partner billing'],
    auditQuestions: ['Do collections and disbursements reconcile to Treasury?', 'Are trading partners complete and valid?', 'Are unmatched cash differences researched?'],
    keyFields: ['TAS', 'BETC', 'ALC', 'voucher', 'customer', 'trading partner', 'amount'],
    risks: ['FBwT difference', 'unmatched collection', 'trading partner mismatch', 'wrong TAS/BETC']
  },
  {
    id: 'cefms-funds',
    layer: 'core',
    title: 'Funds Control',
    subtitle: 'Budget authority, allotment, commitment, obligation',
    icon: 'FUND',
    tags: ['budgetary', 'funds control', 'SBR', 'obligation'],
    summary: 'Controls USACE budget execution from authority and allocation through commitments, obligations, expenditures, outlays, recoveries, and unobligated balances.',
    examples: ['budget authority', 'allotment', 'commitment', 'obligation', 'expenditure', 'outlay'],
    auditQuestions: ['Can SBR balances trace to source budgetary events?', 'Are commitments and obligations valid and timely?', 'Are upward/downward adjustments documented?'],
    keyFields: ['appropriation', 'TAS', 'fund', 'project ID', 'object class', 'document number', 'amount'],
    risks: ['over-obligation', 'stale ULO', 'invalid fund cite', 'unsupported budgetary adjustment']
  },
  {
    id: 'cefms-p2p-core',
    layer: 'core',
    title: 'Procure-to-Pay / AP',
    subtitle: 'Obligation, invoice, receiving, payment, accrual',
    icon: 'AP',
    tags: ['procure-to-pay', 'AP', 'invoice', 'payment'],
    summary: 'Processes obligations, vendor invoices, receipt/acceptance matches, payment requests, disbursement updates, accruals, and liquidation activity.',
    examples: ['obligation', 'invoice', 'receipt/acceptance match', 'payment', 'accrual', 'liquidation'],
    auditQuestions: ['Does each payment trace to obligation, invoice, receipt, and acceptance?', 'Are AP subsidiary balances reconciled?', 'Are accruals reversed after payment?'],
    keyFields: ['obligation number', 'invoice', 'vendor', 'PIID', 'project ID', 'payment voucher', 'amount'],
    risks: ['payment without support', 'unliquidated obligation not valid', 'duplicate invoice', 'AP/GL mismatch']
  },
  {
    id: 'cefms-ar-reimb',
    layer: 'core',
    title: 'Reimbursables / AR',
    subtitle: 'Customer orders, billing, collections, debt',
    icon: 'AR',
    tags: ['reimbursable', 'AR', 'billing', 'collections'],
    summary: 'Manages reimbursable agreements, customer orders, billings, accounts receivable, collections, write-offs, and related trading-partner evidence.',
    examples: ['customer order', 'reimbursable agreement', 'billing', 'collection', 'aged receivable', 'write-off'],
    auditQuestions: ['Are reimbursable orders valid and billable?', 'Do collections liquidate the correct receivables?', 'Are aged AR balances supported?'],
    keyFields: ['customer', 'agreement/order', 'project ID', 'invoice', 'collection', 'trading partner', 'amount'],
    risks: ['unbilled reimbursable work', 'aged AR unsupported', 'collection not applied', 'trading partner mismatch']
  },
  {
    id: 'cefms-jv-close',
    layer: 'core',
    title: 'JV / Close Controls',
    subtitle: 'Corrections, accruals, reclasses, reversals, period close',
    icon: 'JV',
    tags: ['journal voucher', 'close', 'accrual', 'reclass'],
    summary: 'Supports controlled corrections, accruals, reversals, reclasses, eliminations, and close adjustments where normal source processing requires documented adjustment.',
    examples: ['accrual JV', 'reversal', 'reclassification', 'elimination', 'close package adjustment'],
    auditQuestions: ['Is the adjustment tied to source evidence?', 'Are debits and credits valid and approved?', 'Were required reversals posted?'],
    keyFields: ['JV number', 'reason code', 'TAS', 'USSGL', 'project ID', 'debit', 'credit', 'approval'],
    risks: ['unsupported manual adjustment', 'wrong period', 'missing reversal', 'JV masks source-system defect']
  },
  {
    id: 'cefms-project-detail',
    layer: 'detail',
    title: 'Project / WBS Detail',
    subtitle: 'Project cost, work item, and execution structure',
    icon: 'WBS',
    tags: ['project', 'WBS', 'cost', 'execution'],
    summary: 'Preserves project and work-item detail needed for cost reporting, reimbursable billing, capital project support, and management analytics.',
    examples: ['project cost ledger', 'work item actuals', 'project commitments', 'project budget', 'execution report'],
    auditQuestions: ['Do project totals reconcile to CEFMS GL?', 'Are costs charged to valid work items?', 'Can project cost support billing or capitalization?'],
    keyFields: ['project ID', 'work item', 'district', 'fund', 'cost element', 'document number', 'amount'],
    risks: ['project ledger not tied to GL', 'wrong work item', 'capital/reimbursable misclassification']
  },
  {
    id: 'cefms-assets',
    layer: 'detail',
    title: 'Real Property / Asset Detail',
    subtitle: 'Capitalization, construction-in-progress, transfer, disposal',
    icon: 'AST',
    tags: ['asset', 'real property', 'CIP', 'PP&E'],
    summary: 'Supports asset, real-property, construction-in-progress, capitalization, transfer, depreciation, disposal, and note-disclosure evidence.',
    examples: ['CIP project', 'placed in service', 'asset transfer', 'disposal', 'capital improvement'],
    auditQuestions: ['Do capital costs trace to project detail?', 'Are placed-in-service dates supportable?', 'Do asset balances reconcile to GL?'],
    keyFields: ['asset ID', 'project ID', 'location', 'CIP amount', 'placed-in-service date', 'disposal date', 'USSGL'],
    risks: ['CIP not timely capitalized', 'asset not recorded', 'unsupported disposal', 'GL/subsidiary mismatch']
  },
  {
    id: 'cefms-ceemis',
    layer: 'detail',
    title: 'CEEMIS / Management Information',
    subtitle: 'Enterprise reporting, query, and management analytics',
    icon: 'MI',
    tags: ['CEEMIS', 'reporting', 'analytics', 'query'],
    summary: 'Provides enterprise management information, reporting, and query capability associated with CEFMS financial and operational data.',
    examples: ['management query', 'district report', 'project status report', 'audit population extract', 'control total report'],
    auditQuestions: ['Do extracts reconcile to CEFMS control totals?', 'Are report filters documented?', 'Can users query financial data real time where authorized?'],
    keyFields: ['report ID', 'extract date', 'selection criteria', 'project ID', 'TAS', 'USSGL', 'amount'],
    risks: ['report logic undocumented', 'extract not reconciled', 'stale reporting store', 'wrong population']
  },
  {
    id: 'cefms-budgetary-accounting',
    layer: 'accounting',
    title: 'Budgetary Accounting',
    subtitle: 'USSGL budgetary accounts and SBR support',
    icon: 'BUD',
    tags: ['USSGL', 'budgetary', 'SBR'],
    summary: 'Classifies authority, commitments, obligations, expenditures, outlays, recoveries, and unobligated balance activity into budgetary USSGL accounts.',
    examples: ['budgetary posting', 'obligation', 'expenditure', 'outlay', 'recovery', 'year-end close'],
    auditQuestions: ['Are budgetary accounts valid for transaction type?', 'Do budgetary balances tie to SBR?', 'Do adjustments preserve source lineage?'],
    keyFields: ['TAS', 'budgetary USSGL', 'fund', 'project ID', 'document number', 'period', 'amount'],
    risks: ['invalid USSGL', 'SBR mismatch', 'unsupported adjustment', 'period cutoff error']
  },
  {
    id: 'cefms-proprietary-accounting',
    layer: 'accounting',
    title: 'Proprietary Accounting / GL',
    subtitle: 'Assets, liabilities, net cost, AP, AR, FBwT',
    icon: 'GL',
    tags: ['general ledger', 'proprietary', 'trial balance'],
    summary: 'Records proprietary accounting for assets, liabilities, expenses, revenue, FBwT, AP, AR, and net-cost support, then feeds trial-balance reporting.',
    examples: ['GL posting', 'AP liability', 'AR balance', 'expense', 'revenue', 'FBwT posting'],
    auditQuestions: ['Do proprietary balances reconcile to subsidiary detail?', 'Are debit/credit postings balanced?', 'Do proprietary accounts crosswalk to statements and notes?'],
    keyFields: ['TAS', 'USSGL', 'document number', 'project ID', 'debit', 'credit', 'ending balance'],
    risks: ['subsidiary/GL mismatch', 'wrong proprietary account', 'manual entry not supported', 'note schedule does not tie']
  },
  {
    id: 'cefms-ddrs-gtas',
    layer: 'reporting',
    title: 'DDRS / GTAS / ATB',
    subtitle: 'Adjusted trial balance and federal reporting edits',
    icon: 'ATB',
    tags: ['DDRS', 'GTAS', 'trial balance', 'reporting'],
    summary: 'Supports adjusted trial balance, DDRS reporting, GTAS edit validation, USSGL/TAS reporting attributes, and reporting-package reconciliation.',
    examples: ['adjusted trial balance', 'DDRS feed', 'GTAS submission', 'edit report', 'crosswalk'],
    auditQuestions: ['Does ATB reconcile to CEFMS GL?', 'Are DDRS/GTAS edits resolved?', 'Do attributes support statement crosswalks?'],
    keyFields: ['TAS', 'USSGL', 'GTAS attribute', 'beginning balance', 'debit', 'credit', 'ending balance'],
    risks: ['ATB not tied to GL', 'GTAS edit failure', 'incorrect attribute', 'late adjustment after extract']
  },
  {
    id: 'cefms-treasury',
    layer: 'reporting',
    title: 'Treasury / FBwT / IGT',
    subtitle: 'CARS, IPAC, G-Invoicing, cash and trading partner reconciliation',
    icon: 'TRY',
    tags: ['Treasury', 'FBwT', 'IPAC', 'G-Invoicing'],
    summary: 'Supports Fund Balance with Treasury, TAS/BETC, CARS, IPAC, G-Invoicing, collections, disbursements, and intragovernmental reconciliation.',
    examples: ['FBwT reconciliation', 'CARS record', 'IPAC settlement', 'G-Invoicing order', 'trading-partner elimination'],
    auditQuestions: ['Do cash balances reconcile to Treasury?', 'Are IPAC/G-Invoicing records tied to CEFMS?', 'Are trading-partner attributes complete?'],
    keyFields: ['TAS', 'BETC', 'ALC', 'trading partner', 'IPAC document', 'collection', 'amount'],
    risks: ['FBwT difference', 'unmatched IPAC', 'trading partner mismatch', 'wrong TAS/BETC']
  },
  {
    id: 'cefms-sbr',
    layer: 'statements',
    title: 'SBR / Budgetary Statements',
    subtitle: 'Budgetary resources, obligations, outlays, unobligated balance',
    icon: 'SBR',
    tags: ['SBR', 'budgetary', 'statement'],
    summary: 'Supports Statement of Budgetary Resources reporting for USACE appropriated, revolving, and trust-fund activity through source-to-budgetary-accounting lineage.',
    examples: ['budgetary resources', 'obligations incurred', 'outlays', 'recoveries', 'unobligated balance'],
    auditQuestions: ['Can each SBR line trace to CEFMS budgetary detail?', 'Are obligations and outlays supportable?', 'Do recoveries and unobligated balances reconcile?'],
    keyFields: ['TAS', 'budgetary USSGL', 'SBR line', 'fund', 'project ID', 'period', 'amount'],
    risks: ['unsupported obligation', 'stale ULO', 'budgetary mismatch', 'wrong statement line']
  },
  {
    id: 'cefms-financial-statements',
    layer: 'statements',
    title: 'Balance Sheet / Net Cost / Notes',
    subtitle: 'FBwT, AP, AR, assets, cost, disclosures',
    icon: 'FS',
    tags: ['balance sheet', 'net cost', 'notes', 'audit'],
    summary: 'Supports proprietary statement lines and disclosures including FBwT, AP, AR, project cost, assets, liabilities, net cost, and note schedules.',
    examples: ['FBwT line', 'AP line', 'AR line', 'net cost', 'asset note', 'reimbursable disclosure'],
    auditQuestions: ['Do statement lines tie to CEFMS trial balance?', 'Are subsidiary schedules reconciled?', 'Can note schedules trace back to project/source detail?'],
    keyFields: ['TAS', 'USSGL', 'statement line', 'note schedule', 'project ID', 'document number', 'amount'],
    risks: ['statement line not tied to ATB', 'note schedule mismatch', 'unsupported asset or liability', 'late close adjustment']
  }
];

const cefmsLineageScenarios = [
  {
    id: 'cefms-project-p2p',
    short: 'project P2P',
    title: 'USACE Project Procure-to-Pay Path',
    description: 'Shows how project work moves from planning and procurement evidence through CEFMS obligation, AP, project cost, GL, Treasury reporting, and statement support.',
    path: ['project-systems', 'cefms-contract-sources', 'cefms-wawf', 'cefms-p2p-core', 'cefms-project-detail', 'cefms-proprietary-accounting', 'cefms-ddrs-gtas', 'cefms-financial-statements'],
    steps: [
      'A USACE project or work item establishes funding and execution context.',
      'Procurement award and modification data create obligation-supporting evidence.',
      'Invoice, receipt, and acceptance evidence supports payment processing.',
      'CEFMS records obligation, AP, accrual, payment, and liquidation activity.',
      'Project cost detail reconciles to GL and reporting balances.',
      'DDRS, GTAS, Treasury, and statements receive reconciled trial-balance support.'
    ],
    exceptionTests: ['payment without receipt or acceptance', 'project cost not tied to GL', 'obligation not tied to award', 'duplicate invoice', 'ATB not reconciled']
  },
  {
    id: 'cefms-reimbursable',
    short: 'reimbursable',
    title: 'USACE Reimbursable / Customer Order Path',
    description: 'Shows how customer-funded work, billing, collections, and trading-partner data flow through CEFMS AR and reporting.',
    path: ['project-systems', 'cefms-ar-reimb', 'cefms-project-detail', 'cefms-cash-igt', 'cefms-treasury', 'cefms-proprietary-accounting', 'cefms-financial-statements'],
    steps: [
      'A reimbursable project or customer agreement is established and funded.',
      'CEFMS records customer order, billable activity, invoice, AR, and collection detail.',
      'Project costs support billing and performance evidence.',
      'Collections, IPAC, and trading-partner records reconcile to AR and cash postings.',
      'Proprietary balances support receivables, revenue, net cost, and disclosure reporting.'
    ],
    exceptionTests: ['unbilled reimbursable work', 'collection not applied', 'aged AR unsupported', 'trading partner mismatch', 'project cost not billable']
  },
  {
    id: 'cefms-civil-works-reporting',
    short: 'Civil Works close',
    title: 'Civil Works Close and Statement Path',
    description: 'Shows how USACE close controls move from project and source data through CEFMS, CEEMIS, trial balance, Treasury, and financial statements.',
    path: ['project-systems', 'cefms-jv-close', 'cefms-ceemis', 'cefms-budgetary-accounting', 'cefms-ddrs-gtas', 'cefms-treasury', 'cefms-sbr'],
    steps: [
      'District and program activity is reconciled to project/source populations.',
      'Close adjustments are documented, approved, posted, and reversed when applicable.',
      'CEEMIS and CEFMS reports support management review and extract reconciliation.',
      'Budgetary and proprietary trial balances are prepared and validated.',
      'DDRS, GTAS, Treasury, and statement packages are tied to accepted close data.'
    ],
    exceptionTests: ['unsupported close JV', 'CEEMIS extract not reconciled', 'GTAS edit failure', 'FBwT difference', 'SBR line not tied to CEFMS']
  },
  {
    id: 'cefms-asset-project',
    short: 'asset project',
    title: 'USACE Project-to-Asset Path',
    description: 'Shows how project costs can become real-property or asset balances with capitalization, transfer, disposal, and note-support controls.',
    path: ['project-systems', 'cefms-p2p-core', 'cefms-project-detail', 'cefms-assets', 'cefms-proprietary-accounting', 'cefms-financial-statements'],
    steps: [
      'Project activity accumulates contract, labor, and other costs.',
      'CEFMS records obligations, payments, accruals, and cost postings.',
      'Project detail identifies capitalizable costs and placed-in-service events.',
      'Asset records, CIP, transfers, depreciation, or disposals are updated.',
      'Proprietary GL and note schedules support asset-related statement balances.'
    ],
    exceptionTests: ['CIP not capitalized timely', 'asset detail not reconciled', 'project cost miscoded', 'unsupported disposal', 'note schedule mismatch']
  }
];

const cefmsSupportServices = [
  { title: 'USACE Finance Center', detail: 'Provides operational finance and accounting support, CEFMS/CEEMIS maintenance, strategic direction, and finance/accounting functions for USACE worldwide.' },
  { title: 'Project Accounting', detail: 'Project, work item, district, program, cost object, reimbursable, and capital-project structures preserve USACE mission context.' },
  { title: 'Interface Control', detail: 'Source-to-target totals, accepted/rejected records, suspense, report extracts, management queries, and audit population reconciliation.' },
  { title: 'Close Governance', detail: 'JV approvals, accruals, reversals, project reconciliations, trial-balance tie-outs, DDRS/GTAS edits, and statement package reviews.' },
  { title: 'Treasury & IGT', detail: 'TAS/BETC, FBwT, CARS, IPAC, G-Invoicing, trading-partner, collections, and disbursement reconciliation.' },
  { title: 'Audit Evidence', detail: 'Project records, awards, invoices, acceptance, labor detail, CEEMIS reports, trial balances, reconciliations, and financial statement support schedules.' }
];

const cefmsCaveats = [
  'CEFMS is modeled from public USACE Finance Center descriptions and federal financial-management reporting patterns; exact application, database, interface, and hosting details require authoritative USACE/UFC documentation.',
  'Public sources identify CEFMS and CEEMIS and describe CEFMS as complex and fully integrated, but they do not provide enough detail to honestly label the implementation as SAP, Oracle, PeopleSoft, or another commercial platform.',
  'Feeder counts are modeled source-system categories represented in this blueprint, not a certified CEFMS interface inventory.',
  'USACE has Civil Works, Military Programs, revolving, and trust-fund reporting contexts; local workflows may differ by district, center, mission area, fund type, and role.'
];

const cefmsSources = [
  { name: 'USACE Finance Center', url: 'https://www.usace.army.mil/Who-We-Are/Finance-Center/' },
  { name: 'USACE Headquarters mission and organization', url: 'https://www.usace.army.mil/' },
  { name: 'DoD Financial Management Regulation', url: 'https://comptroller.defense.gov/FMR/' },
  { name: 'Treasury GTAS', url: 'https://fiscal.treasury.gov/accounting/government-wide-treasury-account-symbol-gtas' },
  { name: 'Treasury USSGL', url: 'https://fiscal.treasury.gov/accounting/us-standard-general-ledger-ussgl' },
  { name: 'Treasury G-Invoicing / IPAC', url: 'https://fiscal.treasury.gov/accounting/intragov' }
];

const dlaEbsLayers = [
  { id: 'source', label: 'DLA Source / Customer / Partner Applications', short: 'Source', description: 'DLA portals, ordering, cataloging, procurement, distribution, logistics-transaction, vendor, invoice, and customer systems that originate business events.' },
  { id: 'core', label: 'DLA EBS Core ERP Capabilities', short: 'EBS', description: 'Commercial ERP-style supply-chain and financial capabilities for demand, sales orders, procurement, inventory, warehouse, finance, cost, and replenishment processing.' },
  { id: 'detail', label: 'Supply-Chain / Subsidiary Detail', short: 'Detail', description: 'Material master, NSN, vendor, customer, order, inventory, shipment, contract, receipt, invoice, and supply-chain segment detail used for traceability.' },
  { id: 'accounting', label: 'Accounting Layer', short: 'Accounting', description: 'AP, AR, inventory valuation, cost of goods, budgetary/proprietary USSGL, GL, adjustments, and close accounting.' },
  { id: 'reporting', label: 'Reporting / Treasury Layer', short: 'Reporting', description: 'EBS reports, EA2 analytics, DDRS, GTAS, Treasury/CARS/FBwT, IPAC/G-Invoicing, audit extracts, and DLA management reporting.' },
  { id: 'statements', label: 'DLA / DoD Statement Support', short: 'Statements', description: 'Working capital fund, inventory, AP, AR, net cost, SBR, Balance Sheet, note schedules, and audit-support reporting.' }
];

const dlaEbsNodes = [
  {
    id: 'fedmall-eebp',
    layer: 'source',
    title: 'FedMall / EEBP',
    subtitle: 'Customer ordering and external business portal',
    icon: 'WEB',
    tags: ['FedMall', 'EEBP', 'customer', 'sales order'],
    summary: 'Provides customer ordering, supplier access, requisition research, tracking, and external business portal activity that can initiate demand, sales-order, fulfillment, and billing processes.',
    examples: ['customer order', 'catalog search', 'supplier portal action', 'order tracking', 'status inquiry'],
    auditQuestions: ['Does each customer demand trace to an EBS order or requisition event?', 'Are customer identities and DoDAACs valid?', 'Do portal statuses reconcile to EBS fulfillment and billing?'],
    keyFields: ['order number', 'customer DoDAAC', 'NSN', 'quantity', 'fund code', 'priority', 'status'],
    risks: ['customer order not accepted by EBS', 'invalid DoDAAC/fund code', 'portal status not reconciled', 'duplicate demand']
  },
  {
    id: 'daas-dlms',
    layer: 'source',
    title: 'DAAS / DLMS / MILS',
    subtitle: 'Logistics transaction routing and standards',
    icon: 'EDI',
    tags: ['DAAS', 'DLMS', 'MILS', 'EDI', 'requisition'],
    summary: 'Routes standardized logistics transactions, requisitions, status, billing-related messages, and machine-to-machine interfaces across DLA, services, and partners.',
    examples: ['DLMS transaction', 'MILSTRIP requisition', 'status message', 'billing-related transaction', 'routing acknowledgement'],
    auditQuestions: ['Do routed transactions reconcile to EBS accepted transactions?', 'Are rejects and retransmissions controlled?', 'Are DLMS data elements mapped to financial attributes?'],
    keyFields: ['document number', 'DLMS transaction type', 'routing identifier', 'DoDAAC', 'fund code', 'signal code', 'amount'],
    risks: ['lost logistics transaction', 'incorrect data-element mapping', 'duplicate retransmission', 'financial attribute missing']
  },
  {
    id: 'dla-piee-wawf',
    layer: 'source',
    title: 'PIEE / WAWF',
    subtitle: 'Procurement, invoice, receipt, and acceptance evidence',
    icon: 'P2P',
    tags: ['PIEE', 'WAWF', 'invoice', 'receipt', 'acceptance'],
    summary: 'Captures procurement and payment-support evidence including invoices, receiving reports, acceptance, contract references, and payment packages.',
    examples: ['vendor invoice', 'receiving report', 'acceptance', 'combo document', 'payment request'],
    auditQuestions: ['Does every paid invoice have contract, receipt, and acceptance evidence?', 'Are invoice amounts tied to EBS PO and receipt detail?', 'Are rejected invoice records resolved?'],
    keyFields: ['PIID', 'CLIN', 'invoice number', 'receiving report', 'vendor CAGE/UEI', 'acceptance date', 'amount'],
    risks: ['payment without acceptance', 'duplicate invoice', 'PO/receipt/invoice mismatch', 'interface reject unresolved']
  },
  {
    id: 'dibbs-vsm',
    layer: 'source',
    title: 'DIBBS / VSM',
    subtitle: 'Supplier quote and vendor shipment activity',
    icon: 'VND',
    tags: ['DIBBS', 'VSM', 'supplier', 'shipment', 'procurement'],
    summary: 'Provides supplier quote, solicitation, award-support, shipment, carrier, in-transit, and vendor-delivery information used by procurement and distribution processes.',
    examples: ['RFQ quote', 'solicitation', 'vendor shipment', 'tracking update', 'delivery confirmation'],
    auditQuestions: ['Do solicitations and awards trace to EBS procurement records?', 'Do vendor shipments reconcile to receipt and inventory updates?', 'Are in-transit differences resolved?'],
    keyFields: ['solicitation', 'quote', 'vendor', 'shipment number', 'NSN', 'quantity', 'receipt date'],
    risks: ['shipment not received', 'vendor record mismatch', 'award not tied to procurement', 'quantity discrepancy']
  },
  {
    id: 'webflis-fedlog',
    layer: 'source',
    title: 'WebFLIS / FED LOG / Cataloging',
    subtitle: 'Federal logistics item and NSN master data',
    icon: 'NSN',
    tags: ['WebFLIS', 'FED LOG', 'catalog', 'NSN', 'master data'],
    summary: 'Provides item identity, NSN, item name, reference/part-number, CAGE, federal logistics, and cataloging information used to control material master and item traceability.',
    examples: ['NSN lookup', 'item name', 'reference number', 'CAGE link', 'cataloging request'],
    auditQuestions: ['Is each EBS material tied to valid catalog data?', 'Are NSN changes controlled and reflected in material master?', 'Do item attributes support valuation and reporting?'],
    keyFields: ['NSN', 'NIIN', 'item name', 'CAGE', 'part number', 'FSC', 'unit of issue'],
    risks: ['invalid material master', 'wrong item identity', 'catalog update not reflected', 'valuation tied to wrong item']
  },
  {
    id: 'dss-distribution',
    layer: 'source',
    title: 'DSS / Distribution / Depot Events',
    subtitle: 'Warehouse, storage, issue, receipt, and movement activity',
    icon: 'DSS',
    tags: ['DSS', 'distribution', 'warehouse', 'inventory', 'shipment'],
    summary: 'Provides depot receipt, storage, pick, pack, ship, inventory adjustment, condition-code, and distribution activity that must reconcile to EBS inventory and fulfillment records.',
    examples: ['goods receipt', 'stock movement', 'pick ticket', 'shipment', 'inventory adjustment', 'condition-code change'],
    auditQuestions: ['Do physical inventory events reconcile to EBS inventory balances?', 'Are shipments tied to customer orders?', 'Are adjustments approved and supported?'],
    keyFields: ['depot', 'NSN', 'storage location', 'quantity', 'condition code', 'shipment', 'movement date'],
    risks: ['inventory quantity mismatch', 'shipment without billing impact', 'unapproved adjustment', 'condition code not reflected financially']
  },
  {
    id: 'dla-demand-order',
    layer: 'core',
    title: 'Demand / Sales Order Management',
    subtitle: 'Requisition to customer order and fulfillment demand',
    icon: 'SO',
    tags: ['demand', 'sales order', 'requisition', 'customer'],
    summary: 'Transforms customer requisitions and demand signals into controlled customer orders, availability checks, priority handling, fulfillment activity, and billing-relevant records.',
    examples: ['sales order', 'backorder', 'availability check', 'priority designator', 'customer billing trigger'],
    auditQuestions: ['Can demand trace from customer request to fulfillment and billing?', 'Are cancellations and backorders reflected accurately?', 'Are priority and fund-code attributes valid?'],
    keyFields: ['sales order', 'document number', 'DoDAAC', 'NSN', 'quantity', 'fund code', 'priority'],
    sapTables: ['VBAK/VBAP', 'VBFA', 'LIKP/LIPS'],
    risks: ['unfulfilled demand not tracked', 'order cancelled but billed', 'priority/fund code invalid', 'order-to-cash break']
  },
  {
    id: 'dla-procurement',
    layer: 'core',
    title: 'Procurement / Materials Management',
    subtitle: 'Purchase requisition, purchase order, receipt, invoice match',
    icon: 'MM',
    tags: ['procurement', 'MM', 'purchase order', 'receipt'],
    summary: 'Supports buys, purchase requisitions, purchase orders, contracts, goods receipts, service/receiving activity, invoice matching, and vendor-related procurement controls.',
    examples: ['purchase requisition', 'purchase order', 'contract line', 'goods receipt', 'invoice match'],
    auditQuestions: ['Does procurement trace to valid demand or replenishment logic?', 'Do PO, receipt, and invoice quantities agree?', 'Are open obligations and receipts reviewed?'],
    keyFields: ['PR', 'PO', 'PIID', 'CLIN', 'vendor', 'NSN', 'receipt', 'invoice'],
    sapTables: ['EBAN', 'EKKO', 'EKPO', 'EKBE', 'MKPF/MSEG', 'RBKP/RSEG'],
    risks: ['PO not tied to demand', 'receipt/invoice mismatch', 'unsupported vendor liability', 'open PO not valid']
  },
  {
    id: 'dla-inventory',
    layer: 'core',
    title: 'Inventory / Warehouse / Distribution',
    subtitle: 'Stock, movement, condition, valuation, fulfillment',
    icon: 'INV',
    tags: ['inventory', 'warehouse', 'valuation', 'distribution'],
    summary: 'Maintains inventory balances, stock movements, storage, condition, availability, warehouse fulfillment, shipment, issue, disposal, and valuation impacts.',
    examples: ['stock receipt', 'goods issue', 'transfer', 'inventory adjustment', 'shipment', 'condition-code update'],
    auditQuestions: ['Do physical and book inventory balances reconcile?', 'Are stock movements supported by source events?', 'Is valuation updated for quantity or condition changes?'],
    keyFields: ['material', 'plant', 'storage location', 'batch/condition', 'movement type', 'quantity', 'valuation amount'],
    sapTables: ['MARA/MARC/MARD', 'MBEW', 'MKPF/MSEG'],
    risks: ['inventory existence gap', 'quantity/value mismatch', 'incorrect condition', 'unapproved adjustment']
  },
  {
    id: 'dla-finance-core',
    layer: 'core',
    title: 'Finance / Cost / Working Capital',
    subtitle: 'FI, CO, AP, AR, GL, cost objects, fund controls',
    icon: 'FI',
    tags: ['financials', 'FI', 'CO', 'working capital fund', 'GL'],
    summary: 'Supports DLA financial accounting, working-capital cost recovery, AP, AR, GL, cost centers, product cost, customer billing, vendor liabilities, and close processing.',
    examples: ['vendor liability', 'customer receivable', 'inventory valuation', 'cost center charge', 'GL posting', 'close adjustment'],
    auditQuestions: ['Do AP/AR and inventory subsidiary balances reconcile to GL?', 'Are cost-recovery and working-capital transactions complete?', 'Do GL postings retain source support?'],
    keyFields: ['company/fund', 'GL account', 'cost center', 'customer', 'vendor', 'document number', 'amount'],
    sapTables: ['BKPF/BSEG', 'FAGLFLEXA/FAGLFLEXT', 'BSIK/BSAK', 'BSID/BSAD', 'COBK/COEP'],
    risks: ['subsidiary ledger mismatch', 'manual journal lacks support', 'working-capital revenue/cost mismatch', 'close adjustment not reversed']
  },
  {
    id: 'dla-planning',
    layer: 'core',
    title: 'Planning / Supply / Replenishment',
    subtitle: 'Forecast, demand planning, buys, and stock positioning',
    icon: 'PLN',
    tags: ['planning', 'replenishment', 'forecast', 'supply chain'],
    summary: 'Supports demand planning, supply planning, replenishment buys, stock positioning, safety levels, and readiness-related supply-chain decisions.',
    examples: ['forecast', 'reorder point', 'supply plan', 'buy recommendation', 'stock objective'],
    auditQuestions: ['Are planned buys tied to demand and inventory evidence?', 'Do planning parameters support approved supply objectives?', 'Are excess or obsolete risks monitored?'],
    keyFields: ['NSN', 'forecast', 'reorder point', 'safety level', 'demand history', 'buy quantity', 'planning date'],
    risks: ['overbuy', 'stockout', 'obsolete inventory', 'planning parameter not approved']
  },
  {
    id: 'dla-material-master',
    layer: 'detail',
    title: 'Material / NSN Master',
    subtitle: 'Material identity, catalog, unit, valuation and supply attributes',
    icon: 'MAT',
    tags: ['material master', 'NSN', 'catalog', 'master data'],
    summary: 'Maintains the item-level data that links NSNs, material IDs, item names, units of issue, plants, storage, valuation, source, and logistics attributes.',
    examples: ['material master', 'NSN mapping', 'unit of issue', 'plant view', 'valuation class'],
    auditQuestions: ['Is each material tied to authoritative catalog identity?', 'Are units and valuation classes correct?', 'Are changes approved and reflected across systems?'],
    keyFields: ['material', 'NSN', 'NIIN', 'unit of issue', 'valuation class', 'plant', 'FSC'],
    sapTables: ['MARA', 'MARC', 'MARD', 'MBEW'],
    risks: ['invalid NSN/material link', 'wrong valuation class', 'unit conversion error', 'stale master data']
  },
  {
    id: 'dla-vendor-customer',
    layer: 'detail',
    title: 'Vendor / Customer Master',
    subtitle: 'Supplier, customer, DoDAAC, CAGE, banking, trading partner',
    icon: 'MST',
    tags: ['vendor', 'customer', 'DoDAAC', 'CAGE', 'trading partner'],
    summary: 'Maintains the supplier and customer records needed for procurement, billing, payment, collections, trading partner reporting, and identity validation.',
    examples: ['vendor master', 'customer master', 'DoDAAC', 'CAGE', 'banking data', 'trading partner'],
    auditQuestions: ['Are vendor and customer records complete and approved?', 'Do DoDAAC/CAGE values reconcile to authoritative sources?', 'Are inactive or duplicate records monitored?'],
    keyFields: ['vendor', 'customer', 'CAGE', 'UEI', 'DoDAAC', 'bank account', 'trading partner'],
    sapTables: ['LFA1/LFB1', 'KNA1/KNB1'],
    risks: ['duplicate vendor', 'incorrect customer billing', 'invalid banking data', 'trading partner missing']
  },
  {
    id: 'dla-inventory-detail',
    layer: 'detail',
    title: 'Inventory Valuation Detail',
    subtitle: 'Quantity, condition, location, cost, and movement trail',
    icon: 'VAL',
    tags: ['inventory valuation', 'stock', 'movement', 'condition'],
    summary: 'Preserves inventory quantity, cost, condition, movement, location, and valuation history supporting inventory existence, completeness, and valuation assertions.',
    examples: ['stock ledger', 'movement history', 'condition-code report', 'valuation layer', 'adjustment support'],
    auditQuestions: ['Can inventory balances trace to movement history?', 'Are quantity and value reconciled?', 'Are condition-code changes financially reflected?'],
    keyFields: ['material', 'plant', 'storage location', 'condition', 'movement type', 'quantity', 'value'],
    sapTables: ['MARD', 'MBEW', 'MKPF/MSEG'],
    risks: ['quantity/value mismatch', 'condition not valued correctly', 'unsupported adjustment', 'book-to-physical variance']
  },
  {
    id: 'dla-order-fulfillment',
    layer: 'detail',
    title: 'Order Fulfillment Detail',
    subtitle: 'Pick, pack, ship, delivery, customer billing support',
    icon: 'FUL',
    tags: ['fulfillment', 'shipment', 'delivery', 'billing'],
    summary: 'Links customer demand to availability, warehouse execution, shipment, delivery status, customer billing, and collection support.',
    examples: ['delivery', 'pick/pack', 'shipment', 'proof of shipment', 'billing document'],
    auditQuestions: ['Does each shipment trace to customer demand and billing?', 'Are partial shipments and backorders handled correctly?', 'Do delivery quantities match billing quantities?'],
    keyFields: ['sales order', 'delivery', 'shipment', 'NSN', 'quantity', 'customer', 'billing document'],
    sapTables: ['VBAK/VBAP', 'LIKP/LIPS', 'VBRK/VBRP'],
    risks: ['shipment not billed', 'billing without shipment', 'partial quantity mismatch', 'delivery status stale']
  },
  {
    id: 'dla-supply-chains',
    layer: 'detail',
    title: 'DLA Supply-Chain Segments',
    subtitle: 'Energy, Troop Support, Weapons Support, Distribution, Disposition',
    icon: 'SC',
    tags: ['supply chain', 'Energy', 'Troop Support', 'Weapons Support', 'Distribution'],
    summary: 'Represents mission-specific DLA supply-chain segments where commodities, customers, inventory, distribution, and financial patterns vary.',
    examples: ['fuel support', 'subsistence', 'medical material', 'repair part', 'disposition property', 'distribution depot'],
    auditQuestions: ['Are supply-chain-specific attributes retained in financial reporting?', 'Do segment reports reconcile to EBS totals?', 'Are commodity-specific valuation issues controlled?'],
    keyFields: ['supply chain', 'commodity', 'NSN', 'customer', 'depot', 'fund', 'amount'],
    risks: ['segment reporting mismatch', 'commodity-specific valuation gap', 'cross-segment duplication', 'unsupported disposal impact']
  },
  {
    id: 'dla-ap-accounting',
    layer: 'accounting',
    title: 'AP / Vendor Liability',
    subtitle: 'Invoice, receipt, acceptance, accrual, payment clearing',
    icon: 'AP',
    tags: ['AP', 'invoice', 'payment', 'liability'],
    summary: 'Records vendor liability, invoice accruals, payment clearing, receipt/invoice matching, and supplier payment activity tied to procurement and WAWF/PIEE evidence.',
    examples: ['vendor invoice', 'AP accrual', 'payment clearing', 'withholding', 'debit memo'],
    auditQuestions: ['Does AP reconcile to vendor invoice and receipt support?', 'Are payments cleared and matched?', 'Are accruals valid and reversed?'],
    keyFields: ['vendor', 'invoice', 'PO', 'receipt', 'AP document', 'payment', 'amount'],
    sapTables: ['BKPF/BSEG', 'BSIK/BSAK', 'RBKP/RSEG'],
    risks: ['unsupported liability', 'duplicate payment', 'receipt/invoice mismatch', 'accrual not reversed']
  },
  {
    id: 'dla-ar-accounting',
    layer: 'accounting',
    title: 'AR / Customer Billing',
    subtitle: 'Sales, billing, receivable, collection, write-off',
    icon: 'AR',
    tags: ['AR', 'billing', 'collection', 'customer'],
    summary: 'Records customer billing, receivables, collections, write-offs, credit memos, and settlement activity for DLA customer and working-capital transactions.',
    examples: ['billing document', 'customer invoice', 'collection', 'write-off', 'credit memo'],
    auditQuestions: ['Do receivables trace to shipment or reimbursable evidence?', 'Are collections applied correctly?', 'Are aged balances reviewed and supported?'],
    keyFields: ['customer', 'billing document', 'sales order', 'collection', 'AR document', 'trading partner', 'amount'],
    sapTables: ['VBRK/VBRP', 'BSID/BSAD', 'BKPF/BSEG'],
    risks: ['unbilled shipment', 'collection not applied', 'aged receivable unsupported', 'customer/trading partner mismatch']
  },
  {
    id: 'dla-inventory-gl',
    layer: 'accounting',
    title: 'Inventory / COGS / GL',
    subtitle: 'Inventory asset, cost, expense, revenue, and working-capital GL',
    icon: 'GL',
    tags: ['inventory', 'COGS', 'GL', 'working capital fund'],
    summary: 'Posts inventory asset, cost of goods, expense, revenue, gain/loss, and other GL impacts tied to supply-chain transactions and working-capital operations.',
    examples: ['inventory asset posting', 'COGS', 'price variance', 'goods issue', 'adjustment', 'GL close'],
    auditQuestions: ['Do inventory subledger balances reconcile to GL?', 'Are cost/revenue postings complete for shipments?', 'Are manual GL adjustments supported?'],
    keyFields: ['GL account', 'material', 'movement type', 'fund', 'cost center', 'debit', 'credit'],
    sapTables: ['BKPF/BSEG', 'FAGLFLEXA/FAGLFLEXT', 'COBK/COEP', 'MBEW'],
    risks: ['inventory/GL mismatch', 'COGS not recorded', 'price variance unexplained', 'manual journal unsupported']
  },
  {
    id: 'dla-budgetary',
    layer: 'accounting',
    title: 'Budgetary / USSGL Support',
    subtitle: 'Resources, obligations, expenditures, outlays, recoveries',
    icon: 'BUD',
    tags: ['budgetary', 'USSGL', 'SBR', 'funds'],
    summary: 'Classifies budgetary resources, obligations, expenditures, outlays, recoveries, and related USSGL/TAS reporting attributes for DLA reporting contexts.',
    examples: ['obligation', 'expenditure', 'outlay', 'recovery', 'budgetary close'],
    auditQuestions: ['Do budgetary postings trace to source events?', 'Are USSGL/TAS values valid?', 'Do budgetary balances support SBR and GTAS edits?'],
    keyFields: ['TAS', 'USSGL', 'fund', 'object class', 'obligation', 'outlay', 'amount'],
    risks: ['invalid USSGL/TAS', 'budgetary/proprietary mismatch', 'unsupported upward adjustment', 'GTAS edit failure']
  },
  {
    id: 'dla-ebs-reporting',
    layer: 'reporting',
    title: 'EBS Reporting / EA2 Analytics',
    subtitle: 'Operational reports, analytics, audit extracts',
    icon: 'BI',
    tags: ['reporting', 'EA2', 'analytics', 'audit extract'],
    summary: 'Provides EBS reports, enterprise analytics, data extracts, audit populations, management dashboards, and reconciled views of supply-chain and financial activity.',
    examples: ['management dashboard', 'audit extract', 'inventory report', 'customer order report', 'AP/AR aging'],
    auditQuestions: ['Are report definitions tied to authoritative sources?', 'Do extracts reconcile to EBS control totals?', 'Are filters and refresh dates documented?'],
    keyFields: ['report ID', 'extract date', 'source table/view', 'selection criteria', 'control total', 'amount'],
    risks: ['undocumented report logic', 'extract not reconciled', 'wrong population', 'stale analytics layer']
  },
  {
    id: 'dla-ddrs-gtas',
    layer: 'reporting',
    title: 'DDRS / GTAS / Treasury',
    subtitle: 'Adjusted trial balance, federal edits, FBwT and IGT reporting',
    icon: 'ATB',
    tags: ['DDRS', 'GTAS', 'Treasury', 'FBwT', 'IPAC'],
    summary: 'Supports adjusted trial balance, DDRS, GTAS edit validation, Treasury/CARS/FBwT, IPAC/G-Invoicing, TAS/BETC, and trading-partner reconciliation.',
    examples: ['adjusted trial balance', 'GTAS submission', 'FBwT reconciliation', 'IPAC settlement', 'trading-partner elimination'],
    auditQuestions: ['Does ATB reconcile to EBS GL?', 'Are GTAS edits resolved?', 'Are cash and trading-partner differences researched?'],
    keyFields: ['TAS', 'USSGL', 'BETC', 'ALC', 'trading partner', 'GTAS attribute', 'amount'],
    risks: ['ATB/GL mismatch', 'FBwT difference', 'GTAS edit failure', 'trading partner mismatch']
  },
  {
    id: 'dla-wcf-statement',
    layer: 'statements',
    title: 'Working Capital Fund Statements',
    subtitle: 'Inventory, revenue, cost recovery, net cost',
    icon: 'WCF',
    tags: ['working capital fund', 'inventory', 'net cost', 'statement'],
    summary: 'Supports DLA working-capital reporting, inventory valuation, revenue, cost recovery, cost of goods, net cost, and operating-result analysis.',
    examples: ['inventory line', 'revenue', 'cost of goods', 'net cost', 'operating result'],
    auditQuestions: ['Do inventory and COGS lines tie to EBS detail?', 'Are revenue/cost recovery calculations supported?', 'Are note schedules reconciled?'],
    keyFields: ['fund', 'USSGL', 'statement line', 'material', 'customer', 'revenue', 'cost'],
    risks: ['inventory valuation misstatement', 'revenue/cost mismatch', 'unsupported note schedule', 'segment imbalance']
  },
  {
    id: 'dla-sbr',
    layer: 'statements',
    title: 'Statement of Budgetary Resources',
    subtitle: 'Budgetary resources, obligations, outlays, recoveries',
    icon: 'SBR',
    tags: ['SBR', 'budgetary', 'outlay', 'statement'],
    summary: 'Supports budgetary statement reporting from DLA budgetary accounting activity, including resources, obligations, expenditures, outlays, recoveries, and unobligated balances.',
    examples: ['budgetary resources', 'obligations incurred', 'outlays', 'recoveries', 'unobligated balance'],
    auditQuestions: ['Can SBR lines trace to budgetary postings?', 'Are obligations and outlays supportable?', 'Do recoveries reconcile to source evidence?'],
    keyFields: ['TAS', 'budgetary USSGL', 'SBR line', 'fund', 'period', 'amount'],
    risks: ['unsupported obligation', 'budgetary line mismatch', 'outlay not tied to Treasury', 'stale open obligation']
  },
  {
    id: 'dla-balance-notes',
    layer: 'statements',
    title: 'Balance Sheet / Notes',
    subtitle: 'Inventory, AP, AR, FBwT, liabilities, disclosures',
    icon: 'FS',
    tags: ['balance sheet', 'notes', 'AP', 'AR', 'FBwT'],
    summary: 'Supports Balance Sheet lines and note schedules for inventory, AP, AR, FBwT, liabilities, intragovernmental activity, and related disclosures.',
    examples: ['inventory note', 'AP schedule', 'AR schedule', 'FBwT line', 'IGT disclosure'],
    auditQuestions: ['Do balance sheet lines tie to trial balance and subsidiary detail?', 'Are AP/AR aging schedules reconciled?', 'Are IGT disclosures supported?'],
    keyFields: ['USSGL', 'statement line', 'note schedule', 'material', 'vendor/customer', 'trading partner', 'amount'],
    risks: ['note schedule does not tie', 'subsidiary mismatch', 'unsupported liability', 'IGT difference']
  }
];

const dlaEbsLineageScenarios = [
  {
    id: 'dla-order-to-cash',
    short: 'order to cash',
    title: 'DLA Customer Order to Cash Path',
    description: 'Shows how customer demand flows from FedMall/DAAS through EBS order management, fulfillment, billing, AR, collections, reporting, and statement support.',
    path: ['fedmall-eebp', 'daas-dlms', 'dla-demand-order', 'dla-order-fulfillment', 'dla-ar-accounting', 'dla-ddrs-gtas', 'dla-wcf-statement'],
    steps: [
      'A customer order or requisition is submitted through a DLA portal or logistics transaction channel.',
      'EBS validates customer, DoDAAC, NSN, priority, fund, and availability data.',
      'Warehouse or distribution activity fulfills the order through pick, pack, ship, and status updates.',
      'Billing and AR records are created and later settled through collection or offset.',
      'Reporting and working-capital statements tie fulfillment, revenue, cost, and receivable balances back to source events.'
    ],
    exceptionTests: ['customer demand not accepted by EBS', 'shipment without billing', 'billing without shipment', 'collection not applied', 'AR aging unsupported']
  },
  {
    id: 'dla-procure-to-pay',
    short: 'procure to pay',
    title: 'DLA Procurement to Vendor Payment Path',
    description: 'Shows how DLA buys inventory or support items through solicitation, procurement, receipt, invoice, AP, payment, and GL reporting.',
    path: ['dibbs-vsm', 'dla-procurement', 'dla-piee-wawf', 'dla-inventory-detail', 'dla-ap-accounting', 'dla-ddrs-gtas', 'dla-balance-notes'],
    steps: [
      'Supplier quote, solicitation, or procurement demand creates buying activity.',
      'EBS records PR/PO, vendor, contract, material, price, and delivery terms.',
      'Receipt and acceptance evidence supports inventory update and invoice matching.',
      'AP records liability, accrual, payment clearing, and vendor payment activity.',
      'Trial balance and statements reflect inventory, AP, expense, and cash impacts.'
    ],
    exceptionTests: ['PO not tied to demand', 'receipt/invoice mismatch', 'duplicate invoice', 'vendor liability unsupported', 'inventory not updated after receipt']
  },
  {
    id: 'dla-inventory-valuation',
    short: 'inventory valuation',
    title: 'DLA Inventory Valuation and Movement Path',
    description: 'Shows how catalog, warehouse, movement, valuation, GL, reporting, and statement controls support DLA inventory assertions.',
    path: ['webflis-fedlog', 'dss-distribution', 'dla-inventory', 'dla-material-master', 'dla-inventory-detail', 'dla-inventory-gl', 'dla-ebs-reporting', 'dla-wcf-statement'],
    steps: [
      'Authoritative catalog and NSN data establish material identity and key logistics attributes.',
      'Depot and distribution events update inventory quantity, location, condition, and movement history.',
      'EBS inventory and valuation detail records stock balances and financial value.',
      'Inventory subledger balances reconcile to GL and working-capital reporting.',
      'Audit extracts and statements tie inventory lines to material, movement, and valuation support.'
    ],
    exceptionTests: ['invalid material/NSN link', 'physical/book inventory mismatch', 'condition code not financially reflected', 'inventory subledger not tied to GL', 'unsupported adjustment']
  },
  {
    id: 'dla-close-reporting',
    short: 'close reporting',
    title: 'DLA EBS Close, Treasury, and Statement Path',
    description: 'Shows how EBS financial records move through close, adjusted trial balance, DDRS, GTAS, Treasury, and DoD statement support.',
    path: ['dla-finance-core', 'dla-ap-accounting', 'dla-ar-accounting', 'dla-inventory-gl', 'dla-budgetary', 'dla-ddrs-gtas', 'dla-sbr', 'dla-balance-notes'],
    steps: [
      'EBS subledgers and GL are reconciled for AP, AR, inventory, cost, revenue, and budgetary activity.',
      'Manual adjustments and close entries are documented, approved, posted, and reversed where required.',
      'Adjusted trial balance and reporting extracts are prepared and reconciled to EBS GL.',
      'DDRS, GTAS, Treasury, and intragovernmental edits are cleared with evidence.',
      'Statement and note schedules tie back to trial balance, subsidiary ledgers, and source populations.'
    ],
    exceptionTests: ['AP/AR not reconciled to GL', 'inventory/GL mismatch', 'unsupported manual journal', 'GTAS edit failure', 'note schedule does not tie']
  }
];

const dlaEbsSupportServices = [
  { title: 'DLA Mission Context', detail: 'DLA manages the end-to-end global defense supply chain across military services, combatant commands, federal agencies, partners, and allied nations.' },
  { title: 'ERP Platform Profile', detail: 'Modeled as DLA EBS with a BSM commercial ERP modernization lineage and SAP-style process/tables where public sources support an ERP interpretation; exact configuration requires DLA authority.' },
  { title: 'Data Standards & DAAS', detail: 'DLMS, MILS, DAAS routing, DoDAAC, fund code, NSN, CAGE, and logistics data standards connect operational logistics transactions to financial consequences.' },
  { title: 'Master Data Governance', detail: 'NSN/material, vendor, customer, catalog, plant/storage, condition, valuation class, fund, TAS, USSGL, and trading-partner values drive traceability.' },
  { title: 'Close & Reporting', detail: 'Subledger-to-GL tie-outs, inventory valuation reconciliations, AP/AR aging, ATB, DDRS, GTAS, Treasury/FBwT, and statement package controls.' },
  { title: 'Audit Evidence', detail: 'Customer orders, DLMS messages, catalog records, POs, receipts, WAWF invoices, warehouse movements, shipments, GL documents, extracts, and reconciliations.' }
];

const dlaEbsCaveats = [
  'DLA EBS is modeled as the current operational DLA enterprise business system/supply-chain finance environment with a public BSM commercial ERP modernization lineage.',
  'Public evidence supports treating the system as a COTS ERP/SAP-style DLA logistics and financial backbone, but exact current modules, tables, interfaces, hosting, and customizations require authoritative DLA program documentation.',
  'Feeder counts are modeled source-system categories represented in this blueprint, not a certified DLA EBS interface inventory.',
  'DLA has multiple supply-chain and mission contexts, including Energy, Troop Support, Weapons Support, Distribution, Disposition Services, and strategic/material programs; local workflows may differ by commodity and role.'
];

const dlaEbsSources = [
  { name: 'DLA official mission and organization', url: 'https://www.dla.mil/' },
  { name: 'DLA Applications', url: 'https://www.dla.mil/Working-With-DLA/Applications/' },
  { name: 'GAO-04-615 DOD Business Systems Modernization', url: 'https://www.gao.gov/products/gao-04-615' },
  { name: 'DoD Financial Management Regulation', url: 'https://comptroller.defense.gov/FMR/' },
  { name: 'Treasury GTAS', url: 'https://fiscal.treasury.gov/accounting/government-wide-treasury-account-symbol-gtas' },
  { name: 'Treasury USSGL', url: 'https://fiscal.treasury.gov/accounting/us-standard-general-ledger-ussgl' },
  { name: 'Treasury G-Invoicing / IPAC', url: 'https://fiscal.treasury.gov/accounting/intragov' }
];

const abssLayers = [
  { id: 'source', label: 'Source / Requirement Inputs', short: 'Source', description: 'Air Force requirement owners, funding officials, contracting inputs, vendor/payment evidence, card activity, and source documents that initiate business-service requests.' },
  { id: 'core', label: 'ABSS Workflow / Business Services', short: 'ABSS', description: 'Automated Business Services System workflow for request intake, funding validation, package routing, approval status, procurement handoff, and audit evidence.' },
  { id: 'detail', label: 'Procurement / Request Detail', short: 'Detail', description: 'Requirement package, purchase request, MIPR, GPC, award, receipt, acceptance, invoice, ULO, deobligation, and closeout detail.' },
  { id: 'accounting', label: 'Accounting Layer', short: 'Accounting', description: 'Commitment, obligation, expense, accrual, AP, payment, GL, budgetary USSGL, proprietary USSGL, and close accounting, typically downstream in DEAMS or related accounting environments.' },
  { id: 'reporting', label: 'Reporting / Treasury Layer', short: 'Reporting', description: 'ABSS status reports, acquisition metrics, DEAMS/GL reporting, DDRS, GTAS, Treasury/CARS/FBwT, IPAC/G-Invoicing, and audit extracts.' },
  { id: 'statements', label: 'Financial Statement Support', short: 'Statements', description: 'SBR, Net Cost, Balance Sheet/AP, ULO, obligation aging, accrual, note schedule, and audit support tied back to request and award evidence.' }
];

const abssNodes = [
  {
    id: 'abss-requirement-owner',
    layer: 'source',
    title: 'Requirement Owner',
    subtitle: 'Mission need, scope, estimate, and package inputs',
    icon: 'REQ',
    tags: ['requirement', 'mission owner', 'scope', 'package'],
    summary: 'Originates the need for goods, services, construction support, IT, professional services, training, logistics support, or other Air Force business-service requirements.',
    examples: ['requirement description', 'performance work statement', 'statement of work', 'market research', 'independent government cost estimate'],
    auditQuestions: ['Is the requirement real, approved, and tied to mission need?', 'Does the package contain enough support for contracting and funding decisions?', 'Are split purchases or scope creep visible?'],
    keyFields: ['request ID', 'organization', 'requirement type', 'scope', 'estimated amount', 'period of performance', 'mission owner'],
    risks: ['unsupported requirement', 'incomplete package', 'split purchase', 'wrong acquisition path']
  },
  {
    id: 'abss-funding-source',
    layer: 'source',
    title: 'Funding / LOA Source',
    subtitle: 'Fund cite, certification, and accounting classification',
    icon: 'LOA',
    tags: ['funding', 'LOA', 'certification', 'budget'],
    summary: 'Provides funding authority, line of accounting, certification, fiscal-year, purpose, amount, and budgetary control support for the request.',
    examples: ['fund cite', 'line of accounting', 'fund certification', 'budget approval', 'MIPR funding'],
    auditQuestions: ['Is funding available, legal, and certified?', 'Does the LOA match purpose, period, and amount?', 'Are changes to funding documented?'],
    keyFields: ['LOA', 'fund cite', 'TAS', 'fiscal year', 'object class', 'amount', 'certifier'],
    risks: ['invalid LOA', 'funding not certified', 'purpose/time/amount issue', 'unrecorded funding change']
  },
  {
    id: 'abss-contracting-source',
    layer: 'source',
    title: 'Contracting / Market Inputs',
    subtitle: 'Acquisition strategy, vendor, award, and contract evidence',
    icon: 'CTR',
    tags: ['contracting', 'AFICC', 'award', 'vendor'],
    summary: 'Provides contracting strategy, sourcing, vendor, award, modification, clause, and contracting-officer decision evidence used to move an approved request into procurement execution.',
    examples: ['acquisition strategy', 'solicitation', 'vendor quote', 'award', 'modification', 'contracting officer approval'],
    auditQuestions: ['Does the request hand off cleanly to contracting?', 'Are vendor and award decisions supported?', 'Are modifications and funding changes reflected back to the request trail?'],
    keyFields: ['PIID', 'solicitation', 'vendor', 'CAGE/UEI', 'CLIN', 'contracting office', 'award amount'],
    risks: ['award not tied to request', 'modification not reflected', 'vendor support missing', 'manual handoff break']
  },
  {
    id: 'abss-piee-wawf',
    layer: 'source',
    title: 'PIEE / WAWF',
    subtitle: 'Invoice, receipt, acceptance, and payment support',
    icon: 'P2P',
    tags: ['PIEE', 'WAWF', 'invoice', 'receipt', 'acceptance'],
    summary: 'Captures invoice, receipt, acceptance, contract reference, and payment-support evidence after the ABSS requirement is awarded and performed.',
    examples: ['vendor invoice', 'receiving report', 'acceptance record', 'combo document', 'payment request'],
    auditQuestions: ['Does each invoice trace to the approved request and award?', 'Was receipt and acceptance completed by the right official?', 'Do accepted quantities and amounts match the award?'],
    keyFields: ['invoice number', 'PIID', 'CLIN', 'receiving report', 'acceptance date', 'vendor', 'amount'],
    risks: ['payment without acceptance', 'invoice not tied to request', 'quantity/price mismatch', 'duplicate invoice']
  },
  {
    id: 'abss-gpc-bank',
    layer: 'source',
    title: 'GPC / Bank / Micro-Purchase',
    subtitle: 'Government purchase card and bank settlement support',
    icon: 'GPC',
    tags: ['GPC', 'bank', 'micro-purchase', 'card'],
    summary: 'Provides cardholder, approving official, merchant, receipt, statement, and reconciliation evidence for micro-purchase or card-based business-service activity.',
    examples: ['GPC request', 'merchant receipt', 'card statement', 'approving official review', 'bank settlement'],
    auditQuestions: ['Is the purchase within cardholder authority and threshold?', 'Is receipt and approving-official review documented?', 'Was the purchase split to avoid competition or threshold rules?'],
    keyFields: ['cardholder', 'approving official', 'merchant', 'transaction date', 'MCC', 'amount', 'statement'],
    risks: ['split purchase', 'missing receipt', 'unauthorized merchant', 'statement not reconciled']
  },
  {
    id: 'abss-request-intake',
    layer: 'core',
    title: 'ABSS Request Intake',
    subtitle: 'Requirement capture, category, amount, and package checklist',
    icon: 'IN',
    tags: ['intake', 'request', 'workflow', 'package'],
    summary: 'Captures the business-service request, requirement category, estimated value, organization, funding need, attachments, priority, and package completeness checks.',
    examples: ['new request', 'package checklist', 'attachment upload', 'category selection', 'estimated value'],
    auditQuestions: ['Is the request complete before routing?', 'Are required attachments present for the category and amount?', 'Can the request be traced to the mission owner?'],
    keyFields: ['ABSS request ID', 'request type', 'organization', 'amount', 'attachments', 'priority', 'submitter'],
    risks: ['incomplete package routed', 'wrong category', 'attachments missing', 'request owner unclear']
  },
  {
    id: 'abss-funds-validation',
    layer: 'core',
    title: 'Funds Validation / Certification',
    subtitle: 'LOA, budgetary availability, commitment, and control',
    icon: 'FUND',
    tags: ['funds', 'certification', 'commitment', 'budget'],
    summary: 'Routes the request for budget review, funds certification, LOA validation, commitment or pre-commitment support, and funding-change controls.',
    examples: ['funds certification', 'LOA validation', 'commitment request', 'funding revision', 'budget rejection'],
    auditQuestions: ['Was funding certified before contracting action?', 'Do amounts and periods agree across request, LOA, PR, and award?', 'Are funding changes fully approved?'],
    keyFields: ['certification date', 'certifier', 'LOA', 'funding amount', 'commitment number', 'fiscal year', 'status'],
    risks: ['uncertified funds', 'amount mismatch', 'wrong fiscal year', 'unapproved funding change']
  },
  {
    id: 'abss-approval-routing',
    layer: 'core',
    title: 'Approval Routing',
    subtitle: 'Resource, legal, contracting, technical, and leadership review',
    icon: 'APR',
    tags: ['approval', 'routing', 'workflow', 'review'],
    summary: 'Routes the package through resource management, contracting, legal, technical, small business, leadership, or other required reviewers depending on request type and value.',
    examples: ['resource approval', 'legal review', 'technical review', 'contracting review', 'leadership approval'],
    auditQuestions: ['Were all required approvals completed in sequence?', 'Are rejections and resubmissions visible?', 'Were approvals made by authorized roles?'],
    keyFields: ['routing step', 'reviewer', 'role', 'decision', 'date/time', 'comments', 'status'],
    risks: ['approval skipped', 'unauthorized reviewer', 'stale routing', 'resubmission not tracked']
  },
  {
    id: 'abss-pr-handoff',
    layer: 'core',
    title: 'PR / Contracting / GPC Handoff',
    subtitle: 'Approved request to procurement, MIPR, card, or contract path',
    icon: 'PR',
    tags: ['purchase request', 'handoff', 'contracting', 'MIPR', 'GPC'],
    summary: 'Turns an approved request package into the appropriate downstream procurement path, such as purchase request, MIPR, GPC purchase, contracting action, or interagency support.',
    examples: ['purchase request', 'MIPR package', 'GPC request', 'contracting handoff', 'routing to SPS/contract writing'],
    auditQuestions: ['Does the handoff preserve request ID and funding support?', 'Was the correct procurement path selected?', 'Do downstream award records tie back to ABSS?'],
    keyFields: ['ABSS request ID', 'PR number', 'MIPR number', 'GPC reference', 'contracting office', 'handoff date', 'status'],
    risks: ['handoff loses lineage', 'wrong path selected', 'PR not created', 'contracting action not tied to request']
  },
  {
    id: 'abss-status-evidence',
    layer: 'core',
    title: 'Status / Evidence Repository',
    subtitle: 'Audit trail, package status, attachments, and closeout',
    icon: 'DOC',
    tags: ['status', 'evidence', 'audit trail', 'closeout'],
    summary: 'Maintains the status trail, comments, attachments, approval history, document versions, and closeout evidence needed to reconstruct the request lifecycle.',
    examples: ['status history', 'attachment record', 'version history', 'approval comments', 'closeout note'],
    auditQuestions: ['Can the full request lifecycle be reconstructed?', 'Are documents versioned and retained?', 'Does closeout evidence tie to receipt, acceptance, and final accounting?'],
    keyFields: ['request ID', 'document version', 'status', 'timestamp', 'owner', 'attachment type', 'closeout date'],
    risks: ['missing audit trail', 'attachment not retained', 'status not updated', 'closeout unsupported']
  },
  {
    id: 'abss-requirement-package',
    layer: 'detail',
    title: 'Requirement Package Detail',
    subtitle: 'PWS/SOW, IGCE, market research, approvals, acquisition support',
    icon: 'PKG',
    tags: ['PWS', 'SOW', 'IGCE', 'market research', 'package'],
    summary: 'Preserves detailed requirement documentation used to support the acquisition, funding, approval, and later audit trail.',
    examples: ['PWS', 'SOW', 'IGCE', 'market research', 'brand-name justification', 'sole-source justification'],
    auditQuestions: ['Does the package support the acquisition decision?', 'Are estimates and scope aligned to funding?', 'Were required justifications completed?'],
    keyFields: ['request ID', 'document type', 'requirement category', 'estimated amount', 'period of performance', 'approver'],
    risks: ['unsupported acquisition strategy', 'estimate not documented', 'scope/funding mismatch', 'missing justification']
  },
  {
    id: 'abss-purchase-request',
    layer: 'detail',
    title: 'Purchase Request / MIPR / GPC Detail',
    subtitle: 'Funding, request, and procurement-path detail',
    icon: 'BUY',
    tags: ['purchase request', 'MIPR', 'GPC', 'commitment'],
    summary: 'Captures the downstream request object created from ABSS, including PR, MIPR, card request, commitment support, and procurement-path metadata.',
    examples: ['PR', 'MIPR', 'GPC request', 'commitment', 'funding document'],
    auditQuestions: ['Does each PR/MIPR/GPC action trace to the approved ABSS request?', 'Do funding amounts match?', 'Is the procurement path appropriate for value and scope?'],
    keyFields: ['PR number', 'MIPR number', 'GPC reference', 'commitment', 'LOA', 'amount', 'ABSS request ID'],
    risks: ['PR amount mismatch', 'request lineage broken', 'GPC threshold issue', 'MIPR not accepted']
  },
  {
    id: 'abss-award-obligation',
    layer: 'detail',
    title: 'Award / Obligation Detail',
    subtitle: 'Contract, modification, funding line, and obligation support',
    icon: 'AWD',
    tags: ['award', 'obligation', 'contract', 'SPS', 'EDA'],
    summary: 'Preserves award, modification, PIID, CLIN, funding line, obligation, and contract writing records that connect ABSS-approved requirements to legal obligation.',
    examples: ['award', 'modification', 'funding line', 'obligation', 'EDA contract record'],
    auditQuestions: ['Does the award trace to the approved request and funding?', 'Are modifications reflected in ABSS and accounting?', 'Do CLINs and amounts agree to the obligation?'],
    keyFields: ['PIID', 'mod number', 'CLIN', 'vendor', 'obligation number', 'funding line', 'amount'],
    risks: ['award not tied to request', 'modification not reflected', 'obligation amount mismatch', 'line detail lost']
  },
  {
    id: 'abss-receipt-acceptance',
    layer: 'detail',
    title: 'Receipt / Acceptance / Invoice Detail',
    subtitle: 'COR, receiving official, WAWF, invoice, and performance evidence',
    icon: 'REC',
    tags: ['receipt', 'acceptance', 'invoice', 'COR', 'WAWF'],
    summary: 'Documents performance, receiving, acceptance, invoice, COR review, and payment-support data used to validate expense, accrual, AP, and outlay activity.',
    examples: ['receiving report', 'acceptance record', 'COR approval', 'invoice', 'performance evidence'],
    auditQuestions: ['Was the good or service actually received and accepted?', 'Does invoice detail agree to award and acceptance?', 'Are partial receipts and accruals handled correctly?'],
    keyFields: ['receiving report', 'acceptance date', 'invoice', 'COR', 'PIID', 'CLIN', 'amount'],
    risks: ['payment without receipt', 'acceptance by wrong official', 'invoice mismatch', 'missing performance evidence']
  },
  {
    id: 'abss-closeout-ulo',
    layer: 'detail',
    title: 'Closeout / ULO / Deobligation',
    subtitle: 'Open obligation review and final package closure',
    icon: 'ULO',
    tags: ['closeout', 'ULO', 'deobligation', 'aging'],
    summary: 'Supports review of open commitments, obligations, undelivered orders, accruals, final invoice, deobligation, and request closeout.',
    examples: ['ULO review', 'final invoice', 'deobligation', 'closeout memo', 'excess funds return'],
    auditQuestions: ['Are open obligations still valid?', 'Were excess funds deobligated timely?', 'Does closeout tie to final receipt, invoice, and payment?'],
    keyFields: ['obligation', 'open amount', 'last activity date', 'deobligation', 'closeout status', 'request ID'],
    risks: ['stale ULO', 'funds not deobligated', 'closeout unsupported', 'aged accrual']
  },
  {
    id: 'abss-commitment-obligation',
    layer: 'accounting',
    title: 'Commitment / Obligation Accounting',
    subtitle: 'Budgetary posting and funds-control impact',
    icon: 'BUD',
    tags: ['commitment', 'obligation', 'budgetary', 'SBR'],
    summary: 'Records or supports downstream budgetary commitment and obligation accounting in DEAMS or related accounting environments.',
    examples: ['commitment', 'obligation', 'upward adjustment', 'downward adjustment', 'deobligation'],
    auditQuestions: ['Does accounting trace to certified ABSS funding?', 'Are obligation amounts consistent with award and modifications?', 'Are deobligations timely and supported?'],
    keyFields: ['commitment', 'obligation', 'LOA', 'TAS', 'USSGL', 'amount', 'period'],
    risks: ['obligation without certified request', 'amount mismatch', 'late deobligation', 'budgetary misclassification']
  },
  {
    id: 'abss-ap-accrual',
    layer: 'accounting',
    title: 'AP / Accrual / Payment Support',
    subtitle: 'Receipt, invoice, accrual, liability, and outlay',
    icon: 'AP',
    tags: ['AP', 'accrual', 'payment', 'expense'],
    summary: 'Supports downstream AP, accrual, liability, expense, and payment accounting using receipt, acceptance, invoice, and performance evidence.',
    examples: ['AP liability', 'accrual', 'payment', 'invoice clearing', 'expense recognition'],
    auditQuestions: ['Do AP and accrual balances trace to received goods/services?', 'Are payments tied to accepted invoices?', 'Are accruals reversed when invoice/payment posts?'],
    keyFields: ['invoice', 'receipt', 'acceptance', 'AP document', 'payment voucher', 'USSGL', 'amount'],
    risks: ['unsupported accrual', 'payment without acceptance', 'duplicate liability', 'accrual not reversed']
  },
  {
    id: 'abss-gl-close',
    layer: 'accounting',
    title: 'GL / Close Accounting',
    subtitle: 'USSGL, trial balance, adjustments, and period close',
    icon: 'GL',
    tags: ['GL', 'USSGL', 'close', 'trial balance'],
    summary: 'Represents the GL and close impact of ABSS-supported procurement activity, including budgetary/proprietary posting, adjustments, trial balance, and statement crosswalk support.',
    examples: ['GL posting', 'trial balance', 'manual adjustment', 'year-end close', 'statement crosswalk'],
    auditQuestions: ['Do GL balances reconcile to ABSS-related detail?', 'Are manual adjustments tied to source support?', 'Do USSGL accounts crosswalk to statements correctly?'],
    keyFields: ['GL document', 'USSGL', 'TAS', 'fund', 'period', 'debit', 'credit'],
    risks: ['GL without source support', 'invalid USSGL', 'trial balance mismatch', 'unsupported manual adjustment']
  },
  {
    id: 'abss-status-reporting',
    layer: 'reporting',
    title: 'ABSS Status / Management Reports',
    subtitle: 'Request status, cycle time, workload, and audit extracts',
    icon: 'RPT',
    tags: ['reporting', 'status', 'metrics', 'audit extract'],
    summary: 'Provides request lifecycle reporting, package aging, routing status, workload, cycle-time, approval bottlenecks, and audit population extracts.',
    examples: ['open request report', 'approval aging', 'cycle-time dashboard', 'package exception report', 'audit extract'],
    auditQuestions: ['Do reports reconcile to the ABSS authoritative request population?', 'Are filters and refresh dates documented?', 'Are aged or rejected requests monitored?'],
    keyFields: ['report ID', 'request ID', 'status', 'owner', 'aging', 'extract date', 'control total'],
    risks: ['report not reconciled', 'wrong population', 'stale status', 'aging not acted upon']
  },
  {
    id: 'abss-deams-ddrs',
    layer: 'reporting',
    title: 'DEAMS / DDRS / Trial Balance',
    subtitle: 'Accounting reports and adjusted trial-balance support',
    icon: 'ATB',
    tags: ['DEAMS', 'DDRS', 'trial balance', 'reporting'],
    summary: 'Connects ABSS-supported request activity to downstream DEAMS, DDRS, adjusted trial balance, and financial reporting outputs.',
    examples: ['DEAMS report', 'adjusted trial balance', 'DDRS feed', 'edit report', 'reconciliation'],
    auditQuestions: ['Do DEAMS/ATB balances tie back to ABSS-supported source populations?', 'Are DDRS edits resolved?', 'Are request-to-obligation reconciliations complete?'],
    keyFields: ['TAS', 'USSGL', 'trial balance line', 'request population', 'obligation', 'period', 'amount'],
    risks: ['ABSS population not reconciled', 'ATB edit failure', 'obligation not tied to request', 'late adjustment']
  },
  {
    id: 'abss-treasury-reporting',
    layer: 'reporting',
    title: 'Treasury / GTAS / IGT',
    subtitle: 'TAS, USSGL, FBwT, IPAC, and G-Invoicing impacts',
    icon: 'TRY',
    tags: ['Treasury', 'GTAS', 'FBwT', 'IPAC', 'G-Invoicing'],
    summary: 'Supports Treasury and intragovernmental reporting where ABSS-supported awards, payments, and interagency agreements create TAS, USSGL, FBwT, IPAC, or trading-partner impacts.',
    examples: ['GTAS submission', 'FBwT reconciliation', 'IPAC settlement', 'G-Invoicing order', 'trading partner support'],
    auditQuestions: ['Do TAS/USSGL values pass GTAS edits?', 'Are payments and IPAC activity tied to request and award support?', 'Are trading-partner values complete?'],
    keyFields: ['TAS', 'USSGL', 'BETC', 'ALC', 'trading partner', 'IPAC document', 'amount'],
    risks: ['GTAS edit failure', 'FBwT difference', 'trading partner mismatch', 'payment not tied to source']
  },
  {
    id: 'abss-sbr',
    layer: 'statements',
    title: 'Statement of Budgetary Resources',
    subtitle: 'Commitment, obligation, expenditure, outlay, ULO',
    icon: 'SBR',
    tags: ['SBR', 'budgetary', 'obligation', 'outlay'],
    summary: 'Supports SBR reporting by linking ABSS requests and funding certification to commitments, obligations, expenditures, outlays, recoveries, and open obligation review.',
    examples: ['obligations incurred', 'undelivered orders', 'outlays', 'recoveries', 'unobligated balance'],
    auditQuestions: ['Can SBR lines trace to certified ABSS requests and awards?', 'Are ULOs valid?', 'Do outlays tie to payment and Treasury evidence?'],
    keyFields: ['SBR line', 'TAS', 'budgetary USSGL', 'obligation', 'outlay', 'ULO', 'amount'],
    risks: ['unsupported obligation', 'stale ULO', 'outlay not tied to payment', 'budgetary mismatch']
  },
  {
    id: 'abss-net-cost',
    layer: 'statements',
    title: 'Net Cost / Expense Support',
    subtitle: 'Services received, expense recognition, accrual and AP support',
    icon: 'SNC',
    tags: ['net cost', 'expense', 'accrual', 'AP'],
    summary: 'Supports expense and net-cost reporting for services or goods requested through ABSS and later received, accepted, invoiced, accrued, or paid.',
    examples: ['service expense', 'supply expense', 'accrual', 'AP liability', 'net cost line'],
    auditQuestions: ['Do expenses trace to received/accepted services?', 'Are accruals complete and reversed?', 'Are AP balances supported by invoices and acceptance?'],
    keyFields: ['USSGL expense account', 'invoice', 'receipt', 'period', 'AP balance', 'amount'],
    risks: ['expense not supported', 'missing accrual', 'AP mismatch', 'wrong period']
  },
  {
    id: 'abss-notes-audit',
    layer: 'statements',
    title: 'Notes / Audit Support',
    subtitle: 'ULO aging, AP schedules, commitments, evidence packages',
    icon: 'AUD',
    tags: ['notes', 'audit', 'ULO', 'evidence'],
    summary: 'Supports audit packages, note schedules, ULO aging, AP support, commitments, accrual support, and source-to-statement testing.',
    examples: ['ULO aging', 'AP support schedule', 'audit sample package', 'commitment report', 'reconciliation'],
    auditQuestions: ['Can an auditor trace from statement line to ABSS request package?', 'Are aged ULOs and AP schedules reconciled?', 'Is evidence retained and complete?'],
    keyFields: ['request ID', 'obligation', 'invoice', 'note schedule', 'aging', 'reconciliation total', 'sample ID'],
    risks: ['audit package incomplete', 'note schedule does not tie', 'aged item unsupported', 'source evidence missing']
  }
];

const abssLineageScenarios = [
  {
    id: 'abss-services-request',
    short: 'services request',
    title: 'ABSS Services Requirement to Award Path',
    description: 'Shows how an Air Force service requirement moves from mission owner package through ABSS funding, approval, procurement handoff, award, accounting, and statement support.',
    path: ['abss-requirement-owner', 'abss-request-intake', 'abss-funds-validation', 'abss-approval-routing', 'abss-pr-handoff', 'abss-award-obligation', 'abss-commitment-obligation', 'abss-sbr'],
    steps: [
      'A mission owner builds the requirement package and submits it into ABSS.',
      'ABSS captures category, estimate, attachments, priority, organization, and routing needs.',
      'Resource management validates LOA, funds availability, purpose, amount, and certification.',
      'Required reviewers approve, reject, or return the package for correction.',
      'The approved request is handed off to PR, MIPR, GPC, or contracting execution.',
      'Award and obligation activity is reconciled back to the ABSS request and supports SBR reporting.'
    ],
    exceptionTests: ['request package incomplete', 'funding not certified', 'approval skipped', 'handoff loses request ID', 'award amount differs from certified funding']
  },
  {
    id: 'abss-invoice-payment',
    short: 'invoice payment',
    title: 'ABSS Receipt, Invoice, AP, and Payment Path',
    description: 'Shows how an awarded ABSS-supported requirement moves through receipt/acceptance, invoice, AP/accrual, payment, reporting, and net-cost support.',
    path: ['abss-award-obligation', 'abss-piee-wawf', 'abss-receipt-acceptance', 'abss-ap-accrual', 'abss-deams-ddrs', 'abss-net-cost'],
    steps: [
      'The awarded requirement establishes contract and funding detail.',
      'Goods or services are received and accepted by authorized officials.',
      'Invoice evidence is matched to award, receipt, and acceptance.',
      'AP, accrual, payment clearing, and expense recognition are recorded downstream.',
      'DEAMS/DDRS and reporting outputs tie the expense back to request and award evidence.'
    ],
    exceptionTests: ['invoice without ABSS/award link', 'payment without acceptance', 'accrual not reversed', 'invoice amount exceeds accepted amount', 'expense posted to wrong period']
  },
  {
    id: 'abss-gpc',
    short: 'GPC',
    title: 'ABSS Government Purchase Card Path',
    description: 'Shows how micro-purchase or card-based activity is requested, approved, purchased, reconciled, and supported for audit.',
    path: ['abss-gpc-bank', 'abss-request-intake', 'abss-approval-routing', 'abss-purchase-request', 'abss-ap-accrual', 'abss-status-evidence', 'abss-notes-audit'],
    steps: [
      'A cardholder or requirement owner initiates a GPC-supported request where appropriate.',
      'ABSS captures need, category, amount, cardholder, approving official, and evidence requirements.',
      'Approval routing confirms threshold, authority, and proper use.',
      'The card transaction, receipt, statement, and reconciliation evidence are retained.',
      'Audit support ties the request, receipt, approving-official review, and bank settlement together.'
    ],
    exceptionTests: ['split purchase', 'missing receipt', 'unauthorized merchant', 'statement not reconciled', 'approving official review missing']
  },
  {
    id: 'abss-closeout',
    short: 'closeout',
    title: 'ABSS ULO, Deobligation, and Closeout Path',
    description: 'Shows how ABSS-supported obligations should be reviewed, deobligated, closed, and supported for statements and audit.',
    path: ['abss-status-reporting', 'abss-closeout-ulo', 'abss-gl-close', 'abss-deams-ddrs', 'abss-treasury-reporting', 'abss-notes-audit'],
    steps: [
      'Open requests, commitments, obligations, receipts, invoices, and payments are reviewed for status and aging.',
      'Invalid or excess open amounts are researched and deobligated where appropriate.',
      'Closeout evidence ties final performance, invoice, payment, and accounting status together.',
      'GL, DEAMS/DDRS, Treasury, and statement schedules are updated and reconciled.',
      'Audit packages preserve the source trail from statement line back to ABSS request and award evidence.'
    ],
    exceptionTests: ['stale ULO', 'closeout without final invoice/payment evidence', 'deobligation not posted', 'note schedule not tied to source', 'aged request lacks owner']
  }
];

const abssSupportServices = [
  { title: 'Workflow Governance', detail: 'Request intake, package checklist, status trail, reviewer sequence, role authorization, comments, attachments, and closeout evidence.' },
  { title: 'Funding Controls', detail: 'LOA validation, funds certification, commitment support, fiscal-year controls, funding revisions, amount reconciliation, and deobligation tracking.' },
  { title: 'Contracting Integration', detail: 'PR, MIPR, GPC, SPS/contract writing, award, modification, PIID, CLIN, vendor, and contracting-officer decision evidence.' },
  { title: 'Receipt & Payment Evidence', detail: 'PIEE/WAWF invoice, receipt, acceptance, COR review, bank/card statements, AP, accrual, payment, and clearing support.' },
  { title: 'Reporting & Audit', detail: 'ABSS status reports, approval aging, open request populations, source-to-award reconciliation, DEAMS tie-outs, ULO review, and audit extracts.' },
  { title: 'Data Governance', detail: 'Request ID, organization, fund cite, vendor, PIID, CLIN, invoice, obligation, TAS, USSGL, period, amount, status, and evidence retention rules.' }
];

const abssCaveats = [
  'ABSS-specific public technical documentation is limited; this blueprint is a public-information business-process model, not an official Air Force implementation baseline.',
  'The public evidence does not support calling ABSS SAP or Oracle ERP. It is modeled here as an Air Force business-services/request workflow surface that feeds contracting, payment, and financial-management systems.',
  'Exact ABSS modules, interface names, database/platform stack, reports, routing rules, and current operational status require authoritative Air Force ABSS operating procedures or program documentation.',
  'Feeder counts are modeled source-system categories represented in this blueprint, not a certified ABSS interface inventory.'
];

const abssSources = [
  { name: 'Air Force Installation Contracting Center', url: 'https://www.afimsc.af.mil/Units/Air-Force-Installation-Contracting-Center/' },
  { name: 'Secretary of the Air Force Financial Management mission', url: 'https://www.saffm.hq.af.mil/' },
  { name: 'Procurement Integrated Enterprise Environment', url: 'https://piee.eb.mil/' },
  { name: 'DoD Financial Management Regulation', url: 'https://comptroller.defense.gov/FMR/' },
  { name: 'Treasury GTAS', url: 'https://fiscal.treasury.gov/accounting/government-wide-treasury-account-symbol-gtas' },
  { name: 'Treasury USSGL', url: 'https://fiscal.treasury.gov/accounting/us-standard-general-ledger-ussgl' },
  { name: 'Treasury G-Invoicing / IPAC', url: 'https://fiscal.treasury.gov/accounting/intragov' }
];

const gcssLayers = [
  { id: 'source', label: 'Unit / Logistics / Partner Source Events', short: 'Source', description: 'Unit supply, maintenance, property, catalog, distribution, vendor, and finance partner events that originate before GCSS transaction control.' },
  { id: 'core', label: 'GCSS Core Logistics Capabilities', short: 'GCSS', description: 'Supply, maintenance, property, inventory, and readiness capabilities that control operational logistics activity before financial impact is summarized or interfaced.' },
  { id: 'detail', label: 'Logistics Transaction Detail', short: 'Detail', description: 'Document-level logistics objects used to preserve the Universe of Transactions for material, requisition, work-order, asset, and inventory activity.' },
  { id: 'accounting', label: 'Financial Impact / Interface Layer', short: 'Finance', description: 'Budgetary, cost, inventory valuation, reimbursable, AP, and GL-facing activity exchanged with financial-management systems.' },
  { id: 'reporting', label: 'Readiness, ERP, and Treasury Reporting', short: 'Reporting', description: 'Operational readiness, logistics status, ERP extracts, trial-balance support, DDRS, GTAS, and reconciliation outputs.' },
  { id: 'statements', label: 'Financial Statement Assertions', short: 'Statements', description: 'Statement line items and audit assertions supported by logistics-to-finance lineage, reconciliations, and retained evidence.' }
];

const gcssNodes = [
  {
    id: 'gcss-unit-supply',
    layer: 'source',
    title: 'Unit Supply / SSA / Supply Section',
    subtitle: 'Demand, issue, turn-in, and receipt initiation',
    icon: 'SUP',
    tags: ['supply', 'unit', 'demand', 'receipt'],
    summary: 'Creates and updates supply demand, issue, turn-in, due-in, due-out, receipt, and stockage activity that may drive inventory, expense, reimbursable, or readiness impact.',
    examples: ['Supply request', 'Receipt', 'Issue', 'Turn-in', 'Due-in/due-out'],
    auditQuestions: ['Can every high-value issue trace to an authorized request?', 'Are receipts matched to source demand and shipment evidence?', 'Are aged due-ins and open requests reviewed?'],
    keyFields: ['document number', 'DoDAAC', 'UIC/RIC', 'NSN/material', 'quantity', 'condition code', 'priority', 'fund cite'],
    risks: ['Unsupported issue', 'Open requisition not reviewed', 'Receipt without financial/accountability follow-through']
  },
  {
    id: 'gcss-maintenance-shop',
    layer: 'source',
    title: 'Maintenance Shops / Motor Pool',
    subtitle: 'Work orders, faults, parts, labor, and equipment status',
    icon: 'MNT',
    tags: ['maintenance', 'work order', 'parts', 'readiness'],
    summary: 'Generates work orders, faults, parts demand, labor/status updates, and equipment condition data that support readiness reporting and parts-related financial lineage.',
    examples: ['Maintenance work order', 'Fault', 'Parts request', 'Equipment status update'],
    auditQuestions: ['Do parts consumed on work orders tie to supply issue records?', 'Is equipment status timely and supportable?', 'Are high-cost maintenance events reviewable?'],
    keyFields: ['work order', 'equipment ID', 'fault code', 'NSN/material', 'quantity', 'labor/status date', 'priority'],
    risks: ['Parts consumed without work-order support', 'Readiness status not tied to maintenance evidence', 'Manual correction hides root cause']
  },
  {
    id: 'gcss-property-accountability-source',
    layer: 'source',
    title: 'Property Book / Responsible Officer',
    subtitle: 'Asset assignment, custody, and hand-receipt evidence',
    icon: 'PBO',
    tags: ['property', 'asset', 'custody', 'hand receipt'],
    summary: 'Maintains property accountability, asset assignment, serial-number custody, gains, losses, transfers, and hand-receipt evidence for accountable equipment.',
    examples: ['Asset gain', 'Asset transfer', 'Hand receipt', 'Loss adjustment', 'Inventory count'],
    auditQuestions: ['Can accountable assets be traced to custody and location?', 'Are gains/losses approved and reflected in financial reporting where required?', 'Are inventories performed and exceptions resolved?'],
    keyFields: ['asset/equipment number', 'serial number', 'UIC', 'custodian', 'location', 'acquisition value', 'status'],
    risks: ['Missing custody evidence', 'Asset existence/completeness gap', 'Financial PP&E or inventory support mismatch']
  },
  {
    id: 'gcss-dla-daas-dlms',
    layer: 'source',
    title: 'DLA / DAAS / DLMS / FED LOG',
    subtitle: 'Catalog, requisition, shipping, and distribution partners',
    icon: 'DLA',
    tags: ['dlms', 'catalog', 'distribution', 'supply chain'],
    summary: 'Provides item catalog, requisition status, shipping, distribution, and logistics-transaction exchange patterns used by GCSS and downstream finance partners.',
    examples: ['DLMS requisition/status', 'FED LOG catalog data', 'Shipment status', 'Distribution event'],
    auditQuestions: ['Do interface control totals reconcile?', 'Are item master and unit price changes governed?', 'Are rejected logistics transactions researched?'],
    keyFields: ['document number', 'NSN', 'routing identifier', 'status code', 'quantity', 'unit price', 'shipment number'],
    risks: ['Rejected DLMS transaction', 'Catalog/price mismatch', 'Shipment not received or financially cleared']
  },
  {
    id: 'gcss-finance-partner',
    layer: 'source',
    title: 'Finance ERP Partner',
    subtitle: 'GFEBS, SABRS, Navy ERP, DFAS, Treasury',
    icon: 'FIN',
    tags: ['finance', 'erp', 'interface', 'accounting'],
    summary: 'Represents the financial-management system or shared-service partner that receives GCSS-supported logistics impacts for commitment, obligation, cost, AP, GL, or reporting treatment.',
    examples: ['GFEBS interface', 'SABRS/DoN finance handoff', 'DFAS support', 'Treasury/IPAC settlement'],
    auditQuestions: ['Do logistics events reconcile to finance postings?', 'Are rejects and suspense cleared?', 'Can statement samples trace back to GCSS source detail?'],
    keyFields: ['fund cite', 'TAS', 'USSGL', 'document number', 'interface batch', 'posting period', 'amount'],
    risks: ['Logistics-to-finance timing break', 'Manual finance correction without source support', 'Unreconciled interface suspense']
  },
  {
    id: 'gcss-supply-execution',
    layer: 'core',
    title: 'Supply Execution',
    subtitle: 'Request, source, issue, receipt, and return control',
    icon: 'REQ',
    tags: ['supply', 'request', 'receipt', 'issue'],
    summary: 'Controls the lifecycle from supply demand through sourcing, issue, receipt, turn-in, backorder, cancellation, and status updates.',
    examples: ['Request validation', 'Issue posting', 'Receipt posting', 'Turn-in processing'],
    auditQuestions: ['Are quantities and statuses complete at period end?', 'Do cancellations and substitutions retain evidence?', 'Are high-dollar demands tied to mission authority?'],
    keyFields: ['document number', 'line item', 'NSN/material', 'quantity', 'status', 'posting date', 'fund cite'],
    risks: ['Incomplete request lifecycle', 'Quantity/status mismatch', 'Unsupported cancellation or substitution']
  },
  {
    id: 'gcss-maintenance-management',
    layer: 'core',
    title: 'Maintenance Management',
    subtitle: 'Work order execution and equipment status',
    icon: 'WO',
    tags: ['maintenance', 'work order', 'equipment', 'readiness'],
    summary: 'Manages maintenance work orders, parts demand, task status, equipment availability, and readiness-related updates.',
    examples: ['Open work order', 'Parts reservation/request', 'Completion update', 'Deadline status'],
    auditQuestions: ['Are work-order closures supported?', 'Do parts and labor align to the work performed?', 'Are status changes timely?'],
    keyFields: ['work order', 'equipment ID', 'task/status', 'part number', 'quantity', 'completion date'],
    risks: ['Closed work order without evidence', 'Parts cost not tied to repair', 'Status not reliable for readiness']
  },
  {
    id: 'gcss-property-accountability',
    layer: 'core',
    title: 'Property Accountability',
    subtitle: 'Custody, serial-number, location, and inventory control',
    icon: 'AST',
    tags: ['property', 'asset', 'custody', 'inventory'],
    summary: 'Controls accountable property records, serial-number detail, custodian assignment, location, gains, losses, transfers, and inventories.',
    examples: ['Property record update', 'Hand receipt', 'Transfer', 'Inventory count adjustment'],
    auditQuestions: ['Are asset populations complete?', 'Can assets be physically verified?', 'Are adjustments approved and financially evaluated?'],
    keyFields: ['asset/equipment number', 'serial number', 'UIC', 'custodian', 'location', 'condition', 'value'],
    risks: ['Existence/completeness failure', 'Unauthorized adjustment', 'Lost financial valuation link']
  },
  {
    id: 'gcss-inventory-control',
    layer: 'core',
    title: 'Inventory Control',
    subtitle: 'Stockage, warehouse, condition, and valuation support',
    icon: 'INV',
    tags: ['inventory', 'warehouse', 'valuation', 'stockage'],
    summary: 'Maintains inventory balances, condition, location, receipt/issue history, adjustments, and valuation support needed for logistics and reporting.',
    examples: ['Inventory balance', 'Condition code change', 'Warehouse movement', 'Inventory adjustment'],
    auditQuestions: ['Do on-hand balances reconcile to counts and movements?', 'Are condition-code and valuation changes governed?', 'Are adjustments supported?'],
    keyFields: ['NSN/material', 'location', 'condition code', 'quantity', 'unit price', 'movement type', 'posting date'],
    risks: ['Inventory valuation error', 'Unsupported adjustment', 'Quantity mismatch between logistics and finance']
  },
  {
    id: 'gcss-readiness-status',
    layer: 'core',
    title: 'Readiness / Equipment Status',
    subtitle: 'Operational availability and mission support',
    icon: 'RDY',
    tags: ['readiness', 'equipment', 'status', 'mission'],
    summary: 'Uses supply, maintenance, and property data to support equipment status, mission capability, and readiness-related reporting.',
    examples: ['Equipment availability', 'Deadline status', 'Readiness exception', 'Status report extract'],
    auditQuestions: ['Can readiness status trace to current supply and maintenance records?', 'Are exceptions aged and owned?', 'Are status feeds complete?'],
    keyFields: ['equipment ID', 'UIC', 'status code', 'fault/work order', 'part demand', 'as-of date'],
    risks: ['Readiness overstatement', 'Untimely status update', 'Missing support for reported condition']
  },
  {
    id: 'gcss-material-master',
    layer: 'detail',
    title: 'Material / NSN Master',
    subtitle: 'Catalog identity and pricing attributes',
    icon: 'NSN',
    tags: ['material', 'nsn', 'catalog', 'master data'],
    summary: 'Stores or consumes material identity, NSN, description, unit of issue, price, condition, source of supply, and logistics attributes.',
    examples: ['NSN record', 'Unit of issue', 'Standard price', 'Source of supply'],
    auditQuestions: ['Are catalog changes authorized?', 'Do price updates reconcile to authoritative sources?', 'Are obsolete or duplicate items controlled?'],
    keyFields: ['NSN/material', 'unit of issue', 'price', 'source of supply', 'condition', 'effective date'],
    risks: ['Incorrect price drives valuation error', 'Duplicate catalog identity', 'Unauthorized master-data change']
  },
  {
    id: 'gcss-requisition-detail',
    layer: 'detail',
    title: 'Requisition / Supply Document Detail',
    subtitle: 'Line-level demand and status history',
    icon: 'DOC',
    tags: ['requisition', 'document', 'supply', 'uott'],
    summary: 'Preserves document-number and line-level supply demand, status, quantity, priority, funding, and fulfillment history.',
    examples: ['Requisition line', 'Status update', 'Cancellation', 'Backorder'],
    auditQuestions: ['Is the Universe of Transactions complete for sampled requisitions?', 'Are status changes retained?', 'Can open lines be aged and explained?'],
    keyFields: ['document number', 'suffix/line', 'status', 'priority', 'quantity', 'fund cite', 'date'],
    risks: ['Incomplete UoT extract', 'Open line unsupported', 'Funding/status disconnect']
  },
  {
    id: 'gcss-work-order-detail',
    layer: 'detail',
    title: 'Work Order / Fault / Parts Detail',
    subtitle: 'Maintenance transaction evidence',
    icon: 'WRK',
    tags: ['work order', 'fault', 'maintenance', 'parts'],
    summary: 'Captures the detailed maintenance object that ties a fault or repair event to requested parts, status, completion, and equipment readiness.',
    examples: ['Work order', 'Fault', 'Parts list', 'Completion status'],
    auditQuestions: ['Are part demands justified by work-order evidence?', 'Are work orders closed timely?', 'Do completion records match equipment status?'],
    keyFields: ['work order', 'fault code', 'equipment ID', 'NSN/material', 'quantity', 'completion date'],
    risks: ['Maintenance cost unsupported', 'Parts consumed outside repair context', 'Status/completion mismatch']
  },
  {
    id: 'gcss-asset-equipment-detail',
    layer: 'detail',
    title: 'Asset / Equipment Detail',
    subtitle: 'Serialized property and accountable equipment',
    icon: 'EQP',
    tags: ['asset', 'equipment', 'serial', 'custody'],
    summary: 'Maintains serialized equipment, accountable property, location, custodian, condition, acquisition support, and disposition data.',
    examples: ['Equipment record', 'Serial-number asset', 'Transfer', 'Disposition'],
    auditQuestions: ['Can sampled assets be located and tied to custody?', 'Are transfers and disposals approved?', 'Is financial value support retained where applicable?'],
    keyFields: ['equipment/asset number', 'serial number', 'UIC', 'location', 'custodian', 'acquisition value', 'disposition date'],
    risks: ['Asset not found', 'Disposal not reflected financially', 'Custody break']
  },
  {
    id: 'gcss-inventory-movement-detail',
    layer: 'detail',
    title: 'Inventory Movement Detail',
    subtitle: 'Receipt, issue, adjustment, transfer, and count history',
    icon: 'MOV',
    tags: ['inventory', 'movement', 'receipt', 'issue'],
    summary: 'Preserves the movement history needed to trace inventory balances, quantities, conditions, and valuation from transaction to report.',
    examples: ['Receipt movement', 'Issue movement', 'Transfer', 'Inventory adjustment', 'Count variance'],
    auditQuestions: ['Do movements support ending balances?', 'Are adjustments approved?', 'Can valuation impacts be recalculated from detail?'],
    keyFields: ['movement/document number', 'NSN/material', 'location', 'condition', 'quantity', 'unit price', 'posting date'],
    risks: ['Inventory balance not reconstructable', 'Unsupported adjustment', 'Valuation mismatch']
  },
  {
    id: 'gcss-commitment-obligation',
    layer: 'accounting',
    title: 'Commitment / Obligation Signal',
    subtitle: 'Funding impact and financial handoff',
    icon: 'OBL',
    tags: ['commitment', 'obligation', 'funds', 'interface'],
    summary: 'Represents the finance-facing impact of logistics demand when a requisition, purchase, or external support event requires funds control or obligation treatment.',
    examples: ['Funded requisition', 'Obligation interface', 'Commitment update', 'Reject/suspense correction'],
    auditQuestions: ['Does each funded logistics event tie to valid budget authority?', 'Are obligation changes supported by source detail?', 'Are rejects cleared before reporting?'],
    keyFields: ['fund cite', 'document number', 'TAS', 'USSGL', 'amount', 'posting period', 'interface batch'],
    risks: ['Invalid fund cite', 'Obligation not tied to logistics source', 'Unreconciled suspense']
  },
  {
    id: 'gcss-inventory-valuation',
    layer: 'accounting',
    title: 'Inventory / Asset Valuation',
    subtitle: 'Quantity, condition, and price to financial value',
    icon: 'VAL',
    tags: ['valuation', 'inventory', 'asset', 'financial reporting'],
    summary: 'Transforms supported quantity, condition, catalog, and acquisition-price detail into value used for inventory, operating material, supplies, or accountable property reporting.',
    examples: ['Inventory value', 'Condition valuation', 'Asset value support', 'Adjustment value'],
    auditQuestions: ['Can reported value be recalculated from source quantity and price?', 'Are condition changes reflected?', 'Are gains/losses supported?'],
    keyFields: ['NSN/material', 'quantity', 'unit price', 'condition', 'asset value', 'posting period'],
    risks: ['Overstated inventory', 'Unsupported asset value', 'Condition not considered in reporting']
  },
  {
    id: 'gcss-finance-interface',
    layer: 'accounting',
    title: 'Finance Interface / Reconciliation',
    subtitle: 'GCSS-to-ERP tie-out and suspense clearing',
    icon: 'REC',
    tags: ['interface', 'reconciliation', 'gl', 'audit'],
    summary: 'Controls extract, interface, reject, suspense, and reconciliation activity between GCSS logistics records and the official accounting/reporting system.',
    examples: ['Interface batch', 'Control totals', 'Reject report', 'Tie-out workbook'],
    auditQuestions: ['Do control totals reconcile by batch and period?', 'Are rejected records resolved?', 'Can finance postings trace to GCSS detail?'],
    keyFields: ['interface batch', 'source document', 'amount', 'count', 'reject reason', 'posted document', 'period'],
    risks: ['Silent interface failure', 'Manual journal without source link', 'Period cutoff mismatch']
  },
  {
    id: 'gcss-readiness-reporting',
    layer: 'reporting',
    title: 'Readiness / Logistics Reporting',
    subtitle: 'Operational reports and command visibility',
    icon: 'RPT',
    tags: ['reporting', 'readiness', 'logistics', 'command'],
    summary: 'Provides commanders and logisticians with supply, maintenance, equipment, open-requisition, deadline, inventory, and readiness views.',
    examples: ['Open requisition report', 'Equipment status report', 'Maintenance backlog', 'Inventory exception report'],
    auditQuestions: ['Are reports generated from controlled populations?', 'Do exceptions have owners?', 'Are as-of dates and filters documented?'],
    keyFields: ['report ID', 'as-of date', 'UIC', 'document number', 'equipment ID', 'status', 'quantity'],
    risks: ['Operational report not reconcilable', 'Outdated status', 'Unowned exception']
  },
  {
    id: 'gcss-erp-reporting',
    layer: 'reporting',
    title: 'ERP / DDRS / GTAS Support',
    subtitle: 'Financial reporting and Treasury path',
    icon: 'GTAS',
    tags: ['ddrs', 'gtas', 'treasury', 'financial reporting'],
    summary: 'Supports trial-balance, DDRS, GTAS, USSGL, Treasury, and statement reporting when GCSS activity drives financial values or assertions.',
    examples: ['Trial balance support', 'DDRS tie-out', 'GTAS crosswalk', 'Treasury reporting support'],
    auditQuestions: ['Do statement amounts tie to trial balance and source detail?', 'Are USSGL and TAS attributes complete?', 'Are crosswalks governed?'],
    keyFields: ['TAS', 'USSGL', 'period', 'amount', 'trading partner', 'statement line', 'source document'],
    risks: ['Reporting crosswalk error', 'Unsupported statement amount', 'Trading partner/TAS mismatch']
  },
  {
    id: 'gcss-audit-package',
    layer: 'reporting',
    title: 'Audit Package / Evidence Store',
    subtitle: 'Sampling support and retained source trail',
    icon: 'AUD',
    tags: ['audit', 'evidence', 'uott', 'reconciliation'],
    summary: 'Assembles source records, approvals, interface logs, reconciliations, reports, and screenshots/extracts needed to support audit samples.',
    examples: ['Sample support package', 'Interface log', 'Reconciliation', 'Approval evidence'],
    auditQuestions: ['Can evidence be retrieved for the sampled transaction?', 'Does support cover source, posting, and report?', 'Are extracts complete and immutable?'],
    keyFields: ['sample ID', 'source document', 'interface batch', 'posted document', 'report line', 'evidence link'],
    risks: ['Evidence unavailable', 'Extract not population-complete', 'Manual support cannot be reproduced']
  },
  {
    id: 'gcss-sbr-statement',
    layer: 'statements',
    title: 'Statement of Budgetary Resources',
    subtitle: 'Budgetary impact from logistics demand and execution',
    icon: 'SBR',
    tags: ['sbr', 'budgetary', 'obligation', 'outlay'],
    summary: 'Shows how logistics events that consume funds can support budgetary resources, obligations, expenditures, outlays, and related disclosures.',
    examples: ['Commitment/obligation support', 'Delivered order evidence', 'Outlay tie-out'],
    auditQuestions: ['Are budgetary impacts complete and supported?', 'Do open obligations tie to valid logistics need?', 'Are deobligations timely?'],
    keyFields: ['TAS', 'USSGL', 'fund cite', 'document number', 'obligation amount', 'outlay amount'],
    risks: ['Unsupported ULO', 'Misstated obligation', 'Outlay not tied to source']
  },
  {
    id: 'gcss-inventory-ppe-statement',
    layer: 'statements',
    title: 'Inventory / OM&S / PP&E Assertions',
    subtitle: 'Existence, completeness, rights, valuation, presentation',
    icon: 'INV',
    tags: ['inventory', 'ppe', 'oms', 'assertions'],
    summary: 'Supports financial-statement assertions for inventory, operating materials and supplies, and accountable equipment where GCSS records are part of the evidentiary trail.',
    examples: ['Inventory value', 'Asset existence', 'Condition support', 'Gain/loss support'],
    auditQuestions: ['Can quantities be physically verified?', 'Is valuation support complete?', 'Are ownership and custody clear?'],
    keyFields: ['NSN/material', 'asset/equipment number', 'quantity', 'condition', 'unit price', 'value', 'location'],
    risks: ['Existence/completeness error', 'Valuation unsupported', 'Condition or custody mismatch']
  },
  {
    id: 'gcss-net-cost-notes',
    layer: 'statements',
    title: 'Net Cost / Notes / Audit Schedules',
    subtitle: 'Expense, logistics cost, and disclosure support',
    icon: 'NCT',
    tags: ['net cost', 'expense', 'notes', 'audit'],
    summary: 'Connects maintenance, supply, inventory consumption, and finance postings to net cost, notes, schedules, and audit-support packages.',
    examples: ['Parts expense support', 'Maintenance cost support', 'Note schedule', 'Sample reconciliation'],
    auditQuestions: ['Can expense be traced to supported logistics events?', 'Are note schedules tied to controlled populations?', 'Are cutoffs and accruals complete?'],
    keyFields: ['cost object', 'document number', 'USSGL', 'period', 'amount', 'statement line', 'note schedule'],
    risks: ['Expense classification error', 'Unsupported note schedule', 'Period cutoff issue']
  }
];

const gcssLineageScenarios = [
  {
    id: 'gcss-requisition-to-finance',
    short: 'requisition',
    title: 'Supply Requisition to Finance Posting',
    description: 'Traces a funded supply request from unit demand through GCSS supply execution, document detail, finance interface, and SBR support.',
    path: ['gcss-unit-supply', 'gcss-supply-execution', 'gcss-requisition-detail', 'gcss-commitment-obligation', 'gcss-finance-interface', 'gcss-sbr-statement'],
    steps: [
      'A unit or supply activity creates a mission-supported demand with document number, item, quantity, priority, and funding data.',
      'GCSS controls request status, sourcing, issue, receipt, backorder, cancellation, or turn-in activity.',
      'The requisition detail preserves the transaction population and status history for audit sampling.',
      'Finance-facing signals are exchanged with the applicable accounting system and reconciled by batch, count, amount, and period.',
      'Budgetary reporting ties obligations, delivered orders, outlays, and ULO review back to source demand evidence.'
    ],
    exceptionTests: ['invalid fund cite', 'open requisition aged past policy', 'interface reject', 'finance posting without GCSS detail', 'manual journal missing source support']
  },
  {
    id: 'gcss-maintenance-parts',
    short: 'maintenance',
    title: 'Maintenance Work Order and Parts Consumption',
    description: 'Shows how maintenance faults and work orders create parts demand, readiness evidence, cost impact, and audit support.',
    path: ['gcss-maintenance-shop', 'gcss-maintenance-management', 'gcss-work-order-detail', 'gcss-inventory-movement-detail', 'gcss-finance-interface', 'gcss-net-cost-notes'],
    steps: [
      'A maintenance shop opens or updates a work order tied to equipment, fault, priority, and required parts.',
      'GCSS records parts demand, issue/receipt, equipment status, and work-order completion evidence.',
      'Inventory movement detail supports the parts quantity and value consumed or returned.',
      'Finance interface controls reconcile consumption, cost, or AP/GL impacts where applicable.',
      'Net cost and audit schedules retain the repair, parts, and posting trail.'
    ],
    exceptionTests: ['parts issued without work order', 'work order closed without support', 'inventory movement not valued', 'readiness status not updated', 'period cutoff mismatch']
  },
  {
    id: 'gcss-property-inventory',
    short: 'property',
    title: 'Property Accountability and Inventory Valuation',
    description: 'Connects serialized property, custody, inventory balances, condition, valuation, and statement assertions.',
    path: ['gcss-property-accountability-source', 'gcss-property-accountability', 'gcss-asset-equipment-detail', 'gcss-inventory-valuation', 'gcss-audit-package', 'gcss-inventory-ppe-statement'],
    steps: [
      'A property or inventory event records gain, transfer, loss, count, adjustment, or disposal activity.',
      'GCSS maintains serial-number, custody, location, condition, and accountable-property control.',
      'Asset and inventory detail provide the source population for existence, completeness, and valuation testing.',
      'Valuation uses supported quantity, condition, price, and acquisition data where financial reporting is affected.',
      'Audit packages connect source property records to statement assertions for inventory, OM&S, or PP&E.'
    ],
    exceptionTests: ['asset not located', 'custody not current', 'adjustment not approved', 'valuation cannot be recalculated', 'disposal not reflected financially']
  },
  {
    id: 'gcss-readiness-to-reporting',
    short: 'readiness',
    title: 'Readiness Status to Reporting and Evidence',
    description: 'Traces equipment status and logistics exceptions from operational records to reporting, reconciliation, and audit support.',
    path: ['gcss-maintenance-shop', 'gcss-readiness-status', 'gcss-readiness-reporting', 'gcss-erp-reporting', 'gcss-audit-package', 'gcss-net-cost-notes'],
    steps: [
      'Supply and maintenance events update equipment status, open parts demand, deadline condition, and readiness indicators.',
      'GCSS readiness/status views summarize operational availability and exception populations.',
      'Reports are generated with documented as-of dates, filters, and source populations.',
      'Where readiness activity has financial impact, ERP/DDRS/GTAS support is reconciled to controlled source detail.',
      'Audit evidence preserves the status report, source records, and finance/reporting tie-out.'
    ],
    exceptionTests: ['stale equipment status', 'open exception lacks owner', 'report filter not documented', 'financial impact not reconciled', 'source extract incomplete']
  }
];

const gcssSupportServices = [
  { title: 'Supply and Maintenance Controls', detail: 'Demand validation, document-number control, work-order support, issue/receipt status, cancellation rules, and aged open-transaction review.' },
  { title: 'Property and Inventory Governance', detail: 'Custody, serial-number control, location, condition, inventory count, adjustment approval, valuation support, and loss/disposal evidence.' },
  { title: 'Interface and Reconciliation', detail: 'DLMS/partner exchange, finance-interface batch controls, reject/suspense resolution, period cutoff, control totals, and source-to-posting tie-outs.' },
  { title: 'Readiness and Command Reporting', detail: 'Equipment status, open parts demand, maintenance backlog, mission-readiness exception reporting, as-of-date control, and report population ownership.' },
  { title: 'Financial Reporting Support', detail: 'USSGL/TAS mapping where applicable, SBR support, inventory/OM&S/PP&E assertions, net cost, DDRS/GTAS tie-outs, and audit schedules.' },
  { title: 'Master Data and Evidence', detail: 'NSN/material, DoDAAC/UIC/RIC, fund cite, unit price, condition code, equipment, custodian, document number, and retained sample-support packages.' }
];

const gcssArmyCaveats = [
  'GCSS-Army is modeled as the Army tactical logistics ERP/SAP-style environment because public descriptions commonly characterize it as the Army GCSS logistics ERP; exact SAP modules, custom tables, interfaces, and reports require Army program authority.',
  'This blueprint focuses on auditable logistics-to-finance business processes. It is not an official Army interface inventory, system security boundary, or configuration baseline.',
  'Feeder counts are modeled source and partner categories represented in this page, not a certified count of GCSS-Army production interfaces.'
];

const gcssMcCaveats = [
  'GCSS-MC public technical/platform detail is limited. This page does not label GCSS-MC as SAP or Oracle; it models the Marine Corps logistics-to-finance business process and marks platform specifics as requiring authoritative Marine Corps documentation.',
  'MARCORSYSCOM public information supports the Marine Corps acquisition and IT-program context, but exact GCSS-MC modules, interfaces, reports, and current modernization state require program authority.',
  'Feeder counts are modeled source and partner categories represented in this page, not a certified count of GCSS-MC production interfaces.'
];

const gcssSources = [
  { name: 'Marine Corps Systems Command', url: 'https://www.marcorsyscom.marines.mil/' },
  { name: 'DoD Financial Management Regulation', url: 'https://comptroller.defense.gov/FMR/' },
  { name: 'Treasury GTAS', url: 'https://fiscal.treasury.gov/accounting/government-wide-treasury-account-symbol-gtas' },
  { name: 'Treasury USSGL', url: 'https://fiscal.treasury.gov/accounting/us-standard-general-ledger-ussgl' },
  { name: 'Treasury G-Invoicing / IPAC', url: 'https://fiscal.treasury.gov/accounting/intragov' }
];

const lmpLayers = [
  { id: 'source', label: 'Source / Sustainment / Partner Events', short: 'Source', description: 'AMC, depot, DLA, vendor, GCSS-Army, distribution, and finance partner events that feed national logistics and working-capital operations.' },
  { id: 'core', label: 'LMP Core Logistics and ERP Capabilities', short: 'LMP', description: 'SAP-based national logistics capabilities for wholesale supply, depot maintenance, procurement, inventory, financials, and Army Working Capital Fund support.' },
  { id: 'detail', label: 'Detailed Logistics and Financial Objects', short: 'Detail', description: 'Material, order, work-order, PO, invoice, inventory movement, and customer-billing detail that supports UoT reconstruction.' },
  { id: 'accounting', label: 'Accounting, Costing, and Finance Interfaces', short: 'Finance', description: 'AWCF costing, AP, AR, GL, inventory valuation, GFEBS interface, reconciliation, and financial control activity.' },
  { id: 'reporting', label: 'Operational and Financial Reporting', short: 'Reporting', description: 'Depot, supply, inventory, trial balance, DDRS, GTAS, customer billing, and audit-support reporting.' },
  { id: 'statements', label: 'Army / DoD Financial Statements', short: 'Statements', description: 'SBR, inventory and OM&S, net cost, working-capital, and disclosure assertions supported by LMP lineage.' }
];

const lmpNodes = [
  {
    id: 'lmp-amc-depot-source',
    layer: 'source',
    title: 'AMC / Depot / Arsenal Events',
    subtitle: 'National maintenance and sustainment demand',
    icon: 'AMC',
    tags: ['amc', 'depot', 'maintenance', 'sustainment'],
    summary: 'Originates depot maintenance, overhaul, repair, recapitalization, production, and sustainment events that require work-order, parts, labor, cost, and billing traceability.',
    examples: ['Depot repair induction', 'Overhaul order', 'Production support', 'Parts demand'],
    auditQuestions: ['Does each depot order have mission/customer authority?', 'Are parts and labor tied to the repair event?', 'Are costs accumulated against the right program or customer?'],
    keyFields: ['work order', 'customer order', 'UIC/DoDAAC', 'equipment/serial', 'NSN/material', 'fund cite', 'cost object'],
    risks: ['Depot cost not tied to source order', 'Unsupported customer billing', 'Repair status not aligned with financial recognition']
  },
  {
    id: 'lmp-dla-dlms-source',
    layer: 'source',
    title: 'DLA / DAAS / DLMS / Catalog Sources',
    subtitle: 'Item, requisition, shipment, and supply-chain exchange',
    icon: 'DLA',
    tags: ['dla', 'dlms', 'catalog', 'shipment'],
    summary: 'Provides national item, requisition, catalog, shipment, status, and distribution exchange data used by LMP wholesale supply and inventory processes.',
    examples: ['DLMS requisition/status', 'FED LOG item data', 'Shipment status', 'Distribution event'],
    auditQuestions: ['Do interface counts and amounts reconcile?', 'Are item-price and catalog changes controlled?', 'Are rejected logistics transactions resolved?'],
    keyFields: ['document number', 'NSN/material', 'routing identifier', 'status code', 'quantity', 'unit price', 'shipment number'],
    risks: ['Rejected DLMS transaction', 'Catalog/price mismatch', 'Shipment not reflected in inventory or billing']
  },
  {
    id: 'lmp-vendor-contract-source',
    layer: 'source',
    title: 'Vendors / Contracting / PIEE-WAWF',
    subtitle: 'Procurement, receipt, invoice, acceptance',
    icon: 'P2P',
    tags: ['procurement', 'vendor', 'invoice', 'receipt'],
    summary: 'Feeds contract award, purchase order, receipt, acceptance, invoice, and payment-support evidence for LMP procurement and repair-material acquisition.',
    examples: ['Purchase order', 'Vendor shipment', 'Receiving report', 'Invoice', 'Acceptance'],
    auditQuestions: ['Does every invoice tie to PO, receipt, and acceptance?', 'Are price, quantity, and vendor identifiers consistent?', 'Are unmatched receipts and invoices aged?'],
    keyFields: ['PIID', 'CLIN', 'PO number', 'invoice number', 'vendor UEI/CAGE', 'receipt number', 'amount'],
    risks: ['Improper payment', 'Unmatched receipt/invoice', 'Procurement obligation not tied to source need']
  },
  {
    id: 'lmp-gcss-army-demand',
    layer: 'source',
    title: 'GCSS-Army / Tactical Demand Signal',
    subtitle: 'Field demand and sustainment pull',
    icon: 'GCSS',
    tags: ['gcss-army', 'demand', 'tactical', 'sustainment'],
    summary: 'Represents tactical demand, unit readiness needs, supply requests, and sustainment signals that may drive national inventory, procurement, and depot activity in LMP.',
    examples: ['Field requisition', 'Readiness-driven demand', 'Backorder signal', 'Repair-part demand'],
    auditQuestions: ['Can wholesale demand trace to field or program need?', 'Are backorders and substitutions governed?', 'Are demand and fulfillment statuses reconciled?'],
    keyFields: ['document number', 'DoDAAC', 'UIC', 'NSN/material', 'quantity', 'priority', 'status'],
    risks: ['Demand not supported by mission need', 'Backorder aging not managed', 'Demand/fulfillment mismatch']
  },
  {
    id: 'lmp-gfebs-finance-source',
    layer: 'source',
    title: 'GFEBS / DFAS / Treasury Partners',
    subtitle: 'General fund, payment, and reporting linkage',
    icon: 'FIN',
    tags: ['gfebs', 'dfas', 'treasury', 'finance'],
    summary: 'Represents financial partners that receive or reconcile LMP-supported obligation, billing, inventory, cost, GL, disbursing, and Treasury-reporting data.',
    examples: ['GFEBS tie-out', 'DFAS payment support', 'Treasury reporting', 'IPAC settlement'],
    auditQuestions: ['Do finance postings reconcile to LMP source detail?', 'Are rejects and suspense items cleared?', 'Can statement samples trace back to LMP transactions?'],
    keyFields: ['TAS', 'USSGL', 'fund cite', 'document number', 'interface batch', 'posting period', 'amount'],
    risks: ['Unreconciled finance interface', 'Manual journal without source support', 'Treasury/reporting mismatch']
  },
  {
    id: 'lmp-wholesale-supply',
    layer: 'core',
    title: 'Wholesale Supply Management',
    subtitle: 'Demand, sourcing, order fulfillment, backorder control',
    icon: 'SUP',
    tags: ['wholesale', 'supply', 'demand', 'fulfillment'],
    summary: 'Controls national-level demand, sourcing, stock availability, issue, receipt, backorder, distribution, and customer fulfillment support.',
    examples: ['Demand plan', 'Customer order', 'Supply issue', 'Backorder review'],
    auditQuestions: ['Are open orders complete and aged?', 'Do fulfillment events tie to inventory movements?', 'Are substitutions and cancellations authorized?'],
    keyFields: ['customer order', 'sales/order document', 'NSN/material', 'quantity', 'status', 'priority', 'date'],
    risks: ['Incomplete customer order population', 'Fulfillment not reflected in inventory', 'Backorder not reviewed']
  },
  {
    id: 'lmp-depot-maintenance',
    layer: 'core',
    title: 'Depot Maintenance / MRO',
    subtitle: 'Repair program execution and cost collection',
    icon: 'MRO',
    tags: ['depot', 'maintenance', 'mro', 'cost'],
    summary: 'Manages repair and overhaul work orders, parts, labor, routing, status, completion, and cost collection for depot-level maintenance.',
    examples: ['Repair work order', 'Parts issue', 'Labor confirmation', 'Completion/closeout'],
    auditQuestions: ['Are costs assigned to the right work order?', 'Do parts and labor support completion?', 'Are open work orders reviewed for WIP and cutoff?'],
    keyFields: ['work order', 'routing/task', 'material', 'labor hours', 'cost object', 'completion date', 'status'],
    risks: ['Incorrect WIP/cost recognition', 'Parts not tied to repair order', 'Closed order lacks support']
  },
  {
    id: 'lmp-procurement',
    layer: 'core',
    title: 'Procurement and Vendor Support',
    subtitle: 'Buy, receive, accept, invoice, pay evidence',
    icon: 'BUY',
    tags: ['procurement', 'vendor', 'purchase order', 'ap'],
    summary: 'Supports purchase requisition/order, sourcing, receipt, acceptance, invoice matching, vendor master, and payment-support data for logistics procurement.',
    examples: ['Purchase requisition', 'Purchase order', 'Goods receipt', 'Invoice match'],
    auditQuestions: ['Is procurement tied to valid demand or stock objective?', 'Do PO, receipt, invoice, and payment agree?', 'Are vendor and banking changes controlled?'],
    keyFields: ['PR/PO number', 'PIID', 'CLIN', 'vendor', 'receipt', 'invoice', 'amount'],
    risks: ['Unmatched invoice', 'Invalid vendor/payment data', 'Procurement not tied to need']
  },
  {
    id: 'lmp-inventory-management',
    layer: 'core',
    title: 'Inventory and Material Management',
    subtitle: 'Stock, condition, location, price, valuation support',
    icon: 'INV',
    tags: ['inventory', 'material', 'valuation', 'stock'],
    summary: 'Maintains stock balances, item master data, movement history, condition, location, unit price, valuation, and adjustment support.',
    examples: ['Inventory balance', 'Goods movement', 'Condition change', 'Count adjustment'],
    auditQuestions: ['Do balances reconcile to movement history and counts?', 'Are condition and price changes authorized?', 'Can inventory value be recalculated?'],
    keyFields: ['NSN/material', 'plant/storage location', 'condition', 'quantity', 'unit price', 'movement type', 'posting date'],
    risks: ['Inventory valuation error', 'Unsupported adjustment', 'Quantity/location mismatch']
  },
  {
    id: 'lmp-awcf-financials',
    layer: 'core',
    title: 'AWCF Financials',
    subtitle: 'Working-capital accounting and cost recovery',
    icon: 'WCF',
    tags: ['awcf', 'working capital', 'finance', 'billing'],
    summary: 'Supports Army Working Capital Fund cost accumulation, inventory valuation, customer billing, reimbursable activity, AP, AR, GL, and financial close activity.',
    examples: ['Customer billing', 'Cost recovery', 'AP posting', 'AR posting', 'GL close'],
    auditQuestions: ['Are rates and billings supported?', 'Do AP/AR subsidiary balances reconcile to GL?', 'Are WCF costs assigned to the correct business area/customer?'],
    keyFields: ['customer order', 'cost object', 'billing document', 'USSGL', 'TAS', 'amount', 'period'],
    risks: ['Improper cost recovery', 'Unreconciled AP/AR', 'Misclassified WCF activity']
  },
  {
    id: 'lmp-material-master',
    layer: 'detail',
    title: 'Material / NSN Master',
    subtitle: 'Item identity, unit, price, source, planning attributes',
    icon: 'NSN',
    tags: ['material', 'nsn', 'master data', 'price'],
    summary: 'Preserves item master data required for procurement, supply, inventory, valuation, planning, issue, repair, and reporting.',
    examples: ['NSN record', 'Material record', 'Unit of issue', 'Standard price', 'Source of supply'],
    auditQuestions: ['Are price and planning changes approved?', 'Do item attributes agree to authoritative catalog sources?', 'Are duplicate or obsolete materials controlled?'],
    keyFields: ['NSN/material', 'description', 'unit of issue', 'standard price', 'source', 'planning code', 'effective date'],
    risks: ['Incorrect price drives valuation error', 'Duplicate material identity', 'Unauthorized master-data change']
  },
  {
    id: 'lmp-customer-order-detail',
    layer: 'detail',
    title: 'Customer Order / Demand Detail',
    subtitle: 'Line-level demand, fulfillment, and billing basis',
    icon: 'ORD',
    tags: ['customer order', 'demand', 'billing', 'uott'],
    summary: 'Maintains customer demand, order line, quantity, status, fulfillment, funding, and billing-support detail for national supply activity.',
    examples: ['Customer order line', 'Backorder', 'Fulfillment status', 'Billing reference'],
    auditQuestions: ['Is the order population complete?', 'Can billing trace to fulfilled demand?', 'Are open and cancelled lines explained?'],
    keyFields: ['customer order', 'line item', 'customer DoDAAC', 'NSN/material', 'quantity', 'status', 'amount'],
    risks: ['Unsupported billing', 'Open order not reviewed', 'Demand and fulfillment status mismatch']
  },
  {
    id: 'lmp-work-order-detail',
    layer: 'detail',
    title: 'Depot Work Order Detail',
    subtitle: 'Repair object, parts, labor, WIP, completion',
    icon: 'WO',
    tags: ['work order', 'depot', 'wip', 'repair'],
    summary: 'Captures repair work order structure, operations, parts, labor, WIP, completion status, and closeout evidence.',
    examples: ['Repair order', 'Operation/routing', 'Parts issue', 'Labor confirmation', 'Closeout'],
    auditQuestions: ['Do labor and parts support the work performed?', 'Is WIP complete and valued?', 'Are closures and cancellations approved?'],
    keyFields: ['work order', 'operation', 'equipment/serial', 'parts', 'labor hours', 'WIP value', 'status'],
    risks: ['WIP misstatement', 'Cost not tied to repair', 'Unsupported work-order close']
  },
  {
    id: 'lmp-po-invoice-detail',
    layer: 'detail',
    title: 'PO / Receipt / Invoice Detail',
    subtitle: 'Procure-to-pay transaction trail',
    icon: 'P2P',
    tags: ['po', 'receipt', 'invoice', 'ap'],
    summary: 'Preserves purchase order, receipt, acceptance, invoice, vendor, and payment-support data needed for three-way matching and AP auditability.',
    examples: ['PO line', 'Goods receipt', 'Acceptance', 'Invoice', 'Payment reference'],
    auditQuestions: ['Do PO, receipt, invoice, and payment agree?', 'Are unmatched transactions resolved?', 'Are obligations and accruals complete at cutoff?'],
    keyFields: ['PO number', 'PIID', 'CLIN', 'receipt', 'invoice', 'vendor', 'amount', 'date'],
    risks: ['Duplicate or improper payment', 'Unrecorded accrual', 'Receipt/invoice mismatch']
  },
  {
    id: 'lmp-inventory-movement-detail',
    layer: 'detail',
    title: 'Inventory Movement Detail',
    subtitle: 'Receipt, issue, adjustment, transfer, count',
    icon: 'MOV',
    tags: ['inventory', 'movement', 'valuation', 'count'],
    summary: 'Retains detailed movement history that supports inventory balances, location, condition, unit price, issue, receipt, transfer, and adjustment values.',
    examples: ['Goods receipt', 'Issue', 'Transfer', 'Adjustment', 'Physical count variance'],
    auditQuestions: ['Can ending balance be reconstructed?', 'Are adjustments approved?', 'Do movements reconcile to GL inventory value?'],
    keyFields: ['movement document', 'NSN/material', 'plant/location', 'condition', 'quantity', 'unit price', 'posting date'],
    risks: ['Inventory balance not reconstructable', 'Unsupported adjustment', 'GL/subledger mismatch']
  },
  {
    id: 'lmp-awcf-costing',
    layer: 'accounting',
    title: 'AWCF Costing and Rates',
    subtitle: 'Cost accumulation, pricing, recovery, and billing logic',
    icon: 'CST',
    tags: ['awcf', 'costing', 'rates', 'billing'],
    summary: 'Connects material, depot labor, overhead, procurement, and customer order activity to working-capital cost recovery and rate/billing support.',
    examples: ['Depot cost accumulation', 'Sales price/rate', 'Customer billing', 'Cost recovery analysis'],
    auditQuestions: ['Are rates supported and approved?', 'Are costs assigned to correct customers/programs?', 'Do billings reconcile to order and cost detail?'],
    keyFields: ['cost object', 'rate', 'billing document', 'customer order', 'cost element', 'amount', 'period'],
    risks: ['Rate support weakness', 'Improper customer billing', 'Cost misallocation']
  },
  {
    id: 'lmp-inventory-valuation',
    layer: 'accounting',
    title: 'Inventory Valuation',
    subtitle: 'Quantity, condition, price, and GL support',
    icon: 'VAL',
    tags: ['inventory', 'valuation', 'gl', 'oms'],
    summary: 'Converts controlled inventory quantities, condition, and price into financial inventory or OM&S values for GL, reporting, and statement support.',
    examples: ['Inventory value', 'Condition valuation', 'Standard price update', 'Adjustment value'],
    auditQuestions: ['Can valuation be recalculated from detail?', 'Are condition and price changes governed?', 'Do inventory subledger and GL reconcile?'],
    keyFields: ['NSN/material', 'quantity', 'unit price', 'condition', 'plant/location', 'USSGL', 'amount'],
    risks: ['Over/understated inventory', 'Unapproved price change', 'Subledger-to-GL break']
  },
  {
    id: 'lmp-ap-ar-gl',
    layer: 'accounting',
    title: 'AP / AR / GL Posting',
    subtitle: 'Vendor pay, customer billing, journal, and close',
    icon: 'GL',
    tags: ['ap', 'ar', 'gl', 'close'],
    summary: 'Records vendor liabilities, customer receivables, billing, collections, inventory/cost postings, adjustments, and period-end GL close activity.',
    examples: ['AP invoice', 'Customer receivable', 'Billing posting', 'GL journal', 'Close adjustment'],
    auditQuestions: ['Do AP and AR reconcile to subsidiary detail?', 'Are journals supported and approved?', 'Is period cutoff complete?'],
    keyFields: ['accounting document', 'vendor/customer', 'USSGL', 'TAS', 'amount', 'posting date', 'period'],
    risks: ['Unsupported journal', 'AP/AR reconciliation failure', 'Cutoff error']
  },
  {
    id: 'lmp-gfebs-interface',
    layer: 'accounting',
    title: 'GFEBS / Reporting Interface Reconciliation',
    subtitle: 'Army finance tie-out and exception control',
    icon: 'REC',
    tags: ['gfebs', 'interface', 'reconciliation', 'reporting'],
    summary: 'Controls LMP-to-GFEBS/reporting handoffs, trial-balance support, interface batches, reject/suspense clearing, and statement-line traceability.',
    examples: ['Interface batch', 'Reject report', 'Trial balance tie-out', 'Statement sample package'],
    auditQuestions: ['Do batch counts and amounts reconcile?', 'Are rejected records cleared?', 'Can reporting amounts trace to LMP source detail?'],
    keyFields: ['interface batch', 'source document', 'posted document', 'USSGL', 'TAS', 'amount', 'period'],
    risks: ['Unreconciled interface', 'Manual correction breaks source lineage', 'Statement amount lacks LMP support']
  },
  {
    id: 'lmp-operational-reporting',
    layer: 'reporting',
    title: 'Operational Logistics Reporting',
    subtitle: 'Depot, wholesale supply, backlog, inventory, readiness support',
    icon: 'RPT',
    tags: ['reporting', 'depot', 'supply', 'inventory'],
    summary: 'Provides national sustainment visibility into demand, backorders, depot workload, work-order status, inventory, procurement, and customer fulfillment.',
    examples: ['Backorder report', 'Depot workload report', 'Inventory exception report', 'Customer order status'],
    auditQuestions: ['Are reports generated from controlled populations?', 'Are filters/as-of dates documented?', 'Do exceptions have owners?'],
    keyFields: ['report ID', 'as-of date', 'customer order', 'work order', 'NSN/material', 'status', 'quantity'],
    risks: ['Report not reconcilable', 'Stale operational status', 'Unowned exception population']
  },
  {
    id: 'lmp-financial-reporting',
    layer: 'reporting',
    title: 'Financial Reporting / DDRS / GTAS Support',
    subtitle: 'Trial balance, Treasury, statements, and audit schedules',
    icon: 'GTAS',
    tags: ['ddrs', 'gtas', 'treasury', 'trial balance'],
    summary: 'Supports trial balance, DDRS, GTAS, USSGL/TAS crosswalks, Treasury reporting, statement line items, and audit-sample packages.',
    examples: ['Trial balance extract', 'DDRS tie-out', 'GTAS submission support', 'Audit schedule'],
    auditQuestions: ['Do reporting amounts reconcile to GL and source detail?', 'Are USSGL/TAS attributes complete?', 'Are crosswalks governed?'],
    keyFields: ['TAS', 'USSGL', 'period', 'amount', 'statement line', 'trading partner', 'source document'],
    risks: ['Crosswalk error', 'Unsupported reporting amount', 'TAS/USSGL mismatch']
  },
  {
    id: 'lmp-audit-evidence',
    layer: 'reporting',
    title: 'Audit Evidence and Reconciliation Package',
    subtitle: 'UoT, sample support, interface logs, tie-outs',
    icon: 'AUD',
    tags: ['audit', 'evidence', 'uott', 'reconciliation'],
    summary: 'Assembles transaction populations, approvals, source records, interface logs, reconciliations, and reporting tie-outs for audit and management review.',
    examples: ['UoT extract', 'Sample package', 'Interface log', 'Reconciliation workbook'],
    auditQuestions: ['Is the transaction population complete?', 'Can sampled amounts trace to source and report?', 'Are extracts reproducible and retained?'],
    keyFields: ['sample ID', 'source document', 'accounting document', 'interface batch', 'report line', 'evidence link'],
    risks: ['Incomplete UoT', 'Evidence not retained', 'Manual support cannot be reproduced']
  },
  {
    id: 'lmp-sbr',
    layer: 'statements',
    title: 'Statement of Budgetary Resources',
    subtitle: 'Budgetary resources, obligations, expenditures, outlays',
    icon: 'SBR',
    tags: ['sbr', 'budgetary', 'obligation', 'outlay'],
    summary: 'Supports budgetary statement assertions for logistics procurement, customer orders, depot support, obligations, delivered orders, outlays, and ULO review.',
    examples: ['Obligation support', 'Delivered order support', 'ULO review', 'Outlay tie-out'],
    auditQuestions: ['Are obligations valid and supported?', 'Do delivered orders tie to receipt/performance?', 'Are aged ULOs reviewed?'],
    keyFields: ['TAS', 'USSGL', 'fund cite', 'document number', 'obligation amount', 'outlay amount'],
    risks: ['Unsupported ULO', 'Misstated obligation', 'Outlay not tied to source']
  },
  {
    id: 'lmp-inventory-oms',
    layer: 'statements',
    title: 'Inventory / OM&S Assertions',
    subtitle: 'Existence, completeness, valuation, rights, presentation',
    icon: 'INV',
    tags: ['inventory', 'oms', 'valuation', 'assertions'],
    summary: 'Supports inventory and operating materials/supplies assertions using LMP material, quantity, condition, location, price, movement, and GL reconciliation evidence.',
    examples: ['Inventory balance', 'OM&S value', 'Condition support', 'Count evidence'],
    auditQuestions: ['Can inventory be physically verified?', 'Is valuation support complete?', 'Do subledger and GL agree?'],
    keyFields: ['NSN/material', 'location', 'condition', 'quantity', 'unit price', 'value', 'USSGL'],
    risks: ['Existence/completeness failure', 'Valuation unsupported', 'Presentation/classification error']
  },
  {
    id: 'lmp-net-cost',
    layer: 'statements',
    title: 'Net Cost / Working Capital Disclosures',
    subtitle: 'Depot cost, supply cost, billing, expense, notes',
    icon: 'NCT',
    tags: ['net cost', 'working capital', 'expense', 'notes'],
    summary: 'Connects depot, procurement, inventory consumption, customer billing, cost recovery, and financial postings to net cost and disclosure schedules.',
    examples: ['Depot cost schedule', 'Customer billing support', 'Expense support', 'Note schedule'],
    auditQuestions: ['Can reported cost trace to work order, inventory, or procurement detail?', 'Are billing and revenue supported?', 'Are disclosures tied to controlled populations?'],
    keyFields: ['cost object', 'customer order', 'billing document', 'USSGL', 'period', 'amount', 'statement line'],
    risks: ['Cost misclassification', 'Revenue/billing support weakness', 'Unsupported note schedule']
  }
];

const lmpLineageScenarios = [
  {
    id: 'lmp-depot-repair-cost',
    short: 'depot repair',
    title: 'Depot Repair Order to Cost and Net Cost Reporting',
    description: 'Traces a depot repair event from AMC/customer demand through LMP work order, labor/parts cost, AWCF costing, GL, and net cost support.',
    path: ['lmp-amc-depot-source', 'lmp-depot-maintenance', 'lmp-work-order-detail', 'lmp-awcf-costing', 'lmp-ap-ar-gl', 'lmp-net-cost'],
    steps: [
      'AMC, depot, arsenal, or customer demand initiates a repair or overhaul order with equipment, scope, funding, and customer identifiers.',
      'LMP manages depot maintenance execution, parts, labor, status, WIP, completion, and closeout.',
      'Work-order detail preserves the transaction evidence needed to support cost accumulation and cutoff.',
      'AWCF costing assigns labor, material, overhead, and billing logic to the correct customer or program.',
      'GL/net cost reporting ties the depot repair activity to financial statements and audit schedules.'
    ],
    exceptionTests: ['work order lacks customer authority', 'parts/labor not tied to repair', 'WIP not reviewed', 'billing not supported by completion', 'journal lacks work-order detail']
  },
  {
    id: 'lmp-wholesale-demand',
    short: 'wholesale',
    title: 'Wholesale Supply Demand to Inventory and SBR',
    description: 'Connects tactical or national demand to wholesale supply fulfillment, inventory movement, valuation, and budgetary reporting.',
    path: ['lmp-gcss-army-demand', 'lmp-wholesale-supply', 'lmp-customer-order-detail', 'lmp-inventory-movement-detail', 'lmp-inventory-valuation', 'lmp-sbr'],
    steps: [
      'A field, customer, or program demand signal requests material with document, item, priority, customer, and funding attributes.',
      'LMP controls sourcing, fulfillment, backorder, cancellation, issue, receipt, and order status.',
      'Customer order and inventory movement detail preserve the Universe of Transactions.',
      'Inventory valuation connects quantities, condition, and price to financial impact.',
      'Budgetary reporting supports obligations, delivered orders, outlays, ULO review, and statement assertions where applicable.'
    ],
    exceptionTests: ['open demand aged past policy', 'backorder not reviewed', 'inventory movement not valued', 'subledger-to-GL break', 'SBR amount lacks source support']
  },
  {
    id: 'lmp-procure-to-pay',
    short: 'procure to pay',
    title: 'Procurement Need to Receipt, Invoice, Payment, and GL',
    description: 'Shows how repair-material or sustainment procurement moves through PO, receipt, acceptance, invoice, AP, GL, and reporting controls.',
    path: ['lmp-vendor-contract-source', 'lmp-procurement', 'lmp-po-invoice-detail', 'lmp-ap-ar-gl', 'lmp-gfebs-interface', 'lmp-financial-reporting'],
    steps: [
      'A valid logistics or depot need drives procurement action with vendor, contract, item, quantity, price, and funding information.',
      'LMP records or consumes purchase order, receipt, acceptance, invoice, and payment-support data.',
      'PO/invoice detail supports three-way matching and AP/accrual completeness.',
      'AP/GL postings are reconciled to procurement, receipt, and invoice evidence.',
      'Financial reporting ties trial balance, DDRS/GTAS, and audit schedules back to source procurement records.'
    ],
    exceptionTests: ['invoice without receipt/acceptance', 'PO not tied to demand', 'duplicate payment', 'unrecorded accrual', 'interface reject not cleared']
  },
  {
    id: 'lmp-inventory-audit',
    short: 'inventory',
    title: 'Inventory Balance to OM&S Assertion and Audit Evidence',
    description: 'Traces LMP inventory balances from material master and movement detail through valuation, GL reconciliation, reporting, and OM&S assertion support.',
    path: ['lmp-dla-dlms-source', 'lmp-inventory-management', 'lmp-material-master', 'lmp-inventory-movement-detail', 'lmp-inventory-valuation', 'lmp-inventory-oms'],
    steps: [
      'Catalog, receipt, issue, transfer, condition, and count events update controlled inventory records.',
      'LMP maintains item master, location, condition, quantity, and movement history.',
      'Material and movement details support population completeness and balance reconstruction.',
      'Inventory valuation converts supported quantities and prices into GL/reporting values.',
      'OM&S/inventory assertions are supported by physical count, valuation, movement, and reconciliation evidence.'
    ],
    exceptionTests: ['unapproved price change', 'count variance unresolved', 'condition not reflected in value', 'movement history incomplete', 'GL/subledger mismatch']
  }
];

const lmpSupportServices = [
  { title: 'Depot and MRO Governance', detail: 'Work-order authority, routing, parts, labor, WIP, completion, closeout, customer billing, and repair-program cost evidence.' },
  { title: 'Wholesale Supply Controls', detail: 'Demand validation, order status, backorder aging, sourcing, fulfillment, cancellation, substitution, receipt, issue, and customer-order traceability.' },
  { title: 'Procure-to-Pay Controls', detail: 'PR/PO, PIID, CLIN, vendor, receipt, acceptance, invoice, AP, accrual, payment, and unmatched-transaction review.' },
  { title: 'Inventory and Master Data Governance', detail: 'Material/NSN, unit of issue, price, source of supply, location, condition, movement type, count, adjustment, and valuation control.' },
  { title: 'AWCF and Financial Reporting', detail: 'Working-capital cost recovery, rates, AP/AR/GL, billing, inventory valuation, GFEBS/reporting tie-outs, DDRS/GTAS, and statement schedules.' },
  { title: 'Audit and Reconciliation Evidence', detail: 'Universe of Transactions extracts, interface logs, batch controls, reject/suspense clearing, trial-balance tie-outs, and sample-support packages.' }
];

const lmpCaveats = [
  'LMP is modeled as the Army SAP-based national logistics ERP and Army Working Capital Fund logistics backbone. Exact modules, tables, custom reports, interfaces, and deployment details require authoritative Army/LMP program documentation.',
  'This blueprint distinguishes LMP from GCSS-Army: LMP is modeled around national/wholesale logistics, depot maintenance, procurement, AWCF, and inventory finance, while GCSS-Army is modeled around tactical/unit logistics.',
  'Feeder counts are modeled source and partner categories represented in this page, not a certified count of production interfaces.'
];

const lmpSources = [
  { name: 'U.S. Army PEO EIS LMP program page', url: 'https://www.eis.army.mil/programs/lmp' },
  { name: 'Army Materiel Command', url: 'https://www.amc.army.mil/' },
  { name: 'Procurement Integrated Enterprise Environment', url: 'https://piee.eb.mil/' },
  { name: 'DoD Financial Management Regulation', url: 'https://comptroller.defense.gov/FMR/' },
  { name: 'Treasury GTAS', url: 'https://fiscal.treasury.gov/accounting/government-wide-treasury-account-symbol-gtas' },
  { name: 'Treasury USSGL', url: 'https://fiscal.treasury.gov/accounting/us-standard-general-ledger-ussgl' },
  { name: 'Treasury G-Invoicing / IPAC', url: 'https://fiscal.treasury.gov/accounting/intragov' }
];

const starsLayers = [
  { id: 'source', label: 'Legacy Source / Interface Events', short: 'Source', description: 'Field activity, vendor pay, travel, payroll, disbursing, collections, Navy ERP transition, and reporting partner events tied to legacy STARS accounting.' },
  { id: 'base', label: 'STARS Family Processing', short: 'STARS', description: 'Legacy Navy Standard Accounting and Reporting System processing for field-level accounting, central consolidation, suspense, edits, and close support.' },
  { id: 'detail', label: 'Legacy Transaction Detail', short: 'Detail', description: 'Document, obligation, expenditure, JV, suspense, archive, and migration detail needed to reconstruct the legacy Universe of Transactions.' },
  { id: 'accounting', label: 'Accounting and Control Layer', short: 'Accounting', description: 'Budgetary, proprietary, JV, suspense, trial-balance, and Navy ERP transition controls.' },
  { id: 'reporting', label: 'Reporting and Reconciliation', short: 'Reporting', description: 'Legacy reports, trial balances, DDRS/GTAS support, crosswalks, tie-outs, archive extracts, and audit packages.' },
  { id: 'statements', label: 'DON / DoD Statement Support', short: 'Statements', description: 'Budgetary resources, net cost, balance-sheet, note, ULO, suspense, and transition assertions supported by STARS history.' }
];

const starsNodes = [
  {
    id: 'stars-field-source',
    layer: 'source',
    title: 'Field Activity Inputs',
    subtitle: 'Legacy command/accounting events',
    icon: 'FLD',
    tags: ['field', 'command', 'obligation', 'expense'],
    summary: 'Represents command-level and field-level obligations, expenses, adjustments, collections, reimbursements, and status events captured in legacy STARS processing.',
    examples: ['Obligation input', 'Expense update', 'Collection record', 'Status correction'],
    auditQuestions: ['Can each field input trace to source authority?', 'Are accounting classification elements complete?', 'Are rejected or corrected records retained?'],
    keyFields: ['document number', 'fund', 'organization', 'object class', 'program element', 'amount', 'effective date'],
    risks: ['Unsupported field posting', 'Invalid accounting classification', 'Correction not tied to original transaction']
  },
  {
    id: 'stars-vendor-pay-source',
    layer: 'source',
    title: 'Vendor Pay / Contract Sources',
    subtitle: 'Award, receipt, invoice, payment support',
    icon: 'P2P',
    tags: ['vendor', 'contract', 'invoice', 'payment'],
    summary: 'Captures contract, vendor pay, receipt, acceptance, invoice, disbursement, and liquidation activity that historically affected STARS obligations and expenditures.',
    examples: ['Contract award', 'Invoice', 'Receiving report', 'Payment', 'Liquidation'],
    auditQuestions: ['Does every payment tie to obligation and receipt/acceptance support?', 'Are partial liquidations traceable?', 'Are unmatched disbursements resolved?'],
    keyFields: ['PIID', 'CLIN', 'invoice', 'payment voucher', 'vendor', 'obligation document', 'amount'],
    risks: ['Payment lacks receipt support', 'Unmatched disbursement', 'Obligation not liquidated correctly']
  },
  {
    id: 'stars-payroll-travel-source',
    layer: 'source',
    title: 'Payroll / Labor / Travel',
    subtitle: 'Personnel cost and entitlement feeds',
    icon: 'PAY',
    tags: ['payroll', 'labor', 'travel', 'dts'],
    summary: 'Represents payroll, labor, travel authorization/voucher, entitlement, and accrual events that require legacy accounting and reporting support.',
    examples: ['Civilian payroll', 'Labor distribution', 'Travel voucher', 'Travel obligation', 'Accrual'],
    auditQuestions: ['Do labor and travel costs trace to approved source populations?', 'Are accruals complete?', 'Are stale travel obligations reviewed?'],
    keyFields: ['employee/traveler ID', 'pay period', 'authorization/voucher', 'LOA', 'amount', 'period'],
    risks: ['Unsupported labor population', 'Travel obligation not cleared', 'Cutoff/accrual error']
  },
  {
    id: 'stars-disbursing-source',
    layer: 'source',
    title: 'Disbursing / Treasury / IPAC',
    subtitle: 'Payments, collections, and intragovernmental settlement',
    icon: 'DSB',
    tags: ['disbursing', 'collections', 'ipac', 'treasury'],
    summary: 'Provides payment, collection, IPAC, and Treasury-related activity that must reconcile to legacy accounting, reporting, and fund balance support.',
    examples: ['Disbursement', 'Collection', 'IPAC settlement', 'Treasury confirmation'],
    auditQuestions: ['Do disbursements and collections tie to accounting documents?', 'Are IPAC/trading partner attributes complete?', 'Are unreconciled items aged and resolved?'],
    keyFields: ['voucher', 'disbursing station', 'TAS', 'BETC', 'trading partner', 'amount', 'date'],
    risks: ['Fund balance reconciliation break', 'Trading partner mismatch', 'Unmatched payment/collection']
  },
  {
    id: 'stars-navy-erp-transition',
    layer: 'source',
    title: 'Navy ERP / Archive Transition Partner',
    subtitle: 'Migration, bridge, and historical lookup',
    icon: 'ERP',
    tags: ['navy erp', 'migration', 'archive', 'transition'],
    summary: 'Represents the modern Navy ERP, archive, data conversion, and reconciliation relationship used when legacy STARS balances or transactions must support current reporting or audit.',
    examples: ['Beginning balance bridge', 'Legacy transaction lookup', 'Archive extract', 'Migration reconciliation'],
    auditQuestions: ['Can migrated balances trace to legacy STARS detail?', 'Are archived records complete?', 'Are conversion adjustments approved and explained?'],
    keyFields: ['legacy document', 'converted document', 'fund', 'USSGL', 'balance amount', 'conversion batch', 'period'],
    risks: ['Migration break', 'Archive extract incomplete', 'Legacy balance unsupported']
  },
  {
    id: 'stars-fl',
    layer: 'base',
    title: 'STARS-FL / Field-Level Accounting',
    subtitle: 'Legacy field processing and control',
    icon: 'FL',
    tags: ['stars-fl', 'field level', 'legacy accounting'],
    summary: 'Models field-level STARS accounting controls for transaction intake, edits, document status, classification, obligation/expenditure processing, and local reporting.',
    examples: ['Field accounting edit', 'Document status update', 'Local report', 'Reject correction'],
    auditQuestions: ['Are field transactions complete and valid?', 'Are local corrections authorized?', 'Can field records trace to central reporting?'],
    keyFields: ['document number', 'fund code', 'organization', 'object class', 'transaction code', 'amount', 'status'],
    risks: ['Field-to-central reconciliation failure', 'Invalid accounting classification', 'Local correction lacks evidence']
  },
  {
    id: 'stars-central',
    layer: 'base',
    title: 'STARS Central / Consolidation',
    subtitle: 'Edit, summarize, consolidate, report',
    icon: 'CTR',
    tags: ['central', 'consolidation', 'trial balance', 'reporting'],
    summary: 'Models central STARS processing that consolidated field activity, applied edits, summarized balances, and supported trial-balance or external reporting outputs.',
    examples: ['Central edit', 'Summary balance', 'Trial balance feed', 'Report extract'],
    auditQuestions: ['Do central summaries reconcile to field/detail populations?', 'Are edits and rejects resolved?', 'Are crosswalks governed?'],
    keyFields: ['summary account', 'fund', 'USSGL/crosswalk', 'period', 'amount', 'batch', 'reject code'],
    risks: ['Summary lacks detail support', 'Crosswalk error', 'Rejects remain in suspense']
  },
  {
    id: 'stars-suspense-processing',
    layer: 'base',
    title: 'Suspense / Reject Processing',
    subtitle: 'Unmatched, invalid, and exception records',
    icon: 'SUS',
    tags: ['suspense', 'reject', 'exception', 'unmatched'],
    summary: 'Tracks transactions that fail edits, lack matching detail, contain invalid accounting, or require research before posting, clearing, or reporting.',
    examples: ['Rejected record', 'Unmatched disbursement', 'Invalid LOA', 'Suspense clearing'],
    auditQuestions: ['Are suspense balances aged and owned?', 'Can clearing entries trace to root cause?', 'Are invalid accounting records corrected timely?'],
    keyFields: ['reject code', 'suspense account', 'source document', 'amount', 'age', 'owner', 'clearing document'],
    risks: ['Aged suspense', 'Clearing unsupported', 'Statement balances include invalid items']
  },
  {
    id: 'stars-close-processing',
    layer: 'base',
    title: 'Legacy Close Processing',
    subtitle: 'Period close, balances, and historical reporting',
    icon: 'CLS',
    tags: ['close', 'trial balance', 'legacy', 'period'],
    summary: 'Supports period-end close, balance roll-forward, trial-balance preparation, adjustment review, archive retention, and transition reporting.',
    examples: ['Period close', 'Balance roll-forward', 'Trial balance extract', 'Archive package'],
    auditQuestions: ['Are opening and ending balances reconciled?', 'Are close adjustments supported?', 'Can historic reports be reproduced?'],
    keyFields: ['period', 'fund', 'account', 'beginning balance', 'activity', 'ending balance', 'adjustment'],
    risks: ['Balance roll-forward break', 'Unsupported close adjustment', 'Historic report cannot be reproduced']
  },
  {
    id: 'stars-document-detail',
    layer: 'detail',
    title: 'Legacy Document Detail',
    subtitle: 'Document number, fund, org, object class, amount',
    icon: 'DOC',
    tags: ['document', 'uott', 'detail', 'classification'],
    summary: 'Preserves document-level accounting identity, classification, amount, date, status, and lineage needed for legacy transaction sampling.',
    examples: ['Accounting document', 'Funding line', 'Status update', 'Correction record'],
    auditQuestions: ['Is the UoT complete at document level?', 'Can corrections trace to original records?', 'Are required classification fields populated?'],
    keyFields: ['document number', 'fund', 'organization', 'object class', 'transaction code', 'amount', 'status'],
    risks: ['Incomplete UoT', 'Missing accounting attributes', 'Correction breaks lineage']
  },
  {
    id: 'stars-obligation-detail',
    layer: 'detail',
    title: 'Obligation / ULO Detail',
    subtitle: 'Commitment, obligation, expenditure, deobligation',
    icon: 'ULO',
    tags: ['obligation', 'ulo', 'sbr', 'deobligation'],
    summary: 'Maintains obligation history, changes, liquidations, deobligations, aging, and support needed for SBR and ULO review.',
    examples: ['Obligation', 'Modification', 'Liquidation', 'Deobligation', 'ULO review'],
    auditQuestions: ['Are open obligations valid and supportable?', 'Do modifications reconcile to obligation changes?', 'Are deobligations timely and approved?'],
    keyFields: ['obligation document', 'PIID', 'fund', 'amount', 'liquidated amount', 'open balance', 'age'],
    risks: ['Unsupported ULO', 'Stale obligation', 'Incorrect liquidation']
  },
  {
    id: 'stars-expenditure-detail',
    layer: 'detail',
    title: 'Expenditure / Collection Detail',
    subtitle: 'Payment, collection, liquidation, disbursing trail',
    icon: 'EXP',
    tags: ['expenditure', 'collection', 'outlay', 'disbursing'],
    summary: 'Preserves payment, collection, disbursing, IPAC, liquidation, and outlay detail tied to budgetary and proprietary accounting.',
    examples: ['Payment voucher', 'Collection', 'IPAC', 'Liquidation', 'Outlay'],
    auditQuestions: ['Do expenditures tie to valid obligations?', 'Are collections applied correctly?', 'Do outlays reconcile to Treasury support?'],
    keyFields: ['voucher', 'disbursing office', 'TAS', 'BETC', 'document number', 'amount', 'date'],
    risks: ['Unmatched disbursement', 'Collection misapplied', 'FBWT tie-out issue']
  },
  {
    id: 'stars-jv-detail',
    layer: 'detail',
    title: 'Journal Voucher Package',
    subtitle: 'Correction, accrual, reclass, reversal evidence',
    icon: 'JV',
    tags: ['journal voucher', 'manual adjustment', 'accrual', 'reversal'],
    summary: 'Captures manual adjustment support, preparer/reviewer/approver evidence, debit/credit lines, source cause, posting, and reversal tracking.',
    examples: ['Correction JV', 'Accrual JV', 'Reclass', 'Reversal', 'Approval package'],
    auditQuestions: ['Is the JV supported by source evidence?', 'Are preparer/reviewer/approver duties separated?', 'Was reversal tracked where required?'],
    keyFields: ['JV number', 'source document', 'USSGL', 'debit', 'credit', 'approver', 'reversal date'],
    risks: ['Unsupported manual adjustment', 'Segregation-of-duties weakness', 'Reversal omitted']
  },
  {
    id: 'stars-archive-detail',
    layer: 'detail',
    title: 'Archive / Migration Extract',
    subtitle: 'Legacy lookup, conversion, and audit population',
    icon: 'ARC',
    tags: ['archive', 'migration', 'extract', 'audit'],
    summary: 'Maintains historical transaction and balance extracts used for audit support, Navy ERP transition, legacy reconciliation, and sample response.',
    examples: ['Archive UoT', 'Balance conversion extract', 'Legacy lookup', 'Sample response'],
    auditQuestions: ['Is the archive population complete?', 'Can extracts be reproduced?', 'Do converted balances tie to legacy detail?'],
    keyFields: ['extract ID', 'legacy document', 'fund', 'period', 'account', 'amount', 'conversion batch'],
    risks: ['Archive incomplete', 'Conversion not reconcilable', 'Legacy sample unsupported']
  },
  {
    id: 'stars-budgetary-control',
    layer: 'accounting',
    title: 'Budgetary Accounting Control',
    subtitle: 'Authority, commitments, obligations, expenditures, outlays',
    icon: 'BUD',
    tags: ['budgetary', 'sbr', 'obligation', 'outlay'],
    summary: 'Controls budgetary activity from authority and obligation through expenditure, outlay, ULO, cancellation, and reporting support.',
    examples: ['Budget authority', 'Commitment', 'Obligation', 'Expenditure', 'Outlay'],
    auditQuestions: ['Do budgetary balances tie to supported detail?', 'Are ULOs valid?', 'Are outlays recorded in the proper period?'],
    keyFields: ['TAS', 'fund', 'USSGL/crosswalk', 'document', 'amount', 'period'],
    risks: ['SBR misstatement', 'Unsupported ULO', 'Cutoff error']
  },
  {
    id: 'stars-proprietary-control',
    layer: 'accounting',
    title: 'Proprietary Accounting Control',
    subtitle: 'Expense, AP, AR, assets, FBWT support',
    icon: 'PROP',
    tags: ['proprietary', 'expense', 'ap', 'ar'],
    summary: 'Supports proprietary effects for expenses, payables, receivables, collections, assets, and fund balance with Treasury where reflected in legacy reporting.',
    examples: ['Expense posting', 'AP balance', 'AR balance', 'FBWT support'],
    auditQuestions: ['Do proprietary postings reconcile to budgetary/source detail?', 'Are AP/AR balances aged and supportable?', 'Does FBWT reconcile?'],
    keyFields: ['USSGL/crosswalk', 'document', 'vendor/customer', 'TAS', 'amount', 'period'],
    risks: ['Budgetary/proprietary mismatch', 'Unsupported AP/AR', 'FBWT reconciliation break']
  },
  {
    id: 'stars-jv-control',
    layer: 'accounting',
    title: 'JV / Adjustment Controls',
    subtitle: 'Approval, evidence, posting, reversal, reporting impact',
    icon: 'ADJ',
    tags: ['jv', 'adjustment', 'approval', 'close'],
    summary: 'Controls manual accounting entries, close adjustments, accruals, corrections, reversals, and reclasses to prevent unsupported statement impact.',
    examples: ['Accrual', 'Correction', 'Reclassification', 'Reversal', 'Close entry'],
    auditQuestions: ['Does every adjustment have source cause and support?', 'Was approval completed before posting?', 'Are recurring/reversing entries tracked?'],
    keyFields: ['JV number', 'preparer', 'reviewer', 'approver', 'USSGL', 'amount', 'reversal flag'],
    risks: ['Manual override of source system', 'Unsupported close entry', 'Missing reversal']
  },
  {
    id: 'stars-navy-erp-bridge',
    layer: 'accounting',
    title: 'Navy ERP Transition Bridge',
    subtitle: 'Legacy balance and transaction tie-out',
    icon: 'BRG',
    tags: ['navy erp', 'transition', 'bridge', 'reconciliation'],
    summary: 'Links legacy STARS transactions and balances to Navy ERP conversion, beginning balances, archive evidence, and ongoing audit-support inquiries.',
    examples: ['Balance bridge', 'Conversion adjustment', 'Legacy-to-ERP tie-out', 'Archive support'],
    auditQuestions: ['Do converted balances reconcile to STARS detail?', 'Are conversion adjustments approved?', 'Can legacy source records be retrieved?'],
    keyFields: ['legacy account', 'ERP account', 'fund', 'period', 'amount', 'conversion batch', 'adjustment ID'],
    risks: ['Beginning balance unsupported', 'Conversion adjustment unexplained', 'Legacy lookup gap']
  },
  {
    id: 'stars-trial-balance',
    layer: 'reporting',
    title: 'Trial Balance / Legacy Reports',
    subtitle: 'Summarized balances and close outputs',
    icon: 'TB',
    tags: ['trial balance', 'reports', 'close', 'legacy'],
    summary: 'Produces or supports legacy trial balances, summary reports, close packages, management reports, and reconciliation extracts.',
    examples: ['Trial balance', 'Fund report', 'Close report', 'Balance extract'],
    auditQuestions: ['Do reports reconcile to transaction detail?', 'Are report parameters documented?', 'Can historic reports be reproduced?'],
    keyFields: ['report ID', 'period', 'fund', 'account', 'beginning balance', 'activity', 'ending balance'],
    risks: ['Report not reproducible', 'Summary not tied to detail', 'Parameter/filter ambiguity']
  },
  {
    id: 'stars-ddrs-gtas',
    layer: 'reporting',
    title: 'DDRS / GTAS / Treasury Support',
    subtitle: 'External financial reporting path',
    icon: 'GTAS',
    tags: ['ddrs', 'gtas', 'treasury', 'ussgl'],
    summary: 'Supports DoD and Treasury reporting through trial-balance crosswalks, TAS/USSGL attributes, DDRS, GTAS, IPAC, and reconciliation support.',
    examples: ['DDRS feed', 'GTAS crosswalk', 'USSGL mapping', 'Treasury tie-out'],
    auditQuestions: ['Are TAS and USSGL attributes complete?', 'Do DDRS/GTAS values reconcile to trial balance?', 'Are crosswalks governed?'],
    keyFields: ['TAS', 'USSGL', 'fund', 'period', 'amount', 'statement line', 'trading partner'],
    risks: ['Crosswalk error', 'TAS/USSGL mismatch', 'Unsupported Treasury reporting amount']
  },
  {
    id: 'stars-audit-package',
    layer: 'reporting',
    title: 'Audit / Archive Package',
    subtitle: 'Sample support and historical evidence',
    icon: 'AUD',
    tags: ['audit', 'archive', 'evidence', 'sample'],
    summary: 'Assembles source documents, transaction extracts, approvals, JVs, suspense research, trial balances, and conversion tie-outs for audit support.',
    examples: ['Sample package', 'Archive extract', 'Suspense aging', 'Conversion tie-out'],
    auditQuestions: ['Can evidence be retrieved for the sampled item?', 'Is the UoT extract complete?', 'Does support cover source, accounting, and reporting?'],
    keyFields: ['sample ID', 'legacy document', 'archive extract', 'report line', 'evidence link', 'reconciliation ID'],
    risks: ['Evidence unavailable', 'Archive incomplete', 'Sample cannot be tied to report']
  },
  {
    id: 'stars-sbr',
    layer: 'statements',
    title: 'Statement of Budgetary Resources',
    subtitle: 'Authority, obligations, expenditures, outlays, ULOs',
    icon: 'SBR',
    tags: ['sbr', 'budgetary', 'ulo', 'outlay'],
    summary: 'Supports SBR assertions for legacy budget authority, obligations, delivered orders, expenditures, outlays, recoveries, and ULO review.',
    examples: ['Obligation support', 'ULO aging', 'Outlay support', 'Deobligation'],
    auditQuestions: ['Are budgetary amounts complete and valid?', 'Are ULOs supported?', 'Do outlays tie to Treasury/disbursing evidence?'],
    keyFields: ['TAS', 'fund', 'USSGL/crosswalk', 'document', 'obligation amount', 'outlay amount'],
    risks: ['Unsupported ULO', 'Outlay mismatch', 'Budgetary classification error']
  },
  {
    id: 'stars-net-cost',
    layer: 'statements',
    title: 'Net Cost / Balance Sheet Support',
    subtitle: 'Expense, AP, AR, assets, FBWT impacts',
    icon: 'NCT',
    tags: ['net cost', 'balance sheet', 'expense', 'fbwt'],
    summary: 'Connects legacy expenses, accruals, AP, AR, assets, collections, and fund-balance activity to net cost and balance-sheet support.',
    examples: ['Expense support', 'AP/AR aging', 'FBWT tie-out', 'Accrual support'],
    auditQuestions: ['Can expenses trace to supported events?', 'Are AP/AR balances supportable?', 'Does FBWT reconcile to Treasury?'],
    keyFields: ['USSGL/crosswalk', 'document', 'vendor/customer', 'TAS', 'amount', 'period'],
    risks: ['Expense unsupported', 'AP/AR aging weakness', 'FBWT unreconciled']
  },
  {
    id: 'stars-notes-transition',
    layer: 'statements',
    title: 'Notes / Suspense / Transition Assertions',
    subtitle: 'Disclosure, archive, conversion, and legacy cleanup',
    icon: 'NTE',
    tags: ['notes', 'suspense', 'transition', 'disclosure'],
    summary: 'Supports note schedules, suspense disclosure, legacy cleanup, archive reliance, transition adjustments, and beginning balance support.',
    examples: ['Suspense note', 'Transition schedule', 'Legacy cleanup list', 'Beginning balance support'],
    auditQuestions: ['Are note schedules tied to controlled populations?', 'Are suspense and cleanup actions aged and governed?', 'Can beginning balances trace to legacy support?'],
    keyFields: ['schedule ID', 'legacy document', 'suspense account', 'conversion batch', 'amount', 'owner', 'status'],
    risks: ['Unsupported note schedule', 'Aged suspense not resolved', 'Beginning balance gap']
  }
];

const starsLineageScenarios = [
  {
    id: 'stars-obligation-to-sbr',
    short: 'obligation',
    title: 'Legacy Obligation to SBR and ULO Review',
    description: 'Traces a STARS obligation from field or vendor source through field/central processing, obligation detail, budgetary control, reporting, and SBR support.',
    path: ['stars-field-source', 'stars-fl', 'stars-obligation-detail', 'stars-budgetary-control', 'stars-trial-balance', 'stars-sbr'],
    steps: [
      'A field activity or contract source creates an obligation with document, fund, organization, object class, and amount.',
      'STARS field-level processing edits the transaction and passes supported activity toward central consolidation.',
      'Obligation detail preserves changes, liquidations, deobligations, and open balance aging.',
      'Budgetary controls classify the activity for authority, obligations, expenditures, outlays, and ULO review.',
      'Trial balance and SBR support trace reported amounts back to the legacy obligation population.'
    ],
    exceptionTests: ['invalid fund/classification', 'stale ULO', 'modification not reflected', 'trial balance not tied to detail', 'deobligation unsupported']
  },
  {
    id: 'stars-vendor-pay',
    short: 'vendor pay',
    title: 'Vendor Pay to Expenditure and Net Cost',
    description: 'Connects contract, receipt, invoice, payment, expenditure detail, proprietary control, and net cost or balance-sheet support.',
    path: ['stars-vendor-pay-source', 'stars-central', 'stars-expenditure-detail', 'stars-proprietary-control', 'stars-ddrs-gtas', 'stars-net-cost'],
    steps: [
      'Contract, receipt, acceptance, invoice, and payment evidence enters or supports legacy STARS accounting.',
      'Central processing summarizes valid activity and identifies rejects or unmatched items.',
      'Expenditure detail ties disbursement, liquidation, and outlay evidence to the original obligation.',
      'Proprietary control records expense, AP, AR, asset, or FBWT impact where applicable.',
      'DDRS/GTAS and statement support reconcile reported amounts to source payment and accounting detail.'
    ],
    exceptionTests: ['payment without receipt', 'unmatched disbursement', 'AP/expense cutoff issue', 'Treasury mismatch', 'source payment not archived']
  },
  {
    id: 'stars-jv-close',
    short: 'JV close',
    title: 'Journal Voucher Close Adjustment to Statement Support',
    description: 'Shows how a manual STARS adjustment should preserve source cause, approval, posting, reversal, and audit evidence.',
    path: ['stars-suspense-processing', 'stars-jv-detail', 'stars-jv-control', 'stars-close-processing', 'stars-audit-package', 'stars-notes-transition'],
    steps: [
      'An exception, suspense item, accrual need, reclass, or reporting difference creates a proposed JV.',
      'The JV package documents source cause, debit/credit lines, preparer, reviewer, approver, and reversal needs.',
      'JV control verifies approval, segregation of duties, posting, and tie-back to underlying evidence.',
      'Close processing incorporates the adjustment into legacy balances and reporting packages.',
      'Audit and note schedules preserve the adjustment rationale, posting impact, and reversal/cleanup status.'
    ],
    exceptionTests: ['JV lacks source support', 'approval after posting', 'debit/credit not balanced', 'reversal omitted', 'manual entry masks feeder defect']
  },
  {
    id: 'stars-transition-archive',
    short: 'transition',
    title: 'STARS Archive to Navy ERP Transition Bridge',
    description: 'Traces legacy balances and archived transactions into Navy ERP transition, beginning balance, and audit-support paths.',
    path: ['stars-navy-erp-transition', 'stars-archive-detail', 'stars-navy-erp-bridge', 'stars-trial-balance', 'stars-audit-package', 'stars-notes-transition'],
    steps: [
      'Legacy STARS balances or transactions are requested for migration, beginning balance, or audit support.',
      'Archive extracts preserve historical detail, source documents, period, fund, account, and amount.',
      'The Navy ERP transition bridge reconciles legacy values to converted balances and approved adjustments.',
      'Trial balance support ties the converted or historical amount to reporting populations.',
      'Audit and note packages retain the archive, reconciliation, and conversion evidence.'
    ],
    exceptionTests: ['archive extract incomplete', 'converted balance not reconciled', 'conversion adjustment unsupported', 'legacy sample not retrievable', 'beginning balance gap']
  }
];

const starsSupportServices = [
  { title: 'Legacy Accounting Governance', detail: 'Document-number control, field-to-central reconciliation, accounting classification validation, period close, balance roll-forward, and report reproducibility.' },
  { title: 'Suspense and Reject Control', detail: 'Reject queues, unmatched disbursements, invalid LOA/accounting edits, suspense aging, owner assignment, clearing evidence, and root-cause tracking.' },
  { title: 'JV and Close Controls', detail: 'Manual adjustment support, preparer/reviewer/approver trail, debit/credit validation, accruals, reclasses, reversals, and close-package tie-outs.' },
  { title: 'Archive and Transition Support', detail: 'Legacy UoT extracts, Navy ERP balance bridge, conversion batches, beginning-balance evidence, historic lookup, and retained sample packages.' },
  { title: 'Reporting Crosswalks', detail: 'Legacy account-to-USSGL/TAS mapping, trial balance support, DDRS/GTAS reconciliation, Treasury/IPAC tie-outs, and statement-line mapping.' },
  { title: 'Audit Evidence', detail: 'Source documents, transaction detail, obligation/expenditure history, payment and collection support, archive extracts, reconciliations, and note schedules.' }
];

const starsCaveats = [
  'Public STARS family technical documentation is limited. This blueprint models STARS as a Navy legacy accounting and reporting family, not a SAP or Oracle ERP implementation.',
  'STARS variants, interface names, file layouts, platform details, retirement/archival status, and system-of-record boundaries require authoritative Navy, DFAS, or program documentation.',
  'This page is intentionally transition- and audit-focused because legacy STARS data may be most important for UoT reconstruction, beginning balances, manual adjustments, suspense cleanup, and Navy ERP migration support.',
  'Feeder counts are modeled source/partner categories represented in this blueprint, not a certified production interface inventory.'
];

const starsSources = [
  { name: 'DFAS Navy ERP information', url: 'https://www.dfas.mil/PDI/NavyERP/' },
  { name: 'DoD Financial Management Regulation', url: 'https://comptroller.defense.gov/FMR/' },
  { name: 'Treasury GTAS', url: 'https://fiscal.treasury.gov/accounting/government-wide-treasury-account-symbol-gtas' },
  { name: 'Treasury USSGL', url: 'https://fiscal.treasury.gov/accounting/us-standard-general-ledger-ussgl' },
  { name: 'Treasury G-Invoicing / IPAC', url: 'https://fiscal.treasury.gov/accounting/intragov' }
];

const sabrsLayers = [
  { id: 'source', label: 'USMC Source / Interface Events', short: 'Source', description: 'Budget, contract, logistics, payroll, travel, disbursing, reimbursable, and Navy/DON partner events that drive Marine Corps accounting.' },
  { id: 'base', label: 'SABRS Processing', short: 'SABRS', description: 'Standard Accounting, Budgeting, and Reporting System processing for budget execution, accounting, reimbursables, suspense, JVs, close, and reporting support.' },
  { id: 'detail', label: 'Transaction and Support Detail', short: 'Detail', description: 'Fund cite, document, obligation, expenditure, reimbursable, JV, suspense, and archive detail that preserves the Universe of Transactions.' },
  { id: 'accounting', label: 'Accounting and Control Layer', short: 'Accounting', description: 'Budgetary and proprietary accounting, funds control, AP/AR, FBWT, Navy ERP/DON bridge, and reconciliation controls.' },
  { id: 'reporting', label: 'Execution and External Reporting', short: 'Reporting', description: 'Funds status, ULO, command reports, trial balance, DDRS, GTAS, AFR schedules, and audit package support.' },
  { id: 'statements', label: 'USMC / DON Statement Support', short: 'Statements', description: 'SBR, net cost, balance sheet, FBWT, reimbursable, ULO, note, and audit assertions supported by SABRS lineage.' }
];

const sabrsNodes = [
  {
    id: 'sabrs-budget-source',
    layer: 'source',
    title: 'Budget / P&R / Funding Inputs',
    subtitle: 'Allotment, allocation, execution authority',
    icon: 'BUD',
    tags: ['budget', 'funding', 'allocation', 'pandr'],
    summary: 'Captures funding authority, allotments, allocations, apportionment-related attributes, fiscal year controls, and command-level budget execution inputs.',
    examples: ['Funding authorization', 'Allotment', 'Command allocation', 'Fiscal-year control'],
    auditQuestions: ['Is budget authority valid and traceable?', 'Are allotments and allocations recorded in the right period?', 'Are fund cites complete before execution?'],
    keyFields: ['TAS', 'fund', 'fiscal year', 'appropriation', 'allotment', 'organization', 'amount'],
    risks: ['Invalid fund cite', 'Execution exceeds authority', 'Budget authority not tied to source support']
  },
  {
    id: 'sabrs-contract-piee-source',
    layer: 'source',
    title: 'Contracts / PIEE-WAWF',
    subtitle: 'Awards, invoices, receipts, acceptance',
    icon: 'P2P',
    tags: ['contract', 'vendor', 'invoice', 'receipt'],
    summary: 'Represents contract award, modification, invoice, receipt, acceptance, and payment-support evidence affecting obligations, expenses, accruals, and outlays.',
    examples: ['Contract award', 'Modification', 'Receiving report', 'Invoice', 'Acceptance'],
    auditQuestions: ['Does every invoice tie to contract and receipt/acceptance evidence?', 'Do modifications reconcile to obligation changes?', 'Are unmatched items resolved?'],
    keyFields: ['PIID', 'CLIN', 'invoice', 'receipt', 'vendor', 'obligation document', 'amount'],
    risks: ['Unsupported payment', 'Obligation not updated for modification', 'Receipt/invoice mismatch']
  },
  {
    id: 'sabrs-gcss-mc-source',
    layer: 'source',
    title: 'GCSS-MC / Logistics Sources',
    subtitle: 'Supply, maintenance, property, inventory impacts',
    icon: 'GCSS',
    tags: ['gcss-mc', 'logistics', 'supply', 'maintenance'],
    summary: 'Provides logistics events that may drive obligations, expenses, inventory or asset support, reimbursable activity, and audit evidence in SABRS or reporting packages.',
    examples: ['Supply demand', 'Maintenance parts', 'Inventory issue', 'Property adjustment'],
    auditQuestions: ['Do logistics events with financial impact reach accounting?', 'Can accounting samples trace back to GCSS-MC evidence?', 'Are interface rejects researched?'],
    keyFields: ['document number', 'DoDAAC/UIC', 'NSN/material', 'fund cite', 'quantity', 'amount', 'interface batch'],
    risks: ['Logistics-to-finance break', 'Unsupported accounting event', 'Interface suspense not cleared']
  },
  {
    id: 'sabrs-payroll-travel-source',
    layer: 'source',
    title: 'Payroll / Labor / DTS',
    subtitle: 'Personnel cost, labor, travel, entitlement feeds',
    icon: 'PAY',
    tags: ['payroll', 'labor', 'travel', 'dts'],
    summary: 'Represents payroll, labor distribution, travel authorization/voucher, entitlement, and accrual activity that requires budgetary and proprietary accounting.',
    examples: ['Civilian payroll', 'Labor distribution', 'Travel authorization', 'Travel voucher', 'Accrual'],
    auditQuestions: ['Do labor and travel costs trace to approved source populations?', 'Are accruals complete and reversed as needed?', 'Are stale travel obligations reviewed?'],
    keyFields: ['employee/traveler ID', 'pay period', 'authorization/voucher', 'LOA', 'organization', 'amount'],
    risks: ['Unsupported labor cost', 'Travel obligation not cleared', 'Accrual cutoff error']
  },
  {
    id: 'sabrs-disbursing-treasury-source',
    layer: 'source',
    title: 'Disbursing / Treasury / IPAC',
    subtitle: 'Payments, collections, intragovernmental settlement',
    icon: 'DSB',
    tags: ['disbursing', 'treasury', 'ipac', 'collections'],
    summary: 'Feeds payment, collection, IPAC, Treasury, trading-partner, and fund balance activity requiring reconciliation to SABRS accounting records.',
    examples: ['Disbursement', 'Collection', 'IPAC settlement', 'Treasury confirmation'],
    auditQuestions: ['Do disbursements and collections tie to accounting documents?', 'Are trading partner attributes complete?', 'Do FBWT tie-outs clear differences?'],
    keyFields: ['voucher', 'TAS', 'BETC', 'trading partner', 'disbursing station', 'document number', 'amount'],
    risks: ['FBWT mismatch', 'Trading partner mismatch', 'Unmatched payment or collection']
  },
  {
    id: 'sabrs-navy-erp-partner',
    layer: 'source',
    title: 'Navy ERP / DON Reporting Partner',
    subtitle: 'DON reporting, transition, and reconciliation bridge',
    icon: 'ERP',
    tags: ['navy erp', 'don', 'reporting', 'transition'],
    summary: 'Represents DON ERP/reporting relationships for consolidation, transition, archive, or reconciliation where SABRS activity supports Marine Corps and Department of the Navy reporting.',
    examples: ['DON reporting tie-out', 'Transition bridge', 'Archive lookup', 'Crosswalk reconciliation'],
    auditQuestions: ['Do SABRS balances reconcile to DON reporting outputs?', 'Are transition adjustments approved?', 'Can archived support be retrieved?'],
    keyFields: ['SABRS document', 'DON/ERP reference', 'fund', 'USSGL', 'period', 'amount', 'bridge batch'],
    risks: ['DON reporting bridge break', 'Transition adjustment unsupported', 'Archive gap']
  },
  {
    id: 'sabrs-budget-execution',
    layer: 'base',
    title: 'Budget Execution',
    subtitle: 'Funds availability, commitments, obligations, status',
    icon: 'FM',
    tags: ['budget execution', 'funds control', 'commitment', 'obligation'],
    summary: 'Controls funding availability, commitments, obligations, fiscal-year rules, command execution status, and budgetary classification before financial reporting.',
    examples: ['Funds check', 'Commitment', 'Obligation', 'Reprogramming/update', 'Status of funds'],
    auditQuestions: ['Are commitments and obligations within available authority?', 'Are fiscal-year and purpose rules enforced?', 'Are open commitments reviewed?'],
    keyFields: ['fund cite', 'appropriation', 'organization', 'commitment', 'obligation', 'available balance', 'period'],
    risks: ['Anti-deficiency exposure', 'Invalid purpose/time/amount', 'Open commitment not cleared']
  },
  {
    id: 'sabrs-core-accounting',
    layer: 'base',
    title: 'Core Accounting',
    subtitle: 'Obligation, expenditure, expense, collection, outlay',
    icon: 'ACC',
    tags: ['accounting', 'obligation', 'expense', 'outlay'],
    summary: 'Records budgetary and proprietary accounting events for obligations, expenditures, expenses, payables, receivables, collections, outlays, and adjustments.',
    examples: ['Obligation posting', 'Expense posting', 'Collection', 'Outlay', 'Adjustment'],
    auditQuestions: ['Do postings trace to source documents?', 'Are budgetary and proprietary impacts consistent?', 'Are period-end accruals complete?'],
    keyFields: ['document number', 'transaction code', 'USSGL/crosswalk', 'fund', 'organization', 'amount', 'posting period'],
    risks: ['Unsupported accounting posting', 'Budgetary/proprietary mismatch', 'Cutoff error']
  },
  {
    id: 'sabrs-reimbursables',
    layer: 'base',
    title: 'Reimbursables / IGT',
    subtitle: 'Orders, billings, collections, trading partner support',
    icon: 'RMB',
    tags: ['reimbursable', 'igt', 'billing', 'collections'],
    summary: 'Supports reimbursable authority, customer orders, performance, billing, collections, IPAC/G-Invoicing support, and trading-partner reconciliation.',
    examples: ['Customer order', 'Reimbursable billing', 'Collection', 'IPAC settlement', 'Trading partner tie-out'],
    auditQuestions: ['Do reimbursable orders have valid authority?', 'Are billings tied to performance?', 'Do buyer/seller and IPAC records reconcile?'],
    keyFields: ['agreement/order', 'customer', 'trading partner', 'TAS', 'BETC', 'billing document', 'amount'],
    risks: ['Unbilled reimbursable activity', 'Trading partner mismatch', 'Collection not applied']
  },
  {
    id: 'sabrs-suspense-close',
    layer: 'base',
    title: 'Suspense, JV, and Close',
    subtitle: 'Rejects, unmatched items, manual adjustments, trial balance',
    icon: 'CLS',
    tags: ['suspense', 'jv', 'close', 'trial balance'],
    summary: 'Manages rejected records, suspense, unmatched payments/collections, manual JVs, accruals, reversals, close adjustments, and trial-balance preparation.',
    examples: ['Reject correction', 'Suspense clearing', 'JV', 'Accrual', 'Trial balance close'],
    auditQuestions: ['Are suspense items aged and owned?', 'Are JVs supported and approved?', 'Do close balances reconcile to detail?'],
    keyFields: ['reject code', 'suspense account', 'JV number', 'trial balance account', 'owner', 'amount', 'period'],
    risks: ['Aged suspense', 'Unsupported JV', 'Close balance not tied to source detail']
  },
  {
    id: 'sabrs-fund-cite-detail',
    layer: 'detail',
    title: 'Fund Cite / LOA Detail',
    subtitle: 'TAS, appropriation, fiscal year, organization, program',
    icon: 'LOA',
    tags: ['fund cite', 'loa', 'tas', 'appropriation'],
    summary: 'Preserves the accounting classification string and fund-control attributes needed to validate budget execution, posting, reporting, and audit lineage.',
    examples: ['Line of accounting', 'TAS', 'Appropriation', 'Organization', 'Object class'],
    auditQuestions: ['Are required LOA elements complete?', 'Does classification align to purpose and reporting?', 'Are changes approved?'],
    keyFields: ['TAS', 'fund', 'fiscal year', 'organization', 'object class', 'program', 'cost code'],
    risks: ['Invalid LOA', 'Misclassification', 'Unsupported fund cite change']
  },
  {
    id: 'sabrs-obligation-detail',
    layer: 'detail',
    title: 'Obligation / ULO Detail',
    subtitle: 'PR, award, modification, liquidation, deobligation',
    icon: 'ULO',
    tags: ['obligation', 'ulo', 'contract', 'sbr'],
    summary: 'Maintains obligation records, modifications, liquidations, delivered orders, open balances, deobligations, and aging used for SBR and ULO review.',
    examples: ['Purchase request', 'Award obligation', 'Modification', 'Liquidation', 'Deobligation'],
    auditQuestions: ['Are open obligations valid and supportable?', 'Do modifications reconcile to obligation changes?', 'Are deobligations timely?'],
    keyFields: ['obligation document', 'PIID', 'CLIN', 'fund cite', 'obligated amount', 'liquidated amount', 'open balance'],
    risks: ['Unsupported ULO', 'Stale obligation', 'Liquidation mismatch']
  },
  {
    id: 'sabrs-expenditure-detail',
    layer: 'detail',
    title: 'Expenditure / Payment Detail',
    subtitle: 'Invoice, receipt, acceptance, disbursement, outlay',
    icon: 'EXP',
    tags: ['expenditure', 'payment', 'invoice', 'outlay'],
    summary: 'Preserves invoice, receipt, acceptance, disbursement, liquidation, outlay, and payment details tied to source evidence and reporting.',
    examples: ['Invoice', 'Receipt/acceptance', 'Payment voucher', 'Liquidation', 'Outlay'],
    auditQuestions: ['Do expenditures tie to valid obligations?', 'Are receipt and acceptance retained?', 'Do outlays reconcile to Treasury/disbursing?'],
    keyFields: ['invoice', 'receipt', 'voucher', 'obligation document', 'TAS', 'BETC', 'amount'],
    risks: ['Improper payment', 'Unmatched disbursement', 'Outlay/Treasury mismatch']
  },
  {
    id: 'sabrs-reimbursable-detail',
    layer: 'detail',
    title: 'Reimbursable / Customer Order Detail',
    subtitle: 'Agreement, order, performance, billing, collection',
    icon: 'IGT',
    tags: ['reimbursable', 'customer order', 'billing', 'collection'],
    summary: 'Captures reimbursable agreement/order, customer, performance, billing, collection, IPAC, and trading-partner detail.',
    examples: ['Customer order', 'Performance support', 'Billing', 'Collection', 'IPAC'],
    auditQuestions: ['Is reimbursable activity supported by agreement/order authority?', 'Can billings trace to performance?', 'Are collections applied to the right order?'],
    keyFields: ['agreement/order', 'customer', 'trading partner', 'billing document', 'collection', 'TAS', 'amount'],
    risks: ['Unbilled performance', 'Collection not applied', 'Trading partner mismatch']
  },
  {
    id: 'sabrs-jv-suspense-detail',
    layer: 'detail',
    title: 'JV / Suspense / Reject Detail',
    subtitle: 'Manual entry, root cause, approval, clearing',
    icon: 'JV',
    tags: ['jv', 'suspense', 'reject', 'manual adjustment'],
    summary: 'Documents reject records, suspense items, manual adjustments, accruals, corrections, approvals, posting impact, clearing, and reversal evidence.',
    examples: ['Reject record', 'Suspense aging', 'Correction JV', 'Accrual JV', 'Reversal'],
    auditQuestions: ['Does every JV have source support?', 'Are suspense clearings tied to root cause?', 'Are approvals complete before posting?'],
    keyFields: ['JV number', 'reject code', 'suspense account', 'source document', 'approver', 'amount', 'clearing date'],
    risks: ['Unsupported manual adjustment', 'Aged suspense', 'Missing reversal']
  },
  {
    id: 'sabrs-budgetary-gl',
    layer: 'accounting',
    title: 'Budgetary Accounting',
    subtitle: 'Authority, commitments, obligations, expenditures, outlays',
    icon: 'SBR',
    tags: ['budgetary', 'sbr', 'ussgl', 'outlay'],
    summary: 'Classifies and controls budgetary activity from authority through commitments, obligations, delivered orders, expenditures, outlays, recoveries, and ULO balances.',
    examples: ['Budget authority', 'Commitment', 'Obligation', 'Delivered order', 'Outlay'],
    auditQuestions: ['Do budgetary balances tie to supported transactions?', 'Are ULOs valid?', 'Are outlays recorded in the correct period?'],
    keyFields: ['TAS', 'fund', 'USSGL/crosswalk', 'document', 'amount', 'period'],
    risks: ['SBR misstatement', 'Unsupported ULO', 'Outlay cutoff error']
  },
  {
    id: 'sabrs-proprietary-gl',
    layer: 'accounting',
    title: 'Proprietary Accounting',
    subtitle: 'Expense, AP, AR, assets, FBWT support',
    icon: 'GL',
    tags: ['proprietary', 'expense', 'ap', 'ar', 'fbwt'],
    summary: 'Records proprietary effects for expenses, payables, receivables, collections, assets, FBWT, and other balances needed for financial-statement support.',
    examples: ['Expense', 'AP accrual', 'AR billing', 'Collection', 'FBWT tie-out'],
    auditQuestions: ['Do proprietary impacts reconcile to budgetary/source detail?', 'Are AP/AR balances aged and supportable?', 'Does FBWT reconcile to Treasury?'],
    keyFields: ['USSGL/crosswalk', 'document', 'vendor/customer', 'TAS', 'amount', 'period'],
    risks: ['Budgetary/proprietary mismatch', 'Unsupported AP/AR', 'FBWT reconciliation break']
  },
  {
    id: 'sabrs-navy-erp-bridge',
    layer: 'accounting',
    title: 'Navy ERP / DON Reporting Bridge',
    subtitle: 'Consolidation, transition, crosswalk, reconciliation',
    icon: 'BRG',
    tags: ['navy erp', 'don', 'bridge', 'crosswalk'],
    summary: 'Controls SABRS-to-DON reporting or transition relationships, crosswalks, bridge files, archive support, and reconciliation to reporting outputs.',
    examples: ['DON reporting bridge', 'Crosswalk', 'Archive extract', 'Conversion adjustment'],
    auditQuestions: ['Do bridge totals reconcile?', 'Are crosswalks governed?', 'Can DON-reported amounts trace to SABRS detail?'],
    keyFields: ['SABRS document', 'DON reference', 'fund', 'USSGL', 'bridge batch', 'amount', 'period'],
    risks: ['Bridge mismatch', 'Crosswalk error', 'Conversion adjustment unsupported']
  },
  {
    id: 'sabrs-control-reconciliation',
    layer: 'accounting',
    title: 'Control and Reconciliation',
    subtitle: 'Approvals, suspense, tie-outs, audit trail',
    icon: 'REC',
    tags: ['reconciliation', 'control', 'approval', 'audit'],
    summary: 'Maintains approval, suspense, batch, tie-out, trial balance, interface, and audit-trail controls over SABRS source-to-reporting lineage.',
    examples: ['Batch control', 'Reject report', 'Suspense aging', 'Trial balance tie-out', 'Approval log'],
    auditQuestions: ['Do control totals reconcile?', 'Are rejects and suspense cleared?', 'Are approvals and evidence retained?'],
    keyFields: ['batch', 'control total', 'reject code', 'owner', 'approval ID', 'reconciliation ID', 'amount'],
    risks: ['Control total mismatch', 'Unresolved reject', 'Missing approval/evidence']
  },
  {
    id: 'sabrs-funds-reporting',
    layer: 'reporting',
    title: 'Funds Status / Command Reporting',
    subtitle: 'Execution, ULO, budget status, management reports',
    icon: 'RPT',
    tags: ['funds status', 'command', 'ulo', 'execution'],
    summary: 'Provides USMC users with funds status, execution, obligation, ULO, reimbursable, suspense, and management reporting for command decision support.',
    examples: ['Status of funds', 'ULO report', 'Execution report', 'Reimbursable aging', 'Suspense aging'],
    auditQuestions: ['Do reports tie to controlled populations?', 'Are filters and as-of dates documented?', 'Are exceptions assigned owners?'],
    keyFields: ['report ID', 'as-of date', 'fund', 'organization', 'document', 'status', 'amount'],
    risks: ['Report not reproducible', 'Unowned exception', 'Management report not tied to accounting detail']
  },
  {
    id: 'sabrs-ddrs-gtas',
    layer: 'reporting',
    title: 'Trial Balance / DDRS / GTAS',
    subtitle: 'External reporting, Treasury, USSGL/TAS support',
    icon: 'GTAS',
    tags: ['trial balance', 'ddrs', 'gtas', 'treasury'],
    summary: 'Supports trial balance, DDRS, GTAS, TAS/USSGL crosswalks, Treasury reporting, AFR schedules, and statement-line mapping.',
    examples: ['Trial balance', 'DDRS feed', 'GTAS support', 'Treasury tie-out', 'AFR schedule'],
    auditQuestions: ['Do trial balances reconcile to source detail?', 'Are TAS/USSGL attributes complete?', 'Are crosswalks approved and current?'],
    keyFields: ['TAS', 'USSGL', 'fund', 'period', 'amount', 'statement line', 'trading partner'],
    risks: ['Crosswalk error', 'Unsupported reporting amount', 'TAS/USSGL mismatch']
  },
  {
    id: 'sabrs-audit-package',
    layer: 'reporting',
    title: 'Audit / AFR Support Package',
    subtitle: 'UoT, samples, schedules, reconciliations',
    icon: 'AUD',
    tags: ['audit', 'afr', 'evidence', 'uott'],
    summary: 'Assembles source documents, transaction extracts, approvals, JVs, suspense research, trial balance tie-outs, AFR schedules, and sample-support packages.',
    examples: ['UoT extract', 'Sample package', 'AFR schedule', 'Reconciliation', 'Approval evidence'],
    auditQuestions: ['Can samples trace from statement to source?', 'Is the UoT complete?', 'Are schedules tied to controlled populations?'],
    keyFields: ['sample ID', 'source document', 'accounting document', 'report line', 'evidence link', 'reconciliation ID'],
    risks: ['Incomplete UoT', 'Evidence unavailable', 'Schedule not tied to source population']
  },
  {
    id: 'sabrs-sbr',
    layer: 'statements',
    title: 'Statement of Budgetary Resources',
    subtitle: 'Authority, obligations, expenditures, outlays, ULOs',
    icon: 'SBR',
    tags: ['sbr', 'budgetary', 'ulo', 'outlay'],
    summary: 'Supports SBR assertions for USMC budget authority, obligations, delivered orders, expenditures, outlays, recoveries, and ULOs.',
    examples: ['Obligation support', 'ULO aging', 'Outlay support', 'Deobligation'],
    auditQuestions: ['Are budgetary amounts complete and valid?', 'Are ULOs supported?', 'Do outlays tie to Treasury/disbursing evidence?'],
    keyFields: ['TAS', 'fund', 'USSGL/crosswalk', 'document', 'obligation amount', 'outlay amount'],
    risks: ['Unsupported ULO', 'Outlay mismatch', 'Budgetary classification error']
  },
  {
    id: 'sabrs-net-cost-balance',
    layer: 'statements',
    title: 'Net Cost / Balance Sheet Support',
    subtitle: 'Expense, AP, AR, FBWT, assets, accruals',
    icon: 'NCT',
    tags: ['net cost', 'balance sheet', 'expense', 'fbwt'],
    summary: 'Connects USMC expenses, accruals, AP, AR, assets, collections, and fund balance activity to net cost and balance-sheet assertions.',
    examples: ['Expense support', 'AP/AR aging', 'FBWT tie-out', 'Accrual support'],
    auditQuestions: ['Can expenses trace to supported events?', 'Are AP/AR balances supportable?', 'Does FBWT reconcile to Treasury?'],
    keyFields: ['USSGL/crosswalk', 'document', 'vendor/customer', 'TAS', 'amount', 'period'],
    risks: ['Expense unsupported', 'AP/AR aging weakness', 'FBWT unreconciled']
  },
  {
    id: 'sabrs-notes-reimbursables',
    layer: 'statements',
    title: 'Notes / Reimbursables / Suspense',
    subtitle: 'Disclosure, trading partner, cleanup, audit schedules',
    icon: 'NTE',
    tags: ['notes', 'reimbursable', 'suspense', 'disclosure'],
    summary: 'Supports note schedules for reimbursables, trading partner activity, suspense, ULOs, FBWT, adjustments, and other audit-sensitive disclosures.',
    examples: ['Reimbursable schedule', 'Suspense note', 'Trading partner schedule', 'ULO schedule'],
    auditQuestions: ['Are note schedules tied to controlled populations?', 'Are suspense and reimbursables aged and governed?', 'Do trading partner balances reconcile?'],
    keyFields: ['schedule ID', 'agreement/order', 'trading partner', 'suspense account', 'owner', 'amount', 'status'],
    risks: ['Unsupported note schedule', 'Aged suspense not resolved', 'Trading partner mismatch']
  }
];

const sabrsLineageScenarios = [
  {
    id: 'sabrs-funds-to-sbr',
    short: 'funds to SBR',
    title: 'Funds Authorization to Obligation and SBR',
    description: 'Traces Marine Corps budget authority and execution from funding inputs through SABRS funds control, obligation detail, budgetary accounting, reporting, and SBR support.',
    path: ['sabrs-budget-source', 'sabrs-budget-execution', 'sabrs-fund-cite-detail', 'sabrs-obligation-detail', 'sabrs-budgetary-gl', 'sabrs-sbr'],
    steps: [
      'Funding authority and allocation data establish the available budget and execution limits.',
      'SABRS budget execution validates fund cite, fiscal year, organization, and availability before commitment or obligation.',
      'Fund cite and obligation detail preserve the transaction population and open-balance history.',
      'Budgetary accounting classifies authority, obligations, delivered orders, expenditures, and outlays.',
      'SBR support traces reported resources and ULO balances back to SABRS source transactions.'
    ],
    exceptionTests: ['invalid LOA', 'obligation exceeds availability', 'stale ULO', 'deobligation unsupported', 'SBR amount not tied to detail']
  },
  {
    id: 'sabrs-procure-to-pay',
    short: 'procure to pay',
    title: 'Contract Invoice to Payment, GL, and Net Cost',
    description: 'Connects contract, receipt, invoice, payment, expenditure detail, proprietary accounting, and net cost or balance-sheet support.',
    path: ['sabrs-contract-piee-source', 'sabrs-core-accounting', 'sabrs-expenditure-detail', 'sabrs-proprietary-gl', 'sabrs-ddrs-gtas', 'sabrs-net-cost-balance'],
    steps: [
      'Contract, receipt, acceptance, invoice, and payment evidence enters the accounting support trail.',
      'SABRS records obligation, expense, payable, liquidation, and outlay effects where applicable.',
      'Expenditure detail ties the payment to source contract, receipt, acceptance, and obligation records.',
      'Proprietary accounting supports expense, AP, FBWT, and related balances.',
      'Trial balance, DDRS/GTAS, and statement support reconcile reported amounts to source payment detail.'
    ],
    exceptionTests: ['invoice without receipt', 'unmatched disbursement', 'AP cutoff issue', 'payment not tied to obligation', 'Treasury mismatch']
  },
  {
    id: 'sabrs-reimbursable',
    short: 'reimbursable',
    title: 'Reimbursable Order to Billing, Collection, and Notes',
    description: 'Shows reimbursable activity from order authority through SABRS reimbursables, billing, collection, trading partner reconciliation, and note support.',
    path: ['sabrs-disbursing-treasury-source', 'sabrs-reimbursables', 'sabrs-reimbursable-detail', 'sabrs-proprietary-gl', 'sabrs-audit-package', 'sabrs-notes-reimbursables'],
    steps: [
      'A reimbursable order, customer request, or IGT activity establishes authority and trading partner context.',
      'SABRS reimbursable processing tracks order, performance, billing, collection, and IPAC/G-Invoicing support.',
      'Reimbursable detail preserves agreement, customer, billing, collection, and settlement evidence.',
      'Accounting recognizes billing, collections, receivables, and related budgetary/proprietary effects.',
      'Audit and note schedules support unbilled, billed, collected, and trading partner balances.'
    ],
    exceptionTests: ['order lacks authority', 'performance not billed', 'collection not applied', 'trading partner mismatch', 'note schedule not tied to detail']
  },
  {
    id: 'sabrs-jv-suspense-close',
    short: 'JV close',
    title: 'Suspense and JV Close Adjustment to AFR Support',
    description: 'Traces reject/suspense research and manual adjustment controls through close, reporting, audit evidence, and notes.',
    path: ['sabrs-gcss-mc-source', 'sabrs-suspense-close', 'sabrs-jv-suspense-detail', 'sabrs-control-reconciliation', 'sabrs-audit-package', 'sabrs-notes-reimbursables'],
    steps: [
      'A logistics, payment, billing, or reporting exception creates a reject, suspense item, or proposed JV.',
      'SABRS close processing tracks root cause, owner, correction, approval, and clearing status.',
      'JV/suspense detail preserves manual-entry support and clearing evidence.',
      'Control reconciliations verify batch totals, approvals, trial balance impact, and reporting tie-out.',
      'AFR/audit packages retain the source cause, adjustment, clearing, and note schedule support.'
    ],
    exceptionTests: ['aged suspense', 'JV lacks source support', 'approval after posting', 'clearing not tied to root cause', 'manual entry masks interface defect']
  }
];

const sabrsSupportServices = [
  { title: 'Budget Execution Controls', detail: 'Funding authority, LOA validation, allotments, commitments, obligations, fiscal-year controls, availability checks, and status-of-funds reporting.' },
  { title: 'Procure-to-Pay Accounting', detail: 'Contract award, modification, receipt, acceptance, invoice, AP/accrual, payment, liquidation, outlay, and Treasury/disbursing tie-outs.' },
  { title: 'Reimbursable and IGT Governance', detail: 'Order authority, customer billing, performance evidence, IPAC/G-Invoicing support, collections, trading partner reconciliation, and note schedules.' },
  { title: 'Suspense, Reject, and JV Control', detail: 'Reject queues, unmatched payments/collections, suspense aging, owner assignment, manual adjustment support, approvals, reversals, and close-package evidence.' },
  { title: 'Reporting and DON Bridge', detail: 'Trial balance, DDRS, GTAS, TAS/USSGL crosswalks, Navy ERP/DON reporting bridges, AFR schedules, and statement-line tie-outs.' },
  { title: 'Audit Evidence', detail: 'Universe of Transactions extracts, source documents, approvals, reconciliations, report parameters, evidence links, and sample-support packages.' }
];

const sabrsCaveats = [
  'SABRS-specific public technical documentation is limited. This blueprint models SABRS as a Marine Corps accounting, budgeting, and reporting system, not as a SAP or Oracle ERP implementation.',
  'Exact SABRS variants, hosting platform, file layouts, interface names, current modernization state, and system-of-record boundaries require authoritative USMC, DFAS, or DON documentation.',
  'The page is business-process and audit-lineage focused: budget execution, obligations, expenditures, reimbursables, suspense, JVs, trial balance, and AFR support.',
  'Feeder counts are modeled source/partner categories represented in this blueprint, not a certified production interface inventory.'
];

const sabrsSources = [
  { name: 'Marine Corps Programs and Resources', url: 'https://www.pandr.marines.mil/' },
  { name: 'DoD Financial Management Regulation', url: 'https://comptroller.defense.gov/FMR/' },
  { name: 'Treasury GTAS', url: 'https://fiscal.treasury.gov/accounting/government-wide-treasury-account-symbol-gtas' },
  { name: 'Treasury USSGL', url: 'https://fiscal.treasury.gov/accounting/us-standard-general-ledger-ussgl' },
  { name: 'Treasury G-Invoicing / IPAC', url: 'https://fiscal.treasury.gov/accounting/intragov' },
  { name: 'Procurement Integrated Enterprise Environment', url: 'https://piee.eb.mil/' }
];

const famisLayers = [
  { id: 'source', label: 'Source / Interface Events', short: 'Source', description: 'Funding, procurement, payroll, travel, logistics, WCF operating, disbursing, Treasury, and intragovernmental events that drive FAMIS accounting.' },
  { id: 'base', label: 'FAMIS-GF / FAMIS-WCF Processing', short: 'FAMIS', description: 'General Fund and Working Capital Fund accounting, budgeting, cost recovery, AP, AR, GL, suspense, and close processing.' },
  { id: 'detail', label: 'Transaction Detail', short: 'Detail', description: 'Fund cite, order, obligation, invoice, payment, customer order, billing, collection, inventory/cost, JV, and suspense detail.' },
  { id: 'accounting', label: 'Accounting and Control Layer', short: 'Accounting', description: 'Budgetary GL, proprietary GL, WCF cost/revenue, AP/AR, FBWT, trial-balance, Treasury, and reconciliation controls.' },
  { id: 'reporting', label: 'Execution and External Reporting', short: 'Reporting', description: 'Status of funds, WCF operating reports, trial balance, DDRS, GTAS, Treasury, audit extracts, and management reporting.' },
  { id: 'statements', label: 'Financial Statement Support', short: 'Statements', description: 'SBR, net cost, WCF inventory/revenue/cost recovery, FBWT, AP/AR, ULO, suspense, notes, and audit assertions.' }
];

const famisNodes = [
  {
    id: 'famis-gf-funding-source',
    layer: 'source',
    title: 'FAMIS-GF Funding Inputs',
    subtitle: 'Appropriation, allotment, LOA, authority',
    icon: 'GF',
    tags: ['general fund', 'funding', 'budget', 'loa'],
    summary: 'Represents general fund budget authority, allotments, allocations, fiscal-year controls, fund cites, and execution authority recorded or controlled through FAMIS-GF.',
    examples: ['Budget authority', 'Allotment', 'Fund cite', 'Status-of-funds update'],
    auditQuestions: ['Is authority valid and available?', 'Are LOA elements complete?', 'Does execution stay within purpose, time, and amount controls?'],
    keyFields: ['TAS', 'fund', 'fiscal year', 'appropriation', 'organization', 'object class', 'amount'],
    risks: ['Invalid fund cite', 'Overexecution', 'Budget authority not tied to source support']
  },
  {
    id: 'famis-wcf-operations-source',
    layer: 'source',
    title: 'FAMIS-WCF Operating Inputs',
    subtitle: 'Customer orders, inventory, cost, revenue, rates',
    icon: 'WCF',
    tags: ['working capital fund', 'customer order', 'inventory', 'cost recovery'],
    summary: 'Represents WCF customer demand, reimbursable or buyer/seller activity, inventory or service delivery, rate/cost drivers, billings, collections, and operating results.',
    examples: ['Customer order', 'Inventory issue', 'Service order', 'Billing event', 'Collection'],
    auditQuestions: ['Is the customer order valid?', 'Can billings trace to performance or delivery?', 'Are rates/costs supported?'],
    keyFields: ['customer order', 'customer DoDAAC', 'trading partner', 'cost object', 'billing document', 'collection', 'amount'],
    risks: ['Unsupported billing', 'Cost misallocation', 'Unreconciled collection']
  },
  {
    id: 'famis-p2p-source',
    layer: 'source',
    title: 'Procure-to-Pay Sources',
    subtitle: 'Awards, receipts, invoices, acceptance, payments',
    icon: 'P2P',
    tags: ['procurement', 'invoice', 'receipt', 'payment'],
    summary: 'Captures contract, purchase order, receipt, acceptance, invoice, payment, accrual, and liquidation activity affecting GF or WCF balances.',
    examples: ['Purchase order', 'Receipt', 'Invoice', 'Payment', 'Liquidation'],
    auditQuestions: ['Do PO, receipt, invoice, and payment agree?', 'Are unmatched items reviewed?', 'Are accruals complete at cutoff?'],
    keyFields: ['PIID', 'CLIN', 'PO', 'receipt', 'invoice', 'voucher', 'amount'],
    risks: ['Improper payment', 'Unrecorded accrual', 'Obligation not liquidated']
  },
  {
    id: 'famis-payroll-travel-source',
    layer: 'source',
    title: 'Payroll / Labor / Travel',
    subtitle: 'Labor, benefits, DTS, entitlement activity',
    icon: 'PAY',
    tags: ['payroll', 'labor', 'travel', 'dts'],
    summary: 'Represents payroll, labor distribution, benefits, travel authorization/voucher, entitlement, and accrual activity that posts to GF or WCF accounting.',
    examples: ['Civilian payroll', 'Labor distribution', 'Travel voucher', 'Accrual'],
    auditQuestions: ['Do costs trace to approved source populations?', 'Are labor costs assigned correctly?', 'Are stale travel obligations cleared?'],
    keyFields: ['employee/traveler ID', 'pay period', 'authorization/voucher', 'LOA', 'cost object', 'amount'],
    risks: ['Unsupported labor cost', 'Misallocated WCF labor', 'Travel obligation not cleared']
  },
  {
    id: 'famis-treasury-igt-source',
    layer: 'source',
    title: 'Treasury / Disbursing / IGT',
    subtitle: 'Payments, collections, IPAC, G-Invoicing, GTAS',
    icon: 'TRS',
    tags: ['treasury', 'disbursing', 'ipac', 'gtas'],
    summary: 'Provides disbursement, collection, IPAC/G-Invoicing, trading partner, TAS/BETC, Treasury, and GTAS-related data that must reconcile to FAMIS accounting.',
    examples: ['Disbursement', 'Collection', 'IPAC settlement', 'GTAS support'],
    auditQuestions: ['Do payments and collections tie to accounting records?', 'Are trading partner attributes complete?', 'Does FBWT reconcile?'],
    keyFields: ['TAS', 'BETC', 'voucher', 'trading partner', 'IPAC', 'collection', 'amount'],
    risks: ['FBWT mismatch', 'Trading partner mismatch', 'Unmatched payment or collection']
  },
  {
    id: 'famis-gf-core',
    layer: 'base',
    title: 'FAMIS-GF Core Accounting',
    subtitle: 'General Fund budget execution and accounting',
    icon: 'GF',
    tags: ['famis-gf', 'general fund', 'budget execution', 'accounting'],
    summary: 'Controls general fund commitments, obligations, expenditures, expenses, outlays, deobligations, status of funds, GL posting, and close activity.',
    examples: ['Commitment', 'Obligation', 'Expenditure', 'Deobligation', 'Status of funds'],
    auditQuestions: ['Are budgetary balances complete and valid?', 'Do open obligations remain supportable?', 'Do GF postings trace to source detail?'],
    keyFields: ['fund cite', 'document number', 'USSGL/crosswalk', 'commitment', 'obligation', 'expenditure', 'period'],
    risks: ['Unsupported ULO', 'Misclassified obligation', 'GF trial balance mismatch']
  },
  {
    id: 'famis-wcf-core',
    layer: 'base',
    title: 'FAMIS-WCF Core Accounting',
    subtitle: 'Working Capital Fund cost, billing, inventory, revenue',
    icon: 'WCF',
    tags: ['famis-wcf', 'working capital fund', 'cost recovery', 'billing'],
    summary: 'Controls WCF customer orders, costs, rates, inventory/service delivery, billings, collections, AP, AR, revenue, expenses, operating results, and close activity.',
    examples: ['Customer order', 'Billing', 'Collection', 'Cost allocation', 'Operating result'],
    auditQuestions: ['Do costs and billings trace to valid customer activity?', 'Are AR and collections reconciled?', 'Is inventory or service delivery support retained?'],
    keyFields: ['customer order', 'cost object', 'rate', 'billing document', 'collection', 'AR', 'period'],
    risks: ['Unsupported revenue', 'Cost recovery error', 'AR aging weakness']
  },
  {
    id: 'famis-ap-ar-gl',
    layer: 'base',
    title: 'AP / AR / GL Processing',
    subtitle: 'Payables, receivables, expenses, revenue, close',
    icon: 'GL',
    tags: ['ap', 'ar', 'gl', 'close'],
    summary: 'Records vendor liabilities, customer receivables, expenses, revenue, collections, disbursements, journals, accruals, reversals, and close activity.',
    examples: ['AP invoice', 'AR billing', 'Expense posting', 'Revenue posting', 'GL journal'],
    auditQuestions: ['Do AP/AR subledgers reconcile to GL?', 'Are journals supported and approved?', 'Are accruals and reversals complete?'],
    keyFields: ['accounting document', 'vendor/customer', 'USSGL/crosswalk', 'amount', 'posting date', 'period'],
    risks: ['Unreconciled AP/AR', 'Unsupported journal', 'Cutoff error']
  },
  {
    id: 'famis-suspense-jv',
    layer: 'base',
    title: 'Suspense / Reject / JV Processing',
    subtitle: 'Manual corrections, unmatched items, close adjustments',
    icon: 'JV',
    tags: ['suspense', 'reject', 'journal voucher', 'manual adjustment'],
    summary: 'Tracks rejected records, unmatched payments or collections, suspense, manual adjustments, accruals, reclasses, reversals, approvals, and clearing status.',
    examples: ['Reject correction', 'Suspense clearing', 'Accrual JV', 'Reversal', 'Reclass'],
    auditQuestions: ['Are suspense items aged and owned?', 'Does every JV have source support?', 'Are reversals tracked?'],
    keyFields: ['reject code', 'suspense account', 'JV number', 'source document', 'approver', 'amount', 'clearing date'],
    risks: ['Aged suspense', 'Unsupported manual adjustment', 'Missing reversal']
  },
  {
    id: 'famis-fund-cite-detail',
    layer: 'detail',
    title: 'Fund Cite / LOA Detail',
    subtitle: 'TAS, fund, fiscal year, org, object class, program',
    icon: 'LOA',
    tags: ['fund cite', 'loa', 'tas', 'classification'],
    summary: 'Preserves the budget and accounting classification attributes needed for GF execution, WCF operations, reporting crosswalks, and audit sampling.',
    examples: ['LOA', 'TAS', 'Object class', 'Organization', 'Program/cost code'],
    auditQuestions: ['Are classification elements complete and valid?', 'Are changes approved?', 'Does the LOA map to the right reporting attributes?'],
    keyFields: ['TAS', 'fund', 'fiscal year', 'organization', 'object class', 'program', 'cost code'],
    risks: ['Misclassification', 'Invalid LOA', 'Reporting crosswalk error']
  },
  {
    id: 'famis-obligation-detail',
    layer: 'detail',
    title: 'Obligation / Expenditure Detail',
    subtitle: 'Commitment, obligation, invoice, payment, liquidation',
    icon: 'OBL',
    tags: ['obligation', 'expenditure', 'ulo', 'payment'],
    summary: 'Maintains GF or WCF obligation, expenditure, payment, liquidation, deobligation, and ULO history at document level.',
    examples: ['Commitment', 'Obligation', 'Invoice', 'Payment', 'Deobligation'],
    auditQuestions: ['Are open obligations valid?', 'Do payments liquidate the right obligation?', 'Are deobligations timely and approved?'],
    keyFields: ['document number', 'PIID', 'fund cite', 'obligated amount', 'liquidated amount', 'open balance', 'age'],
    risks: ['Unsupported ULO', 'Incorrect liquidation', 'Stale obligation']
  },
  {
    id: 'famis-customer-order-detail',
    layer: 'detail',
    title: 'WCF Customer Order / Billing Detail',
    subtitle: 'Order, performance, rate, billing, collection, AR',
    icon: 'BIL',
    tags: ['wcf', 'customer order', 'billing', 'ar'],
    summary: 'Captures WCF customer order authority, performance or delivery, rates, billing, receivable, collection, and trading partner detail.',
    examples: ['Customer order', 'Billing document', 'AR balance', 'Collection', 'Trading partner tie-out'],
    auditQuestions: ['Can billings trace to performance?', 'Are collections applied to correct orders?', 'Are AR balances aged and supportable?'],
    keyFields: ['customer order', 'customer', 'trading partner', 'rate', 'billing document', 'collection', 'AR balance'],
    risks: ['Unsupported billing', 'Collection misapplied', 'AR aging not resolved']
  },
  {
    id: 'famis-cost-inventory-detail',
    layer: 'detail',
    title: 'WCF Cost / Inventory Detail',
    subtitle: 'Cost object, labor, material, inventory, operating result',
    icon: 'CST',
    tags: ['wcf', 'cost', 'inventory', 'operating result'],
    summary: 'Preserves WCF labor, material, overhead, inventory, cost object, rate, and operating-result detail used for cost recovery and statement support.',
    examples: ['Labor cost', 'Material cost', 'Inventory movement', 'Overhead', 'Rate support'],
    auditQuestions: ['Are costs assigned to the right activity?', 'Can inventory value be recalculated?', 'Are rates and operating results supported?'],
    keyFields: ['cost object', 'material', 'labor hours', 'inventory item', 'rate', 'cost element', 'amount'],
    risks: ['Cost misallocation', 'Inventory valuation error', 'Unsupported rate']
  },
  {
    id: 'famis-jv-suspense-detail',
    layer: 'detail',
    title: 'JV / Suspense Detail',
    subtitle: 'Root cause, support, approval, clearing, reversal',
    icon: 'JV',
    tags: ['jv', 'suspense', 'reject', 'reversal'],
    summary: 'Documents suspense, rejects, manual adjustments, root cause, evidence, approval trail, posting impact, clearing, and reversal status.',
    examples: ['Suspense item', 'Correction JV', 'Accrual', 'Reversal', 'Clearing entry'],
    auditQuestions: ['Does every manual entry have source support?', 'Are suspense clearings tied to root cause?', 'Are reversals completed?'],
    keyFields: ['JV number', 'suspense account', 'reject code', 'source document', 'approver', 'amount', 'reversal flag'],
    risks: ['Unsupported adjustment', 'Aged suspense', 'Manual entry masks feeder defect']
  },
  {
    id: 'famis-budgetary-gl',
    layer: 'accounting',
    title: 'Budgetary Accounting',
    subtitle: 'Authority, obligations, expenditures, outlays',
    icon: 'SBR',
    tags: ['budgetary', 'sbr', 'ussgl', 'outlay'],
    summary: 'Classifies GF and applicable WCF budgetary activity for authority, commitments, obligations, delivered orders, expenditures, outlays, recoveries, and ULOs.',
    examples: ['Budget authority', 'Commitment', 'Obligation', 'Delivered order', 'Outlay'],
    auditQuestions: ['Do budgetary balances tie to supported detail?', 'Are ULOs valid?', 'Do outlays tie to disbursing/Treasury evidence?'],
    keyFields: ['TAS', 'fund', 'USSGL/crosswalk', 'document', 'amount', 'period'],
    risks: ['SBR misstatement', 'Unsupported ULO', 'Outlay cutoff error']
  },
  {
    id: 'famis-wcf-costing',
    layer: 'accounting',
    title: 'WCF Costing / Revenue / Inventory',
    subtitle: 'Rates, costs, inventory, AR, revenue, operating result',
    icon: 'WCF',
    tags: ['wcf', 'cost recovery', 'revenue', 'inventory'],
    summary: 'Controls WCF cost accumulation, inventory valuation, rates, customer billing, AR, revenue recognition, collections, operating results, and cost recovery.',
    examples: ['Rate support', 'Inventory value', 'Customer billing', 'Revenue', 'Operating result'],
    auditQuestions: ['Can costs and revenue be traced to customer activity?', 'Are rates supported?', 'Do inventory and AR reconcile?'],
    keyFields: ['cost object', 'rate', 'inventory value', 'billing document', 'AR', 'revenue', 'period'],
    risks: ['Revenue unsupported', 'Inventory valuation error', 'Cost recovery misstated']
  },
  {
    id: 'famis-proprietary-gl',
    layer: 'accounting',
    title: 'Proprietary Accounting',
    subtitle: 'Expense, AP, AR, assets, inventory, FBWT',
    icon: 'GL',
    tags: ['proprietary', 'expense', 'ap', 'ar', 'fbwt'],
    summary: 'Records proprietary impacts for expense, AP, AR, revenue, assets, inventory, FBWT, collections, and other balances needed for statement support.',
    examples: ['Expense', 'AP accrual', 'AR billing', 'Inventory asset', 'FBWT tie-out'],
    auditQuestions: ['Do proprietary balances reconcile to subledger/source detail?', 'Are AP/AR aged and supportable?', 'Does FBWT reconcile?'],
    keyFields: ['USSGL/crosswalk', 'document', 'vendor/customer', 'TAS', 'amount', 'period'],
    risks: ['Budgetary/proprietary mismatch', 'AP/AR weakness', 'FBWT reconciliation break']
  },
  {
    id: 'famis-reconciliation',
    layer: 'accounting',
    title: 'Reconciliation and Treasury Control',
    subtitle: 'Trial balance, reject, suspense, GTAS, IPAC, FBWT',
    icon: 'REC',
    tags: ['reconciliation', 'treasury', 'gtas', 'fbwt'],
    summary: 'Controls trial-balance tie-outs, interface rejects, suspense, Treasury/IPAC, trading partner, GTAS, FBWT, and source-to-reporting reconciliation.',
    examples: ['Trial balance tie-out', 'Reject report', 'FBWT reconciliation', 'GTAS tie-out', 'IPAC reconciliation'],
    auditQuestions: ['Do control totals reconcile?', 'Are rejects and suspense cleared?', 'Are Treasury differences researched and resolved?'],
    keyFields: ['reconciliation ID', 'batch', 'TAS', 'BETC', 'trading partner', 'amount', 'difference'],
    risks: ['Unresolved difference', 'Trading partner mismatch', 'Reject not cleared']
  },
  {
    id: 'famis-execution-reporting',
    layer: 'reporting',
    title: 'GF/WCF Execution Reporting',
    subtitle: 'Status of funds, WCF operations, ULO, AP/AR aging',
    icon: 'RPT',
    tags: ['reporting', 'status of funds', 'wcf', 'ulo'],
    summary: 'Provides status-of-funds, ULO, WCF operating, customer order, billing, AP/AR aging, suspense, and management reports.',
    examples: ['Status of funds', 'ULO report', 'WCF operating report', 'AR aging', 'Suspense aging'],
    auditQuestions: ['Do reports tie to controlled populations?', 'Are as-of dates documented?', 'Are exceptions assigned and resolved?'],
    keyFields: ['report ID', 'as-of date', 'fund', 'customer/order', 'document', 'status', 'amount'],
    risks: ['Report not reproducible', 'Unowned exception', 'Management report not tied to GL/detail']
  },
  {
    id: 'famis-ddrs-gtas',
    layer: 'reporting',
    title: 'Trial Balance / DDRS / GTAS',
    subtitle: 'External reporting, Treasury, USSGL/TAS support',
    icon: 'GTAS',
    tags: ['trial balance', 'ddrs', 'gtas', 'treasury'],
    summary: 'Supports trial balance, DDRS, GTAS, TAS/USSGL crosswalks, Treasury reporting, statement-line mapping, and audit schedules.',
    examples: ['Trial balance', 'DDRS feed', 'GTAS support', 'Treasury tie-out', 'Statement schedule'],
    auditQuestions: ['Do trial balances reconcile to source detail?', 'Are TAS/USSGL attributes complete?', 'Are crosswalks approved and current?'],
    keyFields: ['TAS', 'USSGL', 'fund', 'period', 'amount', 'statement line', 'trading partner'],
    risks: ['Crosswalk error', 'Unsupported reporting amount', 'TAS/USSGL mismatch']
  },
  {
    id: 'famis-audit-package',
    layer: 'reporting',
    title: 'Audit Package / UoT Extract',
    subtitle: 'Samples, schedules, evidence, reconciliation',
    icon: 'AUD',
    tags: ['audit', 'uott', 'evidence', 'reconciliation'],
    summary: 'Assembles source documents, transaction populations, approvals, JVs, suspense research, reconciliations, trial balances, and statement schedules for audit support.',
    examples: ['UoT extract', 'Sample package', 'Reconciliation', 'Statement schedule', 'Approval evidence'],
    auditQuestions: ['Can samples trace from statement to source?', 'Is the UoT complete?', 'Are schedules tied to controlled populations?'],
    keyFields: ['sample ID', 'source document', 'accounting document', 'report line', 'evidence link', 'reconciliation ID'],
    risks: ['Incomplete UoT', 'Evidence unavailable', 'Schedule not tied to source']
  },
  {
    id: 'famis-sbr',
    layer: 'statements',
    title: 'General Fund SBR',
    subtitle: 'Budgetary resources, obligations, expenditures, outlays',
    icon: 'SBR',
    tags: ['sbr', 'general fund', 'budgetary', 'ulo'],
    summary: 'Supports GF Statement of Budgetary Resources assertions for authority, obligations, delivered orders, expenditures, outlays, recoveries, and ULOs.',
    examples: ['Obligation support', 'ULO aging', 'Outlay support', 'Deobligation'],
    auditQuestions: ['Are budgetary amounts complete and valid?', 'Are ULOs supported?', 'Do outlays tie to Treasury/disbursing evidence?'],
    keyFields: ['TAS', 'fund', 'USSGL/crosswalk', 'document', 'obligation amount', 'outlay amount'],
    risks: ['Unsupported ULO', 'Outlay mismatch', 'Budgetary classification error']
  },
  {
    id: 'famis-wcf-statements',
    layer: 'statements',
    title: 'WCF Inventory / Revenue / Net Cost',
    subtitle: 'Cost recovery, inventory, AR, revenue, operating results',
    icon: 'WCF',
    tags: ['wcf', 'inventory', 'revenue', 'net cost'],
    summary: 'Supports WCF statement assertions for inventory, revenue, cost recovery, customer AR, expenses, operating results, and net cost.',
    examples: ['Inventory value', 'Revenue support', 'Cost recovery schedule', 'AR aging', 'Net cost schedule'],
    auditQuestions: ['Can revenue and costs trace to customer activity?', 'Are inventory and AR supportable?', 'Are operating results reconciled?'],
    keyFields: ['customer order', 'inventory value', 'billing document', 'AR', 'revenue', 'cost', 'period'],
    risks: ['Unsupported revenue', 'Inventory valuation weakness', 'AR not collectible/supportable']
  },
  {
    id: 'famis-notes',
    layer: 'statements',
    title: 'Notes / FBWT / AP-AR / Suspense',
    subtitle: 'Disclosure and audit-sensitive balances',
    icon: 'NTE',
    tags: ['notes', 'fbwt', 'ap', 'ar', 'suspense'],
    summary: 'Supports note schedules and audit assertions for FBWT, AP, AR, inventory, WCF operating results, ULOs, suspense, and trading partner activity.',
    examples: ['FBWT note', 'AP/AR aging', 'Suspense schedule', 'Trading partner schedule', 'Inventory note'],
    auditQuestions: ['Are note schedules tied to controlled populations?', 'Are suspense and AP/AR aged and owned?', 'Do Treasury and trading partner balances reconcile?'],
    keyFields: ['schedule ID', 'TAS', 'trading partner', 'suspense account', 'AP/AR', 'amount', 'owner'],
    risks: ['Unsupported note schedule', 'Aged suspense', 'FBWT/trading partner mismatch']
  }
];

const famisLineageScenarios = [
  {
    id: 'famis-gf-budget-to-sbr',
    short: 'FAMIS-GF',
    title: 'FAMIS-GF Funding to Obligation and SBR',
    description: 'Traces general fund authority through budget execution, obligation detail, budgetary accounting, trial balance, and SBR support.',
    path: ['famis-gf-funding-source', 'famis-gf-core', 'famis-fund-cite-detail', 'famis-obligation-detail', 'famis-budgetary-gl', 'famis-sbr'],
    steps: [
      'General fund authority, allotment, and LOA data establish available resources.',
      'FAMIS-GF records commitments, obligations, expenditures, outlays, and status-of-funds updates.',
      'Fund cite and obligation detail preserve the transaction population and open-balance history.',
      'Budgetary accounting classifies authority, obligations, delivered orders, expenditures, and outlays.',
      'SBR support traces reported budgetary resources and ULO balances back to source detail.'
    ],
    exceptionTests: ['invalid LOA', 'obligation exceeds authority', 'stale ULO', 'outlay not tied to disbursing', 'SBR amount lacks detail']
  },
  {
    id: 'famis-wcf-cost-recovery',
    short: 'FAMIS-WCF',
    title: 'FAMIS-WCF Customer Order to Cost Recovery and Statements',
    description: 'Shows WCF customer order, cost, inventory, billing, collection, AR/revenue, and net cost or WCF statement support.',
    path: ['famis-wcf-operations-source', 'famis-wcf-core', 'famis-customer-order-detail', 'famis-cost-inventory-detail', 'famis-wcf-costing', 'famis-wcf-statements'],
    steps: [
      'A WCF customer order or operating requirement establishes reimbursable or buyer/seller authority.',
      'FAMIS-WCF tracks costs, inventory or service delivery, billing, AR, collections, and operating results.',
      'Customer order and cost detail preserve delivery, rate, billing, and collection support.',
      'WCF costing/revenue controls reconcile rates, cost recovery, inventory, AR, and revenue.',
      'Statement support ties WCF inventory, revenue, net cost, and operating results to source detail.'
    ],
    exceptionTests: ['customer order lacks authority', 'billing not tied to performance', 'unsupported rate', 'AR not collected or aged', 'inventory valuation mismatch']
  },
  {
    id: 'famis-procure-to-pay',
    short: 'procure to pay',
    title: 'Procure-to-Pay to AP, GL, and Reporting',
    description: 'Connects awards, receipts, invoices, payments, AP/accruals, liquidation, GL, and DDRS/GTAS support.',
    path: ['famis-p2p-source', 'famis-ap-ar-gl', 'famis-obligation-detail', 'famis-proprietary-gl', 'famis-ddrs-gtas', 'famis-notes'],
    steps: [
      'A procurement need becomes an award, receipt, acceptance, invoice, and payment support trail.',
      'FAMIS AP/AR/GL processing records invoice, accrual, liquidation, payment, expense, and GL effects.',
      'Obligation/expenditure detail ties payment activity to source obligations and liquidation history.',
      'Proprietary accounting supports AP, expense, FBWT, and related balances.',
      'DDRS/GTAS and note schedules reconcile reported balances to source transactions.'
    ],
    exceptionTests: ['invoice without receipt', 'duplicate payment', 'unrecorded accrual', 'obligation not liquidated', 'AP schedule not tied to detail']
  },
  {
    id: 'famis-suspense-close',
    short: 'close',
    title: 'Suspense, JV, and Treasury Close to Audit Package',
    description: 'Traces rejected or unmatched activity through suspense/JV controls, Treasury reconciliation, reporting, and audit evidence.',
    path: ['famis-treasury-igt-source', 'famis-suspense-jv', 'famis-jv-suspense-detail', 'famis-reconciliation', 'famis-audit-package', 'famis-notes'],
    steps: [
      'A Treasury, disbursing, IGT, interface, or close exception creates a reject, suspense item, or proposed JV.',
      'FAMIS suspense/JV processing tracks root cause, owner, support, approval, posting, clearing, and reversal status.',
      'JV/suspense detail preserves evidence for manual entries and exception clearing.',
      'Reconciliations tie trial balance, FBWT, IPAC, GTAS, and source detail together.',
      'Audit and note packages preserve the exception, correction, and reporting impact.'
    ],
    exceptionTests: ['aged suspense', 'JV lacks source support', 'FBWT difference unresolved', 'trading partner mismatch', 'manual entry masks feeder defect']
  }
];

const famisSupportServices = [
  { title: 'FAMIS-GF Controls', detail: 'Budget authority, LOA validation, availability, commitments, obligations, deobligations, ULO review, expenditures, outlays, and SBR support.' },
  { title: 'FAMIS-WCF Controls', detail: 'Customer orders, rates, inventory/service delivery, cost allocation, billing, AR, revenue, collections, operating results, and WCF statement support.' },
  { title: 'AP / AR / GL Close', detail: 'Invoice, receipt, acceptance, AP, AR, expense, revenue, accrual, reversal, GL journal, close package, and subledger reconciliation controls.' },
  { title: 'Treasury and IGT Reconciliation', detail: 'FBWT, TAS/BETC, IPAC, G-Invoicing, trading partner, disbursing, collections, GTAS, and Treasury difference research.' },
  { title: 'Suspense and JV Governance', detail: 'Reject queues, unmatched items, suspense aging, manual adjustment support, approvals, reversals, clearing evidence, and root-cause tracking.' },
  { title: 'Audit Evidence', detail: 'Universe of Transactions extracts, source documents, customer orders, invoices, payments, billing, collections, reconciliations, trial balances, and statement schedules.' }
];

const famisCaveats = [
  'Public FAMIS-GF and FAMIS-WCF technical documentation is limited. This blueprint models FAMIS as a legacy/core accounting and reporting family and does not claim SAP, Oracle, or a specific platform.',
  'Exact FAMIS variants, owners, interfaces, file layouts, hosting, retirement or modernization status, and system-of-record boundaries require authoritative agency, DFAS, or DoD documentation.',
  'The page intentionally separates FAMIS-GF and FAMIS-WCF because general fund budget execution and working capital fund cost recovery have different audit risks and statement assertions.',
  'Feeder counts are modeled source/partner categories represented in this blueprint, not a certified production interface inventory.'
];

const famisSources = [
  { name: 'DoD Financial Management Regulation', url: 'https://comptroller.defense.gov/FMR/' },
  { name: 'Treasury GTAS', url: 'https://fiscal.treasury.gov/accounting/government-wide-treasury-account-symbol-gtas' },
  { name: 'Treasury USSGL', url: 'https://fiscal.treasury.gov/accounting/us-standard-general-ledger-ussgl' },
  { name: 'Treasury G-Invoicing / IPAC', url: 'https://fiscal.treasury.gov/accounting/intragov' },
  { name: 'Procurement Integrated Enterprise Environment', url: 'https://piee.eb.mil/' }
];

const ddrsLayers = [
  { id: 'source', label: 'Component Trial Balance Sources', short: 'Source', description: 'ERP, legacy accounting, WCF, general fund, Treasury, GTAS, and audit-support sources that feed DoD financial reporting.' },
  { id: 'base', label: 'DDRS Processing', short: 'DDRS', description: 'Trial-balance intake, validation, crosswalk, consolidation, eliminations, adjustments, statement generation, and note support.' },
  { id: 'detail', label: 'Reporting Detail', short: 'Detail', description: 'Entity, TAS, USSGL, trading partner, statement line, adjustment, elimination, schedule, and evidence detail.' },
  { id: 'accounting', label: 'Validation and Reconciliation', short: 'Control', description: 'USSGL/TAS edits, GTAS tie-outs, IGT elimination controls, top-side adjustment controls, and audit reconciliations.' },
  { id: 'reporting', label: 'Reporting Outputs', short: 'Outputs', description: 'Component and consolidated reports, AFR/PAR statements, notes, variance analysis, audit schedules, and submission packages.' },
  { id: 'statements', label: 'Financial Statements and Notes', short: 'Statements', description: 'SBR, SNC, balance sheet, changes in net position, custodial/activity schedules, notes, and disclosure assertions.' }
];

const ddrsNodes = [
  {
    id: 'ddrs-component-erp-source',
    layer: 'source',
    title: 'Component ERP Trial Balances',
    subtitle: 'GFEBS, Navy ERP, DAI, DEAMS, EBS, LMP',
    icon: 'ERP',
    tags: ['erp', 'trial balance', 'source', 'component'],
    summary: 'Receives component trial balance and reporting extracts from major accounting systems for general fund, working capital, supply-chain, and agency reporting.',
    examples: ['GFEBS trial balance', 'Navy ERP extract', 'DAI trial balance', 'DEAMS reporting extract'],
    auditQuestions: ['Do DDRS totals reconcile to source-system trial balances?', 'Are source extracts complete by period and entity?', 'Are re-submissions controlled?'],
    keyFields: ['entity', 'period', 'TAS', 'USSGL', 'fund', 'amount', 'source batch'],
    risks: ['Source-to-DDRS mismatch', 'Incomplete extract', 'Uncontrolled re-submission']
  },
  {
    id: 'ddrs-legacy-source',
    layer: 'source',
    title: 'Legacy Accounting Sources',
    subtitle: 'GAFS, STARS, SABRS, FAMIS, other legacy feeds',
    icon: 'LEG',
    tags: ['legacy', 'trial balance', 'archive', 'migration'],
    summary: 'Represents legacy or transition accounting sources whose balances, archive extracts, or reporting feeds still support component or consolidated reporting.',
    examples: ['GAFS extract', 'STARS archive balance', 'SABRS feed', 'FAMIS-GF/WCF data'],
    auditQuestions: ['Can legacy balances trace to archive detail?', 'Are conversion or bridge adjustments approved?', 'Are legacy feeds reconciled to current reporting?'],
    keyFields: ['legacy system', 'entity', 'fund', 'USSGL/crosswalk', 'period', 'amount', 'bridge batch'],
    risks: ['Legacy balance unsupported', 'Archive incomplete', 'Bridge adjustment not explained']
  },
  {
    id: 'ddrs-treasury-source',
    layer: 'source',
    title: 'Treasury / GTAS / IGT Sources',
    subtitle: 'GTAS, TAS, BETC, IPAC, trading partner data',
    icon: 'TRS',
    tags: ['treasury', 'gtas', 'ipac', 'trading partner'],
    summary: 'Provides Treasury reporting, TAS/BETC, GTAS edits, IPAC/G-Invoicing, and trading-partner data used for tie-outs and eliminations.',
    examples: ['GTAS submission', 'TAS/BETC attributes', 'IPAC settlement', 'Trading partner difference'],
    auditQuestions: ['Do DDRS values agree with GTAS where required?', 'Are TAS and trading partner attributes complete?', 'Are IGT differences explained?'],
    keyFields: ['TAS', 'BETC', 'USSGL', 'trading partner', 'GTAS amount', 'IPAC document', 'period'],
    risks: ['GTAS mismatch', 'Trading partner mismatch', 'Invalid TAS/USSGL attribute']
  },
  {
    id: 'ddrs-audit-evidence-source',
    layer: 'source',
    title: 'Audit and Component Support',
    subtitle: 'Tie-outs, schedules, assertions, sample packages',
    icon: 'AUD',
    tags: ['audit', 'evidence', 'schedule', 'assertions'],
    summary: 'Captures the supporting reconciliations, schedules, explanations, and sample packages used to support DDRS-reported balances and disclosures.',
    examples: ['Tie-out workbook', 'Note support', 'Variance explanation', 'Sample package'],
    auditQuestions: ['Can statement amounts trace to controlled support?', 'Are schedules tied to trial balance populations?', 'Are explanations approved and retained?'],
    keyFields: ['schedule ID', 'statement line', 'entity', 'source document', 'evidence link', 'reviewer', 'amount'],
    risks: ['Schedule not tied to TB', 'Evidence unavailable', 'Unapproved variance explanation']
  },
  {
    id: 'ddrs-tb-intake',
    layer: 'base',
    title: 'Trial Balance Intake',
    subtitle: 'Entity, TAS, USSGL, period, amount ingestion',
    icon: 'TB',
    tags: ['intake', 'trial balance', 'submission', 'batch'],
    summary: 'Loads and tracks component trial balance submissions, source batches, versions, periods, entities, TAS, USSGL, attributes, and amounts.',
    examples: ['Monthly TB load', 'Year-end submission', 'Re-submission', 'Batch validation'],
    auditQuestions: ['Are all required entities and periods loaded?', 'Are versions controlled?', 'Do batch totals reconcile to source systems?'],
    keyFields: ['load batch', 'entity', 'period', 'TAS', 'USSGL', 'amount', 'version'],
    risks: ['Missing entity submission', 'Version confusion', 'Batch total mismatch']
  },
  {
    id: 'ddrs-edits-crosswalk',
    layer: 'base',
    title: 'Edits and Crosswalks',
    subtitle: 'USSGL, TAS, attributes, statement lines',
    icon: 'EDT',
    tags: ['edits', 'crosswalk', 'ussgl', 'tas'],
    summary: 'Applies edit checks, USSGL/TAS validation, attribute checks, statement-line mapping, fund type logic, and reporting crosswalks.',
    examples: ['USSGL edit', 'TAS validation', 'Statement crosswalk', 'Attribute check'],
    auditQuestions: ['Are crosswalks current and approved?', 'Are failed edits resolved?', 'Do mappings align with USSGL and reporting requirements?'],
    keyFields: ['USSGL', 'TAS', 'attribute', 'statement line', 'edit code', 'crosswalk version', 'amount'],
    risks: ['Crosswalk error', 'Failed edit bypassed', 'Invalid attribute mapping']
  },
  {
    id: 'ddrs-consolidation',
    layer: 'base',
    title: 'Consolidation and Rollup',
    subtitle: 'Component, appropriation, fund type, DoD rollup',
    icon: 'CON',
    tags: ['consolidation', 'rollup', 'component', 'dod'],
    summary: 'Aggregates component submissions by entity, fund, TAS, USSGL, statement line, component, and consolidated DoD reporting structure.',
    examples: ['Component rollup', 'Fund-type rollup', 'DoD consolidated view', 'Statement-line total'],
    auditQuestions: ['Do rollups reconcile to component inputs?', 'Are consolidation hierarchies approved?', 'Are reclassifications separately visible?'],
    keyFields: ['entity', 'component', 'fund type', 'statement line', 'USSGL', 'period', 'amount'],
    risks: ['Rollup hierarchy error', 'Component total not reconcilable', 'Reclass hidden in summary']
  },
  {
    id: 'ddrs-eliminations',
    layer: 'base',
    title: 'Eliminations and IGT',
    subtitle: 'Trading partner, buyer/seller, intragovernmental differences',
    icon: 'ELM',
    tags: ['elimination', 'igt', 'trading partner', 'buyer seller'],
    summary: 'Identifies, pairs, eliminates, or explains intragovernmental and trading partner activity for consolidated reporting.',
    examples: ['Buyer/seller pair', 'IGT elimination', 'Trading partner difference', 'IPAC tie-out'],
    auditQuestions: ['Are trading partner attributes complete?', 'Do buyer and seller amounts agree?', 'Are unresolved differences explained and aged?'],
    keyFields: ['trading partner', 'buyer TAS', 'seller TAS', 'USSGL', 'elimination amount', 'difference', 'period'],
    risks: ['Elimination mismatch', 'Missing trading partner', 'Unexplained IGT difference']
  },
  {
    id: 'ddrs-adjustments',
    layer: 'base',
    title: 'Top-side Adjustments',
    subtitle: 'Manual reporting adjustments, reclasses, accruals',
    icon: 'JV',
    tags: ['adjustment', 'journal', 'top-side', 'reclass'],
    summary: 'Controls top-side reporting adjustments, manual entries, reclasses, accruals, reversals, explanations, approvals, and statement impact.',
    examples: ['Top-side JV', 'Reclass', 'Accrual adjustment', 'Elimination adjustment'],
    auditQuestions: ['Does every adjustment have source support?', 'Are approvals complete before reporting?', 'Are reversals and recurring entries tracked?'],
    keyFields: ['adjustment ID', 'entity', 'USSGL', 'statement line', 'debit/credit', 'approver', 'reversal flag'],
    risks: ['Unsupported top-side entry', 'Manual entry masks source defect', 'Missing reversal']
  },
  {
    id: 'ddrs-tb-line-detail',
    layer: 'detail',
    title: 'Trial Balance Line Detail',
    subtitle: 'Entity, TAS, USSGL, attributes, amount',
    icon: 'LIN',
    tags: ['trial balance', 'detail', 'ussgl', 'tas'],
    summary: 'Preserves line-level reporting detail used to trace statement amounts back to component submissions and source-system trial balances.',
    examples: ['Entity/TAS/USSGL line', 'Attribute line', 'Period balance', 'Source-batch tie-out'],
    auditQuestions: ['Can statement lines be reconstructed from TB detail?', 'Are debit/credit signs consistent?', 'Do attributes support GTAS/reporting requirements?'],
    keyFields: ['entity', 'TAS', 'USSGL', 'attribute', 'beginning balance', 'activity', 'ending balance'],
    risks: ['Statement amount not reconstructable', 'Sign error', 'Missing attribute']
  },
  {
    id: 'ddrs-adjustment-detail',
    layer: 'detail',
    title: 'Adjustment Detail',
    subtitle: 'Support, approval, impact, reversal',
    icon: 'ADJ',
    tags: ['adjustment', 'support', 'approval', 'reversal'],
    summary: 'Documents top-side entries, source rationale, supporting calculations, preparer/reviewer/approver evidence, posting impact, and reversal status.',
    examples: ['Adjustment support', 'Approval package', 'Recurring entry', 'Reversal tracking'],
    auditQuestions: ['Is the adjustment supported by source detail?', 'Is segregation of duties clear?', 'Does the adjustment tie to statement impact?'],
    keyFields: ['adjustment ID', 'support file', 'preparer', 'reviewer', 'approver', 'amount', 'statement line'],
    risks: ['Unsupported adjustment', 'Approval weakness', 'Statement impact unclear']
  },
  {
    id: 'ddrs-igt-detail',
    layer: 'detail',
    title: 'IGT / Elimination Detail',
    subtitle: 'Trading partner pairs and differences',
    icon: 'IGT',
    tags: ['igt', 'elimination', 'trading partner', 'difference'],
    summary: 'Captures buyer/seller, trading partner, TAS, USSGL, elimination, and unresolved difference detail for intragovernmental reporting.',
    examples: ['Trading partner pair', 'Difference aging', 'IPAC reference', 'Elimination support'],
    auditQuestions: ['Can elimination entries trace to both sides?', 'Are differences aged and assigned?', 'Are trading partner attributes valid?'],
    keyFields: ['buyer entity', 'seller entity', 'trading partner', 'TAS', 'USSGL', 'difference', 'owner'],
    risks: ['One-sided elimination', 'Aged IGT difference', 'Invalid trading partner']
  },
  {
    id: 'ddrs-note-detail',
    layer: 'detail',
    title: 'Note and Schedule Detail',
    subtitle: 'Disclosure tables, narratives, variance explanations',
    icon: 'NTE',
    tags: ['notes', 'schedule', 'disclosure', 'variance'],
    summary: 'Maintains disclosure schedules, narrative explanations, variance analysis, note tables, and supporting reconciliations.',
    examples: ['Note schedule', 'Variance explanation', 'Disclosure table', 'Supporting reconciliation'],
    auditQuestions: ['Are note schedules tied to controlled TB populations?', 'Are variances explained and reviewed?', 'Do narratives align to reported values?'],
    keyFields: ['note ID', 'schedule line', 'entity', 'statement line', 'amount', 'variance', 'reviewer'],
    risks: ['Unsupported disclosure', 'Variance explanation not approved', 'Schedule not tied to TB']
  },
  {
    id: 'ddrs-ussgl-tas-control',
    layer: 'accounting',
    title: 'USSGL / TAS Validation',
    subtitle: 'Account, fund, attribute, balance edit controls',
    icon: 'VAL',
    tags: ['ussgl', 'tas', 'validation', 'edit'],
    summary: 'Validates USSGL accounts, TAS attributes, normal balances, required attributes, budgetary/proprietary relationships, and reporting edit rules.',
    examples: ['USSGL validity check', 'TAS edit', 'Attribute requirement', 'Budgetary/proprietary edit'],
    auditQuestions: ['Are failed edits researched and cleared?', 'Are overrides approved?', 'Do validations align to current USSGL/Treasury rules?'],
    keyFields: ['edit code', 'TAS', 'USSGL', 'attribute', 'error type', 'owner', 'resolution'],
    risks: ['Invalid reporting combination', 'Unapproved override', 'Edit not resolved']
  },
  {
    id: 'ddrs-gtas-control',
    layer: 'accounting',
    title: 'GTAS and Treasury Tie-Out',
    subtitle: 'GTAS edit checks, TAS/USSGL, submission support',
    icon: 'GTA',
    tags: ['gtas', 'treasury', 'tas', 'ussgl'],
    summary: 'Reconciles DDRS-reported values to GTAS/Treasury submission requirements, edit checks, TAS/USSGL attributes, and period reporting.',
    examples: ['GTAS tie-out', 'Fatal edit resolution', 'TAS attribute check', 'Treasury confirmation'],
    auditQuestions: ['Do DDRS and GTAS values agree where expected?', 'Are fatal edits cleared?', 'Are differences explained and retained?'],
    keyFields: ['TAS', 'USSGL', 'GTAS line', 'DDRS amount', 'GTAS amount', 'difference', 'period'],
    risks: ['DDRS/GTAS mismatch', 'Fatal edit unresolved', 'Treasury difference unsupported']
  },
  {
    id: 'ddrs-elimination-control',
    layer: 'accounting',
    title: 'Elimination Control',
    subtitle: 'IGT pairing, differences, approval, disclosure',
    icon: 'REC',
    tags: ['elimination', 'igt', 'reconciliation', 'control'],
    summary: 'Controls intragovernmental elimination entries, buyer/seller matching, difference research, approval, aging, and disclosure support.',
    examples: ['Elimination journal', 'IGT difference report', 'Buyer/seller reconciliation', 'Difference certification'],
    auditQuestions: ['Are eliminations complete and accurate?', 'Are unresolved differences justified?', 'Do entries avoid eliminating non-IGT activity?'],
    keyFields: ['elimination ID', 'trading partner', 'buyer amount', 'seller amount', 'difference', 'approver', 'period'],
    risks: ['Over-elimination', 'Under-elimination', 'Unexplained IGT difference']
  },
  {
    id: 'ddrs-audit-reconciliation',
    layer: 'accounting',
    title: 'Audit Reconciliation',
    subtitle: 'Statement-to-source tie-out and sample support',
    icon: 'AUD',
    tags: ['audit', 'reconciliation', 'tie-out', 'sample'],
    summary: 'Connects statement lines, note schedules, trial balance detail, adjustments, eliminations, component support, and source-system evidence.',
    examples: ['Statement tie-out', 'Sample support', 'Component certification', 'Variance package'],
    auditQuestions: ['Can reported amounts trace to source populations?', 'Are reconciling items owned and resolved?', 'Are support packages complete?'],
    keyFields: ['statement line', 'TB line', 'adjustment ID', 'source system', 'evidence link', 'owner', 'amount'],
    risks: ['Statement amount unsupported', 'Reconciling item unresolved', 'Evidence gap']
  },
  {
    id: 'ddrs-component-reporting',
    layer: 'reporting',
    title: 'Component and DoD Reports',
    subtitle: 'Component, fund, statement, consolidated outputs',
    icon: 'RPT',
    tags: ['reports', 'component', 'consolidated', 'dod'],
    summary: 'Produces component and consolidated reporting outputs by entity, component, fund, statement line, period, and reporting package.',
    examples: ['Component statement report', 'DoD consolidated report', 'Fund report', 'Roll-forward report'],
    auditQuestions: ['Do reports tie to loaded TB and adjustments?', 'Are report parameters documented?', 'Can reports be reproduced?'],
    keyFields: ['report ID', 'entity', 'period', 'statement line', 'fund', 'amount', 'run date'],
    risks: ['Report not reproducible', 'Parameter ambiguity', 'Output not tied to TB']
  },
  {
    id: 'ddrs-afr-par-output',
    layer: 'reporting',
    title: 'AFR / PAR Statements and Notes',
    subtitle: 'Financial statements, note packages, variance analysis',
    icon: 'AFR',
    tags: ['afr', 'par', 'statements', 'notes'],
    summary: 'Supports Agency Financial Report or Performance and Accountability Report statements, notes, schedules, variance analysis, and leadership review packages.',
    examples: ['AFR statement', 'Note package', 'Variance analysis', 'Certification package'],
    auditQuestions: ['Do published statements tie to DDRS outputs?', 'Are notes supported by controlled schedules?', 'Are changes after review tracked?'],
    keyFields: ['AFR/PAR line', 'note ID', 'statement line', 'period', 'amount', 'review status', 'version'],
    risks: ['Published amount not tied out', 'Note support weak', 'Late change not controlled']
  },
  {
    id: 'ddrs-sbr',
    layer: 'statements',
    title: 'Statement of Budgetary Resources',
    subtitle: 'Resources, obligations, expenditures, outlays',
    icon: 'SBR',
    tags: ['sbr', 'budgetary', 'obligation', 'outlay'],
    summary: 'Supports budgetary reporting assertions for resources, obligations, delivered orders, expenditures, outlays, recoveries, and ULO disclosures.',
    examples: ['Budgetary resources', 'Obligations', 'Outlays', 'ULO note'],
    auditQuestions: ['Do SBR lines tie to budgetary USSGL detail?', 'Are ULOs supported by components?', 'Are outlays reconciled to Treasury?'],
    keyFields: ['TAS', 'USSGL', 'statement line', 'budgetary amount', 'component', 'period'],
    risks: ['SBR crosswalk error', 'Unsupported ULO', 'Outlay/Treasury mismatch']
  },
  {
    id: 'ddrs-net-cost',
    layer: 'statements',
    title: 'Statement of Net Cost',
    subtitle: 'Program cost, earned revenue, net cost',
    icon: 'SNC',
    tags: ['net cost', 'program cost', 'revenue', 'expense'],
    summary: 'Supports net cost reporting for gross cost, earned revenue, program costs, working-capital activity, and related disclosures.',
    examples: ['Gross cost', 'Earned revenue', 'Program cost', 'Net cost note'],
    auditQuestions: ['Do cost and revenue lines trace to proprietary GL detail?', 'Are eliminations applied correctly?', 'Are program mappings governed?'],
    keyFields: ['USSGL', 'program', 'statement line', 'cost amount', 'revenue amount', 'period'],
    risks: ['Program mapping error', 'Revenue/cost elimination issue', 'Unsupported expense']
  },
  {
    id: 'ddrs-balance-sheet',
    layer: 'statements',
    title: 'Balance Sheet and CNP',
    subtitle: 'Assets, liabilities, net position, changes',
    icon: 'BS',
    tags: ['balance sheet', 'net position', 'assets', 'liabilities'],
    summary: 'Supports balance sheet and changes in net position reporting for assets, liabilities, net position, financing sources, and related note disclosures.',
    examples: ['FBWT', 'Inventory', 'AP/AR', 'Net position', 'CNP line'],
    auditQuestions: ['Do balances tie to proprietary USSGL detail?', 'Are FBWT and Treasury tie-outs complete?', 'Are AP/AR/inventory support schedules controlled?'],
    keyFields: ['USSGL', 'statement line', 'asset/liability type', 'component', 'amount', 'period'],
    risks: ['FBWT mismatch', 'AP/AR support weakness', 'Balance-sheet classification error']
  },
  {
    id: 'ddrs-notes',
    layer: 'statements',
    title: 'Notes and Disclosures',
    subtitle: 'Schedules, narratives, variance and audit support',
    icon: 'NTE',
    tags: ['notes', 'disclosures', 'variance', 'schedules'],
    summary: 'Supports note disclosures, schedule tables, narrative explanations, variance analysis, reconciliations, and audit-support references.',
    examples: ['FBWT note', 'Inventory note', 'IGT note', 'Variance schedule', 'Disclosure narrative'],
    auditQuestions: ['Are notes tied to statement lines and TB detail?', 'Are variances explained and approved?', 'Are disclosure schedules complete?'],
    keyFields: ['note ID', 'schedule line', 'statement line', 'amount', 'variance', 'support link', 'review status'],
    risks: ['Disclosure unsupported', 'Variance explanation weak', 'Schedule not tied to TB']
  }
];

const ddrsLineageScenarios = [
  {
    id: 'ddrs-component-tb-to-statement',
    short: 'TB to statement',
    title: 'Component Trial Balance to Statement Line',
    description: 'Traces component trial balance data through DDRS intake, edits, rollup, statement-line mapping, and AFR/PAR output.',
    path: ['ddrs-component-erp-source', 'ddrs-tb-intake', 'ddrs-tb-line-detail', 'ddrs-edits-crosswalk', 'ddrs-component-reporting', 'ddrs-balance-sheet'],
    steps: [
      'A component submits trial balance detail from ERP or accounting-system source extracts.',
      'DDRS loads the trial balance by entity, period, TAS, USSGL, attribute, and amount.',
      'Line detail preserves the reporting population used to reconstruct statement lines.',
      'Edits and crosswalks validate TAS/USSGL attributes and map balances to statement lines.',
      'Component or consolidated reports support AFR/PAR statement amounts and audit tie-outs.'
    ],
    exceptionTests: ['source total mismatch', 'missing TAS/USSGL attribute', 'crosswalk error', 'report output not reproducible', 'statement line lacks TB support']
  },
  {
    id: 'ddrs-gtas-tieout',
    short: 'GTAS',
    title: 'DDRS Trial Balance to GTAS/Treasury Tie-Out',
    description: 'Shows how DDRS values are reconciled to GTAS/Treasury reporting requirements and edit checks.',
    path: ['ddrs-treasury-source', 'ddrs-edits-crosswalk', 'ddrs-ussgl-tas-control', 'ddrs-gtas-control', 'ddrs-afr-par-output', 'ddrs-sbr'],
    steps: [
      'Treasury/GTAS attributes and component trial-balance values establish the reporting comparison point.',
      'DDRS edit and crosswalk logic validates USSGL, TAS, and attribute completeness.',
      'USSGL/TAS controls identify invalid combinations, required attributes, and normal-balance issues.',
      'GTAS tie-outs compare DDRS and Treasury-reporting values and document differences.',
      'SBR and other statements retain the GTAS/Treasury reconciliation support.'
    ],
    exceptionTests: ['GTAS fatal edit', 'TAS/USSGL mismatch', 'DDRS/GTAS difference unexplained', 'attribute missing', 'outlay/Treasury mismatch']
  },
  {
    id: 'ddrs-igt-elimination',
    short: 'IGT',
    title: 'Intragovernmental Elimination to Consolidated Statements',
    description: 'Traces IGT/trading partner data through elimination pairing, difference research, controls, and statement-note disclosure.',
    path: ['ddrs-treasury-source', 'ddrs-eliminations', 'ddrs-igt-detail', 'ddrs-elimination-control', 'ddrs-afr-par-output', 'ddrs-notes'],
    steps: [
      'Trading partner, IPAC, G-Invoicing, and TAS/USSGL attributes identify intragovernmental activity.',
      'DDRS elimination processing pairs buyer and seller activity and identifies differences.',
      'IGT detail preserves trading partner, amount, difference, owner, and period support.',
      'Elimination controls approve entries and retain explanations for unresolved differences.',
      'Notes and consolidated statements disclose or support remaining IGT balances.'
    ],
    exceptionTests: ['missing trading partner', 'buyer/seller mismatch', 'one-sided elimination', 'difference not aged', 'disclosure not tied to elimination detail']
  },
  {
    id: 'ddrs-adjustment-audit',
    short: 'adjustment',
    title: 'Top-side Adjustment to Audit Support',
    description: 'Shows how DDRS reporting adjustments should preserve source cause, approval, statement impact, and audit evidence.',
    path: ['ddrs-audit-evidence-source', 'ddrs-adjustments', 'ddrs-adjustment-detail', 'ddrs-audit-reconciliation', 'ddrs-afr-par-output', 'ddrs-notes'],
    steps: [
      'A component or consolidated reporting difference creates a proposed top-side adjustment.',
      'DDRS adjustment processing records statement line, USSGL, debit/credit, rationale, and reversal needs.',
      'Adjustment detail preserves support, approval, impact, and version control.',
      'Audit reconciliation ties the adjustment to source evidence, trial balance impact, and statement output.',
      'AFR/PAR notes retain the narrative, schedule, and support for the adjustment impact.'
    ],
    exceptionTests: ['adjustment lacks source support', 'approval after reporting', 'reversal missing', 'statement impact unclear', 'manual entry masks source-system defect']
  }
];

const ddrsSupportServices = [
  { title: 'Trial Balance Governance', detail: 'Component submission calendars, load batches, version control, entity coverage, source-system tie-outs, and period-end re-submission control.' },
  { title: 'Edit and Crosswalk Controls', detail: 'USSGL, TAS, reporting attributes, normal balances, statement-line mapping, GTAS edits, crosswalk versioning, and override approvals.' },
  { title: 'Eliminations and IGT', detail: 'Trading partner validation, buyer/seller pairing, IPAC/G-Invoicing tie-outs, elimination entries, difference aging, and disclosure support.' },
  { title: 'Adjustment Governance', detail: 'Top-side adjustment rationale, support files, preparer/reviewer/approver trail, debit/credit validation, versioning, reversal, and close impact.' },
  { title: 'Statement and Note Production', detail: 'AFR/PAR statements, note schedules, variance explanations, report reproducibility, leadership review, and publication tie-outs.' },
  { title: 'Audit Evidence', detail: 'Statement-to-source reconciliations, trial balance populations, adjustment packages, component certifications, sample support, and evidence retention.' }
];

const ddrsCaveats = [
  'DDRS is modeled here as the Defense Departmental Reporting System for financial reporting, not the similarly named Defense Readiness Reporting System.',
  'Public DDRS module and interface details are limited. Exact DDRS variants, file layouts, workflow names, owners, and current modernization state require authoritative DoD reporting documentation.',
  'This blueprint focuses on the auditable reporting process: trial balance intake, USSGL/TAS validation, GTAS tie-out, eliminations, top-side adjustments, statements, notes, and audit support.',
  'Feeder counts are modeled source/partner categories represented in this blueprint, not a certified production interface inventory.'
];

const ddrsSources = [
  { name: 'DoD Financial Management Regulation', url: 'https://comptroller.defense.gov/FMR/' },
  { name: 'Treasury GTAS', url: 'https://fiscal.treasury.gov/accounting/government-wide-treasury-account-symbol-gtas' },
  { name: 'Treasury USSGL', url: 'https://fiscal.treasury.gov/accounting/us-standard-general-ledger-ussgl' },
  { name: 'Treasury G-Invoicing / IPAC', url: 'https://fiscal.treasury.gov/accounting/intragov' }
];

const gtasCarsLayers = [
  { id: 'source', label: 'Agency and Treasury Source Events', short: 'Source', description: 'Agency ATB, DDRS, ERP, payment, collection, disbursing, IPAC, FBWT, and General Fund events that feed Treasury reporting.' },
  { id: 'base', label: 'GTAS and CARS Core Processing', short: 'GTAS/CARS', description: 'GTAS adjusted trial-balance submission and edit processing plus CARS central accounting and TAS-BETC transaction reporting.' },
  { id: 'detail', label: 'Treasury Reporting Detail', short: 'Detail', description: 'ATB line, TAS/USSGL, domain attributes, TAS-BETC, ALC, payment/collection, FBWT, IPAC, IGT, and certification detail.' },
  { id: 'accounting', label: 'Validation and Reconciliation', short: 'Control', description: 'GTAS fatal/edit checks, USSGL validation, CARS classification, FBWT reconciliation, TAS-BETC tie-outs, certification, and audit control.' },
  { id: 'reporting', label: 'Treasury Outputs', short: 'Outputs', description: 'Fiscal Service accounting data, GTAS status, MTS, Combined Statement, Financial Report support, Fiscal Data, and agency feedback outputs.' },
  { id: 'statements', label: 'Governmentwide Reports', short: 'Reports', description: 'Monthly Treasury Statement, Combined Statement, Financial Report of the U.S. Government, FBWT support, and agency reporting evidence.' }
];

const gtasCarsNodes = [
  {
    id: 'gtas-agency-atb-source',
    layer: 'source',
    title: 'Agency Adjusted Trial Balance',
    subtitle: 'TAS, USSGL, attributes, budget execution',
    icon: 'ATB',
    tags: ['gtas', 'adjusted trial balance', 'agency', 'ussgl'],
    summary: 'Agencies submit adjusted trial balance data with TAS, USSGL, proprietary and budgetary attributes, and budget-execution information through GTAS.',
    examples: ['monthly ATB', 'year-end ATB', 'proprietary balances', 'budgetary execution'],
    auditQuestions: ['Does the ATB tie to the agency GL or DDRS output?', 'Are TAS/USSGL attributes complete?', 'Are re-submissions controlled?'],
    keyFields: ['TAS', 'USSGL', 'domain attribute', 'period', 'beginning balance', 'activity', 'ending balance'],
    risks: ['ATB not tied to GL', 'missing attribute', 'uncontrolled re-submission']
  },
  {
    id: 'gtas-ddrs-erp-source',
    layer: 'source',
    title: 'DDRS / ERP Reporting Sources',
    subtitle: 'Agency financial reporting and close tie-outs',
    icon: 'ERP',
    tags: ['ddrs', 'erp', 'trial balance', 'close'],
    summary: 'Represents agency ERP, DDRS, and reporting-layer outputs used to prepare, validate, and reconcile GTAS submissions.',
    examples: ['DDRS tie-out', 'ERP trial balance', 'statement package', 'close reconciliation'],
    auditQuestions: ['Do GTAS submissions reconcile to agency reporting packages?', 'Are close adjustments visible?', 'Are source versions retained?'],
    keyFields: ['source system', 'reporting batch', 'TAS', 'USSGL', 'period', 'amount', 'reconciliation ID'],
    risks: ['source-to-GTAS mismatch', 'late adjustment not reflected', 'version confusion']
  },
  {
    id: 'cars-payment-collection-source',
    layer: 'source',
    title: 'Payments, Collections, and Disbursing',
    subtitle: 'TAS-BETC, ALC, voucher, deposit, receipt activity',
    icon: 'PAY',
    tags: ['cars', 'payment', 'collection', 'tas-betc'],
    summary: 'Payment, collection, disbursing, deposit, and receipt activity is classified for central accounting using TAS-BETC, ALC, and transaction-level identifiers.',
    examples: ['disbursement', 'collection', 'deposit ticket', 'payment voucher', 'receipt'],
    auditQuestions: ['Are payments and collections classified to the right TAS-BETC?', 'Do agency records reconcile to Treasury?', 'Are adjustments traceable?'],
    keyFields: ['TAS', 'BETC', 'ALC', 'voucher', 'deposit ticket', 'amount', 'effective date'],
    risks: ['TAS-BETC misclassification', 'unmatched transaction', 'FBWT difference']
  },
  {
    id: 'cars-fbwt-source',
    layer: 'source',
    title: 'FBWT / General Fund / Central Accounts',
    subtitle: 'Fund Balance with Treasury and central accounting balances',
    icon: 'FBW',
    tags: ['fbwt', 'general fund', 'cars', 'treasury'],
    summary: 'Fund Balance with Treasury, General Fund, receipt, appropriation, warrant, and central accounting data provide the Treasury control environment for agency balances.',
    examples: ['FBWT balance', 'appropriation warrant', 'receipt account', 'Treasury balance'],
    auditQuestions: ['Does agency FBWT reconcile to Treasury/CARS?', 'Are warrants and transfers recorded correctly?', 'Are differences aged and resolved?'],
    keyFields: ['TAS', 'fund symbol', 'warrant', 'receipt account', 'Treasury balance', 'agency balance', 'difference'],
    risks: ['FBWT unreconciled', 'warrant/appropriation mismatch', 'central account difference unresolved']
  },
  {
    id: 'cars-igt-source',
    layer: 'source',
    title: 'IPAC / G-Invoicing / IGT',
    subtitle: 'Intragovernmental settlement and trading partner data',
    icon: 'IGT',
    tags: ['ipac', 'g-invoicing', 'igt', 'trading partner'],
    summary: 'Intragovernmental payments, collections, orders, and trading partner data support CARS classification, GTAS attributes, and governmentwide eliminations.',
    examples: ['IPAC settlement', 'G-Invoicing order', 'trading partner record', 'buyer/seller pair'],
    auditQuestions: ['Are trading partner attributes complete?', 'Do buyer and seller records agree?', 'Are IPAC settlements applied to the right TAS?'],
    keyFields: ['agreement/order', 'IPAC document', 'trading partner', 'buyer TAS', 'seller TAS', 'BETC', 'amount'],
    risks: ['trading partner mismatch', 'IPAC misapplied', 'IGT elimination difference']
  },
  {
    id: 'gtas-core',
    layer: 'base',
    title: 'GTAS Core Submission',
    subtitle: 'Governmentwide TAS Adjusted Trial Balance System',
    icon: 'GTA',
    tags: ['gtas', 'submission', 'atb', 'monthly reporting'],
    summary: 'GTAS receives agency adjusted trial balances for proprietary financial reporting and budget-execution information used by Treasury, OMB, Congress, and the Financial Report.',
    examples: ['ATB submission', 'reporting window', 'agency certification', 'bulk file upload'],
    auditQuestions: ['Was the submission made in the right window?', 'Is the certification supported?', 'Do fatal edits clear before close?'],
    keyFields: ['agency identifier', 'reporting period', 'submission version', 'TAS', 'USSGL', 'status', 'certifier'],
    risks: ['late or incomplete submission', 'uncleared fatal edit', 'certification not supported']
  },
  {
    id: 'cars-core',
    layer: 'base',
    title: 'CARS Core Accounting',
    subtitle: 'Central Accounting Reporting System',
    icon: 'CAR',
    tags: ['cars', 'central accounting', 'tas-betc', 'fbwt'],
    summary: 'CARS is modeled as Treasury Fiscal Service central accounting system of record for TAS-BETC classified transactions, FBWT support, and Treasury reporting outputs.',
    examples: ['TAS-BETC transaction', 'central accounting record', 'FBWT support', 'MTS feed'],
    auditQuestions: ['Do agency classified transactions reconcile to CARS?', 'Are TAS-BETC values valid?', 'Are central accounting adjustments supported?'],
    keyFields: ['TAS', 'BETC', 'ALC', 'transaction ID', 'amount', 'effective date', 'source'],
    risks: ['central accounting mismatch', 'classification error', 'unsupported adjustment']
  },
  {
    id: 'gtas-cars-classification',
    layer: 'base',
    title: 'TAS / BETC / USSGL Classification',
    subtitle: 'Standardized Treasury and accounting attributes',
    icon: 'CLS',
    tags: ['tas', 'betc', 'ussgl', 'classification'],
    summary: 'Links GTAS USSGL/TAS reporting with CARS TAS-BETC classification so agency balances, transactions, and Treasury reports can reconcile.',
    examples: ['TAS validation', 'BETC classification', 'USSGL mapping', 'Treasury account symbol attribute'],
    auditQuestions: ['Are TAS, BETC, and USSGL attributes valid and consistent?', 'Do classification changes have support?', 'Are abnormal balances explained?'],
    keyFields: ['TAS', 'BETC', 'USSGL', 'domain attribute', 'fund type', 'authority type', 'period'],
    risks: ['invalid classification', 'GTAS/CARS mismatch', 'crosswalk error']
  },
  {
    id: 'gtas-cars-monthly-close',
    layer: 'base',
    title: 'Monthly Reporting Close',
    subtitle: 'Windows, edits, re-submission, certification',
    icon: 'CLS',
    tags: ['monthly reporting', 'close', 'certification', 'edits'],
    summary: 'Controls monthly reporting windows, edit resolution, agency certification, re-submission, reconciliation, and status reporting.',
    examples: ['reporting window', 'edit resolution', 'certified submission', 're-submission'],
    auditQuestions: ['Are edits cleared before certification?', 'Are changes after certification controlled?', 'Are late submissions tracked?'],
    keyFields: ['reporting window', 'submission status', 'edit count', 'certifier', 'submission timestamp', 'version'],
    risks: ['late reporting', 'uncleared edit', 'uncontrolled post-certification change']
  },
  {
    id: 'gtas-atb-line',
    layer: 'detail',
    title: 'GTAS ATB Line Detail',
    subtitle: 'TAS, USSGL, attributes, beginning/activity/ending balances',
    icon: 'LIN',
    tags: ['atb', 'line detail', 'ussgl', 'tas'],
    summary: 'Preserves line-level GTAS adjusted trial balance detail used for edits, reconciliations, governmentwide reporting, and audit support.',
    examples: ['TAS/USSGL line', 'domain attribute line', 'budgetary line', 'proprietary line'],
    auditQuestions: ['Can each line trace to agency GL or DDRS?', 'Are balances mathematically consistent?', 'Do attributes satisfy GTAS edit rules?'],
    keyFields: ['TAS', 'USSGL', 'domain attribute', 'beginning balance', 'debit/credit activity', 'ending balance', 'period'],
    risks: ['line not traceable', 'balance roll-forward error', 'attribute missing']
  },
  {
    id: 'cars-transaction-detail',
    layer: 'detail',
    title: 'CARS Transaction Detail',
    subtitle: 'TAS-BETC, ALC, payment, collection, receipt',
    icon: 'TRX',
    tags: ['cars', 'transaction', 'tas-betc', 'alc'],
    summary: 'Captures central accounting transaction detail for payments, collections, receipts, disbursements, ALC, TAS-BETC, and effective dates.',
    examples: ['payment record', 'collection record', 'deposit record', 'IPAC settlement'],
    auditQuestions: ['Does CARS transaction detail match agency source support?', 'Are TAS-BETC classifications correct?', 'Are corrections traceable?'],
    keyFields: ['transaction ID', 'ALC', 'TAS', 'BETC', 'voucher/deposit', 'amount', 'effective date'],
    risks: ['transaction not matched', 'incorrect TAS-BETC', 'correction lacks support']
  },
  {
    id: 'cars-fbwt-detail',
    layer: 'detail',
    title: 'FBWT Reconciliation Detail',
    subtitle: 'Agency balance, Treasury balance, differences',
    icon: 'FBW',
    tags: ['fbwt', 'reconciliation', 'treasury', 'difference'],
    summary: 'Tracks agency Fund Balance with Treasury and Treasury/CARS balances, reconciling items, difference aging, ownership, and resolution evidence.',
    examples: ['FBWT tie-out', 'Treasury difference', 'agency reconciling item', 'aged difference'],
    auditQuestions: ['Are FBWT differences aged and assigned?', 'Do reconciling items have support?', 'Are corrections posted in both records?'],
    keyFields: ['TAS', 'agency balance', 'Treasury balance', 'difference', 'owner', 'age', 'resolution'],
    risks: ['unresolved FBWT difference', 'unsupported reconciling item', 'timing issue not cleared']
  },
  {
    id: 'cars-igt-detail',
    layer: 'detail',
    title: 'IGT / Trading Partner Detail',
    subtitle: 'IPAC, G-Invoicing, buyer/seller, TAS-BETC',
    icon: 'IGT',
    tags: ['igt', 'ipac', 'g-invoicing', 'trading partner'],
    summary: 'Preserves intragovernmental settlement and trading partner attributes that support CARS classification, GTAS reporting, and governmentwide eliminations.',
    examples: ['IPAC document', 'G-Invoicing order', 'buyer/seller pair', 'trading partner difference'],
    auditQuestions: ['Are trading partner identifiers valid?', 'Do buyer and seller records agree?', 'Are settlement differences explained?'],
    keyFields: ['IPAC document', 'agreement/order', 'trading partner', 'buyer TAS', 'seller TAS', 'BETC', 'amount'],
    risks: ['trading partner mismatch', 'one-sided IGT activity', 'settlement misclassified']
  },
  {
    id: 'gtas-edit-control',
    layer: 'accounting',
    title: 'GTAS Edits and Validations',
    subtitle: 'Fatal edits, warnings, accounting edits, attributes',
    icon: 'EDT',
    tags: ['gtas', 'edits', 'validations', 'fatal edit'],
    summary: 'Controls GTAS fatal edits, warning edits, accounting edits, USSGL/TAS rules, attribute completeness, and data-quality validation.',
    examples: ['fatal edit', 'warning edit', 'USSGL validation', 'domain attribute edit'],
    auditQuestions: ['Are fatal edits cleared?', 'Are warnings reviewed and explained?', 'Are overrides or resubmissions approved?'],
    keyFields: ['edit code', 'severity', 'TAS', 'USSGL', 'attribute', 'owner', 'resolution'],
    risks: ['fatal edit unresolved', 'warning ignored', 'data-quality defect']
  },
  {
    id: 'cars-reconciliation-control',
    layer: 'accounting',
    title: 'CARS and FBWT Reconciliation',
    subtitle: 'TAS-BETC, Treasury, FBWT, agency tie-outs',
    icon: 'REC',
    tags: ['cars', 'fbwt', 'reconciliation', 'treasury'],
    summary: 'Reconciles CARS transaction classifications, agency FBWT, Treasury balances, TAS-BETC activity, and central accounting outputs.',
    examples: ['CARS tie-out', 'FBWT reconciliation', 'TAS-BETC difference', 'Treasury correction'],
    auditQuestions: ['Do agency and Treasury balances reconcile?', 'Are reconciling items aged and resolved?', 'Do corrections preserve source evidence?'],
    keyFields: ['reconciliation ID', 'TAS', 'BETC', 'agency amount', 'Treasury amount', 'difference', 'resolution'],
    risks: ['unreconciled FBWT', 'TAS-BETC mismatch', 'unsupported correction']
  },
  {
    id: 'gtas-certification-control',
    layer: 'accounting',
    title: 'Agency Certification and Re-submission Control',
    subtitle: 'Submitter, certifier, version, status, evidence',
    icon: 'CERT',
    tags: ['certification', 'submission', 'resubmission', 'evidence'],
    summary: 'Controls agency GTAS submission status, certifier accountability, re-submissions, review evidence, and reporting-window compliance.',
    examples: ['certified ATB', 'resubmission', 'review evidence', 'status report'],
    auditQuestions: ['Who certified the submission?', 'Are re-submissions approved and explained?', 'Was source evidence retained?'],
    keyFields: ['submission ID', 'submitter', 'certifier', 'status', 'timestamp', 'version', 'evidence link'],
    risks: ['uncertified submission', 'uncontrolled resubmission', 'review evidence missing']
  },
  {
    id: 'gtas-cars-audit-control',
    layer: 'accounting',
    title: 'Audit Tie-Out Control',
    subtitle: 'Agency source, GTAS, CARS, reports, evidence',
    icon: 'AUD',
    tags: ['audit', 'tie-out', 'evidence', 'reporting'],
    summary: 'Connects agency source records, GTAS ATB lines, CARS transactions, FBWT reconciliations, Treasury reports, and audit-support packages.',
    examples: ['ATB-to-GL tie-out', 'CARS-to-agency tie-out', 'FBWT package', 'MTS support'],
    auditQuestions: ['Can report amounts trace to agency and Treasury records?', 'Are differences explained?', 'Are support packages complete and retained?'],
    keyFields: ['support package', 'source system', 'GTAS line', 'CARS transaction', 'report line', 'difference', 'owner'],
    risks: ['report amount unsupported', 'difference unresolved', 'evidence gap']
  },
  {
    id: 'gtas-status-output',
    layer: 'reporting',
    title: 'GTAS Status and Data Outputs',
    subtitle: 'Submission status, edits, data-readable files',
    icon: 'OUT',
    tags: ['gtas', 'status', 'output', 'data'],
    summary: 'Provides GTAS submission status, edit results, agency feedback, data-readable outputs, and data used for Treasury/OMB/governmentwide reporting.',
    examples: ['GTAS status report', 'edit report', 'TFM API data-readable share file', 'agency feedback'],
    auditQuestions: ['Do status outputs match certified submissions?', 'Are edit reports retained?', 'Are public/reporting extracts traceable?'],
    keyFields: ['status report', 'edit report', 'submission ID', 'TAS', 'USSGL', 'period', 'amount'],
    risks: ['status/report mismatch', 'edit evidence missing', 'extract not traceable']
  },
  {
    id: 'cars-treasury-output',
    layer: 'reporting',
    title: 'CARS Treasury Outputs',
    subtitle: 'MTS, Combined Statement, central accounting data',
    icon: 'RPT',
    tags: ['cars', 'mts', 'combined statement', 'central accounting'],
    summary: 'CARS supports Treasury central accounting outputs, including data for the Monthly Treasury Statement, Combined Statement, and other key Treasury accounting reports.',
    examples: ['Monthly Treasury Statement data', 'Combined Statement data', 'central accounting extract', 'receipt/outlay data'],
    auditQuestions: ['Do outputs tie to CARS classified transactions?', 'Are TAS-BETC classifications accurate?', 'Are report changes controlled?'],
    keyFields: ['report ID', 'TAS', 'BETC', 'receipt/outlay', 'period', 'amount', 'source transaction'],
    risks: ['report output not tied to CARS', 'classification error', 'change not controlled']
  },
  {
    id: 'gtas-financial-report-output',
    layer: 'reporting',
    title: 'Financial Report Support',
    subtitle: 'Financial Report of the U.S. Government and OMB support',
    icon: 'FR',
    tags: ['financial report', 'omb', 'governmentwide', 'treasury'],
    summary: 'GTAS data supports Treasury and OMB requirements and compilation of the Financial Report of the U.S. Government.',
    examples: ['FR support', 'OMB reporting support', 'governmentwide financial data', 'agency data quality support'],
    auditQuestions: ['Do FR amounts tie to certified GTAS data?', 'Are reclassifications and adjustments documented?', 'Are agency explanations retained?'],
    keyFields: ['FR line', 'agency', 'TAS', 'USSGL', 'amount', 'period', 'support package'],
    risks: ['FR amount not tied to GTAS', 'unsupported reclassification', 'agency explanation missing']
  },
  {
    id: 'gtas-atb-report',
    layer: 'statements',
    title: 'GTAS Adjusted Trial Balance Status',
    subtitle: 'Certified ATB, edits, reporting window status',
    icon: 'ATB',
    tags: ['gtas', 'adjusted trial balance', 'certification', 'status'],
    summary: 'Shows the agency ATB reporting status, edit clearance, certification, and data-quality posture for the reporting period.',
    examples: ['certified ATB', 'status report', 'edit clearance', 're-submission history'],
    auditQuestions: ['Is the ATB certified and complete?', 'Were edits cleared before close?', 'Are versions controlled?'],
    keyFields: ['agency', 'period', 'status', 'certifier', 'edit count', 'version', 'timestamp'],
    risks: ['late/uncertified ATB', 'edit not cleared', 'version mismatch']
  },
  {
    id: 'cars-mts-combined-statement',
    layer: 'statements',
    title: 'MTS / Combined Statement',
    subtitle: 'Receipts, outlays, balances, Treasury reporting',
    icon: 'MTS',
    tags: ['monthly treasury statement', 'combined statement', 'receipts', 'outlays'],
    summary: 'Supports Treasury budgetary reporting outputs such as the Monthly Treasury Statement and Combined Statement of Receipts, Outlays, and Balances.',
    examples: ['MTS receipt/outlay', 'Combined Statement account', 'TAS activity', 'central accounting report'],
    auditQuestions: ['Do receipts and outlays tie to CARS source detail?', 'Are TAS-BETC classifications correct?', 'Are timing differences explained?'],
    keyFields: ['TAS', 'BETC', 'receipt/outlay', 'period', 'amount', 'report line', 'source transaction'],
    risks: ['receipt/outlay misclassification', 'timing difference unresolved', 'report line unsupported']
  },
  {
    id: 'gtas-fr-usg',
    layer: 'statements',
    title: 'Financial Report of the U.S. Government',
    subtitle: 'Governmentwide proprietary and budget execution support',
    icon: 'FR',
    tags: ['financial report', 'governmentwide', 'proprietary', 'budget execution'],
    summary: 'Supports compilation of the Financial Report of the U.S. Government using GTAS proprietary financial and budget execution information.',
    examples: ['governmentwide statement support', 'agency financial data', 'OMB/Treasury requirement', 'FR data package'],
    auditQuestions: ['Do governmentwide amounts trace to certified agency submissions?', 'Are data edits resolved?', 'Are eliminations and reclasses supported?'],
    keyFields: ['agency', 'TAS', 'USSGL', 'FR line', 'period', 'amount', 'support package'],
    risks: ['governmentwide amount unsupported', 'agency edit unresolved', 'reclass not documented']
  },
  {
    id: 'cars-fbwt-report',
    layer: 'statements',
    title: 'FBWT and Central Accounting Support',
    subtitle: 'Agency/Treasury balance reconciliation',
    icon: 'FBW',
    tags: ['fbwt', 'central accounting', 'reconciliation', 'treasury'],
    summary: 'Supports agency and governmentwide Fund Balance with Treasury assertions using CARS, Treasury balances, agency records, and reconciliation evidence.',
    examples: ['FBWT reconciliation', 'Treasury balance', 'agency balance', 'difference aging'],
    auditQuestions: ['Are FBWT balances reconciled?', 'Are differences aged and owned?', 'Do corrections post to both agency and Treasury records?'],
    keyFields: ['TAS', 'agency balance', 'Treasury balance', 'difference', 'owner', 'resolution status', 'period'],
    risks: ['FBWT unreconciled', 'unsupported difference', 'correction not posted']
  }
];

const gtasCarsLineageScenarios = [
  {
    id: 'gtas-atb-to-fr',
    short: 'GTAS ATB',
    title: 'Agency ATB to GTAS and Financial Report Support',
    description: 'Traces agency adjusted trial balance data through GTAS submission, edits, certification, and Financial Report support.',
    path: ['gtas-agency-atb-source', 'gtas-core', 'gtas-atb-line', 'gtas-edit-control', 'gtas-financial-report-output', 'gtas-fr-usg'],
    steps: [
      'The agency prepares adjusted trial balance data from ERP, DDRS, or close packages.',
      'GTAS receives the ATB by TAS, USSGL, reporting attributes, period, and balance/activity amounts.',
      'Line-level detail preserves the submission population for edit resolution and audit support.',
      'GTAS fatal, warning, and accounting edits validate the data before certification.',
      'Certified GTAS data supports Treasury, OMB, and the Financial Report of the U.S. Government.'
    ],
    exceptionTests: ['ATB not tied to GL', 'fatal edit unresolved', 'missing attribute', 'late submission', 'FR amount not tied to certified GTAS']
  },
  {
    id: 'cars-transaction-to-mts',
    short: 'CARS',
    title: 'Payment or Collection to CARS and Treasury Reports',
    description: 'Shows how payment/collection activity is classified in CARS and supports MTS and Combined Statement outputs.',
    path: ['cars-payment-collection-source', 'cars-core', 'cars-transaction-detail', 'cars-reconciliation-control', 'cars-treasury-output', 'cars-mts-combined-statement'],
    steps: [
      'Payment, collection, receipt, or disbursement activity is classified using TAS-BETC and ALC data.',
      'CARS records the central accounting transaction and effective-date classification.',
      'Transaction detail preserves voucher, deposit, TAS, BETC, amount, and source references.',
      'CARS reconciliation verifies agency records, Treasury balances, and classification correctness.',
      'Treasury outputs support Monthly Treasury Statement and Combined Statement reporting.'
    ],
    exceptionTests: ['invalid TAS-BETC', 'agency/CARS transaction mismatch', 'unmatched collection', 'report line not tied to CARS', 'timing difference unresolved']
  },
  {
    id: 'cars-fbwt-tieout',
    short: 'FBWT',
    title: 'FBWT Agency-to-Treasury Reconciliation',
    description: 'Traces agency FBWT balances against CARS/Treasury central accounting support and reconciliation evidence.',
    path: ['cars-fbwt-source', 'cars-core', 'cars-fbwt-detail', 'cars-reconciliation-control', 'gtas-cars-audit-control', 'cars-fbwt-report'],
    steps: [
      'Agency and Treasury FBWT balances are compared by TAS, period, and supporting transactions.',
      'CARS central accounting data provides Treasury-side balance and transaction support.',
      'FBWT detail tracks differences, owners, aging, and resolution evidence.',
      'Reconciliation controls tie differences to timing, classification, or correction actions.',
      'FBWT report support preserves agency/Treasury balance assertions for audit.'
    ],
    exceptionTests: ['FBWT difference aged', 'reconciling item lacks support', 'correction only posted on one side', 'TAS mismatch', 'audit package incomplete']
  },
  {
    id: 'gtas-cars-igt',
    short: 'IGT',
    title: 'IGT/IPAC to GTAS, CARS, and Governmentwide Elimination Support',
    description: 'Connects IPAC/G-Invoicing trading partner data to CARS classification, GTAS attributes, and governmentwide reporting support.',
    path: ['cars-igt-source', 'gtas-cars-classification', 'cars-igt-detail', 'cars-reconciliation-control', 'gtas-cars-audit-control', 'gtas-fr-usg'],
    steps: [
      'IPAC, G-Invoicing, and trading partner records establish buyer/seller and TAS-BETC context.',
      'GTAS/CARS classification validates TAS, BETC, USSGL, and trading partner attributes.',
      'IGT detail preserves settlement, order, trading partner, buyer/seller, and amount support.',
      'Reconciliation controls resolve trading partner and settlement differences.',
      'Governmentwide reporting uses the supported data for eliminations and Financial Report support.'
    ],
    exceptionTests: ['missing trading partner', 'IPAC settlement misclassified', 'buyer/seller mismatch', 'GTAS attribute missing', 'elimination support incomplete']
  }
];

const gtasCarsSupportServices = [
  { title: 'GTAS Submission Governance', detail: 'Monthly reporting windows, ATB load, fatal/warning edits, certification, resubmission control, source tie-outs, and status reporting.' },
  { title: 'CARS Central Accounting', detail: 'TAS-BETC classification, ALC, payment and collection detail, receipt/outlay reporting, CARS transaction correction, and central accounting controls.' },
  { title: 'FBWT Reconciliation', detail: 'Agency and Treasury balance comparison, CARS source detail, reconciling items, timing differences, corrections, owner assignment, and evidence retention.' },
  { title: 'IGT and Trading Partner Controls', detail: 'IPAC, G-Invoicing, TAS/BETC, buyer/seller pairs, trading partner attributes, settlement differences, and governmentwide elimination support.' },
  { title: 'Governmentwide Reporting', detail: 'Monthly Treasury Statement, Combined Statement, Financial Report of the U.S. Government, OMB/Treasury reporting, and Fiscal Service outputs.' },
  { title: 'Audit Evidence', detail: 'Agency GL/DDRS tie-outs, GTAS ATB lines, CARS transactions, FBWT packages, edit reports, certification evidence, and report-to-source reconciliation.' }
];

const gtasCarsCaveats = [
  'GTAS and CARS are Treasury/Fiscal Service systems, not DoD-owned accounting systems. This page models their relationship to DoD FM systems through federal reporting, central accounting, FBWT, and Treasury reconciliation.',
  'GTAS is modeled as the adjusted trial balance submission/edit path. CARS is modeled as the Treasury central accounting reporting system for TAS-BETC classified transactions, central accounting, FBWT, and Treasury reports.',
  'Exact file formats, edit logic, role workflows, and release behavior change with Treasury guidance and require current Fiscal Service documentation.',
  'Feeder counts are modeled source/partner categories represented in this blueprint, not a certified production interface inventory.'
];

const gtasCarsSources = [
  { name: 'Treasury GTAS', url: 'https://fiscal.treasury.gov/accounting/government-wide-treasury-account-symbol-gtas' },
  { name: 'Treasury CARS', url: 'https://fiscal.treasury.gov/accounting/central-accounting-reporting-system-cars' },
  { name: 'Treasury USSGL', url: 'https://fiscal.treasury.gov/accounting/us-standard-general-ledger-ussgl' },
  { name: 'Treasury G-Invoicing / IPAC', url: 'https://fiscal.treasury.gov/accounting/intragov' },
  { name: 'Treasury Combined Statement', url: 'https://fiscal.treasury.gov/reports-statements/combined-statement' },
  { name: 'Financial Report of the U.S. Government', url: 'https://fiscal.treasury.gov/reports-statements/financial-report' }
];

const disbursingCashLayers = [
  { id: 'source', label: 'Entitlement and Source Systems', short: 'Source', description: 'Payment entitlement, collection, debt, payroll, travel, invoice, and field activity sources that initiate disbursing actions.' },
  { id: 'capabilities', label: 'Disbursing and Cash Systems', short: 'Core', description: 'ADS, DDS, DCAS, and related disbursing capabilities that execute payments, preserve voucher support, and control accountable-cash activity.' },
  { id: 'transactions', label: 'Voucher and Cash Detail', short: 'Detail', description: 'Voucher schedules, certified payment lines, collections, deposits, cancellations, returns, accountability records, and reconciliation detail.' },
  { id: 'accounting', label: 'Accounting and Control Layer', short: 'Accounting', description: 'Certification, disbursing officer accountability, cash reconciliation, GL interfaces, FBWT tie-outs, and exception controls.' },
  { id: 'reporting', label: 'Treasury and Component Reporting', short: 'Reporting', description: 'CARS, Treasury payment reporting, component accounting feeds, DDRS/GTAS support, and disbursing reports.' },
  { id: 'statements', label: 'Outlay, FBWT, and Audit Outputs', short: 'Statements', description: 'Outlay support, Fund Balance with Treasury, SBR/SNC support, cash accountability assertions, and audit evidence packages.' }
];

const disbursingCashNodes = [
  {
    id: 'ads-erp-entitlement',
    layer: 'source',
    title: 'ERP / Entitlement Sources',
    subtitle: 'AP, payroll, travel, debt, vendor, entitlement records',
    icon: 'SRC',
    tags: ['entitlement', 'voucher', 'source', 'payment'],
    summary: 'Payment entitlement begins in accounting, payroll, travel, contract, debt, or other feeder systems before it becomes a certified disbursing action.',
    examples: ['vendor invoice', 'travel voucher', 'payroll entitlement', 'debt refund', 'contract financing request'],
    auditQuestions: ['Does the payment trace to a valid entitlement?', 'Is the source population complete?', 'Are amounts and payees supported before certification?'],
    keyFields: ['source system', 'voucher number', 'invoice or entitlement ID', 'payee', 'TAS', 'LOA', 'amount', 'certifying officer'],
    risks: ['unsupported entitlement', 'duplicate payment', 'invalid payee', 'missing accounting classification']
  },
  {
    id: 'ads-certification-source',
    layer: 'source',
    title: 'Certified Voucher Package',
    subtitle: 'CO, DAO, appointment, pre-payment review, supporting evidence',
    icon: 'CERT',
    tags: ['certification', 'voucher', 'accountable official', 'control'],
    summary: 'The certified voucher package records the accountable certification and support used by the disbursing office to make payment.',
    examples: ['certified voucher', 'DD 577 appointment support', 'pre-payment review', 'supporting invoice'],
    auditQuestions: ['Was the certifying official properly appointed?', 'Was the voucher certified before payment?', 'Is relied-upon support retained?'],
    keyFields: ['certifier', 'certification date', 'voucher schedule', 'support package', 'review status', 'amount'],
    risks: ['uncertified payment', 'missing appointment support', 'weak pre-payment review']
  },
  {
    id: 'ads-collections-source',
    layer: 'source',
    title: 'Collections / Returns / Cancellations',
    subtitle: 'refund, deposit, cancellation, debit voucher, correction',
    icon: 'COLL',
    tags: ['collection', 'return', 'cancellation', 'cash'],
    summary: 'Collections, returned payments, cancellations, deposits, and adjustments create cash-accountability and accounting events that must be reconciled.',
    examples: ['returned EFT', 'check cancellation', 'cash collection', 'deposit ticket', 'refund collection'],
    auditQuestions: ['Are returns and collections recorded timely?', 'Do cash and deposit records reconcile?', 'Were corrections posted to accounting?'],
    keyFields: ['collection ID', 'deposit number', 'payment reference', 'ALC', 'TAS', 'BETC', 'amount'],
    risks: ['unrecorded collection', 'misclassified return', 'cash accountability difference']
  },
  {
    id: 'ads-core',
    layer: 'capabilities',
    title: 'ADS',
    subtitle: 'Automated Disbursing System',
    icon: 'ADS',
    tags: ['ads', 'disbursing', 'payment', 'dfas'],
    summary: 'ADS is modeled as a DoD/DFAS disbursing execution environment for certified voucher payment, voucher scheduling, payment file generation, and disbursing evidence.',
    examples: ['voucher schedule', 'EFT payment batch', 'check payment support', 'payment status'],
    auditQuestions: ['Does ADS output match certified vouchers?', 'Are payment files controlled?', 'Can payment status trace to Treasury/agency accounting?'],
    keyFields: ['voucher schedule', 'disbursing station symbol', 'ALC', 'payee', 'payment date', 'payment method', 'amount'],
    risks: ['payment file mismatch', 'unmatched voucher', 'payment status not reconciled']
  },
  {
    id: 'dds-core',
    layer: 'capabilities',
    title: 'DDS',
    subtitle: 'Deployable Disbursing System',
    icon: 'DDS',
    tags: ['dds', 'deployable', 'field disbursing', 'cash'],
    summary: 'DDS is modeled as deployable disbursing support for contingency or field environments where cash-like activity and local accountability require strong controls.',
    examples: ['field payment', 'cash-like disbursement', 'deployed voucher', 'local collection'],
    auditQuestions: ['Is deployed activity reported back to enterprise accounting?', 'Are cash holdings and vouchers controlled?', 'Are local records reconciled to central records?'],
    keyFields: ['deployment location', 'disbursing officer', 'voucher', 'cash account', 'currency', 'amount', 'report date'],
    risks: ['field cash loss', 'late reporting', 'manual record not reconciled']
  },
  {
    id: 'dcas-core',
    layer: 'capabilities',
    title: 'DCAS',
    subtitle: 'Defense Cash Accountability System',
    icon: 'DCAS',
    tags: ['dcas', 'cash accountability', 'disbursing officer', 'reconciliation'],
    summary: 'DCAS is modeled as the cash-accountability control environment for disbursing officer accountability, cash records, vouchers, collections, and disbursing reports.',
    examples: ['DO accountability record', 'cash accountability report', 'voucher control', 'collection accountability'],
    auditQuestions: ['Do accountability records tie to payments and collections?', 'Are losses or differences investigated?', 'Do reports reconcile to Treasury and accounting?'],
    keyFields: ['DO', 'DSSN', 'ALC', 'voucher', 'collection', 'cash balance', 'difference', 'period'],
    risks: ['unexplained cash difference', 'incomplete accountability record', 'Treasury mismatch']
  },
  {
    id: 'ads-payment-detail',
    layer: 'transactions',
    title: 'Payment and Voucher Detail',
    subtitle: 'payee, method, voucher, date, amount, status',
    icon: 'PAY',
    tags: ['payment', 'voucher', 'detail', 'uot'],
    summary: 'Payment detail preserves the Universe of Transactions for certified disbursements, including payee, method, amount, status, schedule, and source reference.',
    examples: ['EFT line', 'check line', 'split disbursement', 'payment status'],
    auditQuestions: ['Can every paid line trace to source and certification?', 'Do status changes have support?', 'Are cancelled or returned payments resolved?'],
    keyFields: ['payment ID', 'voucher number', 'payee', 'method', 'amount', 'date', 'status', 'source reference'],
    risks: ['missing source reference', 'unresolved return', 'duplicate line']
  },
  {
    id: 'dds-field-detail',
    layer: 'transactions',
    title: 'Deployable Cash Detail',
    subtitle: 'field voucher, local currency, cash balance, receipt, report',
    icon: 'FLD',
    tags: ['deployable', 'cash', 'field', 'detail'],
    summary: 'Deployable detail captures local payment, cash, currency, voucher, collection, and reporting evidence needed to bring field activity into enterprise accountability.',
    examples: ['field voucher', 'currency exchange support', 'cash count', 'collection receipt'],
    auditQuestions: ['Are field payments reported timely?', 'Do cash counts reconcile to local records?', 'Are manual records complete?'],
    keyFields: ['field voucher', 'location', 'currency', 'cash count', 'receipt', 'report date', 'amount'],
    risks: ['cash count variance', 'late field report', 'missing manual support']
  },
  {
    id: 'dcas-accountability-detail',
    layer: 'transactions',
    title: 'Cash Accountability Detail',
    subtitle: 'DSSN, ALC, voucher, collection, deposit, difference',
    icon: 'CASH',
    tags: ['cash', 'accountability', 'detail', 'reconciliation'],
    summary: 'Cash-accountability detail ties voucher activity, collections, deposits, cancellations, and corrections to the accountable disbursing officer record.',
    examples: ['DSSN activity', 'ALC balance', 'deposit record', 'voucher control', 'difference aging'],
    auditQuestions: ['Do cash-accountability details reconcile to reports?', 'Are differences aged and assigned?', 'Are collections and deposits complete?'],
    keyFields: ['DSSN', 'ALC', 'voucher', 'collection', 'deposit', 'difference', 'owner', 'period'],
    risks: ['unaged difference', 'deposit mismatch', 'unreconciled voucher']
  },
  {
    id: 'ads-certification-control',
    layer: 'accounting',
    title: 'Certification and Accountable-Official Control',
    subtitle: 'CO, DAO, DO, appointment, liability, payment review',
    icon: 'CTRL',
    tags: ['certification', 'control', 'liability', 'FMR'],
    summary: 'Controls enforce certified payment, accountable-official roles, disbursing officer responsibilities, and relied-upon data before public funds are disbursed.',
    examples: ['CO review', 'DAO support', 'DD 577 appointment', 'payment review checklist'],
    auditQuestions: ['Were accountable roles properly assigned?', 'Did the DO rely on a certified voucher?', 'Are exceptions reviewed and resolved?'],
    keyFields: ['CO', 'DAO', 'DO', 'appointment', 'certification date', 'review status', 'exception'],
    risks: ['improper role', 'unsupported certification', 'unresolved exception']
  },
  {
    id: 'ads-accounting-interface',
    layer: 'accounting',
    title: 'Accounting Interface and Liquidation',
    subtitle: 'GL, budgetary/proprietary posting, obligation liquidation, outlay',
    icon: 'GL',
    tags: ['accounting', 'interface', 'outlay', 'liquidation'],
    summary: 'Disbursing activity feeds accounting so obligations, expenses, payables, disbursements, and outlays are posted and reconciled.',
    examples: ['obligation liquidation', 'expense/outlay posting', 'AP clearing', 'GL interface batch'],
    auditQuestions: ['Did each payment post to accounting?', 'Does the accounting feed match disbursing records?', 'Are rejects resolved?'],
    keyFields: ['interface batch', 'GL document', 'USSGL', 'TAS', 'LOA', 'voucher', 'amount'],
    risks: ['interface reject', 'unliquidated obligation mismatch', 'GL/disbursing imbalance']
  },
  {
    id: 'dcas-reconciliation-control',
    layer: 'accounting',
    title: 'Cash and FBWT Reconciliation',
    subtitle: 'DCAS, accounting, CARS, Treasury, FBWT',
    icon: 'RECON',
    tags: ['reconciliation', 'fbwt', 'treasury', 'cash'],
    summary: 'Reconciliation controls compare disbursing records, DCAS accountability, component accounting, CARS/Treasury records, and FBWT support.',
    examples: ['FBWT tie-out', 'CARS transaction tie-out', 'DSSN reconciliation', 'difference aging'],
    auditQuestions: ['Do disbursing totals reconcile to accounting and Treasury?', 'Are differences explained?', 'Are corrections posted on all sides?'],
    keyFields: ['DSSN', 'ALC', 'TAS', 'CARS transaction', 'agency amount', 'Treasury amount', 'difference'],
    risks: ['unresolved FBWT difference', 'CARS classification mismatch', 'correction not posted']
  },
  {
    id: 'ads-treasury-reporting',
    layer: 'reporting',
    title: 'Treasury / CARS Reporting',
    subtitle: 'payment classification, ALC, TAS-BETC, central accounting',
    icon: 'CARS',
    tags: ['treasury', 'cars', 'tas-betc', 'reporting'],
    summary: 'Payment, collection, and disbursing activity is classified for Treasury central accounting and downstream CARS/FBWT reporting.',
    examples: ['TAS-BETC classified transaction', 'payment report', 'collection report', 'central accounting extract'],
    auditQuestions: ['Is TAS-BETC classification valid?', 'Do Treasury records agree to agency records?', 'Are payment and collection reports complete?'],
    keyFields: ['ALC', 'TAS', 'BETC', 'DSSN', 'transaction date', 'amount', 'CARS reference'],
    risks: ['invalid TAS-BETC', 'late Treasury reporting', 'agency/Treasury mismatch']
  },
  {
    id: 'ads-component-reporting',
    layer: 'reporting',
    title: 'Component / DDRS / GTAS Support',
    subtitle: 'trial balance, SBR, outlays, cash activity',
    icon: 'RPT',
    tags: ['ddrs', 'gtas', 'component', 'reporting'],
    summary: 'Component reporting uses disbursing and accounting data for trial balance, SBR outlays, cash activity, FBWT, and GTAS reporting support.',
    examples: ['trial balance support', 'SBR outlay support', 'DDRS tie-out', 'GTAS attribute support'],
    auditQuestions: ['Do outlays tie to disbursing records?', 'Are GTAS attributes complete?', 'Are DDRS and source systems reconciled?'],
    keyFields: ['TAS', 'USSGL', 'period', 'outlay', 'trial balance line', 'support package'],
    risks: ['outlay unsupported', 'trial balance mismatch', 'reporting attribute missing']
  },
  {
    id: 'ads-disbursing-report',
    layer: 'statements',
    title: 'Disbursing Accountability Reports',
    subtitle: 'cash, vouchers, collections, differences, DO accountability',
    icon: 'DO',
    tags: ['disbursing', 'accountability', 'report', 'audit'],
    summary: 'Disbursing reports provide accountability for cash, vouchers, collections, deposits, returns, corrections, and disbursing-officer responsibilities.',
    examples: ['cash accountability report', 'voucher summary', 'collection summary', 'difference aging'],
    auditQuestions: ['Do reports tie to detailed records?', 'Are differences assigned and resolved?', 'Is accountability complete for the period?'],
    keyFields: ['DSSN', 'DO', 'period', 'voucher total', 'collection total', 'cash balance', 'difference'],
    risks: ['report/detail mismatch', 'unresolved accountability difference', 'missing report support']
  },
  {
    id: 'ads-fbwt-statement',
    layer: 'statements',
    title: 'FBWT / SBR Outlay Support',
    subtitle: 'Fund Balance with Treasury, outlays, agency financial statements',
    icon: 'FBWT',
    tags: ['fbwt', 'sbr', 'outlay', 'statement'],
    summary: 'Disbursing and Treasury records support FBWT, Statement of Budgetary Resources outlays, and agency financial-statement assertions.',
    examples: ['FBWT reconciliation package', 'SBR outlay support', 'Treasury tie-out', 'statement support'],
    auditQuestions: ['Can outlays be traced to payment detail?', 'Does FBWT reconcile?', 'Are timing differences documented?'],
    keyFields: ['TAS', 'USSGL', 'outlay amount', 'FBWT balance', 'difference', 'support package'],
    risks: ['FBWT unreconciled', 'outlay not traceable', 'timing difference unsupported']
  }
];

const disbursingCashLineageScenarios = [
  {
    id: 'ads-certified-payment',
    short: 'ADS Pay',
    title: 'Certified Voucher to ADS Payment, Accounting, and Outlay',
    description: 'Traces a certified entitlement through ADS payment execution, accounting interface, Treasury reporting, and SBR/FBWT support.',
    path: ['ads-erp-entitlement', 'ads-certification-source', 'ads-core', 'ads-payment-detail', 'ads-accounting-interface', 'ads-treasury-reporting', 'ads-fbwt-statement'],
    steps: [
      'A source system establishes an entitlement and a certifying officer certifies the payment voucher.',
      'ADS executes or supports the payment and preserves payment file, voucher schedule, payee, amount, date, and status detail.',
      'The accounting interface posts liquidation, expense, payable clearing, disbursement, and outlay activity.',
      'Treasury/CARS reporting classifies the transaction by ALC, TAS, BETC, and related attributes.',
      'FBWT and SBR outlay support tie payment detail to accounting and Treasury records.'
    ],
    exceptionTests: ['uncertified voucher', 'payment not posted to accounting', 'invalid TAS-BETC', 'duplicate payment', 'FBWT difference unresolved']
  },
  {
    id: 'dds-deployed-cash',
    short: 'DDS Field',
    title: 'Deployable Disbursing Field Activity to Enterprise Accountability',
    description: 'Shows how deployable cash-like activity should be reported, reconciled, and tied to DCAS, accounting, and Treasury records.',
    path: ['ads-erp-entitlement', 'dds-core', 'dds-field-detail', 'dcas-core', 'dcas-accountability-detail', 'dcas-reconciliation-control', 'ads-disbursing-report'],
    steps: [
      'A deployed office records local payment, collection, currency, or cash-like activity.',
      'DDS captures field voucher and cash details for deployable disbursing operations.',
      'DCAS/accountability records bring local activity under disbursing officer accountability.',
      'Reconciliation compares field records, cash counts, reports, accounting, and Treasury-side activity.',
      'Disbursing reports preserve the accountability trail for period close and audit.'
    ],
    exceptionTests: ['late field report', 'cash count variance', 'manual support missing', 'enterprise record not updated', 'unresolved DO difference']
  },
  {
    id: 'dcas-collection-return',
    short: 'DCAS Cash',
    title: 'Collection, Return, or Cancellation to Cash Accountability and FBWT',
    description: 'Traces collections, returned payments, cancellations, and corrections through DCAS accountability, Treasury reporting, and FBWT tie-out.',
    path: ['ads-collections-source', 'dcas-core', 'dcas-accountability-detail', 'dcas-reconciliation-control', 'ads-treasury-reporting', 'ads-fbwt-statement'],
    steps: [
      'A collection, returned payment, cancellation, or correction creates a cash-accountability event.',
      'DCAS records the event against disbursing officer, DSSN/ALC, voucher, deposit, or collection references.',
      'Reconciliation compares DCAS, component accounting, CARS/Treasury, and FBWT records.',
      'Treasury reporting classifies the correction or collection with valid central-accounting attributes.',
      'FBWT support documents resolved and unresolved differences.'
    ],
    exceptionTests: ['collection not deposited', 'return not corrected', 'CARS mismatch', 'unaged difference', 'missing cancellation support']
  }
];

const disbursingCashSupportServices = [
  { title: 'Disbursing Execution', detail: 'Certified voucher payment, payment-file control, payment status, disbursement method, and voucher schedule traceability.' },
  { title: 'Deployable Disbursing', detail: 'Field payment, collection, cash count, local-currency support, manual support retention, and enterprise reporting for deployed environments.' },
  { title: 'Cash Accountability', detail: 'Disbursing officer accountability, DSSN/ALC records, collections, deposits, returns, cancellations, losses, and difference resolution.' },
  { title: 'Accounting Interface', detail: 'Obligation liquidation, payable clearing, expense/outlay posting, interface rejects, USSGL/TAS classification, and trial-balance support.' },
  { title: 'Treasury Reconciliation', detail: 'CARS/Treasury reporting, TAS-BETC, FBWT tie-out, agency-to-Treasury differences, corrections, and period close controls.' },
  { title: 'Audit Evidence', detail: 'Source entitlement, certification, voucher detail, payment status, cash accountability, Treasury classification, accounting posting, and retained support package.' }
];

const disbursingCashCaveats = [
  'ADS, DDS, and DCAS details are modeled from public disbursing and cash-management process knowledge; exact current interface inventories, screen names, file formats, and operational status require DFAS/DoD authoritative system documentation.',
  'This page treats ADS as central disbursing execution support, DDS as deployable disbursing support, and DCAS as cash-accountability support. It is a process blueprint, not a certified system security architecture.',
  'DoD FMR Volume 5 is used as the controlling public policy anchor for disbursing responsibilities, accountable officials, certification, disbursing officer accountability, cash management, and Treasury-aligned reporting.',
  'Feeder counts are modeled source/partner categories represented in this blueprint, not a certified production interface inventory.'
];

const disbursingCashSources = [
  { name: 'DoD FMR Volume 5, Chapter 1 - Purpose, Organization, and Duties', url: 'https://comptroller.defense.gov/Portals/45/documents/fmr/current/05/05_01.pdf' },
  { name: 'DoD FMR', url: 'https://comptroller.defense.gov/FMR/' },
  { name: 'DFAS official site', url: 'https://www.dfas.mil/' },
  { name: 'Treasury CARS', url: 'https://fiscal.treasury.gov/accounting/central-accounting-reporting-system-cars' },
  { name: 'Treasury Intragovernmental Transactions / IPAC', url: 'https://fiscal.treasury.gov/intragov/' }
];

const ipacLayers = [
  { id: 'source', label: 'Agency and Trading Partner Sources', short: 'Source', description: 'Buyer and seller agency ERPs, G-Invoicing order/performance context, reimbursable records, and settlement requests.' },
  { id: 'capabilities', label: 'IPAC Settlement Capabilities', short: 'Core', description: 'IPAC funds transfer, standardized descriptive data, TAS/BETC/ALC attributes, and RITS relationship where applicable.' },
  { id: 'transactions', label: 'Settlement Detail', short: 'Detail', description: 'Buyer/seller, ALC, TAS, BETC, trading partner, order, performance, amount, and settlement-status detail.' },
  { id: 'accounting', label: 'Buyer/Seller Accounting Controls', short: 'Accounting', description: 'Buyer payable/expense and seller receivable/revenue posting, CARS classification, FBWT, and trading-partner reconciliation.' },
  { id: 'reporting', label: 'Treasury and Component Reporting', short: 'Reporting', description: 'CARS, GTAS, DDRS, G-Invoicing status, IPAC reports, and intragovernmental reporting support.' },
  { id: 'statements', label: 'IGT, FBWT, and Elimination Outputs', short: 'Statements', description: 'FBWT support, SBR/SNC impact, intragovernmental elimination support, and audit evidence.' }
];

const ipacNodes = [
  {
    id: 'ipac-buyer-erp',
    layer: 'source',
    title: 'Buyer Agency ERP',
    subtitle: 'obligation, expense, payable, LOA',
    icon: 'BUY',
    tags: ['buyer', 'erp', 'obligation', 'payable'],
    summary: 'The buyer agency records obligation, order, receipt or performance, expense, and payable activity that supports an IPAC settlement.',
    examples: ['buyer obligation', 'expense accrual', 'payable', 'order reference'],
    auditQuestions: ['Does the buyer settlement trace to an obligation and support?', 'Are buyer TAS/BETC and trading partner attributes valid?'],
    keyFields: ['buyer ALC', 'buyer TAS', 'order number', 'trading partner', 'amount', 'LOA'],
    risks: ['buyer does not recognize settlement', 'invalid LOA', 'missing order support']
  },
  {
    id: 'ipac-seller-erp',
    layer: 'source',
    title: 'Seller Agency ERP',
    subtitle: 'reimbursable order, performance, receivable, revenue',
    icon: 'SELL',
    tags: ['seller', 'reimbursable', 'receivable', 'revenue'],
    summary: 'The seller agency records reimbursable order, performance, billing, receivable, revenue, and collection activity related to the IPAC settlement.',
    examples: ['seller reimbursable order', 'performance record', 'billing event', 'receivable'],
    auditQuestions: ['Does seller revenue/collection tie to buyer settlement?', 'Are seller trading partner attributes complete?'],
    keyFields: ['seller ALC', 'seller TAS', 'order number', 'performance date', 'trading partner', 'amount'],
    risks: ['seller/buyer mismatch', 'unbilled performance', 'revenue not tied to settlement']
  },
  {
    id: 'ipac-ginvoicing-context',
    layer: 'source',
    title: 'G-Invoicing Context',
    subtitle: 'GT&C, order, performance, settlement validation',
    icon: 'GINV',
    tags: ['g-invoicing', 'igt', 'order', 'performance'],
    summary: 'G-Invoicing provides the long-term IGT buy/sell context for agreements, orders, performance, and validation of settlement requests through IPAC.',
    examples: ['GT&C', 'order', 'performance', 'settlement validation'],
    auditQuestions: ['Does the IPAC settlement have the required G-Invoicing context?', 'Do order/performance records agree between partners?'],
    keyFields: ['GT&C number', 'order number', 'performance ID', 'buyer', 'seller', 'amount'],
    risks: ['settlement lacks order context', 'performance mismatch', 'legacy unsupported agreement']
  },
  {
    id: 'ipac-core',
    layer: 'capabilities',
    title: 'IPAC',
    subtitle: 'Intragovernmental Payment and Collection',
    icon: 'IPAC',
    tags: ['ipac', 'igt', 'settlement', 'treasury'],
    summary: 'IPAC is Treasury Fiscal Service capability for federal entities to transfer funds between trading partners using standardized descriptive data.',
    examples: ['IPAC charge', 'IPAC collection', 'adjustment', 'settlement status'],
    auditQuestions: ['Did the IPAC settlement use valid buyer/seller and accounting attributes?', 'Does it reconcile to both agencies?'],
    keyFields: ['IPAC document', 'buyer ALC', 'seller ALC', 'TAS', 'BETC', 'amount', 'settlement date'],
    risks: ['wrong trading partner', 'invalid TAS/BETC', 'settlement not accepted by partner']
  },
  {
    id: 'ipac-rits-core',
    layer: 'capabilities',
    title: 'RITS Component',
    subtitle: 'Retirement and Insurance Transfer System relationship',
    icon: 'RITS',
    tags: ['rits', 'ipac', 'transfer', 'treasury'],
    summary: 'Treasury identifies IPAC and RITS as components of the intragovernmental payment and collection capability; RITS is modeled as adjacent transfer functionality where applicable.',
    examples: ['retirement transfer', 'insurance transfer', 'component report'],
    auditQuestions: ['Is the activity in the correct IPAC or RITS channel?', 'Does the transfer classify properly for the agency?'],
    keyFields: ['component', 'transfer ID', 'ALC', 'TAS', 'amount', 'period'],
    risks: ['wrong channel', 'classification error', 'reconciliation gap']
  },
  {
    id: 'ipac-settlement-detail',
    layer: 'transactions',
    title: 'Settlement Detail',
    subtitle: 'buyer, seller, ALC, TAS, BETC, amount, status',
    icon: 'SETL',
    tags: ['settlement', 'detail', 'tas-betc', 'trading partner'],
    summary: 'Settlement detail preserves buyer, seller, ALC, TAS, BETC, amount, date, order/performance references, and settlement status for audit and reconciliation.',
    examples: ['IPAC document line', 'adjustment line', 'seller collection line', 'buyer charge line'],
    auditQuestions: ['Do buyer and seller details agree?', 'Are required attributes complete?', 'Can the amount trace to order/performance support?'],
    keyFields: ['IPAC document', 'buyer ALC', 'seller ALC', 'TAS', 'BETC', 'trading partner', 'amount', 'status'],
    risks: ['missing attribute', 'partner mismatch', 'unmatched settlement']
  },
  {
    id: 'ipac-adjustment-detail',
    layer: 'transactions',
    title: 'Adjustment and Reversal Detail',
    subtitle: 'correction, reversal, dispute, reclassification',
    icon: 'ADJ',
    tags: ['adjustment', 'reversal', 'dispute', 'correction'],
    summary: 'Adjustments, reversals, disputes, and reclassifications provide the correction trail when IPAC settlements require changes after initial posting.',
    examples: ['IPAC reversal', 'dispute correction', 'TAS correction', 'amount adjustment'],
    auditQuestions: ['Is the correction tied to the original settlement?', 'Did both agencies post the adjustment?', 'Is the dispute resolved?'],
    keyFields: ['original IPAC document', 'adjustment ID', 'reason', 'amount', 'status', 'owner'],
    risks: ['one-sided correction', 'unsupported reversal', 'aged dispute']
  },
  {
    id: 'ipac-cars-classification',
    layer: 'accounting',
    title: 'CARS / TAS-BETC Classification',
    subtitle: 'central accounting classification and effective-date control',
    icon: 'CARS',
    tags: ['cars', 'tas-betc', 'classification', 'treasury'],
    summary: 'CARS and TAS-BETC classification connect IPAC settlement activity to Treasury central accounting and agency FBWT support.',
    examples: ['TAS-BETC validation', 'CARS transaction', 'ALC tie-out', 'central accounting support'],
    auditQuestions: ['Does CARS classification agree with agency records?', 'Is TAS-BETC valid for the transaction?', 'Are timing differences explained?'],
    keyFields: ['CARS reference', 'ALC', 'TAS', 'BETC', 'effective date', 'amount'],
    risks: ['CARS mismatch', 'invalid TAS-BETC', 'timing difference unresolved']
  },
  {
    id: 'ipac-buyer-seller-gl',
    layer: 'accounting',
    title: 'Buyer / Seller GL Posting',
    subtitle: 'AP, AR, expense, revenue, collections, eliminations',
    icon: 'GL',
    tags: ['gl', 'buyer', 'seller', 'elimination'],
    summary: 'Buyer and seller agencies post mirrored accounting effects so expense/payable and revenue/receivable/collection activity can reconcile across trading partners.',
    examples: ['buyer expense', 'seller revenue', 'receivable liquidation', 'payable clearing'],
    auditQuestions: ['Do buyer and seller amounts match?', 'Are reciprocal USSGL/trading partner attributes complete?', 'Are eliminations supportable?'],
    keyFields: ['GL document', 'USSGL', 'trading partner', 'buyer amount', 'seller amount', 'period'],
    risks: ['reciprocal mismatch', 'missing trading partner', 'elimination difference']
  },
  {
    id: 'ipac-reconciliation-control',
    layer: 'accounting',
    title: 'Trading Partner Reconciliation',
    subtitle: 'buyer/seller, CARS, FBWT, GTAS, dispute resolution',
    icon: 'RECON',
    tags: ['reconciliation', 'trading partner', 'fbwt', 'igt'],
    summary: 'Reconciliation compares buyer, seller, IPAC, CARS, FBWT, and reporting records to resolve trading partner differences.',
    examples: ['buyer/seller tie-out', 'FBWT tie-out', 'dispute aging', 'elimination support'],
    auditQuestions: ['Are buyer/seller differences aged and assigned?', 'Do IPAC and CARS records agree?', 'Are GTAS attributes consistent?'],
    keyFields: ['trading partner', 'difference', 'aging', 'owner', 'resolution status', 'support package'],
    risks: ['aged trading partner difference', 'unresolved FBWT difference', 'unsupported elimination']
  },
  {
    id: 'ipac-reporting-output',
    layer: 'reporting',
    title: 'IPAC / IGT Reporting',
    subtitle: 'settlement reports, status, query, data extracts',
    icon: 'RPT',
    tags: ['reporting', 'ipac', 'igt', 'status'],
    summary: 'IPAC/IGT reporting provides settlement status, query, extract, and partner data used in close, reconciliation, and audit.',
    examples: ['settlement report', 'query extract', 'partner report', 'status report'],
    auditQuestions: ['Do report outputs tie to settlement detail?', 'Are report filters and periods controlled?', 'Are extracts retained?'],
    keyFields: ['report ID', 'period', 'IPAC document', 'partner', 'amount', 'status'],
    risks: ['report/detail mismatch', 'extract not retained', 'period cutoff error']
  },
  {
    id: 'ipac-gtas-ddrs-output',
    layer: 'reporting',
    title: 'GTAS / DDRS IGT Support',
    subtitle: 'trial balance attributes, reciprocal categories, eliminations',
    icon: 'GTAS',
    tags: ['gtas', 'ddrs', 'igt', 'elimination'],
    summary: 'GTAS and DDRS support uses IPAC, buyer/seller GL, and reciprocal trading partner data for intragovernmental reporting and elimination support.',
    examples: ['GTAS attribute support', 'DDRS trading partner support', 'reciprocal category tie-out'],
    auditQuestions: ['Are reciprocal attributes complete?', 'Do GTAS balances agree with IPAC/GL support?', 'Are eliminations traceable?'],
    keyFields: ['TAS', 'USSGL', 'trading partner', 'reciprocal category', 'amount', 'period'],
    risks: ['attribute missing', 'GTAS/GL mismatch', 'unsupported reciprocal difference']
  },
  {
    id: 'ipac-fbwt-output',
    layer: 'statements',
    title: 'FBWT and Outlay/Collection Support',
    subtitle: 'agency-to-Treasury tie-out',
    icon: 'FBWT',
    tags: ['fbwt', 'outlay', 'collection', 'statement'],
    summary: 'IPAC settlement affects agency FBWT, collections, outlays, reimbursable activity, and statement support depending on buyer/seller role.',
    examples: ['FBWT reconciliation', 'collection support', 'outlay support', 'reimbursable support'],
    auditQuestions: ['Does FBWT tie to IPAC and CARS?', 'Are settlement timing differences explained?', 'Are buyer/seller impacts posted correctly?'],
    keyFields: ['ALC', 'TAS', 'IPAC document', 'FBWT amount', 'difference', 'period'],
    risks: ['FBWT mismatch', 'timing difference unsupported', 'wrong buyer/seller treatment']
  },
  {
    id: 'ipac-elimination-output',
    layer: 'statements',
    title: 'IGT Elimination Support',
    subtitle: 'reciprocal balances, buyer/seller tie-out, audit package',
    icon: 'ELIM',
    tags: ['elimination', 'igt', 'trading partner', 'audit'],
    summary: 'IGT elimination support uses buyer/seller reciprocal data, settlement evidence, and reconciliation packages to support governmentwide and DoD reporting.',
    examples: ['reciprocal tie-out', 'elimination package', 'trading partner confirmation', 'difference explanation'],
    auditQuestions: ['Are reciprocal balances supportable?', 'Can elimination amounts trace to settlement and GL?', 'Are differences explained?'],
    keyFields: ['trading partner', 'reciprocal USSGL', 'amount', 'difference', 'support package'],
    risks: ['unsupported elimination', 'unconfirmed trading partner', 'reciprocal mismatch']
  }
];

const ipacLineageScenarios = [
  {
    id: 'ipac-buyer-seller-settlement',
    short: 'Settlement',
    title: 'Buyer/Seller IPAC Settlement to Accounting and CARS',
    description: 'Traces a standard intragovernmental settlement from buyer/seller source records through IPAC, CARS classification, GL posting, and reporting.',
    path: ['ipac-buyer-erp', 'ipac-seller-erp', 'ipac-ginvoicing-context', 'ipac-core', 'ipac-settlement-detail', 'ipac-cars-classification', 'ipac-buyer-seller-gl', 'ipac-fbwt-output'],
    steps: [
      'Buyer and seller agencies establish agreement, order, performance, obligation, receivable, payable, or reimbursable context.',
      'IPAC transfers funds between federal trading partners with standardized descriptive data.',
      'Settlement detail preserves ALC, TAS, BETC, buyer, seller, order, performance, amount, and status.',
      'CARS classification and buyer/seller GL postings record central accounting and reciprocal accounting impacts.',
      'FBWT, outlay, collection, and statement support tie the settlement to Treasury and agency records.'
    ],
    exceptionTests: ['buyer/seller mismatch', 'missing order/performance support', 'invalid TAS-BETC', 'IPAC not posted to GL', 'FBWT mismatch']
  },
  {
    id: 'ipac-adjustment-reversal',
    short: 'Adjust',
    title: 'IPAC Adjustment, Reversal, or Dispute Resolution',
    description: 'Shows how corrections preserve the original settlement link and update both trading partners, Treasury classification, and reporting support.',
    path: ['ipac-settlement-detail', 'ipac-adjustment-detail', 'ipac-cars-classification', 'ipac-buyer-seller-gl', 'ipac-reconciliation-control', 'ipac-reporting-output'],
    steps: [
      'A disputed or incorrect settlement is identified from reconciliation, partner review, or reporting analysis.',
      'Adjustment detail links the correction to the original IPAC document and records reason, amount, owner, and status.',
      'CARS and agency GL records are corrected with valid TAS/BETC and partner attributes.',
      'Reconciliation confirms both buyer and seller posted the correction.',
      'Reports retain original and corrected activity for audit trail continuity.'
    ],
    exceptionTests: ['adjustment not linked to original', 'one-sided correction', 'aged dispute', 'invalid reclassification', 'reporting extract mismatch']
  },
  {
    id: 'ipac-igt-elimination',
    short: 'Eliminate',
    title: 'IPAC and Trading Partner Data to IGT Elimination Support',
    description: 'Connects settlement records to reciprocal buyer/seller balances, GTAS/DDRS attributes, and elimination packages.',
    path: ['ipac-ginvoicing-context', 'ipac-core', 'ipac-settlement-detail', 'ipac-reconciliation-control', 'ipac-gtas-ddrs-output', 'ipac-elimination-output'],
    steps: [
      'G-Invoicing/IPAC data establishes partner, order, performance, and settlement support.',
      'Settlement detail provides the transaction-level basis for reciprocal buyer/seller activity.',
      'Trading partner reconciliation identifies differences and preserves explanations.',
      'GTAS/DDRS reporting uses reciprocal and trading partner attributes for IGT support.',
      'Elimination packages tie reported balances to IPAC, GL, and partner evidence.'
    ],
    exceptionTests: ['trading partner attribute missing', 'reciprocal amount mismatch', 'elimination unsupported', 'GTAS attribute not tied to GL', 'partner confirmation missing']
  }
];

const ipacSupportServices = [
  { title: 'Settlement Execution', detail: 'IPAC document creation, buyer/seller attributes, ALC, TAS, BETC, amount, status, and standardized descriptive data.' },
  { title: 'G-Invoicing Alignment', detail: 'Agreement, order, performance, settlement validation, transition from legacy IGT processes, and partner coordination.' },
  { title: 'CARS and Treasury Reporting', detail: 'Central accounting classification, CARS transaction support, FBWT tie-out, and timing-difference resolution.' },
  { title: 'Buyer/Seller Accounting', detail: 'Expense, revenue, payable, receivable, collection, liquidation, USSGL, reciprocal attributes, and GL reconciliation.' },
  { title: 'Trading Partner Reconciliation', detail: 'Buyer/seller tie-outs, disputes, reversals, adjustments, aged differences, and resolution evidence.' },
  { title: 'IGT Elimination Support', detail: 'GTAS/DDRS trading partner attributes, reciprocal categories, elimination packages, and governmentwide/DoD reporting support.' }
];

const ipacCaveats = [
  'IPAC is a Treasury Fiscal Service application used governmentwide, not a DoD-owned accounting system. This page models the DoD FM relationship to IPAC settlement, CARS, FBWT, GTAS/DDRS, and IGT eliminations.',
  'Treasury describes G-Invoicing as the long-term IGT buy/sell solution and IPAC as the funds-transfer mechanism with standardized descriptive data; exact agency implementation patterns vary.',
  'Current IPAC file formats, interface payloads, validations, and report access require current Treasury/Fiscal Service documentation and authorized system access.',
  'Feeder counts are modeled source/partner categories represented in this blueprint, not a certified production interface inventory.'
];

const ipacSources = [
  { name: 'Treasury Intragovernmental Transactions / IPAC', url: 'https://fiscal.treasury.gov/intragov/' },
  { name: 'Treasury CARS', url: 'https://fiscal.treasury.gov/accounting/central-accounting-reporting-system-cars' },
  { name: 'Treasury GTAS', url: 'https://fiscal.treasury.gov/accounting/government-wide-treasury-account-symbol-gtas' },
  { name: 'DoD FMR', url: 'https://comptroller.defense.gov/FMR/' }
];

const mocasLayers = [
  { id: 'source', label: 'Contract, Funding, and Acceptance Sources', short: 'Source', description: 'Contract awards, modifications, funding lines, DCMA administration, receipt/acceptance, invoices, and ERP obligation records.' },
  { id: 'capabilities', label: 'MOCAS and Contract Administration Capabilities', short: 'Core', description: 'MOCAS legacy contract administration/payment support, DCMA administration controls, DFAS payment, and contract financing support.' },
  { id: 'transactions', label: 'Contract Payment Detail', short: 'Detail', description: 'PIID, CLIN, ACRN, invoice, receiving, acceptance, progress payment, liquidation, financing, and voucher detail.' },
  { id: 'accounting', label: 'Accounting and Control Layer', short: 'Accounting', description: 'Funds control, obligation/liquidation accounting, AP, expense, outlay, payment certification, and contract reconciliation.' },
  { id: 'reporting', label: 'Treasury, ERP, and Contract Reporting', short: 'Reporting', description: 'DFAS payment outputs, accounting feeds, Treasury/CARS, contract administration reports, and close/audit outputs.' },
  { id: 'statements', label: 'Contract Liability, Outlay, and Audit Outputs', short: 'Statements', description: 'Obligation and ULO support, advances/contract financing, expenses, outlays, FBWT, and contract-file audit packages.' }
];

const mocasNodes = [
  {
    id: 'mocas-award-source',
    layer: 'source',
    title: 'Contract Award / Modification Source',
    subtitle: 'PIID, CLIN, ACRN, funding, period, terms',
    icon: 'AWD',
    tags: ['contract', 'award', 'modification', 'funding'],
    summary: 'Contract award and modification data establish the obligation, funding, line-item, payment, delivery, and administration context used by MOCAS and related systems.',
    examples: ['award', 'modification', 'CLIN/SLIN', 'ACRN funding line', 'payment instructions'],
    auditQuestions: ['Does payment trace to a valid award and funded line?', 'Are modifications reflected in the obligation and payment support?'],
    keyFields: ['PIID', 'mod number', 'CLIN', 'ACRN', 'funding citation', 'vendor', 'amount'],
    risks: ['award/payment mismatch', 'modification not posted', 'funding line missing']
  },
  {
    id: 'mocas-erp-obligation',
    layer: 'source',
    title: 'ERP Obligation Record',
    subtitle: 'funds control, obligation, ULO, accounting classification',
    icon: 'ERP',
    tags: ['erp', 'obligation', 'ulo', 'funds control'],
    summary: 'The agency ERP records funds control, obligation, ULO, AP, expense, and liquidation accounting that must reconcile to MOCAS/DFAS payment activity.',
    examples: ['obligation', 'ULO balance', 'AP record', 'expense posting', 'liquidation'],
    auditQuestions: ['Does ERP obligation agree to contract award and modifications?', 'Do payments liquidate the correct obligation?'],
    keyFields: ['ERP document', 'LOA', 'TAS', 'USSGL', 'PIID', 'CLIN', 'obligation amount', 'ULO'],
    risks: ['obligation mismatch', 'payment liquidates wrong line', 'stale ULO unsupported']
  },
  {
    id: 'mocas-wawf-source',
    layer: 'source',
    title: 'PIEE / WAWF Evidence',
    subtitle: 'invoice, receiving report, acceptance, combo document',
    icon: 'WAWF',
    tags: ['wawf', 'invoice', 'receipt', 'acceptance'],
    summary: 'PIEE/WAWF evidence provides invoice, receiving, and acceptance support for contract payment and three-way-match control where applicable.',
    examples: ['vendor invoice', 'receiving report', 'acceptance document', 'combo document'],
    auditQuestions: ['Does payment have receipt and acceptance support?', 'Do invoice quantities and prices agree to contract terms?'],
    keyFields: ['invoice number', 'receiving report', 'acceptance date', 'PIID', 'CLIN', 'vendor', 'amount'],
    risks: ['payment without acceptance', 'invoice/contract mismatch', 'duplicate invoice']
  },
  {
    id: 'mocas-dcma-admin',
    layer: 'capabilities',
    title: 'DCMA Contract Administration',
    subtitle: 'quality, delivery, surveillance, payment authorization insight',
    icon: 'DCMA',
    tags: ['dcma', 'contract administration', 'delivery', 'quality'],
    summary: 'DCMA administers many defense contracts, monitors supplier performance, and authorizes large volumes of contractor payments through the acquisition lifecycle.',
    examples: ['administration action', 'delivery surveillance', 'quality assurance', 'payment authorization insight'],
    auditQuestions: ['Is administration evidence complete?', 'Did authorized delivery/performance support payment?', 'Are contract changes controlled?'],
    keyFields: ['contract admin office', 'PIID', 'CAGE/UEI', 'delivery status', 'acceptance support', 'payment status'],
    risks: ['administration evidence missing', 'delivery/performance not supported', 'unauthorized payment']
  },
  {
    id: 'mocas-core',
    layer: 'capabilities',
    title: 'MOCAS',
    subtitle: 'Mechanization of Contract Administration Services',
    icon: 'MOCAS',
    tags: ['mocas', 'contract administration', 'payment', 'legacy'],
    summary: 'MOCAS is modeled as a legacy DoD contract administration and payment-support system for administered contracts, complex payment instructions, financing, and liquidation support.',
    examples: ['contract payment record', 'progress payment support', 'financing liquidation', 'contract admin payment data'],
    auditQuestions: ['Does MOCAS contract/payment detail reconcile to award, invoice, acceptance, DFAS, and ERP accounting?', 'Are financing liquidations correct?'],
    keyFields: ['PIID', 'CLIN', 'ACRN', 'invoice', 'payment amount', 'financing balance', 'liquidation amount'],
    risks: ['legacy detail not reconciled', 'financing liquidation error', 'contract/payment mismatch']
  },
  {
    id: 'mocas-dfas-payment',
    layer: 'capabilities',
    title: 'DFAS Payment Execution',
    subtitle: 'certified voucher, disbursement, payment status',
    icon: 'DFAS',
    tags: ['dfas', 'payment', 'disbursing', 'voucher'],
    summary: 'DFAS payment execution converts certified contract payment support into disbursement, payment status, accounting feeds, and Treasury reporting.',
    examples: ['certified contract voucher', 'EFT payment', 'payment status', 'disbursing record'],
    auditQuestions: ['Does DFAS payment match MOCAS/invoice support?', 'Did the payment post to ERP and Treasury correctly?'],
    keyFields: ['voucher', 'payment date', 'payee', 'amount', 'DSSN/ALC', 'PIID', 'invoice'],
    risks: ['payment not matched to invoice', 'disbursing/accounting mismatch', 'duplicate or improper payment']
  },
  {
    id: 'mocas-contract-detail',
    layer: 'transactions',
    title: 'Contract Line and Funding Detail',
    subtitle: 'PIID, CLIN, SLIN, ACRN, fund cite, ceiling, terms',
    icon: 'LINE',
    tags: ['detail', 'contract line', 'funding', 'ACRN'],
    summary: 'Line and funding detail preserves the relationship among contract terms, funds, obligated amounts, invoices, payments, and remaining balances.',
    examples: ['CLIN detail', 'ACRN funding', 'delivery schedule', 'payment terms'],
    auditQuestions: ['Can every payment line trace to contract/funding line?', 'Are ceilings and funding limitations enforced?'],
    keyFields: ['PIID', 'CLIN', 'SLIN', 'ACRN', 'fund cite', 'ceiling', 'obligated amount'],
    risks: ['line-level support lost', 'wrong ACRN charged', 'overpayment against ceiling']
  },
  {
    id: 'mocas-invoice-payment-detail',
    layer: 'transactions',
    title: 'Invoice, Acceptance, and Payment Detail',
    subtitle: 'invoice, receiving, acceptance, voucher, disbursement',
    icon: 'INV',
    tags: ['invoice', 'acceptance', 'payment', 'voucher'],
    summary: 'Invoice and payment detail ties WAWF/receipt/acceptance evidence to MOCAS/DFAS payment records and voucher-level disbursement.',
    examples: ['invoice line', 'receiving report', 'acceptance', 'voucher', 'disbursement line'],
    auditQuestions: ['Does each paid invoice have acceptance evidence?', 'Can payment be traced from invoice to voucher and Treasury?'],
    keyFields: ['invoice', 'receiving report', 'acceptance date', 'voucher', 'payment ID', 'amount'],
    risks: ['payment without acceptance', 'duplicate invoice', 'payment not traceable']
  },
  {
    id: 'mocas-financing-detail',
    layer: 'transactions',
    title: 'Contract Financing and Liquidation Detail',
    subtitle: 'progress payment, advance, financing balance, liquidation',
    icon: 'FIN',
    tags: ['contract financing', 'progress payment', 'liquidation', 'advance'],
    summary: 'Contract financing detail tracks progress payments, performance-based payments, advances, liquidation rates, financing balances, and final liquidation.',
    examples: ['progress payment', 'advance payment', 'performance-based payment', 'liquidation schedule'],
    auditQuestions: ['Are financing payments authorized and liquidated correctly?', 'Does financing balance reconcile to contract/payment records?'],
    keyFields: ['financing type', 'rate', 'liquidation amount', 'balance', 'invoice', 'PIID'],
    risks: ['financing overpayment', 'liquidation error', 'unsupported advance balance']
  },
  {
    id: 'mocas-certification-control',
    layer: 'accounting',
    title: 'Payment Certification and Match Control',
    subtitle: 'contract, funding, invoice, acceptance, voucher',
    icon: 'CERT',
    tags: ['certification', 'match', 'payment', 'control'],
    summary: 'Payment certification validates contract terms, funding, invoice, receiving/acceptance, financing, and entitlement before disbursement.',
    examples: ['pre-payment validation', 'three-way match', 'financing validation', 'certified voucher'],
    auditQuestions: ['Was the payment properly certified?', 'Were contract, funding, invoice, and acceptance matched?', 'Were exceptions resolved before payment?'],
    keyFields: ['certifier', 'voucher', 'match status', 'exception', 'approval date', 'support package'],
    risks: ['improper certification', 'match exception ignored', 'support package incomplete']
  },
  {
    id: 'mocas-accounting-feed',
    layer: 'accounting',
    title: 'ERP Accounting Feed',
    subtitle: 'obligation liquidation, expense, AP clearing, outlay',
    icon: 'GL',
    tags: ['accounting', 'erp', 'liquidation', 'outlay'],
    summary: 'Accounting feeds update ERP obligation liquidation, AP clearing, expense, outlay, and contract financing balances based on payment activity.',
    examples: ['liquidation posting', 'AP clearing', 'expense posting', 'outlay record'],
    auditQuestions: ['Did payment liquidate the correct obligation?', 'Does ERP accounting agree to MOCAS/DFAS?', 'Are rejects resolved?'],
    keyFields: ['ERP document', 'PIID', 'CLIN', 'ACRN', 'USSGL', 'TAS', 'amount', 'batch'],
    risks: ['interface reject', 'wrong obligation liquidated', 'AP/outlay mismatch']
  },
  {
    id: 'mocas-reconciliation-control',
    layer: 'accounting',
    title: 'Contract-to-Payment Reconciliation',
    subtitle: 'award, MOCAS, WAWF, DFAS, ERP, Treasury',
    icon: 'RECON',
    tags: ['reconciliation', 'contract', 'payment', 'audit'],
    summary: 'Reconciliation compares award, MOCAS, WAWF, DFAS, ERP, and Treasury records to identify mismatches, unmatched payments, ULO differences, and financing-balance issues.',
    examples: ['contract payment tie-out', 'ULO reconciliation', 'unmatched invoice', 'financing balance reconciliation'],
    auditQuestions: ['Do all systems agree by contract line and amount?', 'Are differences aged and assigned?', 'Are corrections posted in all systems?'],
    keyFields: ['PIID', 'CLIN', 'source amount', 'payment amount', 'ERP amount', 'difference', 'owner'],
    risks: ['unmatched payment', 'ULO not supported', 'financing balance mismatch']
  },
  {
    id: 'mocas-treasury-reporting',
    layer: 'reporting',
    title: 'Treasury / CARS Payment Reporting',
    subtitle: 'ALC, TAS-BETC, CARS, FBWT',
    icon: 'CARS',
    tags: ['treasury', 'cars', 'fbwt', 'outlay'],
    summary: 'Contract disbursements are classified for Treasury/CARS reporting and reconciled to FBWT and component accounting.',
    examples: ['TAS-BETC classified payment', 'CARS record', 'FBWT tie-out', 'Treasury payment support'],
    auditQuestions: ['Does Treasury reporting agree to DFAS and ERP?', 'Is TAS-BETC classification correct?', 'Are FBWT differences explained?'],
    keyFields: ['ALC', 'TAS', 'BETC', 'payment ID', 'CARS reference', 'amount', 'period'],
    risks: ['Treasury mismatch', 'invalid classification', 'FBWT difference unresolved']
  },
  {
    id: 'mocas-contract-reporting',
    layer: 'reporting',
    title: 'Contract Administration Reports',
    subtitle: 'payment status, delivery, financing balance, ULO support',
    icon: 'RPT',
    tags: ['reporting', 'contract administration', 'ulo', 'status'],
    summary: 'Contract administration reporting provides payment status, delivery, financing, contract balance, ULO, and exception information for close and audit.',
    examples: ['payment status report', 'contract balance report', 'ULO support', 'financing report'],
    auditQuestions: ['Do reports tie to transaction detail?', 'Are stale balances reviewed?', 'Are financing balances supported?'],
    keyFields: ['report ID', 'PIID', 'CLIN', 'balance', 'payment status', 'period', 'exception'],
    risks: ['report/detail mismatch', 'stale ULO', 'unsupported financing balance']
  },
  {
    id: 'mocas-outlay-statement',
    layer: 'statements',
    title: 'Outlay / FBWT / SBR Support',
    subtitle: 'contract disbursement and budgetary reporting',
    icon: 'SBR',
    tags: ['outlay', 'fbwt', 'sbr', 'statement'],
    summary: 'MOCAS/DFAS contract payments support outlays, FBWT, SBR, ULO, expense, and statement assertions after reconciliation to ERP and Treasury.',
    examples: ['SBR outlay support', 'FBWT package', 'ULO rollforward', 'expense support'],
    auditQuestions: ['Can statement amounts trace to contract payment detail?', 'Are ULOs valid?', 'Does FBWT reconcile?'],
    keyFields: ['TAS', 'USSGL', 'PIID', 'outlay', 'ULO', 'FBWT balance', 'support package'],
    risks: ['outlay unsupported', 'ULO invalid', 'FBWT unreconciled']
  },
  {
    id: 'mocas-audit-package',
    layer: 'statements',
    title: 'Contract Payment Audit Package',
    subtitle: 'award to invoice to payment evidence',
    icon: 'AUD',
    tags: ['audit', 'evidence', 'contract file', 'payment'],
    summary: 'The audit package ties award, modification, funding, invoice, receipt/acceptance, MOCAS/DFAS payment, ERP accounting, Treasury reporting, and reconciliation evidence.',
    examples: ['award support', 'invoice/acceptance support', 'payment evidence', 'reconciliation package'],
    auditQuestions: ['Is the end-to-end support complete?', 'Can a sample trace across all systems?', 'Are exceptions documented and resolved?'],
    keyFields: ['sample ID', 'PIID', 'invoice', 'voucher', 'payment ID', 'ERP document', 'support package'],
    risks: ['incomplete contract file', 'sample cannot be traced', 'exception not resolved']
  }
];

const mocasLineageScenarios = [
  {
    id: 'mocas-award-payment',
    short: 'Award Pay',
    title: 'Contract Award to Invoice, MOCAS/DFAS Payment, and Outlay',
    description: 'Traces an administered contract payment from award/funding through WAWF evidence, MOCAS, DFAS payment, ERP accounting, Treasury reporting, and outlay support.',
    path: ['mocas-award-source', 'mocas-erp-obligation', 'mocas-wawf-source', 'mocas-core', 'mocas-invoice-payment-detail', 'mocas-dfas-payment', 'mocas-accounting-feed', 'mocas-outlay-statement'],
    steps: [
      'Award, modification, funding, and ERP obligation records establish the contract payment baseline.',
      'PIEE/WAWF evidence provides invoice, receiving, and acceptance support.',
      'MOCAS contract/payment detail supports the payment record for administered contracts.',
      'DFAS executes the certified payment and accounting feeds liquidate the obligation and record outlay.',
      'Treasury/CARS and statement support tie the payment to FBWT, SBR, and audit evidence.'
    ],
    exceptionTests: ['payment without acceptance', 'award/mod not reflected in ERP', 'MOCAS/DFAS mismatch', 'wrong obligation liquidated', 'outlay unsupported']
  },
  {
    id: 'mocas-financing-liquidation',
    short: 'Financing',
    title: 'Contract Financing Payment and Liquidation Control',
    description: 'Shows how progress, advance, or performance-based financing activity is authorized, paid, liquidated, reconciled, and reported.',
    path: ['mocas-award-source', 'mocas-core', 'mocas-financing-detail', 'mocas-certification-control', 'mocas-dfas-payment', 'mocas-accounting-feed', 'mocas-contract-reporting', 'mocas-audit-package'],
    steps: [
      'Contract terms authorize financing or progress-payment activity.',
      'MOCAS financing detail tracks rate, balance, invoice, payment, and liquidation information.',
      'Certification controls validate payment terms and entitlement before DFAS payment.',
      'Accounting feeds record financing balances, liquidation, expense, and outlay as applicable.',
      'Contract reports and audit packages preserve financing balance and liquidation evidence.'
    ],
    exceptionTests: ['unauthorized financing', 'liquidation rate error', 'financing balance unsupported', 'payment not liquidated', 'contract report mismatch']
  },
  {
    id: 'mocas-contract-recon',
    short: 'Recon',
    title: 'MOCAS Contract-to-Payment Reconciliation and Audit Trace',
    description: 'Compares award, WAWF, MOCAS, DFAS, ERP, Treasury, and contract reports to resolve mismatches and support audit samples.',
    path: ['mocas-award-source', 'mocas-contract-detail', 'mocas-invoice-payment-detail', 'mocas-reconciliation-control', 'mocas-treasury-reporting', 'mocas-contract-reporting', 'mocas-audit-package'],
    steps: [
      'Award and line/funding detail define the expected payment and accounting population.',
      'Invoice, acceptance, and payment detail provide the transaction population.',
      'Reconciliation compares MOCAS, WAWF, DFAS, ERP, and Treasury records by PIID/CLIN/ACRN and amount.',
      'Treasury and contract reports support FBWT, ULO, payment status, and close controls.',
      'Audit packages retain source-to-payment-to-statement evidence and exception resolution.'
    ],
    exceptionTests: ['unmatched payment', 'missing contract line support', 'Treasury mismatch', 'stale ULO', 'sample cannot trace end to end']
  }
];

const mocasSupportServices = [
  { title: 'Contract Administration', detail: 'Award/modification support, DCMA administration evidence, delivery/performance surveillance, and contract payment status.' },
  { title: 'Invoice and Acceptance Control', detail: 'PIEE/WAWF invoice, receipt, acceptance, three-way match, duplicate prevention, and payment certification support.' },
  { title: 'MOCAS Payment Support', detail: 'Legacy contract payment detail, PIID/CLIN/ACRN, progress payment, financing, liquidation, voucher support, and balance tracking.' },
  { title: 'DFAS Payment and Disbursing', detail: 'Certified voucher, disbursement, payment status, accounting interface, Treasury classification, and cash/outlay reporting.' },
  { title: 'Contract Reconciliation', detail: 'Award, MOCAS, WAWF, DFAS, ERP, Treasury, ULO, contract financing, and exception/difference reconciliation.' },
  { title: 'Audit Evidence', detail: 'Contract file, funding, modifications, invoices, acceptance, payments, accounting postings, CARS/FBWT, and statement-support packages.' }
];

const mocasCaveats = [
  'MOCAS is modeled as a legacy DoD contract administration and payment-support environment. Public information does not expose enough current technical detail to certify platform, file formats, or interface inventory.',
  'This page is process-accurate at the contract administration/payment-control level: award and funding, DCMA administration, invoice/acceptance, MOCAS/DFAS payment, ERP accounting, Treasury reporting, and audit support.',
  'DCMA and DFAS roles vary by contract type, delegation, payment office, service/component, and modernization state. Authoritative contract/payment-office procedures govern production usage.',
  'Feeder counts are modeled source/partner categories represented in this blueprint, not a certified production interface inventory.'
];

const mocasSources = [
  { name: 'DCMA About the Agency', url: 'https://www.dcma.mil/About-Us/' },
  { name: 'DFAS official site', url: 'https://www.dfas.mil/' },
  { name: 'DoD FMR Volume 5, Chapter 1 - Purpose, Organization, and Duties', url: 'https://comptroller.defense.gov/Portals/45/documents/fmr/current/05/05_01.pdf' },
  { name: 'DoD FMR', url: 'https://comptroller.defense.gov/FMR/' },
  { name: 'Treasury CARS', url: 'https://fiscal.treasury.gov/accounting/central-accounting-reporting-system-cars' }
];

const pieeLayers = [
  { id: 'source', label: 'Requirements, Award, and Contract Sources', short: 'Source', description: 'PIEE pre-award, award, contract repository, modification, delivery order, vendor, CAGE, DoDAAC, and procurement-data sources.' },
  { id: 'capabilities', label: 'PIEE Suite Applications and Workflow', short: 'Core', description: 'WAWF, EDA, MDO, GFP, IUID, JAM, SPM, closeout, solicitation, purchase-card, and operational support capabilities.' },
  { id: 'transactions', label: 'Procurement and Payment Documents', short: 'Detail', description: 'Invoice, receiving report, combo, cost voucher, progress payment, performance-based payment, property transfer, acceptance, COR, and closeout detail.' },
  { id: 'accounting', label: 'ERP GL, Entitlement, and Disbursing Handoff', short: 'Accounting', description: 'Interfaces and control points that connect PIEE evidence to accounting systems, pay entitlement, DFAS/disbursing systems, and Treasury classification.' },
  { id: 'reporting', label: 'Data Warehouse, Risk, and Reporting', short: 'Reporting', description: 'PIEE data warehouse, SPRS, Advana-facing data, EDA extracts, payment status, audit sampling, and enterprise reporting.' },
  { id: 'statements', label: 'Financial Statement and Audit Outputs', short: 'Statements', description: 'Obligation, ULO, AP, expense, asset, outlay, FBWT, SBR, SNC, GTAS/DDRS, and contract-file audit outputs.' }
];

const pieeNodes = [
  {
    id: 'piee-vendor-sam-source',
    layer: 'source',
    title: 'Vendor / CAGE / SAM Source',
    subtitle: 'Vendor identity, CAGE, UEI, registration, banking/tax context',
    icon: 'VEN',
    tags: ['vendor', 'CAGE', 'SAM', 'payee', 'registration'],
    summary: 'Vendor and entity information controls who can submit documents, which CAGE/UEI is associated with the transaction, and how payee evidence ties to contract and payment records.',
    examples: ['vendor registration', 'CAGE-controlled role', 'UEI reference', 'payee identity support'],
    auditQuestions: ['Does the payee match the award and invoice?', 'Is the vendor role properly scoped to CAGE or contractor DoDAAC?', 'Are payee changes controlled before payment?'],
    keyFields: ['CAGE', 'UEI', 'vendor name', 'TIN indicator', 'role', 'contractor DoDAAC', 'payee account reference'],
    risks: ['payee mismatch', 'unauthorized submitter', 'stale vendor data', 'duplicate vendor identity']
  },
  {
    id: 'piee-dodaac-admin-source',
    layer: 'source',
    title: 'DoDAAC / Role Administration',
    subtitle: 'GAM, CAM, location codes, roles, access control',
    icon: 'ROLE',
    tags: ['DoDAAC', 'roles', 'GAM', 'access', 'workflow'],
    summary: 'PIEE routes work by role, DoDAAC, CAGE, location code, and workflow responsibility, which makes access control part of the financial evidence chain.',
    examples: ['GAM role assignment', 'acceptor role', 'pay official role', 'auditor view-only', 'DoDAAC routing'],
    auditQuestions: ['Were users authorized for the contract/location?', 'Did segregation of duties hold across acceptance and payment?', 'Can role history support the transaction workflow?'],
    keyFields: ['DoDAAC', 'CAGE', 'role', 'group', 'location code', 'user ID', 'effective date'],
    risks: ['excessive role access', 'invalid routing', 'segregation-of-duties conflict']
  },
  {
    id: 'piee-solicitation-source',
    layer: 'source',
    title: 'PIEE Solicitation Module',
    subtitle: 'Solicitations, notices, responses, multiple-award contract support',
    icon: 'SOL',
    tags: ['solicitation', 'pre-award', 'MAC', 'requirements'],
    summary: 'The solicitation capability supports pre-award procurement activity, including public-facing solicitation search and multiple-award contract administration support represented in PIEE training material.',
    examples: ['solicitation', 'amendment', 'MAC record', 'vendor response support'],
    auditQuestions: ['Can award evidence trace back to solicitation and requirements?', 'Were amendments controlled?', 'Does the solicitation record support competition/award history?'],
    keyFields: ['solicitation number', 'amendment', 'MAC ID', 'offeror', 'response date', 'requirement reference'],
    risks: ['award lacks pre-award support', 'amendment not reflected', 'solicitation/award mismatch']
  },
  {
    id: 'piee-award-writing-source',
    layer: 'source',
    title: 'Contract Writing / Award Source',
    subtitle: 'ACWS, ECWM, CON-IT, external contract writing systems',
    icon: 'AWD',
    tags: ['award', 'contract writing', 'PDS', 'obligation', 'PIID'],
    summary: 'Award-writing systems create contract, CLIN, SLIN, ACRN, funding, delivery, and payment terms that flow into EDA/PIEE evidence and ERP obligation records.',
    examples: ['contract award', 'delivery order', 'task order', 'PDS award file', 'funding line'],
    auditQuestions: ['Does the ERP obligation agree to the award?', 'Do CLIN/ACRN lines support later WAWF invoices and receipts?', 'Were award changes distributed to downstream systems?'],
    keyFields: ['PIID', 'mod number', 'CLIN', 'SLIN', 'ACRN', 'fund cite', 'payment office DoDAAC', 'admin office DoDAAC'],
    risks: ['award not posted to ERP', 'missing funding line', 'invalid payment office', 'PDS interface error']
  },
  {
    id: 'piee-eda-core',
    layer: 'capabilities',
    title: 'EDA',
    subtitle: 'Electronic Data Access contract repository',
    icon: 'EDA',
    tags: ['EDA', 'contract repository', 'PIID', 'contract', 'PDS'],
    summary: 'EDA provides contract and award-document access used by WAWF, auditors, procurement users, and financial systems to confirm contract terms and line-level support.',
    examples: ['contract document', 'modification', 'delivery order', 'award attachment', 'PDS extract'],
    auditQuestions: ['Does WAWF pre-populated contract data agree to EDA?', 'Can an invoice sample trace to the authoritative award document?', 'Are modifications visible and current?'],
    keyFields: ['PIID', 'mod number', 'CLIN', 'contract file', 'vendor', 'admin office', 'payment office'],
    risks: ['contract document missing', 'EDA/WAWF mismatch', 'stale mod', 'line detail unavailable']
  },
  {
    id: 'piee-mdo-core',
    layer: 'capabilities',
    title: 'MDO',
    subtitle: 'Modifications and Delivery Orders',
    icon: 'MDO',
    tags: ['MDO', 'modification', 'delivery order', 'order'],
    summary: 'MDO supports creation and routing of modification and order documents, preserving award-change detail that must be reflected in EDA, WAWF, ERP obligations, and payment support.',
    examples: ['modification document', 'ARZ modification', 'delivery order', 'task order'],
    auditQuestions: ['Did the modification update funding, delivery, or payment terms?', 'Did ERP and WAWF use the same revised terms?', 'Are contractor reviews and approvals retained?'],
    keyFields: ['PIID', 'mod number', 'order number', 'CLIN', 'effective date', 'review status'],
    risks: ['modification not propagated', 'order paid under old terms', 'approval evidence missing']
  },
  {
    id: 'piee-wawf-core',
    layer: 'capabilities',
    title: 'WAWF',
    subtitle: 'Wide Area Workflow invoice, receipt, and acceptance',
    icon: 'WAWF',
    tags: ['WAWF', 'invoice', 'receiving', 'acceptance', 'payment'],
    summary: 'WAWF is the central PIEE payment-evidence workflow for invoices, receiving reports, acceptance, combo documents, cost vouchers, financing requests, and payment-office handoff.',
    examples: ['invoice', 'receiving report', 'invoice and receiving report combo', 'cost voucher', 'progress payment request'],
    auditQuestions: ['Does payment have invoice, receipt, and acceptance evidence?', 'Were rejects corrected before payment?', 'Do WAWF amounts match contract and ERP/AP records?'],
    keyFields: ['WAWF document number', 'invoice', 'receiving report', 'PIID', 'CLIN', 'CAGE', 'pay DoDAAC', 'amount'],
    risks: ['payment without acceptance', 'duplicate invoice', 'WAWF/AP mismatch', 'workflow reject unresolved']
  },
  {
    id: 'piee-myinvoice-core',
    layer: 'capabilities',
    title: 'myInvoice',
    subtitle: 'Invoice/payment status visibility',
    icon: 'INV',
    tags: ['myInvoice', 'payment status', 'vendor', 'invoice'],
    summary: 'myInvoice provides invoice and payment visibility for vendors and support users, helping reconcile WAWF submission, payment-office processing, and disbursement status.',
    examples: ['invoice status query', 'payment status', 'voucher lookup', 'rejection status'],
    auditQuestions: ['Does status agree with WAWF and entitlement systems?', 'Are rejected or suspended invoices resolved?', 'Can vendors and support teams trace invoice lifecycle status?'],
    keyFields: ['invoice number', 'voucher', 'PIID', 'pay office', 'status', 'payment date', 'amount'],
    risks: ['status mismatch', 'stale rejected invoice', 'payment inquiry unsupported']
  },
  {
    id: 'piee-gfp-core',
    layer: 'capabilities',
    title: 'GFP Module',
    subtitle: 'Government Furnished Property accountability',
    icon: 'GFP',
    tags: ['GFP', 'property', 'contract property', 'asset'],
    summary: 'GFP functionality supports contract-property visibility and movement for government-furnished property that may affect accountability, asset records, and audit evidence.',
    examples: ['GFP attachment', 'property shipment', 'property receipt', 'property transfer'],
    auditQuestions: ['Does GFP on the contract agree to property records?', 'Are transfers and receipts documented?', 'Does property evidence tie to asset/accountability systems?'],
    keyFields: ['PIID', 'GFP attachment', 'property ID', 'NSN', 'UID', 'quantity', 'custodian'],
    risks: ['GFP not recorded', 'asset accountability gap', 'property transfer unsupported']
  },
  {
    id: 'piee-iuid-core',
    layer: 'capabilities',
    title: 'IUID Registry',
    subtitle: 'Item unique identification and UID registry support',
    icon: 'IUID',
    tags: ['IUID', 'UID', 'property', 'asset'],
    summary: 'IUID registry support preserves item-unique identifiers used to track accountable property, delivered assets, GFP, and serially managed items.',
    examples: ['UID registration', 'item mark', 'serial record', 'asset identifier'],
    auditQuestions: ['Do delivered or GFP assets have required UID evidence?', 'Do UID records agree with property and acceptance data?', 'Can asset samples trace to contract and receipt?'],
    keyFields: ['UID', 'serial number', 'NSN', 'CAGE', 'PIID', 'acceptance date', 'asset record'],
    risks: ['missing UID', 'serial mismatch', 'asset not capitalized or tracked']
  },
  {
    id: 'piee-jam-core',
    layer: 'capabilities',
    title: 'JAM',
    subtitle: 'Joint Appointment Module for COR appointments',
    icon: 'JAM',
    tags: ['JAM', 'COR', 'appointment', 'oversight'],
    summary: 'JAM supports appointment workflow for Contracting Officer Representatives and related oversight roles, tying contract surveillance authority to the contract record.',
    examples: ['COR nomination', 'COR appointment', 'appointment letter', 'training record'],
    auditQuestions: ['Was the COR appointed before performing surveillance?', 'Does the appointment cover the contract and period?', 'Is training/qualification evidence retained?'],
    keyFields: ['appointment ID', 'COR', 'PIID', 'appointing official', 'effective date', 'termination date'],
    risks: ['unappointed COR activity', 'expired appointment', 'missing training evidence']
  },
  {
    id: 'piee-spm-core',
    layer: 'capabilities',
    title: 'SPM',
    subtitle: 'Surveillance and Performance Monitoring',
    icon: 'SPM',
    tags: ['SPM', 'COR', 'surveillance', 'performance'],
    summary: 'SPM supports COR surveillance and performance monitoring evidence, connecting contract performance to receipt/acceptance and payment support.',
    examples: ['surveillance plan', 'monthly COR report', 'performance note', 'contractor performance evidence'],
    auditQuestions: ['Does performance evidence support acceptance and payment?', 'Were deficiencies documented and resolved?', 'Does SPM align to COR appointments in JAM?'],
    keyFields: ['PIID', 'COR', 'surveillance period', 'performance status', 'report ID', 'finding'],
    risks: ['acceptance without performance evidence', 'surveillance gap', 'unresolved deficiency']
  },
  {
    id: 'piee-closeout-core',
    layer: 'capabilities',
    title: 'Contract Closeout',
    subtitle: 'Closeout checklist, final invoice, release, deobligation support',
    icon: 'CLOSE',
    tags: ['closeout', 'contract', 'ULO', 'deobligation'],
    summary: 'Contract closeout supports final administrative actions, final payment confirmation, property and patent/royalty clearances, deobligation support, and file completion.',
    examples: ['closeout checklist', 'final invoice', 'release of claims', 'deobligation request'],
    auditQuestions: ['Were all invoices paid or voided?', 'Were excess funds deobligated?', 'Is final acceptance and closeout evidence complete?'],
    keyFields: ['PIID', 'closeout status', 'final invoice', 'ULO balance', 'deobligation amount', 'close date'],
    risks: ['stale ULO', 'incomplete closeout', 'final payment not reconciled']
  },
  {
    id: 'piee-purchase-card-core',
    layer: 'capabilities',
    title: 'Purchase Card / GPC Interfaces',
    subtitle: 'Purchase-card group, Access Online, Oversight/IOD links',
    icon: 'GPC',
    tags: ['GPC', 'purchase card', 'micro-purchase', 'bank'],
    summary: 'PIEE training and system messages show purchase-card related capabilities and external platform links; financially, these provide micro-purchase, receiving, review, and bank/statement reconciliation context.',
    examples: ['purchase card receiving report', 'micro-purchase receiving report', 'GPC review', 'bank statement support'],
    auditQuestions: ['Does card activity have purchase, receipt, approval, and bank support?', 'Are split purchases or high-risk merchant codes reviewed?', 'Did accounting post to the right LOA?'],
    keyFields: ['cardholder', 'merchant', 'transaction ID', 'LOA', 'receiving report', 'statement date', 'amount'],
    risks: ['unsupported micro-purchase', 'split purchase', 'bank/accounting mismatch']
  },
  {
    id: 'piee-wawf-document-detail',
    layer: 'transactions',
    title: 'WAWF Document Types',
    subtitle: 'RR, invoice, combo, 2-in-1, cost voucher, grant, misc pay',
    icon: 'DOC',
    tags: ['document type', 'invoice', 'receiving report', 'combo', 'cost voucher'],
    summary: 'WAWF document types include receiving reports, invoices, invoice/receiving-report combos, 2-in-1 services invoices, cost vouchers, miscellaneous pay, grant vouchers, and specialty invoice types.',
    examples: ['Receiving Report', 'Invoice', 'Invoice and Receiving Report Combo', '2-in-1', 'Cost Voucher', 'Miscellaneous Pay Document'],
    auditQuestions: ['Is the right document type used for the contract/payment scenario?', 'Are required fields complete?', 'Did document type drive correct entitlement/accounting treatment?'],
    keyFields: ['document type', 'document number', 'invoice number', 'receiving report number', 'PIID', 'CLIN', 'amount'],
    risks: ['wrong document type', 'missing required field', 'incorrect entitlement route']
  },
  {
    id: 'piee-receipt-acceptance-detail',
    layer: 'transactions',
    title: 'Inspection, Receipt, and Acceptance',
    subtitle: 'Inspector, acceptor, LPO, pay official, digital workflow',
    icon: 'ACPT',
    tags: ['acceptance', 'inspection', 'receipt', 'LPO', 'pay official'],
    summary: 'Government users inspect, accept, reject, approve, review, certify, process, hold, recall, void, or resubmit WAWF documents depending on role and workflow.',
    examples: ['inspection', 'acceptance', 'rejection', 'LPO review', 'pay official review'],
    auditQuestions: ['Was acceptance performed by an authorized official?', 'Did acceptance occur before payment?', 'Were rejected documents corrected and resubmitted?'],
    keyFields: ['acceptor', 'inspector', 'LPO', 'acceptance date', 'rejection reason', 'workflow status'],
    risks: ['acceptance after payment', 'unauthorized acceptance', 'reject not resolved']
  },
  {
    id: 'piee-cost-financing-detail',
    layer: 'transactions',
    title: 'Cost Voucher and Contract Financing',
    subtitle: 'Cost voucher, CIF, PBP, progress payment, advance-like activity',
    icon: 'FIN',
    tags: ['cost voucher', 'CIF', 'PBP', 'progress payment', 'financing'],
    summary: 'PIEE/WAWF supports cost vouchers and contract-financing request types that feed entitlement and accounting differently from standard firm-fixed-price invoices.',
    examples: ['Cost Voucher', 'Commercial Item Financing', 'Performance Based Payment', 'Progress Payment'],
    auditQuestions: ['Is financing authorized by contract terms?', 'Are rates and liquidation logic correct?', 'Does ERP accounting track financing balances and liquidation?'],
    keyFields: ['payment request type', 'financing rate', 'liquidation amount', 'voucher', 'PIID', 'CLIN', 'amount'],
    risks: ['unauthorized financing', 'liquidation error', 'unsupported cost voucher']
  },
  {
    id: 'piee-property-detail',
    layer: 'transactions',
    title: 'Property and IUID Detail',
    subtitle: 'Property transfer, GFP, UID, serial, NSN, custody',
    icon: 'PROP',
    tags: ['property', 'GFP', 'IUID', 'asset', 'transfer'],
    summary: 'Property and IUID detail documents item movement, receipt, custody, unique identifiers, and contract-property evidence that can affect asset accountability and audit samples.',
    examples: ['Property Transfer Document', 'GFP receipt', 'UID registration', 'property shipment'],
    auditQuestions: ['Does property detail tie to contract and acceptance?', 'Are UID and asset records consistent?', 'Are custody transfers documented?'],
    keyFields: ['UID', 'NSN', 'serial', 'PIID', 'quantity', 'ship from', 'ship to', 'custodian'],
    risks: ['property not capitalized', 'custody mismatch', 'UID missing']
  },
  {
    id: 'piee-cor-surveillance-detail',
    layer: 'transactions',
    title: 'COR Surveillance Detail',
    subtitle: 'JAM appointment, SPM reports, performance evidence',
    icon: 'COR',
    tags: ['COR', 'JAM', 'SPM', 'surveillance', 'performance'],
    summary: 'COR surveillance detail connects appointment authority to performance monitoring, monthly reports, deficiencies, and acceptance/payment support for service contracts.',
    examples: ['COR appointment', 'surveillance report', 'performance note', 'deficiency record'],
    auditQuestions: ['Does performance support acceptance?', 'Was the COR appointed for the contract and period?', 'Are service-delivery issues reflected before payment?'],
    keyFields: ['COR', 'appointment ID', 'PIID', 'report period', 'performance status', 'finding'],
    risks: ['unsupported service acceptance', 'appointment gap', 'surveillance not retained']
  },
  {
    id: 'piee-edi-sftp-detail',
    layer: 'transactions',
    title: 'EDI / SFTP / Web Submission Detail',
    subtitle: 'Web, EDI, SFTP, GEX, accepted/rejected transaction notices',
    icon: 'EDI',
    tags: ['EDI', 'SFTP', 'GEX', 'submission', 'interface'],
    summary: 'Vendors can submit WAWF documents through web, EDI, or SFTP; EDI transactions flow through GEX and generate accepted, modified, or rejected transaction notices.',
    examples: ['web document', 'EDI file', 'SFTP file', 'GEX transaction', 'reject notice'],
    auditQuestions: ['Were interface rejects resolved?', 'Do batch counts reconcile to accepted WAWF documents?', 'Are modified data elements explained?'],
    keyFields: ['batch ID', 'transaction ID', 'submission method', 'accept/reject status', 'error code', 'document number'],
    risks: ['lost interface file', 'unresolved reject', 'batch/detail mismatch']
  },
  {
    id: 'piee-erp-gl-interface',
    layer: 'accounting',
    title: 'ERP / GL Systems',
    subtitle: 'GFEBS, Navy ERP, DAI, DEAMS, LMP, DLA EBS, CEFMS',
    icon: 'GL',
    tags: ['ERP', 'GL', 'GFEBS', 'Navy ERP', 'DAI', 'DEAMS'],
    summary: 'PIEE is not the GL; ERP/accounting systems record obligations, AP, accruals, expenses, assets, inventory, ULOs, and USSGL postings using PIEE evidence as support.',
    examples: ['ERP obligation', 'AP invoice posting', 'goods receipt', 'expense accrual', 'asset record'],
    auditQuestions: ['Does ERP accounting tie to PIEE award/invoice/acceptance?', 'Are interface rejects resolved?', 'Do GL balances reconcile to source detail?'],
    keyFields: ['ERP document', 'PIID', 'CLIN', 'invoice', 'receipt', 'USSGL', 'TAS', 'amount'],
    risks: ['PIEE/GL mismatch', 'invoice not posted', 'receipt not accrued', 'unsupported GL balance']
  },
  {
    id: 'piee-entitlement-handoff',
    layer: 'accounting',
    title: 'Entitlement / Pay Office Handoff',
    subtitle: 'DFAS entitlement, AP validation, voucher certification',
    icon: 'PAY',
    tags: ['entitlement', 'DFAS', 'pay office', 'voucher', 'certification'],
    summary: 'Accepted invoice and receiving evidence moves to entitlement/pay-office processing where the voucher is validated, matched, certified, and prepared for disbursement.',
    examples: ['entitlement record', 'voucher certification', 'pay office validation', 'suspended payment'],
    auditQuestions: ['Did entitlement use the same invoice and acceptance evidence?', 'Were suspensions/rejections resolved?', 'Was payment certified before disbursement?'],
    keyFields: ['pay office DoDAAC', 'voucher', 'invoice', 'WAWF document', 'entitlement status', 'certifier', 'amount'],
    risks: ['entitlement mismatch', 'suspended invoice aged', 'uncertified payment']
  },
  {
    id: 'piee-disbursing-handoff',
    layer: 'accounting',
    title: 'Disbursing Systems Handoff',
    subtitle: 'ADS, DCAS, DDS, payment status, cash accountability',
    icon: 'DISB',
    tags: ['disbursing', 'ADS', 'DCAS', 'DDS', 'outlay'],
    summary: 'Certified entitlement becomes a disbursement through DFAS/payment systems, with payment status, cash accountability, Treasury classification, and outlay records tied back to PIEE evidence.',
    examples: ['ADS payment', 'DCAS accountability', 'payment file', 'EFT status', 'disbursing voucher'],
    auditQuestions: ['Does the paid amount match certified PIEE/entitlement support?', 'Did payment status return to the invoice lifecycle?', 'Does disbursement reconcile to Treasury and FBWT?'],
    keyFields: ['voucher', 'payment ID', 'DSSN', 'ALC', 'payment date', 'method', 'amount', 'status'],
    risks: ['payment not tied to WAWF', 'duplicate disbursement', 'cash accountability mismatch']
  },
  {
    id: 'piee-cars-ipac-treasury',
    layer: 'accounting',
    title: 'Treasury / CARS / IPAC Classification',
    subtitle: 'TAS, BETC, ALC, FBWT, IGT settlement where applicable',
    icon: 'CARS',
    tags: ['CARS', 'Treasury', 'IPAC', 'FBWT', 'TAS-BETC'],
    summary: 'Payment and collection activity is classified in Treasury/CARS; IPAC may apply for intragovernmental settlements, and FBWT ties the agency accounting side to Treasury records.',
    examples: ['CARS transaction', 'TAS-BETC classification', 'IPAC settlement', 'FBWT tie-out'],
    auditQuestions: ['Does Treasury classification agree to ERP and disbursing records?', 'Are IPAC settlements tied to buyer/seller accounting?', 'Are FBWT differences explained?'],
    keyFields: ['ALC', 'TAS', 'BETC', 'IPAC document', 'CARS reference', 'FBWT difference', 'amount'],
    risks: ['invalid TAS-BETC', 'FBWT mismatch', 'IPAC not reconciled']
  },
  {
    id: 'piee-sdw-reporting',
    layer: 'reporting',
    title: 'PIEE / WAWF Data Warehouse',
    subtitle: 'SDW, extracts, status reporting, analytics',
    icon: 'SDW',
    tags: ['SDW', 'data warehouse', 'reporting', 'extract'],
    summary: 'PIEE/WAWF reporting and data warehouse capabilities support enterprise status, aging, audit selection, interface monitoring, and cross-system reconciliation.',
    examples: ['document status extract', 'invoice aging', 'acceptance report', 'interface report'],
    auditQuestions: ['Do report extracts tie to transactional records?', 'Are report periods and filters controlled?', 'Can extracts support audit sampling?'],
    keyFields: ['extract ID', 'report date', 'document number', 'status', 'PIID', 'amount', 'aging'],
    risks: ['extract not reproducible', 'report/detail mismatch', 'cutoff error']
  },
  {
    id: 'piee-sprs-reporting',
    layer: 'reporting',
    title: 'SPRS',
    subtitle: 'Supplier Performance Risk System',
    icon: 'SPRS',
    tags: ['SPRS', 'supplier risk', 'performance', 'reporting'],
    summary: 'SPRS is represented in PIEE glossary/training material as Supplier Performance Risk System; it informs procurement risk rather than directly posting GL or disbursement transactions.',
    examples: ['supplier risk indicator', 'performance risk', 'supplier information support'],
    auditQuestions: ['Was supplier risk considered where required?', 'Does risk data support procurement decisions?', 'Is SPRS treated as decision support rather than accounting source?'],
    keyFields: ['supplier', 'CAGE', 'risk indicator', 'assessment date', 'source reference'],
    risks: ['risk data ignored', 'risk source misused as accounting support', 'stale supplier assessment']
  },
  {
    id: 'piee-advana-reporting',
    layer: 'reporting',
    title: 'Advana / Enterprise Data Sharing',
    subtitle: 'OUSD data, analytics, oversight, cross-system matching',
    icon: 'DATA',
    tags: ['Advana', 'data', 'analytics', 'oversight'],
    summary: 'PIEE enhancement material references OUSD/Advana data; analytically, PIEE feeds can support enterprise matching of award, invoice, acceptance, payment, and accounting populations.',
    examples: ['enterprise data feed', 'cross-system match', 'exception analytics', 'audit population'],
    auditQuestions: ['Are data feeds reconciled to PIEE source records?', 'Are cross-system keys complete?', 'Can analytics tie back to authoritative transaction detail?'],
    keyFields: ['PIID', 'document number', 'invoice', 'pay office', 'ERP document', 'payment ID', 'amount'],
    risks: ['analytics not traceable', 'key mismatch', 'incomplete source population']
  },
  {
    id: 'piee-audit-file-reporting',
    layer: 'reporting',
    title: 'EDA / PIEE Audit File',
    subtitle: 'contract, invoice, receipt, acceptance, role history, status',
    icon: 'AUD',
    tags: ['audit', 'evidence', 'contract file', 'PIEE'],
    summary: 'The audit file combines EDA contract terms, MDO changes, WAWF invoice/receipt/acceptance, JAM/SPM oversight, GFP/IUID support, ERP accounting, and payment/disbursement evidence.',
    examples: ['contract file', 'invoice support', 'acceptance record', 'payment status', 'role history'],
    auditQuestions: ['Can a sample trace end to end?', 'Are all required source documents retained?', 'Are role and workflow actions defensible?'],
    keyFields: ['sample ID', 'PIID', 'invoice', 'receiving report', 'ERP document', 'payment ID', 'support package'],
    risks: ['incomplete support package', 'workflow gap', 'sample cannot trace']
  },
  {
    id: 'piee-ap-accrual-output',
    layer: 'statements',
    title: 'AP, Accrual, and Expense Support',
    subtitle: 'invoice receipt, acceptance, AP, expense, cutoff',
    icon: 'AP',
    tags: ['AP', 'accrual', 'expense', 'cutoff', 'statement'],
    summary: 'PIEE evidence supports AP, expense, receipt/accrual, and cutoff assertions by showing what was invoiced, received, accepted, rejected, or pending at period end.',
    examples: ['AP support', 'receipt accrual', 'expense support', 'period-end cutoff sample'],
    auditQuestions: ['Do AP and accrual balances tie to WAWF status?', 'Were accepted but unpaid invoices accrued?', 'Are rejected invoices excluded or disclosed properly?'],
    keyFields: ['invoice', 'acceptance date', 'ERP AP document', 'accrual amount', 'period', 'status'],
    risks: ['unrecorded liability', 'cutoff error', 'AP not supported by acceptance']
  },
  {
    id: 'piee-obligation-ulo-output',
    layer: 'statements',
    title: 'Obligation and ULO Support',
    subtitle: 'award, mod, delivery order, invoice, payment, closeout',
    icon: 'ULO',
    tags: ['obligation', 'ULO', 'SBR', 'closeout'],
    summary: 'Contract, modification, invoice, payment, and closeout records support obligation validity, ULO aging, deobligation decisions, and SBR assertions.',
    examples: ['ULO aging support', 'obligation rollforward', 'deobligation package', 'closeout support'],
    auditQuestions: ['Is the ULO still valid?', 'Do payments and closeout actions support remaining balances?', 'Were excess funds deobligated timely?'],
    keyFields: ['PIID', 'CLIN', 'obligation amount', 'payment amount', 'ULO balance', 'closeout status'],
    risks: ['stale ULO', 'obligation overstatement', 'deobligation not processed']
  },
  {
    id: 'piee-outlay-fbwt-output',
    layer: 'statements',
    title: 'Outlay and FBWT Support',
    subtitle: 'disbursement, CARS, Treasury, SBR, FBWT',
    icon: 'FBWT',
    tags: ['outlay', 'FBWT', 'Treasury', 'SBR'],
    summary: 'Disbursing and Treasury records tied to PIEE/ERP payment support provide evidence for outlays, FBWT, and Statement of Budgetary Resources reporting.',
    examples: ['outlay support', 'FBWT reconciliation', 'Treasury tie-out', 'CARS support'],
    auditQuestions: ['Can outlays trace to accepted invoices and disbursements?', 'Does FBWT reconcile to Treasury?', 'Are timing differences explained?'],
    keyFields: ['payment ID', 'voucher', 'ALC', 'TAS', 'BETC', 'FBWT amount', 'difference'],
    risks: ['outlay unsupported', 'FBWT difference unresolved', 'Treasury classification error']
  },
  {
    id: 'piee-asset-property-output',
    layer: 'statements',
    title: 'Asset and Property Support',
    subtitle: 'GFP, IUID, receiving, acceptance, capitalization',
    icon: 'ASSET',
    tags: ['asset', 'property', 'GFP', 'IUID', 'capitalization'],
    summary: 'GFP/IUID, receipt, and acceptance evidence supports property accountability and asset capitalization where procurement activity creates accountable or capital assets.',
    examples: ['capital asset support', 'GFP support', 'UID evidence', 'property receipt'],
    auditQuestions: ['Does asset capitalization tie to contract and acceptance?', 'Are GFP and UID records complete?', 'Is custody/accountability support retained?'],
    keyFields: ['UID', 'asset ID', 'PIID', 'acceptance date', 'capitalization amount', 'custodian'],
    risks: ['asset not recorded', 'property existence gap', 'capitalization misstatement']
  },
  {
    id: 'piee-ddrs-gtas-output',
    layer: 'statements',
    title: 'DDRS / GTAS Statement Support',
    subtitle: 'trial balance, USSGL, TAS, procurement-to-pay assertions',
    icon: 'GTAS',
    tags: ['DDRS', 'GTAS', 'trial balance', 'statement'],
    summary: 'ERP GL results supported by PIEE evidence roll through DDRS/GTAS reporting for AP, expense, assets, obligations, outlays, FBWT, and statement line support.',
    examples: ['trial balance support', 'GTAS attribute support', 'statement sample', 'DDRS tie-out'],
    auditQuestions: ['Do reported amounts trace to ERP and PIEE source evidence?', 'Are USSGL/TAS attributes complete?', 'Can sample selections bridge from statement to transaction?'],
    keyFields: ['TAS', 'USSGL', 'trial balance line', 'PIID', 'invoice', 'payment ID', 'support package'],
    risks: ['statement amount not traceable', 'attribute mismatch', 'support package incomplete']
  }
];

const pieeLineageScenarios = [
  {
    id: 'piee-p2p-to-gl-payment',
    short: 'P2P',
    title: 'Award to WAWF Acceptance, ERP GL, Entitlement, and Disbursement',
    description: 'Traces standard procure-to-pay from award source and EDA through WAWF invoice/receipt/acceptance, ERP GL posting, entitlement, DFAS disbursing, Treasury/CARS, and statement support.',
    path: ['piee-award-writing-source', 'piee-eda-core', 'piee-wawf-core', 'piee-wawf-document-detail', 'piee-receipt-acceptance-detail', 'piee-erp-gl-interface', 'piee-entitlement-handoff', 'piee-disbursing-handoff', 'piee-outlay-fbwt-output'],
    steps: [
      'Award-writing and EDA establish contract, CLIN, funding, vendor, payment-office, and delivery terms.',
      'The vendor or government submits WAWF invoice, receiving, combo, or related payment-support documents.',
      'Authorized government users inspect, accept, reject, review, certify, process, hold, recall, or void documents based on role and workflow.',
      'ERP/accounting systems post obligation liquidation, AP, accrual, expense, asset, inventory, or GL effects using PIEE evidence.',
      'Entitlement and DFAS/disbursing systems certify and pay the voucher, while CARS/Treasury and FBWT records support outlay reporting.'
    ],
    exceptionTests: ['award not in EDA', 'WAWF reject unresolved', 'acceptance missing', 'ERP AP mismatch', 'payment not tied to WAWF', 'FBWT difference unresolved']
  },
  {
    id: 'piee-financing-to-liquidation',
    short: 'Financing',
    title: 'Contract Financing and Cost Voucher to Liquidation and Statement Support',
    description: 'Shows how cost vouchers, progress payments, performance-based payments, and commercial-item financing connect to entitlement, GL, liquidation, and audit evidence.',
    path: ['piee-award-writing-source', 'piee-eda-core', 'piee-cost-financing-detail', 'piee-wawf-core', 'piee-entitlement-handoff', 'piee-erp-gl-interface', 'piee-disbursing-handoff', 'piee-obligation-ulo-output', 'piee-audit-file-reporting'],
    steps: [
      'Contract terms authorize cost voucher or financing payment types and define rates, ceilings, and liquidation rules.',
      'WAWF captures the cost voucher, progress payment, performance-based payment, or commercial-item financing request.',
      'Entitlement validates the request against contract terms, approvals, and available funding.',
      'ERP accounting records financing, liquidation, expense, AP, and outlay impacts as applicable.',
      'Audit evidence ties the financing request to contract authority, payment, liquidation, ULO, and statement support.'
    ],
    exceptionTests: ['financing not authorized', 'liquidation rate error', 'cost voucher unsupported', 'ERP balance mismatch', 'ULO stale']
  },
  {
    id: 'piee-property-asset',
    short: 'Property',
    title: 'GFP/IUID and Receipt Evidence to Asset or Property Accountability',
    description: 'Connects GFP, IUID, property transfer, receiving, and acceptance evidence to asset/property accounting and audit support.',
    path: ['piee-award-writing-source', 'piee-gfp-core', 'piee-iuid-core', 'piee-property-detail', 'piee-receipt-acceptance-detail', 'piee-erp-gl-interface', 'piee-asset-property-output'],
    steps: [
      'Award and GFP terms identify government-furnished or deliverable property requirements.',
      'GFP and IUID records preserve property identity, serial/UID, custody, and movement evidence.',
      'WAWF receipt and acceptance supports delivery or transfer confirmation.',
      'ERP/accountability systems update asset, property, inventory, or custody records.',
      'Asset/property statement support ties existence, completeness, rights, and valuation assertions to source evidence.'
    ],
    exceptionTests: ['GFP not recorded', 'UID missing', 'property transfer unsupported', 'asset not capitalized', 'custody mismatch']
  },
  {
    id: 'piee-cor-service-acceptance',
    short: 'COR',
    title: 'JAM/SPM COR Surveillance to Service Acceptance and Payment',
    description: 'Traces service-contract oversight from COR appointment and surveillance records to WAWF acceptance, ERP/AP, entitlement, payment, and audit package.',
    path: ['piee-jam-core', 'piee-spm-core', 'piee-cor-surveillance-detail', 'piee-wawf-core', 'piee-receipt-acceptance-detail', 'piee-erp-gl-interface', 'piee-entitlement-handoff', 'piee-audit-file-reporting'],
    steps: [
      'JAM establishes COR appointment authority for a contract, period, and role.',
      'SPM and COR records document surveillance and service performance evidence.',
      'WAWF acceptance reflects authorized confirmation of services or deliverables.',
      'ERP and entitlement processes use acceptance evidence to support AP, expense, and payment.',
      'Audit packages retain appointment, surveillance, acceptance, invoice, accounting, and payment evidence.'
    ],
    exceptionTests: ['COR not appointed', 'surveillance gap', 'acceptance not supported by performance', 'service invoice mismatch', 'audit package incomplete']
  },
  {
    id: 'piee-closeout-ulo',
    short: 'Closeout',
    title: 'Contract Closeout to ULO Validation and Deobligation',
    description: 'Shows how closeout, final invoice/payment, EDA/MDO, WAWF status, ERP balances, and ULO support connect.',
    path: ['piee-eda-core', 'piee-mdo-core', 'piee-closeout-core', 'piee-sdw-reporting', 'piee-erp-gl-interface', 'piee-obligation-ulo-output', 'piee-ddrs-gtas-output'],
    steps: [
      'EDA/MDO preserve the current contract and modification terms.',
      'Closeout confirms final delivery, final invoice/payment, property disposition, and administrative clearances.',
      'PIEE/WAWF reporting identifies open, rejected, final, or unpaid documents.',
      'ERP balances are reviewed for remaining ULOs, accruals, AP, or deobligation needs.',
      'DDRS/GTAS and statement support use the validated balance and closeout evidence.'
    ],
    exceptionTests: ['final invoice unpaid', 'stale ULO', 'deobligation not posted', 'closeout evidence incomplete', 'contract/mod mismatch']
  }
];

const pieeSupportServices = [
  { title: 'Award and Contract Repository', detail: 'Solicitation, award-writing, EDA contract access, MDO modifications/delivery orders, PDS data, attachments, CLIN/ACRN, vendor, and payment-office context.' },
  { title: 'WAWF Payment Evidence', detail: 'Invoice, receiving report, combo, cost voucher, financing request, inspection, acceptance, rejection, recall, void, pay official, and LPO workflow evidence.' },
  { title: 'Property and COR Oversight', detail: 'GFP, IUID, property transfers, JAM appointments, SPM surveillance, service performance evidence, acceptance support, and asset/property traceability.' },
  { title: 'ERP and GL Integration', detail: 'Obligation, AP, accrual, expense, asset, inventory, ULO, GL, USSGL, TAS, and interface reject reconciliation across GFEBS, Navy ERP, DAI, DEAMS, LMP, DLA EBS, CEFMS, and other accounting systems.' },
  { title: 'Entitlement and Disbursing', detail: 'Pay office, entitlement validation, voucher certification, DFAS payment, ADS/DCAS/DDS disbursing records, payment status, CARS/Treasury classification, and FBWT reconciliation.' },
  { title: 'Reporting and Audit', detail: 'PIEE/WAWF data warehouse, EDA extracts, SPRS risk support, Advana-facing analytics, document aging, audit sample packages, DDRS/GTAS support, and statement tie-outs.' }
];

const pieeCaveats = [
  'PIEE is a procurement and payment-evidence environment, not the general ledger. It supplies contract, invoice, receipt, acceptance, property, COR, and workflow evidence used by ERP/accounting, entitlement, and disbursing systems.',
  'The public PIEE pages and training material expose many suite applications and document types, but exact production interfaces, agency-specific configurations, and pay-office routing require authorized DoD/PIEE documentation.',
  'Some modules are internal, evolving, or interface-driven. This blueprint is a business-process architecture view intended to explain GL and disbursement relationships, not a system security architecture.',
  'Feeder counts are modeled source/partner categories represented in this blueprint, not a certified production interface inventory.'
];

const pieeSources = [
  { name: 'PIEE login and public system messages', url: 'https://piee.eb.mil/' },
  { name: 'PIEE Web Based Training', url: 'https://pieetraining.eb.mil/wbt/' },
  { name: 'PIEE Document List', url: 'https://pieetraining.eb.mil/wbt/xhtml/wbt/portal/overview/PIEEDocumentList.xhtml' },
  { name: 'WAWF Functional Information', url: 'https://piee.eb.mil/xhtml/unauth/web/homepage/functionalInfo.xhtml' },
  { name: 'PIEE Role List', url: 'https://pieetraining.eb.mil/wbt/xhtml/wbt/portal/overview/PIEERoleList.xhtml' },
  { name: 'PIEE Glossary', url: 'https://pieetraining.eb.mil/wbt/xhtml/wbt/portal/overview/Glossary.xhtml' },
  { name: 'DFAS official site', url: 'https://www.dfas.mil/' },
  { name: 'Treasury CARS', url: 'https://fiscal.treasury.gov/accounting/central-accounting-reporting-system-cars' }
];

const treasuryCloseLayers = [
  { id: 'source', label: '1. Source, Cash, and Subledger Events', short: 'Source', description: 'ERP feeder events, disbursing activity, collections, IPAC, subledgers, and audit source evidence before financial reporting begins.' },
  { id: 'capabilities', label: '2. DoD Close and Treasury Control Systems', short: 'Core', description: 'Component ERPs, disbursing/cash systems, CARS, DDRS, GTAS, IPAC, and FBWT reconciliation control points.' },
  { id: 'transactions', label: '3. Trial Balance and Treasury Detail', short: 'Detail', description: 'ATB lines, DDRS trial balances, CARS transactions, TAS-BETC, FBWT differences, IGT differences, and close adjustment detail.' },
  { id: 'accounting', label: '4. Adjustment and Certification Loop', short: 'Adjust', description: 'Supported journal vouchers, GTAS edits, CARS tie-outs, FBWT/IGT corrections, DDRS consolidation updates, re-submission, and certification.' },
  { id: 'reporting', label: '5. DoD and Treasury Reporting Outputs', short: 'Reports', description: 'DoD AFR/statements, SBR, DDRS outputs, GTAS status, MTS, Combined Statement, and Treasury Financial Report support.' },
  { id: 'statements', label: '6. Final Statements and Audit Assertions', short: 'Final', description: 'Agency financial statements, SBR, governmentwide Financial Report, FBWT, IGT eliminations, opinion support, and source-to-statement audit trail.' }
];

const treasuryCloseNodes = [
  {
    id: 'close-erp-subledger-source',
    layer: 'source',
    title: 'ERP / Feeder / Subledger UoT',
    subtitle: 'GFEBS, Navy ERP, DAI, DEAMS, LMP, DLA EBS, CEFMS, legacy sources',
    icon: 'ERP',
    tags: ['erp', 'feeder', 'subledger', 'uot', 'source'],
    summary: 'The close begins with agency source populations: obligations, receivables, payables, accruals, expenses, assets, inventory, revenue, cost, and feeder-system detail.',
    examples: ['obligation line', 'AP invoice', 'AR bill', 'asset record', 'inventory movement', 'expense accrual'],
    auditQuestions: ['Is the Universe of Transactions complete?', 'Do subledgers reconcile to GL control accounts?', 'Are cutoff and accruals supported before DDRS/GTAS submission?'],
    keyFields: ['source system', 'document ID', 'TAS', 'USSGL', 'LOA', 'period', 'amount', 'support package'],
    risks: ['incomplete UoT', 'subledger/GL mismatch', 'unsupported accrual', 'late feeder activity']
  },
  {
    id: 'close-disbursing-source',
    layer: 'source',
    title: 'Disbursing and Cash Activity',
    subtitle: 'ADS, DDS, DCAS, vouchers, deposits, collections, returns',
    icon: 'CASH',
    tags: ['disbursing', 'cash', 'ADS', 'DCAS', 'DDS', 'outlay'],
    summary: 'Disbursing and cash accountability records provide the payment, collection, return, cancellation, and voucher evidence that must reconcile to accounting and Treasury.',
    examples: ['certified voucher', 'EFT payment', 'collection', 'return', 'deposit', 'cash accountability record'],
    auditQuestions: ['Do payments and collections tie to ERP accounting?', 'Do cash accountability records tie to CARS/Treasury?', 'Are returns and cancellations corrected?'],
    keyFields: ['voucher', 'DSSN', 'ALC', 'TAS', 'BETC', 'payment ID', 'deposit ID', 'amount'],
    risks: ['unmatched disbursement', 'cash accountability difference', 'CARS classification mismatch']
  },
  {
    id: 'close-ipac-igt-source',
    layer: 'source',
    title: 'IPAC / G-Invoicing / IGT Activity',
    subtitle: 'Buyer/seller, trading partner, settlement, reciprocal balances',
    icon: 'IGT',
    tags: ['IPAC', 'G-Invoicing', 'IGT', 'trading partner', 'elimination'],
    summary: 'Intragovernmental settlements and reciprocal buyer/seller balances affect CARS, GTAS attributes, DDRS eliminations, and governmentwide reporting.',
    examples: ['IPAC settlement', 'G-Invoicing order', 'buyer payable', 'seller receivable', 'reciprocal category'],
    auditQuestions: ['Do buyer and seller records agree?', 'Are trading partner attributes complete?', 'Are IPAC settlements posted to the correct TAS/BETC?'],
    keyFields: ['IPAC document', 'buyer TAS', 'seller TAS', 'trading partner', 'BETC', 'reciprocal category', 'amount'],
    risks: ['one-sided IGT', 'trading partner mismatch', 'elimination difference']
  },
  {
    id: 'close-component-close-core',
    layer: 'capabilities',
    title: 'Component ERP Close',
    subtitle: 'Period close, reconciliations, preliminary trial balance',
    icon: 'CLOSE',
    tags: ['close', 'component', 'trial balance', 'erp'],
    summary: 'Components close local ERPs and reporting layers by reconciling subledgers, interface rejects, suspense, feeder totals, AP/AR, assets, payroll, travel, logistics, and cash activity.',
    examples: ['period close checklist', 'subledger tie-out', 'interface reject report', 'preliminary trial balance'],
    auditQuestions: ['Are all feeder/interface rejects resolved?', 'Do subledgers tie to GL?', 'Are unsupported suspense balances cleared or explained?'],
    keyFields: ['component', 'close period', 'trial balance version', 'reconciliation ID', 'owner', 'status'],
    risks: ['late feeder posting', 'unresolved suspense', 'trial balance not final']
  },
  {
    id: 'close-ddrs-core',
    layer: 'capabilities',
    title: 'DDRS Consolidation',
    subtitle: 'DoD/component statements, eliminations, notes, AFR support',
    icon: 'DDRS',
    tags: ['DDRS', 'consolidation', 'statements', 'AFR'],
    summary: 'DDRS consolidates component trial balances and reporting packages into DoD/component financial statements, note schedules, eliminations, and audit support.',
    examples: ['component trial balance load', 'DoD consolidation', 'statement crosswalk', 'note schedule', 'elimination entry'],
    auditQuestions: ['Do DDRS inputs tie to component GLs?', 'Are consolidation and elimination entries supported?', 'Do DDRS outputs agree to GTAS where required?'],
    keyFields: ['component', 'TAS', 'USSGL', 'trial balance version', 'statement line', 'adjustment ID'],
    risks: ['DDRS/ERP mismatch', 'unsupported consolidation JV', 'DDRS/GTAS mismatch']
  },
  {
    id: 'close-cars-core',
    layer: 'capabilities',
    title: 'CARS Treasury Central Accounting',
    subtitle: 'TAS-BETC, ALC, FBWT, MTS, Combined Statement',
    icon: 'CARS',
    tags: ['CARS', 'Treasury', 'TAS-BETC', 'FBWT', 'MTS'],
    summary: 'CARS is Treasury Fiscal Service system of record for government financial data, central accounting, payment/collection classification, FBWT support, MTS, and Combined Statement reporting.',
    examples: ['CARS transaction', 'TAS-BETC classification', 'Treasury balance', 'MTS support', 'Combined Statement support'],
    auditQuestions: ['Does agency accounting reconcile to CARS?', 'Are TAS-BETC classifications correct?', 'Are Treasury balances and agency FBWT differences resolved?'],
    keyFields: ['ALC', 'TAS', 'BETC', 'transaction ID', 'effective date', 'Treasury balance', 'amount'],
    risks: ['CARS/agency mismatch', 'invalid TAS-BETC', 'FBWT unreconciled']
  },
  {
    id: 'close-gtas-core',
    layer: 'capabilities',
    title: 'GTAS ATB Submission',
    subtitle: 'Agency adjusted trial balance, USSGL/TAS, budget execution',
    icon: 'GTAS',
    tags: ['GTAS', 'ATB', 'USSGL', 'TAS', 'budget execution'],
    summary: 'GTAS receives agency adjusted trial balance data with proprietary financial reporting and budget execution information used by Treasury, OMB, Congress, and the Financial Report.',
    examples: ['GTAS bulk file', 'ATB submission', 'reporting window', 'agency certification'],
    auditQuestions: ['Does GTAS tie to DDRS and component GL?', 'Are TAS/USSGL/domain attributes complete?', 'Are re-submissions controlled?'],
    keyFields: ['submission ID', 'TAS', 'USSGL', 'domain attribute', 'beginning balance', 'activity', 'ending balance'],
    risks: ['fatal edit', 'attribute missing', 'GTAS/DDRS mismatch']
  },
  {
    id: 'close-fbwt-detail',
    layer: 'transactions',
    title: 'FBWT Difference Detail',
    subtitle: 'Agency balance vs Treasury/CARS balance',
    icon: 'FBWT',
    tags: ['FBWT', 'reconciliation', 'Treasury', 'difference'],
    summary: 'Fund Balance with Treasury differences are a major feedback loop: DoD records must reconcile to Treasury/CARS balances or explain timing and correction items.',
    examples: ['agency FBWT balance', 'Treasury balance', 'reconciling item', 'aged difference', 'correction ticket'],
    auditQuestions: ['Are FBWT differences aged and owned?', 'Are timing differences valid?', 'Did corrections post in both agency and Treasury records?'],
    keyFields: ['TAS', 'agency balance', 'Treasury balance', 'difference', 'owner', 'age', 'correction status'],
    risks: ['unresolved FBWT difference', 'unsupported timing item', 'one-sided correction']
  },
  {
    id: 'close-gtas-atb-detail',
    layer: 'transactions',
    title: 'GTAS ATB Line Detail',
    subtitle: 'TAS, USSGL, domain attributes, balances, activity',
    icon: 'ATB',
    tags: ['GTAS', 'ATB', 'line detail', 'USSGL'],
    summary: 'GTAS line detail is where Treasury edit logic checks whether reported USSGL/TAS/attribute balances are structurally valid and reconcilable for governmentwide reporting.',
    examples: ['budgetary line', 'proprietary line', 'domain attribute line', 'abnormal balance'],
    auditQuestions: ['Can each ATB line trace to DDRS/GL?', 'Are beginning balances and activity mathematically consistent?', 'Are abnormal balances explained?'],
    keyFields: ['TAS', 'USSGL', 'attribute', 'beginning balance', 'debit activity', 'credit activity', 'ending balance'],
    risks: ['line not traceable', 'roll-forward error', 'unsupported abnormal balance']
  },
  {
    id: 'close-sbr-detail',
    layer: 'transactions',
    title: 'SBR Budgetary Detail',
    subtitle: 'budget authority, obligations, outlays, recoveries, ULOs',
    icon: 'SBR',
    tags: ['SBR', 'budgetary', 'obligation', 'outlay', 'ULO'],
    summary: 'SBR amounts are driven by budgetary USSGL activity and must reconcile obligations, expenditures, outlays, recoveries, unobligated balances, and ULOs to source and Treasury data.',
    examples: ['budget authority', 'obligation', 'upward/downward adjustment', 'outlay', 'recovery', 'ULO aging'],
    auditQuestions: ['Do SBR lines trace to budgetary USSGL detail?', 'Are ULOs still valid?', 'Do outlays reconcile to disbursing and CARS/Treasury?'],
    keyFields: ['TAS', 'budgetary USSGL', 'SBR line', 'obligation', 'outlay', 'recovery', 'ULO'],
    risks: ['SBR line unsupported', 'stale ULO', 'outlay/Treasury mismatch']
  },
  {
    id: 'close-igt-detail',
    layer: 'transactions',
    title: 'IGT and Elimination Detail',
    subtitle: 'buyer/seller, reciprocal category, IPAC, GTAS attributes',
    icon: 'ELIM',
    tags: ['IGT', 'elimination', 'IPAC', 'trading partner'],
    summary: 'IGT detail supports reciprocal eliminations in DDRS and governmentwide reporting; mismatches can require buyer/seller correction before final reporting.',
    examples: ['trading partner difference', 'IPAC settlement', 'reciprocal category', 'buyer/seller confirmation'],
    auditQuestions: ['Do buyer and seller balances agree?', 'Are reciprocal categories and trading partners complete?', 'Is elimination support retained?'],
    keyFields: ['trading partner', 'buyer amount', 'seller amount', 'reciprocal category', 'IPAC document', 'difference'],
    risks: ['elimination mismatch', 'missing trading partner', 'unconfirmed reciprocal balance']
  },
  {
    id: 'close-gtas-edit-control',
    layer: 'accounting',
    title: 'GTAS Edit Resolution',
    subtitle: 'fatal edits, warning edits, validation, re-submission',
    icon: 'EDIT',
    tags: ['GTAS', 'edits', 'fatal edit', 'validation'],
    summary: 'GTAS edits are not cosmetic. Fatal edits, warning edits, and accounting edits can force DoD to correct ERP/DDRS data, explain anomalies, or re-submit certified ATB versions.',
    examples: ['fatal edit', 'warning explanation', 'attribute correction', 're-submission'],
    auditQuestions: ['Were fatal edits cleared?', 'Were warnings reviewed and documented?', 'Do corrections trace to authorized JVs or source fixes?'],
    keyFields: ['edit code', 'severity', 'TAS', 'USSGL', 'owner', 'resolution', 'submission version'],
    risks: ['uncleared fatal edit', 'unsupported explanation', 'uncontrolled re-submission']
  },
  {
    id: 'close-supported-adjustment-control',
    layer: 'accounting',
    title: 'Supported Adjustment / JV Loop',
    subtitle: 'ERP JV, DDRS adjustment, CARS correction, GTAS re-submit',
    icon: 'JV',
    tags: ['adjustment', 'JV', 'DDRS', 'GTAS', 'CARS'],
    summary: 'Adjustments may happen before GTAS, after GTAS edits, after CARS/FBWT feedback, or during DDRS consolidation; every correction needs source support, approval, version control, and downstream re-tie.',
    examples: ['ERP correction JV', 'DDRS consolidation adjustment', 'CARS classification correction', 'GTAS re-submission'],
    auditQuestions: ['Is the adjustment supported by source evidence?', 'Did it update every affected system?', 'Was the re-submission certified and retained?'],
    keyFields: ['adjustment ID', 'source defect', 'affected system', 'TAS', 'USSGL', 'approval', 'version'],
    risks: ['manual JV masks source defect', 'one-sided correction', 'version mismatch']
  },
  {
    id: 'close-certification-control',
    layer: 'accounting',
    title: 'Certification and Version Control',
    subtitle: 'component certification, DDRS package, GTAS status, audit trail',
    icon: 'CERT',
    tags: ['certification', 'version', 'close', 'audit'],
    summary: 'Each round of changes requires controlled versions: component close package, DDRS consolidation, GTAS status, edit reports, management review, and certification evidence.',
    examples: ['component certification', 'DDRS package version', 'GTAS status report', 'edit report', 'review sign-off'],
    auditQuestions: ['Which version is final?', 'Who certified it?', 'Do audit packages match the certified version?'],
    keyFields: ['version', 'certifier', 'timestamp', 'submission status', 'support package', 'review status'],
    risks: ['audit package tied to wrong version', 'uncertified resubmission', 'late unsupported change']
  },
  {
    id: 'close-dod-afr-output',
    layer: 'reporting',
    title: 'DoD AFR / Component Statements',
    subtitle: 'Balance Sheet, SNC, SBR, Custodial where applicable, notes',
    icon: 'AFR',
    tags: ['DoD AFR', 'financial statements', 'SBR', 'notes'],
    summary: 'DoD/component financial statements are assembled from DDRS and supporting schedules, but they must remain reconcilable to GTAS, CARS, FBWT, and Treasury reporting feedback.',
    examples: ['Balance Sheet', 'Statement of Net Cost', 'SBR', 'notes', 'management discussion'],
    auditQuestions: ['Do statement lines tie to DDRS/GL?', 'Do SBR outlays and FBWT reconcile to Treasury?', 'Are late GTAS/CARS-driven adjustments reflected?'],
    keyFields: ['statement line', 'TAS', 'USSGL', 'DDRS amount', 'support schedule', 'adjustment ID'],
    risks: ['statement/GTAS mismatch', 'statement/CARS mismatch', 'unsupported note schedule']
  },
  {
    id: 'close-treasury-fr-output',
    layer: 'reporting',
    title: 'Treasury Financial Report Support',
    subtitle: 'GTAS, agency submissions, eliminations, governmentwide statements',
    icon: 'FR',
    tags: ['Financial Report', 'Treasury', 'governmentwide', 'GTAS'],
    summary: 'Treasury uses GTAS agency data, CARS central accounting, IGT information, and other reporting inputs to compile the Financial Report of the U.S. Government.',
    examples: ['agency FR data', 'governmentwide elimination', 'OMB/Treasury requirement', 'FR crosswalk'],
    auditQuestions: ['Does Treasury FR support tie to agency-certified GTAS?', 'Are governmentwide eliminations supported?', 'Are agency explanations retained?'],
    keyFields: ['agency', 'TAS', 'USSGL', 'FR line', 'elimination', 'amount', 'support package'],
    risks: ['governmentwide amount unsupported', 'elimination mismatch', 'agency explanation missing']
  },
  {
    id: 'close-mts-combined-output',
    layer: 'reporting',
    title: 'MTS / Combined Statement Outputs',
    subtitle: 'CARS receipts, outlays, balances, budgetary reports',
    icon: 'MTS',
    tags: ['MTS', 'Combined Statement', 'CARS', 'receipts', 'outlays'],
    summary: 'CARS produces and distributes budgetary reports such as the Monthly Treasury Statement and Combined Statement; these are Treasury-side budgetary/cash reporting comparators for DoD outlays and FBWT.',
    examples: ['Monthly Treasury Statement', 'Combined Statement', 'receipt/outlay report', 'TAS activity'],
    auditQuestions: ['Do CARS-based receipts/outlays agree to DoD accounting?', 'Are TAS-BETC classifications correct?', 'Are timing differences explained?'],
    keyFields: ['TAS', 'BETC', 'receipt/outlay', 'period', 'CARS reference', 'amount'],
    risks: ['receipt/outlay classification error', 'agency/Treasury timing difference', 'report line unsupported']
  },
  {
    id: 'close-final-sbr-statement',
    layer: 'statements',
    title: 'Final SBR',
    subtitle: 'budgetary resources, obligations, outlays, ULOs, recoveries',
    icon: 'SBR',
    tags: ['SBR', 'final statement', 'budgetary', 'outlay'],
    summary: 'The final SBR is a DoD statement, but its outlays and FBWT-related assertions must reconcile to disbursing and Treasury/CARS activity, while GTAS validates budgetary USSGL reporting.',
    examples: ['final SBR line', 'outlay tie-out', 'ULO validation', 'budgetary USSGL crosswalk'],
    auditQuestions: ['Do SBR lines trace to source and GTAS?', 'Do outlays tie to CARS/disbursing?', 'Are ULOs valid and supportable?'],
    keyFields: ['SBR line', 'TAS', 'USSGL', 'outlay', 'ULO', 'GTAS line', 'CARS reference'],
    risks: ['SBR not tied to GTAS', 'outlay mismatch', 'unsupported ULO']
  },
  {
    id: 'close-final-financial-statements',
    layer: 'statements',
    title: 'Final Financial Statements',
    subtitle: 'Balance Sheet, Net Cost, Changes in Net Position, notes',
    icon: 'FS',
    tags: ['financial statements', 'final', 'AFR', 'audit'],
    summary: 'The final DoD/component statements are issued after supported adjustments, DDRS consolidation, GTAS status, CARS/FBWT tie-outs, note schedules, and audit evidence are aligned.',
    examples: ['Balance Sheet', 'Statement of Net Cost', 'Statement of Changes in Net Position', 'note schedule'],
    auditQuestions: ['Do final lines tie to certified DDRS/GTAS versions?', 'Are cash and FBWT assertions reconciled to Treasury?', 'Are post-GTAS adjustments documented?'],
    keyFields: ['statement line', 'DDRS version', 'GTAS version', 'CARS tie-out', 'support package', 'audit sample'],
    risks: ['final package not version-controlled', 'Treasury feedback not reflected', 'audit trail incomplete']
  },
  {
    id: 'close-governmentwide-final',
    layer: 'statements',
    title: 'Governmentwide Financial Report',
    subtitle: 'Treasury compilation, OMB requirements, eliminations',
    icon: 'GFR',
    tags: ['Financial Report', 'governmentwide', 'Treasury', 'OMB'],
    summary: 'The Financial Report of the U.S. Government is Treasury’s governmentwide compilation; DoD’s data is one major agency input that must align with GTAS, CARS, IGT, and Treasury reporting requirements.',
    examples: ['FR agency input', 'governmentwide statement', 'elimination entry', 'agency explanation'],
    auditQuestions: ['Do DoD final submissions align to Treasury governmentwide reporting?', 'Are eliminations and reclassifications supported?', 'Are agency and Treasury versions consistent?'],
    keyFields: ['agency', 'FR line', 'TAS', 'USSGL', 'elimination', 'reclassification', 'amount'],
    risks: ['agency/governmentwide mismatch', 'unsupported reclassification', 'late Treasury adjustment']
  }
];

const treasuryCloseLineageScenarios = [
  {
    id: 'close-monthly-to-yearend',
    short: 'Step-by-step',
    title: 'Step-by-step Close: Source to DoD Statements and Treasury Financial Report',
    description: 'Shows the full loop from source events through DoD close, CARS/FBWT, DDRS, GTAS, edit feedback, supported adjustments, re-submission, DoD statements, and Treasury governmentwide reporting.',
    path: ['close-erp-subledger-source', 'close-disbursing-source', 'close-cars-core', 'close-component-close-core', 'close-ddrs-core', 'close-gtas-core', 'close-gtas-edit-control', 'close-supported-adjustment-control', 'close-certification-control', 'close-dod-afr-output', 'close-treasury-fr-output', 'close-final-financial-statements'],
    steps: [
      'Components close ERP/subledger populations and reconcile feeder totals, AP, AR, assets, budgetary accounts, and source evidence.',
      'Disbursing and cash activity from ADS/DDS/DCAS is matched to accounting and to Treasury/CARS classified activity.',
      'CARS/Treasury provides TAS-BETC central accounting, FBWT, MTS, and Combined Statement comparators that can disagree with agency records.',
      'Component trial balances and reporting packages are loaded or consolidated in DDRS for DoD/component statements and note schedules.',
      'Adjusted trial balance data is submitted to GTAS with TAS, USSGL, and required attributes.',
      'GTAS edits, CARS/FBWT tie-outs, and IGT differences create feedback. If the agency data is wrong, DoD corrects ERP/DDRS/GTAS; if Treasury classification is wrong, the CARS/TAS-BETC side is corrected.',
      'The cycle repeats until DDRS, GTAS, CARS/FBWT, IGT, and statement support are aligned and certified.',
      'DoD issues its AFR/component statements while Treasury uses GTAS/CARS/IGT data to compile the Financial Report of the U.S. Government.'
    ],
    exceptionTests: ['GTAS fatal edit', 'DDRS/GTAS mismatch', 'CARS/agency mismatch', 'FBWT difference aged', 'IGT reciprocal mismatch', 'unsupported post-close JV']
  },
  {
    id: 'close-sbr-outlay-fbwt',
    short: 'SBR/Cash',
    title: 'SBR Outlay and FBWT Reconciliation Loop',
    description: 'Focuses on how SBR outlays and FBWT are affected by disbursing, CARS, GTAS budgetary edits, and supported adjustments.',
    path: ['close-erp-subledger-source', 'close-disbursing-source', 'close-sbr-detail', 'close-cars-core', 'close-fbwt-detail', 'close-gtas-core', 'close-gtas-edit-control', 'close-supported-adjustment-control', 'close-final-sbr-statement'],
    steps: [
      'Budgetary activity in the ERP records authority, obligations, expenditures, recoveries, outlays, and ULO balances.',
      'Disbursing records provide payment/outlay evidence and cash-accountability support.',
      'CARS classifies payments and collections by ALC, TAS, and BETC and provides the Treasury-side central accounting view.',
      'FBWT reconciliation compares DoD/agency balances to Treasury/CARS balances and identifies timing, classification, or missing-posting differences.',
      'GTAS validates budgetary USSGL/TAS/attribute reporting; SBR line issues can trigger edits or agency analysis.',
      'Supported corrections are posted in ERP/DDRS, GTAS, CARS, or disbursing records depending on where the defect actually lives.',
      'The final SBR must tie budgetary detail, disbursing/outlay evidence, CARS/Treasury support, and certified GTAS reporting.'
    ],
    exceptionTests: ['outlay not tied to payment', 'FBWT difference unresolved', 'invalid BETC', 'budgetary USSGL edit', 'stale ULO', 'one-sided correction']
  },
  {
    id: 'close-igt-eliminations',
    short: 'IGT',
    title: 'IPAC/IGT to DDRS and Governmentwide Elimination Loop',
    description: 'Explains why intragovernmental activity creates back-and-forth between agency accounting, IPAC/CARS, GTAS attributes, DDRS eliminations, and Treasury governmentwide reporting.',
    path: ['close-ipac-igt-source', 'close-igt-detail', 'close-cars-core', 'close-ddrs-core', 'close-gtas-core', 'close-gtas-edit-control', 'close-supported-adjustment-control', 'close-treasury-fr-output', 'close-governmentwide-final'],
    steps: [
      'Buyer and seller agencies record reciprocal IGT activity from IPAC, G-Invoicing, orders, performance, bills, and collections.',
      'CARS/IPAC settlement and TAS-BETC classification create the Treasury-side cash and central accounting view.',
      'DDRS performs DoD-level eliminations and component reporting, but mismatches can remain if buyer/seller amounts or trading partner attributes differ.',
      'GTAS requires trading partner and reciprocal attributes for governmentwide reporting support.',
      'Treasury governmentwide compilation can identify reciprocal or elimination differences and send them back for agency explanation or correction.',
      'Corrections may require ERP/DDR JVs, GTAS resubmission, CARS/IPAC correction, or documented explanation when timing differences are valid.'
    ],
    exceptionTests: ['buyer/seller amount mismatch', 'missing trading partner', 'IPAC posted to wrong TAS', 'GTAS reciprocal attribute missing', 'unsupported elimination']
  },
  {
    id: 'close-post-gtas-adjustments',
    short: 'Adjustments',
    title: 'When Adjustments Happen Before and After GTAS/CARS Feedback',
    description: 'Separates pre-GTAS close entries from post-GTAS edit corrections, CARS/FBWT corrections, DDRS consolidation entries, and final statement updates.',
    path: ['close-component-close-core', 'close-ddrs-core', 'close-gtas-core', 'close-gtas-edit-control', 'close-fbwt-detail', 'close-supported-adjustment-control', 'close-certification-control', 'close-final-financial-statements'],
    steps: [
      'Before GTAS: components post normal close entries such as accruals, reclasses, feeder corrections, subledger tie-outs, and unsupported-balance cleanup.',
      'At DDRS: DoD or component reporting teams may post supported consolidation, elimination, or reporting adjustments.',
      'After GTAS edits: fatal or warning edits can force corrected USSGL/TAS/attribute mappings, abnormal-balance explanations, or source corrections.',
      'After CARS/FBWT feedback: agency/Treasury differences can force TAS-BETC correction, cash classification correction, ERP posting, or documented timing explanation.',
      'After Treasury governmentwide review: IGT, Financial Report crosswalk, or disclosure issues can force additional explanation or re-submission.',
      'Every adjusted version must be re-tied across source, DDRS, GTAS, CARS/FBWT, statements, and audit evidence before final issuance.'
    ],
    exceptionTests: ['post-GTAS JV lacks support', 'GTAS version not re-certified', 'DDRS not updated after ERP correction', 'CARS correction not reflected in FBWT', 'audit package tied to stale version']
  }
];

const treasuryCloseSupportServices = [
  { title: 'Close Calendar and Version Control', detail: 'Monthly and year-end close windows, component certification, DDRS package versions, GTAS submissions, edit reports, re-submissions, and final audit package versions.' },
  { title: 'Disbursing and Cash Reconciliation', detail: 'ADS/DDS/DCAS vouchers, collections, deposits, returns, cash accountability, CARS/TAS-BETC classification, FBWT, and outlay support.' },
  { title: 'DDRS and DoD Statement Production', detail: 'Component trial balances, consolidation, eliminations, SBR, Balance Sheet, Net Cost, Changes in Net Position, notes, and AFR support.' },
  { title: 'GTAS Submission and Edits', detail: 'Adjusted trial balance, TAS, USSGL, domain attributes, budgetary/proprietary balances, fatal edits, warning edits, status reports, and certification.' },
  { title: 'CARS/Treasury Central Accounting', detail: 'CARS transaction detail, TAS-BETC, ALC, FBWT, MTS, Combined Statement, CARS corrections, and agency-to-Treasury reconciliation.' },
  { title: 'Governmentwide Reporting Feedback', detail: 'Financial Report support, Treasury/OMB requirements, IGT eliminations, reciprocal differences, agency explanations, and final governmentwide compilation support.' }
];

const treasuryCloseCaveats = [
  'This blueprint models the business close and reporting interaction. It does not claim that Treasury directly edits DoD accounting records; rather, Treasury systems and reporting feedback identify differences that DoD or Treasury must correct in the appropriate system of record.',
  'DoD/component financial statements are produced through DoD reporting processes such as DDRS, but they must reconcile to Treasury-controlled central accounting, GTAS, CARS, FBWT, and governmentwide reporting requirements.',
  'CARS and GTAS are related but different: CARS is central accounting and cash/TAS-BETC transaction reporting; GTAS is adjusted trial balance and budget-execution reporting. Both can create feedback that changes the final DoD reporting package.',
  'Adjustment timing is controlled by policy, reporting windows, and audit governance. This page shows representative loops and control points, not a classified or system-specific production interface inventory.'
];

const treasuryCloseSources = [
  { name: 'Treasury GTAS', url: 'https://fiscal.treasury.gov/accounting/government-wide-treasury-account-symbol-gtas' },
  { name: 'Treasury CARS', url: 'https://fiscal.treasury.gov/accounting/central-accounting-reporting-system-cars' },
  { name: 'Treasury Financial Report resources', url: 'https://fiscal.treasury.gov/reports-statements/financial-report' },
  { name: 'Treasury Intragovernmental Transactions / IPAC', url: 'https://fiscal.treasury.gov/intragov/' },
  { name: 'Treasury USSGL', url: 'https://fiscal.treasury.gov/accounting/us-standard-general-ledger-ussgl' },
  { name: 'DoD Financial Management Regulation', url: 'https://comptroller.defense.gov/FMR/' },
  { name: 'DFAS official site', url: 'https://www.dfas.mil/' }
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
    profile: {
      whatItIs: 'GFEBS is the Army SAP-based general fund financial-management ERP used to record, control, and report appropriated-fund activity.',
      whoUsesIt: 'Army commands, resource managers, budget analysts, contracting and logistics partners, financial managers, DFAS support functions, and auditors use or rely on GFEBS data.',
      howItIsUsed: 'It supports funds management, procure-to-pay, cost management, reimbursables, real property, GL, trial balance, and financial-statement reporting.',
      currentStatus: 'Operational Army enterprise system; this page models public and representative SAP/GFEBS process patterns rather than installation-specific configuration.',
      whyItIsUsed: 'It standardizes Army financial execution, improves auditability, links business events to USSGL accounting, and supports Army/DoD reporting.',
      feederCount: 8,
      feederSystems: ['DTS', 'WAWF / PIEE', 'SPS / PD2 / EDA', 'DCPS / IPPS-A', 'GCSS-Army', 'LMP', 'AXOL / Bank / Disbursing', 'G-Invoicing / IPAC'],
      feederNote: 'The blueprint models 8 major feeder/peer source categories represented on the GFEBS page.'
    },
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
    slug: 'gcss-army',
    shortName: 'GCSS-Army',
    name: 'GCSS-Army',
    longName: 'GCSS-Army / Global Combat Support System-Army Blueprint',
    agency: 'Army',
    eyebrow: 'GCSS-Army blueprint for tactical logistics and finance lineage',
    description: 'Explore GCSS-Army as the Army tactical logistics ERP/SAP-style environment for supply, maintenance, property accountability, inventory, readiness, finance-interface reconciliation, and audit-ready logistics-to-statement traceability.',
    metric: '4',
    metricLabel: 'Core GCSS-Army lineage scenarios',
    metricDetail: 'Supply -> Maintenance -> GFEBS -> Statement',
    referenceImage: '/gcss-blueprint-reference.svg',
    referenceTitle: 'GCSS logistics-to-finance static blueprint reference',
    downloadLinks: [
      { label: 'Download SVG', href: '/gcss-blueprint-reference.svg' }
    ],
    profile: {
      whatItIs: 'GCSS-Army is modeled as the Army tactical logistics ERP/SAP-style system for unit supply, maintenance, property accountability, inventory, and readiness-related logistics events.',
      whoUsesIt: 'Army unit supply, SSA, maintenance, property book, sustainment, commanders, G-4/logistics staff, GFEBS/finance partners, DFAS/reporting stakeholders, and auditors rely on GCSS-Army data or outputs.',
      howItIsUsed: 'It records supply requests, receipts, issues, turn-ins, work orders, parts demand, equipment status, property accountability, inventory movements, and finance-facing logistics impacts.',
      currentStatus: 'Operational Army logistics system in this model; exact current modules, reports, interface names, and SAP configuration require authoritative Army GCSS-Army program documentation.',
      whyItIsUsed: 'It standardizes tactical logistics, improves readiness visibility, preserves source transaction evidence, and helps connect logistics events to GFEBS, reporting, and financial-statement support.',
      feederCount: 5,
      feederSystems: ['Unit Supply / SSA', 'Maintenance Shops / Motor Pool', 'Property Book / Hand Receipt', 'DLA / DAAS / DLMS / FED LOG', 'GFEBS / Financial Accounting'],
      feederNote: 'The blueprint models 5 major GCSS-Army source/partner categories; this is not a certified production interface count.'
    },
    layers: gcssLayers,
    nodes: gcssNodes,
    lineageScenarios: gcssLineageScenarios,
    supportServices: gcssSupportServices,
    caveats: gcssArmyCaveats,
    sources: gcssSources
  },
  {
    slug: 'lmp',
    shortName: 'LMP',
    name: 'LMP',
    longName: 'LMP / Logistics Modernization Program Blueprint',
    agency: 'Army',
    eyebrow: 'LMP blueprint for Army national logistics, depot maintenance, and AWCF finance',
    description: 'Explore LMP as the Army SAP-based national logistics ERP and working-capital logistics backbone, connecting AMC/depot events, wholesale supply, procurement, inventory, depot maintenance, AWCF costing, GFEBS/reporting handoffs, and source-to-statement audit evidence.',
    metric: '4',
    metricLabel: 'Core LMP lineage scenarios',
    metricDetail: 'Depot / Supply -> AWCF -> GL -> Statement',
    referenceImage: '/lmp-blueprint-reference.svg',
    referenceTitle: 'LMP static blueprint reference',
    downloadLinks: [
      { label: 'Download SVG', href: '/lmp-blueprint-reference.svg' }
    ],
    profile: {
      whatItIs: 'LMP is modeled as the Army Logistics Modernization Program, a SAP-based national logistics ERP supporting Army Materiel Command sustainment, wholesale supply, depot maintenance, inventory, procurement, and Army Working Capital Fund finance.',
      whoUsesIt: 'AMC life-cycle management commands, depots, arsenals, wholesale supply organizations, sustainment planners, contracting/procurement users, finance/working-capital users, GFEBS/reporting partners, DFAS support teams, and auditors rely on LMP data or outputs.',
      howItIsUsed: 'It records and controls national supply demand, customer orders, procurement, receipts, inventory movements, depot maintenance work orders, parts/labor cost, customer billing, AP/AR/GL, AWCF cost recovery, and reporting support.',
      currentStatus: 'Operational Army national logistics and financial-management environment in this model; exact modules, interfaces, reports, and modernization state require authoritative Army/LMP program documentation.',
      whyItIsUsed: 'It integrates Army sustainment logistics with working-capital finance so wholesale supply and depot maintenance can be planned, executed, costed, billed, reported, and audited from source transaction to statement.',
      feederCount: 7,
      feederSystems: ['AMC / Depot / Arsenal Events', 'DLA / DAAS / DLMS / FED LOG', 'Vendors / Contracting / PIEE-WAWF', 'GCSS-Army Tactical Demand', 'GFEBS / DFAS / Treasury Partners', 'Distribution / Shipment Partners', 'Customer / Program Demand Inputs'],
      feederNote: 'The blueprint models 7 major LMP source/partner categories; this is not a certified production interface count.'
    },
    layers: lmpLayers,
    nodes: lmpNodes,
    lineageScenarios: lmpLineageScenarios,
    supportServices: lmpSupportServices,
    caveats: lmpCaveats,
    sources: lmpSources
  },
  {
    slug: 'gcss-mc',
    shortName: 'GCSS-MC',
    name: 'GCSS-MC',
    longName: 'GCSS-MC / Global Combat Support System-Marine Corps Blueprint',
    agency: 'Marine Corps',
    eyebrow: 'GCSS-MC blueprint for Marine Corps logistics-to-finance lineage',
    description: 'Explore GCSS-MC as a Marine Corps logistics support and business-process backbone for supply, maintenance, property accountability, inventory, readiness, finance handoff, and audit evidence without overclaiming the public technical stack.',
    metric: '4',
    metricLabel: 'Core GCSS-MC lineage scenarios',
    metricDetail: 'Unit logistics -> Finance -> Statement',
    referenceImage: '/gcss-blueprint-reference.svg',
    referenceTitle: 'GCSS logistics-to-finance static blueprint reference',
    downloadLinks: [
      { label: 'Download SVG', href: '/gcss-blueprint-reference.svg' }
    ],
    profile: {
      whatItIs: 'GCSS-MC is modeled as the Marine Corps Global Combat Support System used for logistics support processes such as supply, maintenance, property accountability, inventory, and readiness-related data.',
      whoUsesIt: 'Marine Corps supply, maintenance, responsible-officer/property, logistics command, MAGTF support, finance-interface, reporting, program-support, and audit stakeholders rely on GCSS-MC records or outputs.',
      howItIsUsed: 'It supports Marine Corps requisitions, receipts, issues, maintenance work orders, equipment status, inventory/accountable property, logistics reporting, finance handoff, and evidence retention.',
      currentStatus: 'Public platform details are limited; this model treats GCSS-MC as an operational Marine Corps logistics business system and marks exact modules, stack, and interfaces as requiring Marine Corps authority.',
      whyItIsUsed: 'It gives Marine Corps units and logisticians a controlled transaction trail for mission logistics, readiness visibility, property accountability, and source evidence needed for finance and audit support.',
      feederCount: 5,
      feederSystems: ['Marine Unit Supply / Warehouse Inputs', 'Maintenance Shops', 'Responsible Officer / Property Inputs', 'DLA / DAAS / DLMS / FED LOG', 'SABRS / DoN Finance / DFAS Partners'],
      feederNote: 'The blueprint models 5 major GCSS-MC source/partner categories; this is not a certified production interface count.'
    },
    layers: gcssLayers,
    nodes: gcssNodes,
    lineageScenarios: gcssLineageScenarios,
    supportServices: gcssSupportServices,
    caveats: gcssMcCaveats,
    sources: gcssSources
  },
  {
    slug: 'stars',
    shortName: 'STARS',
    name: 'STARS Family',
    longName: 'STARS Family / Standard Accounting and Reporting System Blueprint',
    agency: 'Legacy Navy',
    eyebrow: 'STARS blueprint for Navy legacy accounting and reporting',
    description: 'Explore the STARS family as a Navy legacy accounting and reporting environment for field-level accounting, central consolidation, obligation and expenditure detail, suspense, journal vouchers, trial balances, Navy ERP transition support, and source-to-statement audit evidence.',
    metric: '4',
    metricLabel: 'Core STARS lineage scenarios',
    metricDetail: 'Legacy source -> STARS -> TB -> Statement',
    referenceImage: '/stars-blueprint-reference.svg',
    referenceTitle: 'STARS static blueprint reference',
    downloadLinks: [
      { label: 'Download SVG', href: '/stars-blueprint-reference.svg' }
    ],
    profile: {
      whatItIs: 'STARS is modeled as the Navy legacy Standard Accounting and Reporting System family used for accounting, reporting, consolidation, suspense, and historical transaction support before or alongside Navy ERP transition paths.',
      whoUsesIt: 'Legacy Navy accounting users, DFAS/reporting support teams, DON financial managers, migration and archive teams, close teams, JV preparers/reviewers, suspense cleanup owners, and auditors may rely on STARS data or outputs.',
      howItIsUsed: 'It supports field-level accounting, central consolidation, obligation and expenditure tracking, vendor pay impacts, payroll/travel accounting, suspense/reject processing, JVs, trial balances, DDRS/GTAS support, and archive lookup.',
      currentStatus: 'Modeled as legacy and transition-oriented. Public technical detail is limited, so exact variants, interface names, archive status, and system boundaries require authoritative Navy or DFAS documentation.',
      whyItIsUsed: 'It preserves legacy Navy accounting history and supports audit, beginning balances, UoT reconstruction, suspense cleanup, JV support, and reconciliation between historical activity and Navy ERP/reporting outputs.',
      feederCount: 6,
      feederSystems: ['Field Activity Inputs', 'Vendor Pay / Contract Sources', 'Payroll / Labor / Travel', 'Disbursing / Treasury / IPAC', 'Navy ERP / Archive Transition Partner', 'Manual JV / Suspense Inputs'],
      feederNote: 'The blueprint models 6 STARS source/partner categories; authoritative interface counts require Navy/DFAS records.'
    },
    layers: starsLayers,
    nodes: starsNodes,
    lineageScenarios: starsLineageScenarios,
    supportServices: starsSupportServices,
    caveats: starsCaveats,
    sources: starsSources
  },
  {
    slug: 'sabrs',
    shortName: 'SABRS',
    name: 'SABRS',
    longName: 'SABRS / Standard Accounting, Budgeting, and Reporting System Blueprint',
    agency: 'Marine Corps',
    eyebrow: 'SABRS blueprint for Marine Corps accounting, budgeting, and reporting',
    description: 'Explore SABRS as a Marine Corps accounting, budgeting, and reporting system for budget execution, obligations, expenditures, reimbursables, suspense, journal vouchers, trial balances, DON reporting bridges, AFR support, and source-to-statement audit evidence.',
    metric: '4',
    metricLabel: 'Core SABRS lineage scenarios',
    metricDetail: 'Fund cite -> Accounting -> GTAS -> AFR',
    referenceImage: '/sabrs-blueprint-reference.svg',
    referenceTitle: 'SABRS static blueprint reference',
    downloadLinks: [
      { label: 'Download SVG', href: '/sabrs-blueprint-reference.svg' }
    ],
    profile: {
      whatItIs: 'SABRS is modeled as the Marine Corps Standard Accounting, Budgeting, and Reporting System for budget execution, accounting, reimbursables, reporting, and audit-support lineage.',
      whoUsesIt: 'Marine Corps comptrollers, resource managers, budget execution users, fiscal offices, DFAS/DON reporting partners, reimbursable program owners, close teams, JV/suspense owners, and auditors may rely on SABRS data or outputs.',
      howItIsUsed: 'It supports funding control, commitments, obligations, expenditures, travel/labor accounting, contract payment impacts, reimbursables, collections, suspense/reject clearing, JVs, trial balance, DDRS/GTAS, and AFR schedules.',
      currentStatus: 'Modeled as an operational or legacy-core USMC accounting/reporting environment; exact platform, interfaces, variants, and modernization status require authoritative Marine Corps or DON documentation.',
      whyItIsUsed: 'It gives Marine Corps financial managers a budget-to-reporting transaction trail for controlling appropriated funds, supporting reimbursables, reconciling Treasury/DON reporting, and answering audit samples.',
      feederCount: 6,
      feederSystems: ['Budget / P&R / Funding Inputs', 'Contracts / PIEE-WAWF', 'GCSS-MC / Logistics Sources', 'Payroll / Labor / DTS', 'Disbursing / Treasury / IPAC', 'Navy ERP / DON Reporting Partner'],
      feederNote: 'The blueprint models 6 SABRS source/partner categories; authoritative interface counts require USMC/DON records.'
    },
    layers: sabrsLayers,
    nodes: sabrsNodes,
    lineageScenarios: sabrsLineageScenarios,
    supportServices: sabrsSupportServices,
    caveats: sabrsCaveats,
    sources: sabrsSources
  },
  {
    slug: 'famis',
    shortName: 'FAMIS',
    name: 'FAMIS Family',
    longName: 'FAMIS / Financial Accounting Management Information System Blueprint',
    agency: 'Legacy DoD',
    eyebrow: 'FAMIS-GF and FAMIS-WCF blueprint for legacy accounting and reporting',
    description: 'Explore FAMIS as a legacy/core accounting family with FAMIS-GF for general fund budget execution and FAMIS-WCF for working capital fund cost recovery, customer orders, AP/AR/GL, Treasury reconciliation, DDRS/GTAS reporting, and source-to-statement audit support.',
    metric: '4',
    metricLabel: 'Core FAMIS lineage scenarios',
    metricDetail: 'GF / WCF -> GL -> GTAS -> Statement',
    referenceImage: '/famis-blueprint-reference.svg',
    referenceTitle: 'FAMIS-GF and FAMIS-WCF static blueprint reference',
    downloadLinks: [
      { label: 'Download SVG', href: '/famis-blueprint-reference.svg' }
    ],
    profile: {
      whatItIs: 'FAMIS is modeled as the Financial Accounting Management Information System family, with FAMIS-GF for general fund accounting and FAMIS-WCF for working capital fund accounting, cost recovery, billing, and reporting support.',
      whoUsesIt: 'Legacy accounting users, budget execution users, WCF business offices, resource managers, AP/AR and close teams, DFAS or shared-service partners, Treasury/reporting teams, and auditors may rely on FAMIS data or outputs.',
      howItIsUsed: 'It supports fund cite validation, commitments, obligations, expenditures, AP, AR, GL, WCF customer orders, billing, collections, cost recovery, inventory/cost support, suspense, JVs, trial balance, DDRS/GTAS, and statement schedules.',
      currentStatus: 'Modeled as a legacy/core accounting family. Public FAMIS-GF/WCF technical documentation is thin, so exact platform, interface inventory, owners, and modernization or archival status require authoritative documentation.',
      whyItIsUsed: 'It preserves budget-to-reporting lineage for general fund execution and working-capital operations, helping users reconcile source transactions, GL balances, Treasury reporting, and audit evidence.',
      feederCount: 7,
      feederSystems: ['GF Funding / LOA Inputs', 'WCF Customer Orders / Operations', 'Procure-to-Pay Sources', 'Payroll / Labor / Travel', 'Treasury / Disbursing / IPAC', 'Inventory / Cost Sources', 'Manual JV / Suspense Inputs'],
      feederNote: 'The blueprint models 7 FAMIS source/partner categories; authoritative interface counts require agency/DFAS records.'
    },
    layers: famisLayers,
    nodes: famisNodes,
    lineageScenarios: famisLineageScenarios,
    supportServices: famisSupportServices,
    caveats: famisCaveats,
    sources: famisSources
  },
  {
    slug: 'ddrs',
    shortName: 'DDRS',
    name: 'DDRS',
    longName: 'DDRS / Defense Departmental Reporting System Blueprint',
    agency: 'DoD Reporting',
    eyebrow: 'DDRS blueprint for DoD financial statement reporting',
    description: 'Explore DDRS as the DoD financial reporting layer for component trial balance intake, USSGL/TAS validation, GTAS tie-outs, consolidation, intragovernmental eliminations, top-side adjustments, statements, notes, and audit support.',
    metric: '4',
    metricLabel: 'Core DDRS lineage scenarios',
    metricDetail: 'TB -> Edits -> GTAS -> AFR/PAR',
    referenceImage: '/ddrs-blueprint-reference.svg',
    referenceTitle: 'DDRS static blueprint reference',
    downloadLinks: [
      { label: 'Download SVG', href: '/ddrs-blueprint-reference.svg' }
    ],
    profile: {
      whatItIs: 'DDRS is modeled as the Defense Departmental Reporting System for DoD financial reporting, consolidating component trial balances into statement, note, Treasury, and audit-support outputs.',
      whoUsesIt: 'DoD reporting teams, component financial managers, DFAS/shared-service support, trial-balance owners, Treasury/GTAS reporting users, eliminations teams, statement preparers, and auditors rely on DDRS data or outputs.',
      howItIsUsed: 'It ingests trial balances, applies USSGL/TAS edits and crosswalks, supports consolidation, GTAS tie-outs, eliminations, top-side adjustments, AFR/PAR statement production, note schedules, and audit reconciliations.',
      currentStatus: 'Modeled as an active DoD financial reporting layer. Public module and interface detail is limited, so exact variants, workflow names, and modernization state require authoritative DoD reporting documentation.',
      whyItIsUsed: 'It gives DoD a controlled statement-production path from component accounting systems to consolidated financial reports, Treasury reporting, disclosure schedules, and audit evidence.',
      feederCount: 6,
      feederSystems: ['Component ERP Trial Balances', 'Legacy Accounting Sources', 'Working Capital Fund Sources', 'Treasury / GTAS / IPAC', 'IGT / Trading Partner Data', 'Audit / Component Support Packages'],
      feederNote: 'The blueprint models 6 DDRS source/partner categories; authoritative interface counts require DoD reporting records.'
    },
    layers: ddrsLayers,
    nodes: ddrsNodes,
    lineageScenarios: ddrsLineageScenarios,
    supportServices: ddrsSupportServices,
    caveats: ddrsCaveats,
    sources: ddrsSources
  },
  {
    slug: 'gtas-cars',
    shortName: 'GTAS/CARS',
    name: 'GTAS and CARS',
    longName: 'GTAS and CARS / Treasury Reporting Blueprint',
    agency: 'Treasury',
    eyebrow: 'Treasury GTAS and CARS blueprint for governmentwide reporting and central accounting',
    description: 'Explore GTAS and CARS as Treasury/Fiscal Service reporting systems: GTAS for agency adjusted trial balance submission and edits, and CARS for central accounting, TAS-BETC classified transactions, FBWT, MTS, Combined Statement, and Financial Report support.',
    metric: '4',
    metricLabel: 'Core GTAS/CARS lineage scenarios',
    metricDetail: 'ATB / TAS-BETC -> Treasury -> Reports',
    referenceImage: '/gtas-cars-blueprint-reference.svg',
    referenceTitle: 'GTAS and CARS static blueprint reference',
    downloadLinks: [
      { label: 'Download SVG', href: '/gtas-cars-blueprint-reference.svg' }
    ],
    profile: {
      whatItIs: 'GTAS is the Governmentwide Treasury Account Symbol Adjusted Trial Balance System used for agency ATB reporting; CARS is the Central Accounting Reporting System for Treasury central accounting and TAS-BETC transaction reporting.',
      whoUsesIt: 'Federal agency financial-reporting teams, Treasury/Fiscal Service, OMB reporting stakeholders, disbursing and collections partners, FBWT reconciliation teams, IGT/trading-partner teams, and auditors rely on GTAS/CARS data or outputs.',
      howItIsUsed: 'GTAS collects agency proprietary and budget-execution ATB data with edits and certification; CARS records central accounting transactions, TAS-BETC classifications, FBWT support, and Treasury report data.',
      currentStatus: 'Active Treasury/Fiscal Service reporting systems per official Fiscal Service pages; exact file formats, edit logic, and role workflows require current Treasury documentation.',
      whyItIsUsed: 'Together they connect agency trial balances and Treasury central accounting so the government can produce accurate monthly reporting, Combined Statement, Financial Report, FBWT support, and audit evidence.',
      feederCount: 6,
      feederSystems: ['Agency Adjusted Trial Balances', 'DDRS / ERP Reporting Sources', 'Payments / Collections / Disbursing', 'FBWT / General Fund / Central Accounts', 'IPAC / G-Invoicing / IGT', 'Agency Certification / Audit Support'],
      feederNote: 'The blueprint models 6 GTAS/CARS source/partner categories; authoritative interface counts require Treasury records.'
    },
    layers: gtasCarsLayers,
    nodes: gtasCarsNodes,
    lineageScenarios: gtasCarsLineageScenarios,
    supportServices: gtasCarsSupportServices,
    caveats: gtasCarsCaveats,
    sources: gtasCarsSources
  },
  {
    slug: 'dod-treasury-close',
    shortName: 'Close Loop',
    name: 'DoD to Treasury Close',
    longName: 'DoD-to-Treasury Close / GTAS, CARS, DDRS, SBR, and Financial Statement Blueprint',
    agency: 'DoD / Treasury',
    eyebrow: 'Step-by-step close blueprint for disbursing, cash, GTAS, CARS, DDRS, SBR, and final statements',
    description: 'Explore the full close loop from DoD ERP source events, disbursing and cash systems, CARS/Treasury central accounting, DDRS consolidation, GTAS adjusted trial balance edits, supported adjustments, re-submissions, SBR, DoD financial statements, and Treasury Financial Report support.',
    metric: '4',
    metricLabel: 'Close-loop scenarios',
    metricDetail: 'Source -> DDRS -> GTAS/CARS -> Final',
    referenceImage: '/dod-treasury-close-blueprint-reference.svg',
    referenceTitle: 'DoD-to-Treasury close static blueprint reference',
    downloadLinks: [
      { label: 'Download SVG', href: '/dod-treasury-close-blueprint-reference.svg' }
    ],
    profile: {
      whatItIs: 'This is a cross-system close blueprint explaining how DoD source systems, disbursing/cash systems, DDRS, GTAS, CARS, IPAC, FBWT, SBR, and Treasury governmentwide reporting interact before final statements are issued.',
      whoUsesIt: 'DoD component reporting teams, DFAS/accounting support, disbursing and cash-accountability teams, Treasury-facing reporting users, FBWT teams, IGT teams, auditors, and financial-statement preparers rely on this flow.',
      howItIsUsed: 'It is used to understand why financial statement finalization requires repeated tie-outs among ERP GL, disbursing, CARS/Treasury, DDRS, GTAS edits, FBWT, IGT eliminations, and audit support.',
      currentStatus: 'Modeled from public Treasury/DoD reporting concepts and official Fiscal Service GTAS/CARS descriptions; exact DoD component timelines, file formats, and system interfaces require authoritative DoD/Treasury procedures.',
      whyItIsUsed: 'The page makes clear that DoD statements are produced in DoD/DDRS, but Treasury systems are active controls for cash, central accounting, GTAS data quality, governmentwide reporting, and Financial Report compilation.',
      feederCount: 10,
      feederSystems: ['Component ERP / Feeder UoT', 'ADS / DDS / DCAS Disbursing', 'IPAC / G-Invoicing / IGT', 'CARS Central Accounting', 'FBWT Reconciliation', 'DDRS Consolidation', 'GTAS ATB Submission', 'Treasury MTS / Combined Statement', 'DoD AFR / Component Statements', 'Treasury Financial Report Support'],
      feederNote: 'The blueprint models 10 major partner/source categories in the close loop; it is not a certified interface inventory.'
    },
    layers: treasuryCloseLayers,
    nodes: treasuryCloseNodes,
    lineageScenarios: treasuryCloseLineageScenarios,
    supportServices: treasuryCloseSupportServices,
    caveats: treasuryCloseCaveats,
    sources: treasuryCloseSources
  },
  {
    slug: 'disbursing-cash',
    shortName: 'ADS/DDS/DCAS',
    name: 'ADS / DDS / DCAS',
    longName: 'ADS, DDS, and DCAS / Disbursing and Cash Accountability Blueprint',
    agency: 'DFAS / DoD',
    eyebrow: 'Disbursing, deployable disbursing, and cash accountability blueprint',
    description: 'Explore ADS, DDS, and DCAS as a connected disbursing and cash-accountability process suite: certified entitlement, disbursing execution, deployed field activity, cash accountability, accounting interface, Treasury reporting, FBWT, and audit support.',
    metric: '3',
    metricLabel: 'Core disbursing lineage scenarios',
    metricDetail: 'Entitlement -> Pay -> Cash -> Treasury',
    referenceImage: '/disbursing-cash-blueprint-reference.svg',
    referenceTitle: 'ADS / DDS / DCAS static blueprint reference',
    downloadLinks: [
      { label: 'Download SVG', href: '/disbursing-cash-blueprint-reference.svg' }
    ],
    profile: {
      whatItIs: 'ADS, DDS, and DCAS are modeled together as DoD disbursing and cash-accountability capabilities: ADS for central disbursing execution support, DDS for deployable disbursing, and DCAS for cash accountability.',
      whoUsesIt: 'DFAS and DoD disbursing offices, disbursing officers, certifying officers, accountable officials, deployed finance teams, component accounting/reporting teams, Treasury-facing support teams, and auditors rely on these records or controls.',
      howItIsUsed: 'The suite supports certified voucher payment, field disbursing, collections, returns, cancellations, disbursing officer accountability, accounting feeds, CARS/Treasury classification, FBWT reconciliation, and outlay support.',
      currentStatus: 'Modeled from public DoD disbursing policy and process information; exact ADS/DDS/DCAS current operational footprint, interfaces, and release details require DFAS/DoD authoritative documentation.',
      whyItIsUsed: 'DoD needs controlled disbursement of public funds, accountability for cash and voucher activity, reconciliation to accounting and Treasury, and audit evidence from entitlement to outlay.',
      feederCount: 7,
      feederSystems: ['ERP / Accounting Entitlement Sources', 'Payroll / Military / Civilian Pay Sources', 'Travel / DTS Sources', 'Vendor / Contract Payment Sources', 'Collections / Returns / Cancellations', 'CARS / Treasury Reporting', 'Component DDRS / GTAS Reporting'],
      feederNote: 'The blueprint models 7 feeder/partner categories for disbursing and cash accountability; this is not a certified production interface inventory.'
    },
    layers: disbursingCashLayers,
    nodes: disbursingCashNodes,
    lineageScenarios: disbursingCashLineageScenarios,
    supportServices: disbursingCashSupportServices,
    caveats: disbursingCashCaveats,
    sources: disbursingCashSources
  },
  {
    slug: 'ipac',
    shortName: 'IPAC',
    name: 'IPAC',
    longName: 'IPAC / Intragovernmental Payment and Collection Blueprint',
    agency: 'Treasury / DoD IGT',
    eyebrow: 'IPAC blueprint for intragovernmental settlement and reconciliation',
    description: 'Explore IPAC as Treasury Fiscal Service intragovernmental payment and collection capability, connecting buyer and seller agencies, G-Invoicing context, standardized settlement data, CARS, agency GL, GTAS/DDRS reporting, FBWT, and IGT eliminations.',
    metric: '3',
    metricLabel: 'Core IPAC lineage scenarios',
    metricDetail: 'Buyer/Seller -> IPAC -> CARS -> IGT',
    referenceImage: '/ipac-blueprint-reference.svg',
    referenceTitle: 'IPAC static blueprint reference',
    downloadLinks: [
      { label: 'Download SVG', href: '/ipac-blueprint-reference.svg' }
    ],
    profile: {
      whatItIs: 'IPAC is the Intragovernmental Payment and Collection capability used by federal entities to transfer funds between trading partners with standardized descriptive data.',
      whoUsesIt: 'Federal buyer and seller agencies, DoD components, DFAS/accounting support, reimbursable program offices, G-Invoicing users, Treasury Fiscal Service, reporting teams, and auditors use or rely on IPAC settlement data.',
      howItIsUsed: 'It is used to settle intragovernmental charges and collections, classify activity by ALC/TAS/BETC/trading partner, reconcile buyer/seller accounting, support CARS/FBWT, and feed GTAS/DDRS IGT reporting and eliminations.',
      currentStatus: 'Operational Treasury Fiscal Service application in the broader IGT environment; G-Invoicing is Treasury long-term IGT buy/sell solution and validates settlement requests through IPAC.',
      whyItIsUsed: 'IPAC gives agencies a standardized governmentwide funds-transfer mechanism for IGT settlements and provides the descriptive data needed for reconciliation, Treasury reporting, and financial statement eliminations.',
      feederCount: 6,
      feederSystems: ['Buyer Agency ERP', 'Seller Agency ERP', 'G-Invoicing Agreements / Orders / Performance', 'CARS / Treasury Central Accounting', 'DDRS / GTAS Reporting', 'Trading Partner Reconciliation / Audit Support'],
      feederNote: 'The blueprint models 6 IPAC feeder/partner categories; exact agency interfaces vary by implementation.'
    },
    layers: ipacLayers,
    nodes: ipacNodes,
    lineageScenarios: ipacLineageScenarios,
    supportServices: ipacSupportServices,
    caveats: ipacCaveats,
    sources: ipacSources
  },
  {
    slug: 'mocas',
    shortName: 'MOCAS',
    name: 'MOCAS',
    longName: 'MOCAS / Mechanization of Contract Administration Services Blueprint',
    agency: 'DCMA / DFAS',
    eyebrow: 'MOCAS blueprint for administered contracts and contract-payment lineage',
    description: 'Explore MOCAS as a legacy contract administration and payment-support environment, connecting contract award, DCMA administration, WAWF invoice/acceptance, contract financing, DFAS payment, ERP accounting, Treasury reporting, FBWT, ULOs, and contract audit support.',
    metric: '3',
    metricLabel: 'Core MOCAS lineage scenarios',
    metricDetail: 'Award -> Admin -> Pay -> Outlay',
    referenceImage: '/mocas-blueprint-reference.svg',
    referenceTitle: 'MOCAS static blueprint reference',
    downloadLinks: [
      { label: 'Download SVG', href: '/mocas-blueprint-reference.svg' }
    ],
    profile: {
      whatItIs: 'MOCAS is modeled as the Mechanization of Contract Administration Services, a legacy DoD contract administration and payment-support environment for administered contracts and complex payment activity.',
      whoUsesIt: 'DCMA contract administration personnel, DFAS payment offices, contracting and acquisition stakeholders, component ERP/accounting teams, vendors, program offices, and auditors rely on MOCAS-related contract/payment records.',
      howItIsUsed: 'It supports contract-payment administration, line/funding detail, invoice and acceptance linkage, progress or financing payments, liquidation, DFAS payment, accounting feeds, reconciliation, and contract-file audit traceability.',
      currentStatus: 'Legacy/operationally sensitive public detail is limited; this page models the business process accurately but does not claim a certified current platform or interface inventory.',
      whyItIsUsed: 'Administered defense contracts require a controlled trail from award and funding to delivery, invoice, acceptance, payment, obligation liquidation, Treasury outlay, and audit evidence.',
      feederCount: 7,
      feederSystems: ['Contract Award / Modification Sources', 'Component ERP Obligation Records', 'PIEE / WAWF Invoice and Acceptance', 'DCMA Contract Administration', 'DFAS Payment / Disbursing', 'CARS / Treasury Reporting', 'Contract Reporting / Audit Support'],
      feederNote: 'The blueprint models 7 MOCAS feeder/partner categories; authoritative counts require DCMA/DFAS system documentation.'
    },
    layers: mocasLayers,
    nodes: mocasNodes,
    lineageScenarios: mocasLineageScenarios,
    supportServices: mocasSupportServices,
    caveats: mocasCaveats,
    sources: mocasSources
  },
  {
    slug: 'piee',
    shortName: 'PIEE',
    name: 'PIEE Suite',
    longName: 'Procurement Integrated Enterprise Environment / PIEE Suite Blueprint',
    agency: 'DoD Procurement',
    eyebrow: 'PIEE blueprint for procurement, payment evidence, GL, and disbursement lineage',
    description: 'Explore PIEE as the DoD procurement and payment-evidence suite connecting solicitation, award, EDA, MDO, WAWF, myInvoice, GFP, IUID, JAM, SPM, closeout, purchase-card support, ERP GL systems, entitlement, DFAS disbursing, Treasury/CARS/IPAC, DDRS/GTAS, and audit evidence.',
    metric: '5',
    metricLabel: 'Core PIEE lineage scenarios',
    metricDetail: 'Award -> WAWF -> GL -> Pay -> Treasury',
    referenceImage: '/piee-blueprint-reference.svg',
    referenceTitle: 'PIEE suite static blueprint reference',
    downloadLinks: [
      { label: 'Download SVG', href: '/piee-blueprint-reference.svg' }
    ],
    profile: {
      whatItIs: 'PIEE is the Procurement Integrated Enterprise Environment, a DoD procurement and payment-evidence suite that includes WAWF, EDA, MDO, GFP, IUID, JAM, SPM, closeout, solicitation, reporting, and related support capabilities.',
      whoUsesIt: 'Vendors, contracting officers, contract specialists, CORs, inspectors, acceptors, pay officials, LPOs, property users, auditors, DFAS/pay offices, ERP/accounting teams, and DoD procurement oversight users rely on PIEE data.',
      howItIsUsed: 'It supports solicitation/award evidence, contract repository access, modifications and orders, invoice submission, receiving, inspection, acceptance, cost vouchers, contract financing, property records, COR appointments/surveillance, payment status, closeout, and audit support.',
      currentStatus: 'Operational DoD enterprise environment; public PIEE pages show version 7.7.x-era training and public access points, while exact production integrations require authorized DoD/PIEE documentation.',
      whyItIsUsed: 'PIEE standardizes procurement-to-payment evidence so GL systems can post supported obligations, AP, accruals, expenses, assets, ULOs, and outlays, and so disbursing/Treasury/audit teams can trace payment from contract to statement.',
      feederCount: 12,
      feederSystems: ['Vendor / CAGE / SAM Sources', 'DoDAAC / Role Administration', 'Solicitation / Contract Writing', 'EDA / MDO', 'WAWF / myInvoice', 'GFP / IUID', 'JAM / SPM', 'Purchase Card / Bank Sources', 'ERP GL Systems', 'Entitlement / Pay Office Systems', 'DFAS Disbursing / ADS / DCAS / DDS', 'Treasury / CARS / IPAC / DDRS / GTAS'],
      feederNote: 'The blueprint models 12 major PIEE feeder/partner categories across procurement, accounting, payment, Treasury, reporting, and audit.'
    },
    layers: pieeLayers,
    nodes: pieeNodes,
    lineageScenarios: pieeLineageScenarios,
    supportServices: pieeSupportServices,
    caveats: pieeCaveats,
    sources: pieeSources
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
    profile: {
      whatItIs: 'Navy ERP is the Department of the Navy SAP-based enterprise resource planning environment for financial, supply-chain, acquisition, and workforce-related business activity.',
      whoUsesIt: 'Navy commands, systems commands, budget and accounting offices, logistics and supply-chain users, contracting/payment partners, DON financial managers, and auditors rely on it.',
      howItIsUsed: 'It records Navy financials, funds control, procure-to-pay, supply-chain and inventory activity, PP&E, reimbursables, labor cost, GL, and external reporting support.',
      currentStatus: 'Operational DON ERP that has undergone large-scale cloud modernization; this model remains representative and public-information based.',
      whyItIsUsed: 'It gives DON a common financial/logistics transaction backbone, improves source-to-statement traceability, and supports audit and financial reporting.',
      feederCount: 6,
      feederSystems: ['DTS', 'WAWF / PIEE', 'SPS / PD2 / EDA', 'DCPS / HR / Personnel', 'R-Supply / SMMM / NALCOMIS', 'One-Touch / G-Invoicing / IPAC'],
      feederNote: 'The blueprint models 6 major Navy ERP feeder/source categories.'
    },
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
    profile: {
      whatItIs: 'DAI is the Defense Agencies Initiative, an Oracle-based financial accounting system for Fourth Estate defense agencies and field activities.',
      whoUsesIt: 'Participating Defense Agencies and Field Activities, resource managers, budget offices, accounting users, shared-service partners, and auditors use DAI data.',
      howItIsUsed: 'It supports procure-to-pay, reimbursables, budget execution, AP, AR, projects/costs, subledger accounting, GL, trial balance, and DoD/Treasury reporting.',
      currentStatus: 'Operational Fourth Estate Oracle-based system; exact modules and configurations vary by agency and require authoritative DAI program data.',
      whyItIsUsed: 'It gives smaller and shared-service defense organizations a standardized financial-management platform with stronger audit lineage and reporting controls.',
      feederCount: 5,
      feederSystems: ['DTS', 'WAWF / PIEE', 'SPS / Procurement', 'DCPS / Payroll', 'G-Invoicing / IPAC / Treasury'],
      feederNote: 'The blueprint models 5 major DAI feeder/source categories.'
    },
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
    profile: {
      whatItIs: 'DEAMS is the Defense Enterprise Accounting and Management System, modeled here as the Department of the Air Force Oracle-based financial-management environment.',
      whoUsesIt: 'Air Force and Space Force financial managers, resource advisors, budget users, acquisition/payment partners, DFAS and reporting stakeholders, and auditors rely on DEAMS outputs.',
      howItIsUsed: 'It supports budget execution, procure-to-pay, travel accounting, reimbursables, cost accounting, assets, SLA, GL, Treasury reporting, and statement support.',
      currentStatus: 'Operational DAF financial-management system; this page uses public information and Oracle federal-financial process patterns rather than claiming exact DEAMS configuration.',
      whyItIsUsed: 'It standardizes DAF accounting, connects source events to GL/reporting, and supports auditability across Air Force and Space Force financial operations.',
      feederCount: 7,
      feederSystems: ['DTS', 'WAWF / PIEE', 'SPS / EDA', 'DCPS / Payroll', 'Mission / Logistics Sources', 'G-Invoicing / IPAC', 'Treasury / Disbursing'],
      feederNote: 'The blueprint models 7 major DEAMS feeder/source categories.'
    },
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
    profile: {
      whatItIs: 'GAFS is modeled as a legacy Air Force accounting/reporting suite with GAFS-BL base-level processing and GAFS-R central/rehost reporting.',
      whoUsesIt: 'Legacy Air Force finance organizations, base-level accounting users, central reporting support, DFAS/DAF financial managers, and audit teams may rely on historical or transition data.',
      howItIsUsed: 'It handles base-level accounting intake, funds control, suspense/reject resolution, central consolidation, JVs, trial balance, Treasury reporting, and statement support.',
      currentStatus: 'Legacy/historical and transition-oriented in this model; public technical detail is limited, so exact current operational footprint requires authoritative DAF/DFAS confirmation.',
      whyItIsUsed: 'It preserves legacy accounting history and supports source-to-reporting reconciliation where GAFS activity remains relevant to close, audit, or modernization paths.',
      feederCount: 5,
      feederSystems: ['DTS / Travel Feeds', 'Contract / Vendor Pay Sources', 'Payroll / Labor Sources', 'Disbursing / Collections', 'Manual Requests / Exception Inputs'],
      feederNote: 'The blueprint models 5 GAFS feeder/source categories; this is not a certified interface inventory.'
    },
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
    profile: {
      whatItIs: 'GAFS JV is a focused control view for manual accounting adjustments inside the broader GAFS legacy accounting model.',
      whoUsesIt: 'Finance preparers, reviewers, approvers, close teams, reporting teams, and auditors use JV evidence to understand manual corrections, accruals, reversals, and reclasses.',
      howItIsUsed: 'It documents the source exception, prepares debit/credit lines, routes approval, posts the adjustment, tracks reversal, and ties the impact to trial balance and reporting.',
      currentStatus: 'Modeled as a high-risk legacy adjustment control surface; local current-state usage requires authoritative GAFS operating procedures.',
      whyItIsUsed: 'Manual adjustments are sometimes needed for close, accrual, correction, or reclassification, but they require strong evidence because they can obscure source-system defects.',
      feederCount: 5,
      feederSystems: ['Manual Requests / Exception Inputs', 'DTS / Travel Feeds', 'Contract / Vendor Pay Sources', 'Payroll / Labor Sources', 'Disbursing / Collections'],
      feederNote: 'The JV page reuses the GAFS source categories but emphasizes the manual request/exception path.'
    },
    layers: gafsLayers,
    nodes: gafsNodes,
    lineageScenarios: gafsJvScenarios,
    supportServices: gafsSupportServices,
    caveats: [
      ...gafsCaveats,
      'This subpage isolates JV control because manual GAFS adjustments are high-risk and can obscure source-system defects if not tied to evidence, approval, reversal, and reconciliation.'
    ],
    sources: gafsSources
  },
  {
    slug: 'cefms',
    shortName: 'CEFMS',
    name: 'CEFMS',
    longName: 'CEFMS / Corps of Engineers Financial Management System Blueprint',
    agency: 'USACE',
    eyebrow: 'CEFMS blueprint for U.S. Army Corps of Engineers finance',
    description: 'Explore CEFMS as the U.S. Army Corps of Engineers financial-management system, connecting USACE project sources, procurement, labor, reimbursables, AP/AR, disbursing, CEEMIS reporting, Treasury activity, and statement support.',
    metric: '4',
    metricLabel: 'Core CEFMS lineage scenarios',
    metricDetail: 'Project -> CEFMS -> CEEMIS/ATB -> Statement',
    referenceImage: '/cefms-blueprint-reference.svg',
    referenceTitle: 'CEFMS static blueprint reference',
    downloadLinks: [
      { label: 'Download SVG', href: '/cefms-blueprint-reference.svg' }
    ],
    profile: {
      whatItIs: 'CEFMS is the Corps of Engineers Financial Management System, the USACE financial system maintained with CEEMIS support by the USACE Finance Center.',
      whoUsesIt: 'USACE districts, divisions, centers, Finance Center staff, Civil Works and Military Programs finance users, project managers, resource managers, reporting teams, and auditors rely on CEFMS data.',
      howItIsUsed: 'It supports customer service, payments, disbursing, accounting, financial reporting, project cost, reimbursables, Civil Works, Military Programs, revolving funds, and trust funds.',
      currentStatus: 'Operational USACE financial-management environment per public USACE Finance Center descriptions; exact platform/vendor stack is not publicly stated with enough confidence to label it SAP or Oracle.',
      whyItIsUsed: 'It standardizes and integrates USACE finance and accounting, supports worldwide mission execution, enables financial data query/reporting, and underpins audit and statement support.',
      feederCount: 5,
      feederSystems: ['P2 / PROMIS / Project Sources', 'SPS / Procurement Sources', 'WAWF / PIEE', 'Labor / Payroll Sources', 'Collections / IPAC / Treasury'],
      feederNote: 'The blueprint models 5 major CEFMS feeder/source categories; authoritative interface counts require USACE/UFC documentation.'
    },
    layers: cefmsLayers,
    nodes: cefmsNodes,
    lineageScenarios: cefmsLineageScenarios,
    supportServices: cefmsSupportServices,
    caveats: cefmsCaveats,
    sources: cefmsSources
  },
  {
    slug: 'dla-ebs',
    shortName: 'DLA EBS',
    name: 'DLA EBS',
    longName: 'DLA EBS / Enterprise Business System Blueprint',
    agency: 'Defense Logistics Agency',
    eyebrow: 'DLA EBS blueprint for supply-chain finance and working-capital reporting',
    description: 'Explore DLA EBS as the Defense Logistics Agency enterprise business system for global supply-chain finance, connecting FedMall, DAAS/DLMS, PIEE/WAWF, DIBBS, VSM, WebFLIS/FED LOG, DSS, ERP logistics, inventory valuation, AP, AR, GL, Treasury reporting, and statement support.',
    metric: '4',
    metricLabel: 'Core DLA EBS lineage scenarios',
    metricDetail: 'Demand -> EBS -> Inventory/GL -> Statement',
    referenceImage: '/dla-ebs-blueprint-reference.svg',
    referenceTitle: 'DLA EBS static blueprint reference',
    downloadLinks: [
      { label: 'Download SVG', href: '/dla-ebs-blueprint-reference.svg' }
    ],
    profile: {
      whatItIs: 'DLA EBS is modeled as the Defense Logistics Agency enterprise business system and supply-chain finance backbone, with a public BSM commercial ERP modernization lineage.',
      whoUsesIt: 'DLA supply chains, DLA Finance, DLA Distribution, DLA Energy, Troop Support, Weapons Support, Disposition Services, vendors, customers, DFAS/reporting partners, and auditors rely on EBS data or outputs.',
      howItIsUsed: 'It supports demand, customer orders, procurement, inventory, warehouse/distribution, vendor shipment, AP, AR, working-capital cost recovery, GL, reporting, and audit traceability.',
      currentStatus: 'Operational DLA enterprise environment in this model; DLA public pages show the surrounding application ecosystem, while exact current EBS modules and custom interfaces require DLA authority.',
      whyItIsUsed: 'It integrates DLA logistics and finance so global supply-chain events can be controlled, fulfilled, valued, billed, reported, and audited from source transaction to statement.',
      feederCount: 6,
      feederSystems: ['FedMall / EEBP', 'DAAS / DLMS / MILS', 'PIEE / WAWF', 'DIBBS / VSM', 'WebFLIS / FED LOG / Cataloging', 'DSS / Distribution / Depot Events'],
      feederNote: 'The blueprint models 6 major DLA EBS feeder/source categories from the public DLA application ecosystem; authoritative interface counts require DLA documentation.'
    },
    layers: dlaEbsLayers,
    nodes: dlaEbsNodes,
    lineageScenarios: dlaEbsLineageScenarios,
    supportServices: dlaEbsSupportServices,
    caveats: dlaEbsCaveats,
    sources: dlaEbsSources
  },
  {
    slug: 'abss',
    shortName: 'ABSS',
    name: 'ABSS',
    longName: 'ABSS / Automated Business Services System Blueprint',
    agency: 'Department of the Air Force',
    eyebrow: 'ABSS blueprint for Air Force business services and request-to-procurement workflow',
    description: 'Explore ABSS as an Air Force business-services workflow surface for requirements, funding validation, approval routing, purchase-request or GPC handoff, contracting evidence, receipt/acceptance, AP/accrual support, reporting, and audit traceability.',
    metric: '4',
    metricLabel: 'Core ABSS lineage scenarios',
    metricDetail: 'Request -> Approve -> Handoff -> Account',
    referenceImage: '/abss-blueprint-reference.svg',
    referenceTitle: 'ABSS static blueprint reference',
    downloadLinks: [
      { label: 'Download SVG', href: '/abss-blueprint-reference.svg' }
    ],
    profile: {
      whatItIs: 'ABSS is modeled as the Air Force Automated Business Services System, a business-services/request workflow surface for requirements, approvals, funding support, and procurement handoff.',
      whoUsesIt: 'Air Force requirement owners, resource advisors, budget/funds certifiers, contracting support users, GPC participants, approving officials, finance/reporting teams, and auditors may rely on ABSS records.',
      howItIsUsed: 'It captures requirement packages, routes funding and approval reviews, supports PR/MIPR/GPC or contracting handoff, tracks status/evidence, and connects request activity to accounting and audit support.',
      currentStatus: 'Public ABSS implementation details are limited; this page models the business process and marks exact platform, interfaces, and current operational footprint as requiring Air Force authority.',
      whyItIsUsed: 'It gives Air Force organizations a controlled request-to-procurement trail so mission needs, funding, approvals, award support, receipt, payment, and audit evidence can be connected.',
      feederCount: 5,
      feederSystems: ['Requirement Owner Inputs', 'Funding / LOA Source', 'Contracting / Market Inputs', 'PIEE / WAWF', 'GPC / Bank / Micro-Purchase'],
      feederNote: 'The blueprint models 5 ABSS feeder/source categories; authoritative interface counts require Air Force ABSS documentation.'
    },
    layers: abssLayers,
    nodes: abssNodes,
    lineageScenarios: abssLineageScenarios,
    supportServices: abssSupportServices,
    caveats: abssCaveats,
    sources: abssSources
  }
];

export function getSystem(slug) {
  return systems.find((system) => system.slug === slug) || systems[0];
}

export function getSystemSlugs() {
  return systems.map((system) => system.slug);
}
