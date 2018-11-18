using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using Core;
using MOI.Patrol.DataAccessLayer;

namespace MOI.Patrol.Controllers
{
    [Route("api/[controller]")]
    public class OperationsController : Controller
    {

        private Handler_Person _person = new Handler_Person();
        private Handler_User _user = new Handler_User();
        private Handler_PatrolCars _patrol = new Handler_PatrolCars();
        private Handler_HandHelds _handheld = new Handler_HandHelds();
        private Handler_AhwalMapping _ahwalmapping = new Handler_AhwalMapping();
        private patrolsContext _context = new patrolsContext();

        private String constr = "server=localhost;Port=5432;User Id=postgres;password=admin;Database=Patrols";
        private DataAccess DAL = new DataAccess();
        private Handler_Operations _oper = new Handler_Operations();

        [HttpPost("operationslist")]
        public ActionResult PostOperationsList()
        {
           
            string Qry = "SELECT         Incidents.IncidentID, Incidents.IncidentStateID,Users.Name as UserName, Incidents.Place, Incidents.IncidentSourceExtraInfo1 as ExtraInfo1, Incidents.IncidentSourceExtraInfo2 as ExtraInfo2, Incidents.IncidentSourceExtraInfo3  as ExtraInfo3, Incidents.TimeStamp, Incidents.LastUpdate, Incidents.IncidentSourceID, IncidentsTypes.Name AS IncidentsTypeName, IncidentSources.Name AS IncidentSourceName, IncidentSources.ExtraInfo1 as IncidentSourceExtraInfo1, IncidentSources.ExtraInfo2 as IncidentSourceExtraInfo2, IncidentSources.ExtraInfo3 as IncidentSourceExtraInfo3 FROM   Incidents INNER JOIN IncidentSources ON Incidents.IncidentSourceID = IncidentSources.IncidentSourceID INNER JOIN IncidentStates ON Incidents.IncidentStateID = IncidentStates.IncidentStateID INNER JOIN IncidentsTypes ON Incidents.IncidentTypeID = IncidentsTypes.IncidentTypeID  INNER JOIN Users ON Incidents.UserID = Users.UserID where Incidents.IncidentStateID!=30 Order by TimeStamp desc LIMIT 50 OFFSET 1";

            return Ok(DAL.PostGre_GetDataTable(Qry));
        }
    }
}