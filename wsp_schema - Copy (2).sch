////////////////////////////////////////////////////////////////////////
// File:      wsp_schema.sch
// Publish Date: 16/09/2013 12:41
// Publish User: ServiceDesk
// Description:
//   CA SD schema modifications maintained by Web Screen Painter.
////////////////////////////////////////////////////////////////////////

#include "../schema.mac"
#include "../bop.mac"

TABLE Act_Log {
  zfirma	INTEGER;// Widoczny dla firmy zewnętrznej
  zresolution_code	INTEGER REF usp_resolution_code;
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
  zcategory	INTEGER REF zchgcategory;
  zchcategory	INTEGER;
  zchgcat	STRING 30 REF Prob_Category;// SRel_Attr_Entry chg.zchgcat
  zchgclass	INTEGER REF zchgclass;
  zchgcode	INTEGER REF zchgcode;
  zchgimpact	INTEGER REF zchgimp;
  zchgresource	INTEGER REF zchgresource;
  zchgurgency	INTEGER REF zchgurl;
}

TABLE Change_Category {
  zChangeClass	INTEGER REF zchgclass;
  zSubstantiveAdministrator	UUID REF ca_contact;
  zType	INTEGER REF zchgclstype;
}

TABLE ci_twa_ci {
  ztyp_lokalizacji	STRING 255;
}

TABLE usp_contact {
  zArea	INTEGER REF zArea;
  zHelpDeskType	INTEGER REF zHelpDeskType;
  zNRE	STRING 10;
  zaccept_by_sms	INTEGER;
  zaccept_by_sms_terms	INTEGER;
  zakceptujacy	INTEGER;
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
  zAdditionalInfo	STRING 400;
  zJustificationForUrgency	STRING 400;
  zRFCFinancialBenefits	INTEGER REF zRFCFinancialBenefits;
  zRFCImactOnSecurity	INTEGER REF zRFCImactOnSecurity;
  zRFCImprovingTheImage	INTEGER REF zRFCImprovingTheImage;
  zRFCNeedForLaw	INTEGER REF zRFCNeedForLaw;
  zRFCTargetTime	LOCAL_TIME;
  zacctype1	INTEGER REF zacctypes;
  zacctype2	INTEGER REF zacctypes;
  zacctype3	INTEGER REF zacctypes;
  zacctype4	INTEGER REF zacctypes;
  zcntref1rules	INTEGER REF zas;
  zcntref2rules	INTEGER REF zas;
  zcntref3rules	INTEGER REF zas;
  zcntref4rules	INTEGER REF zas;
  zcustomer	STRING 256;
  zgroup1	UUID REF ca_contact;
  zgroup1rules	INTEGER REF zas;
  zgroup2	UUID REF ca_contact;
  zgroup2rules	INTEGER REF zas;
  zgroup3	UUID REF ca_contact;
  zgroup3rules	INTEGER REF zas;
  zgroup4	UUID REF ca_contact;
  zgroup4rules	INTEGER REF zas;
  zloc	UUID REF ca_location;
  zlvl	STRING 1;
  zmanager1	UUID REF ca_contact;
  zmanager2	UUID REF ca_contact;
  zmanager3	UUID REF ca_contact;
  zmanager4	UUID REF ca_contact;
  zmpk	INTEGER REF ca_resource_cost_center;
  zrozwiazanie	STRING 4000;
  zsla	INTEGER REF zSLA;// SRel_Attr_Entry cr.zsla
  ztermin_realizacji	LOCAL_TIME;
  zuwagifz	STRING 4000;// Uwagi do firmy zewnętrznej
}

TABLE entservx {
  zAdjustedServiceCost	INTEGER;
  zBusinessServiceKind	INTEGER REF zBusinessServiceKind;
  zBusinessServiceType	INTEGER REF zBusinessServiceType;
  zCurrencyType	INTEGER REF zCurrencyType;
  zFinansialService	INTEGER REF Active_Boolean_Table;
  zPlannedServiceCost	INTEGER;
  zServiceOwner	UUID REF ca_contact;
  zServicePackage	INTEGER REF Active_Boolean_Table;
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
  znr_inwentarzowy	STRING 20;// numer inwentarzowy z SAP
  znumer_ot	STRING 255;
  zproducent	UUID REF ca_company;
  zsap_inne	STRING 4000;// inne informacje z SAP
  zvalue_net	REAL;
  zvalue_start	REAL;
}

TABLE usp_organization {
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
  zgroup1	UUID REF ca_contact;
  zgroup1rules	INTEGER REF zas;
  zgroup2	UUID REF ca_contact;
  zgroup2rules	INTEGER REF zas;
  zgroup3	UUID REF ca_contact;
  zgroup3rules	INTEGER REF zas;
  zgroup4	UUID REF ca_contact;
  zgroup4rules	INTEGER REF zas;
  zgrouprules	STRING 1;
  zguidesc	STRING 500;// Pole opisowe dla interfejsu użytkownika
  zimage	STRING 255;
  zmanager1	UUID REF ca_contact;
  zmanager2	UUID REF ca_contact;
  zmanager3	UUID REF ca_contact;
  zmanager4	UUID REF ca_contact;
  zsc_url	STRING 255;
  zsort	INTEGER;
}

TABLE Rootcause {
  zTyp	STRING 60;
}

TABLE usp_resolution_code {
  zTyp	STRING 60;
  zcrs	STRING 12 REF Cr_Status;// SRel_Attr_Entry resocode.zcrs
}

TABLE Service_Desc {
  zsla	INTEGER REF zSLA;
}

TABLE Service_Contract {
  zusluga	UUID REF ca_owned_resource;
}

TABLE zArea {
  id	INTEGER UNIQUE KEY;
  last_mod_dt	 LOCAL_TIME;
  last_mod_by	 UUID REF ca_contact;
  delete_flag	INTEGER REF Active_Boolean_Table;
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
  City	STRING 255;
  Country	STRING 255;
  PostCode	STRING 255;
  Street	STRING 255;
  delete_flag	INTEGER REF Active_Boolean_Table;
  sym	STRING 255 S_KEY;
}

p1 zContractors -> CURR_PROV zContractors;

TABLE zCorrespondanceOucome {
  id	INTEGER UNIQUE KEY;
  last_mod_dt	 LOCAL_TIME;
  last_mod_by	 UUID REF ca_contact;
  City	STRING 255;
  CorrespondanceLetterType	INTEGER REF zCorrespondenceLetterType;
  Country	STRING 255;
  Description	STRING 500;
  LetterNumber	STRING 255;
  Note	STRING 500;
  OutcomeDate	LOCAL_TIME;
  PostCode	STRING 255;
  Recipient	UUID REF ca_company;
  SenderEmployee	UUID REF ca_contact;
  SenderOrganization	UUID REF ca_organization;
  Street	STRING 255;
  delete_flag	INTEGER REF Active_Boolean_Table;
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
  City	STRING 255;
  CorrespondanceLetterType	INTEGER REF zCorrespondenceLetterType;
  Country	STRING 255;
  Description	STRING 500;
  IncomeDate	LOCAL_TIME;
  LetterNumber	STRING 255;
  Note	STRING 500;
  PostCode	STRING 255;
  RecipientEmployee	UUID REF ca_contact;
  RecipientOrganization	UUID REF ca_organization;
  Sender	UUID REF ca_company;
  Street	STRING 255;
  delete_flag	INTEGER REF Active_Boolean_Table;
  ref_num	STRING 30 UNIQUE S_KEY;
  sym	STRING 255;
}

p1 zCorrespondenceIncome -> CURR_PROV zCorrespondenceIncome;

TABLE zCorrespondenceLetterType {
  id	INTEGER UNIQUE KEY;
  last_mod_dt	 LOCAL_TIME;
  last_mod_by	 UUID REF ca_contact;
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
  cnt	UUID REF ca_contact;
  delete_flag	INTEGER REF Active_Boolean_Table;
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

TABLE zrodzaj_drukarki {
  id	INTEGER UNIQUE KEY;
  last_mod_dt	 LOCAL_TIME;
  last_mod_by	 UUID REF ca_contact;
  ex_name	STRING 255;
}

p1 zrodzaj_drukarki -> CURR_PROV zrodzaj_drukarki;

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
  cd_dvd	INTEGER;
  ex_name	STRING 255;
  ilosc_procesorow	INTEGER;// od 1 do 16
  ilosc_ram	INTEGER;// w MB
  karta_sieciowa	INTEGER;
  monitor_nazwa	STRING 255;
  monitor_rozmiar	STRING 30;
  procesor	INTEGER REF ztyp_procesora;
  rozmiar_hdd	INTEGER;// w BG
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
