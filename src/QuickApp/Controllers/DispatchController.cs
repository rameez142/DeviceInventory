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
using Npgsql;
using MOI.Patrol.DataAccessLayer;
using MOI.Patrol.Models;

namespace MOI.Patrol.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DispatchController : ControllerBase
    {
        public String constr = "server=localhost;Port=5432;User Id=postgres;password=admin;Database=Patrols";
        public DataAccess DAL = new DataAccess();
       
        /*AhwalMapping*/
        #region AhwalMapping
        [HttpGet("rolesList")]
        public List<PatrolRoles> GetRolesList()
        {

            String Qry = "SELECT PatrolRoleID, Name FROM PatrolRoles";
            return DAL.PostGre_GetData<PatrolRoles>(Qry);
        }

        [HttpGet("shiftsList")]
        public List<Shifts> GetShiftsList()
        {
            String Qry = "SELECT ShiftID, Name, StartingHour, NumberOfHours FROM Shifts";
            return DAL.PostGre_GetData<Shifts>(Qry);
        }

        [HttpGet("sectorsList")]
        public List<Sectors> GetSectorsList(int userid)
        {
            String Qry = "SELECT SectorID, ShortName, CallerPrefix, Disabled,AhwalId FROM Sectors where Disabled<>1  and (AhwalID IN (SELECT AhwalID FROM UsersRolesMap WHERE (UserID = " + userid + ") ))";
            return DAL.PostGre_GetData<Sectors>(Qry);
        }

        [HttpGet("cityList")]
        public List<CityGroups> GetCityList(int userid, int sectorid)
        {
            String Qry = "SELECT CityGroupID ,  ShortName ,  CallerPrefix ,  Disabled ,AhwalID,SectorID,Text FROM  CityGroups  where Disabled<>1 and CallerPreFix<>'0' and SectorID=" + sectorid + " and  (AhwalID IN (SELECT AhwalID FROM UsersRolesMap WHERE (UserID = " + userid + ")))";
            return DAL.PostGre_GetData<CityGroups>(Qry);
        }

        [HttpGet("associateList")]
        public List<Associates> GetAssociateList(int userid)
        {
            String Qry = "SELECT AhwalMapping.AhwalMappingID, Persons.PersonID, Persons.MilNumber, Persons.Name FROM AhwalMapping INNER JOIN Persons ON AhwalMapping.PersonID = Persons.PersonID WHERE (AhwalMapping.PatrolRoleID <> 70) AND(AhwalMapping.AhwalID IN (SELECT AhwalMapping.AhwalID FROM UsersRolesMap WHERE (UserID = " + userid + ") ))";
            return DAL.PostGre_GetData<Associates>(Qry);
        }


        [HttpGet("personForUserForRole")]
        public List<Persons> GetPersonForUserForRole(int mno, int userid)
        {

            String Qry = "SELECT PersonId, AhwalId, Name, MilNumber,RankId,Mobile,FixedCallerId FROM Persons WHERE AhwalID IN (SELECT AhwalID FROM UsersRolesMap WHERE UserID = " + userid + " ) and MilNumber = " + mno;
            return DAL.PostGre_GetData<Persons>(Qry);
        }

        [HttpGet("personsList")]
        [Produces("application/json")]
        public List<Persons> GetPersonsList(int userid)
        {

                String Qry = "SELECT PersonID, AhwalID, Name, MilNumber,RankId,Mobile,FixedCallerId FROM Persons WHERE AhwalID IN (SELECT AhwalID FROM UsersRolesMap WHERE UserID = " + userid + " )";
            return DAL.PostGre_GetData<Persons>(Qry);
        }

        [HttpGet("dispatchList")]
        public DataTable Getdispatchlist()
        {


            NpgsqlConnection cont = new NpgsqlConnection();
            cont.ConnectionString = constr;
            cont.Open();
            DataTable dt = new DataTable();
            String Qry = "SELECT AhwalMappingID, AhwalID, ShiftID, SectorID, PatrolRoleID, CityGroupID,(Select MilNumber From Persons where PersonID = AhwalMapping.PersonID) as MilNumber,";
            Qry = Qry + " (Select RankID From Persons where PersonID = AhwalMapping.PersonID) as RankID, (Select Name From Persons where PersonID = AhwalMapping.PersonID) as PersonName, CallerID,  ";
            Qry = Qry + " HasDevices, '' as Serial,  (Select plateNumber From patrolcars where patrolid = AhwalMapping.patrolid) as PlateNumber, ";
            Qry = Qry + " PatrolPersonStateID, SunRiseTimeStamp, SunSetTimeStamp,(Select Mobile From Persons where PersonID = AhwalMapping.PersonID) as PersonMobile,IncidentID,";
            Qry = Qry + " LastStateChangeTimeStamp,(Select ShortName From sectors where SectorID=AhwalMapping.SectorID) as SectorDesc , (Select (select Name from Ranks where rankid = persons.rankid) From Persons where PersonID=AhwalMapping.PersonID) as RankDesc,(SELECT  Name FROM PatrolPersonStates PS ";
            Qry = Qry + " where PS.PatrolPersonStateID in (select PatrolPersonStateID from PatrolPersonStateLog where PatrolPersonStateLog.PersonID = AhwalMapping.PersonID ";

            Qry = Qry + " order by TimeStamp desc  FETCH FIRST ROW ONLY ) ) as PersonState FROM AhwalMapping ";

            NpgsqlDataAdapter da = new NpgsqlDataAdapter(Qry, cont);
            da.Fill(dt);
            cont.Close();
            cont.Dispose();


            return dt;
        }

        [HttpPost("addAhwalMapping")]
        public string PostAddAhwalMapping([FromBody]AhwalMapping frm)
        {
            //  GetPerson = "";
            string ol_failed = "";

            //we have to check first that this person doesn't exists before in mapping
            String CheckPersonQry = "";
            CheckPersonQry = "select * from persons where personid=" + frm.personID;

            Persons GetPerson = DAL.PostGre_GetData<Persons>(CheckPersonQry)[0];
            if (GetPerson == null)
            {
                ol_failed = "لم يتم العثور على الفرد: " + frm.personID; //todo, change it actual person name

                return ol_failed;
            }

            string InsQry = "";
            InsQry = "insert into AhwalMapping(ahwalid,sectorid,citygroupid,shiftid,patrolroleid,personid) values (" + frm.ahwalID + "," + frm.sectorID + "," + frm.cityGroupID + "," + frm.shiftID + "," + frm.patrolRoleID + "," + frm.personID + ")";
            int ret = DAL.PostGre_ExNonQry(InsQry);
            ol_failed = "Saved ";
            return ol_failed;
        }

        [HttpPost("updateAhwalMapping")]
        public int PostUpDateAhwalMapping([FromBody]AhwalMapping frm)
        {
            int ret = 0;
            string UpdateQry = "";
            UpdateQry = "update AhwalMapping set ahwalid = " + frm.ahwalID + ",sectorid=" + frm.sectorID + ",citygroupid=" + frm.cityGroupID + ",shiftid=" + frm.shiftID + ",patrolroleid=" + frm.patrolRoleID + ",personid=" + frm.personID + " where ahwalmappingid = " + frm.ahwalMappingID;
            ret = DAL.PostGre_ExNonQry(UpdateQry);
            return ret;
        }
      
        [HttpGet("cityGroupforAhwal")]
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

    }
}