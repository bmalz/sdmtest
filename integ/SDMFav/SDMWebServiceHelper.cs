using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Xml;
using System.Xml.Linq;

namespace SDMFavService
{
    public class SDMWebServiceHelper
    {
        private SDMService.USD_WebService ws;
        private int SID;
        private string handle;

        public SDMWebServiceHelper(string wsurl, string UserName, string Password)
        {
            ws = new SDMService.USD_WebService();
            ws.Url = wsurl;

            SID = ws.login(UserName, Password);
            handle = ws.getHandleForUserid(SID, UserName);
        }

        //public void SetWebServiceURL(string URL)
        //{
        //    ws.Url = URL;
        //}

        /// <summary>
        /// Select objects from Service Desk Manager
        /// </summary>
        /// <param name="ObjectType">Type of Service Desk Manager object, example: pcat, cnt, cr, in etc.</param>
        /// <param name="Query">PDM where clause</param>
        /// <param name="MaxRows">Number of returning results</param>
        /// <param name="Attributes">Additional attributes</param>
        /// <returns>XML of results</returns>
        public string QuerySelect(string ObjectType, string Query, int MaxRows = -1, string[] Attributes = default(string[]))
        {
            var result = ws.doSelect(SID, ObjectType, Query, MaxRows, Attributes);

            return result.ToString();
        }

        /// <summary>
        /// Update selected object
        /// </summary>
        /// <param name="SelectResult">XML of result (return from QuerySelect)</param>
        /// <param name="AttributesValues">Array of attributes to update. Schema: Name1, Value1, Name2, Value2...</param>
        /// <param name="Attributes">Additional attributes</param>
        /// <returns>Result of update</returns>
        public string QueryUpdate(string SelectResult, string[] AttributesValues, string[] Attributes = default(string[]))
        {
            XmlDocument XMLDoc = new XmlDocument();
            XmlNodeList XMLHandle = default(XmlNodeList);
            string XMLResult = string.Empty;

            XMLDoc.LoadXml(SelectResult);
            XMLHandle = XMLDoc.GetElementsByTagName("Handle");
            XMLResult = XMLHandle[0].InnerText;

            return ws.updateObject(SID, XMLResult, AttributesValues, Attributes);
        }

        /// <summary>
        /// Add new object
        /// </summary>
        /// <param name="ObjectType">Type of Service Desk Manager object, example: pcat, cnt, cr, in etc.</param>
        /// <param name="AttributesValues">Array of attributes to update. Schema: Name1, Value1, Name2, Value2...</param>
        /// <param name="Attributes">Additional attributes</param>
        public void QueryAdd(string ObjectType, string[] AttributesValues, string[] Attributes = default(string[]))
        {
            string handleN = "";
            string createObectResult = "";
            ws.createObject(SID, ObjectType, AttributesValues, Attributes, ref createObectResult, ref handleN);
        }

        public void CreateRequest(string pcat, string userPersistentId, string roomUuid, string start, string end, string mpk, string katering, string roomName,
            string desc, string isrec, string recrule, string kateringDodatkoweInfo, string kateringDostawa, string iloscOsob)
        {
            List<string> updateAttrVals = new List<string>();

            updateAttrVals.Add("zisRoomReservation");
            updateAttrVals.Add("1");
            updateAttrVals.Add("zkatering");
            updateAttrVals.Add(katering);

            string masterRequestHandle = string.Empty;

            //jesli jest cykliczne, utworz zgloszenie master i dopnij kazde zgloszneie pod to
            if (isrec.Equals("True"))
            {
                updateAttrVals.Add("zisRecurrenceReservation");
                updateAttrVals.Add("1");
                masterRequestHandle = CreateMasterRequest(updateAttrVals, pcat, roomName, desc, userPersistentId, roomUuid, start, end);
                System.Threading.Thread.Sleep(1000);
            }

            List<ReservationObject> reservationList = getReservationsBasedOnReccurence(start, end, isrec, recrule);
            
            foreach (ReservationObject r in reservationList)
            {
                List<string> attrVals = new List<string>();
                string[] tmp_attrVals = new string[] { "category", pcat, "status", "crs:5200", "summary", "Rezerwacja sali " + roomName, "description", desc, "type", "crt:180", "assignee", userPersistentId.Replace("cnt", "agt"), "customer", userPersistentId, "affected_resource", "nr:" + roomUuid };
                attrVals.AddRange(tmp_attrVals);

                string[] propVals = new string[] { };
                string[] attrs = new string[] { "persistent_id" };
                string requestHandle = string.Empty;
                string requestNumber = string.Empty;

                if (!string.IsNullOrEmpty(masterRequestHandle))
                {
                    attrVals.Add("parent");
                    attrVals.Add(masterRequestHandle);
                }

                ws.createRequest(SID, handle, attrVals.ToArray(), propVals, "", attrs, ref requestHandle, ref requestNumber);
                System.Threading.Thread.Sleep(1000);
                ws.updateObject(SID, requestHandle, updateAttrVals.ToArray(), new string[] { "persistent_id" });
                System.Threading.Thread.Sleep(1000);
                string whereClause = string.Format("owning_cr = '{0}'", requestHandle);
                string crProperties = ws.doSelect(SID, "cr_prp", whereClause, 100, new string[] { "label" });
                XDocument xDoc = XDocument.Parse(crProperties);

                string labelStart = ConfigurationManager.AppSettings["LabelStart"];
                string labelEnd = ConfigurationManager.AppSettings["LabelEnd"];
                string labelCatAddInfo = ConfigurationManager.AppSettings["LabelCateringInfo"];
                string labelDeliveryTime = ConfigurationManager.AppSettings["LabelCateringDelivery"];
                string labelPersonCount = ConfigurationManager.AppSettings["LabelPersonCount"];

                foreach (XElement element in xDoc.Descendants("UDSObject"))
                {
                    string propertyHandle = element.Element("Handle").Value;
                    string propertyName = element.Element("Attributes").Element("Attribute").Element("AttrValue").Value;

                    if (propertyName.Equals(labelStart))
                    {
                        ws.updateObject(SID, propertyHandle, new string[] { "value", r.DateStart }, new string[] { "persistent_id" });
                    }
                    else if (propertyName.Equals(labelEnd))
                    {
                        ws.updateObject(SID, propertyHandle, new string[] { "value", r.DateEnd }, new string[] { "persistent_id" });
                    }
                    else if (propertyName.Equals(labelCatAddInfo))
                    {
                        ws.updateObject(SID, propertyHandle, new string[] { "value", kateringDodatkoweInfo }, new string[] { "persistent_id" });
                    }
                    else if (propertyName.Equals(labelDeliveryTime))
                    {
                        ws.updateObject(SID, propertyHandle, new string[] { "value", kateringDostawa }, new string[] { "persistent_id" });
                    }
                    else if (propertyName.Equals(labelPersonCount))
                    {
                        ws.updateObject(SID, propertyHandle, new string[] { "value", iloscOsob }, new string[] { "persistent_id" });
                    }

                    System.Threading.Thread.Sleep(1000);
                }
                System.Threading.Thread.Sleep(1000);
            }
        }

        private string CreateMasterRequest(List<string> updateAttrVals, string pcat, string roomName, string desc, string userPersistentId, string roomUuid, string start, string end)
        {
            string requestHandle = string.Empty;
            string requestNumber = string.Empty;

            List<string> masterUpdateAttrVals = new List<string>();
            masterUpdateAttrVals.AddRange(updateAttrVals);

            string[] attrVals = new string[] { "category", pcat, "status", "crs:5200", "summary", "Cykliczna rezerwacja sali " + roomName + " od " + start + " do " + end, "description", desc, "type", "crt:180", "assignee", userPersistentId.Replace("cnt", "agt"), "customer", userPersistentId, "affected_resource", "nr:" + roomUuid };
            string[] propVals = new string[] { };
            string[] attrs = new string[] { "persistent_id" };

            ws.createRequest(SID, handle, attrVals, propVals, "", attrs, ref requestHandle, ref requestNumber);
            System.Threading.Thread.Sleep(1000);
            ws.updateObject(SID, requestHandle, masterUpdateAttrVals.ToArray(), new string[] { "persistent_id" });
            System.Threading.Thread.Sleep(1000);

            return requestHandle;
        }

        private List<ReservationObject> getReservationsBasedOnReccurence(string start, string end, string isrec, string recrule)
        {
            List<ReservationObject> list = new List<ReservationObject>();
            
            if (isrec.ToLower().Equals("true"))
            {
                if (!string.IsNullOrEmpty(recrule))
                {
                    string[] rules = recrule.Split(':');
                    if (rules.Length > 0)
                    {
                        DateTime ds = DateTime.ParseExact(start, "yyyy-MM-dd HH:mm", System.Globalization.CultureInfo.InvariantCulture);
                        DateTime de = DateTime.ParseExact(end, "yyyy-MM-dd HH:mm", System.Globalization.CultureInfo.InvariantCulture);
                        string sOccurences = rules[1];
                        if (rules[0] == "D")
                        {
                            if (rules[2] == "N") //ustawiono koniec cyklu na nigdy, data graniczna musi byc data end
                            {
                                createReservationObjectsWithoutEndDate(list, ds, sOccurences, de);
                            }
                            else if (rules[2] == "A") //ustawiono koniec cyklu na iles wystapien
                            {
                                createReservationObjectsStopAfter(list, rules, ds, sOccurences, de);
                            }
                            else if (rules[2] == "O") //ustawiono koniec cyklu na date
                            {
                                createReservationObjectsStopOn(list, rules, ds, sOccurences, de);
                            }
                        }
                        else if (rules[0] == "W")
                        {
                            List<DayOfWeek> dow = new List<DayOfWeek>();
                            string[] tmpdays = rules[2].Split(',');
                            foreach (string s in tmpdays)
                            {
                                if (s.Equals("pon"))
                                    dow.Add(DayOfWeek.Monday);
                                if (s.Equals("wt"))
                                    dow.Add(DayOfWeek.Tuesday);
                                if (s.Equals("śr"))
                                    dow.Add(DayOfWeek.Wednesday);
                                if(s.Equals("czw"))
                                    dow.Add(DayOfWeek.Thursday);
                                if(s.Equals("pt"))
                                    dow.Add( DayOfWeek.Friday);
                                if(s.Equals("sb"))
                                    dow.Add(DayOfWeek.Saturday);
                                if(s.Equals("nd"))
                                    dow.Add(DayOfWeek.Sunday);
                            }

                            int daysToAdd = 7 * int.Parse(sOccurences);
                            if (rules[3] == "N")
                            {
                                createWeeklyReservationOnjectsWithoutEnd(list, ds, de, dow, daysToAdd, de);
                            }
                            else if (rules[3] == "A")
                            {
                                createWeeklyReservationObjectsStopAfter(list, rules, ds, de, dow, daysToAdd);
                            }
                            else if (rules[4] == "O")
                            {
                                createWeeklyReservationObjectsStopOn(list, rules, ds, de, dow, daysToAdd);
                            }
                        }
                        else if (rules[0] == "M")
                        {
                            int occurences = int.Parse(sOccurences);
                            int dayOfMonth = int.Parse(rules[2]);
                            DateTime tempDs = DateTime.Now;
                            if(dayOfMonth > ds.Day)
                                tempDs = new DateTime(ds.Year, ds.Month, dayOfMonth, ds.Hour, ds.Minute, 0);
                            else
                                tempDs = new DateTime(ds.Year, ds.Month, dayOfMonth, ds.Hour, ds.Minute, 0).AddMonths(occurences);

                            if (rules[3] == "N")
                            {
                                createMonthlyReservationObjectWithoutEnd(list, de, occurences, tempDs);
                            }
                            else if (rules[3] == "A")
                            {
                                createMonthlyReservationObjectEndAfter(list, rules, de, occurences, tempDs);
                            }
                            else if (rules[3] == "O")
                            {
                                createMonthlyReservationObjectStopOn(list, rules, de, occurences, tempDs);
                            }
                        }
                    }
                }
            }
            else
                list.Add(new ReservationObject() { DateStart = start, DateEnd = end });

            return list;
        }

        private static void createMonthlyReservationObjectStopOn(List<ReservationObject> list, string[] rules, DateTime de, int occurences, DateTime tempDs)
        {
            DateTime endOn = DateTime.ParseExact(rules[4], "yyyy-MM-dd HH:mm", System.Globalization.CultureInfo.InvariantCulture);
            do
            {
                DateTime t_start = new DateTime(tempDs.Year, tempDs.Month, tempDs.Day, tempDs.Hour, tempDs.Minute, 0);
                DateTime t_end = new DateTime(tempDs.Year, tempDs.Month, tempDs.Day, de.Hour, de.Minute, 0);
                ReservationObject r = new ReservationObject();
                r.DateStart = t_start.ToString("yyyy-MM-dd HH:mm");
                r.DateEnd = t_end.ToString("yyyy-MM-dd HH:mm");
                list.Add(r);
                tempDs = tempDs.AddMonths(occurences);
            }
            while (tempDs <= endOn);
        }

        private static void createMonthlyReservationObjectEndAfter(List<ReservationObject> list, string[] rules, DateTime de, int occurences, DateTime tempDs)
        {
            int stopAfter = int.Parse(rules[4]);
            int count = 0;

            do
            {
                if (count < stopAfter)
                {
                    DateTime t_start = new DateTime(tempDs.Year, tempDs.Month, tempDs.Day, tempDs.Hour, tempDs.Minute, 0);
                    DateTime t_end = new DateTime(tempDs.Year, tempDs.Month, tempDs.Day, de.Hour, de.Minute, 0);
                    ReservationObject r = new ReservationObject();
                    r.DateStart = t_start.ToString("yyyy-MM-dd HH:mm");
                    r.DateEnd = t_end.ToString("yyyy-MM-dd HH:mm");
                    list.Add(r);
                    count++;
                    tempDs = tempDs.AddMonths(occurences);
                }
                else
                {
                    break;
                }
            }
            while (tempDs <= de);
        }

        private static void createMonthlyReservationObjectWithoutEnd(List<ReservationObject> list, DateTime de, int occurences, DateTime tempDs)
        {
            do
            {
                DateTime t_start = new DateTime(tempDs.Year, tempDs.Month, tempDs.Day, tempDs.Hour, tempDs.Minute, 0);
                DateTime t_end = new DateTime(tempDs.Year, tempDs.Month, tempDs.Day, de.Hour, de.Minute, 0);
                ReservationObject r = new ReservationObject();
                r.DateStart = t_start.ToString("yyyy-MM-dd HH:mm");
                r.DateEnd = t_end.ToString("yyyy-MM-dd HH:mm");
                list.Add(r);

                tempDs = tempDs.AddMonths(occurences);
            }
            while (tempDs <= de);
        }

        private static void createWeeklyReservationObjectsStopOn(List<ReservationObject> list, string[] rules, DateTime ds, DateTime de, List<DayOfWeek> dow, int daysToAdd)
        {
            DateTime stopDate = DateTime.ParseExact(rules[3], "yyyy-MM-dd HH:mm", System.Globalization.CultureInfo.InvariantCulture);
            DateTime tempDs = ds;
            DateTime tempDe = ds.AddDays(daysToAdd);
            do
            {
                if (tempDs < stopDate)
                {
                    int numberOfDays = tempDe.Subtract(tempDs).Days + 1;
                    var dates = Enumerable.Range(0, numberOfDays)
                                          .Select(i => tempDs.AddDays(i))
                                          .Where(d => dow.ToArray().Contains(d.DayOfWeek));

                    foreach (DateTime d in dates)
                    {
                        DateTime d_start = new DateTime(d.Year, d.Month, d.Day, ds.Hour, ds.Minute, 0);
                        DateTime d_end = new DateTime(d.Year, d.Month, d.Day, de.Hour, de.Minute, 0);

                        ReservationObject r = new ReservationObject();
                        r.DateStart = d_start.ToString("yyyy-MM-dd HH:mm");
                        r.DateEnd = d_end.ToString("yyyy-MM-dd HH:mm");
                        list.Add(r);
                    }

                    tempDs = tempDs.AddDays(daysToAdd);
                    tempDe = tempDe.AddDays(daysToAdd);
                }
                else
                {
                    break;
                }
            }
            while (tempDs <= de);
        }

        private static void createWeeklyReservationObjectsStopAfter(List<ReservationObject> list, string[] rules, DateTime ds, DateTime de, List<DayOfWeek> dow, int daysToAdd)
        {
            int stopAfter = int.Parse(rules[4]);
            int count = 0;

            DateTime tempDs = ds;
            DateTime tempDe = ds.AddDays(daysToAdd);
            do
            {
                if (count < stopAfter)
                {
                    int numberOfDays = tempDe.Subtract(tempDs).Days + 1;
                    var dates = Enumerable.Range(0, numberOfDays)
                                          .Select(i => tempDs.AddDays(i))
                                          .Where(d => dow.ToArray().Contains(d.DayOfWeek));

                    foreach (DateTime d in dates)
                    {
                        DateTime d_start = new DateTime(d.Year, d.Month, d.Day, ds.Hour, ds.Minute, 0);
                        DateTime d_end = new DateTime(d.Year, d.Month, d.Day, de.Hour, de.Minute, 0);

                        ReservationObject r = new ReservationObject();
                        r.DateStart = d_start.ToString("yyyy-MM-dd HH:mm");
                        r.DateEnd = d_end.ToString("yyyy-MM-dd HH:mm");
                        list.Add(r);
                    }

                    tempDs = tempDs.AddDays(daysToAdd);
                    tempDe = tempDe.AddDays(daysToAdd);
                    count++;
                }
                else
                {
                    break;
                }
            }
            while (tempDs <= tempDe);
        }

        private static void createWeeklyReservationOnjectsWithoutEnd(List<ReservationObject> list, DateTime ds, DateTime de, List<DayOfWeek> dow, int daysToAdd, DateTime end)
        {
            DateTime tempDs = ds;
            DateTime tempDe = ds.AddDays(daysToAdd);
            do
            {
                int numberOfDays = tempDe.Subtract(tempDs).Days + 1;
                var dates = Enumerable.Range(0, numberOfDays)
                                      .Select(i => tempDs.AddDays(i))
                                      .Where(d => dow.ToArray().Contains(d.DayOfWeek));

                foreach (DateTime d in dates)
                {
                    DateTime d_start = new DateTime(d.Year, d.Month, d.Day, ds.Hour, ds.Minute, 0);
                    DateTime d_end = new DateTime(d.Year, d.Month, d.Day, de.Hour, de.Minute, 0);

                    if (d_end <= end)
                    {
                        ReservationObject r = new ReservationObject();
                        r.DateStart = d_start.ToString("yyyy-MM-dd HH:mm");
                        r.DateEnd = d_end.ToString("yyyy-MM-dd HH:mm");
                        list.Add(r);
                    }
                    else
                    {
                        break;
                    }
                }

                tempDs = tempDs.AddDays(daysToAdd); // tempDe;
                tempDe = tempDe.AddDays(daysToAdd);
            }
            while (tempDs <= end);
        }

        private static void createReservationObjectsStopOn(List<ReservationObject> list, string[] rules, DateTime ds, string sOccurences, DateTime end)
        {
            DateTime stopDate = DateTime.ParseExact(rules[3], "yyyy-MM-dd HH:mm", System.Globalization.CultureInfo.InvariantCulture);
            int occurences = int.Parse(sOccurences);
            DateTime tempDs = ds;
            DateTime tempDe = new DateTime(ds.Year, ds.Month, ds.Day, end.Hour, end.Minute, 0);
            do
            {
                ReservationObject r = new ReservationObject();
                r.DateStart = tempDs.ToString("yyyy-MM-dd HH:mm");
                r.DateEnd = tempDe.ToString("yyyy-MM-dd HH:mm");
                list.Add(r);
                    
                tempDs = tempDs.AddDays(occurences);
                tempDe = tempDe.AddDays(occurences);
            }
            while (tempDe <= stopDate);
        }

        private static void createReservationObjectsStopAfter(List<ReservationObject> list, string[] rules, DateTime ds, string sOccurences, DateTime end)
        {
            int stopAfter = int.Parse(rules[3]);
            int count = 0;
            int occurences = int.Parse(sOccurences);
            DateTime tempDs = ds;
            DateTime tempDe = new DateTime(ds.Year, ds.Month, ds.Day, end.Hour, end.Minute, 0);
            do
            {
                if (count < stopAfter)
                {
                    ReservationObject r = new ReservationObject();
                    r.DateStart = tempDs.ToString("yyyy-MM-dd HH:mm");
                    r.DateEnd = tempDe.ToString("yyyy-MM-dd HH:mm");
                    list.Add(r);
                    count++;

                    tempDs = tempDs.AddDays(occurences);
                    tempDe = tempDe.AddDays(occurences);
                }
                else
                {
                    break;
                }
            }
            while (tempDe <= end);
        }

        private static void createReservationObjectsWithoutEndDate(List<ReservationObject> list, DateTime ds, string sOccurences, DateTime end)
        {
            int occurences = int.Parse(sOccurences);
            DateTime tempDs = ds;
            DateTime tempDe = new DateTime(ds.Year, ds.Month, ds.Day, end.Hour, end.Minute, 0);
            do
            {
                ReservationObject r = new ReservationObject();
                r.DateStart = tempDs.ToString("yyyy-MM-dd HH:mm");
                r.DateEnd = tempDe.ToString("yyyy-MM-dd HH:mm");
                list.Add(r);

                tempDs = tempDs.AddDays(occurences);
                tempDe = tempDe.AddDays(occurences);
            }
            while (tempDe <= end);
        }

        public void CancelReservation(string persid, string rescode, string cancelAll)
        {
            List<string> fields = new List<string>();
            fields.Add("status");
            fields.Add("crs:5214");
            if (!string.IsNullOrEmpty(rescode))
            {
                fields.Add("resolution_code");
                fields.Add(rescode);
            }

            if (cancelAll.Equals("False"))
            {
                ws.updateObject(SID, persid, fields.ToArray(), new string[] { "persistent_id" });
            }
            else if (cancelAll.Equals("True"))
            {
                //znajdz parent
                //wylistuj wszystkie persid rezerwacji z parenta poczynajac od biezacej
                //anuluj w petli

                //
                List<string> requests_to_cancel = new List<string>();
                string cs = Helpers.GetSetting("sdmdb", true);
                using (SqlConnection connection = new SqlConnection(cs))
                {
                    connection.Open();
                    //krok 1 -czy to jest cr majacy rodzica? jesli tak zostana anulowane wszystkie cr wystepujace PO podanym persid
                    string cmd = string.Format("select persid from call_req where parent = (select parent from call_req where persid = '{0}') and convert(int, ref_num) >= (select CONVERT(int, ref_num) from call_req where persid = '{0}')", persid);
                    DataTable dt1 = new DataTable();
                    SqlDataAdapter adapter1 = new SqlDataAdapter(cmd, connection);
                    adapter1.Fill(dt1);
                    if (dt1.Rows.Count > 0)
                    {
                        requests_to_cancel.AddRange(dt1.AsEnumerable().Select( x=> x[0].ToString()));
                    }
                    else
                    {
                        //krok 2 - czy to jest master cr? jesli tak, zostana anulowane wszystkie cr wystepujace PO biezacej dacie
                        string cmd1 = string.Format("select c.persid, s.value, e.value from call_req c left outer join cr_prp s on c.persid = s.owning_cr and s.label = 'Data od' left outer join cr_prp e on c.persid = e.owning_cr and e.label = 'Data do' where c.parent = '{0}' and convert(datetime, s.value) >= GETDATE()", persid);
                        DataTable dt2 = new DataTable();
                        SqlDataAdapter adapter2 = new SqlDataAdapter(cmd1, connection);
                        adapter2.Fill(dt2);
                        if (dt2.Rows.Count > 0)
                        {
                            requests_to_cancel.AddRange(dt2.AsEnumerable().Select(x => x[0].ToString()));
                        }
                    }
                }

                foreach (string r in requests_to_cancel)
                {
                    ws.updateObject(SID, r, fields.ToArray(), new string[] { "persistent_id" });
                    System.Threading.Thread.Sleep(1000);
                }
            }
        }

        public void Logout()
        {
            if (SID != default(int))
                ws.logout(SID);
        }
    }

    class ReservationObject
    {
        public string DateStart { get; set; }
        public string DateEnd { get; set; }

        public ReservationObject() { }
    }
}