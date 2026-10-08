// SAP field and data element catalog. field|area|type and length|meaning|main tables|reporting link
// Lengths are ECC 6.0 values. S/4HANA lengthens some fields (material number to 40, amounts to 23 digits).
const raw = `
MANDT|BC|CLNT 3|Client|every client-dependent table|Not reported. Filter on it in every direct query.
BUKRS|FI|CHAR 4|Company code|BKPF, BSEG, T001, EKKO, ANLA|Reporting entity boundary
GJAHR|FI|NUMC 4|Fiscal year|BKPF, BSEG, FMIFIIT, RBKP|GTAS fiscal year
MONAT|FI|NUMC 2|Fiscal period|BKPF|GTAS reporting period
BELNR|FI|CHAR 10|Accounting document number|BKPF, BSEG, BSIS, BSIK|Universe of transactions key
BUZEI|FI|NUMC 3|Line item number within the accounting document|BSEG, BSIS|Universe of transactions key
BLART|FI|CHAR 2|Document type|BKPF, T003|Separates system postings from manual journals
BLDAT|FI|DATS 8|Document date|BKPF|Source document date for cutoff tests
BUDAT|FI|DATS 8|Posting date|BKPF, MKPF, RBKP|Period assignment
CPUDT|FI|DATS 8|Entry date|BKPF|Timeliness of recording
CPUTM|FI|TIMS 6|Entry time|BKPF|Timeliness of recording
USNAM|FI|CHAR 12|User who entered the document|BKPF|Preparer for journal testing
TCODE|FI|CHAR 20|Transaction code used|BKPF|How the posting was made
AWTYP|FI|CHAR 5|Reference procedure: type of source object|BKPF|Path to the source document
AWKEY|FI|CHAR 20|Object key of the source document|BKPF|Path to the source document
XBLNR|FI|CHAR 16|Reference document number|BKPF, RBKP, MKPF|Vendor invoice number, contract or interface reference
BKTXT|FI|CHAR 25|Document header text|BKPF|Free text. Often holds interface identifiers.
STBLG|FI|CHAR 10|Reversal document number|BKPF|Links a reversal to its original
STGRD|FI|CHAR 2|Reason for reversal|BKPF|Reversal analysis
WAERS|FI|CUKY 5|Document currency|BKPF, EKKO|Foreign currency activity
KURSF|FI|DEC 9,5|Exchange rate|BKPF|Foreign currency activity
BSTAT|FI|CHAR 1|Document status: normal, parked, noted, statistical|BKPF|Exclude parked and noted items from balances
XREVERSAL|FI|CHAR 1|Reversal indicator|BKPF|Reversal analysis
LDGRP|FI|CHAR 4|Ledger group|BKPF|Ledger-specific postings
BSCHL|FI|CHAR 2|Posting key|BSEG|Debit or credit and account type
KOART|FI|CHAR 1|Account type: S G/L, K vendor, D customer, A asset, M material|BSEG|Subledger identification
SHKZG|FI|CHAR 1|Debit/credit indicator: S debit, H credit|BSEG, MSEG, EKBE|GTAS debit credit indicator
DMBTR|FI|CURR 13,2|Amount in local currency|BSEG, MSEG, EKBE|Trial balance amount
WRBTR|FI|CURR 13,2|Amount in document currency|BSEG, RSEG|Source document amount
HKONT|FI|CHAR 10|G/L account|BSEG, BSIS|DoD Standard Chart of Accounts account
SAKNR|FI|CHAR 10|G/L account number in master data|SKA1, SKB1|DoD Standard Chart of Accounts account
KTOPL|FI|CHAR 4|Chart of accounts|T004, SKA1|Chart identification
XBILK|FI|CHAR 1|Balance sheet account flag|SKA1|Carryforward behavior
MITKZ|FI|CHAR 1|Reconciliation account type|SKB1|Subledger control account
XOPVW|FI|CHAR 1|Open item management flag|SKB1|Clearing behavior
UMSKZ|FI|CHAR 1|Special G/L indicator: down payments, guarantees|BSEG, BSIK, BSID|Advances and prepayments
ZUONR|FI|CHAR 18|Assignment number|BSEG, BSIS|Sort and clearing key
SGTXT|FI|CHAR 50|Line item text|BSEG|Free text support
AUGBL|FI|CHAR 10|Clearing document number|BSEG, BSAK, BSAD|Payment and clearing trace
AUGDT|FI|DATS 8|Clearing date|BSEG, BSAK, BSAD|Aging and payment timing
ZFBDT|FI|DATS 8|Baseline date for due date calculation|BSEG|Prompt Payment Act due date
ZTERM|FI|CHAR 4|Terms of payment key|BSEG, LFB1, EKKO|Prompt Payment Act terms
ZLSCH|FI|CHAR 1|Payment method|BSEG, LFB1, REGUH|EFT, check, IPAC
ZLSPR|FI|CHAR 1|Payment block|BSEG|Blocked invoices
MWSKZ|FI|CHAR 2|Tax code|BSEG|Tax reporting
VBUND|FI|CHAR 6|Trading partner company ID|BSEG, LFA1, KNA1|SFIS trading partner. GTAS trading partner agency identifier.
GSBER|FI|CHAR 4|Business area|BSEG|Sub-entity balance sheets
PRCTR|FI|CHAR 10|Profit center|BSEG, CEPC|Segment reporting
SEGMENT|FI|CHAR 10|Segment for segmental reporting|FAGLFLEXA, ACDOCA|Segment reporting
RLDNR|FI|CHAR 2|Ledger|FAGLFLEXA, ACDOCA, FMIT|Leading ledger versus reporting ledgers
RACCT|FI|CHAR 10|Account number in ledger tables|FAGLFLEXA, ACDOCA|DoD Standard Chart of Accounts account
HSL|FI|CURR 17,2|Amount in local currency in ledger tables|FAGLFLEXA, ACDOCA|Trial balance amount
DRCRK|FI|CHAR 1|Debit/credit indicator in ledger tables|FAGLFLEXA, ACDOCA|GTAS debit credit indicator
POPER|FI|NUMC 3|Posting period in ledger tables|FAGLFLEXA, ACDOCA|GTAS reporting period
DOCLN|FI|CHAR 6|Ledger line item|FAGLFLEXA, ACDOCA|Universe of transactions key
LIFNR|FI|CHAR 10|Vendor account number|LFA1, BSEG, EKKO, RBKP|Payee
KUNNR|FI|CHAR 10|Customer account number|KNA1, BSEG, VBAK|Reimbursable customer
KTOKK|FI|CHAR 4|Vendor account group|LFA1|Vendor type: federal, commercial, employee
STCD1|FI|CHAR 16|Tax number 1|LFA1, KNA1|Taxpayer identification
STCEG|FI|CHAR 20|VAT registration number|LFA1|Foreign vendors
BANKN|FI|CHAR 18|Bank account number|LFBK|Payment file. Sensitive data.
BANKL|FI|CHAR 15|Bank key (routing number)|LFBK, BNKA|Payment file
SPERR|FI|CHAR 1|Central posting block|LFA1|Blocked vendors
LAUFD|FI|DATS 8|Payment run date|REGUH, REGUP|Payment batch
LAUFI|FI|CHAR 6|Payment run identification|REGUH, REGUP|Payment batch
VBLNR|FI|CHAR 10|Payment document number|REGUH, REGUP|Disbursement document
CHECT|FI|CHAR 13|Check number|PAYR|Treasury check or EFT trace number
RWBTR|FI|CURR 13,2|Amount paid in payment currency|REGUH|Disbursement amount
ANLN1|AA|CHAR 12|Main asset number|ANLA, ANEP, BSEG|Property record identifier
ANLN2|AA|CHAR 4|Asset subnumber|ANLA, ANEP|Property record identifier
ANLKL|AA|CHAR 8|Asset class|ANLA|General PP&E category
AKTIV|AA|DATS 8|Capitalization date|ANLA|Placed-in-service date
DEAKT|AA|DATS 8|Deactivation date|ANLA|Disposal date
AFABE|AA|NUMC 2|Depreciation area|ANLB, ANLC, ANEP|Book for financial reporting
AFASL|AA|CHAR 4|Depreciation key|ANLB|Method
NDJAR|AA|NUMC 3|Planned useful life in years|ANLB|Useful life
KANSW|AA|CURR 13,2|Cumulative acquisition value at year start|ANLC|Acquisition cost
KNAFA|AA|CURR 13,2|Accumulated ordinary depreciation at year start|ANLC|Accumulated depreciation
BWASL|AA|CHAR 3|Asset transaction type|ANEP|Acquisition, transfer, retirement
INVNR|AA|CHAR 25|Inventory number|ANLA|Bar code or unique item identifier cross-reference
FIKRS|FM|CHAR 4|Financial management area|FM01, FMIOI, FMIFIIT|Budget control scope
GEBER|FM|CHAR 10|Fund, as an account assignment field|BSEG, EKKN, KBLP|SFIS appropriation elements A1 to A4 and A27 to A29 through the fund master
FINCODE|FM|CHAR 10|Fund, in the fund master|FMFINCODE|SFIS appropriation elements through the fund master
FONDS|FM|CHAR 10|Fund, in FM line item tables|FMIOI, FMIFIIT|TAS on the trial balance
RFUND|FM|CHAR 10|Fund, in totals and ledger tables|FMIT, FAGLFLEXA|TAS on the trial balance
FISTL|FM|CHAR 16|Funds center|BSEG, EKKN, FMIOI, FMIFIIT, FMFCTR|SLOA Funding Center Identifier (CA1)
FICTR|FM|CHAR 16|Funds center, in the master table|FMFCTR|SLOA Funding Center Identifier (CA1)
FIPOS|FM|CHAR 14|Commitment item, short form|BSEG, EKKN|SLOA Object Class Code (B6) by derivation
FIPEX|FM|CHAR 24|Commitment item, long form|FMCI, FMIOI, FMIFIIT|SLOA Object Class Code (B6) by derivation
FKBER|FM|CHAR 16|Functional area|BSEG, EKKN, FMIOI, FMIFIIT, TFKB|SLOA Functional Area Identifier (CA15)
FAREA|FM|CHAR 16|Functional area, in FM line items|FMIOI, FMIFIIT|SLOA Functional Area Identifier (CA15)
MEASURE|FM|CHAR 24|Funded program|FMMEASURE, FMIOI, FMIFIIT|Budget Line Item or program below the fund
GRANT_NBR|FM|CHAR 20|Grant|GMGR, BSEG, FMIFIIT|Sponsored program reporting
BUDGET_PD|FM|CHAR 10|Budget period|FMBUDGETPD, FMIOI, FMIFIIT|Period of availability for multi-year funds
USERDIM|FM|CHAR 10|Customer field for FM account assignment|FMIOI, FMIFIIT|Program-defined
WRTTP|FM|CHAR 2|Value type: 50 requisition, 51 order, 54 invoice, 57 payment, 65 funds commitment|FMIOI, FMIFIIT, FMIT|Budgetary stage
BTART|FM|CHAR 4|Amount type: 0100 original, 0150 change, 0200 reduction, 0300 and 0350 carryforward|FMIOI, FMIFIIT|Obligation adjustments and liquidations
VRGNG|FM|CHAR 4|Business transaction|FMIFIIT, COEP|Process identification
FKBTR|FM|CURR 15,2|Amount in FM area currency|FMIOI, FMIFIIT|Budgetary amount
TRBTR|FM|CURR 15,2|Amount in transaction currency|FMIOI, FMIFIIT|Budgetary amount
ZHLDT|FM|DATS 8|FM posting date used for period assignment|FMIOI, FMIFIIT|Budget year assignment
STATS|FM|CHAR 1|Statistical indicator|FMIOI, FMIFIIT|Exclude statistical lines from consumption
REFBN|FM|CHAR 10|Reference document number|FMIOI|Requisition, order, or earmarked funds number
REFBT|FM|CHAR 3|Reference document category|FMIOI|010 requisition, 020 order, other values for earmarked funds categories
RFPOS|FM|NUMC 5|Reference document item|FMIOI|Order or requisition line
FMBELNR|FM|CHAR 10|FM document number|FMIFIIT|Join to FMIFIHD
KNBELNR|FM|CHAR 10|FI document number on the FM line|FMIFIIT|Join to BKPF
KNGJAHR|FM|NUMC 4|FI fiscal year on the FM line|FMIFIIT|Join to BKPF
VREFBN|FM|CHAR 10|Predecessor document number|FMIFIIT|Order that the invoice consumed
VREFBT|FM|CHAR 3|Predecessor document category|FMIFIIT|Type of consumed commitment
PAYFLG|FM|CHAR 1|Payment conversion flag|FMIFIIT|Invoice converted to paid status
KBLNR|FM|CHAR 10|Earmarked funds document number|KBLK, KBLP, BSEG|Obligating document for non-order spending
BLPOS|FM|NUMC 3|Earmarked funds document item|KBLP, KBLE|Obligating document line
BLTYP|FM|CHAR 3|Earmarked funds document category|KBLK|Reservation, precommitment, commitment
ERLKZ|FM|CHAR 1|Completion indicator for earmarked funds|KBLP|Closed obligations
KOKRS|CO|CHAR 4|Controlling area|TKA01, CSKS, COEP|Cost accounting scope
KOSTL|CO|CHAR 10|Cost center|CSKS, BSEG, EKKN|SLOA Cost Center Identifier (CA3)
KSTAR|CO|CHAR 10|Cost element|CSKA, COEP, COSP|SLOA Cost Element Code (CA6)
AUFNR|CO|CHAR 12|Order number|AUFK, BSEG, EKKN, AFIH|SLOA Work Order Number (CA7)
AUART|CO|CHAR 4|Order type|AUFK|Order category
LSTAR|CO|CHAR 6|Activity type|CSLA, COEP|SLOA Activity Identifier (CA5) in some programs
STAGR|CO|CHAR 6|Statistical key figure|COEPR|Allocation basis
OBJNR|CO|CHAR 22|Object number: prefix plus key of cost center, order, WBS|COEP, COSP, JEST, AUFK, PRPS|Join key across CO, status, and settlement tables
WOGBTR|CO|CURR 15,2|Amount in object currency|COEP|Cost amount
WKGBTR|CO|CURR 15,2|Amount in controlling area currency|COEP|Cost amount
BEKNZ|CO|CHAR 1|Debit/credit indicator for CO|COEP, COSP|Cost debit or credit
PAROB|CO|CHAR 22|Partner object|COEP, COSS|Sender or receiver of an allocation
PSPNR|PS|NUMC 8|WBS element internal number|PRPS, PROJ|Join key
POSID|PS|CHAR 24|WBS element external ID|PRPS|SLOA Project Identifier (CA4)
PSPID|PS|CHAR 24|Project definition external ID|PROJ|SLOA Project Identifier (CA4)
PROJK|PS|NUMC 8|WBS element on the FI line item|BSEG|Project cost trace
PS_PSP_PNR|PS|NUMC 8|WBS element on purchasing account assignment|EKKN, EBKN|Project cost trace
BANFN|MM|CHAR 10|Purchase requisition number|EBAN, EBKN, EKPO|Commitment document
BNFPO|MM|NUMC 5|Purchase requisition item|EBAN, EBKN|Commitment document line
BSART|MM|CHAR 4|Purchasing document type|EBAN, EKKO|Order type: standard, MIPR, miscellaneous pay
FRGKZ|MM|CHAR 1|Release indicator|EBAN|Approval status
FRGZU|MM|CHAR 8|Release status|EBAN, EKKO|Approval steps completed
EBELN|MM|CHAR 10|Purchasing document number|EKKO, EKPO, EKKN, EKBE, RSEG, MSEG|Obligating document
EBELP|MM|NUMC 5|Purchasing document item|EKPO, EKKN, EKBE|Obligating document line
ZEKKN|MM|NUMC 2|Account assignment sequence number|EKKN, EKBE|Funding line on the order item
BEDAT|MM|DATS 8|Purchasing document date|EKKO|Obligation date
AEDAT|MM|DATS 8|Date created or last changed|EKKO, EKPO|Obligation timing
EKORG|MM|CHAR 4|Purchasing organization|EKKO|Buying activity
EKGRP|MM|CHAR 3|Purchasing group|EKKO, EBAN|Buyer or contracting office
KNTTP|MM|CHAR 1|Account assignment category|EKPO, EBAN|Cost center, order, project, asset
PSTYP|MM|CHAR 1|Item category|EKPO, EBAN|Standard, service, limit
MATKL|MM|CHAR 9|Material group|EKPO, EBAN, MARA|Object class derivation in several DoD programs
NETPR|MM|CURR 11,2|Net price|EKPO|Unit price
NETWR|MM|CURR 15,2|Net order value|EKPO, EKKN|Obligation amount
MENGE|MM|QUAN 13,3|Quantity|EKPO, EKBE, MSEG, RSEG|Three-way match
MEINS|MM|UNIT 3|Base unit of measure|EKPO, MSEG, MARA|Three-way match
ELIKZ|MM|CHAR 1|Delivery completed indicator|EKPO|Obligation ready for deobligation review
EREKZ|MM|CHAR 1|Final invoice indicator|EKPO|Obligation ready for deobligation review
LOEKZ|MM|CHAR 1|Deletion indicator|EKPO, EBAN|Cancelled lines
WEPOS|MM|CHAR 1|Goods receipt indicator|EKPO|Receipt required
WEBRE|MM|CHAR 1|Goods-receipt-based invoice verification|EKPO|Invoice matched to receipt
KONNR|MM|CHAR 10|Outline agreement number|EKPO|Contract reference
VGABE|MM|CHAR 1|Transaction type in order history: 1 goods receipt, 2 invoice receipt, 9 service entry|EKBE|Receipt and invoice trace
BEWTP|MM|CHAR 1|Order history category|EKBE|Receipt and invoice trace
SAKTO|MM|CHAR 10|G/L account on purchasing account assignment|EKKN, EBKN|Expense or asset account for the obligation
LBLNI|MM|CHAR 10|Service entry sheet number|ESSR, EKBE|Acceptance of services
PACKNO|MM|NUMC 10|Service package number|ESLL, ESSR|Service line detail
MBLNR|MM|CHAR 10|Material document number|MKPF, MSEG|Receipt or issue document
MJAHR|MM|NUMC 4|Material document year|MKPF, MSEG|Receipt or issue document
ZEILE|MM|NUMC 4|Material document item|MSEG|Receipt or issue document line
BWART|MM|CHAR 3|Movement type: 101 receipt for order, 201 issue to cost center, 261 issue to order, 301 transfer|MSEG|Kind of stock movement
SOBKZ|MM|CHAR 1|Special stock indicator|MSEG, MSKA|Project, sales order, or vendor stock
MATNR|MM|CHAR 18|Material number|MARA, MSEG, EKPO|National stock number cross-reference
WERKS|MM|CHAR 4|Plant|T001W, MARC, MSEG, EKPO|Location
LGORT|MM|CHAR 4|Storage location|MARD, MSEG|Location
CHARG|MM|CHAR 10|Batch|MCHB, MSEG|Lot
BWKEY|MM|CHAR 4|Valuation area|MBEW|Valuation scope
BKLAS|MM|CHAR 4|Valuation class|MBEW|Inventory G/L account determination
VPRSV|MM|CHAR 1|Price control: S standard, V moving average|MBEW|Inventory valuation method
VERPR|MM|CURR 11,2|Moving average price|MBEW|Inventory valuation
STPRS|MM|CURR 11,2|Standard price|MBEW|Inventory valuation
LBKUM|MM|QUAN 13,3|Total valuated stock|MBEW|Inventory quantity
SALK3|MM|CURR 13,2|Value of total valuated stock|MBEW|Inventory value
LABST|MM|QUAN 13,3|Unrestricted-use stock|MARD|On-hand quantity
RSNUM|MM|NUMC 10|Reservation number|RKPF, RESB|Parts demand
SERNR|MM|CHAR 18|Serial number|OBJK, EQUI|Serialized item tracking
VBELN|SD|CHAR 10|Sales, delivery, or billing document number|VBAK, LIKP, VBRK|Customer order or bill
POSNR|SD|NUMC 6|Sales document item|VBAP, LIPS, VBRP|Order line
VBTYP|SD|CHAR 1|Sales document category|VBAK, VBFA|Order, delivery, invoice, credit memo
FKART|SD|CHAR 4|Billing type|VBRK|Bill type
FKDAT|SD|DATS 8|Billing date|VBRK|Revenue timing
BSTKD|SD|CHAR 35|Customer purchase order number|VBKD|Customer funding document, such as a MIPR number
KNUMV|SD|CHAR 10|Pricing document condition number|VBAK, VBRK, KONV|Price detail
VKORG|SD|CHAR 4|Sales organization|VBAK|Selling activity
EQUNR|PM|CHAR 18|Equipment number|EQUI, AFIH|Equipment item
TPLNR|PM|CHAR 30|Functional location|IFLOT|Installation or facility structure
QMNUM|PM|CHAR 12|Notification number|QMEL|Fault report
ILART|PM|CHAR 3|Maintenance activity type|AFIH|Type of work
AUFPL|PM|NUMC 10|Routing number of operations in the order|AFKO, AFVC|Join to operations
RUECK|PM|NUMC 10|Confirmation number|AFRU|Labor confirmation
ISMNW|PM|QUAN 13,3|Actual work|AFVV, AFRU|Labor hours
PERNR|HCM|NUMC 8|Personnel number|PA0001, CATSDB|Employee
CATSHOURS|HCM|QUAN 4,2|Hours recorded on the time sheet|CATSDB|Labor distribution
AWART|HCM|CHAR 4|Attendance or absence type|CATSDB|Labor category
SWENR|RE|CHAR 8|Business entity number|VIBDBE|Installation
SGENR|RE|CHAR 8|Building number|VIBDBU|Facility
RECNNR|RE|CHAR 13|Real estate contract number|VICNCN|Lease or agreement
DOCNUM|CA|NUMC 16|IDoc number|EDIDC, EDID4, EDIDS|Interface record key
MESTYP|CA|CHAR 30|Message type|EDIDC|Kind of interface message
IDOCTP|CA|CHAR 30|Basic IDoc type|EDIDC|Message structure
STATUS|CA|CHAR 2|IDoc status|EDIDC, EDIDS|Interface success or failure
SNDPRN|CA|CHAR 10|Sender partner number|EDIDC|Source system
RCVPRN|CA|CHAR 10|Receiver partner number|EDIDC|Target system
OBJECTCLAS|CA|CHAR 15|Change document object class|CDHDR, CDPOS|What kind of object changed
OBJECTID|CA|CHAR 90|Change document object value|CDHDR, CDPOS|Which record changed
CHANGENR|CA|CHAR 10|Change document number|CDHDR, CDPOS|Change event
FNAME|CA|CHAR 30|Field changed|CDPOS|Changed field
VALUE_OLD|CA|CHAR 254|Old value|CDPOS|Before value
VALUE_NEW|CA|CHAR 254|New value|CDPOS|After value
UDATE|CA|DATS 8|Change date|CDHDR|When it changed
USERNAME|CA|CHAR 12|User who made the change|CDHDR|Who changed it
STAT|CA|CHAR 5|Object status|JEST|Released, technically complete, closed
BNAME|BC|CHAR 12|User name in the user master|USR02|Access review
AGR_NAME|BC|CHAR 30|Role name|AGR_USERS, AGR_1251|Access review
TRKORR|BC|CHAR 20|Transport request number|E070, E071|Change management
PARTNER|CA|CHAR 10|Business partner number|BUT000|Vendor and customer identity in S/4HANA
`;

export const sapFields = raw.trim().split('\n').map((line) => line.split('|'));
export const sapFieldColumns = ['Field', 'Area', 'Type and length', 'Meaning', 'Main tables', 'Reporting or audit use'];
