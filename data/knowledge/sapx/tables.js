// SAP table catalog. One line per table: name|module|what it holds|key fields.
// Standard SAP product tables only. Program-specific Z-tables are not public.
const raw = `
T000|BC|Clients|MANDT
T001|FI-GL|Company codes|BUKRS
T001B|FI-GL|Permitted posting periods by account type|BUKRS (variant), KOART, BKONT
T001W|MM-IM|Plants|WERKS
T001L|MM-IM|Storage locations|WERKS, LGORT
T001K|MM-IM|Valuation area to company code|BWKEY
T003|FI-GL|Document types|BLART
T003T|FI-GL|Document type texts|SPRAS, BLART
T004|FI-GL|Chart of accounts directory|KTOPL
T009|FI-GL|Fiscal year variants|PERIV
T009B|FI-GL|Fiscal year variant periods|PERIV, BDATJ, BUMON, BUTAG
T012|FI-BL|House banks|BUKRS, HBKID
T012K|FI-BL|House bank accounts|BUKRS, HBKID, HKTID
T030|FI-GL|Automatic account determination (standard accounts table)|KTOPL, KTOSL, BWMOD, KOMOK, BKLAS
T042|FI-AP|Payment program parameters by paying company code|BUKRS
T042Z|FI-AP|Payment methods by country|LAND1, ZLSCH
T052|FI-AP|Terms of payment|ZTERM, ZTAGG
T074|FI-GL|Special G/L accounts|KTOPL, KOART, UMSKZ, HKONT
T077K|FI-AP|Vendor account groups|KTOKK
T077D|FI-AR|Customer account groups|KTOKD
T156|MM-IM|Movement types|BWART
T156T|MM-IM|Movement type texts|SPRAS, BWART, SOBKZ, KZBEW, KZZUG, KZVBR
T161|MM-PUR|Purchasing document types|BSTYP, BSART
T024|MM-PUR|Purchasing groups|EKGRP
T024E|MM-PUR|Purchasing organizations|EKORG
T023|MM-PUR|Material groups|MATKL
T163K|MM-PUR|Account assignment categories|KNTTP
T880|FI-GL|Trading partner companies|RCOMP
T881|FI-GL|Ledger master|RLDNR
T8G17|FI-GL|Document splitting item categories|ITEM_CATEG
TKA01|CO|Controlling areas|KOKRS
TKA02|CO|Controlling area to company code assignment|BUKRS, GSBER
TGSB|FI-GL|Business areas|GSBER
TFKB|PSM-FM|Functional areas|FKBER
TVKO|SD|Sales organizations|VKORG
TVAK|SD|Sales document types|AUART
TVFK|SD|Billing document types|FKART
TJ02|CA|System status definitions|ISTAT
TJ30|CA|User status definitions|STSMA, ESTAT
TCURR|BC|Exchange rates|KURST, FCURR, TCURR, GDATU
TCURC|BC|Currency codes|WAERS
TSTC|BC|Transaction codes|TCODE
TSTCT|BC|Transaction code texts|SPRSL, TCODE
TADIR|BC|Repository object directory|PGMID, OBJECT, OBJ_NAME
DD02L|BC|ABAP Dictionary tables|TABNAME, AS4LOCAL, AS4VERS
DD03L|BC|ABAP Dictionary table fields|TABNAME, FIELDNAME, AS4LOCAL, AS4VERS, POSITION
DD04L|BC|ABAP Dictionary data elements|ROLLNAME, AS4LOCAL, AS4VERS
DD01L|BC|ABAP Dictionary domains|DOMNAME, AS4LOCAL, AS4VERS
DD07L|BC|Domain fixed values|DOMNAME, AS4LOCAL, VALPOS, AS4VERS
USR02|BC|User logon data|BNAME
USR21|BC|User to address assignment|BNAME
UST04|BC|User to authorization profile|BNAME, PROFILE
AGR_DEFINE|BC|Role definitions|AGR_NAME
AGR_USERS|BC|Role to user assignments|AGR_NAME, UNAME, FROM_DAT, TO_DAT
AGR_1251|BC|Role authorization data|AGR_NAME, COUNTER
AGR_TCODES|BC|Role to transaction assignment|AGR_NAME, TYPE, TCODE
TBTCO|BC|Background job status overview|JOBNAME, JOBCOUNT
TBTCP|BC|Background job steps|JOBNAME, JOBCOUNT, STEPCOUNT
E070|BC|Transport request headers|TRKORR
E071|BC|Transport request objects|TRKORR, AS4POS
DBTABLOG|BC|Table change log records|LOGDATE, LOGTIME, LOGID
CDHDR|CA|Change document headers|OBJECTCLAS, OBJECTID, CHANGENR
CDPOS|CA|Change document items|OBJECTCLAS, OBJECTID, CHANGENR, TABNAME, TABKEY, FNAME, CHNGIND
NRIV|BC|Number range intervals|OBJECT, SUBOBJECT, NRRANGENR, TOYEAR
VBMOD|BC|Update function modules|VBKEY, VBMODCNT
VBHDR|BC|Update request headers|VBKEY
SWWWIHEAD|CA|Workflow work item headers|WI_ID
STXH|CA|Long text headers|TDOBJECT, TDNAME, TDID, TDSPRAS
SRGBTBREL|CA|Object relationships, including attachments|BRELGUID
SOOD|CA|Office document attributes|OBJTP, OBJYR, OBJNO
JEST|CA|Object status|OBJNR, STAT
JCDS|CA|Status change documents|OBJNR, STAT, CHGNR
ONR00|CA|General object number directory|OBJNR
EDIDC|CA|IDoc control records|DOCNUM
EDID4|CA|IDoc data records|DOCNUM, COUNTER, SEGNUM
EDIDS|CA|IDoc status records|DOCNUM, LOGDAT, LOGTIM, COUNTR
EDP13|CA|Outbound partner profiles|RCVPRN, RCVPRT, RCVPFC, MESTYP
EDP21|CA|Inbound partner profiles|SNDPRN, SNDPRT, SNDPFC, MESTYP
TBD05|CA|ALE distribution model|SNDSYSTEM, RCVSYSTEM, MESTYP
BDCP2|CA|ALE change pointers|MESTYPE, CPIDENT
ARFCSSTATE|BC|Outbound tRFC call status|ARFCIPID, ARFCPID, ARFCTIME, ARFCTIDCNT
BUT000|CA|Business partner general data|PARTNER
BUT020|CA|Business partner addresses|PARTNER, ADDRNUMBER
BUT100|CA|Business partner roles|PARTNER, RLTYP
ADRC|CA|Addresses|ADDRNUMBER, DATE_FROM, NATION
CVI_VEND_LINK|CA|Business partner to vendor link|PARTNER_GUID
CVI_CUST_LINK|CA|Business partner to customer link|PARTNER_GUID
BKPF|FI-GL|Accounting document header|BUKRS, BELNR, GJAHR
BSEG|FI-GL|Accounting document line items|BUKRS, BELNR, GJAHR, BUZEI
BSIS|FI-GL|G/L open item and line item index|BUKRS, HKONT, AUGDT, AUGBL, ZUONR, GJAHR, BELNR, BUZEI
BSAS|FI-GL|G/L cleared item index|BUKRS, HKONT, AUGDT, AUGBL, ZUONR, GJAHR, BELNR, BUZEI
BSET|FI-GL|Tax data per document|BUKRS, BELNR, GJAHR, BUZEI
BSEC|FI-AP|One-time account data per document|BUKRS, BELNR, GJAHR, BUZEI
BSED|FI-AR|Bill of exchange fields per document|BUKRS, BELNR, GJAHR, BUZEI
BSEG_ADD|FI-GL|Entry view for postings to non-leading ledgers only|BUKRS, BELNR, GJAHR, BUZEI
BKPF_ADD|FI-GL|Header data for ledger-specific postings|BUKRS, BELNR, GJAHR
VBKPF|FI-GL|Parked document header|AUSBK, BUKRS, BELNR, GJAHR
VBSEGS|FI-GL|Parked document G/L lines|AUSBK, BELNR, GJAHR, BZKEY
VBSEGK|FI-AP|Parked document vendor lines|AUSBK, BELNR, GJAHR, BZKEY
VBSEGD|FI-AR|Parked document customer lines|AUSBK, BELNR, GJAHR, BZKEY
GLT0|FI-GL|Classic G/L totals|RLDNR, RRCTY, RVERS, BUKRS, RYEAR, RACCT, RBUSA, RTCUR, DRCRK, RPMAX
FAGLFLEXA|FI-GL|New G/L actual line items|RYEAR, DOCNR, RLDNR, RBUKRS, DOCLN
FAGLFLEXT|FI-GL|New G/L totals|RYEAR, RLDNR, RACCT, RBUKRS and dimensions
FAGLFLEXP|FI-GL|New G/L plan line items|RYEAR, DOCNR, RLDNR, RBUKRS, DOCLN
FAGL_SPLINFO|FI-GL|Document splitting information per line|BELNR, BUKRS, GJAHR, BUZEI, SPL_NO
FAGL_SPLINFO_VAL|FI-GL|Document splitting amounts|BELNR, BUKRS, GJAHR, BUZEI, SPL_NO, CURTP
FAGL_TLDGRP|FI-GL|Ledger groups|LDGRP
FAGL_ACTIVEC|FI-GL|New G/L activation flags|single row per client
ACDOCA|FI-GL|Universal Journal line items (S/4HANA)|RLDNR, RBUKRS, GJAHR, BELNR, DOCLN
ACDOCP|FI-GL|Plan line items (S/4HANA)|RLDNR, RBUKRS, GJAHR, plan keys
FINSC_LEDGER|FI-GL|Ledger definitions (S/4HANA)|RLDNR
SKA1|FI-GL|G/L account master, chart of accounts level|KTOPL, SAKNR
SKB1|FI-GL|G/L account master, company code level|BUKRS, SAKNR
SKAT|FI-GL|G/L account texts|SPRAS, KTOPL, SAKNR
T011|FI-GL|Financial statement versions|VERSN
FAGL_011ZC|FI-GL|Financial statement version account assignment|VERSN, ERGSL, VONKT
T012D|FI-BL|House bank DME parameters|BUKRS, HBKID
FEBKO|FI-BL|Electronic bank statement header|ANWND, ABSND, AZIDT, EMKEY
FEBEP|FI-BL|Electronic bank statement line items|KUKEY, ESNUM
BNKA|FI-BL|Bank master|BANKS, BANKL
PAYR|FI-BL|Payment medium register (checks)|ZBUKR, HBKID, HKTID, RZAWE, CHECT
PCEC|FI-BL|Check lots|ZBUKR, HBKID, HKTID, STAPL
LFA1|FI-AP|Vendor master, general|LIFNR
LFB1|FI-AP|Vendor master, company code|LIFNR, BUKRS
LFBK|FI-AP|Vendor bank details|LIFNR, BANKS, BANKL, BANKN
LFM1|MM-PUR|Vendor master, purchasing organization|LIFNR, EKORG
LFBW|FI-AP|Vendor withholding tax types|LIFNR, BUKRS, WITHT
LFC1|FI-AP|Vendor transaction figures|LIFNR, BUKRS, GJAHR
BSIK|FI-AP|Vendor open items|BUKRS, LIFNR, UMSKS, UMSKZ, AUGDT, AUGBL, ZUONR, GJAHR, BELNR, BUZEI
BSAK|FI-AP|Vendor cleared items|BUKRS, LIFNR, UMSKS, UMSKZ, AUGDT, AUGBL, ZUONR, GJAHR, BELNR, BUZEI
REGUH|FI-AP|Payment run settlement data per payment|LAUFD, LAUFI, XVORL, ZBUKR, LIFNR, KUNNR, EMPFG, VBLNR
REGUP|FI-AP|Payment run processed items|LAUFD, LAUFI, XVORL, ZBUKR, LIFNR, KUNNR, EMPFG, VBLNR, BUKRS, BELNR, GJAHR, BUZEI
REGUV|FI-AP|Payment run control records|LAUFD, LAUFI
REGUT|FI-AP|Payment medium files (DME)|ZBUKR, BANKS, LAUFD, LAUFI, XVORL, DTKEY, LFDNR
WITH_ITEM|FI-AP|Withholding tax line items|BUKRS, BELNR, GJAHR, BUZEI, WITHT
KNA1|FI-AR|Customer master, general|KUNNR
KNB1|FI-AR|Customer master, company code|KUNNR, BUKRS
KNVV|SD|Customer master, sales area|KUNNR, VKORG, VTWEG, SPART
KNC1|FI-AR|Customer transaction figures|KUNNR, BUKRS, GJAHR
BSID|FI-AR|Customer open items|BUKRS, KUNNR, UMSKS, UMSKZ, AUGDT, AUGBL, ZUONR, GJAHR, BELNR, BUZEI
BSAD|FI-AR|Customer cleared items|BUKRS, KUNNR, UMSKS, UMSKZ, AUGDT, AUGBL, ZUONR, GJAHR, BELNR, BUZEI
MHNK|FI-AR|Dunning data header|LAUFD, LAUFI, KOART, BUKRS, KUNNR, LIFNR, CPDKY, SKNRZE, SMABER, SMAHSK, BUSAB
MHND|FI-AR|Dunning data items|LAUFD, LAUFI, KOART, BUKRS, KUNNR, LIFNR, BELNR, GJAHR, BUZEI
ANLA|FI-AA|Asset master record|BUKRS, ANLN1, ANLN2
ANLH|FI-AA|Main asset number|BUKRS, ANLN1
ANLZ|FI-AA|Time-dependent asset allocations (cost center, fund, location)|BUKRS, ANLN1, ANLN2, BDATU
ANLB|FI-AA|Depreciation terms per area|BUKRS, ANLN1, ANLN2, AFABE, BDATU
ANLC|FI-AA|Asset value fields per year and area|BUKRS, ANLN1, ANLN2, GJAHR, AFABE
ANLP|FI-AA|Periodic depreciation values|BUKRS, GJAHR, PERAF, AFBNR, ANLN1, ANLN2, AFABER
ANEK|FI-AA|Asset document header|BUKRS, ANLN1, ANLN2, GJAHR, LNRAN
ANEP|FI-AA|Asset line items|BUKRS, ANLN1, ANLN2, GJAHR, LNRAN, AFABE
ANEA|FI-AA|Asset line items for proportional values|BUKRS, ANLN1, ANLN2, GJAHR, LNRAN, AFABE
ANKA|FI-AA|Asset classes|ANLKL
ANKB|FI-AA|Asset class depreciation areas|ANLKL, AFAPL, AFABE, BDATU
T093|FI-AA|Depreciation areas by chart of depreciation|AFAPL, AFABER
T095|FI-AA|Balance sheet accounts for asset account determination|KTOPL, KTOGR, AFABE
TABWA|FI-AA|Asset transaction types|BWASL
FAAT_DOC_IT|FI-AA|Statistical asset line items (S/4HANA)|BUKRS, ANLN1, ANLN2, GJAHR, AWTYP, AWREF, AWORG, AWSYS, SUBTA, AFABE, SLALITTYPE
FAAT_PLAN_VALUES|FI-AA|Planned depreciation values (S/4HANA)|BUKRS, ANLN1, ANLN2, GJAHR, AFABE, POPER
GLPCA|FI-SL|Profit center accounting actual line items|GL_SIRID
GLPCT|FI-SL|Profit center accounting totals|RLDNR, RRCTY, RVERS, RYEAR, RBUKRS, RPRCTR, RACCT
T800A|FI-SL|Special Purpose Ledger tables directory|TAB
JVTO1|FI-SL|Joint venture summary table|RLDNR, RRCTY, RVERS, RYEAR, RBUKRS
FM01|PSM-FM|Financial management areas|FIKRS
FM01D|PSM-FM|FM area detail settings by year, including update profile|FIKRS, GJAHR
FMFINCODE|PSM-FM|Fund master|FIKRS, FINCODE
FMFINT|PSM-FM|Fund texts|SPRAS, FIKRS, FINCODE
FMFUNDTYPE|PSM-FM|Fund types|FM_AREA, FUND_TYPE
FMFCTR|PSM-FM|Funds center master|FIKRS, FICTR, DATBIS
FMFCTRT|PSM-FM|Funds center texts|SPRAS, FIKRS, FICTR, DATBIS
FMHISV|PSM-FM|Funds center hierarchy|FIKRS, HIVARNT, FISTL
FMCI|PSM-FM|Commitment item master|FIKRS, GJAHR, FIPEX
FMCIT|PSM-FM|Commitment item texts|SPRAS, FIKRS, GJAHR, FIPEX
FMFPO|PSM-FM|Commitment items (former structure)|FIKRS, FIPOS, DATBIS
FMFXPO|PSM-FM|Commitment item data by year|FIKRS, FIPOS, GJAHR
FMMEASURE|PSM-FM|Funded program master|CLIENT, FMAREA, MEASURE
FMMEASURET|PSM-FM|Funded program texts|LANGU, FMAREA, MEASURE
FMFUSE|PSM-FM|Application of funds master|APPLFUND
FMBUDGETPD|PSM-FM|Budget period master|BUDGET_PD
FMZUOB|PSM-FM|Assignment of CO objects to FM account assignment|OBJNR, DATBIS
FMIOI|PSM-FM|Commitment line items: requisitions, orders, earmarked funds|REFBN, REFBT, RFORG, RFPOS, RFKNT, RFETE, RCOND, RFTYP, RFSYS, BTART, RLDNR, GJAHR, STUNR
FMIFIIT|PSM-FM|FI line items in FM: invoices, payments, postings|FMBELNR, FIKRS, FMBUZEI, BTART, RLDNR, GJAHR, STUNR
FMIFIHD|PSM-FM|FI document header in FM|FMBELNR, FIKRS
FMICOIT|PSM-FM|CO line items in FM|FMBELNR, FIKRS, FMBUZEI, BTART, RLDNR, GJAHR, STUNR
FMIT|PSM-FM|FM totals for commitments and actuals|RLDNR, RRCTY, RVERS, RYEAR, RFIKRS, RFUND, RFUNDSCTR, RCMMTITEM, RFUNCAREA, RWRTTP and more
FMBH|PSM-FM|BCS budget entry document header|FM_AREA, DOCYEAR, DOCNR
FMBL|PSM-FM|BCS budget entry document lines|FM_AREA, DOCYEAR, DOCNR, DOCLN
FMBDT|PSM-FM|BCS budget totals|RLDNR, RRCTY, RVERS, RYEAR, RFIKRS, budget address
FMBDP|PSM-FM|BCS budget line items (written when line item recording is active)|line item keys
FMAVCT|PSM-FM|Availability control totals|RLDNR, RVERS, RYEAR, RFIKRS, control address
BPJA|PSM-FM|Former budgeting annual totals by object|LEDNR, OBJNR, POSIT, TRGKZ, WRTTP, GJAHR, GEBER, VERSN, VORGA, TWAER
BPGE|PSM-FM|Former budgeting overall totals by object|LEDNR, OBJNR, POSIT, TRGKZ, WRTTP, GEBER, VERSN, VORGA, TWAER
BPDJ|PSM-FM|Former budgeting entry document annual values|BELNR, BUZEI
KBLK|PSM-FM|Earmarked funds document header|BELNR
KBLP|PSM-FM|Earmarked funds document items|BELNR, BLPOS
KBLE|PSM-FM|Earmarked funds consumption history|BELNR, BLPOS, BPENT
KBLEW|PSM-FM|Earmarked funds consumption history amounts by currency|BELNR, BLPOS, BPENT, CURTP
GMGR|PSM-FM|Grant master|GRANT_NBR
GMSPCLASS|PSM-FM|Sponsored classes|SPONSORED_CLASS
FMUSFGT|PSM-FG|US Federal reporting ledger totals (ledger 95)|ledger, year, fund, account, attributes
FMUSFGA|PSM-FG|US Federal reporting ledger line items (ledger 95)|document keys
FMUSFGFACTS1T|PSM-FG|FACTS I ledger totals (ledger 96)|ledger, year, fund, account, attributes
FMUSFGFACTS1A|PSM-FG|FACTS I ledger line items (ledger 96)|document keys
FMUSFGFACTS2T|PSM-FG|FACTS II ledger totals (ledger 97)|ledger, year, fund, account, attributes
FMUSFGFACTS2A|PSM-FG|FACTS II ledger line items (ledger 97)|document keys
FMFGKEY|PSM-FG|Key for FACTS attributes, ledger 95|attribute key
FMFGKEY96|PSM-FG|Key for FACTS attributes, ledger 96|attribute key
FMFGKEY97|PSM-FG|Key for FACTS attributes, ledger 97|attribute key
FMFGBLAREA|PSM-FG|Budgetary ledger areas|BL area
FMFGBLAREADOCTY|PSM-FG|Document type for budgetary ledger postings by area|BL area
FMFG_BUTYPE|PSM-FG|Budgetary ledger attributes of the budget type|budget type
FMFG_BL_YRCL|PSM-FG|Budgetary ledger year-end closing customizing|rule keys
FMFGYECLAA|PSM-FG|Year-end pre-closing of anticipated accounts|rule keys
FMSGLCLASS|PSM-FG|Classification of SGL accounts|account class
FMFONDS|PSM-FG|Cancelled fund to current fund assignment|fund keys
FMUSFG_TS|PSM-FG|Treasury subclasses|subclass code
FMUSFG_TSA|PSM-FG|Assignment of FI document type, account, and fund to Treasury subclass|assignment keys
FMFGT_FSN|PSM-FG|Fiscal station numbers|FSN
FMFGT_ALC_GWA|PSM-FG|Business activity type and reporter category by Agency Location Code|ALC
FMUSFG_GWA_RCVAL|PSM-FG|Reporter category validity|reporter category
FMFGT_IPACED|PSM-FG|IPAC transaction information|IPAC keys
FMFGT_IPAC_FILE|PSM-FG|IPAC outgoing file identifiers|file ID
FMFGT_IPAC_STATS|PSM-FG|IPAC interface process status|process keys
FMFGT_IPAC_ACCT|PSM-FG|Disbursement-in-transit and Fund Balance with Treasury accounts for IPAC|account keys
FM1081_FUND_ROW|PSM-FG|Application of funds detail line for the SF 1081 form|form keys
FMFG_TRADE_ID|PSM-FG|Non-federal trading partner exceptions|partner keys
FMCCRTVENDOR|PSM-FG|Central Contractor Registration vendor data|CCR keys
FMFG_LFACCR|PSM-FG|Vendor master CCR data|LIFNR
FMFG_PPA_INV_HD|PSM-FG|Prompt Payment Act invoice header data and reason codes|invoice keys
FMFG_PPA_INV_LN|PSM-FG|Prompt Payment Act reason codes at line level|invoice keys
FMFGRC|PSM-FG|Reason codes for invoices|reason code
T023R|PSM-FG|Penalty interest rates and validity periods|rate keys
T023B|PSM-FG|Minimum and maximum interest penalty amounts|amount keys
T023Q|PSM-FG|Fast pay and accelerated pay payment terms|ZTERM
T023G|PSM-FG|Activation of US Federal functions by company code|BUKRS
FMFGT_SS04|PSM-FG|Payment statistical sampling batch and certification dates|batch keys
FMROHDR|PSM-FG|Recurring obligation schedule header|schedule key
FMROLINE|PSM-FG|Recurring obligation schedule lines|schedule key, line
FMFG_ABP|PSM-FG|Parameters for automatic budget postings|parameter keys
FMFG_VEKPO|PSM-FG|Pending purchase order line item changes|EBELN, EBELP
FMFG_PRIOR_RPT|PSM-FG|Prior reported information for Treasury reports|report keys
CSKS|CO|Cost center master|KOKRS, KOSTL, DATBI
CSKT|CO|Cost center texts|SPRAS, KOKRS, KOSTL, DATBI
CSKA|CO|Cost elements, chart of accounts level|KTOPL, KSTAR
CSKB|CO|Cost elements, controlling area level|KOKRS, KSTAR, DATBI
CSLA|CO|Activity type master|KOKRS, LSTAR, DATBI
CSSL|CO|Cost center and activity type by year|KOKRS, KOSTL, LSTAR, GJAHR
COST|CO|Activity price totals|LEDNR, OBJNR, GJAHR, WRTTP, VERSN, TARKZ, PERBL
CEPC|CO|Profit center master|PRCTR, DATBI, KOKRS
SETHEADER|CO|Set headers: cost center and cost element groups|SETCLASS, SUBCLASS, SETNAME
SETNODE|CO|Set hierarchy nodes|SETCLASS, SUBCLASS, SETNAME, LINEID
SETLEAF|CO|Set values|SETCLASS, SUBCLASS, SETNAME, LINEID
AUFK|CO|Order master: internal, maintenance, production|AUFNR
COAS|CO|Order master view for internal orders|AUFNR
COBK|CO|CO document header|KOKRS, BELNR
COEP|CO|CO actual line items|KOKRS, BELNR, BUZEI
COEJ|CO|CO plan line items by year|KOKRS, BELNR, BUZEI, PERBL
COSP|CO|CO totals for primary costs|LEDNR, OBJNR, GJAHR, WRTTP, VERSN, KSTAR, HRKFT, VRGNG, VBUND, PARGB, BEKNZ, TWAER, PERBL
COSS|CO|CO totals for secondary costs|LEDNR, OBJNR, GJAHR, WRTTP, VERSN, KSTAR, HRKFT, VRGNG, PAROB, USPOB, BEKNZ, TWAER, PERBL
COOI|CO|CO commitment line items|REFBT, REFBN, RFORG, RFPOS, RFKNT, RFTRM, RFTYP
COBRA|CO|Settlement rule header|OBJNR
COBRB|CO|Settlement rule distribution|OBJNR, BUREG, LFDNR
COKA|CO|Control data for cost elements on objects|OBJNR, GJAHR, KSTAR, HRKFT
COEPL|CO|Activity type actual line items|KOKRS, BELNR, BUZEI
COEPR|CO|Statistical key figure line items|KOKRS, BELNR, BUZEI
T811C|CO|Allocation cycles|TAB, CYCLE, SDATE
T811S|CO|Allocation segments|TAB, CYCLE, SDATE, SEQNR
TKA09|CO|CO versions|KOKRS, VERSN
CATSDB|HCM|Time sheet records|COUNTER
CATSCO|HCM|Time sheet transfer to Controlling|COUNTER, STOKZ
PROJ|PS|Project definition|PSPNR
PRPS|PS|WBS element master|PSPNR
PRHI|PS|WBS hierarchy pointers|POSNR
PRTE|PS|WBS scheduling dates|POSNR
RPSCO|PS|Project information database: costs, revenues, finances|OBJNR, LEDNR, WRTTP, TRGKZ, GJAHR, ACPOS, VORGA, VERSN
AFKO|PP|Order header data for PP and PM orders|AUFNR
AFPO|PP|Order items|AUFNR, POSNR
AFVC|PP|Order operations|AUFPL, APLZL
AFVV|PP|Operation quantities, dates, values|AUFPL, APLZL
AFRU|PP|Order confirmations|RUECK, RMZHL
AFFW|PP|Goods movements with errors from confirmations|WEBLNR, WEBLPOS
EBAN|MM-PUR|Purchase requisition items|BANFN, BNFPO
EBKN|MM-PUR|Purchase requisition account assignment|BANFN, BNFPO, ZEBKN
EKKO|MM-PUR|Purchasing document header: order, contract, agreement, RFQ|EBELN
EKPO|MM-PUR|Purchasing document item|EBELN, EBELP
EKKN|MM-PUR|Purchasing document account assignment|EBELN, EBELP, ZEKKN
EKET|MM-PUR|Delivery schedule lines|EBELN, EBELP, ETENR
EKBE|MM-PUR|Purchasing document history|EBELN, EBELP, ZEKKN, VGABE, GJAHR, BELNR, BUZEI
EKBZ|MM-PUR|Purchasing history for delivery costs|EBELN, EBELP, STUNR, ZAEHK, VGABE, GJAHR, BELNR, BUZEI
EKES|MM-PUR|Vendor confirmations|EBELN, EBELP, ETENS
EKPA|MM-PUR|Partner roles in purchasing|EBELN, EBELP, EKORG, LTSNR, WERKS, PARVW, PARZA
EKAB|MM-PUR|Release documentation for contracts|KONNR, KTPNR, EBELN, EBELP
EKEK|MM-PUR|Scheduling agreement release header|EBELN, EBELP, ABART, ABRUF
EINA|MM-PUR|Purchasing info record, general|INFNR
EINE|MM-PUR|Purchasing info record, purchasing organization|INFNR, EKORG, ESOKZ, WERKS
EORD|MM-PUR|Source list|MATNR, WERKS, ZEORD
EQUK|MM-PUR|Quota arrangement header|QUNUM
T16FS|MM-PUR|Release strategies|FRGGR, FRGSX
T16FC|MM-PUR|Release codes|FRGGR, FRGCO
ESSR|MM-SRV|Service entry sheet header|LBLNI
ESLH|MM-SRV|Service package header|PACKNO
ESLL|MM-SRV|Service package lines|PACKNO, INTROW
ESKN|MM-SRV|Service entry sheet account assignment|PACKNO, ZEKKN
ESUH|MM-SRV|Unplanned service limits header|PACKNO
ASMD|MM-SRV|Service master|ASNUM
RBKP|MM-IV|Logistics invoice document header|BELNR, GJAHR
RSEG|MM-IV|Logistics invoice document item|BELNR, GJAHR, BUZEI
RBCO|MM-IV|Invoice account assignment|BELNR, GJAHR, BUZEI, COBL_NR
RBTX|MM-IV|Invoice tax data|BELNR, GJAHR, BUZEI
RBKP_BLOCKED|MM-IV|Invoices blocked for payment|BELNR, GJAHR
RKWA|MM-IV|Consignment withdrawals|MBLNR, MJAHR, ZEILE
MKPF|MM-IM|Material document header|MBLNR, MJAHR
MSEG|MM-IM|Material document item|MBLNR, MJAHR, ZEILE
MATDOC|MM-IM|Material documents (S/4HANA)|KEY1 to KEY6
MARA|MM-IM|Material master, general|MATNR
MAKT|MM-IM|Material descriptions|MATNR, SPRAS
MARC|MM-IM|Material master, plant|MATNR, WERKS
MARD|MM-IM|Material master, storage location stock|MATNR, WERKS, LGORT
MBEW|MM-IM|Material valuation|MATNR, BWKEY, BWTAR
MBEWH|MM-IM|Material valuation history|MATNR, BWKEY, BWTAR, LFGJA, LFMON
MARM|MM-IM|Units of measure for material|MATNR, MEINH
MVKE|SD|Material master, sales data|MATNR, VKORG, VTWEG
MLAN|MM-IM|Material tax classification|MATNR, ALAND
MCHA|MM-IM|Batches|MATNR, WERKS, CHARG
MCHB|MM-IM|Batch stock|MATNR, WERKS, LGORT, CHARG
MSKA|MM-IM|Sales order stock|MATNR, WERKS, LGORT, CHARG, SOBKZ, VBELN, POSNR
MSPR|MM-IM|Project stock|MATNR, WERKS, LGORT, CHARG, SOBKZ, PSPNR
MKOL|MM-IM|Special stock from vendor|MATNR, WERKS, LGORT, CHARG, SOBKZ, LIFNR
MSLB|MM-IM|Special stock at vendor|MATNR, WERKS, CHARG, SOBKZ, LIFNR
MARDH|MM-IM|Storage location stock history|MATNR, WERKS, LGORT, LFGJA, LFMON
RKPF|MM-IM|Reservation header|RSNUM
RESB|MM-IM|Reservation and dependent requirement items|RSNUM, RSPOS, RSART
IKPF|MM-IM|Physical inventory document header|IBLNR, GJAHR
ISEG|MM-IM|Physical inventory document items|IBLNR, GJAHR, ZEILI
SER01|MM-IM|Serial number document header for deliveries|OBKNR
SER03|MM-IM|Serial number document header for goods movements|OBKNR
OBJK|MM-IM|Serial number object list|OBKNR, OBZAE
CKMLHD|MM-IM|Material ledger header|KALNR
CKMLCR|MM-IM|Material ledger period totals: values|KALNR, BDATJ, POPER, UNTPER, CURTP
CKMLPP|MM-IM|Material ledger period totals: quantities|KALNR, BDATJ, POPER, UNTPER
MLHD|MM-IM|Material ledger document header|BELNR, KJAHR
MLIT|MM-IM|Material ledger document items|BELNR, KJAHR, POSNR
KEKO|CO|Product cost estimate header|BZOBJ, KALNR, KALKA, KADKY, TVERS, BWVAR, KKZMA
KEPH|CO|Product cost estimate cost components|BZOBJ, KALNR, KALKA, KADKY, TVERS, BWVAR, KKZMA, PATNR, KEART, LOSFX, KKZST
VBAK|SD|Sales document header|VBELN
VBAP|SD|Sales document item|VBELN, POSNR
VBEP|SD|Sales document schedule lines|VBELN, POSNR, ETENR
VBKD|SD|Sales document business data|VBELN, POSNR
VBPA|SD|Sales document partners|VBELN, POSNR, PARVW
VBUK|SD|Sales document header status|VBELN
VBUP|SD|Sales document item status|VBELN, POSNR
VBFA|SD|Sales document flow|VBELV, POSNV, VBELN, POSNN, VBTYP_N
VBRK|SD|Billing document header|VBELN
VBRP|SD|Billing document item|VBELN, POSNR
LIKP|LE|Delivery header|VBELN
LIPS|LE|Delivery item|VBELN, POSNR
VTTK|LE|Shipment header|TKNUM
VTTP|LE|Shipment items|TKNUM, TPNUM
KONV|SD|Pricing conditions per document|KNUMV, KPOSN, STUNR, ZAEHK
KONH|SD|Condition record header|KNUMH
KONP|SD|Condition record item|KNUMH, KOPOS
VBKA|SD|Sales activities|VBELN
FPLA|SD|Billing plan header|FPLNR
FPLT|SD|Billing plan dates|FPLNR, FPLTR
AD01DLI|SD|Dynamic items for resource-related billing|DLINR
AD01DLIEF|SD|Dynamic item flow|DLINR, VBELN, VBPOS
LAGP|LE|Warehouse storage bins|LGNUM, LGTYP, LGPLA
LQUA|LE|Warehouse quants|LGNUM, LQNUM
LTAK|LE|Transfer order header|LGNUM, TANUM
LTAP|LE|Transfer order items|LGNUM, TANUM, TAPOS
LTBK|LE|Transfer requirement header|LGNUM, TBNUM
LINK|LE|Warehouse inventory document header|LGNUM, IVNUM
EQUI|PM|Equipment master|EQUNR
EQKT|PM|Equipment short texts|EQUNR, SPRAS
EQUZ|PM|Equipment time segments|EQUNR, DATBI, EQLFN
ILOA|PM|Location and account assignment for PM objects|ILOAN
IFLOT|PM|Functional location master|TPLNR
IFLOTX|PM|Functional location texts|TPLNR, SPRAS
EQST|PM|Equipment to bill of material link|EQUNR, WERKS, STLAN
STKO|PM|Bill of material header|STLTY, STLNR, STLAL, STKOZ
STPO|PM|Bill of material items|STLTY, STLNR, STLKN, STPOZ
MAST|PP|Material to bill of material link|MATNR, WERKS, STLAN, STLNR, STLAL
AFIH|PM|Maintenance order header|AUFNR
QMEL|PM|Notification header|QMNUM
QMIH|PM|Maintenance notification data|QMNUM
QMFE|PM|Notification items (defects)|QMNUM, FENUM
QMUR|PM|Notification causes|QMNUM, FENUM, URNUM
QMMA|PM|Notification activities|QMNUM, MANUM
QMSM|PM|Notification tasks|QMNUM, MANUM
MPLA|PM|Maintenance plan|WARPL
MPOS|PM|Maintenance item|WAPOS
MHIS|PM|Maintenance plan history|WARPL, ABNUM
MHIO|PM|Maintenance plan call object|WARPL, ABNUM, WAPOS
PLKO|PM|Task list header|PLNTY, PLNNR, PLNAL, ZAEHL
PLPO|PM|Task list operations|PLNTY, PLNNR, PLNKN, ZAEHL
IMPTT|PM|Measuring points|POINT
IMRG|PM|Measurement documents|MDOCM
CRHD|PM|Work center header|OBJTY, OBJID
CRCO|PM|Work center to cost center assignment|OBJTY, OBJID, LASET, ENDDA, LANUM
PMCO|PM|Cost structure of maintenance orders|OBJNR, COCUR, BELTP, WRTTP, GJAHR, VERSN, VORGA, ACPOS, BEMOT
MKAL|PP|Production versions|MATNR, WERKS, VERID
PLAF|PP|Planned orders|PLNUM
MDKP|PP|MRP document header|DTART, MATNR, PLWRK, PLSCN
PBIM|PP|Independent requirements for material|MATNR, WERKS, BEDAE, VERSB, PBDNR
QALS|QM|Inspection lots|PRUEFLOS
QAVE|QM|Inspection usage decisions|PRUEFLOS, KZART, ZAEHLER
VIBDBE|RE-FX|Business entities|BUKRS, SWENR
VIBDBU|RE-FX|Buildings|BUKRS, SWENR, SGENR
VIBDPR|RE-FX|Land (property)|BUKRS, SWENR, SGRNR
VIBDRO|RE-FX|Rental objects|BUKRS, SWENR, SMENR
VIBDAO|RE-FX|Architectural objects|AOID
VICNCN|RE-FX|Real estate contracts|BUKRS, RECNNR
VICDCOND|RE-FX|Contract conditions|INTRENO, CONDGUID
VICDCFPAY|RE-FX|Contract cash flow|INTRENO, CFPAYGUID
VIBDMEAS|RE-FX|Measurements for master data objects|INTRENO, MEAS, VALIDFROM
PA0000|HCM|Infotype 0000 personnel actions|PERNR, SUBTY, OBJPS, SPRPS, ENDDA, BEGDA, SEQNR
PA0001|HCM|Infotype 0001 organizational assignment|PERNR, SUBTY, OBJPS, SPRPS, ENDDA, BEGDA, SEQNR
PA0002|HCM|Infotype 0002 personal data|PERNR, SUBTY, OBJPS, SPRPS, ENDDA, BEGDA, SEQNR
PA0105|HCM|Infotype 0105 communication, including user ID|PERNR, SUBTY, OBJPS, SPRPS, ENDDA, BEGDA, SEQNR
HRP1000|HCM|Organizational management objects|PLVAR, OTYPE, OBJID, ISTAT, BEGDA, ENDDA, LANGU, SEQNR
HRP1001|HCM|Organizational management relationships|OTYPE, OBJID, PLVAR, RSIGN, RELAT, ISTAT, PRIOX, BEGDA, ENDDA, VARYF, SEQNR
RSDCUBE|BW|InfoCube directory|INFOCUBE, OBJVERS
ROOSOURCE|BW|DataSource definitions in the source system|OLTPSOURCE, OBJVERS
ODQDATA|BW|Operational delta queue data|queue keys
IUUC_REPL_CONTENT|BW|SLT replication content settings|configuration keys
`;

export const sapTables = raw.trim().split('\n').map((line) => line.split('|'));
export const sapTableColumns = ['Table', 'Area', 'Holds', 'Key fields'];
