using Newtonsoft.Json;
using Wijnlanden.API.Models.Classes;
using Wijnlanden.API.Models.Enums;
using Wijnlanden.API.Models.Interfaces;

namespace Wijnlanden.API.Context {
    public class GuestModel : IGuest {
        public Guid ID { get; set; } = Guid.NewGuid();
        public string Name { get; set; } = string.Empty;
        public string Surname { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Code { get; set; } = string.Empty;
        public bool AllowPlusOne { get; set; } = false;
        public Rsvp RSVP { get; set; } = Rsvp.Unknown;
        public bool sendReminder { get; set; } = false;
        public bool AddedFromRSVP { get; set; } = false;
        public Relation Relation { get; set; } = Relation.Unknown;
        public Province Province { get; set; } = Province.Unknown;
        public int Kids { get; set; }
        public int QuizTotal { get; set; } = 0;

        public Guid? Partner_ID { get; set; }
        public string Canapes { get; set; } = string.Empty;
        public string Mains { get; set; } = string.Empty;
        public string Sides { get; set; } = string.Empty;
        public string Desserts { get; set; } = string.Empty;


        public static explicit operator GuestModel(Guest guest) {
            var model = new GuestModel() {
                ID = guest.ID,
                AddedFromRSVP = guest.AddedFromRSVP,
                AllowPlusOne = guest.AllowPlusOne,
                Code = guest.Code,
                Name = guest.Name,
                Province = guest.Province,
                Relation = guest.Relation,
                RSVP = guest.RSVP,
                sendReminder = guest.sendReminder,
                Surname = guest.Surname,
                QuizTotal = guest.QuizTotal
            };

            if (!guest.Done || !string.IsNullOrWhiteSpace(guest.Email)) {
                model.Email = guest.Email;
            }

            if (guest.Partner is not null) {
                model.Partner_ID = guest.Partner.ID;
            }

            if (guest.Canapes is not null && guest.Canapes.Count > 0) {
                model.Canapes = JsonConvert.SerializeObject(guest.Canapes);
            }

            if (guest.Mains is not null && guest.Mains.Count > 0) {
                model.Mains = JsonConvert.SerializeObject(guest.Mains);
            }

            if (guest.Sides is not null && guest.Sides.Count > 0) {
                model.Sides = JsonConvert.SerializeObject(guest.Sides);
            }

            if (guest.Desserts is not null && guest.Desserts.Count > 0) {
                model.Desserts = JsonConvert.SerializeObject(guest.Desserts);
            }

            return model;
        }
    }
}
