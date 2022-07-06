namespace Wijnlanden.API.Models.Classes {
    public class FoodData {
        public string CategoryName { get; set; } = "Unknown";
        public Dictionary<string, int> Data { get; set; } = new Dictionary<string, int>();
    }
}
