using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SDMFavService.Classes
{
    public class Reservation
    {
        public DateTime? Start { get; set; }
        public DateTime? End { get; set; }
        public string Person { get; set; }
        public string Organization { get; set; }
        public string Subject { get; set; }
        public string Description { get; set; }
        public string RoomUuid { get; set; }
        public string OwningCr { get; set; }
        public string Status { get; set; }

        public Reservation()
        { 
        }
    }
}