using Microsoft.AspNetCore.SignalR;
using MOI.Patrol.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MOI.Patrol.Core
{
    public class NotifyHub : Hub<ITypedHubClient>
    {
    }
}
