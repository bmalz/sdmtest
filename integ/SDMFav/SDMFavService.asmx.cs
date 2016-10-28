using Novacode;
using SDMFavService.Classes;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Diagnostics;
using System.IO;
using System.Net;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Script.Services;
using System.Web.Services;
using System.Xml;
using System.Linq;
using System.Globalization;

namespace SDMFavService
{
    /// <summary>
    /// Summary description for Service1
    /// </summary>
    [WebService(Namespace = "http://e-xim.dev/favwebservice/")]
    [System.Web.Script.Services.ScriptService]
    public class SDMFav : System.Web.Services.WebService
    {
        [WebMethod]
        public byte[] GenKartaObiegowa(string NrHD, string NrKomputera, string UserId, string DataRozwiazaniaUmowy,
            string PKZP_status, bool PKZP_stan, string PKZP_stan_zadluzenia, string PKZP_data, string PKZP_komentarz,
            string ZFSS_status, bool ZFSS_stan, string ZFSS_stan_zadluzenia, string ZFSS_data, string ZFSS_komentarz,
            string BOM_status, bool BOM_stan, bool BOM_stan2, string BOM_komentarz,
            string BOZ_status, bool BOZ_stan, string BOZ_komentarz)
        {
            using (DocX document = DocX.Load(Server.MapPath(@"~/App_Data/template_karta_obiegowa_zwolnienia.docx")))
            {
                #region Main Information
                document.ReplaceText("<nr_karty>", string.Format("OB/{0}/{1}", NrHD, DateTime.Now.Year.ToString()), false, RegexOptions.IgnoreCase);
                document.ReplaceText("<nr_komp>", NrKomputera, false, RegexOptions.IgnoreCase);

                #region AD connection
                string ImieNazwisko = string.Empty;
                string Spolka = string.Empty;
                string KomorkaOrg = string.Empty;

                document.ReplaceText("<imie_nazwisko>", ImieNazwisko, false, RegexOptions.IgnoreCase);
                document.ReplaceText("<spolka>", Spolka, false, RegexOptions.IgnoreCase);
                document.ReplaceText("<kom_org>", KomorkaOrg, false, RegexOptions.IgnoreCase);
                #endregion

                document.ReplaceText("<data_rozw>", DataRozwiazaniaUmowy, false, RegexOptions.IgnoreCase);
                #endregion

                #region Pożyczki PKZP
                document.ReplaceText("<status_pkzp>", PKZP_status, false, RegexOptions.IgnoreCase);

                if (PKZP_stan)
                {
                    document.ReplaceText("<stan_pkzp>", "posiada pożyczkę", false, RegexOptions.IgnoreCase);
                    document.ReplaceText("<stan_zadluzenia_pkzp>", PKZP_stan_zadluzenia, false, RegexOptions.IgnoreCase);
                    document.ReplaceText("<data_pkzp>", PKZP_data, false, RegexOptions.IgnoreCase);
                }
                else
                {
                    document.ReplaceText("<stan_pkzp>", "nie posiada pożyczki", false, RegexOptions.IgnoreCase);
                    Table PKZPMoreTable = document.Tables[1];
                    PKZPMoreTable.Remove();
                }

                document.ReplaceText("<komentarz_pkzp>", PKZP_komentarz, false, RegexOptions.IgnoreCase);
                #endregion

                #region Pożyczki ZFSS
                document.ReplaceText("<status_zfss>", ZFSS_status, false, RegexOptions.IgnoreCase);

                if (ZFSS_stan)
                {
                    document.ReplaceText("<stan_zfss>", "posiada pożyczkę", false, RegexOptions.IgnoreCase);
                    document.ReplaceText("<stan_zadluzenia_zfss>", ZFSS_stan_zadluzenia, false, RegexOptions.IgnoreCase);
                    document.ReplaceText("<data_zfss>", ZFSS_data, false, RegexOptions.IgnoreCase);
                }
                else
                {
                    document.ReplaceText("<stan_zfss>", "nie posiada pożyczki", false, RegexOptions.IgnoreCase);
                    Table PKZPMoreTable = document.Tables[2];
                    PKZPMoreTable.Remove();
                }

                document.ReplaceText("<komentarz_zfss>", ZFSS_komentarz, false, RegexOptions.IgnoreCase);
                #endregion

                #region Biuro Obsługi Majątku
                document.ReplaceText("<status_bom>", BOM_status, false, RegexOptions.IgnoreCase);

                if (BOM_stan)
                    document.ReplaceText("<stan_bom>", "jest", false, RegexOptions.IgnoreCase);
                else
                    document.ReplaceText("<stan_bom>", "nie jest", false, RegexOptions.IgnoreCase);

                if (BOM_stan2)
                    document.ReplaceText("<stan2_bom>", "rozliczył", false, RegexOptions.IgnoreCase);
                else
                    document.ReplaceText("<stan2_bom>", "nie rozliczył", false, RegexOptions.IgnoreCase);

                document.ReplaceText("<komentarz_bom>", BOM_komentarz, false, RegexOptions.IgnoreCase);
                #endregion

                #region Biuro Obsługi Zobowiązań
                document.ReplaceText("<status_boz>", BOZ_status, false, RegexOptions.IgnoreCase);

                if (BOZ_stan)
                    document.ReplaceText("<stan_boz>", "rozliczył", false, RegexOptions.IgnoreCase);
                else
                    document.ReplaceText("<stan_boz>", "nie rozliczył", false, RegexOptions.IgnoreCase);

                document.ReplaceText("<komentarz_boz>", BOZ_komentarz, false, RegexOptions.IgnoreCase);
                #endregion

                System.IO.MemoryStream FileUploader = new MemoryStream();
                document.SaveAs(FileUploader);

                return FileUploader.ToArray();
            }
        }

        [WebMethod]
        public void AddFav(string cntid, string pcatid)
        {
            try
            {
                string handleN = "";
                string createObectResult = "";

                System.Xml.XmlDocument Doc = new System.Xml.XmlDocument();
                System.Xml.XmlDocument xDoc = new System.Xml.XmlDocument();
                XmlNodeList xHandle = default(XmlNodeList);
                string xResult = null;

                SDMService.USD_WebService ws = new SDMService.USD_WebService();
                ws.Url = Helpers.GetSetting("CAwsurl", false);
                var sid = ws.login(Helpers.GetSetting("CALogin", false), Helpers.GetSetting("CAPassword", true));
                var handle = ws.getHandleForUserid(sid, Helpers.GetSetting("CALogin", false));

                String[] attrVals = new string[] { "cnt", cntid, "pcat", "pcat:" + pcatid, "delete_flag", "0" };
                String[] attributes = new string[] { };

                var result = ws.doSelect(sid, "zfav_pcat", "cnt = U'" + cntid + "' AND pcat = 'pcat:" + pcatid + "'", -1, attributes);

                xDoc.LoadXml(result.ToString());
                xHandle = xDoc.GetElementsByTagName("Handle");

                if (xHandle.Count > 0)
                {
                    xResult = xHandle[0].InnerText;
                    attrVals = new string[] { "delete_flag", "0" };
                    ws.updateObject(sid, xResult, attrVals, attributes);
                }
                else
                {
                    ws.createObject(sid, "zfav_pcat", attrVals, attributes, ref createObectResult, ref handleN);
                }

                ws.logout(sid);
            }
            catch (Exception e)
            {
                LogToEventLog(e.ToString());
                throw;
            }
        }

        [WebMethod]
        public void DelFav(string cntid, string pcatid)
        {
            try
            {
                System.Xml.XmlDocument Doc = new System.Xml.XmlDocument();
                System.Xml.XmlDocument xDoc = new System.Xml.XmlDocument();
                XmlNodeList xHandle = default(XmlNodeList);
                string xResult = null;

                SDMService.USD_WebService ws = new SDMService.USD_WebService();
                ws.Url = Helpers.GetSetting("CAwsurl", false);
                var sid = ws.login(Helpers.GetSetting("CALogin", false), Helpers.GetSetting("CAPassword", true));
                var handle = ws.getHandleForUserid(sid, Helpers.GetSetting("CALogin", false));

                String[] attrVals = new string[] { "delete_flag", "1" };
                String[] attributes = new string[] { };

                var result = ws.doSelect(sid, "zfav_pcat", "cnt = U'" + cntid + "' AND pcat = 'pcat:" + pcatid + "'", -1, attributes);

                xDoc.LoadXml(result.ToString());
                xHandle = xDoc.GetElementsByTagName("Handle");

                if (xHandle.Count > 0)
                {
                    xResult = xHandle[0].InnerText;
                    ws.updateObject(sid, xResult, attrVals, attributes);
                }

                ws.logout(sid);
            }
            catch (Exception e)
            {
                LogToEventLog(e.ToString());
                throw;
            }
        }

        private void LogToEventLog(string EventMessage)
        {
            File.AppendAllText(System.Web.Hosting.HostingEnvironment.ApplicationPhysicalPath + "AppLog.log", "\r\n\r\nB" + DateTime.Now.ToString() + "\r\n" + EventMessage);
        }

        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public List<Room> GetRooms()
        {
            List<Room> list = new List<Room>();
            try
            {
                list = GetAllActiveRooms(null);
                return list;
            }
            catch(Exception)
            {
                Context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                Context.Response.StatusDescription = "Błąd komunikacji z bazą danych.";
            }

            return list;
        }

        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public List<Location> GetLocations()
        {
            List<Location> list = new List<Location>();
            List<Room> rooms = GetAllActiveRooms(null);
            foreach (Room r in rooms)
            {
                if(!list.Exists( x => x.Name == r.LokalizacjaNazwa))
                    list.Add(new Location() { Name = r.LokalizacjaNazwa, Uuid = r.LokalizacjaUuid });
            }

            return list;
        }

        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public List<Room> GetRoomsFromLocation(string locationUuid, string start, string end)
        {
            List<Room> list = new List<Room>();
            try
            {
                list = GetAllActiveRooms(locationUuid);
                //pobierz rezerwacje dla tych pokoi
                list = GetReservationsForRooms(list);
                string dateFormat = ConfigurationManager.AppSettings["DateFormat"];
                DateTime dateStart = DateTime.ParseExact(start, dateFormat, CultureInfo.InvariantCulture);
                DateTime dateEnd = DateTime.ParseExact(end, dateFormat, CultureInfo.InvariantCulture);
                list = MarkRoomsAvaliability(list, dateStart, dateEnd);

                return list;
            }
            catch (Exception)
            {
                Context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                Context.Response.StatusDescription = "Błąd komunikacji z bazą danych.";
            }

            return list;
        }

        private List<Room> MarkRoomsAvaliability(List<Room> list, DateTime start, DateTime end)
        {
            foreach (Room room in list)
            {
                //room.IsAvaliable = false;
                List<Reservation> reservationsWithDates = room.Reservations.Where(x => x.Start.HasValue && x.End.HasValue).ToList();
                if (reservationsWithDates.Count == 0)
                {
                    room.IsAvaliable = true;
                    continue;
                }

                foreach (Reservation reservation in reservationsWithDates)
                {
                    DateTime reservationStart = reservation.Start.Value;
                    DateTime reservationEnd = reservation.End.Value;

                    ////case 1
                    if (start >= reservationEnd)
                    {
                        //w tym czasie mozna rezerwowac
                        room.IsAvaliable = true;
                    }
                    else if (end <= reservationStart)
                    {
                        //mozna rezerwowac
                        room.IsAvaliable = true;
                    }
                    else
                    {
                        room.IsAvaliable = false;
                        room.Collisions.Add(reservation);
                    }
                }

                if (room.Collisions.Count > 0)
                    room.IsAvaliable = false;
            }

            return list;
        }

        private List<Room> GetReservationsForRooms(List<Room> rooms)
        {
            string labelStart = ConfigurationManager.AppSettings["LabelStart"].ToString();
            string labelEnd = ConfigurationManager.AppSettings["LabelEnd"].ToString();
            string dateFormat = ConfigurationManager.AppSettings["DateFormat"].ToString();

            string pcat = GetRoomReservationPersistentId();

            // List<Room> list = new List<Room>();
            List<Reservation> reservations = new List<Reservation>();
            string cs = ConfigurationManager.AppSettings["sdmdb"];
            using (SqlConnection connection = new SqlConnection(Helpers.Decrypt(cs)))
            {
                connection.Open();
                string sqlparamRooms = String.Join(", ", rooms.Select(x => "0x" + x.SalaUuid));
                string cmd = String.Format("select cr.affected_rc as salaUuid, prp.id, prp.persid, prp.label, prp.value, prp.owning_cr, cr.summary, cr.description,	cr.customer as customerUuid, cnt.first_name + ' ' + cnt.last_name as cusotmerName, org.org_name, ct.name, stat.sym as status_sym from cr_prp prp join call_req cr on prp.owning_cr = cr.persid join ca_contact cnt on cr.customer = cnt.contact_uuid join ca_organization org on cnt.organization_uuid = org.organization_uuid left outer join ca_tenant ct on org.tenant = ct.id " + 
                    " left outer join cr_stat stat on stat.code = cr.status " +
                    " where cr.status <> 'CNCL' and cr.category = '{0}' and affected_rc in ({1})", pcat, sqlparamRooms);
                using (SqlDataAdapter adapter = new SqlDataAdapter(cmd, connection))
                {
                    DataTable table = new DataTable();
                    adapter.Fill(table);

                    foreach (DataRow row in table.Rows)
                    {
                        if(!reservations.Any(x => x.OwningCr.Equals(row[5].ToString())))
                        {
                            Reservation r = new Reservation();
                            r.OwningCr = row[5].ToString();
                            r.RoomUuid = Helpers.ByteToString((byte[])row[0]);
                            reservations.Add(r);
                        }
                    }

                    //wybierz wszystkie wlasciwosci dla danego cr
                    EnumerableRowCollection<DataRow> enumeratedTable = table.AsEnumerable();
                    foreach (Reservation reservation in reservations)
                    {
                        //to wybieramy firstOrDefault, poniewaz czy tych rekordow jest 4 czy 67 to te 4 pola sa takie same
                        var query = (from x in enumeratedTable where x[5].ToString().Equals(reservation.OwningCr) select new { Summary = x[6].ToString(), Description = x[7].ToString(), Person = x[9].ToString(), Organization = x[10].ToString(), Status = x[12].ToString() }).FirstOrDefault();
                        if (query != null)
                        {
                            reservation.Subject = query.Summary;
                            reservation.Description = query.Description;
                            reservation.Person = query.Person;
                            reservation.Organization = query.Organization;
                            reservation.Status = query.Status;
                        }

                        DataRow crRowStart = (from x in enumeratedTable where x[5].ToString().Equals(reservation.OwningCr) where x[3].ToString().Equals(labelStart) select x).FirstOrDefault();
                        if (crRowStart != null)
                        {
                            try
                            {
                                DateTime dt = DateTime.ParseExact(crRowStart[4].ToString(), dateFormat, CultureInfo.InvariantCulture);
                                reservation.Start = dt;
                            }
                            catch (Exception)
                            {
                                reservation.Start = null;
                            }
                        }
                        else
                            reservation.Start = null;

                        DataRow crRowEnd = (from x in enumeratedTable where x[5].ToString().Equals(reservation.OwningCr) where x[3].ToString().Equals(labelEnd) select x).FirstOrDefault();
                        if (crRowEnd != null)
                        {
                            try
                            {
                                DateTime dt = DateTime.ParseExact(crRowEnd[4].ToString(), dateFormat, CultureInfo.InvariantCulture);
                                reservation.End = dt;
                            }
                            catch (Exception)
                            {
                                reservation.End = null;
                            }
                        }
                        else
                            reservation.End = null;
                    }

                }
            }

            foreach (Room room in rooms)
            {
                room.Reservations = (from x in reservations where x.RoomUuid == room.SalaUuid select x).ToList();
            }

            return rooms;
        }

        private string GetRoomReservationPersistentId()
        {
            string cs = Helpers.GetSetting("sdmdb", true);
            try
            {
                using (SqlConnection connection = new SqlConnection(cs))
                {
                    connection.Open();
                    string cmd = string.Format("select persid from prob_ctg where sym = '{0}'", Helpers.GetSetting("ProbCTG", false));
                    SqlCommand sqlCommand = new SqlCommand(cmd, connection);
                    object o = sqlCommand.ExecuteScalar();
                    if (o != null)
                    {
                        return o.ToString();
                    }
                }
            }
            catch (Exception ex)
            {
                
            }

            return string.Empty;
        }

        private List<Room> GetAllActiveRooms(string locationUuid)
        {
            List<Room> list = new List<Room>();
            string cs = Helpers.GetSetting("sdmdb", true);
            using (SqlConnection connection = new SqlConnection(cs))
            {
                connection.Open();
                string cmd = "select c.own_resource_uuid as sala_uuid,c.resource_name as sala_nazwa,loc.own_resource_uuid as lokalizacja_uuid,loc.resource_name as lokalizacja_nazwa,s.dodatkowe_miejsca,s.flipchart,s.monitor,s.naglosnienie,s.pojemnosc_konferencyjna,s.pojemnosc_teatralna,s.projektor,s.projektor_przenosny,s.tablica_suchoscieralna,s.telekonferencja,s.videokonferencja,s.wifi,s.ekran, c.resource_contact_uuid from ca_owned_resource c join zadm_sa_ko s on c.own_resource_uuid = s.own_resource_uuid join ca_resource_class r on c.resource_class = r.id left outer join usp_owned_resource l on c.own_resource_uuid = l.owned_resource_uuid left outer join ca_owned_resource loc on l.zlokalizacja = loc.own_resource_uuid where s.del = 0 and c.inactive = 0 and c.resource_status = 2606 and r.name = 'Sala konferencyjna'";
                if (!String.IsNullOrEmpty(locationUuid))
                    cmd += " and loc.own_resource_uuid = 0x" + locationUuid;

                using (SqlDataAdapter adapter = new SqlDataAdapter(cmd, connection))
                {
                    DataTable dt = new DataTable();
                    adapter.Fill(dt);

                    foreach (DataRow row in dt.Rows)
                    {
                        Room room = new Room();
                        room.SalaUuid = Helpers.ByteToString((byte[])row["sala_uuid"]);
                        room.SalaNazwa = row["sala_nazwa"].ToString();
                        room.LokalizacjaUuid = Helpers.ByteToString((byte[])row["lokalizacja_uuid"]);
                        room.LokalizacjaNazwa = row["lokalizacja_nazwa"].ToString();
                        room.DodatkoweMiejsca = (int)row["dodatkowe_miejsca"];
                        room.Flipchart = (row["flipchart"] as int? == 1) ? true : false;
                        room.Monitor = (row["monitor"] as int? == 1) ? true : false;
                        room.Naglosnienie = (row["naglosnienie"] as int? == 1) ? true : false;
                        room.PojemnoscKonferencyjna = (int)row["pojemnosc_konferencyjna"];
                        room.PojemnoscTeatralna = (int)row["pojemnosc_teatralna"];
                        room.Projektor = (row["projektor"] as int? == 1) ? true : false;
                        room.ProjektorPrzenosny = (row["projektor_przenosny"] as int? == 1) ? true : false;
                        room.TablicaSuchoscieralna = (row["tablica_suchoscieralna"] as int? == 1) ? true : false;
                        room.Telekonferencja = (row["telekonferencja"] as int? == 1) ? true : false;
                        room.Videokonferencja = (row["videokonferencja"] as int? == 1) ? true : false;
                        room.Wifi = (row["wifi"] as int? == 1) ? true : false;
                        room.Ekran = (row["ekran"] as int? == 1) ? true : false;

                        if (row["resource_contact_uuid"] != DBNull.Value)
                            room.BillingOwnerUuid = string.Format("{0}:{1}", "cnt", Helpers.ByteToString((byte[])row["resource_contact_uuid"]));
                        else
                            room.BillingOwnerUuid = string.Empty;
                        list.Add(room);
                    }
                }
            }

            return list;
        }

        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public void MakeReservation(string userPersistentId, string roomUuid, string start, string end, string mpk, string katering, string roomName, string desc, string isrec, string recrule,
            string kateringDodatkoweInfo, string kateringDostawa, string iloscOsob)
        {
            string wsurl = Helpers.GetSetting("CAwsurl", false);
            //string cs = Helpers.GetSetting("sdmdb", true);
            try
            {
                string pcat = GetRoomReservationPersistentId();
                if (!string.IsNullOrEmpty(pcat))
                {
                    SDMWebServiceHelper helper = new SDMWebServiceHelper(wsurl, Helpers.GetSetting("CALogin", false), Helpers.GetSetting("CAPassword", true));
                    helper.CreateRequest(pcat, userPersistentId, roomUuid, start, end, mpk, katering, roomName, desc, isrec, recrule, kateringDodatkoweInfo, kateringDostawa, iloscOsob);
                }
                else
                {
                    throw new Exception("Nie znaleziono persistent_id dla Administracja.Rezerwacja sali");
                }

            }
            catch (Exception ex)
            {
                Context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                Context.Response.StatusDescription = ex.Message;
            }
        }

        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public void CancelReservation(string persid, string cancelAll)
        {
            string wsurl = Helpers.GetSetting("CAwsurl", false);

            string rescode = string.Empty;
            string cs = Helpers.GetSetting("sdmdb", true);
            using (SqlConnection connection = new SqlConnection(cs))
            {
                connection.Open();
                string cmd = "select persid from usp_resolution_code where del = 0 and sym like 'Anulowane przez u_ytkownika'";
                SqlCommand sqlCommand = new SqlCommand(cmd, connection);
                object o = sqlCommand.ExecuteScalar();
                if (o != null)
                    rescode = o.ToString();
            }

            SDMWebServiceHelper helper = new SDMWebServiceHelper(wsurl, Helpers.GetSetting("CALogin", false), Helpers.GetSetting("CAPassword", true));
            helper.CancelReservation(persid, rescode, cancelAll);
        }

        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public List<MpkSearchResult> FindMpk(string searchstring)
        {
            List<MpkSearchResult> searchResults = new List<MpkSearchResult>();
            string cs = Helpers.GetSetting("sdmdb", true);
            using (SqlConnection connection = new SqlConnection(cs))
            {
                connection.Open();
                string cmd = "with mycte as ( select r.id, r.name, r.zcnt, r.zkod, r.zorg, o.org_name as namename, o.abbreviation as 'shortname', '' as 'shortname2' from ca_resource_cost_center r ";
                cmd += " left outer join usp_organization u on r.id = u.zmpk left outer join ca_organization o on u.organization_uuid = o.organization_uuid ";
                cmd += " union all ";
                cmd += " select r.id, r.name, r.zcnt, r.zkod, r.zorg, c.first_name +  ' ' + c.last_name as namename, '' as 'shortname', o.org_name as 'shortname2' from ca_resource_cost_center r ";
                cmd += " left outer join ca_contact c on r.id = c.cost_center ";
                cmd += " left outer join ca_organization o on c.organization_uuid = o.organization_uuid ) select id, name, namename, shortname, shortname2 from mycte where namename is not null ";
                cmd += string.Format(" and (shortname like N'%{0}%' OR namename like N'%{0}%' OR name like N'%{0}%')", searchstring);
                DataTable dt = new DataTable();
                SqlDataAdapter adapter = new SqlDataAdapter(cmd, connection);
                adapter.Fill(dt);
                
                foreach (DataRow row in dt.Rows)
                {
                    MpkSearchResult m = new MpkSearchResult();
                    m.id = row[0].ToString();
                    m.name = row[1].ToString();
                    m.namename = row[2].ToString();
                    m.shortname = row[3].ToString();
                    m.shortname2 = row[4].ToString();

                    searchResults.Add(m);
                }
            }

            return searchResults;
        }
    }
}