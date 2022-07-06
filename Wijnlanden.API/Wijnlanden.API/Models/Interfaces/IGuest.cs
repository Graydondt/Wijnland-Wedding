using Wijnlanden.API.Models.Enums;

namespace Wijnlanden.API.Models.Interfaces {
    public interface IGuest {
        public Guid ID { get; set; }
        public string Name { get; set; }
        public string Surname { get; set; }
        public string Email { get; set; }
        public string Code { get; set; }
        public bool AllowPlusOne { get; set; }
        public Rsvp RSVP { get; set; }
        public bool sendReminder { get; set; }
        public bool AddedFromRSVP { get; set; }
        public Relation Relation { get; set; }
        public Province Province { get; set; }
        public int Kids { get; set; }
        public int QuizTotal { get; set; }
    }
}
