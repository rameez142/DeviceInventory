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
        private readonly Handler_Person _person;
        private readonly Handler_User _user;

        DispatcherController(Handler_Person person, Handler_User user)
        {
            _person = person;
            _user = user;
        }
        


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
            var person =  _person.GetPersonForUserForRole(user, Convert.ToInt64(selectedPerson), Core.Handler_User.User_Role_Ahwal);
            if (person == null)
            {
                responsemsg = "لم يتم العثور على الفرد";
                return Ok(responsemsg);
            }

            return Ok(responsemsg);

        }
    }
}