using Wijnlanden.API.Context;
using Wijnlanden.API.Models.Classes;

namespace Wijnlanden.API.Services {
    public class FoodService {
        private readonly GuestService _guestService;
        public FoodService(GuestService guestService) {
            _guestService = guestService;
        }

        public List<FoodData> getFoodData() {
            try {

                var results = new List<FoodData>();
                var guests = _guestService.GetAllGuests();
                Dictionary<string, int> canapes = new Dictionary<string, int>();
                Dictionary<string, int> mains = new Dictionary<string, int>();
                Dictionary<string, int> sides = new Dictionary<string, int>();
                Dictionary<string, int> desserts = new Dictionary<string, int>();
                foreach (var guest in guests) {
                    foreach (var canape in guest.Canapes) {
                        if (canapes.ContainsKey(canape)) {
                            canapes[canape]++;
                        } else {
                            canapes.Add(canape, 1);
                        }
                    }
                    foreach (var main in guest.Mains) {
                        if (mains.ContainsKey(main)) {
                            mains[main]++;
                        } else {
                            mains.Add(main, 1);
                        }
                    }
                    foreach (var side in guest.Sides) {
                        if (sides.ContainsKey(side)) {
                            sides[side]++;
                        } else {
                            sides.Add(side, 1);
                        }
                    }
                    foreach (var dessert in guest.Desserts) {
                        if (desserts.ContainsKey(dessert)) {
                            desserts[dessert]++;
                        } else {
                            desserts.Add(dessert, 1);
                        }
                    }
                }

                var canapeResult = new FoodData() {
                    CategoryName = "Canapes",
                    Data = canapes.OrderByDescending(item => item.Value).Take(3).ToDictionary(item => item.Key, item => item.Value)
                };
                var mainsResult = new FoodData() {
                    CategoryName = "Mains",
                    Data = mains.OrderByDescending(item => item.Value).Take(3).ToDictionary(item => item.Key, item => item.Value)
                };
                var sidesResult = new FoodData() {
                    CategoryName = "Sides",
                    Data = sides.OrderByDescending(item => item.Value).Take(3).ToDictionary(item => item.Key, item => item.Value)
                };
                var dessertsResult = new FoodData() {
                    CategoryName = "Desserts",
                    Data = desserts.OrderByDescending(item => item.Value).Take(3).ToDictionary(item => item.Key, item => item.Value)
                };

                return new List<FoodData>() { canapeResult, mainsResult, sidesResult, dessertsResult };

            } catch (Exception) {

                throw;
            }

        }
    }
}
