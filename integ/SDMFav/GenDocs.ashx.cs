using Novacode;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web;
using System.Xml;

namespace SDMFavService
{
    /// <summary>
    /// Summary description for GenDocs
    /// </summary>
    public class GenDocs : IHttpHandler
    {
        public void ProcessRequest(HttpContext context)
        {
            switch (context.Request.QueryString["OP"])
            {
                case "obiegowka":
                    GenObiegowka(context);
                    break;
                case "korespondencja":
                    GenCorrespondenceList(context);
                    break;
                case "ekspertyza":
                    GenExpertise(context);
                    break;
                default:
                    break;
            }
        }

        private void GenExpertise(HttpContext context)
        {
            try
            {
                string Miejscowosc = context.Request.QueryString["Miejscowosc"];
                string Pracownik = context.Request.QueryString["Pracownik"];
                string MPK = context.Request.QueryString["MPK"];
                string NrHD = context.Request.QueryString["NrHD"];
                string PC_Num = context.Request.QueryString["PC_Num"];
                string PC_SerialNum = context.Request.QueryString["PC_SerialNum"];
                string PC_Model = context.Request.QueryString["PC_Model"];
                string PC_CPU = context.Request.QueryString["PC_CPU"];
                string PC_RAM = context.Request.QueryString["PC_RAM"];
                string PC_HDD = context.Request.QueryString["PC_HDD"];
                string WynikEkspertyzy = context.Request.QueryString["WynikEkspertyzy"];
                string PropozycjaSerwisu = context.Request.QueryString["PropozycjaSerw"];
                string PropozycjaSerwisuInne = context.Request.QueryString["PropozycjaSerwInne"];
                string SprzetZaplombowano = context.Request.QueryString["SprzetZaplombowano"];
                string BI_Uwagi = context.Request.QueryString["BI_Uwagi"];

                System.IO.MemoryStream FileUploader = new MemoryStream();
                using (DocX document = DocX.Load(new FileStream(context.Server.MapPath(@"~/App_Data/template_ekspertyza.docx"), FileMode.Open, FileAccess.Read)))
                {
                    document.ReplaceText("<date>", DateTime.Now.ToShortDateString(), false, RegexOptions.IgnoreCase);
                    document.ReplaceText("<place>", Miejscowosc, false, RegexOptions.IgnoreCase);
                    document.ReplaceText("<employee_name>", Pracownik.ToUpper(), false, RegexOptions.IgnoreCase);
                    document.ReplaceText("<employee_mpk>", MPK.ToUpper(), false, RegexOptions.IgnoreCase);
                    document.ReplaceText("<application_number>", NrHD, false, RegexOptions.IgnoreCase);
                    document.ReplaceText("<pc_number>", PC_Num, false, RegexOptions.IgnoreCase);
                    document.ReplaceText("<pc_serial_number>", PC_SerialNum, false, RegexOptions.IgnoreCase);
                    document.ReplaceText("<pc_model>", PC_Model, false, RegexOptions.IgnoreCase);
                    document.ReplaceText("<pc_cpu>", PC_CPU, false, RegexOptions.IgnoreCase);
                    document.ReplaceText("<pc_ram>", PC_RAM, false, RegexOptions.IgnoreCase);
                    document.ReplaceText("<pc_hdd>", PC_HDD, false, RegexOptions.IgnoreCase);
                    document.ReplaceText("<expertise_result>", WynikEkspertyzy, false, RegexOptions.IgnoreCase);
                    document.ReplaceText("<service_suggestion>", PropozycjaSerwisu, false, RegexOptions.IgnoreCase);
                    document.ReplaceText("<service_suggestion_more>", PropozycjaSerwisuInne, false, RegexOptions.IgnoreCase);
                    document.ReplaceText("<x>", SprzetZaplombowano == "Yes" ? "X" : "", false, RegexOptions.IgnoreCase);
                    document.ReplaceText("<it_department_suggestion>", BI_Uwagi, false, RegexOptions.IgnoreCase);

                    document.SaveAs(FileUploader);
                }

                context.Response.Buffer = true;
                context.Response.Clear();
                context.Response.ContentType = "application/doc";
                context.Response.AddHeader("content-disposition", "attachment; filename=" + string.Format("protokol_ekspertyzy_{0}.docx", NrHD));
                context.Response.BinaryWrite(FileUploader.ToArray());
                context.Response.Flush();
                //context.Response.End();

                FileUploader.Dispose();
            }
            catch (Exception ex)
            {
                File.AppendAllText(System.Web.Hosting.HostingEnvironment.ApplicationPhysicalPath + "AppLog.log", "\r\n\r\nB" + DateTime.Now.ToString() + "\r\n" + ex.ToString());
            }
        }

        private void GenCorrespondenceList(HttpContext context)
        {
            try
            {
                string GenFrom = ReadLastId();

                if (GenFrom == string.Empty)
                    GenFrom = "400000";

                string GenTo = context.Request.QueryString["SelectedItem"];

                try
                {
                    System.Xml.XmlDocument Doc = new System.Xml.XmlDocument();
                    System.Xml.XmlDocument xDoc = new System.Xml.XmlDocument();

                    SDMService.USD_WebService ws = new SDMService.USD_WebService();
                    var sid = ws.login(Helpers.GetSetting("CALogin", false), Helpers.GetSetting("CAPassword", true));
                    var handle = ws.getHandleForUserid(sid, Helpers.GetSetting("CALogin", false));
                    String[] attributes = new string[] { "ref_num", "CorrespondanceLetterType.sym", "SenderEmployee.combo_name", "SenderOrganization.name", "Recipient.sym", "Street", "PostCode", "City", "Country", "OutcomeDate" };

                    var result = ws.doSelect(sid, "zCorrespondanceOucome", "id > " + GenFrom + " AND id <= " + GenTo, -1, attributes);

                    xDoc.LoadXml(result.ToString());

                    using (DocX document = DocX.Load(new FileStream(context.Server.MapPath(@"~/App_Data/template_karta_korespondencji_wychodzacej.docx"), FileMode.Open, FileAccess.Read)))
                    {
                        document.ReplaceText("<gen_date>", DateTime.Now.ToString("yyyy-dd-MM HH:mm"), false, RegexOptions.IgnoreCase);

                        Table ResultTable = document.AddTable(xDoc.GetElementsByTagName("Attributes").Count + 1, 10);
                        ResultTable.Alignment = Alignment.center;
                        ResultTable.Design = TableDesign.LightShadingAccent3;
                        ResultTable.AutoFit = AutoFit.Contents;

                        ResultTable.Rows[0].Cells[0].Paragraphs.First().Append("Ref").FontSize(8);
                        ResultTable.Rows[0].Cells[1].Paragraphs.First().Append("Rodzaj").FontSize(8);
                        ResultTable.Rows[0].Cells[2].Paragraphs.First().Append("Nadawca osoba").FontSize(8);
                        ResultTable.Rows[0].Cells[3].Paragraphs.First().Append("Nadawca org").FontSize(8);
                        ResultTable.Rows[0].Cells[4].Paragraphs.First().Append("Adresat").FontSize(8);
                        ResultTable.Rows[0].Cells[5].Paragraphs.First().Append("Ulica").FontSize(8);
                        ResultTable.Rows[0].Cells[6].Paragraphs.First().Append("Kod pocztowy").FontSize(8);
                        ResultTable.Rows[0].Cells[7].Paragraphs.First().Append("Miasto").FontSize(8);
                        ResultTable.Rows[0].Cells[8].Paragraphs.First().Append("Państwo").FontSize(8);
                        ResultTable.Rows[0].Cells[9].Paragraphs.First().Append("Data").FontSize(8);

                        int tRows = 1;
                        int tCells = 0;
                        foreach (XmlElement GetAttributes in xDoc.GetElementsByTagName("Attributes"))
                        {
                            tCells = 0;
                            foreach (XmlElement Attribute in GetAttributes.GetElementsByTagName("Attribute"))
                            {
                                //string attrname = Attribute["AttrName"].InnerText;
                                if (Attribute["AttrName"].InnerText == "OutcomeDate")
                                {
                                    DateTime dt = UnixTimeStampToDateTime(Convert.ToDouble(Attribute["AttrValue"].InnerText));
                                    ResultTable.Rows[tRows].Cells[tCells].Paragraphs.First().Append(dt.ToString("yyyy-MM-dd HH:mm")).FontSize(8);
                                }
                                else
                                {
                                    ResultTable.Rows[tRows].Cells[tCells].Paragraphs.First().Append(Attribute["AttrValue"].InnerText).FontSize(8);
                                }

                                tCells++;
                            }
                            tRows++;
                        }

                        document.InsertTable(ResultTable);

                        document.ReplaceText("<item_count>", tRows.ToString(), false, RegexOptions.IgnoreCase);

                        System.IO.MemoryStream FileUploader = new MemoryStream();

                        document.SaveAs(FileUploader);

                        context.Response.Buffer = true;
                        context.Response.Clear();
                        context.Response.ContentType = "application/docx";
                        context.Response.AddHeader("content-disposition", "attachment; filename=" + string.Format("karta_korespondencji_wychodzacej_{0}.docx", DateTime.Now.ToString("yyyyMMdd_HHmm")));
                        context.Response.BinaryWrite(FileUploader.ToArray());
                        context.Response.Flush();
                        //context.Response.End();

                        FileUploader.Dispose();
                    }

                    ws.logout(sid);

                    SetLastId(GenTo);
                }
                catch (Exception ex)
                {
                    File.AppendAllText(System.Web.Hosting.HostingEnvironment.ApplicationPhysicalPath + "AppLog.log", "\r\n\r\nB" + DateTime.Now.ToString() + "\r\n" + ex.ToString());
                }
            }
            catch (Exception ex)
            {
                File.AppendAllText(System.Web.Hosting.HostingEnvironment.ApplicationPhysicalPath + "AppLog.log", "\r\n\r\nB" + DateTime.Now.ToString() + "\r\n" + ex.ToString());
            }
        }

        private void GenObiegowka(HttpContext context)
        {
            try
            {
                string NrHD = context.Request.QueryString["NrHD"];
                string NrKomputera = context.Request.QueryString["NrKomputera"];
                string ImieNazwisko = context.Request.QueryString["ImieNazwisko"];
                string Spolka = context.Request.QueryString["Spolka"];
                string KomorkaOrg = context.Request.QueryString["KomorkaOrg"];
                string DataRozwiazaniaUmowy = context.Request.QueryString["DataRozwiazaniaUmowy"];
                string PKZP_stan = context.Request.QueryString["PKZP_stan"];
                string PKZP_stan_zadluzenia = context.Request.QueryString["PKZP_stan_zadluzenia"];
                string PKZP_data = context.Request.QueryString["PKZP_data"];
                string PKZP_komentarz = context.Request.QueryString["PKZP_komentarz"];
                string ZFSS_stan = context.Request.QueryString["ZFSS_stan"];
                string ZFSS_stan_zadluzenia = context.Request.QueryString["ZFSS_stan_zadluzenia"];
                string ZFSS_data = context.Request.QueryString["ZFSS_data"];
                string ZFSS_komentarz = context.Request.QueryString["ZFSS_komentarz"];
                string BOM_stan = context.Request.QueryString["BOM_stan"];
                string BOM_stan2 = context.Request.QueryString["BOM_stan2"];
                string BOM_komentarz = context.Request.QueryString["BOM_komentarz"];
                string BOZ_stan = context.Request.QueryString["BOZ_stan"];
                string BOZ_komentarz = context.Request.QueryString["BOZ_komentarz"];

                System.IO.MemoryStream FileUploader = new MemoryStream();
                using (DocX document = DocX.Load(new FileStream(context.Server.MapPath(@"~/App_Data/template_karta_obiegowa_zwolnienia.docx"), FileMode.Open, FileAccess.Read)))
                {
                    #region Main Information
                    document.ReplaceText("<nr_karty>", string.Format("OB/{0}/{1}", NrHD, DateTime.Now.Year.ToString()), false, RegexOptions.IgnoreCase);
                    document.ReplaceText("<nr_komp>", NrKomputera, false, RegexOptions.IgnoreCase);

                    document.ReplaceText("<imie_nazwisko>", ImieNazwisko, false, RegexOptions.IgnoreCase);
                    document.ReplaceText("<spolka>", Spolka, false, RegexOptions.IgnoreCase);
                    document.ReplaceText("<kom_org>", KomorkaOrg, false, RegexOptions.IgnoreCase);

                    document.ReplaceText("<data_rozw>", DataRozwiazaniaUmowy, false, RegexOptions.IgnoreCase);
                    #endregion

                    #region Pożyczki ZFSS

                    if (ZFSS_stan == "posiada pożyczkę")
                    {
                        document.ReplaceText("<stan_zfss>", ZFSS_stan, false, RegexOptions.IgnoreCase);
                        document.ReplaceText("<stan_zadluzenia_zfss>", ZFSS_stan_zadluzenia, false, RegexOptions.IgnoreCase);
                        document.ReplaceText("<data_zfss>", ZFSS_data, false, RegexOptions.IgnoreCase);
                    }
                    else
                    {
                        document.ReplaceText("<stan_zfss>", ZFSS_stan, false, RegexOptions.IgnoreCase);
                        Table ZFSSMoreTable = document.Tables[2];
                        ZFSSMoreTable.Remove();
                    }

                    document.ReplaceText("<komentarz_zfss>", ZFSS_komentarz, false, RegexOptions.IgnoreCase);
                    #endregion

                    #region Pożyczki PKZP

                    document.ReplaceText("<stan_pkzp>", PKZP_stan, false, RegexOptions.IgnoreCase);

                    if (PKZP_stan == "posiada pożyczkę")
                    {
                        document.ReplaceText("<stan_pkzp>", PKZP_stan, false, RegexOptions.IgnoreCase);
                        document.ReplaceText("<stan_zadluzenia_pkzp>", PKZP_stan_zadluzenia, false, RegexOptions.IgnoreCase);
                        document.ReplaceText("<data_pkzp>", PKZP_data, false, RegexOptions.IgnoreCase);
                    }
                    else
                    {
                        document.ReplaceText("<stan_pkzp>", PKZP_stan, false, RegexOptions.IgnoreCase);
                        Table PKZPMoreTable = document.Tables[1];
                        PKZPMoreTable.Remove();
                    }

                    document.ReplaceText("<komentarz_pkzp>", PKZP_komentarz, false, RegexOptions.IgnoreCase);
                    #endregion

                    #region Biuro Obsługi Majątku
                    document.ReplaceText("<stan_bom>", BOM_stan, false, RegexOptions.IgnoreCase);
                    document.ReplaceText("<stan2_bom>", BOM_stan2, false, RegexOptions.IgnoreCase);
                    document.ReplaceText("<komentarz_bom>", BOM_komentarz, false, RegexOptions.IgnoreCase);
                    #endregion

                    #region Biuro Obsługi Zobowiązań
                    document.ReplaceText("<stan_boz>", BOZ_stan, false, RegexOptions.IgnoreCase);
                    document.ReplaceText("<komentarz_boz>", BOZ_komentarz, false, RegexOptions.IgnoreCase);
                    #endregion

                    document.SaveAs(FileUploader);
                }

                context.Response.Buffer = true;
                context.Response.Clear();
                context.Response.ContentType = "application/doc";
                context.Response.AddHeader("content-disposition", "attachment; filename=" + string.Format("karta_obiegowa_zwolnienia_nr_{0}.docx", NrHD));
                context.Response.BinaryWrite(FileUploader.ToArray());
                context.Response.Flush();
                //context.Response.End();

                FileUploader.Dispose();
            }
            catch (Exception ex)
            {
                File.AppendAllText(System.Web.Hosting.HostingEnvironment.ApplicationPhysicalPath + "AppLog.log", "\r\n\r\nB" + DateTime.Now.ToString() + "\r\n" + ex.ToString());
            }
        }

        public static DateTime UnixTimeStampToDateTime(double unixTimeStamp)
        {
            System.DateTime dtDateTime = new DateTime(1970, 1, 1, 0, 0, 0, 0);
            dtDateTime = dtDateTime.AddSeconds(unixTimeStamp).ToLocalTime();
            return dtDateTime;
        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }

        //private string GetSetting(string SettingName)
        //{
        //    return ConfigurationManager.AppSettings[SettingName].ToString();
        //}

        private void SetSetting(string SettingName, string SettingValue)
        {
            ConfigurationManager.AppSettings[SettingName] = SettingValue;
        }

        private string ReadLastId()
        {
            return File.ReadAllText(System.Web.Hosting.HostingEnvironment.ApplicationPhysicalPath + "LastId.cfg");
        }

        private void SetLastId(string LastId)
        {
            File.WriteAllText(System.Web.Hosting.HostingEnvironment.ApplicationPhysicalPath + "LastId.cfg", LastId);
        }
    }
}