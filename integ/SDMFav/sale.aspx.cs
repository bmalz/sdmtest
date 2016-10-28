using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace SDMFavService
{
    public partial class sale : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            wsurl.Value = ConfigurationManager.AppSettings["WsUrl"].ToString();

            string firstName = Request.QueryString["exim_FirstName"];
            string middleName = Request.QueryString["exim_MiddleName"];
            string lastName = Request.QueryString["exim_LastName"];
            string persistentId = Request.QueryString["exim_persistent_id"];

            if (String.IsNullOrEmpty(lastName) || String.IsNullOrEmpty(persistentId))
            {
                //BAD REQUEST!
                Response.StatusDescription = "Błędne wywołanie systemu rezerwacji sal.";
                Response.StatusCode = 400;
                badreq.Value = "1";
            }
            else
            {
                usernameLabel.Text = String.Format("{0}, {1}", lastName, firstName);
                userImage.Attributes["title"] = getUserDetails(persistentId);
            }

            if (!IsPostBack)
            {
                bindDropDowns();
            }
        }

        private string getUserDetails(string persistentId)
        {
            string cs = Helpers.GetSetting("sdmdb", true);
            using (SqlConnection connection = new SqlConnection(cs))
            {
                connection.Open();
                string sql = string.Format("select c.pri_phone_number, c.alt_phone_number, o.abbreviation, cc.name from ca_contact c join ca_organization o on c.organization_uuid = o.organization_uuid left outer join ca_resource_cost_center cc on cc.id = c.cost_center where c.contact_uuid = {0}", persistentId.Split(' ')[0].Replace("cnt:", "0x"));
                DataTable dt = new DataTable();
                SqlDataAdapter adapter1 = new SqlDataAdapter(sql, connection);
                adapter1.Fill(dt);

                string result = string.Format("Jednostka org.: {0}\r\nNumer telefonu 1: {1}\r\nNumer telefonu 2: {2}", dt.Rows[0][2], dt.Rows[0][0], dt.Rows[0][1]);

                if(dt.Rows[0][3] != DBNull.Value)
                    selected_mpk.Text = dt.Rows[0][3].ToString();

                return result;
            }
        }

        private void bindDropDowns()
        {
            kateringBox.Items.Clear();

            //kateringBox.Items.Add(new ListItem("Brak", "400001"));
            //kateringBox.Items.Add(new ListItem("Kawa i herbata", "400002"));
            //kateringBox.Items.Add(new ListItem("Stół szwedzki", "400003"));
            //kateringBox.Items.Add(new ListItem("Bankiet", "400004"));

            kateringBox.DataSource = doSelect("select id, ex_name from zrodzaj_kateringu");
            kateringBox.DataTextField = "ex_name";
            kateringBox.DataValueField = "id";
            kateringBox.DataBind();
        }

        private DataTable doSelect(string cmd)
        {
            DataTable dt = new DataTable();
            string cs = ConfigurationManager.AppSettings["sdmdb"];
            using (SqlConnection connection = new SqlConnection(Helpers.Decrypt(cs)))
            {
                connection.Open();
                using (SqlDataAdapter adapter = new SqlDataAdapter(cmd, connection))
                {
                    adapter.Fill(dt);
                }
            }

            return dt;
        }

        //public static void MakeAccessible(GridView grid)
        //{
        //    if (grid.Rows.Count <= 0) return;
        //    grid.UseAccessibleHeader = true;
        //    grid.HeaderRow.TableSection = TableRowSection.TableHeader;
        //    if (grid.ShowFooter)
        //        grid.FooterRow.TableSection = TableRowSection.TableFooter;
        //}
    }
}