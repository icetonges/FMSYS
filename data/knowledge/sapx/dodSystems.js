import { h2, h3, p, list, steps, callout, table, figure } from '../blocks';

const armyFederation = {
  id: 'sapx-army',
  cols: 4,
  colWidth: 222,
  colGap: 60,
  rowGap: 60,
  rowLabels: ['Army SAP ERPs', 'Shared services', 'Outside the Army ERP family'],
  nodes: [
    { id: 'gfebs', col: 0, row: 0, tone: 'process', title: 'GFEBS', lines: ['Army General Fund general ledger', 'Funds distribution, spending chain, reimbursables, cost, real property', 'GFEBS-SA is a separate instance for sensitive activities'] },
    { id: 'gcss', col: 1, row: 0, tone: 'process', title: 'GCSS-Army', lines: ['Tactical supply, maintenance, property book', 'Tactical finance', 'Defense Forces solution'] },
    { id: 'lmp', col: 2, row: 0, tone: 'process', title: 'LMP', lines: ['National-level supply, depot maintenance, manufacturing', 'Army Working Capital Fund ledger'] },
    { id: 'ebsc', col: 3, row: 0, tone: 'reporting', title: 'EBS-C', lines: ['Planned single platform', 'Ammunition pilot live July 2025', 'Contract option not exercised May 2026'] },
    { id: 'aesip', col: 0, row: 1, span: 2, tone: 'detail', title: 'AESIP', lines: ['Enterprise hub services, centralized master data, cross-functional business intelligence for the Army ERPs'] },
    { id: 'acws', col: 2, row: 1, tone: 'detail', title: 'Army Contract Writing System', lines: ['Awards and purchase request updates to LMP since July 2025', 'Replacing two legacy contract systems'] },
    { id: 'advana', col: 3, row: 1, tone: 'detail', title: 'Advana', lines: ['Replication from GFEBS and GCSS-Army since 2023'] },
    { id: 'feed', col: 0, row: 2, tone: 'source', title: 'DoD feeders', lines: ['Travel, payroll, invoicing and acceptance, disbursing, Treasury'] },
    { id: 'leg', col: 1, row: 2, tone: 'source', title: 'Army systems GFEBS did not replace', lines: ['Corps of Engineers system', 'Legacy systems still executing some General Fund amounts in 2019'] },
    { id: 'ddrs', col: 2, row: 2, span: 2, tone: 'statements', title: 'DDRS and Treasury', lines: ['Trial balances from each ledger. DFAS journal vouchers. Army General Fund and Working Capital Fund statements.'] }
  ],
  edges: [
    { from: 'gfebs', to: 'aesip', tx: -140, both: true },
    { from: 'gcss', to: 'aesip', tx: 140, both: true },
    { from: 'lmp', to: 'acws', both: true },
    { from: 'gfebs', to: 'gcss', label: 'finance', both: true },
    { from: 'gcss', to: 'lmp', label: 'supply', both: true },
    { from: 'lmp', to: 'ebsc', dashed: true },
    { from: 'leg', to: 'ddrs' }
  ]
};

export const sapDodSystemsPage = {
  slug: 'sap-dod-systems',
  prefix: 'SY',
  group: 'SAP expert series',
  eyebrow: 'SAP expert series, part 8',
  navTitle: 'DoD SAP Systems Profiled: GFEBS, GCSS-Army, LMP, Navy ERP, DLA EBS, and EBS-C',
  shortTitle: 'DoD SAP Systems',
  blurb: 'Referenced profiles of each DoD system built on SAP: scope, scale, cost, ledger design, line of accounting, document types, custom development, audit findings with numbers, and current modernization status.',
  appliesTo: ['gfebs', 'navy-erp', 'gcss-army', 'lmp', 'dla-ebs'],
  blocks: [
    h2('1. The DoD SAP portfolio at a glance'),
    table('DoD SAP systems: scope and scale from public reports', ['System', 'Owner', 'Role', 'Users', 'Cost and schedule facts', 'Source'], [
      ['GFEBS', 'Army', 'Army General Fund general ledger and, from fiscal year 2013, system of record for fund distribution', 'More than 53,000 at 227 locations in 71 countries when deployment completed July 1, 2012', 'Life-cycle estimate $1.4 billion. $910 million spent on development and implementation as of April 2014. Planned to replace 107 legacy systems.', 'DODIG-2014-090, DODIG-2012-111'],
      ['GCSS-Army', 'Army', 'Tactical logistics ERP with tactical finance', 'About 14,000 in Wave 1 and about 140,000 in Wave 2. More than 154,000 in total.', 'Wave 1 fielded February 2013 to November 2015 at 281 supply support activities. Wave 2 full deployment began August 2015.', 'Army Sustainment, May 2016'],
      ['LMP', 'Army Materiel Command', 'National logistics and Army Working Capital Fund ledger', '21,000', 'First deployed 2003. Life-cycle estimate grew from $420.9 million to $4.36 billion. Full deployment moved from 2004 to 2016.', 'DODIG-2012-111'],
      ['Navy ERP', 'Navy', 'Financial and supply chain system for six commands. Prepares General Fund and Working Capital Fund statements.', 'About 72,000 in 2019', 'About $1.8 billion spent fiscal years 2004 to 2015. Planned to replace 96 legacy systems. The Navy decided in 2012 not to deploy it further.', 'DODIG-2017-068, DODIG-2012-111, USNI News'],
      ['DLA EBS', 'Defense Logistics Agency', 'Supply chain system and general ledger of record for DLA general and working capital funds', 'More than 11,000 in 28 countries as of January 2012', 'More than $2 billion obligated toward EBS as of September 2012. Core deployment completed September 2007.', 'DODIG-2013-057']
    ], 'Figures are as of the report dates shown and are not current counts.'),
    table('Ledger and compliance findings by system', ['System', 'Chart of accounts and ledger design', 'SFIS and USSGL findings'], [
      ['GFEBS', '847 posting accounts, each rolling up to one USSGL account and one DoD reporting account. Standard ledger, Special Ledger 95 for Treasury reporting, and a Z1 ledger from April 2010 for DoD attributes.', 'Fiscal year 2010: 7 of 153 USSGL accounts and 28 of 233 DoD reporting accounts missing. 11 of 20 attributes inconsistent in Special Ledger 95 and 8 of 20 in Z1. About 93 percent compliance with SFIS business rules on fiscal year 2011 data.'],
      ['Navy ERP', 'Not described in the public reports reviewed', 'DODIG-2012-051 found the Navy approved deployment without confirming SFIS and USSGL compliance. In 2017, SFIS compliance was rated partial, with nine of 70 data elements outstanding.'],
      ['LMP', 'Not described in the public reports reviewed', 'A 2010 DoD IG report found LMP was not substantially compliant with FFMIA and did not meet USSGL requirements.'],
      ['DLA EBS', 'Posting accounts built before the DoD Standard Chart of Accounts. No normal balances or account definitions in the system. SAP Public Sector finance added in May 2010.', '394 of 693 applicable DoD reporting accounts supported. 99 of 222 applicable SFIS business rules not implemented. Could not show that postings follow the Transaction Library. Could not produce a trial balance for direct DDRS reporting.'],
      ['GCSS-Army', 'Not described in the public reports reviewed', 'DOT&E noted in fiscal year 2011 that the Army Audit Agency found GCSS-Army had not yet demonstrated FFMIA compliance, and in fiscal year 2012 that it had not yet met the requirement for financial auditability.']
    ], 'These findings are historical. Each program has taken corrective action since, and current status must come from current audit reports and the program office.'),

    h2('2. GFEBS'),
    h3('Purpose and history'),
    list(
      'GFEBS is the Army General Fund accounting system. DoD IG describes it as a web-based ERP built by a contractor on a commercial off-the-shelf platform to standardize Army financial management, accounting, asset inventory, and asset management.',
      'Deployment ran from 2008 to July 1, 2012. In September 2010 it had about 8,700 users at 14 locations and handled under 2 percent of Army General Fund obligations. By June 2011 it had about 24,000 users at 105 locations.',
      'A separate instance, GFEBS-Sensitive Activities, executes classified activity. DoD IG lists it with GCSS-Army and the Corps of Engineers system among the systems that execute Army General Fund amounts outside GFEBS.',
      'The Army reported moving GFEBS to a commercial cloud ahead of schedule. The Army began streaming GFEBS transactions to Advana in 2023.',
      'In fiscal year 2013, only $129.2 billion of $266.5 billion in Army General Fund total budgetary resources, 48.5 percent, originated in GFEBS. Prior-year funding had stayed in legacy systems.'
    ),
    h3('Business process areas'),
    table('GFEBS business process areas and the SAP components behind them', ['Area', 'Scope shown in the public role map', 'SAP components'], [
      ['Financials', 'G/L account master, journal vouchers, period-end and year-end close, cash balancing, trial balance and external reporting extracts', 'FI-GL, FI-SL, PSM-FG'],
      ['Funds Management', 'Strategic planning and budget formulation, transfer of approved budget to execution, master data, funds control', 'PSM-FM with the Budget Control System, BI planning'],
      ['Spending Chain', 'Material master, contracts and sourcing, requisitions, orders, goods receipt, funds commitments, invoices, payment program', 'MM purchasing, inventory, invoice verification, FI-AP, earmarked funds'],
      ['Reimbursables', 'Customer accounts, sales orders, work execution, billing, receivables, collections, doubtful debts', 'SD, FI-AR, resource-related billing'],
      ['Cost Management', 'Cost centers, internal orders, allocations, labor', 'CO'],
      ['Property, Plant and Equipment', 'Real property portfolio, acquisition, inspection, contracts, disposal, equipment and asset accounting', 'RE-FX, FI-AA, PM'],
      ['Project Systems', 'Projects and WBS elements for construction and funded programs', 'PS']
    ], 'The public role map numbers these areas 1 Financials, 2 Funds Management, 3 Real Property, 4 Reimbursables, 5 Spending Chain, 6 Cost Management. DoD IG later described GFEBS transactions as grouped into 13 business process areas for posting logic review.'),
    h3('Line of accounting'),
    table('GFEBS line of accounting elements with examples from public procedures', ['Element', 'SAP object', 'Example', 'Notes'], [
      ['Company code and business area', '`BUKRS`, `GSBER`', 'ARMY', 'One company code is used in the examples'],
      ['Fund', '`GEBER`', '`202010D12`, `202011D12`, `202010A12`', 'Operation and Maintenance, Army. The A variant is automatic reimbursable authority. A separate fund value is used for non-Army requestor funds on sales orders.'],
      ['Funds center', '`FISTL`', '`A76DD`, `A2ABM`', 'Organization that holds budget'],
      ['Functional area', '`FKBER`', '`131096QLOG`, `121018TTDY`', 'Six-digit Army management structure code followed by the management decision package'],
      ['Funded program', '`MEASURE`', '`ARMY`, or the WBS element such as `S.0000056`', 'Default value unless the spending is for a funded project'],
      ['Commitment item', '`FIPOS`', '`21T0`, `22NL`', 'Four characters. Derived from the element of resource.'],
      ['G/L account', '`HKONT`', '`6100.21T0`, `6100.22NL`', 'USSGL account plus an extension that repeats the commitment item for expense accounts'],
      ['Cost center', '`KOSTL`', '`2ABM0008`', 'Unit or responsible organization'],
      ['WBS element', '`POSID`', '`S.0000056`', 'Same value as the project definition and the funded program'],
      ['Plant', '`WERKS`', '`JCK1`', 'Installation'],
      ['Contract identifiers', 'Customer data tabs on the purchase order', 'PIIN and CLIN', 'Link to the contract'],
      ['Requesting and approving activity', 'Customer data tabs on the requisition', 'DoDAAC', 'Drives workflow routing'],
      ['Treasury elements', 'Derived for external documents', 'Department regular code, main account, agency accounting identifier, agency disbursing identifier, period of availability', 'Printed on outbound funding documents']
    ], 'Examples come from the Army Financial Management School desktop procedures dated June 2013. Formats can have changed with later SFIS and SLOA releases.'),
    h3('Document types and workflow'),
    table('GFEBS document types shown in public procedures', ['Document', 'Types shown', 'Transaction', 'Notes'], [
      ['Purchase requisition', 'Requisition for the standard procurement system, miscellaneous pay requisition, outbound MIPR requisition', '`ME51N`, released in `ME54N`', 'Funds certification is a release step. Workflow routes by DoDAAC.'],
      ['Purchase order', 'Miscellaneous pay order, outbound direct cite MIPR order', '`ME21N`', 'Item category D for services. Account assignment categories K cost center and P project.'],
      ['Funds precommitment', 'M1', '`FMY1`', 'Referenced by the funds commitment'],
      ['Funds commitment', 'F9 miscellaneous obligation, F1 travel obligation, F6 transportation obligation', '`FMZ1`', 'Marked complete in `FMZ2` when fully liquidated'],
      ['G/L posting', 'SB', '`FB50`', 'Cost transfers'],
      ['Vendor invoice without purchase order', 'MP', '`FB60`', 'References the funds commitment number'],
      ['Budget entry document', 'ALLT', '`FMBB`', 'Allotment to a funded program'],
      ['Sales order', 'Direct cite and reimbursable', '`VA01`, approved in `VA02`', 'Payment methods identify IPAC and SF 1080 collections'],
      ['Project', 'Released with user status funded', '`CJ20N`', 'Must be funded before it can be charged']
    ]),
    h3('Custom development'),
    p('The public role-to-transaction mapping names more than 90 custom transactions. They cluster around five needs that the standard product does not meet for the Army: status of funds reporting in Army terms, the DDRS and SFIS trial balance extracts, cash reconciliation with the DFAS cash accountability system, federal forms such as the DD Form 448, DD Form 1354, SF 1080, and SF 1081, and interface error work lists. The full list by family is on the [transaction code catalog page](/knowledge/sap-tcodes).'),
    h3('Audit findings with numbers'),
    table('DoD IG findings on GFEBS', ['Report', 'Date', 'Finding'], [
      ['DODIG-2012-066', 'March 2012', 'The chart of accounts lacked 7 USSGL and 28 DoD reporting accounts. Of 847 posting accounts, only 665 had written definitions by September 2011. 452 Special Ledger 95 transactions were missing from the Z1 ledger. $48.7 billion was reported without trading partner data.'],
      ['DODIG-2013-130', '2013', 'Acquire-to-retire: real property data elements, the real property universe, construction in progress, and land records needed correction. Details are summarized in the 2019 follow-up.'],
      ['DODIG-2014-090', 'July 2014', 'Budget-to-report: $6.3 billion misconfigured, $103.2 billion inaccurately recorded, 22 appropriations totaling $176.5 billion recorded late. DFAS prepared 342 journal vouchers totaling $141.3 billion in DDRS for the Army General Fund. The fourth quarter fiscal year 2013 GFEBS trial balance held $6.3 billion of abnormal budgetary balances.'],
      ['DODIG-2020-035', 'November 2019', 'Six recommendations still open. Posting logic compliance analysis complete for 3 of 13 business process areas. Noncompliant postings: civilian pay 148 for $0.11 billion, local national pay 303 for $4.10 billion, military pay 223 for $74.50 billion. Real property universe differed from DDRS by $2.0 billion. Two legacy systems still executed material Army General Fund amounts.']
    ]),

    h2('3. The Army ERP federation'),
    figure('Army SAP systems and the services between them', armyFederation, 'Relationship labels summarize public descriptions. Interface inventories are not public.'),
    h3('GCSS-Army'),
    list(
      'GCSS-Army replaced the Standard Army Retail Supply System, the Property Book Unit Supply Enhanced system, and the Standard Army Maintenance System-Enhanced, plus two tactical financial systems: the Single Stock Fund Middleware and the Funds Control Module.',
      'DOT&E describes it as built from commercial software adapted from a commercial ERP, with a production server at Redstone Arsenal and a continuity server at Radford. It supports tactical maintenance, materiel management, property accountability, tactical financial management, and logistics planning.',
      'The public maintenance transaction reference shows standard Plant Maintenance, inventory, purchasing, and time sheet transactions, Defense Forces transactions in the `/ISDFPS/` namespace, and Army custom reports.',
      'Material requirements planning runs by MRP area for shop and bench stock, according to the custom transaction names in that reference.',
      'DoD IG lists GCSS-Army as the system that executes standard stock procurement for the Army General Fund.'
    ),
    h3('AESIP'),
    list(
      'The Army Enterprise Systems Integration Program is part of the GCSS-Army program. DOT&E states that it provides enterprise hub services, centralized master data management, and cross-functional business intelligence and analytics for the Army ERPs, including GFEBS and LMP.',
      'In SAP terms a hub of this kind distributes material, vendor, customer, and organizational master data to each ERP and brokers messages between them.'
    ),
    h3('LMP'),
    list(
      'DoD IG identifies LMP as SAP commercial off-the-shelf software for integrated logistics management: supply, demand, asset availability, distribution, financial control, and reporting.',
      'It was first deployed in 2003 and replaced two legacy national-level systems. It had 21,000 users in 2012.',
      'LMP carries the Army Working Capital Fund general ledger. Depot maintenance, arsenals, and wholesale supply run in it.',
      'In July 2025 the Army released an interface from the Army Contract Writing System to LMP for working capital fund purchases. Phase two, expected October 2025, was to add general fund and customer fund execution.'
    ),
    h3('EBS-C'),
    table('Enterprise Business Systems Convergence timeline', ['Date', 'Event', 'Source'], [
      ['2020 to 2023', 'The Army plans to converge GFEBS, GCSS-Army, LMP, and AESIP into one system and runs a prototype competition under other transaction authority', 'Army articles'],
      ['October 2024', 'Accenture Federal Services wins the award: $69.4 million initially, ceiling about $1 billion', 'Washington Technology'],
      ['November 2024', 'The Army describes EBS-C as a single cloud-based solution on standard SAP software, with initial rollout in fiscal year 2026 for retail ammunition and full implementation by 2032', 'Army.mil'],
      ['May 2025', 'The Court of Federal Claims rules against a protest, and work begins', 'Washington Technology'],
      ['July 2025', 'Distribution and supply planning for conventional ammunition goes live for pilot users, more than two months early', 'Army.mil'],
      ['May 2026', 'The Army declines the second-year option. A spokesperson says the Army is focused on modernizing existing systems rather than consolidating them, and that no new contracts are planned.', 'Washington Technology']
    ], 'After May 2026 the four existing systems remain the Army systems of record. Check current Army announcements for later changes.'),

    h2('4. Navy ERP'),
    list(
      'DoD IG describes Navy ERP as a mixed system classified under logistics that also processes budgeting and accounting transactions to prepare Navy General Fund and Navy Working Capital Fund statements.',
      'Six commands use it: Naval Air Systems Command, Naval Supply Systems Command, Naval Sea Systems Command, the Office of Naval Research, Strategic Systems Programs, and Naval Information Warfare Systems Command.',
      'In 2012 the Navy decided not to deploy it to more commands, citing cost, lack of standardization, and 255 audit-related problems. Other commands stayed on other systems.',
      'DODIG-2013-105 found that Navy ERP did not support $416 billion in military equipment assets reported through DDRS-AFS.',
      'In August 2019 the Navy completed a move of Navy ERP to SAP HANA in the cloud for about 72,000 users in 10 months against a 20-month plan. The stated next goal was to consolidate Navy financial systems into a single general ledger.',
      'DoD IG reported that the Navy legacy accounting system retired in December 2022 and its data moved to three systems.'
    ),

    h2('5. DLA Enterprise Business System'),
    list(
      'DLA began EBS in August 2000 as Business System Modernization, covering order fulfillment, supply and demand planning, procurement, technical quality, and finance. Core deployment finished in September 2007.',
      'Later releases added SAP Public Sector finance as the Enterprise Operational Accounting System in May 2010, inventory management and stock positioning from 2009 to 2011, real property in 2009 and 2011, eProcurement in December 2012, and Energy Convergence for fuel supply chains.',
      'EBS is the DLA general ledger of record. DFAS Columbus uses its data to produce DLA statements and report to DDRS.',
      'In fiscal year 2012 DLA processed most of more than $53.9 billion in budgetary authority through EBS. It was to manage nearly 5 million items across eight supply chains.',
      'DoD IG found that accounts receivable used 13 posting accounts crosswalked to a single DoD reporting account, that EBS did not separately record federal and nonfederal payables, and that advances in account 1410 did not agree with prepaid undelivered orders in account 4802.',
      'Trading partner data was unusable for eliminations: of seven posting accounts with a federal indicator, three reported a zero, two reported a two-digit code, and two reported no value.'
    ),

    h2('6. What the profiles have in common'),
    table('Recurring causes behind the findings, in SAP terms', ['Cause', 'How it shows up', 'Where to look in the system'], [
      ['Chart of accounts built before the DoD standard', 'Posting accounts that do not map one-to-one to DoD reporting accounts', '`SKA1`, `SKB1`, the crosswalk used by the trial balance extract'],
      ['Posting logic that differs from the Transaction Library', 'Wrong debit and credit pairs, summary-level accounts used for detail', 'Budgetary ledger derivation, account determination tables, FI substitutions'],
      ['Attributes derived after the fact', 'Missing or inconsistent trading partner, apportionment category, or prior-year adjustment code', 'Derivation rules for the reporting ledger, master data attributes on funds and business partners'],
      ['Partial process scope', 'Contracts, entitlement, and disbursing outside the ERP', 'Interface queues, unmatched disbursement work lists, GR/IR clearing balances'],
      ['Legacy balances not converted', 'Prior-year funding executed in legacy systems', 'Funds with no activity in the ERP, DDRS adjustments by source system'],
      ['Subledger and ledger not reconciled', 'Real property and equipment universes that differ from the trial balance', '`ANLA` and `ANLC` against asset reconciliation accounts, RE-FX objects against assets'],
      ['Heavy custom reporting', 'Balances reported from custom extracts and special ledgers', 'Z programs, special ledger tables, comparison with standard ledger totals']
    ])
  ],
  sources: [
    { name: 'DODIG-2012-066: GFEBS did not provide required financial information', url: 'https://apps.dtic.mil/sti/pdfs/ADA559121.pdf' },
    { name: 'DODIG-2012-111: Enterprise Resource Planning Systems Schedule Delays and Reengineering Weaknesses', url: 'https://media.defense.gov/2012/Jul/13/2001712150/-1/-1/1/DODIG-2012-111.pdf' },
    { name: 'DODIG-2014-090: GFEBS Budget-to-Report business process', url: 'https://media.defense.gov/2014/Jul/02/2001713378/-1/-1/1/DODIG-2014-090.pdf' },
    { name: 'DODIG-2020-035: Followup audit of GFEBS Acquire-to-Retire and Budget-to-Report', url: 'https://media.defense.gov/2019/Dec/02/2002218762/-1/-1/1/DODIG-2020-035.PDF' },
    { name: 'DODIG-2013-057: DLA Enterprise Business System and the USSGL', url: 'https://media.defense.gov/2013/Mar/20/2001712815/-1/-1/1/DODIG-2013-057.pdf' },
    { name: 'DODIG-2017-068: Strategic Plan Needed for Navy Financial Management Systems', url: 'https://media.defense.gov/2017/Dec/19/2001858354/-1/-1/1/DODIG-2017-068.PDF' },
    { name: 'DODIG-2024-047: DoD Plans to Address Longstanding Issues with Outdated Financial Management Systems', url: 'https://media.defense.gov/2024/Jan/23/2003380087/-1/-1/1/DODIG-2024-047%20SECURE.PDF' },
    { name: 'DOT&E FY2011 annual report: GCSS-Army', url: 'https://www.dote.osd.mil/Portals/97/pub/reports/FY2011/army/2011gcss-a.pdf?ver=2019-08-22-112308-893' },
    { name: 'DOT&E FY2012 annual report: GCSS-Army', url: 'https://www.dote.osd.mil/Portals/97/pub/reports/FY2012/army/2012gcss-a.pdf?ver=2019-08-22-111732-487' },
    { name: 'Army Sustainment: GCSS-Army Wave 1 is done (2016)', url: 'https://www.army.mil/article/166174/gcss_army_wave_1_is_done' },
    { name: 'U.S. Army Financial Management School: GFEBS Desktop SOP (public copy)', url: 'https://silo.tips/download/us-army-financial-management-school-gfebs-desktop-sop' },
    { name: 'GFEBS role to transaction code mapping (public copy)', url: 'https://pdfcoffee.com/role-to-t-code-mapping-pdf-free.html' },
    { name: 'GCSS-Army Maintenance T-Code Favorites Reference', url: 'https://ordoteststorageaccount.blob.core.windows.net/cohort-website/GCSS-Army%20Maintenance%20T-Code%20Favorites%20Reference.pdf' },
    { name: 'FedScoop: Army migrated GFEBS to the cloud', url: 'https://fedscoop.com/army-cloud-gfebs-migration/' },
    { name: 'USNI News: six Navy commands on cloud-based Navy ERP (August 2019)', url: 'https://news.usni.org/2019/08/26/six-major-navy-commands-now-using-cloud-based-system-for-financial-and-supply-management' },
    { name: 'Army.mil: EBS-C merges key Army resource planning systems (November 2024)', url: 'https://www.army.mil/article/281153/ebs_c_merges_key_army_resource_planning_systems_into_one' },
    { name: 'Army.mil: EBS-C goes live for ammunition (July 2025)', url: 'https://www.army.mil/article/287007/enterprise_business_systems_convergence_goes_live_ahead_of_schedule_modernizing_army_ammunition' },
    { name: 'Washington Technology: Army walks away from business system consolidation contract (May 2026)', url: 'https://www.washingtontechnology.com/contracts/2026/05/army-walks-away-business-system-consolidation-contract/413751/' },
    { name: 'Army.mil: Army Contract Writing System interface to LMP (July 2025)', url: 'https://www.army.mil/article/287415/u_s_army_continues_to_streamline_procurement_and_financial_processes_with_release_of_new_interface' }
  ]
};
