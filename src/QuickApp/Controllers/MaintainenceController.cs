using System;
using System.Web;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Data.SqlClient;
using System.Net.Http;
using System.Web.Http;
using System.IO;
using Microsoft.AspNetCore.Http;
using System.Threading;
using System.Net.Http.Headers;
using Microsoft.Extensions.Configuration;
using System.Reflection;
using PatrolWebApp.Controllers;
using Npgsql;



namespace PatrolWebApp.Controllers
{
    public class devicecls
    {
        public int deviceid { get; set; }
        public string devicenumber { get; set; }

        public int ahwalid { get; set; }

        public string model { get; set; }
        public int devicetypeid { get; set; }

        public int defective { get; set; }

        public int rental { get; set; }

        public string barcode { get; set; }
    }

    public class patrolcarcls
    {
        public int patrolid { get; set; }
        public string platenumber { get; set; }
        public int ahwalid { get; set; }
        public string model { get; set; }
        public string typecode { get; set; }
        public string type { get; set; }
        public int defective { get; set; }
        public int rental { get; set; }
        public string barcode { get; set; }
        public string vinnumber { get; set; }
    }

    public class handheldcls
    {
        public int handheldid { get; set; }
        public string serial { get; set; }
        public int ahwalid { get; set; }

        public int defective { get; set; }

        public string barcode { get; set; }
    }

    public class ahwalmapping
    {
        public int ahwalid { get; set; }
        public int sectorid { get; set; }
        public int citygroupid { get; set; }
        public int shiftid { get; set; }
        public int patrolroleid { get; set; }
        public int personid { get; set; }
        public int ahwalmappingid { get; set; }

    }

  

    [Route("api/[controller]")]
    public class MaintainenceController : Controller
    {

        // public String constr2 = "Server=BCI666016PC57;Database=patrols;User Id =patrol;Password=patrol;";
        // public String constr = "server=10.2.124.40;Port=5432;User Id=postgres;password=admin;Database=Patrols";
        // public String constr = "server=10.2.124.32;Port=5432;User Id=postgres;password=123456;Database=Patrols";
        public String constr = "server=localhost;Port=5432;User Id=postgres;password=admin;Database=Patrols";


        [HttpPost("addpatrolcar")]
        public int PostAddPatrolCar([FromBody]patrolcarcls frm)
        {
            int ret = 0;
            NpgsqlConnection cont = new NpgsqlConnection();
            cont.ConnectionString = constr;
            cont.Open();
            NpgsqlCommand cmd = new NpgsqlCommand();
            cmd.Connection = cont;
            cmd.CommandText = "insert into patrolcars(AhwalID,platenumber,model,typecode,defective,rental,barcode,vinnumber) values (" + frm.ahwalid + ",'" + frm.platenumber + "','" + frm.model + "','" + frm.typecode + "'," + frm.defective + "," + frm.rental + ",'" + frm.barcode + "','" + frm.vinnumber + "')";
            ret = cmd.ExecuteNonQuery();
            cont.Close();
            cont.Dispose();


            return ret;
        }

        [HttpPost("updatepatrolcar")]
        public int PostUpdatePatrolCar([FromBody] patrolcarcls frm)
        {
            int ret = 0;
            NpgsqlConnection cont = new NpgsqlConnection();
            cont.ConnectionString = constr;
            cont.Open();
            NpgsqlCommand cmd = new NpgsqlCommand();
            cmd.Connection = cont;
            cmd.CommandText = "update patrolcars set AhwalID = " + frm.ahwalid + ",platenumber = '" + frm.platenumber + "',model = '" + frm.model + "',typecode='" + frm.typecode + "',defective = " + frm.defective + ",rental = " + frm.rental + ",barcode = '" + frm.barcode + "',vinnumber='" + frm.vinnumber + "' where patrolid=" + frm.patrolid;
            ret = cmd.ExecuteNonQuery();
            cont.Close();
            cont.Dispose();


            return ret;
        }


        [HttpPost("delpatrolcar")]
        public int PostDeletePatrolCar([FromBody] patrolcarcls frm)
        {
            int ret = 0;
            NpgsqlConnection cont = new NpgsqlConnection();
            cont.ConnectionString = constr;
            cont.Open();
            NpgsqlCommand cmd = new NpgsqlCommand();
            cmd.Connection = cont;
            cmd.CommandText = "update patrolcars set delflag='1' where patrolid=" + frm.patrolid;
            ret = cmd.ExecuteNonQuery();
            cont.Close();
            cont.Dispose();
            return ret;
        }




        [HttpPost("patrolcarslist")]
        public DataTable PostDevicesList2([FromBody] int ahwalid)
        {
            // int ahwalid = Convert.ToInt32(obj.Split(";")[0]);
            //int userid = Convert.ToInt32(obj.Split(";")[1]);
            NpgsqlConnection cont = new NpgsqlConnection();
            cont.ConnectionString = constr;
            cont.Open();
            DataTable dt = new DataTable();
            string subqry = "";
            subqry = " and d.ahwalid in (select ahwalid from UsersRolesMap where UserID=6)";
            if (ahwalid != -1)
            {
                subqry = subqry + " and d.ahwalid = " + ahwalid;
            }
            NpgsqlDataAdapter da = new NpgsqlDataAdapter("select (select a.name from ahwal a where  a.ahwalid = d.ahwalid) ahwalname, d.patrolid,d.plateNumber,d.Model,(select codedesc from codemaster where code = typecode)  as type,typecode,d.Defective,d.Rental,d.BarCode,vinnumber from patrolcars d where d.delflag is null  " + subqry, cont);
            da.Fill(dt);
            cont.Close();
            cont.Dispose();
            return dt;
        }

        [HttpGet("roleslist")]
        public DataTable GetRolesList()
        {
            // int ahwalid = Convert.ToInt32(obj.Split(";")[0]);
            //int userid = Convert.ToInt32(obj.Split(";")[1]);
            NpgsqlConnection cont = new NpgsqlConnection();
            cont.ConnectionString = constr;
            cont.Open();
            DataTable dt = new DataTable();

            NpgsqlDataAdapter da = new NpgsqlDataAdapter("SELECT PatrolRoleID, Name FROM PatrolRoles", cont);
            da.Fill(dt);
            cont.Close();
            cont.Dispose();
            return dt;
        }

        [HttpGet("shiftslist")]
        public DataTable GetShiftsList()
        {

            NpgsqlConnection cont = new NpgsqlConnection();
            cont.ConnectionString = constr;
            cont.Open();
            DataTable dt = new DataTable();

            NpgsqlDataAdapter da = new NpgsqlDataAdapter("SELECT ShiftID, Name, StartingHour, NumberOfHours FROM Shifts", cont);
            da.Fill(dt);
            cont.Close();
            cont.Dispose();
            return dt;
        }

        [HttpGet("sectorslist")]
        public DataTable GetSectorsList(int userid)
        {

            NpgsqlConnection cont = new NpgsqlConnection();
            cont.ConnectionString = constr;
            cont.Open();
            DataTable dt = new DataTable();

            NpgsqlDataAdapter da = new NpgsqlDataAdapter("SELECT SectorID, ShortName, CallerPrefix, Disabled FROM Sectors where Disabled<>1  and (AhwalID IN (SELECT AhwalID FROM UsersRolesMap WHERE (UserID = " + userid + ") ))", cont);
            da.Fill(dt);
            cont.Close();
            cont.Dispose();
            return dt;
        }

        [HttpGet("citylist")]
        public DataTable GetCityList(int userid,int sectorid)
        {

            NpgsqlConnection cont = new NpgsqlConnection();
            cont.ConnectionString = constr;
            cont.Open();
            DataTable dt = new DataTable();

            NpgsqlDataAdapter da = new NpgsqlDataAdapter("SELECT CityGroupID ,  ShortName ,  CallerPrefix ,  Disabled  FROM  CityGroups  where Disabled<>1 and CallerPreFix<>'0' and SectorID=" + sectorid + " and  (AhwalID IN (SELECT AhwalID FROM UsersRolesMap WHERE (UserID = " + userid + ")))", cont);
            da.Fill(dt);
            cont.Close();
            cont.Dispose();
            return dt;
        }

        [HttpGet("associatelist")]
        public DataTable GetAssociateList(int userid)
        {

            NpgsqlConnection cont = new NpgsqlConnection();
            cont.ConnectionString = constr;
            cont.Open();
            DataTable dt = new DataTable();

            NpgsqlDataAdapter da = new NpgsqlDataAdapter("SELECT AhwalMapping.AhwalMappingID, Persons.PersonID, Persons.MilNumber, Persons.Name FROM AhwalMapping INNER JOIN Persons ON AhwalMapping.PersonID = Persons.PersonID WHERE (AhwalMapping.PatrolRoleID <> 70) AND(AhwalMapping.AhwalID IN (SELECT AhwalMapping.AhwalID FROM UsersRolesMap WHERE (UserID = " + userid + ") ))", cont);
            da.Fill(dt);
            cont.Close();
            cont.Dispose();
            return dt;
        }


        [HttpGet("PersonForUserForRole")]
        public DataTable GetPersonForUserForRole(int mno,int userid)
        {

            NpgsqlConnection cont = new NpgsqlConnection();
            cont.ConnectionString = constr;
            cont.Open();
            DataTable dt = new DataTable();

            NpgsqlDataAdapter da = new NpgsqlDataAdapter("SELECT PersonID, AhwalID, Name, MilNumber FROM Persons WHERE AhwalID IN (SELECT AhwalID FROM UsersRolesMap WHERE UserID = " + userid + " ) and MilNumber = " + mno, cont);
            da.Fill(dt);
            cont.Close();
            cont.Dispose();
            return dt;
        }

        [HttpGet("personslist")]
        public DataTable GetPersonsList(int userid)
        {

            NpgsqlConnection cont = new NpgsqlConnection();
            cont.ConnectionString = constr;
            cont.Open();
            DataTable dt = new DataTable();

            NpgsqlDataAdapter da = new NpgsqlDataAdapter("SELECT PersonID, AhwalID, Name, MilNumber FROM Persons WHERE AhwalID IN (SELECT AhwalID FROM UsersRolesMap WHERE UserID = " + userid + " )", cont);
            da.Fill(dt);
            cont.Close();
            cont.Dispose();
            return dt;
        }

        [HttpGet("patrolcarsinventory")]
        public DataTable PostPatrolCarsInventoryList(int ahwalid, int userid)
        {

            string subqry = "";

            if (ahwalid != -1)
            {
                subqry = subqry + " and Ahwal.AhwalID = " + ahwalid;
            }

            NpgsqlConnection cont = new NpgsqlConnection();
            cont.ConnectionString = constr;
            cont.Open();
            DataTable dt = new DataTable();
            string Qry = "SELECT        patrolcheckinoutid, CheckInOutStates.Name AS StateName, Ahwal.AhwalID, Ahwal.Name AS AhwalName, patrolcars.platenumber, patrolcars.Model,'' as Type, Persons.MilNumber, ";
            Qry = Qry + " Ranks.Name AS PersonRank, Persons.Name AS PersonName, patrolCheckInOut.timestamp, CheckInOutStates.CheckInOutStateID";

            Qry = Qry + "  FROM Ahwal INNER JOIN";

            Qry = Qry + " patrolcars  ON Ahwal.AhwalID = patrolcars.AhwalID INNER JOIN";

            Qry = Qry + " patrolCheckInOut ON patrolcars.patrolID = patrolCheckInOut.patrolID INNER JOIN";

            Qry = Qry + " CheckInOutStates ON patrolCheckInOut.CheckInOutStateID = CheckInOutStates.CheckInOutStateID INNER JOIN";

            Qry = Qry + " Persons ON Ahwal.AhwalID = Persons.AhwalID AND patrolCheckInOut.PersonID = Persons.PersonID INNER JOIN";

            Qry = Qry + " Ranks ON Persons.RankID = Ranks.RankID";
            Qry = Qry + " where Ahwal.AhwalID IN (SELECT AhwalID FROM UsersRolesMap WHERE UserID = " + userid + " ) ";
            Qry = Qry + subqry;
            Qry = Qry + "  ORDER BY patrolCheckInOut.timestamp";

            NpgsqlDataAdapter da = new NpgsqlDataAdapter(Qry, cont);
            dt.Columns.Add("patrolcheckinoutid");
            dt.Columns.Add("statename");
            dt.Columns.Add("ahwalid");
            dt.Columns.Add("ahwalname");
            dt.Columns.Add("platenumber");
            dt.Columns.Add("model");

            dt.Columns.Add("type");
            dt.Columns.Add("milnumber");
            dt.Columns.Add("personrank");
            dt.Columns.Add("personname");
            dt.Columns.Add("timestamp");
            dt.Columns.Add("checkinoutstateid");
            da.Fill(dt);
            cont.Close();
            cont.Dispose();


            return dt;
        }


        [HttpPost("dispatchlist")]
        public DataTable Postdispatchlist()
        {


            NpgsqlConnection cont = new NpgsqlConnection();
            cont.ConnectionString = constr;
            cont.Open();
            DataTable dt = new DataTable();
            String Qry = "SELECT AhwalMappingID, AhwalID, ShiftID, SectorID, PatrolRoleID, CityGroupID,(Select MilNumber From Persons where PersonID = AhwalMapping.PersonID) as MilNumber,";
            Qry = Qry + " (Select RankID From Persons where PersonID = AhwalMapping.PersonID) as RankID, (Select Name From Persons where PersonID = AhwalMapping.PersonID) as PersonName, CallerID,  ";
            Qry = Qry + " HasDevices, '' as Serial,  (Select plateNumber From patrolcars where patrolid = AhwalMapping.patrolid) as PlateNumber, ";
            Qry = Qry + " PatrolPersonStateID, SunRiseTimeStamp, SunSetTimeStamp, SortingIndex,(Select Mobile From Persons where PersonID = AhwalMapping.PersonID) as PersonMobile,IncidentID,";
            Qry = Qry + " LastStateChangeTimeStamp,(Select ShortName From sectors where SectorID=AhwalMapping.SectorID) as SectorDesc , (Select (select Name from Ranks where rankid = persons.rankid) From Persons where PersonID=AhwalMapping.PersonID) as RankDesc,(SELECT  Name FROM PatrolPersonStates PS ";
            Qry = Qry + " where PS.PatrolPersonStateID in (select PatrolPersonStateID from PatrolPersonStateLog where PatrolPersonStateLog.PersonID = AhwalMapping.PersonID ";

            Qry = Qry + " order by TimeStamp desc  FETCH FIRST ROW ONLY ) ) as PersonState FROM AhwalMapping ";

            NpgsqlDataAdapter da = new NpgsqlDataAdapter(Qry, cont);
            da.Fill(dt);
            cont.Close();
            cont.Dispose();


            return dt;
        }

        [HttpPost("organizationlist")]
        public DataTable PostOrganizationList([FromBody] int userid)
        {
            NpgsqlConnection cont = new NpgsqlConnection();
            cont.ConnectionString = constr;
            cont.Open();
            DataTable dt = new DataTable();
            String Qry = "select '-1'  as value,'' as text  union all SELECT ahwalid as value, name as text FROM Ahwal where ahwalid in (select ahwalid from usersrolesmap where userid = " + userid + ")";

            NpgsqlDataAdapter da = new NpgsqlDataAdapter(Qry, cont);
            da.Fill(dt);
            cont.Close();
            cont.Dispose();

            return dt;
        }


        [HttpPost("checkuser")]
        public DataTable PostCheckUser()
        {
            NpgsqlConnection cont = new NpgsqlConnection();
            cont.ConnectionString = constr;
            cont.Open();
            DataTable dt = new DataTable();
            String Qry = "SELECT ahwalid as value, name as text FROM Ahwal ";

            NpgsqlDataAdapter da = new NpgsqlDataAdapter(Qry, cont);
            da.Fill(dt);
            cont.Close();
            cont.Dispose();

            return dt;
        }

        [HttpPost("patrolcartypes")]
        public DataTable Postdevicetyplist()
        {
            NpgsqlConnection cont = new NpgsqlConnection();
            cont.ConnectionString = constr;
            cont.Open();
            DataTable dt = new DataTable();
            String Qry = "select 'xx'  as value,'' as text  union all SELECT code as value, codedesc as text FROM codemaster";

            NpgsqlDataAdapter da = new NpgsqlDataAdapter(Qry, cont);
            da.Fill(dt);

            cont.Close();
            cont.Dispose();

            return dt;
        }

        /*Hand Helds*/
        #region Hand Helds
        [HttpPost("addhandheld")]
        public int PostAddHandhelds([FromBody]handheldcls frm)
        {
            int ret = 0;
            NpgsqlConnection cont = new NpgsqlConnection();
            cont.ConnectionString = constr;
            cont.Open();
            NpgsqlCommand cmd = new NpgsqlCommand();
            cmd.Connection = cont;
            cmd.CommandText = "insert into handhelds(AhwalID,serial,defective,barcode) values (" + frm.ahwalid + ",'" + frm.serial + "'," + frm.defective + ",'" + frm.barcode + "')";
            ret = cmd.ExecuteNonQuery();
            cont.Close();
            cont.Dispose();


            return ret;
        }

        [HttpPost("updatehandheld")]
        public int PostUpdateHandhelds([FromBody] handheldcls frm)
        {
            int ret = 0;
            NpgsqlConnection cont = new NpgsqlConnection();
            cont.ConnectionString = constr;
            cont.Open();
            NpgsqlCommand cmd = new NpgsqlCommand();
            cmd.Connection = cont;
            cmd.CommandText = "update handhelds set AhwalID = " + frm.ahwalid + ",serial = '" + frm.serial + "',defective = " + frm.defective + ",barcode = '" + frm.barcode + "' where handheldid=" + frm.handheldid;
            ret = cmd.ExecuteNonQuery();
            cont.Close();
            cont.Dispose();


            return ret;
        }


        [HttpPost("delhandheld")]
        public int PostDeletehandheld([FromBody] handheldcls frm)
        {
            int ret = 0;
            NpgsqlConnection cont = new NpgsqlConnection();
            cont.ConnectionString = constr;
            cont.Open();
            NpgsqlCommand cmd = new NpgsqlCommand();
            cmd.Connection = cont;
            cmd.CommandText = "delete from handhelds  where handheldid=" + frm.handheldid;
            ret = cmd.ExecuteNonQuery();
            cont.Close();
            cont.Dispose();
            return ret;
        }




        [HttpGet("handheldlist")]
        public DataTable GetHandHeldList(int ahwalid, int userid)
        {
            string subqry = "";
            if (ahwalid != -1)
            {
                subqry = " and d.AhwalID = " + ahwalid;
            }

            NpgsqlConnection cont = new NpgsqlConnection();
            cont.ConnectionString = constr;
            cont.Open();
            DataTable dt = new DataTable();
            //            NpgsqlDataAdapter da = new NpgsqlDataAdapter("select d.deviceid,d.DeviceNumber,d.Model,t.name as type,d.Defective,d.Rental,d.BarCode,a.Name from Devices d INNER JOIN Ahwal a ON a.AhwalID = d.AhwalID inner join devicetypes t on t.devicetypeid = d.devicetypeid ", cont);
            //NpgsqlDataAdapter da = new NpgsqlDataAdapter("select d.deviceid,d.DeviceNumber,d.Model,(select dt.name from devicetypes dt where dt.devicetypeid = d.devicetypeid)  as type,d.Defective,d.Rental,d.BarCode,'jjjj' as Name from Devices d", cont);
            NpgsqlDataAdapter da = new NpgsqlDataAdapter("select d.handheldid,d.serial,d.Defective,d.BarCode,d.AhwalID,(select a.name from ahwal a where a.ahwalid = d.ahwalid ) ahwalname from handhelds d where d.serial is not null AND AhwalID IN (SELECT AhwalID FROM UsersRolesMap WHERE UserID = " + userid + " ) ", cont);

            // NpgsqlDataAdapter da = new NpgsqlDataAdapter("select d.deviceid,d.DeviceNumber,d.Model,'1'  as type,d.Defective,d.Rental,d.BarCode,'jjjj' as Name from Devices d", cont);
            da.Fill(dt);
            cont.Close();
            cont.Dispose();


            return dt;
        }


        #endregion

        /*Accessory*/
        #region Accessory
        [HttpPost("addaccessories")]
        public int PostAddaccessories([FromBody]devicecls frm)
        {
            int ret = 0;
            NpgsqlConnection cont = new NpgsqlConnection();
            cont.ConnectionString = constr;
            cont.Open();
            NpgsqlCommand cmd = new NpgsqlCommand();
            cmd.Connection = cont;
            cmd.CommandText = "insert into devices(AhwalID,devicenumber,model,devicetypeid,defective,rental,barcode) values (" + frm.ahwalid + ",'" + frm.devicenumber + "'," + frm.model + "," + frm.devicetypeid + "," + frm.defective + "," + frm.rental + ",'" + frm.barcode + "')";
            ret = cmd.ExecuteNonQuery();
            cont.Close();
            cont.Dispose();


            return ret;
        }

        [HttpPost("updateaccessories")]
        public int PostUpdateaccessories([FromBody] devicecls frm)
        {
            int ret = 0;
            NpgsqlConnection cont = new NpgsqlConnection();
            cont.ConnectionString = constr;
            cont.Open();
            NpgsqlCommand cmd = new NpgsqlCommand();
            cmd.Connection = cont;
            cmd.CommandText = "update devices set AhwalID = " + frm.ahwalid + ",devicenumber = '" + frm.devicenumber + "',model = '" + frm.model + "',devicetypeid='" + frm.devicetypeid + "',defective = " + frm.defective + ",rental = " + frm.rental + ",barcode = '" + frm.barcode + "' where deviceid=" + frm.deviceid;
            ret = cmd.ExecuteNonQuery();
            cont.Close();
            cont.Dispose();


            return ret;
        }


        [HttpPost("delaccessorie")]
        public int PostDeleteaccessorie([FromBody] devicecls frm)
        {
            int ret = 0;
            NpgsqlConnection cont = new NpgsqlConnection();
            cont.ConnectionString = constr;
            cont.Open();
            NpgsqlCommand cmd = new NpgsqlCommand();
            cmd.Connection = cont;
            cmd.CommandText = "delete from devices  where deviceid=" + frm.deviceid;
            ret = cmd.ExecuteNonQuery();
            cont.Close();
            cont.Dispose();
            return ret;
        }




        [HttpPost("accessorielist")]
        public DataTable PostaccessorieList()
        {


            NpgsqlConnection cont = new NpgsqlConnection();
            cont.ConnectionString = constr;
            cont.Open();
            DataTable dt = new DataTable();
            //            NpgsqlDataAdapter da = new NpgsqlDataAdapter("select d.deviceid,d.DeviceNumber,d.Model,t.name as type,d.Defective,d.Rental,d.BarCode,a.Name from Devices d INNER JOIN Ahwal a ON a.AhwalID = d.AhwalID inner join devicetypes t on t.devicetypeid = d.devicetypeid ", cont);
            NpgsqlDataAdapter da = new NpgsqlDataAdapter("select d.deviceid,d.DeviceNumber,d.Model,(select dt.name from devicetypes dt where dt.devicetypeid = d.devicetypeid)  as type,d.Defective,d.Rental,d.BarCode,'jjjj' as Name from Devices d", cont);
            // NpgsqlDataAdapter da = new NpgsqlDataAdapter("select d.deviceid,d.DeviceNumber,d.Model,'1'  as type,d.Defective,d.Rental,d.BarCode,'jjjj' as Name from Devices d", cont);
            da.Fill(dt);
            cont.Close();
            cont.Dispose();


            return dt;
        }


        #endregion

        /*Persons*/
        #region Persons
        [HttpPost("addpersons")]
        public int PostAddpersons([FromBody]devicecls frm)
        {
            int ret = 0;
            NpgsqlConnection cont = new NpgsqlConnection();
            cont.ConnectionString = constr;
            cont.Open();
            NpgsqlCommand cmd = new NpgsqlCommand();
            cmd.Connection = cont;
            cmd.CommandText = "insert into devices(AhwalID,devicenumber,model,devicetypeid,defective,rental,barcode) values (" + frm.ahwalid + ",'" + frm.devicenumber + "'," + frm.model + "," + frm.devicetypeid + "," + frm.defective + "," + frm.rental + ",'" + frm.barcode + "')";
            ret = cmd.ExecuteNonQuery();
            cont.Close();
            cont.Dispose();


            return ret;
        }

        [HttpPost("updatepersons")]
        public int PostUpdatepersons([FromBody] devicecls frm)
        {
            int ret = 0;
            NpgsqlConnection cont = new NpgsqlConnection();
            cont.ConnectionString = constr;
            cont.Open();
            NpgsqlCommand cmd = new NpgsqlCommand();
            cmd.Connection = cont;
            cmd.CommandText = "update devices set AhwalID = " + frm.ahwalid + ",devicenumber = '" + frm.devicenumber + "',model = '" + frm.model + "',devicetypeid='" + frm.devicetypeid + "',defective = " + frm.defective + ",rental = " + frm.rental + ",barcode = '" + frm.barcode + "' where deviceid=" + frm.deviceid;
            ret = cmd.ExecuteNonQuery();
            cont.Close();
            cont.Dispose();


            return ret;
        }


        [HttpPost("delperson")]
        public int PostDeleteperson([FromBody] devicecls frm)
        {
            int ret = 0;
            NpgsqlConnection cont = new NpgsqlConnection();
            cont.ConnectionString = constr;
            cont.Open();
            NpgsqlCommand cmd = new NpgsqlCommand();
            cmd.Connection = cont;
            cmd.CommandText = "delete from devices  where deviceid=" + frm.deviceid;
            ret = cmd.ExecuteNonQuery();
            cont.Close();
            cont.Dispose();
            return ret;
        }




        [HttpPost("personlist")]
        public DataTable PostpersonList()
        {


            NpgsqlConnection cont = new NpgsqlConnection();
            cont.ConnectionString = constr;
            cont.Open();
            DataTable dt = new DataTable();
            //            NpgsqlDataAdapter da = new NpgsqlDataAdapter("select d.deviceid,d.DeviceNumber,d.Model,t.name as type,d.Defective,d.Rental,d.BarCode,a.Name from Devices d INNER JOIN Ahwal a ON a.AhwalID = d.AhwalID inner join devicetypes t on t.devicetypeid = d.devicetypeid ", cont);
            NpgsqlDataAdapter da = new NpgsqlDataAdapter("select d.deviceid,d.DeviceNumber,d.Model,(select dt.name from devicetypes dt where dt.devicetypeid = d.devicetypeid)  as type,d.Defective,d.Rental,d.BarCode,'jjjj' as Name from Devices d", cont);
            // NpgsqlDataAdapter da = new NpgsqlDataAdapter("select d.deviceid,d.DeviceNumber,d.Model,'1'  as type,d.Defective,d.Rental,d.BarCode,'jjjj' as Name from Devices d", cont);
            da.Fill(dt);
            cont.Close();
            cont.Dispose();


            return dt;
        }


        #endregion

        #region Hand Held Invenory
        [HttpGet("handheldinventory")]
        public DataTable PostHandHeldInventoryList(int ahwalid, int userid)
        {
            string subqry = "";
            if (ahwalid != -1)
            {
                subqry = " and d.AhwalID = " + ahwalid;
            }

            NpgsqlConnection cont = new NpgsqlConnection();
            cont.ConnectionString = constr;
            cont.Open();
            DataTable dt = new DataTable();
            string Qry = "SELECT        HandHeldsCheckInOut.HandHeldCheckInOutID,HandHeldsCheckInOut.TimeStamp, CheckInOutStates.CheckInOutStateID,CheckInOutStates.Name AS StateName, HandHelds.AhwalID, HandHelds.Serial, Ranks.Name as PersonRank, Persons.MilNumber, Persons.Name AS PersonName ";

            Qry = Qry + " ,Ahwal.Name as ahwalname FROM Ahwal INNER JOIN";

            Qry = Qry + " HandHelds  ON Ahwal.AhwalID = HandHelds.AhwalID INNER JOIN";

            Qry = Qry + " HandHeldsCheckInOut ON HandHelds.HandHeldID = HandHeldsCheckInOut.HandHeldID INNER JOIN";

            Qry = Qry + " CheckInOutStates ON HandHeldsCheckInOut.CheckInOutStateID = CheckInOutStates.CheckInOutStateID INNER JOIN";
            Qry = Qry + " Persons ON Ahwal.AhwalID = Persons.AhwalID AND HandHeldsCheckInOut.PersonID = Persons.PersonID INNER JOIN";
            Qry = Qry + " Ranks ON Persons.RankID = Ranks.RankID where  Ahwal.AhwalID IN (SELECT AhwalID FROM UsersRolesMap WHERE UserID = " + userid + " ) ";

            Qry = Qry + "  ORDER BY HandHeldsCheckInOut.timestamp";

            NpgsqlDataAdapter da = new NpgsqlDataAdapter(Qry, cont);
            dt.Columns.Add("patrolcheckinoutid");
            dt.Columns.Add("statename");
            dt.Columns.Add("ahwalid");
            dt.Columns.Add("ahwalname");
            dt.Columns.Add("platenumber");
            dt.Columns.Add("model");
            dt.Columns.Add("milnumber");
            dt.Columns.Add("personrank");
            dt.Columns.Add("personname");
            dt.Columns.Add("timestamp");
            dt.Columns.Add("checkinoutstateid");
            da.Fill(dt);
            cont.Close();
            cont.Dispose();



            return dt;
        }

        #endregion

        #region Accessory Inventory
        [HttpPost("accessoryinventory")]
        public DataTable PostAccessoryInventoryList()
        {


            NpgsqlConnection cont = new NpgsqlConnection();
            cont.ConnectionString = constr;
            cont.Open();
            DataTable dt = new DataTable();
            string Qry = "SELECT        patrolcheckinoutid, CheckInOutStates.Name AS StateName, Ahwal.AhwalID, Ahwal.Name AS AhwalName, patrolcars.platenumber, patrolcars.Model,'' as Type, Persons.MilNumber, ";
            Qry = Qry + " Ranks.Name AS PersonRank, Persons.Name AS PersonName, patrolCheckInOut.timestamp, CheckInOutStates.CheckInOutStateID";

            Qry = Qry + "  FROM Ahwal INNER JOIN";

            Qry = Qry + " patrolcars  ON Ahwal.AhwalID = patrolcars.AhwalID INNER JOIN";

            Qry = Qry + " patrolCheckInOut ON patrolcars.patrolID = patrolCheckInOut.patrolID INNER JOIN";

            Qry = Qry + " CheckInOutStates ON patrolCheckInOut.CheckInOutStateID = CheckInOutStates.CheckInOutStateID INNER JOIN";

            Qry = Qry + " Persons ON Ahwal.AhwalID = Persons.AhwalID AND patrolCheckInOut.PersonID = Persons.PersonID INNER JOIN";

            Qry = Qry + " Ranks ON Persons.RankID = Ranks.RankID";
            Qry = Qry + "  ORDER BY patrolCheckInOut.timestamp";

            NpgsqlDataAdapter da = new NpgsqlDataAdapter(Qry, cont);
            dt.Columns.Add("patrolcheckinoutid");
            dt.Columns.Add("statename");
            dt.Columns.Add("ahwalid");
            dt.Columns.Add("ahwalname");
            dt.Columns.Add("platenumber");
            dt.Columns.Add("model");

            dt.Columns.Add("type");
            dt.Columns.Add("milnumber");
            dt.Columns.Add("personrank");
            dt.Columns.Add("personname");
            dt.Columns.Add("timestamp");
            dt.Columns.Add("checkinoutstateid");
            da.Fill(dt);
            cont.Close();
            cont.Dispose();



            return dt;
        }

        #endregion

        #region citygroups
        [HttpGet("citygroupforahwal")]
        public DataTable GetCityGroupForAhwal(int ahwalid)
        {

            NpgsqlConnection cont = new NpgsqlConnection();
            cont.ConnectionString = constr;
            cont.Open();
            DataTable dt = new DataTable();

            NpgsqlDataAdapter da = new NpgsqlDataAdapter("SELECT citygroupid, AhwalID, sectorid, shortname,callerprefix,text,disabled FROM citygroups WHERE AhwalID = " + ahwalid, cont);
            da.Fill(dt);
            cont.Close();
            cont.Dispose();
            return dt;
        }
        #endregion
        [HttpPost("AddAhwalMapping")]
        public int PostAddAhwalMapping([FromBody]ahwalmapping frm)
        {
            int ret = 0;
            NpgsqlConnection cont = new NpgsqlConnection();
            cont.ConnectionString = constr;
            cont.Open();
            NpgsqlCommand cmd = new NpgsqlCommand();
            cmd.Connection = cont;
            cmd.CommandText = "insert into ahwalmapping(ahwalid,sectorid,citygroupid,shiftid,patrolroleid,personid) values (" + frm.ahwalid + "," + frm.sectorid + "," + frm.citygroupid + "," + frm.shiftid + "," + frm.patrolroleid + "," + frm.personid + ")";
            ret = cmd.ExecuteNonQuery();
            cont.Close();
            cont.Dispose();
            return ret;
        }

        [HttpPost("UpDateAhwalMapping")]
        public int PostUpDateAhwalMapping([FromBody]ahwalmapping frm)
        {
            int ret = 0;
            NpgsqlConnection cont = new NpgsqlConnection();
            cont.ConnectionString = constr;
            cont.Open();
            NpgsqlCommand cmd = new NpgsqlCommand();
            cmd.Connection = cont;
            cmd.CommandText = "update ahwalmapping set ahwalid = " + frm.ahwalid + ",sectorid=" + frm.sectorid + ",citygroupid=" + frm.citygroupid + ",shiftid=" + frm.shiftid + ",patrolroleid=" + frm.patrolroleid + ",personid=" + frm.personid + " where ahwalmappingid = " + frm.ahwalmappingid;
            ret = cmd.ExecuteNonQuery();
            cont.Close();
            cont.Dispose();
            return ret;
        }
    }
}