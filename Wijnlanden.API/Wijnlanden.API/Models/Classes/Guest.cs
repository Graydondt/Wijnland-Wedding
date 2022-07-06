
using System.Text;
using Newtonsoft.Json;
using Wijnlanden.API.Context;
using Wijnlanden.API.Models.Enums;
using Wijnlanden.API.Models.Interfaces;

namespace Wijnlanden.API.Models.Classes {
    public class Guest : IGuest {
        public Guest() {
            this.GenerateCode();
        }
        public Guid ID { get; set; } = Guid.NewGuid();
        public string Name { get; set; } = "";
        public string Surname { get; set; } = "";
        public string Email { get; set; } = "";
        public string Code { get; set; } = string.Empty;
        public bool AllowPlusOne { get; set; } = false;
        public Rsvp RSVP { get; set; } = Rsvp.Unknown;
        public bool sendReminder { get; set; } = false;
        public bool AddedFromRSVP { get; set; } = false;
        public Relation Relation { get; set; } = Relation.Unknown;
        public Province Province { get; set; } = Province.Unknown;
        public int Kids { get; set; }
        public int QuizTotal { get; set; } = 0;
        public bool Done { get; set; } = false;

        public Guest? Partner { get; set; }
        public List<string> Canapes { get; set; } = new List<string>();
        public List<string> Mains { get; set; } = new List<string>();
        public List<string> Sides { get; set; } = new List<string>();
        public List<string> Desserts { get; set; } = new List<string>();

        private readonly Random _random = new Random();

        private void GenerateCode() {
            var pieces = "";
            for (int i = 0; i < 5; i++) {
                var choice = RandomNumber(0, 2);
                if (choice == 1) {
                    pieces += RandomNumber().ToString();
                } else {
                    pieces += RandomString(1);
                }
            }

            this.Code = pieces;
        }

        public static explicit operator Guest(GuestModel model) {
            var guest = new Guest() {
                AddedFromRSVP = model.AddedFromRSVP,
                Relation = model.Relation,
                Province = model.Province,
                AllowPlusOne = model.AllowPlusOne,
                Code = model.Code,
                Name = model.Name,
                ID = model.ID,
                RSVP = model.RSVP,
                sendReminder = model.sendReminder,
                Surname = model.Surname,
                Done = !string.IsNullOrWhiteSpace(model.Email)
            };

            if (!string.IsNullOrWhiteSpace(model.Canapes)) {
                guest.Canapes = JsonConvert.DeserializeObject<List<string>>(model.Canapes)!.ToList();
            }

            if (!string.IsNullOrWhiteSpace(model.Mains)) {
                guest.Mains = JsonConvert.DeserializeObject<List<string>>(model.Mains)!.ToList();
            }

            if (!string.IsNullOrWhiteSpace(model.Sides)) {
                guest.Sides = JsonConvert.DeserializeObject<List<string>>(model.Sides)!.ToList();
            }

            if (!string.IsNullOrWhiteSpace(model.Desserts)) {
                guest.Desserts = JsonConvert.DeserializeObject<List<string>>(model.Desserts)!.ToList();
            }

            return guest;
        }

        // Generates a random number within a range.      
        private int RandomNumber(int min = 0, int max = 9) {
            return _random.Next(min, max);
        }
        // Generates a random string with a given size.    
        private string RandomString(int size, bool lowerCase = false) {
            var builder = new StringBuilder(size);

            // Unicode/ASCII Letters are divided into two blocks
            // (Letters 65–90 / 97–122):
            // The first group containing the uppercase letters and
            // the second group containing the lowercase.  

            // char is a single Unicode character  
            char offset = lowerCase ? 'a' : 'A';
            const int lettersOffset = 26; // A...Z or a..z: length=26  

            for (var i = 0; i < size; i++) {
                var @char = (char)RandomNumber(offset, offset + lettersOffset);
                builder.Append(@char);
            }

            return lowerCase ? builder.ToString().ToLower() : builder.ToString();
        }

    }
}
