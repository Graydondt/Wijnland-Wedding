using Microsoft.AspNetCore.Mvc;
using Wijnlanden.API.Models.Classes;
using Wijnlanden.API.Services;


// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Wijnlanden.API.Controllers {
    [Route("api/[controller]")]
    [ApiController]
    public class FoodController : ControllerBase {

        private readonly FoodService _foodService;

        public FoodController(FoodService foodService) {
            _foodService = foodService;
        }

        // GET: api/<FoodController>
        [HttpGet("GetFoodVotes")]
        public List<FoodData> GetFoodVotes() {
            return _foodService.getFoodData();
        }
    }
}
