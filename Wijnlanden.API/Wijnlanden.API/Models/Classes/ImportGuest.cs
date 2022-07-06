namespace Wijnlanden.API.Models.Classes {
    public class ImportGuest {
        public ImportGuest(Guest guest) {
            Guest = guest;
        }
        public string ID { get; set; } = string.Empty;
        public string? PartnerID { get; set; }
        public Guest Guest { get; set; }
    }
}
