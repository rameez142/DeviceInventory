using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using Core;
namespace MOI.Patrol.Controllers
{

    [Route("api/[controller]")]
    public class DispatcherController : Controller
    {
        private Handler_Person _person = new Handler_Person();
        private Handler_User _user = new Handler_User();
        private Handler_PatrolCars _patrol = new Handler_PatrolCars();
        private Handler_HandHelds _handheld = new Handler_HandHelds();
        private Handler_AhwalMapping _ahwalmapping = new Handler_AhwalMapping();




        [HttpPost("checkinahwalmapping")]
        public IActionResult PostCheckInAhwalMapping([FromBody]JObject RqHdr)
        {
            var selectedPerson = RqHdr["personMno"].ToString();
            var selectedPatrol = RqHdr["plateNumber"].ToString();
            var selectedHandHeld = RqHdr["serial"].ToString();
            string responsemsg = "";
            Users user = new Users();
            user.Userid = Convert.ToInt32(RqHdr["userid"]);

            if (selectedPerson == null)
            {
                responsemsg = "يرجى اختيار الفرد";
                return Ok(responsemsg);
            }
            var person = _person.GetPersonForUserForRole(user, Convert.ToInt64(selectedPerson), Core.Handler_User.User_Role_Ahwal);
            if (person == null)
            {
                responsemsg = "لم يتم العثور على الفرد";
                return Ok(responsemsg);
            }

            if (selectedPatrol == null)
            {
                responsemsg = "يرجى اختيار الدورية";
                return Ok(responsemsg);
            }
            var patrol = _patrol.GetPatrolCarByPlateNumberForUserForRole(user, selectedPatrol.ToString().Trim(), Core.Handler_User.User_Role_Ahwal);
            if (patrol == null)
            {
                responsemsg = "لم يتم العثور على الدورية";
                return Ok(responsemsg);
            }


            if (selectedHandHeld == null)
            {
                responsemsg = "يرجى اختيار الجهاز";
                return Ok(responsemsg);
            }
            var handheld = _handheld.GetHandHeldBySerialForUserForRole(user, selectedHandHeld.ToString().Trim(), Core.Handler_User.User_Role_Ahwal);

            var personMapping = _ahwalmapping.GetMappingByPersonID(user, person);
            if (personMapping == null)
            {
                responsemsg = "لم يتم العثور على الفرد في الكشف";
                return Ok(responsemsg);
            }
            //lets see if this person already has devices, if he does, then its checkout, if not, then its checkin
            if (Convert.ToBoolean(personMapping.Hasdevices)) //checkout
            {
                if (personMapping.Patrolid != patrol.Patrolid)
                {

                    var getPatrol = new Patrolcars();
                    getPatrol.Patrolid = (int)personMapping.Patrolid;
                    getPatrol.Ahwalid = personMapping.Ahwalid;
                    var patrolexists = _patrol.GetPatrolCardByID(user, getPatrol);
                    if (patrolexists != null)
                    {
                        responsemsg = "يجب تسليم نفس الدورية المستلمه رقم: " + patrolexists.Platenumber;
                        return Ok(responsemsg);
                    }

                }
                if (personMapping.Handheldid != handheld.Handheldid)
                {
                    var getHandHeld = new Handhelds();
                    getHandHeld.Handheldid = (int)personMapping.Handheldid;
                    getHandHeld.Ahwalid = personMapping.Ahwalid;
                    var handHeldExist = _handheld.GetHandHeldByID(user, getHandHeld);
                    if (handHeldExist != null)
                    {
                        responsemsg = "يجب تسليم نفس الجهاز المستلم رقم: " + handHeldExist.Serial;
                        return Ok(responsemsg);

                    }
                }
                var result = _ahwalmapping.CheckOutPatrolAndHandHeld(user, personMapping, patrol, handheld);
                responsemsg = result.Text;

                return Ok(responsemsg);

            }
            else
            {//check in
                if (_ahwalmapping.PatrolCarWithSomeOneElse(user, person.Personid, patrol.Patrolid))
                {
                    responsemsg = "الدورية بحوزة شخص اخر";
                    return Ok(responsemsg);
                }
                if (_ahwalmapping.HandHeldWithSomeOneElse(user, person.Personid, handheld.Handheldid))
                {
                    responsemsg = "الجهاز بحوزة شخص اخر";
                    return Ok(responsemsg);
                }
                if (Convert.ToBoolean(patrol.Defective))
                {
                    responsemsg = "هذه الدورية غير صالحه";
                    return Ok(responsemsg);
                }
                if (Convert.ToBoolean(handheld.Defective))
                {
                    responsemsg = "هذه الجهاز غير صالح";
                    return Ok(responsemsg);
                }
                //ok no body else has, the devices are good and not defected
                var result = _ahwalmapping.CheckInPatrolAndHandHeld(user, personMapping, patrol, handheld);
                responsemsg = result.Text;
                return Ok(responsemsg);

            }
        }
    }
    }