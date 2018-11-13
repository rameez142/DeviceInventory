using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using Core;
namespace MOI.Patrol.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class Dispatch2Controller : ControllerBase
    {
        [HttpPost("checkinAhwalMapping")]
        public string PostCheckInAhwalMapping([FromBody]JObject RqHdr)
        {


            var selectedPerson = RqHdr["personMno"].ToString();
            var selectedPatrol = RqHdr["plateNumber"].ToString();
            var selectedHandHeld = RqHdr["serial"].ToString();
            string responsemsg="";

            Users user = new Users();
            user.Userid = Convert.ToInt32(RqHdr["userid"]);

            if (selectedPerson == null)
            {
                responsemsg = "يرجى اختيار الفرد";
                return responsemsg;
            }
            return responsemsg;
            //var person = Core.Handler_Person.GetPersonForUserForRole(user, Convert.ToInt64(selectedPerson), Core.Handler_User.User_Role_Ahwal);
            //if (person == null)
            //{
            //    AhwalMapping_CheckInOut_StatusLabel.Text = "لم يتم العثور على الفرد";
            //    return;
            //}

            //var selectedPatrol = AhwalMapping_CheckInOut_PatrolCar.GridView.GetRowValues(AhwalMapping_CheckInOut_PatrolCar.GridView.FocusedRowIndex, new string[] { "PlateNumber" });
            //if (selectedPatrol == null)
            //{
            //    AhwalMapping_CheckInOut_StatusLabel.Text = "يرجى اختيار الدورية";
            //    return;
            //}
            //var patrol = Core.Handler_PatrolCars.GetPatrolCarByPlateNumberForUserForRole(user, selectedPatrol.ToString().Trim(), Core.Handler_User.User_Role_Ahwal);
            //if (patrol == null)
            //{
            //    AhwalMapping_CheckInOut_StatusLabel.Text = "لم يتم العثور على الدورية";
            //    return;
            //}


            //var selectedHandHeld = AhwalMapping_CheckInOut_HandHeld.GridView.GetRowValues(AhwalMapping_CheckInOut_HandHeld.GridView.FocusedRowIndex, new string[] { "Serial" });
            //if (selectedHandHeld == null)
            //{
            //    AhwalMapping_CheckInOut_StatusLabel.Text = "يرجى اختيار الجهاز";
            //    return;
            //}
            //var handheld = Core.Handler_HandHelds.GetHandHeldBySerialForUserForRole(user, selectedHandHeld.ToString().Trim(), Core.Handler_User.User_Role_Ahwal);



            //var personMapping = Core.Handler_AhwalMapping.GetMappingByPersonID(user, person);
            //if (personMapping == null)
            //{
            //    AhwalMapping_CheckInOut_StatusLabel.Text = "لم يتم العثور على الفرد في الكشف";
            //    return;
            //}
            ////lets see if this person already has devices, if he does, then its checkout, if not, then its checkin
            //if (Convert.ToBoolean(personMapping.HasDevices)) //checkout
            //{
            //    if (personMapping.PatrolID != patrol.PatrolID)
            //    {

            //        var getPatrol = new PatrolCar();
            //        getPatrol.PatrolID = (int)personMapping.PatrolID;
            //        getPatrol.AhwalID = personMapping.AhwalID;
            //        var patrolexists = Core.Handler_PatrolCars.GetPatrolCardByID(user, getPatrol);
            //        if (patrolexists != null)
            //        {
            //            AhwalMapping_CheckInOut_StatusLabel.Text = "يجب تسليم نفس الدورية المستلمه رقم: " + patrolexists.PlateNumber;
            //            return;
            //        }

            //    }
            //    if (personMapping.HandHeldID != handheld.HandHeldID)
            //    {
            //        var getHandHeld = new HandHeld();
            //        getHandHeld.HandHeldID = (int)personMapping.HandHeldID;
            //        getHandHeld.AhwalID = personMapping.AhwalID;
            //        var handHeldExist = Core.Handler_HandHelds.GetHandHeldByID(user, getHandHeld);
            //        if (handHeldExist != null)
            //        {
            //            AhwalMapping_CheckInOut_StatusLabel.Text = "يجب تسليم نفس الجهاز المستلم رقم: " + handHeldExist.Serial;
            //            return;
            //        }
            //    }
            //    var result = Core.Handler_AhwalMapping.CheckOutPatrolAndHandHeld(user, personMapping, patrol, handheld);
            //    AhwalMapping_CheckInOut_StatusLabel.Text = result.Text;
            //    AhwalMappingGrid.DataBind();
            //    AhwalMapping_CheckInOut_MappingPerson.Text = "";
            //    AhwalMapping_CheckInOut_MappingPerson.Focus();
            //    AhwalMapping_CheckInOut_PatrolCar.Text = "";
            //    AhwalMapping_CheckInOut_HandHeld.Text = "";

            //}
            //else
            //{//check in
            //    if (Core.Handler_AhwalMapping.PatrolCarWithSomeOneElse(user, person.PersonID, patrol.PatrolID))
            //    {
            //        AhwalMapping_CheckInOut_StatusLabel.Text = "الدورية بحوزة شخص اخر";
            //        return;
            //    }
            //    if (Core.Handler_AhwalMapping.HandHeldWithSomeOneElse(user, person.PersonID, handheld.HandHeldID))
            //    {
            //        AhwalMapping_CheckInOut_StatusLabel.Text = "الجهاز بحوزة شخص اخر";
            //        return;
            //    }
            //    if (Convert.ToBoolean(patrol.Defective))
            //    {
            //        AhwalMapping_CheckInOut_StatusLabel.Text = "هذه الدورية غير صالحه";
            //        return;
            //    }
            //    if (Convert.ToBoolean(handheld.Defective))
            //    {
            //        AhwalMapping_CheckInOut_StatusLabel.Text = "هذه الجهاز غير صالح";
            //        return;
            //    }
            //    //ok no body else has, the devices are good and not defected
            //    var result = Core.Handler_AhwalMapping.CheckInPatrolAndHandHeld(user, personMapping, patrol, handheld);
            //    AhwalMapping_CheckInOut_StatusLabel.Text = result.Text;
            //    AhwalMappingGrid.DataBind();
            //    AhwalMapping_CheckInOut_MappingPerson.Text = "";
            //    AhwalMapping_CheckInOut_MappingPerson.Focus();

            //    AhwalMapping_CheckInOut_PatrolCar.Text = "";
            //    AhwalMapping_CheckInOut_HandHeld.Text = "";
            //}

        }
    }
}