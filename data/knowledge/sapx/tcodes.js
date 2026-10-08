// SAP transaction code catalog. One line per code: code|area|what it does|kind|public DoD evidence.
// Evidence: G = listed in public GFEBS role-to-transaction or desktop procedure material.
//           A = listed in public GCSS-Army maintenance transaction reference.
const raw = `
SE11|BC|ABAP Dictionary: display tables, data elements, domains|Tool|
SE16|BC|Data Browser: display table contents|Tool|
SE16N|BC|General table display|Tool|G
SE38|BC|ABAP Editor|Tool|
SE80|BC|Object Navigator|Tool|
SE93|BC|Maintain transaction codes|Tool|
SM30|BC|Maintain table views|Tool|
SM31|BC|Maintain tables (older)|Tool|
SM35|BC|Batch input session monitor|Monitor|G
SM36|BC|Schedule background job|Tool|
SM37|BC|Background job overview|Monitor|G
SM12|BC|Display and delete lock entries|Monitor|
SM13|BC|Update requests monitor|Monitor|
SM20|BC|Security audit log analysis|Monitor|
SM21|BC|System log|Monitor|
SM50|BC|Work process overview|Monitor|
SM51|BC|Application server list|Monitor|
SM58|BC|Transactional RFC error log|Monitor|
SM59|BC|RFC destinations|Config|
SMQ1|BC|qRFC outbound queue monitor|Monitor|
SMQ2|BC|qRFC inbound queue monitor|Monitor|
ST22|BC|ABAP runtime error (dump) analysis|Monitor|
ST03N|BC|Workload monitor|Monitor|
ST05|BC|SQL and performance trace|Tool|
SU01|BC|User maintenance|Security|
SU10|BC|User mass maintenance|Security|
SU53|BC|Display last failed authorization check|Security|
SUIM|BC|User information system|Security|
PFCG|BC|Role maintenance|Security|
SU24|BC|Authorization object check indicators per transaction|Security|
SCC4|BC|Client administration|Config|
SCU3|BC|Table change history analysis|Monitor|
STMS|BC|Transport Management System|Tool|
SE09|BC|Transport Organizer|Tool|
SPRO|BC|Customizing: Implementation Guide|Config|
SP01|BC|Spool output controller|Monitor|G
SBWP|BC|Business Workplace: inbox and workflow items|Process|G A
SO01|BC|SAPoffice inbox|Process|G
SWI1|BC|Work item selection|Monitor|
SWIA|BC|Execute work items as administrator|Monitor|
SHD0|BC|Transaction and screen variants|Config|G
SQ01|BC|SAP Query: maintain queries|Report|
SQVI|BC|QuickViewer|Report|
SCMA|BC|Schedule Manager: period-end task lists|Process|G
SLG1|BC|Application log display|Monitor|
SCAT|BC|Computer Aided Test Tool|Tool|
LSMW|BC|Legacy System Migration Workbench|Tool|
WE02|CA|IDoc list|Monitor|G
WE05|CA|IDoc list (same program as WE02)|Monitor|
WE09|CA|Search IDocs by content|Monitor|G
WE19|CA|IDoc test tool: reprocess with edited data|Tool|G
WE20|CA|Partner profiles|Config|
WE21|CA|Ports for IDoc processing|Config|
WE30|CA|IDoc type development|Tool|
WE31|CA|IDoc segment development|Tool|
WE60|CA|IDoc documentation|Tool|
WE81|CA|Message types|Config|
WE82|CA|Message type to IDoc type assignment|Config|
BD87|CA|Status monitor and reprocessing for ALE messages|Monitor|G
BD64|CA|ALE distribution model|Config|
BD10|CA|Send material master|Process|
BD21|CA|Create IDocs from change pointers|Process|
BDM2|CA|IDoc trace across systems|Monitor|
WLF_IDOC|CA|IDoc monitor (newer releases)|Monitor|
BP|CA|Maintain business partner|Master data|G
CL02|CA|Class maintenance|Master data|
CT04|CA|Characteristics|Master data|
SCDO|CA|Change document objects|Tool|
FS00|FI-GL|G/L account master, centrally|Master data|G
FS01|FI-GL|Create G/L account master|Master data|G
FSP0|FI-GL|G/L account in chart of accounts|Master data|
FSS0|FI-GL|G/L account in company code|Master data|
FS10N|FI-GL|G/L account balance display|Report|G
FAGLB03|FI-GL|G/L account balance display (new G/L)|Report|
FBL3N|FI-GL|G/L account line items|Report|G
FAGLL03|FI-GL|G/L account line items (new G/L, ledger view)|Report|G
FAGLL03H|FI-GL|G/L line item browser (HANA)|Report|
FB01|FI-GL|Post document, general|Post|G
FB50|FI-GL|Enter G/L account document|Post|G
FB50L|FI-GL|Enter G/L account document for a ledger group|Post|
FV50|FI-GL|Park G/L account document|Post|G
FBV0|FI-GL|Post parked document|Post|G
FBV2|FI-GL|Change parked document|Post|G
FBV3|FI-GL|Display parked document|Display|G
FB02|FI-GL|Change document|Change|G
FB03|FI-GL|Display document|Display|G
FB04|FI-GL|Document changes|Display|G
FB08|FI-GL|Reverse document|Post|G
F.80|FI-GL|Mass reversal of documents|Post|G
FBRA|FI-GL|Reset cleared items|Post|G
FB05|FI-GL|Post with clearing|Post|G
F-03|FI-GL|Clear G/L account|Post|G
F.13|FI-GL|Automatic clearing|Post|G
F-04|FI-GL|Post with clearing (G/L)|Post|G
FBS1|FI-GL|Enter accrual or deferral document|Post|G
F.81|FI-GL|Reverse accrual or deferral documents|Post|G
FBD1|FI-GL|Enter recurring document|Post|G
FBD3|FI-GL|Display recurring document|Display|G
F.14|FI-GL|Execute recurring entries|Post|G
F.15|FI-GL|List recurring entries|Report|G
FBR2|FI-GL|Post with reference document|Post|G
FBD5|FI-GL|Realize recurring entry|Post|G
F.05|FI-GL|Foreign currency valuation (classic)|Period end|G
FAGL_FC_VAL|FI-GL|Foreign currency valuation (new G/L)|Period end|G
FAGL_FC_TRANS|FI-GL|Currency translation of balances|Period end|G
FAGLGVTR|FI-GL|Balance carryforward (new G/L)|Year end|G
GVTR|FI-SL|Balance carryforward (special ledgers)|Year end|G
F.16|FI-GL|Balance carryforward (classic G/L)|Year end|
OB52|FI-GL|Open and close posting periods|Period end|G
OB08|FI-GL|Maintain exchange rates|Config|G
F.01|FI-GL|Financial statements (classic)|Report|
S_ALR_87012284|FI-GL|Financial statements|Report|
S_ALR_87012277|FI-GL|G/L account balances|Report|G
S_ALR_87012301|FI-GL|Totals and balances|Report|
S_ALR_87012326|FI-GL|Chart of accounts list|Report|G
S_ALR_87012328|FI-GL|G/L account list|Report|G
S_ALR_87012308|FI-GL|Display changes to G/L accounts|Report|G
S_ALR_87012293|FI-GL|Display of changed documents|Report|G
F.51|FI-GL|G/L line item list|Report|G
FAGLF101|FI-GL|Sorted list and regrouping of receivables and payables|Period end|
FAGLGA35|FI-GL|Execute actual distribution (new G/L)|Period end|
GD23|FI-SL|Display special ledger local actual documents|Display|G
GD13|FI-SL|Display special ledger totals|Report|
GD20|FI-SL|Special ledger line items start menu|Report|
GB01|FI-SL|Post special ledger document|Post|
GR55|FI-SL|Execute Report Writer report group|Report|
GRR3|FI-SL|Display Report Painter report|Report|G
GCAC|FI-SL|Ledger comparison|Report|
GCU1|FI-SL|Transfer FI documents to special ledger|Tool|
FK01|FI-AP|Create vendor (accounting)|Master data|
FK03|FI-AP|Display vendor (accounting)|Display|
FK05|FI-AP|Block or unblock vendor|Master data|G
FK10N|FI-AP|Vendor balance display|Report|G
XK01|FI-AP|Create vendor centrally|Master data|G
XK02|FI-AP|Change vendor centrally|Master data|G
XK03|FI-AP|Display vendor centrally|Display|G
XK05|FI-AP|Block vendor centrally|Master data|G
XK06|FI-AP|Flag vendor for deletion|Master data|G
MKVZ|FI-AP|Vendor list for purchasing|Report|G
FB60|FI-AP|Enter vendor invoice|Post|G
FB65|FI-AP|Enter vendor credit memo|Post|G
FV60|FI-AP|Park vendor invoice|Post|
F-43|FI-AP|Enter vendor invoice, general|Post|
F-44|FI-AP|Clear vendor|Post|G
F-47|FI-AP|Down payment request|Post|G
F-48|FI-AP|Post vendor down payment|Post|G
F-54|FI-AP|Clear vendor down payment|Post|G
F-51|FI-AP|Post transfer with clearing|Post|G
F-53|FI-AP|Post outgoing payment|Post|
F-58|FI-AP|Payment with printout|Post|
F110|FI-AP|Automatic payment run|Post|G
F111|FI-AP|Payment run for payment requests|Post|
FBZ0|FI-AP|Display or edit payment proposal|Display|G
FBZP|FI-AP|Payment program configuration|Config|
FCH1|FI-AP|Display check information|Display|G
FCH5|FI-AP|Create check information manually|Post|G
FCHN|FI-AP|Check register|Report|
FBL1N|FI-AP|Vendor line items|Report|G
F.42|FI-AP|Vendor balances in local currency|Report|G
S_ALR_87012082|FI-AP|Vendor balances in local currency|Report|G
S_ALR_87012083|FI-AP|List of vendor open items for printing|Report|
S_ALR_87012086|FI-AP|Vendor list|Report|G
S_ALR_87012103|FI-AP|List of vendor line items|Report|
S_P99_41000099|FI-AP|Payment list|Report|G
FI01|FI-BL|Create bank master|Master data|G
FI03|FI-BL|Display bank master|Display|G
FI12|FI-BL|House banks and accounts|Config|
FF_5|FI-BL|Import electronic bank statement|Post|
FF67|FI-BL|Manual bank statement|Post|
FEBAN|FI-BL|Post-process bank statement|Post|
FD01|FI-AR|Create customer (accounting)|Master data|
FD03|FI-AR|Display customer (accounting)|Display|G
FD10N|FI-AR|Customer balance display|Report|G
FD11|FI-AR|Customer account analysis|Report|G
XD01|FI-AR|Create customer centrally|Master data|G
XD02|FI-AR|Change customer centrally|Master data|G
XD03|FI-AR|Display customer centrally|Display|G
XD04|FI-AR|Customer changes|Display|G
XD05|FI-AR|Block customer|Master data|G
XD99|FI-AR|Customer master mass maintenance|Master data|G
FB70|FI-AR|Enter customer invoice|Post|G
FB75|FI-AR|Enter customer credit memo|Post|
F-28|FI-AR|Post incoming payment|Post|G
F-32|FI-AR|Clear customer|Post|
F-26|FI-AR|Incoming payment fast entry|Post|
FBL5N|FI-AR|Customer line items|Report|G
F150|FI-AR|Dunning run|Post|G
F103|FI-AR|Transfer posting for doubtful receivables|Period end|G
F104|FI-AR|Reserve for doubtful receivables|Period end|G
FINT|FI-AR|Interest on arrears calculation|Period end|G
FINTSHOW|FI-AR|Display interest runs|Display|G
FBM3|FI-AR|Display sample document|Display|G
S_ALR_87012172|FI-AR|Customer balances in local currency|Report|
S_ALR_87012173|FI-AR|List of customer open items|Report|G
S_ALR_87012174|FI-AR|List of customer open items for printing|Report|G
S_ALR_87012179|FI-AR|Customer list|Report|G
S_ALR_87012197|FI-AR|List of customer line items|Report|
AS01|FI-AA|Create asset master|Master data|
AS02|FI-AA|Change asset master|Master data|
AS03|FI-AA|Display asset master|Display|
AS11|FI-AA|Create asset subnumber|Master data|
AW01N|FI-AA|Asset Explorer|Report|
ABZON|FI-AA|Asset acquisition with automatic offsetting entry|Post|
F-90|FI-AA|Asset acquisition with vendor|Post|
ABUMN|FI-AA|Asset transfer within company code|Post|
ABAVN|FI-AA|Asset retirement by scrapping|Post|
ABAON|FI-AA|Asset sale without customer|Post|
ABSO|FI-AA|Miscellaneous asset transactions|Post|
AB08|FI-AA|Reverse asset document|Post|
AIAB|FI-AA|Asset under construction: settlement rule|Post|
AIBU|FI-AA|Asset under construction: settle|Post|
AFAB|FI-AA|Depreciation posting run|Period end|
AFAR|FI-AA|Recalculate depreciation|Period end|
AJRW|FI-AA|Fiscal year change|Year end|
AJAB|FI-AA|Year-end closing for assets|Year end|
ABST2|FI-AA|Reconcile assets to G/L|Period end|
AUVA|FI-AA|List of incomplete assets|Report|G
AR01|FI-AA|Asset list|Report|G
AR02|FI-AA|Asset history sheet (call)|Report|G
AR03|FI-AA|Depreciation list|Report|G
S_ALR_87011963|FI-AA|Asset balances by asset number|Report|
S_ALR_87011990|FI-AA|Asset history sheet|Report|
S_ALR_87012936|FI-AA|Depreciation simulation|Report|
OARP|FI-AA|Asset report selection. Listed under real property master data reports in the GFEBS role map.|Report|G
FM5I|PSM-FM|Create fund|Master data|G
FM5U|PSM-FM|Change fund|Master data|G
FM5S|PSM-FM|Display fund|Display|G
FM6I|PSM-FM|Create application of funds|Master data|G
FM6U|PSM-FM|Change application of funds|Master data|G
FM6S|PSM-FM|Display application of funds|Display|G
FMSA|PSM-FM|Create funds center in FM area|Master data|G
FMSB|PSM-FM|Change funds center|Master data|G
FMSC|PSM-FM|Display funds center|Display|G
FMSE|PSM-FM|Funds center hierarchy maintenance|Master data|G
FMCIA|PSM-FM|Edit commitment item individually|Master data|G
FMCIC|PSM-FM|Display commitment item|Display|G
FMCIE|PSM-FM|Change commitment item hierarchy|Master data|
FMMEASURE|PSM-FM|Maintain funded program|Master data|G
FMMEASURED|PSM-FM|Display funded program|Display|G
FMBPD|PSM-FM|Maintain budget period|Master data|
FMDERIVE|PSM-FM|Maintain account assignment derivation rules|Config|
FMDERIVER|PSM-FM|Display account assignment derivation|Display|G
FMDERIVATIONANALYSIS|PSM-FM|Derivation trace and analysis|Tool|G
FMWHEREUSED|PSM-FM|Where-used list for FM master data|Report|G
FMBB|PSM-FM|Budgeting Workbench|Post|G
FMBBC|PSM-FM|Budgeting Workbench, create with template|Post|
FMEDD|PSM-FM|Display entry document|Display|G
FMEDDW|PSM-FM|Drilldown for budget entry documents|Report|G
FMRP_RW_BUDGET|PSM-FM|Budget overview report|Report|
FMRP_RW_BUDCON|PSM-FM|Budget consumption overview|Report|
FMRP_RFFMEP1AX|PSM-FM|All postings line item report|Report|G
FMRP_RFFMEP1FX|PSM-FM|FI line items in FM|Report|G
FMRP_RFFMEP1OX|PSM-FM|Commitment line items in FM|Report|
FMAVCR01|PSM-FM|Availability control: overview of annual values|Report|G
FMAVCR02|PSM-FM|Availability control: overview of overall values|Report|G
FMAVCREINIT|PSM-FM|Re-initialize availability control ledger|Tool|G
FMX1|PSM-FM|Create funds reservation|Post|
FMX2|PSM-FM|Change funds reservation|Change|
FMX3|PSM-FM|Display funds reservation|Display|
FMY1|PSM-FM|Create funds precommitment|Post|G
FMY2|PSM-FM|Change funds precommitment|Change|G
FMY3|PSM-FM|Display funds precommitment|Display|G
FMZ1|PSM-FM|Create funds commitment|Post|G
FMZ2|PSM-FM|Change funds commitment|Change|G
FMZ3|PSM-FM|Display funds commitment|Display|G
FMZ6|PSM-FM|Reduce funds commitment manually|Post|
FMW1|PSM-FM|Create funds block|Post|
FMV1|PSM-FM|Create forecast of revenue|Post|
FMSK|PSM-FM|Earmarked funds journal|Report|G
FMN0|PSM-FM|Subsequent posting of FI documents to FM|Tool|
FMN4N|PSM-FM|Reconstruct purchase order commitments in FM|Tool|
FMF0|PSM-FM|Payment conversion: paid invoices to payments|Period end|
FMJ2|PSM-FM|Year-end carryforward of open commitments|Year end|
FMJ3|PSM-FM|Reverse commitment carryforward|Year end|
FMMC|PSM-FM|Mass maintenance of open items and earmarked funds|Year end|G
FMIR|PSM-FM|FM period control. Listed under opening and closing posting periods in the GFEBS role map.|Period end|G
FMMI|PSM-FM|Mass maintenance of open intervals for posting|Period end|G
FMSU|PSM-FM|Fund balance carryforward maintenance|Year end|G
FMRC|PSM-FM|FM reconciliation transaction listed under open invoice processing in the GFEBS role map|Tool|G
FMST|PSM-FM|FM transaction listed under the payment program activity in the GFEBS role map|Process|G
FM_SETS_FUND1|PSM-FM|Create fund group|Master data|G
FM_SETS_FICTR1|PSM-FM|Create funds center group|Master data|G
FM_SETS_FIPEX1|PSM-FM|Create commitment item group|Master data|G
FMB_B01|PSM-FM|Budget transaction listed under year-end certification in the GFEBS role map|Year end|G
FMFG_E_TRANS_REG|PSM-FG|Transaction register|Report|G
FMFG_RCV|PSM-FG|US Federal transaction listed under trial balance and external reporting extracts in the GFEBS role map|Report|G
FMFG_YEAR_END_CLOSE|PSM-FG|Federal year-end closing postings|Year end|G
FMFG_RPT_E_UNFILLED|PSM-FG|Unfilled customer orders report|Report|G
FMFG_CANCELED_AP|PSM-FG|Cancelled appropriation: accounts payable|Year end|G
FMFG_CANCELED_AP_MM|PSM-FG|Cancelled appropriation: purchasing documents|Year end|G
FMFG_CANCELED_AR|PSM-FG|Cancelled appropriation: accounts receivable|Year end|G
FMFG_IPAC|PSM-FG|IPAC interface processing|Post|G
FMFG_PO_HISTORY|PSM-FG|US Federal purchase order history transaction|Report|G
FMFG_PO_POST|PSM-FG|US Federal posting of pending purchase order changes|Post|G
FMFG_PR_POST|PSM-FG|US Federal posting of pending purchase requisition changes|Post|G
FMFG_E_ZFZALI00|PSM-FG|Payment list for federal payment run|Report|G
RFMFGRCN_RP1|PSM-FG|US Federal reconciliation report listed under reconciliation postings in the GFEBS role map|Report|G
RFMFGRCN_RP2|PSM-FG|US Federal reconciliation report listed under reconciliation postings in the GFEBS role map|Report|G
RTREAS_OFFSET_FILE|PSM-FG|Create Treasury Offset Program file|Process|G
RTREAS_OFFSET_UPDATE|PSM-FG|Update from Treasury Offset Program|Process|G
KS01|CO|Create cost center|Master data|G
KS02|CO|Change cost center|Master data|G
KS03|CO|Display cost center|Display|G
KS04|CO|Delete cost center|Master data|G
KS05|CO|Cost center change documents|Display|G
KS12|CO|Change cost centers, collective|Master data|G
KS14|CO|Delete cost centers, collective|Master data|G
OKEON|CO|Change standard cost center hierarchy|Master data|G
OKENN|CO|Display standard cost center hierarchy|Display|G
KSH1|CO|Create cost center group|Master data|
KA01|CO|Create primary cost element|Master data|
KA03|CO|Display cost element|Display|
KA06|CO|Create secondary cost element|Master data|
KL01|CO|Create activity type|Master data|
KK01|CO|Create statistical key figure|Master data|
KP26|CO|Plan activity output and prices|Plan|
KP06|CO|Plan cost elements and activity inputs|Plan|
KB21N|CO|Enter direct activity allocation|Post|
KB11N|CO|Enter manual reposting of primary costs|Post|
KB15N|CO|Enter manual cost allocation|Post|
KB31N|CO|Enter statistical key figures|Post|
KB61|CO|Repost line items|Post|
KSB1|CO|Cost centers: actual line items|Report|
KSB5|CO|Display CO actual documents|Display|G
KSBP|CO|Cost centers: plan line items|Report|
KSU5|CO|Execute actual assessment|Period end|
KSV5|CO|Execute actual distribution|Period end|
KSU1|CO|Create actual assessment cycle|Config|
KSII|CO|Actual price calculation|Period end|
KSS2|CO|Actual cost splitting|Period end|
KGI2|CO|Actual overhead calculation for cost centers|Period end|
OKP1|CO|Change period lock|Period end|G
S_ALR_87013611|CO|Cost centers: actual, plan, variance|Report|
S_ALR_87013620|CO|Cost centers: actual, target, variance|Report|
KO01|CO|Create internal order|Master data|G
KO02|CO|Change internal order|Master data|G
KO03|CO|Display internal order|Display|G
KO04|CO|Order Manager|Master data|G
KOK2|CO|Collective change of internal orders|Master data|G
KOK3|CO|Collective display of internal orders|Display|G
KOB1|CO|Orders: actual line items|Report|
KO88|CO|Settle order, individual|Period end|
KO8G|CO|Settle orders, collective|Period end|
KOSRLIST_OR|CO|Settlement rule list for orders|Report|
S_ALR_87012993|CO|Orders: actual, plan, variance|Report|
CO99|CO|Set order status collectively (technically complete and close)|Year end|G
KE5Z|CO|Profit center actual line items|Report|
S_KI4_38000323|PSM-FM|Delivered report listed under period-end and external reporting in the GFEBS role map|Report|G
S_KI4_38000325|PSM-FM|Delivered report listed under period-end and external reporting in the GFEBS role map|Report|G
S_KI4_38000039|PSM-FM|Delivered report listed under year-end exception monitoring in the GFEBS role map|Report|G
CJ20N|PS|Project Builder|Master data|G
CJ01|PS|Create work breakdown structure|Master data|
CJ02|PS|Change work breakdown structure|Master data|
CJ03|PS|Display work breakdown structure|Display|
CJ11|PS|Create WBS element|Master data|
CJ13|PS|Display WBS element|Display|
CJ30|PS|Change original project budget|Post|
CJ32|PS|Release project budget|Post|
CJ40|PS|Change overall project plan|Plan|
CJ88|PS|Settle project, individual|Period end|
CJ8G|PS|Settle projects, collective|Period end|
CJI3|PS|Project actual cost line items|Report|G
CJI5|PS|Project commitment line items|Report|
CJI4|PS|Project plan cost line items|Report|
CN41|PS|Structure overview|Report|
CNS41|PS|Structure overview (enhanced)|Report|
S_ALR_87013558|PS|Budget, actual, commitment, remaining plan, assigned|Report|
S_ALR_87013542|PS|Actual, commitment, total, plan in CO area currency|Report|
CN21|PS|Create network|Master data|
CN25|PS|Confirm network activities|Post|
CNE5|PS|Progress analysis|Period end|
ME51N|MM-PUR|Create purchase requisition|Post|G A
ME52N|MM-PUR|Change purchase requisition|Change|G A
ME53N|MM-PUR|Display purchase requisition|Display|G A
ME54N|MM-PUR|Release purchase requisition|Approve|G
ME55|MM-PUR|Collective release of purchase requisitions|Approve|
ME5A|MM-PUR|List display of purchase requisitions|Report|G A
ME5K|MM-PUR|Requisitions by account assignment|Report|G
ME5J|MM-PUR|Requisitions for project|Report|G
ME57|MM-PUR|Assign and process purchase requisitions|Process|
ME59N|MM-PUR|Automatic creation of purchase orders from requisitions|Process|
ME21N|MM-PUR|Create purchase order|Post|G
ME22N|MM-PUR|Change purchase order|Change|G A
ME23N|MM-PUR|Display purchase order|Display|G A
ME28|MM-PUR|Release purchase orders, collective|Approve|
ME29N|MM-PUR|Release purchase order|Approve|
ME2N|MM-PUR|Purchasing documents by document number|Report|G
ME2L|MM-PUR|Purchasing documents by vendor|Report|G
ME2K|MM-PUR|Purchasing documents by account assignment|Report|G
ME2J|MM-PUR|Purchasing documents for project|Report|G
ME2M|MM-PUR|Purchasing documents by material|Report|
ME80FN|MM-PUR|General analyses of purchasing documents|Report|A
ME31K|MM-PUR|Create contract|Post|
ME33K|MM-PUR|Display contract|Display|
ME41|MM-PUR|Create request for quotation|Post|
ME11|MM-PUR|Create purchasing info record|Master data|G
ME12|MM-PUR|Change purchasing info record|Master data|G
ME13|MM-PUR|Display purchasing info record|Display|G
ME01|MM-PUR|Maintain source list|Master data|
MEMASSPO|MM-PUR|Mass change of purchase orders|Change|
ML81N|MM-SRV|Service entry sheet|Post|G
ML84|MM-SRV|List of service entry sheets|Report|
AC03|MM-SRV|Display service master|Display|
MIGO|MM-IM|Goods movement: receipt, issue, transfer|Post|G A
MB01|MM-IM|Goods receipt for purchase order (older)|Post|
MB1A|MM-IM|Goods withdrawal (older)|Post|G
MB1B|MM-IM|Transfer posting (older)|Post|
MB1C|MM-IM|Other goods receipts (older)|Post|A
MB02|MM-IM|Change material document|Change|G
MB03|MM-IM|Display material document|Display|G
MBST|MM-IM|Cancel material document|Post|G
MB51|MM-IM|Material document list|Report|G
MB52|MM-IM|Warehouse stocks of material|Report|
MB5B|MM-IM|Stocks on posting date|Report|
MB5L|MM-IM|List of stock values: balances|Report|G
MB5T|MM-IM|Stock in transit|Report|
MB21|MM-IM|Create reservation|Post|A
MB22|MM-IM|Change reservation|Change|A
MB25|MM-IM|Reservation list|Report|A
MMBE|MM-IM|Stock overview|Report|A
MM01|MM-IM|Create material|Master data|G
MM02|MM-IM|Change material|Master data|G
MM03|MM-IM|Display material|Display|G A
MM60|MM-IM|Materials list|Report|
MR21|MM-IM|Price change|Post|G
MMPV|MM-IM|Close material period|Period end|G
MMRV|MM-IM|Allow posting to previous period|Period end|G
MI01|MM-IM|Create physical inventory document|Post|
MI02|MM-IM|Change physical inventory document|Change|A
MI04|MM-IM|Enter inventory count|Post|A
MI05|MM-IM|Change inventory count|Change|A
MI07|MM-IM|Post inventory differences|Post|A
MI20|MM-IM|List of inventory differences|Report|A
MI21|MM-IM|Print physical inventory document|Process|A
MI22|MM-IM|Display physical inventory documents for material|Report|A
MI24|MM-IM|Physical inventory list|Report|A
MI31|MM-IM|Batch input: create physical inventory documents|Process|A
MD04|PP|Stock and requirements list|Report|A
MD01|PP|MRP run for plant|Process|
MD03|PP|Single-item, single-level MRP|Process|
MIRO|MM-IV|Enter incoming invoice (logistics invoice verification)|Post|G
MIR7|MM-IV|Park incoming invoice|Post|
MIR4|MM-IV|Display invoice document|Display|G
MIR5|MM-IV|Display list of invoice documents|Report|G
MIR6|MM-IV|Invoice overview|Report|
MRBR|MM-IV|Release blocked invoices|Approve|G
MR8M|MM-IV|Cancel invoice document|Post|G
MR11|MM-IV|Maintain GR/IR clearing account|Period end|G
MRKO|MM-IV|Settle consignment and pipeline liabilities|Post|G
MRRL|MM-IV|Evaluated receipt settlement|Post|
VA01|SD|Create sales order|Post|G
VA02|SD|Change sales order|Change|G
VA03|SD|Display sales order|Display|G
VA05|SD|List of sales orders|Report|G
VA41|SD|Create contract|Post|
VD03|SD|Display customer (sales)|Display|G
OV51|SD|Display customer master changes|Display|G
VL01N|LE|Create outbound delivery|Post|
VL02N|LE|Change outbound delivery, post goods issue|Change|A
VL03N|LE|Display outbound delivery|Display|
VL06I|LE|Inbound delivery monitor|Report|A
VL06O|LE|Outbound delivery monitor|Report|A
VL10|LE|Deliveries due list|Process|
VF01|SD|Create billing document|Post|G
VF02|SD|Change billing document|Change|G
VF03|SD|Display billing document|Display|G
VF04|SD|Billing due list|Process|G
VF05|SD|List of billing documents|Report|G
VF06|SD|Batch billing|Process|G
VF11|SD|Cancel billing document|Post|G
VF31|SD|Output from billing|Process|G
VFX3|SD|Release billing documents to accounting|Post|G
DP90|SD|Resource-related billing request, single|Post|
DP91|SD|Resource-related billing request for sales document|Post|G
DP96|SD|Resource-related billing request, collective|Post|G
DP99B|SD|Document flow of resource-related billing by sales document|Report|G
VKM1|SD|Blocked sales documents (credit)|Approve|
IE01|PM|Create equipment|Master data|
IE02|PM|Change equipment|Master data|A
IE03|PM|Display equipment|Display|A
IE05|PM|Equipment list: change|Report|A
IH01|PM|Functional location structure|Report|A
IL03|PM|Display functional location|Display|
IQ09|PM|Display material serial numbers|Report|A
IW21|PM|Create maintenance notification|Post|A
IW22|PM|Change maintenance notification|Change|A
IW24|PM|Create malfunction report|Post|A
IW28|PM|Change notifications, list|Report|A
IW31|PM|Create maintenance order|Post|A
IW32|PM|Change maintenance order|Change|A
IW33|PM|Display maintenance order|Display|G
IW37N|PM|Change orders and operations|Report|A
IW38|PM|Change maintenance orders, list|Report|A
IW39|PM|Display maintenance orders, list|Report|A
IW41|PM|Enter order confirmation|Post|A
IW42|PM|Overall completion confirmation|Post|A
IW47|PM|Confirmation list|Report|A
IW13|PM|Material where-used list|Report|A
IWBK|PM|Material availability information|Report|A
IP01|PM|Create maintenance plan|Master data|A
IP02|PM|Change maintenance plan|Master data|A
IP10|PM|Schedule maintenance plan|Process|A
IP24|PM|Scheduling overview list|Report|A
IP30|PM|Maintenance schedule date monitoring|Process|A
IP41|PM|Add single-cycle plan|Master data|A
IP43|PM|Add multiple-counter plan|Master data|A
IA05|PM|Create general task list|Master data|A
IA08|PM|Change task lists|Master data|A
IA25|PM|Delete task lists|Master data|A
IK02|PM|Change measuring point|Master data|A
IR02|PM|Change work center|Master data|A
CM01|PP|Capacity planning: work center load|Report|A
CM02|PP|Capacity planning: orders|Report|A
CM07|PP|Capacity planning: variable access|Report|A
PP61|PP|Change shift planning|Plan|A
CO01|PP|Create production order|Post|
CO11N|PP|Enter production order confirmation|Post|
COOIS|PP|Production order information system|Report|
CS03|PP|Display material bill of material|Display|
CAT2|HCM|Time sheet: maintain times|Post|A
CAT3|HCM|Time sheet: display times|Display|A
CAT5|HCM|Transfer time data to Project System|Process|
CAT7|HCM|Transfer time data to Controlling|Process|
CATS_DA|HCM|Display working times|Report|
PA20|HCM|Display HR master data|Display|A
PA30|HCM|Maintain HR master data|Master data|A
PA40|HCM|Personnel actions|Master data|A
PPPD|HCM|Display profile|Display|A
PPPM|HCM|Change profile|Master data|A
RE80|RE-FX|RE Navigator|Master data|G
REBDBE|RE-FX|Business entity|Master data|G
REBDBU|RE-FX|Building|Master data|G
REBDPR|RE-FX|Land|Master data|G
REBDRO|RE-FX|Rental object|Master data|G
RECN|RE-FX|Real estate contract|Master data|G
REISBP|RE-FX|Information system: business partners|Report|G
REISBE|RE-FX|Information system: business entities|Report|G
REISPR|RE-FX|Information system: land|Report|G
REISCN|RE-FX|Information system: contracts|Report|G
RECPA410|RE-FX|Print contract form|Process|G
RSA3|BW|Extractor checker|Tool|
RSA7|BW|Delta queue maintenance|Monitor|
ODQMON|BW|Operational delta queue monitor|Monitor|
LBWE|BW|Logistics extraction cockpit|Config|
LTRC|BW|SLT replication server cockpit|Monitor|
LTRS|BW|SLT advanced replication settings|Config|
/ISDFPS/LSP2|DFPS|Logistical mission support|Process|A
/ISDFPS/DISP_EQU_SIT|DFPS|Display equipment situation|Report|A
/ISDFPS/DISP_MAT_SIT|DFPS|Display material situation|Report|A
/ISDFPS/LMSTB1|DFPS|Status board, change mode|Process|A
/ISDFPS/MNTF_CR|DFPS|Mass creation of notifications|Process|A
/ISDFPS/SREL1|DFPS|Support relationships|Master data|A
/ISDFPS/TOEP2|DFPS|Personnel organizational basis|Display|A
PIC03|MM-IM|Display parts interchangeability|Display|A
ABSU|MM-IM|Maintain bench stock and storage bin|Master data|A
MCH01|PM|Mass maintenance of maintenance plans|Master data|A
`;

export const sapTcodes = raw.trim().split('\n').map((line) => {
  const [code, area, text, kind, evidence] = line.split('|');
  const seen = [];
  if (evidence.includes('G')) seen.push('GFEBS');
  if (evidence.includes('A')) seen.push('GCSS-Army');
  return [code, area, text, kind, seen.join(', ')];
});
export const sapTcodeColumns = ['Transaction', 'Area', 'What it does', 'Kind', 'Public DoD listing'];
