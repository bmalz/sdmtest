////////////////////////////////////////////////////////////////////////
// File:      wsp_schema.sch
// Publish Date: 12.11.2013 19:29
// Publish User: orlen\PODKOWAK
// Description:
//   CA SD schema modifications maintained by Web Screen Painter.
////////////////////////////////////////////////////////////////////////

#include "../schema.mac"
#include "../bop.mac"

TABLE Act_Log {
  zfirma	INTEGER;// Widoczny dla firmy zewnętrznej
  zresolution_code	INTEGER REF usp_resolution_code;
}

TABLE Attached_SLA {
  zforfz	INTEGER;// dla F-Z
}

TABLE Act_Type {
  ztask_flag	INTEGER REF Boolean_Table;
  ztask_notify_info	STRING 30 REF Spell_Macro;
}

TABLE Change_Request {
  zAdditionalInfo	STRING 400;
  zJustificationForUrgency	STRING 400;
  zRFCFinancialBenefits	INTEGER REF zRFCFinancialBenefits;
  zRFCImactOnSecurity	INTEGER REF zRFCImactOnSecurity;
  zRFCImprovingTheImage	INTEGER REF zRFCImprovingTheImage;// SRel_Attr_Entry chg.zRFCImprovingTheImage
  zRFCNeedForLaw	INTEGER REF zRFCNeedForLaw;
  zRFCTargetTime	LOCAL_TIME;
  zVendor	UUID REF ca_contact;
  zanalistStar	LOCAL_TIME;
  zapproval_flag	INTEGER REF Active_Boolean_Table;
  zcategory	INTEGER REF zchgcategory;
  zchcategory	INTEGER;
  zchgcat	STRING 30 REF Prob_Category;// SRel_Attr_Entry chg.zchgcat
  zchgclass	INTEGER REF zchgclass;
  zchgcode	INTEGER REF zchgcode;
  zchgimpact	INTEGER REF zchgimp;
  zchgresource	INTEGER REF zchgresource;
  zchgtype	INTEGER REF zchgcategory;
  zchgurgency	INTEGER REF zchgurl;
  zinitmanager	UUID REF ca_contact;
}

TABLE Change_Category {
  zChangeClass	INTEGER REF zchgclass;
  zSubstantiveAdministrator	UUID REF ca_contact;
  zType	INTEGER REF zchgclstype;
  zusluga	UUID REF ca_owned_resource;
}

TABLE ci_twa_ci {
  ztyp_lokalizacji	STRING 255;
}

TABLE Note_Board {
  zBottom	INTEGER REF Active_Boolean_Table;
  zHelpDeskType	INTEGER REF zHelpDeskType;
}

TABLE usp_contact {
  zArea	INTEGER REF zArea;
  zHelpDeskType	INTEGER REF zHelpDeskType;
  zNRE	STRING 10;
  zaccept_by_sms	INTEGER;
  zaccept_by_sms_terms	INTEGER;
  zakceptujacy	INTEGER;
  zcompany_root	STRING 255;
  zflat_rate_internet	STRING 255;
  zmanager2	UUID REF ca_contact;
  zmiddle_name_alt	STRING 255;
  zprevious_nre	STRING 255;
  zsubstitution_additionalinfo	STRING 4000;// dodatkowe informacje
  zsubstitution_enddate	LOCAL_TIME;// data obowiazywania zastepstwa
  zsubstitution_person	UUID REF ca_contact;// osoba zastepujaca
  zuserAccountControl	INTEGER;// do usunięcia!
  zwyl	INTEGER;
}

TABLE ca_resource_cost_center {
  zcnt	UUID REF ca_contact;
  zkod	STRING 10;
  zorg	UUID REF ca_organization;
  zparent_cost_cntr	INTEGER REF ca_resource_cost_center;
}

TABLE Call_Req {
  zActionNumbers	INTEGER;
  zAdditionalInfo	STRING 400;
  zJustificationForUrgency	STRING 400;
  zRFCFinancialBenefits	INTEGER REF zRFCFinancialBenefits;
  zRFCImactOnSecurity	INTEGER REF zRFCImactOnSecurity;
  zRFCImprovingTheImage	INTEGER REF zRFCImprovingTheImage;
  zRFCNeedForLaw	INTEGER REF zRFCNeedForLaw;// SRel_Attr_Entry cr.zRFCNeedForLaw
  zRFCTargetTime	LOCAL_TIME;
  zRaportowany	INTEGER REF Active_Boolean_Table;
  zacctype1	INTEGER REF zacctypes;
  zacctype2	INTEGER REF zacctypes;
  zacctype3	INTEGER REF zacctypes;
  zacctype4	INTEGER REF zacctypes;
  zapproval_flag	INTEGER REF Active_Boolean_Table;
  zcallid	STRING 100;
  zcntref1rules	INTEGER REF zas;
  zcntref2rules	INTEGER REF zas;
  zcntref3rules	INTEGER REF zas;
  zcntref4rules	INTEGER REF zas;
  zcorIN	INTEGER REF zCorrespondenceIncome;
  zcorOUT	INTEGER REF zCorrespondanceOucome;
  zcustomer	STRING 256;
  zfz	UUID REF ca_organization;// Firma zewnętrzna
  zfzsdsc	STRING 30 REF Service_Desc;// SRel_Attr_Entry cr.zfzsdsc
  zfzsla	INTEGER REF zSLA;// Firma zewnętrzna - Umowa SLA
  zfzstatus	STRING 12 REF Task_Status;// Status dla firmy zewnętrznej
  zfztermin_realizacji	LOCAL_TIME;
  zgroup1	UUID REF ca_contact;
  zgroup1rules	INTEGER REF zas;
  zgroup2	UUID REF ca_contact;
  zgroup2rules	INTEGER REF zas;
  zgroup3	UUID REF ca_contact;
  zgroup3rules	INTEGER REF zas;
  zgroup4	UUID REF ca_contact;
  zgroup4rules	INTEGER REF zas;
  zinitmanager	UUID REF ca_contact;
  zisRecurrenceReservation	INTEGER;
  zisRoomReservation	INTEGER;
  zkatering	INTEGER REF zrodzaj_kateringu;
  zloc	UUID REF ca_location;
  zlvl	STRING 1;
  zmanager1	UUID REF ca_contact;
  zmanager2	UUID REF ca_contact;// SRel_Attr_Entry cr.zmanager2
  zmanager3	UUID REF ca_contact;
  zmanager4	UUID REF ca_contact;
  zmpk	INTEGER REF ca_resource_cost_center;
  zphone_number	STRING 20;
  zprzyczyna	INTEGER REF zprzyczyna;
  zreport	INTEGER;
  zrozwiazanie	STRING 4000;
  zsdsc	STRING 30 REF Service_Desc;// SRel_Attr_Entry cr.zsdsc
  zsla	INTEGER REF zSLA;// SRel_Attr_Entry cr.zsla
  ztermin_realizacji	LOCAL_TIME;
  zuwagifz	STRING 4000;// Uwagi do firmy zewnętrznej
}

TABLE Req_Property {
  zdlugoscpola	INTEGER;
  zegar	INTEGER;
  zhtml	INTEGER;
  zkalendarz	INTEGER;
  zliczba	INTEGER;
  zobjekt	STRING 255;
  zobjektwartosc	STRING 255;
  zodnosnik	INTEGER;
  zodnosniktyp	STRING 255;
  zpoletekstowe	INTEGER;
  zsekcja	INTEGER;
}

TABLE Req_Property_Template {
  zdlugoscpola	INTEGER;
  zegar	INTEGER;
  zhtml	INTEGER;
  zkalendarz	INTEGER;
  zliczba	INTEGER;
  zobjekt	STRING 255;
  zobjektwartosc	STRING 255;
  zodnosnik	INTEGER;
  zodnosniktyp	STRING 255;
  zpoletekstowe	INTEGER;
  zsekcja	INTEGER;
}

TABLE Cr_Status {
  zss_sym	STRING 60;
}

TABLE entservx {
  zAdjustedServiceCost	INTEGER;
  zBusinessServiceKind	INTEGER REF zBusinessServiceKind;// SRel_Attr_Entry entservx.zBusinessServiceKind
  zBusinessServiceType	INTEGER REF zBusinessServiceType;
  zCurrencyType	INTEGER REF zCurrencyType;
  zFinansialService	INTEGER REF Active_Boolean_Table;
  zPlannedServiceCost	INTEGER;
  zServiceOwner	UUID REF ca_contact;
  zServicePackage	INTEGER REF Active_Boolean_Table;
  zSettlementPeriod	INTEGER REF zSettlementPeriod;
  zSeverity	INTEGER REF Severity;
  zmethodOfSettlement	INTEGER REF zMethodOfSettlement;
}

TABLE Events {
  zpriority	INTEGER REF Priority;
}

TABLE ca_location {
  zisGasStation	INTEGER;
  znazwa_integratora	STRING 255;
  zregion	STRING 255;
}

TABLE usp_owned_resource {
  zMPK	INTEGER REF ca_resource_cost_center;
  zadministrator_group	UUID REF ca_contact;
  zdescription_long	STRING 4000;
  zdostawca	UUID REF ca_company;
  zidentification_number	STRING 255;
  zliquidation_protocol_nr	STRING 255;
  zlokalizacja	UUID REF ca_owned_resource;
  zmodel	STRING 255;
  znoticeperiod	STRING 60;
  znr_inwentarzowy	STRING 20;// numer inwentarzowy z SAP
  znumer_ot	STRING 255;
  zproducent	UUID REF ca_company;
  zsap_inne	STRING 4000;// inne informacje z SAP
  zvalue_net	REAL;
  zvalue_net_string	STRING 10;
  zvalue_start	REAL;
  zvalue_start_string	STRING 10;
  zvice_billing_contact_uuid	UUID REF ca_contact;
  zvice_support_contact1_uuid	UUID REF ca_contact;
}

TABLE usp_organization {
  zfz	INTEGER;
  zgroup	UUID REF ca_contact;
  zid	STRING 8;
  zmpk	INTEGER REF ca_resource_cost_center;
  zparent_org	UUID REF ca_organization;
}

TABLE Prob_Category {
  zacctype1	INTEGER REF zacctypes;
  zacctype2	INTEGER REF zacctypes;
  zacctype3	INTEGER REF zacctypes;
  zacctype4	INTEGER REF zacctypes;
  zchgCatRel	STRING 12 REF Change_Category;
  zchg_flag	INTEGER;
  zcntref1rules	INTEGER REF zas;
  zcntref2rules	INTEGER REF zas;
  zcntref3rules	INTEGER REF zas;
  zcntrefrules	INTEGER REF zas;
  zdesc	STRING 1;// Do usunięcia
  zfzsdsc	STRING 30 REF Service_Desc;// Poziom obsługi dla F-Z
  zgroup1	UUID REF ca_contact;
  zgroup1rules	INTEGER REF zas;
  zgroup2	UUID REF ca_contact;
  zgroup2rules	INTEGER REF zas;
  zgroup3	UUID REF ca_contact;
  zgroup3rules	INTEGER REF zas;
  zgroup4	UUID REF ca_contact;
  zgroup4rules	INTEGER REF zas;
  zgrouprules	STRING 1;
  zguidesc	STRING 500;
  zimage	STRING 255;
  zimpact	INTEGER REF Impact;
  zmanager1	UUID REF ca_contact;
  zmanager2	UUID REF ca_contact;
  zmanager3	UUID REF ca_contact;
  zmanager4	UUID REF ca_contact;
  zsc_url	STRING 255;
  zsort	INTEGER;
  zusluga	UUID REF ca_owned_resource;
}

TABLE Rootcause {
  zTyp	STRING 60;
}

TABLE usp_resolution_code {
  zTyp	STRING 60;
  zcrs	STRING 12 REF Cr_Status;
  zidrozwiazania	STRING 10;
  zidtabeli	STRING 10;
}

TABLE Service_Desc {
  zsla	INTEGER REF zSLA;
}

TABLE Service_Contract {
  zfz	UUID REF ca_organization;// F-Z
  znoticePeriod	STRING 60;
  zscopeCallCenter	STRING 600;
  zscopeCallCenterBool	INTEGER;
  zscopeExternalSupport	STRING 600;
  zscopeExternalSupportBool	INTEGER;
  zscopeITDepartment	STRING 600;
  zscopeITDepartmentBool	INTEGER;
  zusluga	UUID REF ca_owned_resource;// SRel_Attr_Entry svc_contract.zusluga
  zuslugaTechniczna	UUID REF ca_owned_resource;
}

TABLE Task_Type {
  zparent_type	STRING 3;
}

TABLE ca_company {
  zusluga	STRING 0 REF entservx;
}

TABLE zArea {
  id	INTEGER UNIQUE KEY;
  last_mod_dt	 LOCAL_TIME;
  last_mod_by	 UUID REF ca_contact;
  delete_flag	INTEGER REF Active_Boolean_Table;
  description	STRING 400;
  sym	STRING 60;
}

p1 zArea -> CURR_PROV zArea;

TABLE zBusinessServiceKind {
  id	INTEGER UNIQUE KEY;
  last_mod_dt	 LOCAL_TIME;
  last_mod_by	 UUID REF ca_contact;
  delete_flag	INTEGER REF Active_Boolean_Table;
  sym	STRING 60;
}

p1 zBusinessServiceKind -> CURR_PROV zBusinessServiceKind;

TABLE zBusinessServiceType {
  id	INTEGER UNIQUE KEY;
  last_mod_dt	 LOCAL_TIME;
  last_mod_by	 UUID REF ca_contact;
  delete_flag	INTEGER REF Active_Boolean_Table;
  sym	STRING 60;
}

p1 zBusinessServiceType -> CURR_PROV zBusinessServiceType;

TABLE zContractors {
  id	INTEGER UNIQUE KEY;
  last_mod_dt	 LOCAL_TIME;
  last_mod_by	 UUID REF ca_contact;
  Building	STRING 10;
  City	STRING 255;
  Country	STRING 255;
  CountryRef	INTEGER REF ca_country;// SRel_Attr_Entry zContractors.CountryRef
  PostCode	STRING 255;
  Room	STRING 10;
  Street	STRING 255;
  delete_flag	INTEGER REF Active_Boolean_Table;
  sym	STRING 255 S_KEY;
}

p1 zContractors -> CURR_PROV zContractors;

TABLE zCorrespondanceOucome {
  id	INTEGER UNIQUE KEY;
  last_mod_dt	 LOCAL_TIME;
  last_mod_by	 UUID REF ca_contact;
  AbbreviationCmpny	INTEGER REF zhrcmpny;
  Abroad	INTEGER;
  Building	STRING 10;
  City	STRING 255;
  CorrespondanceLetterType	INTEGER REF zCorrespondenceLetterType;
  Country	STRING 255;
  CountryRef	INTEGER REF ca_country;
  Department	STRING 255;
  Description	STRING 500;
  FeedbackConfirmation	INTEGER;
  LetterNumber	STRING 255;
  Name	STRING 255;
  Note	STRING 500;
  OutcomeDate	LOCAL_TIME;
  PostCode	STRING 255;
  Recipient	INTEGER REF zContractors;// SRel_Attr_Entry zCorrespondanceOucome.Recipient
  Room	STRING 10;
  SenderEmployee	UUID REF ca_contact;
  SenderOrganization	UUID REF ca_organization;
  Street	STRING 255;
  Surname	STRING 255;
  cr	STRING 30 REF Call_Req;// SRel_Attr_Entry zCorrespondanceOucome.cr
  delete_flag	INTEGER REF Active_Boolean_Table;// SRel_Attr_Entry zCorrespondanceOucome.delete_flag
  ref_num	STRING 30 S_KEY;
  sym	STRING 255;
}

p1 zCorrespondanceOucome -> CURR_PROV zCorrespondanceOucome;

TABLE zCorrespondence {
  id	INTEGER UNIQUE KEY;
  last_mod_dt	 LOCAL_TIME;
  last_mod_by	 UUID REF ca_contact;
  CorrespondenceLetter	INTEGER REF zCorrespondenceLetterType;
  Description	STRING 500;
  INIncomeDate	LOCAL_TIME;
  INRecipientEmployee	UUID REF ca_contact;
  INRecipientOrganization	UUID REF ca_organization;
  INSender	INTEGER REF zContractors;
  INSenderCity	STRING 255;
  INSenderCountry	STRING 255;
  INSenderPostCode	STRING 255;
  INSenderStreet	STRING 255;
  LetterNumber	STRING 255;
  Note	STRING 500;
  OUTOutcomeDate	INTEGER;
  OUTRecipient	INTEGER REF zContractors;
  OUTRecipientCity	STRING 255;
  OUTRecipientCountry	STRING 255;
  OUTRecipientPostCode	STRING 255;
  OUTRecipientStreet	STRING 255;
  OUTSenderEmployee	UUID REF ca_contact;
  OUTSenderOrganization	UUID REF ca_organization;
  Type	INTEGER REF zCorrespondenceType;
  sym	STRING 255;
}

p1 zCorrespondence -> CURR_PROV zCorrespondence;

TABLE zCorrespondenceIncome {
  id	INTEGER UNIQUE KEY;
  last_mod_dt	 LOCAL_TIME;
  last_mod_by	 UUID REF ca_contact;
  AbbreviationCmpny	INTEGER REF zhrcmpny;
  Abroad	INTEGER;
  Building	STRING 10;
  City	STRING 255;
  CorrespondanceLetterType	INTEGER REF zCorrespondenceLetterType;
  Country	STRING 255;
  CountryRef	INTEGER REF ca_country;
  Department	STRING 255;
  Description	STRING 500;
  FeedbackConfirmation	INTEGER;
  IncomeDate	LOCAL_TIME;
  LetterNumber	STRING 255;
  Name	STRING 255;
  Note	STRING 500;
  PostCode	STRING 255;
  RecipientEmployee	UUID REF ca_contact;
  RecipientOrganization	UUID REF ca_organization;
  Room	STRING 10;
  Sender	INTEGER REF zContractors;// SRel_Attr_Entry zCorrespondenceIncome.Sender
  Street	STRING 255;
  Surname	STRING 255;
  cr	STRING 30 REF Call_Req;// SRel_Attr_Entry zCorrespondenceIncome.cr
  delete_flag	INTEGER REF Active_Boolean_Table;
  ref_num	STRING 30 S_KEY;
  sym	STRING 255;
}

p1 zCorrespondenceIncome -> CURR_PROV zCorrespondenceIncome;

TABLE zCorrespondenceLetterType {
  id	INTEGER UNIQUE KEY;
  last_mod_dt	 LOCAL_TIME;
  last_mod_by	 UUID REF ca_contact;
  delete_flag	INTEGER REF Active_Boolean_Table;
  sym	STRING 255 S_KEY;
}

p1 zCorrespondenceLetterType -> CURR_PROV zCorrespondenceLetterType;

TABLE zCorrespondenceType {
  id	INTEGER UNIQUE KEY;
  last_mod_dt	 LOCAL_TIME;
  last_mod_by	 UUID REF ca_contact;
  sym	STRING 255 S_KEY;
}

p1 zCorrespondenceType -> CURR_PROV zCorrespondenceType;

TABLE zCurrencyType {
  id	INTEGER UNIQUE KEY;
  last_mod_dt	 LOCAL_TIME;
  last_mod_by	 UUID REF ca_contact;
  delete_flag	INTEGER REF Active_Boolean_Table;// SRel_Attr_Entry zCurrencyType.delete_flag
  sym	STRING 60;
}

p1 zCurrencyType -> CURR_PROV zCurrencyType;

TABLE zHelpDeskType {
  id	INTEGER UNIQUE KEY;
  last_mod_dt	 LOCAL_TIME;
  last_mod_by	 UUID REF ca_contact;
  delete_flag	INTEGER REF Active_Boolean_Table;// SRel_Attr_Entry zHelpDeskType.delete_flag
  description	STRING 400;
  sym	STRING 60;
}

p1 zHelpDeskType -> CURR_PROV zHelpDeskType;

TABLE zMethodOfSettlement {
  id	INTEGER UNIQUE KEY;
  last_mod_dt	 LOCAL_TIME;
  last_mod_by	 UUID REF ca_contact;
  delete_flag	INTEGER REF Active_Boolean_Table;
  sym	STRING 60;
}

p1 zMethodOfSettlement -> CURR_PROV zMethodOfSettlement;

TABLE zRFCFinancialBenefits {
  id	INTEGER UNIQUE KEY;
  last_mod_dt	 LOCAL_TIME;
  last_mod_by	 UUID REF ca_contact;
  delete_flag	INTEGER REF Active_Boolean_Table;
  sym	STRING 60;
}

p1 zRFCFinancialBenefits -> CURR_PROV zRFCFinancialBenefits;

TABLE zRFCImactOnSecurity {
  id	INTEGER UNIQUE KEY;
  last_mod_dt	 LOCAL_TIME;
  last_mod_by	 UUID REF ca_contact;
  delete_flag	INTEGER REF Active_Boolean_Table;
  sym	STRING 60;
}

p1 zRFCImactOnSecurity -> CURR_PROV zRFCImactOnSecurity;

TABLE zRFCImprovingTheImage {
  id	INTEGER UNIQUE KEY;
  last_mod_dt	 LOCAL_TIME;
  last_mod_by	 UUID REF ca_contact;
  delete_flag	INTEGER REF Active_Boolean_Table;
  sym	STRING 60;
}

p1 zRFCImprovingTheImage -> CURR_PROV zRFCImprovingTheImage;

TABLE zRFCNeedForLaw {
  id	INTEGER UNIQUE KEY;
  last_mod_dt	 LOCAL_TIME;
  last_mod_by	 UUID REF ca_contact;
  delete_flag	INTEGER REF Active_Boolean_Table;
  sym	STRING 60;
}

p1 zRFCNeedForLaw -> CURR_PROV zRFCNeedForLaw;

TABLE zSLA {
  id	INTEGER UNIQUE KEY;
  last_mod_dt	 LOCAL_TIME;
  last_mod_by	 UUID REF ca_contact;
  tenant	 UUID REF ca_tenant;
  delete_flag	INTEGER REF Active_Boolean_Table;
  forfz	INTEGER;// Dla F-Z
  fz	UUID REF ca_organization;
  sym	STRING 80 S_KEY;
  usluga	INTEGER REF Service_Contract;
}

p1 zSLA -> CURR_PROV zSLA;

TABLE zServiceClassDictionary {
  id	INTEGER UNIQUE KEY;
  last_mod_dt	 LOCAL_TIME;
  last_mod_by	 UUID REF ca_contact;
  Decription	STRING 600;
  delete_flag	INTEGER REF Active_Boolean_Table;
  sym	STRING 60;
}

p1 zServiceClassDictionary -> CURR_PROV zServiceClassDictionary;

TABLE zServiceTypeDictionary {
  id	INTEGER UNIQUE KEY;
  last_mod_dt	 LOCAL_TIME;
  last_mod_by	 UUID REF ca_contact;
  Description	STRING 600;
  delete_flag	INTEGER REF Active_Boolean_Table;
  sym	STRING 60;
}

p1 zServiceTypeDictionary -> CURR_PROV zServiceTypeDictionary;

TABLE zSettlementPeriod {
  id	INTEGER UNIQUE KEY;
  last_mod_dt	 LOCAL_TIME;
  last_mod_by	 UUID REF ca_contact;
  delete_flag	INTEGER REF Active_Boolean_Table;
  sym	STRING 60;
}

p1 zSettlementPeriod -> CURR_PROV zSettlementPeriod;

TABLE zacctypes {
  id	INTEGER UNIQUE KEY;
  last_mod_dt	 LOCAL_TIME;
  last_mod_by	 UUID REF ca_contact;
  sym	STRING 255;
}

p1 zacctypes -> CURR_PROV zacctypes;

TABLE zadm_br_we_wy {
  id    UUID UNIQUE NOT_NULL KEY REF ca_owned_resource;
  del   INTEGER;
  version_number    INTEGER;
  creation_date     LOCAL_TIME;
  creation_user     STRING 64;
  last_update_date  LOCAL_TIME;
  last_update_user  STRING 64;
  name	STRING 255;
}

p1 zadm_br_we_wy -> CURR_PROV zadm_br_we_wy {
  id -> own_resource_uuid;
}

TABLE zadm_dep {
  id    UUID UNIQUE NOT_NULL KEY REF ca_owned_resource;
  del   INTEGER;
  version_number    INTEGER;
  creation_date     LOCAL_TIME;
  creation_user     STRING 64;
  last_update_date  LOCAL_TIME;
  last_update_user  STRING 64;
  ex_name	STRING 255;
}

p1 zadm_dep -> CURR_PROV zadm_dep {
  id -> own_resource_uuid;
}

TABLE zadm_lok {
  id    UUID UNIQUE NOT_NULL KEY REF ca_owned_resource;
  del   INTEGER;
  version_number    INTEGER;
  creation_date     LOCAL_TIME;
  creation_user     STRING 64;
  last_update_date  LOCAL_TIME;
  last_update_user  STRING 64;
  catering_email_address	STRING 255;
  catering_email_content	STRING 4000;
  dzialka	STRING 255;
  ex_name	STRING 255;
  obszar	UUID REF ca_owned_resource;
  rodzic	UUID REF ca_owned_resource;// SRel_Attr_Entry zadm_lok.rodzic
  typ_lokalizacji	INTEGER REF ztyp_lokalizacji;// SRel_Attr_Entry zadm_lok.typ_lokalizacji
}

p1 zadm_lok -> CURR_PROV zadm_lok {
  id -> own_resource_uuid;
}

TABLE zadm_sa_ko {
  id    UUID UNIQUE NOT_NULL KEY REF ca_owned_resource;
  del   INTEGER;
  version_number    INTEGER;
  creation_date     LOCAL_TIME;
  creation_user     STRING 64;
  last_update_date  LOCAL_TIME;
  last_update_user  STRING 64;
  dodatkowe_miejsca	INTEGER;
  ekran	INTEGER;
  ex_name	STRING 255;
  flipchart	INTEGER;
  monitor	INTEGER;
  naglosnienie	INTEGER;
  pojemnosc_konferencyjna	INTEGER;
  pojemnosc_teatralna	INTEGER;
  projektor	INTEGER;
  projektor_przenosny	INTEGER;
  tablica_suchoscieralna	INTEGER;
  telekonferencja	INTEGER;
  videokonferencja	INTEGER;
  wifi	INTEGER;
}

p1 zadm_sa_ko -> CURR_PROV zadm_sa_ko {
  id -> own_resource_uuid;
}

TABLE zas {
  id	INTEGER UNIQUE KEY;
  last_mod_dt	 LOCAL_TIME;
  last_mod_by	 UUID REF ca_contact;
  sym	STRING 255;
}

p1 zas -> CURR_PROV zas;

TABLE zchgcategory {
  id	INTEGER UNIQUE KEY;
  last_mod_dt	 LOCAL_TIME;
  last_mod_by	 UUID REF ca_contact;
  delete_flag	INTEGER REF Active_Boolean_Table;
  sym	STRING 60;
}

p1 zchgcategory -> CURR_PROV zchgcategory;

TABLE zchgclass {
  id	INTEGER UNIQUE KEY;
  last_mod_dt	 LOCAL_TIME;
  last_mod_by	 UUID REF ca_contact;
  delete_flag	INTEGER REF Active_Boolean_Table;
  sym	STRING 60;
}

p1 zchgclass -> CURR_PROV zchgclass;

TABLE zchgclstype {
  id	INTEGER UNIQUE KEY;
  last_mod_dt	 LOCAL_TIME;
  last_mod_by	 UUID REF ca_contact;
  chgclstype	STRING 255;
  del	INTEGER REF Active_Boolean_Table;// SRel_Attr_Entry chgtype.delete_flag
  description	STRING 60;
  sym	STRING 60;
}

p1 zchgclstype -> CURR_PROV zchgclstype;

TABLE zchgcode {
  id	INTEGER UNIQUE KEY;
  last_mod_dt	 LOCAL_TIME;
  last_mod_by	 UUID REF ca_contact;
  del	INTEGER REF Active_Boolean_Table;// SRel_Attr_Entry chgtype.delete_flag
  description	STRING 100;
  Symbol	STRING 60;
}

p1 zchgcode -> CURR_PROV zchgcode;

TABLE zchgimp {
  id	INTEGER UNIQUE KEY;
  last_mod_dt	 LOCAL_TIME;
  last_mod_by	 UUID REF ca_contact;
  del	INTEGER REF Active_Boolean_Table;// SRel_Attr_Entry chgtype.delete_flag
  description	STRING 100;
  sym	STRING 60;
}

p1 zchgimp -> CURR_PROV zchgimp;

TABLE zchgresource {
  id	INTEGER UNIQUE KEY;
  last_mod_dt	 LOCAL_TIME;
  last_mod_by	 UUID REF ca_contact;
  del	INTEGER REF Active_Boolean_Table;
  description	STRING 1000;
  sym	STRING 60;
}

p1 zchgresource -> CURR_PROV zchgresource;

TABLE zchgurl {
  id	INTEGER UNIQUE KEY;
  last_mod_dt	 LOCAL_TIME;
  last_mod_by	 UUID REF ca_contact;
  delete_flag	INTEGER REF Active_Boolean_Table;// SRel_Attr_Entry chgtype.delete_flag
  description	STRING 1000;
  sym	STRING 60;
}

p1 zchgurl -> CURR_PROV zchgurl;

TABLE zfav_pcat {
  id	INTEGER UNIQUE KEY;
  last_mod_dt	 LOCAL_TIME;
  last_mod_by	 UUID REF ca_contact;
  cnt	UUID REF ca_contact;
  delete_flag	INTEGER REF Active_Boolean_Table;
  pcat	STRING 30 REF Prob_Category;
  status	INTEGER REF Active_Boolean_Table;// do usuniecia!
}

p1 zfav_pcat -> CURR_PROV zfav_pcat;

TABLE zhrcmpny {
  id	INTEGER UNIQUE KEY;
  last_mod_dt	 LOCAL_TIME;
  last_mod_by	 UUID REF ca_contact;
  abbreviation	STRING 255;
  delete_flag	INTEGER REF Active_Boolean_Table;
  sym	STRING 255;
}

p1 zhrcmpny -> CURR_PROV zhrcmpny;

TABLE zinf_se_fi {
  id    UUID UNIQUE NOT_NULL KEY REF ca_owned_resource;
  del   INTEGER;
  version_number    INTEGER;
  creation_date     LOCAL_TIME;
  creation_user     STRING 64;
  last_update_date  LOCAL_TIME;
  last_update_user  STRING 64;
  adres_ip	STRING 15;
  adres_ip2	STRING 15;
  adres_ip3	STRING 15;
  cache_procesora	STRING 20;
  cd_dvd	INTEGER;
  data_ostatniego_uruchomienia	STRING 20;
  ex_name	STRING 255;
  hosting	INTEGER;
  ht_active	INTEGER;
  ilosc_kart_fc	INTEGER;
  ilosc_kart_sieciowych	INTEGER;
  ilosc_procesorow	INTEGER;
  ilosc_ram	INTEGER;// w MB
  ilosc_rdzeni_cpu	INTEGER;
  ilosc_slotow_pamieci	INTEGER;
  ilosc_uzytych_slotow_pamieci	INTEGER;
  lokalizacja_logiczna	INTEGER REF zlista_lokalizacji_logicznych;
  predkosc_procesora	STRING 20;
  rozmiar_hdd	INTEGER;// w GB
  rozmiar_hdd_string	STRING 255;
  tryb_monitorowania	INTEGER REF ztryb_monitorowania;
  typ	INTEGER REF ztyp_serwera;
  typ_procesora	INTEGER REF ztyp_procesora;
  wersja	STRING 255;
  wersja_bios	STRING 255;
  wersja_esx	STRING 255;
}

p1 zinf_se_fi -> CURR_PROV zinf_se_fi {
  id -> own_resource_uuid;
}

TABLE zinf_se_wi {
  id    UUID UNIQUE NOT_NULL KEY REF ca_owned_resource;
  del   INTEGER;
  version_number    INTEGER;
  creation_date     LOCAL_TIME;
  creation_user     STRING 64;
  last_update_date  LOCAL_TIME;
  last_update_user  STRING 64;
  adres_ip	STRING 15;
  adres_ip2	STRING 15;
  adres_ip3	STRING 15;
  ex_name	STRING 255;
  hdd10_datastore	INTEGER REF zlista_datastore;
  hdd10_rozmiar	STRING 50;
  hdd1_datastore	INTEGER REF zlista_datastore;
  hdd1_rozmiar	STRING 50;
  hdd2_datastore	INTEGER REF zlista_datastore;
  hdd2_rozmiar	STRING 50;
  hdd3_datastore	INTEGER REF zlista_datastore;
  hdd3_rozmiar	STRING 50;
  hdd4_datastore	INTEGER REF zlista_datastore;
  hdd4_rozmiar	STRING 50;
  hdd5_datastore	INTEGER REF zlista_datastore;
  hdd5_rozmiar	STRING 50;
  hdd6_datastore	INTEGER REF zlista_datastore;
  hdd6_rozmiar	STRING 50;
  hdd7_datastore	INTEGER REF zlista_datastore;
  hdd7_rozmiar	STRING 50;
  hdd8_datastore	INTEGER REF zlista_datastore;
  hdd8_rozmiar	STRING 50;
  hdd9_datastore	INTEGER REF zlista_datastore;
  hdd9_rozmiar	STRING 50;
  hosting	INTEGER;
  ilosc_cpu	INTEGER;
  ilosc_ram	INTEGER;// w MB
  lokalizacja_logiczna	INTEGER REF zlista_lokalizacji_logicznych;
  nazwa_datacenter	STRING 255;
  nazwa_klastra_wirt	STRING 255;
  nazwa_vswitcha	STRING 255;
  sciezka_vmx	STRING 4000;
  stan	STRING 3;
  system_operacyjny	INTEGER REF zlista_os;
  tryb_monitorowania	INTEGER REF ztryb_monitorowania;
  wersja_hardware	STRING 20;
  zaalokowowana_przestrzen	STRING 255;
}

p1 zinf_se_wi -> CURR_PROV zinf_se_wi {
  id -> own_resource_uuid;
}

TABLE zinf_ur_si {
  id    UUID UNIQUE NOT_NULL KEY REF ca_owned_resource;
  del   INTEGER;
  version_number    INTEGER;
  creation_date     LOCAL_TIME;
  creation_user     STRING 64;
  last_update_date  LOCAL_TIME;
  last_update_user  STRING 64;
  ex_name	STRING 255;
  first_time_seen	STRING 20;
  poll_status	STRING 255;
  polled_ip_address	STRING 15;
  typ	INTEGER REF ztyp_urzadzenia_siec;
  version	STRING 20;
}

p1 zinf_ur_si -> CURR_PROV zinf_ur_si {
  id -> own_resource_uuid;
}

TABLE zinteg_AD_OUs {
  id	INTEGER UNIQUE KEY;
  last_mod_dt	 LOCAL_TIME;
  last_mod_by	 UUID REF ca_contact;
  delete_flag	INTEGER REF Active_Boolean_Table;
  name	STRING 400 S_KEY;
}

p1 zinteg_AD_OUs -> CURR_PROV zinteg_AD_OUs;

TABLE zipfon_settype {
  id	INTEGER UNIQUE KEY;
  last_mod_dt	 LOCAL_TIME;
  last_mod_by	 UUID REF ca_contact;
  ex_name	STRING 255;
}

p1 zipfon_settype -> CURR_PROV zipfon_settype;

TABLE zlista_datastore {
  id	INTEGER UNIQUE KEY;
  last_mod_dt	 LOCAL_TIME;
  last_mod_by	 UUID REF ca_contact;
  nazwa	STRING 300;
  pojemnosc	STRING 50;
  sciezka	STRING 4000;
  wolne_miejsce	STRING 50;
}

p1 zlista_datastore -> CURR_PROV zlista_datastore;

TABLE zlista_lokalizacji_logicznych {
  id	INTEGER UNIQUE KEY;
  last_mod_dt	 LOCAL_TIME;
  last_mod_by	 UUID REF ca_contact;
  ex_name	STRING 255;
}

p1 zlista_lokalizacji_logicznych -> CURR_PROV zlista_lokalizacji_logicznych;

TABLE zlista_os {
  id	INTEGER UNIQUE KEY;
  last_mod_dt	 LOCAL_TIME;
  last_mod_by	 UUID REF ca_contact;
  ex_name	STRING 255;
}

p1 zlista_os -> CURR_PROV zlista_os;

TABLE zlrel_attachment_nrs {
  id	INTEGER UNIQUE KEY;
  last_mod_dt	 LOCAL_TIME;
  last_mod_by	 UUID REF ca_contact;
  attmnt	INTEGER REF Attachment;
  nr	UUID REF ca_owned_resource;
}

p1 zlrel_attachment_nrs -> CURR_PROV zlrel_attachment_nrs;

TABLE zlrel_cnt_loc {
  id	INTEGER UNIQUE KEY;
  last_mod_dt	 LOCAL_TIME;
  last_mod_by	 UUID REF ca_contact;
  cnt	UUID REF ca_contact;
  loc	UUID REF ca_location;
}

p1 zlrel_cnt_loc -> CURR_PROV zlrel_cnt_loc;

TABLE zlrel_cr_cnt {
  id	INTEGER UNIQUE KEY;
  last_mod_dt	 LOCAL_TIME;
  last_mod_by	 UUID REF ca_contact;
  cnt	UUID REF ca_contact;
  cr	STRING 30 REF Call_Req;
}

p1 zlrel_cr_cnt -> CURR_PROV zlrel_cr_cnt;

TABLE zlrel_cr_cnt1 {
  id	INTEGER UNIQUE KEY;
  last_mod_dt	 LOCAL_TIME;
  last_mod_by	 UUID REF ca_contact;
  cnt	UUID REF ca_contact;
  cr	STRING 30 REF Call_Req;
}

p1 zlrel_cr_cnt1 -> CURR_PROV zlrel_cr_cnt1;

TABLE zlrel_cr_cnt2 {
  id	INTEGER UNIQUE KEY;
  last_mod_dt	 LOCAL_TIME;
  last_mod_by	 UUID REF ca_contact;
  cnt	UUID REF ca_contact;
  cr	STRING 30 REF Call_Req;
}

p1 zlrel_cr_cnt2 -> CURR_PROV zlrel_cr_cnt2;

TABLE zlrel_cr_cnt3 {
  id	INTEGER UNIQUE KEY;
  last_mod_dt	 LOCAL_TIME;
  last_mod_by	 UUID REF ca_contact;
  cnt	UUID REF ca_contact;
  cr	STRING 30 REF Call_Req;
}

p1 zlrel_cr_cnt3 -> CURR_PROV zlrel_cr_cnt3;

TABLE zlrel_cr_correspondence_in {
  id	INTEGER UNIQUE KEY;
  last_mod_dt	 LOCAL_TIME;
  last_mod_by	 UUID REF ca_contact;
  correspondence_in	INTEGER REF zCorrespondenceIncome;
  cr	STRING 30 REF Call_Req;
}

p1 zlrel_cr_correspondence_in -> CURR_PROV zlrel_cr_correspondence_in;

TABLE zlrel_cr_correspondence_ou {
  id	INTEGER UNIQUE KEY;
  last_mod_dt	 LOCAL_TIME;
  last_mod_by	 UUID REF ca_contact;
  correspondence_out	INTEGER REF zCorrespondanceOucome;
  cr	STRING 30 REF Call_Req;
}

p1 zlrel_cr_correspondence_ou -> CURR_PROV zlrel_cr_correspondence_ou;

TABLE zlrel_org_kontr {
  id	INTEGER UNIQUE KEY;
  last_mod_dt	 LOCAL_TIME;
  last_mod_by	 UUID REF ca_contact;
  kontr	INTEGER REF Service_Contract;
  org	UUID REF ca_organization;
}

p1 zlrel_org_kontr -> CURR_PROV zlrel_org_kontr;

TABLE zlrel_pcat_cnt {
  id	INTEGER UNIQUE KEY;
  last_mod_dt	 LOCAL_TIME;
  last_mod_by	 UUID REF ca_contact;
  cnt	UUID REF ca_contact;
  lvl	STRING 1;
  pcat	STRING 30 REF Prob_Category;
}

p1 zlrel_pcat_cnt -> CURR_PROV zlrel_pcat_cnt;

TABLE zlrel_pcat_cnt1 {
  id	INTEGER UNIQUE KEY;
  last_mod_dt	 LOCAL_TIME;
  last_mod_by	 UUID REF ca_contact;
  cnt	UUID REF ca_contact;
  pcat	STRING 30 REF Prob_Category;
}

p1 zlrel_pcat_cnt1 -> CURR_PROV zlrel_pcat_cnt1;

TABLE zlrel_pcat_cnt2 {
  id	INTEGER UNIQUE KEY;
  last_mod_dt	 LOCAL_TIME;
  last_mod_by	 UUID REF ca_contact;
  cnt	UUID REF ca_contact;
  pcat	STRING 30 REF Prob_Category;
}

p1 zlrel_pcat_cnt2 -> CURR_PROV zlrel_pcat_cnt2;

TABLE zlrel_pcat_cnt3 {
  id	INTEGER UNIQUE KEY;
  last_mod_dt	 LOCAL_TIME;
  last_mod_by	 UUID REF ca_contact;
  cnt	UUID REF ca_contact;
  pcat	STRING 30 REF Prob_Category;
}

p1 zlrel_pcat_cnt3 -> CURR_PROV zlrel_pcat_cnt3;

TABLE zlrel_zsla_site {
  id	INTEGER UNIQUE KEY;
  last_mod_dt	 LOCAL_TIME;
  last_mod_by	 UUID REF ca_contact;
  site	INTEGER REF ca_site;
  zsla	INTEGER REF zSLA;
}

p1 zlrel_zsla_site -> CURR_PROV zlrel_zsla_site;

TABLE znr_user {
  id	INTEGER UNIQUE KEY;
  last_mod_dt	 LOCAL_TIME;
  last_mod_by	 UUID REF ca_contact;
  class	STRING 100;
  cnt	UUID REF ca_contact;// SRel_Attr_Entry znr_user.cnt
  delete_flag	INTEGER REF Active_Boolean_Table;// SRel_Attr_Entry znr_user.delete_flag
  nr	UUID REF ca_owned_resource;
  resource_name	STRING 100;
}

p1 znr_user -> CURR_PROV znr_user;

TABLE zpop_pcat {
  id	INTEGER UNIQUE KEY;
  last_mod_dt	 LOCAL_TIME;
  last_mod_by	 UUID REF ca_contact;
  delete_flag	INTEGER REF Active_Boolean_Table;
  org	UUID REF ca_organization;
  pcat	STRING 30 REF Prob_Category;
}

p1 zpop_pcat -> CURR_PROV zpop_pcat;

TABLE zprzyczyna {
  id	INTEGER UNIQUE KEY;
  last_mod_dt	 LOCAL_TIME;
  last_mod_by	 UUID REF ca_contact;
  idprzyczyny	STRING 10;
  idtabeli	STRING 10;
  sym	STRING 255;
}

p1 zprzyczyna -> CURR_PROV zprzyczyna;

TABLE zrodzaj_drukarki {
  id	INTEGER UNIQUE KEY;
  last_mod_dt	 LOCAL_TIME;
  last_mod_by	 UUID REF ca_contact;
  ex_name	STRING 255;
}

p1 zrodzaj_drukarki -> CURR_PROV zrodzaj_drukarki;

TABLE zrodzaj_kateringu {
  id	INTEGER UNIQUE KEY;
  last_mod_dt	 LOCAL_TIME;
  last_mod_by	 UUID REF ca_contact;
  ex_name	STRING 500;
}

p1 zrodzaj_kateringu -> CURR_PROV zrodzaj_kateringu;

TABLE zrodzaj_monitora {
  id	INTEGER UNIQUE KEY;
  last_mod_dt	 LOCAL_TIME;
  last_mod_by	 UUID REF ca_contact;
  ex_name	STRING 50;
}

p1 zrodzaj_monitora -> CURR_PROV zrodzaj_monitora;

TABLE zrodzaj_wydruku {
  id	INTEGER UNIQUE KEY;
  last_mod_dt	 LOCAL_TIME;
  last_mod_by	 UUID REF ca_contact;
  ex_name	STRING 255;
}

p1 zrodzaj_wydruku -> CURR_PROV zrodzaj_wydruku;

TABLE zrozmiar_monitora {
  id	INTEGER UNIQUE KEY;
  last_mod_dt	 LOCAL_TIME;
  last_mod_by	 UUID REF ca_contact;
  ex_name	STRING 255;
  monitor_size	REAL;
}

p1 zrozmiar_monitora -> CURR_PROV zrozmiar_monitora;

TABLE zst_pa_cz_kk {
  id    UUID UNIQUE NOT_NULL KEY REF ca_owned_resource;
  del   INTEGER;
  version_number    INTEGER;
  creation_date     LOCAL_TIME;
  creation_user     STRING 64;
  last_update_date  LOCAL_TIME;
  last_update_user  STRING 64;
  ex_name	STRING 255;
}

p1 zst_pa_cz_kk -> CURR_PROV zst_pa_cz_kk {
  id -> own_resource_uuid;
}

TABLE zst_pa_dr_fa {
  id    UUID UNIQUE NOT_NULL KEY REF ca_owned_resource;
  del   INTEGER;
  version_number    INTEGER;
  creation_date     LOCAL_TIME;
  creation_user     STRING 64;
  last_update_date  LOCAL_TIME;
  last_update_user  STRING 64;
  ex_name	STRING 255;
}

p1 zst_pa_dr_fa -> CURR_PROV zst_pa_dr_fa {
  id -> own_resource_uuid;
}

TABLE zst_pa_dr_fi {
  id    UUID UNIQUE NOT_NULL KEY REF ca_owned_resource;
  del   INTEGER;
  version_number    INTEGER;
  creation_date     LOCAL_TIME;
  creation_user     STRING 64;
  last_update_date  LOCAL_TIME;
  last_update_user  STRING 64;
  czas_ostatniego_raportu	STRING 255;
  drukarka_rezerwowa	INTEGER;
  ex_name	STRING 255;
  ilosc_raportow	STRING 255;
  komunikacja	INTEGER;
  miejscowosc	STRING 255;
  typ	STRING 255;
  ulica	STRING 255;
}

p1 zst_pa_dr_fi -> CURR_PROV zst_pa_dr_fi {
  id -> own_resource_uuid;
}

TABLE zst_pa_dr_mf {
  id    UUID UNIQUE NOT_NULL KEY REF ca_owned_resource;
  del   INTEGER;
  version_number    INTEGER;
  creation_date     LOCAL_TIME;
  creation_user     STRING 64;
  last_update_date  LOCAL_TIME;
  last_update_user  STRING 64;
  adres_ip	STRING 255;
  ex_name	STRING 255;
  ilosc_tonera	STRING 255;
}

p1 zst_pa_dr_mf -> CURR_PROV zst_pa_dr_mf {
  id -> own_resource_uuid;
}

TABLE zst_pa_dys {
  id    UUID UNIQUE NOT_NULL KEY REF ca_owned_resource;
  del   INTEGER;
  version_number    INTEGER;
  creation_date     LOCAL_TIME;
  creation_user     STRING 64;
  last_update_date  LOCAL_TIME;
  last_update_user  STRING 64;
  ex_name	STRING 255;
}

p1 zst_pa_dys -> CURR_PROV zst_pa_dys {
  id -> own_resource_uuid;
}

TABLE zst_pa_ko_bos {
  id    UUID UNIQUE NOT_NULL KEY REF ca_owned_resource;
  del   INTEGER;
  version_number    INTEGER;
  creation_date     LOCAL_TIME;
  creation_user     STRING 64;
  last_update_date  LOCAL_TIME;
  last_update_user  STRING 64;
  adres_ip	STRING 15;
  adres_ip2	STRING 15;
  adres_ip3	STRING 15;
  cd_dvd	INTEGER;
  ex_name	STRING 255;
  ilosc_procesorow	INTEGER;
  ilosc_ram	INTEGER;// w MB
  karta_sieciowa	INTEGER;
  monitor_nazwa	STRING 255;
  monitor_rozmiar	STRING 30;
  procesor	INTEGER REF ztyp_procesora;
  rozmiar_hdd	INTEGER;// w GB
  typ	INTEGER REF ztyp_komputera;
  zegar_cpu	STRING 20;
}

p1 zst_pa_ko_bos -> CURR_PROV zst_pa_ko_bos {
  id -> own_resource_uuid;
}

TABLE zst_pa_ko_da {
  id    UUID UNIQUE NOT_NULL KEY REF ca_owned_resource;
  del   INTEGER;
  version_number    INTEGER;
  creation_date     LOCAL_TIME;
  creation_user     STRING 64;
  last_update_date  LOCAL_TIME;
  last_update_user  STRING 64;
  ex_name	STRING 255;
  nr_kolektora	STRING 255;
  typ_kolektora	STRING 255;
  wersja_aplikacji	STRING 255;
}

p1 zst_pa_ko_da -> CURR_PROV zst_pa_ko_da {
  id -> own_resource_uuid;
}

TABLE zst_pa_ko_pos {
  id    UUID UNIQUE NOT_NULL KEY REF ca_owned_resource;
  del   INTEGER;
  version_number    INTEGER;
  creation_date     LOCAL_TIME;
  creation_user     STRING 64;
  last_update_date  LOCAL_TIME;
  last_update_user  STRING 64;
  adres_ip	STRING 15;
  adres_ip2	STRING 15;
  adres_ip3	STRING 15;
  cd_dvd	INTEGER;
  ex_name	STRING 255;
  ilosc_procesorow	INTEGER;
  ilosc_ram	INTEGER;// w MB
  karta_sieciowa	INTEGER;
  monitor_nazwa	STRING 255;
  monitor_rozmiar	STRING 30;
  procesor	INTEGER REF ztyp_procesora;
  rozmiar_hdd	INTEGER;// w GB
  typ	INTEGER REF ztyp_komputera;
  zegar_cpu	STRING 20;
}

p1 zst_pa_ko_pos -> CURR_PROV zst_pa_ko_pos {
  id -> own_resource_uuid;
}

TABLE zst_pa_pin {
  id    UUID UNIQUE NOT_NULL KEY REF ca_owned_resource;
  del   INTEGER;
  version_number    INTEGER;
  creation_date     LOCAL_TIME;
  creation_user     STRING 64;
  last_update_date  LOCAL_TIME;
  last_update_user  STRING 64;
  ex_name	STRING 255;
  status	STRING 255;
  wersja	STRING 255;
}

p1 zst_pa_pin -> CURR_PROV zst_pa_pin {
  id -> own_resource_uuid;
}

TABLE zst_pa_se_sp {
  id    UUID UNIQUE NOT_NULL KEY REF ca_owned_resource;
  del   INTEGER;
  version_number    INTEGER;
  creation_date     LOCAL_TIME;
  creation_user     STRING 64;
  last_update_date  LOCAL_TIME;
  last_update_user  STRING 64;
  adres_ip	STRING 15;
  adres_ip2	STRING 15;
  adres_ip3	STRING 15;
  cd_dvd	INTEGER;
  ex_name	STRING 255;
  ilosc_procesorow	INTEGER;
  ilosc_ram	INTEGER;// w MB
  karta_sieciowa	INTEGER;
  monitor_nazwa	STRING 255;
  monitor_rozmiar	STRING 30;
  procesor	INTEGER REF ztyp_procesora;
  rozmiar_hdd	INTEGER;// w GB
  typ	INTEGER REF ztyp_komputera;
  zegar_cpu	STRING 20;
}

p1 zst_pa_se_sp -> CURR_PROV zst_pa_se_sp {
  id -> own_resource_uuid;
}

TABLE zst_pa_st_dy {
  id    UUID UNIQUE NOT_NULL KEY REF ca_owned_resource;
  del   INTEGER;
  version_number    INTEGER;
  creation_date     LOCAL_TIME;
  creation_user     STRING 64;
  last_update_date  LOCAL_TIME;
  last_update_user  STRING 64;
  ex_name	STRING 255;
}

p1 zst_pa_st_dy -> CURR_PROV zst_pa_st_dy {
  id -> own_resource_uuid;
}

TABLE zst_pa_st_so {
  id    UUID UNIQUE NOT_NULL KEY REF ca_owned_resource;
  del   INTEGER;
  version_number    INTEGER;
  creation_date     LOCAL_TIME;
  creation_user     STRING 64;
  last_update_date  LOCAL_TIME;
  last_update_user  STRING 64;
  ex_name	STRING 255;
}

p1 zst_pa_st_so -> CURR_PROV zst_pa_st_so {
  id -> own_resource_uuid;
}

TABLE zst_pa_szu {
  id    UUID UNIQUE NOT_NULL KEY REF ca_owned_resource;
  del   INTEGER;
  version_number    INTEGER;
  creation_date     LOCAL_TIME;
  creation_user     STRING 64;
  last_update_date  LOCAL_TIME;
  last_update_user  STRING 64;
  ex_name	STRING 255;
}

p1 zst_pa_szu -> CURR_PROV zst_pa_szu {
  id -> own_resource_uuid;
}

TABLE zst_pa_te_ka_pl {
  id    UUID UNIQUE NOT_NULL KEY REF ca_owned_resource;
  del   INTEGER;
  version_number    INTEGER;
  creation_date     LOCAL_TIME;
  creation_user     STRING 64;
  last_update_date  LOCAL_TIME;
  last_update_user  STRING 64;
  ex_name	STRING 255;
  maska_modulu	STRING 255;// jakie uslugi sa uruchomione
  merchaddr1	STRING 255;
  merchaddr2	STRING 255;
  merchname	STRING 255;
  pos_id	STRING 255;// tid 2
  rodzaj_terminala	STRING 255;// tid
  wersja_terminala	STRING 255;
}

p1 zst_pa_te_ka_pl -> CURR_PROV zst_pa_te_ka_pl {
  id -> own_resource_uuid;
}

TABLE zst_pa_ups {
  id    UUID UNIQUE NOT_NULL KEY REF ca_owned_resource;
  del   INTEGER;
  version_number    INTEGER;
  creation_date     LOCAL_TIME;
  creation_user     STRING 64;
  last_update_date  LOCAL_TIME;
  last_update_user  STRING 64;
  czas_baterii	STRING 255;
  ex_name	STRING 255;
  naladowanie	STRING 255;
  napiecie_wejsciowe	STRING 255;
  obciazenie	STRING 255;
  status	STRING 255;
  wymiana_baterii	STRING 255;
}

p1 zst_pa_ups -> CURR_PROV zst_pa_ups {
  id -> own_resource_uuid;
}

TABLE zst_pa_we_ce {
  id    UUID UNIQUE NOT_NULL KEY REF ca_owned_resource;
  del   INTEGER;
  version_number    INTEGER;
  creation_date     LOCAL_TIME;
  creation_user     STRING 64;
  last_update_date  LOCAL_TIME;
  last_update_user  STRING 64;
  ex_name	STRING 255;
}

p1 zst_pa_we_ce -> CURR_PROV zst_pa_we_ce {
  id -> own_resource_uuid;
}

TABLE zst_ro_dru {
  id    UUID UNIQUE NOT_NULL KEY REF ca_owned_resource;
  del   INTEGER;
  version_number    INTEGER;
  creation_date     LOCAL_TIME;
  creation_user     STRING 64;
  last_update_date  LOCAL_TIME;
  last_update_user  STRING 64;
  adres_ip	STRING 15;
  ex_name	STRING 255;
  lan	INTEGER;
  lpt	INTEGER;
  management_url	STRING 1000;
  rodzaj_drukarki	INTEGER REF zrodzaj_drukarki;
  rodzaj_wydruku	INTEGER REF zrodzaj_wydruku;
  usb	INTEGER;
}

p1 zst_ro_dru -> CURR_PROV zst_ro_dru {
  id -> own_resource_uuid;
}

TABLE zst_ro_kom {
  id    UUID UNIQUE NOT_NULL KEY REF ca_owned_resource;
  del   INTEGER;
  version_number    INTEGER;
  creation_date     LOCAL_TIME;
  creation_user     STRING 64;
  last_update_date  LOCAL_TIME;
  last_update_user  STRING 64;
  adres_ip	STRING 15;
  adres_ip2	STRING 15;
  adres_ip3	STRING 15;
  cd_dvd	INTEGER;
  ex_name	STRING 255;
  ilosc_procesorow	INTEGER;// od 1 do 16
  ilosc_ram	INTEGER;// w MB
  karta_sieciowa	INTEGER;
  monitor_nazwa	STRING 255;
  monitor_rozmiar	STRING 30;
  procesor	INTEGER REF ztyp_procesora;
  rozmiar_hdd	INTEGER;// w BG
  rozmiar_hdd_string	STRING 255;
  typ	INTEGER REF ztyp_komputera;
  zegar_cpu	STRING 20;
}

p1 zst_ro_kom -> CURR_PROV zst_ro_kom {
  id -> own_resource_uuid;
}

TABLE zst_ro_mon {
  id    UUID UNIQUE NOT_NULL KEY REF ca_owned_resource;
  del   INTEGER;
  version_number    INTEGER;
  creation_date     LOCAL_TIME;
  creation_user     STRING 64;
  last_update_date  LOCAL_TIME;
  last_update_user  STRING 64;
  dvi	INTEGER;
  ex_name	STRING 255;
  hdmi	INTEGER;
  rodzaj	INTEGER REF zrodzaj_monitora;
  rozmiar	INTEGER REF zrozmiar_monitora;
  usb	INTEGER;
  vga	INTEGER;
}

p1 zst_ro_mon -> CURR_PROV zst_ro_mon {
  id -> own_resource_uuid;
}

TABLE zst_ro_ska {
  id    UUID UNIQUE NOT_NULL KEY REF ca_owned_resource;
  del   INTEGER;
  version_number    INTEGER;
  creation_date     LOCAL_TIME;
  creation_user     STRING 64;
  last_update_date  LOCAL_TIME;
  last_update_user  STRING 64;
  ex_name	STRING 255;
  lpt	INTEGER;
  typ	INTEGER REF ztyp_skanera;
  usb	INTEGER;
}

p1 zst_ro_ska -> CURR_PROV zst_ro_ska {
  id -> own_resource_uuid;
}

TABLE zst_ro_ur_wi {
  id    UUID UNIQUE NOT_NULL KEY REF ca_owned_resource;
  del   INTEGER;
  version_number    INTEGER;
  creation_date     LOCAL_TIME;
  creation_user     STRING 64;
  last_update_date  LOCAL_TIME;
  last_update_user  STRING 64;
  adres_ip	STRING 15;
  ex_name	STRING 255;
  faks	INTEGER;
  ksero	INTEGER;
  lan	INTEGER;
  lpt	INTEGER;
  management_url	STRING 1000;
  rodzaj_drukarki	INTEGER REF zrodzaj_drukarki;
  rodzaj_wydruku	INTEGER REF zrodzaj_wydruku;
  skaner	INTEGER;
  usb	INTEGER;
}

p1 zst_ro_ur_wi -> CURR_PROV zst_ro_ur_wi {
  id -> own_resource_uuid;
}

TABLE ztask {
  id	INTEGER UNIQUE KEY;
  last_mod_dt	 LOCAL_TIME;
  last_mod_by	 UUID REF ca_contact;
  actual_duration	DURATION;
  asset	UUID REF ca_owned_resource;
  assignee	UUID REF ca_contact;
  assignee_agt	UUID REF ca_contact;
  audit_userid	UUID REF ca_contact;
  chg	INTEGER REF Change_Request;
  closecode	INTEGER REF ztaskclosecode;
  comments	STRING 1000;
  completion_date	LOCAL_TIME;
  cost	INTEGER;
  cr	STRING 30 REF Call_Req;
  creator	UUID REF ca_contact;
  date_created	LOCAL_TIME;
  del	INTEGER REF Active_Boolean_Table;
  deliveredServices	STRING 1000;
  description	STRING 1000;
  done_by	UUID REF ca_contact;
  est_completion_date	LOCAL_TIME;
  est_cost	INTEGER;
  est_duration	DURATION;
  expertise	INTEGER;
  group_task	INTEGER;
  installedSoftware	STRING 1000;
  laborCost	INTEGER;
  pamtask	INTEGER;
  parentPERSID	STRING 30;
  partsCost	STRING 50;
  rate	INTEGER;
  sdgroup	UUID REF ca_contact;
  sequence	INTEGER;
  spenttime	STRING 50;
  start_date	LOCAL_TIME;
  status	STRING 12 REF Task_Status;// SRel_Attr_Entry ztask.status
  task	STRING 12 REF Task_Type;
  taskType	INTEGER;// nie używać
  taskType2	INTEGER REF ztasktype;
  usedParts	STRING 1000;
}

p1 ztask -> CURR_PROV ztask;

TABLE ztaskclosecode {
  id	INTEGER UNIQUE KEY;
  last_mod_dt	 LOCAL_TIME;
  last_mod_by	 UUID REF ca_contact;
  del	INTEGER REF Active_Boolean_Table;
  sym	STRING 100;
}

p1 ztaskclosecode -> CURR_PROV ztaskclosecode;

TABLE ztasktype {
  id	INTEGER UNIQUE KEY;
  last_mod_dt	 LOCAL_TIME;
  last_mod_by	 UUID REF ca_contact;
  del	INTEGER REF Active_Boolean_Table;// SRel_Attr_Entry ztasktype.del
  sym	STRING 60;
  task	STRING 12 REF Task_Type;// SRel_Attr_Entry ztasktype.task
}

p1 ztasktype -> CURR_PROV ztasktype;

TABLE ztel_bla {
  id    UUID UNIQUE NOT_NULL KEY REF ca_owned_resource;
  del   INTEGER;
  version_number    INTEGER;
  creation_date     LOCAL_TIME;
  creation_user     STRING 64;
  last_update_date  LOCAL_TIME;
  last_update_user  STRING 64;
  ex_name	STRING 255;
  link_opis	STRING 1000;
  model	STRING 255;
  obraz	STRING 255;
}

p1 ztel_bla -> CURR_PROV ztel_bla {
  id -> own_resource_uuid;
}

TABLE ztel_te_ip {
  id    UUID UNIQUE NOT_NULL KEY REF ca_owned_resource;
  del   INTEGER;
  version_number    INTEGER;
  creation_date     LOCAL_TIME;
  creation_user     STRING 64;
  last_update_date  LOCAL_TIME;
  last_update_user  STRING 64;
  directory_first_name	STRING 255;
  ex_name	STRING 255;
  phonebook_first_name	STRING 255;
  phonebook_name	STRING 255;
  set_type	INTEGER REF zipfon_settype;// SRel_Attr_Entry ztel_te_ip.set_type
}

p1 ztel_te_ip -> CURR_PROV ztel_te_ip {
  id -> own_resource_uuid;
}

TABLE ztel_te_ko {
  id    UUID UNIQUE NOT_NULL KEY REF ca_owned_resource;
  del   INTEGER;
  version_number    INTEGER;
  creation_date     LOCAL_TIME;
  creation_user     STRING 64;
  last_update_date  LOCAL_TIME;
  last_update_user  STRING 64;
  ex_name	STRING 255;
  link_opis	STRING 1000;
  model	STRING 255;
  obraz	STRING 255;
}

p1 ztel_te_ko -> CURR_PROV ztel_te_ko {
  id -> own_resource_uuid;
}

TABLE ztryb_monitorowania {
  id	INTEGER UNIQUE KEY;
  last_mod_dt	 LOCAL_TIME;
  last_mod_by	 UUID REF ca_contact;
  ex_name	STRING 255;
}

p1 ztryb_monitorowania -> CURR_PROV ztryb_monitorowania;

TABLE ztyp_komputera {
  id	INTEGER UNIQUE KEY;
  last_mod_dt	 LOCAL_TIME;
  last_mod_by	 UUID REF ca_contact;
  ex_name	STRING 255;
}

p1 ztyp_komputera -> CURR_PROV ztyp_komputera;

TABLE ztyp_lokalizacji {
  id	INTEGER UNIQUE KEY;
  last_mod_dt	 LOCAL_TIME;
  last_mod_by	 UUID REF ca_contact;
  ex_name	STRING 255;
}

p1 ztyp_lokalizacji -> CURR_PROV ztyp_lokalizacji;

TABLE ztyp_procesora {
  id	INTEGER UNIQUE KEY;
  last_mod_dt	 LOCAL_TIME;
  last_mod_by	 UUID REF ca_contact;
  ex_name	STRING 255;
}

p1 ztyp_procesora -> CURR_PROV ztyp_procesora;

TABLE ztyp_serwera {
  id	INTEGER UNIQUE KEY;
  last_mod_dt	 LOCAL_TIME;
  last_mod_by	 UUID REF ca_contact;
  ex_name	STRING 255;
}

p1 ztyp_serwera -> CURR_PROV ztyp_serwera;

TABLE ztyp_skanera {
  id	INTEGER UNIQUE KEY;
  last_mod_dt	 LOCAL_TIME;
  last_mod_by	 UUID REF ca_contact;
  ex_name	STRING 255;
}

p1 ztyp_skanera -> CURR_PROV ztyp_skanera;

TABLE ztyp_urzadzenia_siec {
  id	INTEGER UNIQUE KEY;
  last_mod_dt	 LOCAL_TIME;
  last_mod_by	 UUID REF ca_contact;
  ex_name	STRING 255;
}

p1 ztyp_urzadzenia_siec -> CURR_PROV ztyp_urzadzenia_siec;
