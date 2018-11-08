using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MOI.Patrol.Models
{
    public class AhwalMapping
    {
        public int ahwalID { get; set; }
        public int sectorID { get; set; }
        public int patrolRoleID { get; set; }
        public int shiftID { get; set; }
        public int personID { get; set; }
        public int ahwalMappingID { get; set; }
        public int cityGroupID { get; set; }
        public int milNumber { get; set; }
        public int rankID { get; set; }
        public int personName { get; set; }
        public int callerID { get; set; }
        public int hasDevices { get; set; }
        public string serial { get; set; }
        public string plateNumber { get; set; }
        public int patrolPersonStateID { get; set; }
        public DateTime sunRiseTimeStamp { get; set; }
        public DateTime sunSetTimeStamp { get; set; }

    }
}
