using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MOI.Patrol.Models
{
    public class CityGroups
    {

        public int cityGroupid { get; set; }
        public int ahwalId { get; set; }
        public int sectorId { get; set; }
        public string shortName { get; set; }
        public string callerPrefix { get; set; }
        public string text { get; set; }
        public int disabled { get; set; }
    }
}
