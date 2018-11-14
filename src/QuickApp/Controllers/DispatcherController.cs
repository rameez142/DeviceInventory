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
        private patrolsContext _context = new patrolsContext();





        [HttpPost("checkInAhwalMapping")]
        public IActionResult PostCheckInAhwalMapping([FromBody]JObject RqHdr)
        {


            var selectedPerson = RqHdr["personMno"].ToString();
            //  var selectedPatrol = RqHdr["plateNumber"].ToString();

            var selectedPatrol = Newtonsoft.Json.JsonConvert.DeserializeObject<string>(RqHdr["plateNumber"].ToString(), new Newtonsoft.Json.JsonSerializerSettings { NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore });

            var selectedHandHeld = Newtonsoft.Json.JsonConvert.DeserializeObject<string>(RqHdr["serial"].ToString(), new Newtonsoft.Json.JsonSerializerSettings { NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore });

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


        [HttpPost("addAhwalMapping")]
        public IActionResult PostAddAhwalMapping([FromBody]JObject RqHdr)
        {
            var selectedRole = Newtonsoft.Json.JsonConvert.DeserializeObject<string>(RqHdr["PatrolRoleId"].ToString(), new Newtonsoft.Json.JsonSerializerSettings { NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore });
            var personSelection = Newtonsoft.Json.JsonConvert.DeserializeObject<string>(RqHdr["Milnumber"].ToString(), new Newtonsoft.Json.JsonSerializerSettings { NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore });

            var uiSelShiftId = Newtonsoft.Json.JsonConvert.DeserializeObject<string>(RqHdr["ShiftId"].ToString(), new Newtonsoft.Json.JsonSerializerSettings { NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore });
            var uiSelSectorId = Newtonsoft.Json.JsonConvert.DeserializeObject<string>(RqHdr["SectorId"].ToString(), new Newtonsoft.Json.JsonSerializerSettings { NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore });
            var uiSelCityGroupId = Newtonsoft.Json.JsonConvert.DeserializeObject<string>(RqHdr["CityGroupId"].ToString(), new Newtonsoft.Json.JsonSerializerSettings { NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore });

            //var uiSelAhwalMappingID = Newtonsoft.Json.JsonConvert.DeserializeObject<string>(RqHdr["AhwalMappingID"].ToString(), new Newtonsoft.Json.JsonSerializerSettings { NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore });
            var uiSelAssociateAhwalMappingID = Newtonsoft.Json.JsonConvert.DeserializeObject<string>(RqHdr["AssociateAhwalMappingID"].ToString(), new Newtonsoft.Json.JsonSerializerSettings { NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore });


            string responsemsg = "";
           

            if (selectedRole == null)
            {
                responsemsg = "يرجى اختيار المسؤولية";
                return Ok(responsemsg);
            }
            if (personSelection == null)
            {
                responsemsg = "يرجى اختيار الفرد";
                return Ok(responsemsg);
            }

            Users user = new Users();
            user.Userid = Convert.ToInt32(RqHdr["userid"]);

            var personMilNumber = Convert.ToInt64(personSelection.ToString());
            
            var person = _person.GetPersonForUserForRole(user, personMilNumber, Handler_User.User_Role_Ahwal);
            if (person == null)
            {
                responsemsg = "لم يتم العثور على الفرد";
                return Ok(responsemsg);
            }

            var m = new Ahwalmapping();
            if (Convert.ToInt64(selectedRole) == Handler_AhwalMapping.PatrolRole_CaptainAllSectors ||
               Convert.ToInt64(selectedRole) == Handler_AhwalMapping.PatrolRole_CaptainShift)
            {

                var shiftSelection = uiSelShiftId;
                if (shiftSelection == null)
                {
                    responsemsg = "يرجى اختيار الشفت";
                    return Ok(responsemsg);
                }
                var personID = person.Personid;
                m.Ahwalid = person.Ahwalid;
                m.Sectorid = Core.Handler_AhwalMapping.Sector_Public;
                //the first result of an ahwal will alway be the generic public sector
                var cityID = _context.Citygroups.FirstOrDefault<Citygroups>(ec => ec.Ahwalid == person.Ahwalid);
                m.Citygroupid = cityID.Citygroupid;// Core.Handler_AhwalMapping.CityGroup_Sector_Public_CityGroupNone;
                m.Shiftid = Convert.ToInt16(shiftSelection.ToString());
                m.Patrolid = Convert.ToInt16(selectedRole);
                m.Personid = personID;
                Operationlogs result;
                //if (Request.Form["AhwalMappingAddMethod"] == "UPDATE")
                //{
                //    m.Ahwalmappingid = Convert.ToInt64(uiSelAhwalMappingID);
                //    result = _ahwalmapping.UpDateMapping(user, m);
                //}
                //else
                //{
                    result = _ahwalmapping.AddNewMapping(user, m);
                //}
                responsemsg = result.Text;
               

            }
            else if (Convert.ToInt64(selectedRole) == Handler_AhwalMapping.PatrolRole_CaptainSector
               || Convert.ToInt64(selectedRole) == Handler_AhwalMapping.PatrolRole_SubCaptainSector)
            {
                var shiftSelection = uiSelShiftId;
                if (shiftSelection == null)
                {
                    responsemsg = "يرجى اختيار الشفت";
                    return Ok(responsemsg);
                }
                var personID = person.Personid;
                m.Ahwalid = person.Ahwalid;
                var sectorSelection = uiSelSectorId;
                if (sectorSelection == null)
                {
                    responsemsg = "يرجى اختيار القطاع";
                    return Ok(responsemsg);
                }

                m.Sectorid = Convert.ToInt16(uiSelSectorId.ToString());
               
                //the first result of an ahwal and sector, will alwayy be considered as the public sector
                var cityID = _context.Citygroups.FirstOrDefault<Citygroups>(ec => ec.Ahwalid == person.Ahwalid && ec.Sectorid == m.Sectorid);
                m.Citygroupid = cityID.Citygroupid;// Core.Handler_AhwalMapping.CityGroup_Sector_Public_CityGroupNone;
                m.Shiftid = Convert.ToInt16(uiSelShiftId.ToString());
                m.Patrolid = Convert.ToInt16(selectedRole);
                m.Personid = personID;
                Operationlogs result;
                //if (Request.Form["AhwalMappingAddMethod"] == "UPDATE")
                //{
                //    m.Ahwalmappingid = Convert.ToInt64(uiSelAhwalMappingID);
                //    result = _ahwalmapping.UpDateMapping(user, m);
                //}
                //else
                //{
                    result = _ahwalmapping.AddNewMapping(user, m);
                   
              //  }
                responsemsg = result.Text;

               
            }
            else if (Convert.ToInt64(selectedRole) == Core.Handler_AhwalMapping.PatrolRole_Associate)
            {

                var associateSelectionmappingID = uiSelAssociateAhwalMappingID;
                if (associateSelectionmappingID == null)
                {
                    responsemsg = "يرجى اختيار المرافق";
                    return Ok(responsemsg);
                }

                var ahwalMappingForAssociate = _ahwalmapping.GetMappingByID(user, Convert.ToInt64(associateSelectionmappingID.ToString()), Core.Handler_User.User_Role_Ahwal);
                if (ahwalMappingForAssociate != null)
                {
                    var personID = person.Personid;
                    if (personID == ahwalMappingForAssociate.Personid)
                    {
                        responsemsg = "المرافق نفس الفرد، ماهذا ؟؟؟؟";
                        return Ok(responsemsg);
                    }

                    m.Ahwalid = ahwalMappingForAssociate.Ahwalid;
                    m.Personid = personID;
                    m.Associtatepersonid = ahwalMappingForAssociate.Personid;
                    m.Sectorid = ahwalMappingForAssociate.Sectorid;
                    m.Citygroupid = ahwalMappingForAssociate.Citygroupid;
                    m.Shiftid = ahwalMappingForAssociate.Shiftid;
                    m.Patrolid = Convert.ToInt16(selectedRole);
                    Operationlogs result;
                    //if (Request.Form["AhwalMappingAddMethod"] == "UPDATE")
                    //{
                    //    m.Ahwalmappingid = Convert.ToInt64(uiSelAhwalMappingID);
                    //    result = _ahwalmapping.UpDateMapping(user, m);
                    //}
                    //else
                    //{
                        result = _ahwalmapping.AddNewMapping(user, m);
                       
                   // }
                    responsemsg = result.Text;

                   
                }

            }
            else
            {
                var shiftSelection = uiSelShiftId;
                if (shiftSelection == null)
                {
                    responsemsg = "يرجى اختيار الشفت";
                    return Ok(responsemsg);
                }
                var personID = person.Personid;
                m.Ahwalid = person.Ahwalid;
                var sectorSelection = uiSelSectorId;
                if (sectorSelection == null)
                {
                    responsemsg = "يرجى اختيار القطاع";
                    return Ok(responsemsg);
                }
                var citySelection = uiSelCityGroupId;
                if (citySelection == null)
                {
                    responsemsg = "يرجى اختيار المنطقة";
                    return Ok(responsemsg);
                }
                m.Sectorid = Convert.ToInt16(uiSelSectorId.ToString());
                m.Citygroupid = Convert.ToInt16(uiSelCityGroupId.ToString());
                m.Shiftid = Convert.ToInt16(uiSelShiftId.ToString());
                m.Patrolid = Convert.ToInt16(selectedRole);
                m.Personid = personID;
                Operationlogs result;
                //if (Request.Form["AhwalMappingAddMethod"] == "UPDATE")
                //{
                //    m.Ahwalmappingid = Convert.ToInt64(uiSelAhwalMappingID);
                //    result = _ahwalmapping.UpDateMapping(user, m);
                //}
                //else
                //{
                    result = _ahwalmapping.AddNewMapping(user, m);
                    
               // }

                responsemsg = result.Text;

                
            }
            return Ok(responsemsg);
        }


        [HttpPost("updatePersonState")]
        public IActionResult PostupdatePersonState([FromBody]JObject RqHdr)
        {
            var mappingid = Convert.ToInt64(Newtonsoft.Json.JsonConvert.DeserializeObject<string>(RqHdr["AhwalMappingId"].ToString(), new Newtonsoft.Json.JsonSerializerSettings { NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore }));
            var selmenu = RqHdr["Selmenu"].ToString();
           // var userid = Newtonsoft.Json.JsonConvert.DeserializeObject<string>(RqHdr["userid"].ToString(), new Newtonsoft.Json.JsonSerializerSettings { NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore });
            Users user = new Users();
            user.Userid = Convert.ToInt32(RqHdr["userid"]);

            var personState = new Patrolpersonstates();
                if (selmenu == "غياب")
                {
                    personState.Patrolpersonstateid = Core.Handler_AhwalMapping.PatrolPersonState_Absent;
                }
                else if (selmenu == "مرضيه")
                {
                    personState.Patrolpersonstateid = Core.Handler_AhwalMapping.PatrolPersonState_Sick;
                }
                else if (selmenu == "اجازه")
                {
                    personState.Patrolpersonstateid = Core.Handler_AhwalMapping.PatrolPersonState_Off;
                }
                var result = _ahwalmapping.Ahwal_ChangePersonState(user, mappingid, personState);
              
           
            return Ok(result.Text);
        }
    }
    }