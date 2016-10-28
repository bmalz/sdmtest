using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SDMFavService.Classes
{
    public class Room
    {
        public bool SelectBox { get; set; }
        public string SalaUuid { get; set; }
        public string SalaNazwa { get; set; }
        public string LokalizacjaUuid { get; set; }
        public string LokalizacjaNazwa { get; set; }
        public int DodatkoweMiejsca { get; set; }
        public bool Flipchart { get; set; }
        public bool Monitor { get; set; }
        public bool Naglosnienie { get; set; }
        public int PojemnoscKonferencyjna { get; set; }
        public int PojemnoscTeatralna { get; set; }
        public bool Projektor { get; set; }
        public bool ProjektorPrzenosny { get; set; }
        public bool TablicaSuchoscieralna { get; set; }
        public bool Telekonferencja { get; set; }
        public bool Videokonferencja { get; set; }
        public bool Wifi { get; set; }
        public bool Ekran { get; set; }
        public List<Reservation> Reservations { get; set; }
        public bool IsAvaliable { get; set; }
        public List<Reservation> Collisions { get; set; }
        public string BillingOwnerUuid { get; set; }
        //public bool IsPartiallyAvaliable { get; set; }
        //public DateTime AvaliableFrom { get; set; }
        //public DateTime AvaliableTo { get; set; }
        //public DateTime AvaliableFrom2 { get; set; }
        //public DateTime AvaliableTo2 { get; set; }

        public Room()
        {
            this.Collisions = new List<Reservation>();
        }
    }
}