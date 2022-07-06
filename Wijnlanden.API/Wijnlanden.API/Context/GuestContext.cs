using System.Data.Entity;
using System.Data.Entity.Migrations;
using Wijnlanden.API.Models.Enums;

namespace Wijnlanden.API.Context {
    public class GuestContext : DbContext {
        public DbSet<GuestModel> Guests { get; set; }
        public GuestContext(IConfiguration configuration) : base(configuration.GetConnectionString("DefaultConnection")) {

        }

        public void Update(GuestModel guest) {
            Guests.AddOrUpdate(guest);
        }

        public GuestModel GetGuestByCode(string code) {
            return Guests.AsNoTracking().SingleOrDefault(guest => guest.Code == code)!;
        }

        public GuestModel GetGuestByID(Guid ID) {
            return Guests.AsNoTracking().SingleOrDefault(guest => guest.ID == ID)!;
        }

        public void AddGuest(GuestModel guest) {
            Guests.Add(guest);
        }

        public void AddGuests(List<GuestModel> guests) {
            Guests.AddRange(guests);
        }

        public List<GuestModel> AllGuests() {
            return Guests.AsNoTracking().ToList();
        }
    }
}
