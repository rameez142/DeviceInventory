using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Core;
using MOI.Patrol.Interface;
using System;

namespace MOI.AssetManagement.Controllers
{
    [Route("api/[controller]")]
    public class MessageController : Controller
    {
        private IHubContext<NotifyHub, ITypedHubClient> _hubContext;

        public MessageController(IHubContext<NotifyHub, ITypedHubClient> hubContext)
        {
            _hubContext = hubContext;
        }

        [HttpPost]
        public string Post([FromBody]Message msg)
        {
            string retMessage = string.Empty;

            try
            {
                _hubContext.Clients.All.BroadcastMessage(msg.Type, msg.Payload, msg.OrgId, msg.CallerId);
                retMessage = "Success";
            }
            catch (Exception e)
            {
                retMessage = e.ToString();
            }

            return retMessage;
        }
    }
}