using Microsoft.AspNetCore.Mvc;
using Wijnlanden.API.Models.Classes;
using Wijnlanden.API.Services;

namespace Wijnlanden.API.Controllers {
    [ApiController]
    [Route("api/[controller]")]
    public class GuestController : ControllerBase {
        private readonly GuestService _guestService;
        public GuestController(GuestService guestService) {
            _guestService = guestService;
        }

        [HttpGet("GetGuest")]
        public IActionResult GetGuest(string code) {
            var guest = _guestService.GetGuest(code);
            if (guest is null) {
                return new NoContentResult();
            }
            return new ObjectResult(guest);
        }

        [HttpPost("AddGuest")]
        public IActionResult AddGuest([FromBody] Guest guest) {
            //TODO: This is an absolute hack, but was so much faster to implement, [Authorization] pattern should be used here
            if (string.IsNullOrWhiteSpace(Request.Headers["lolo"]) || Request.Headers["lolo"] != "Wakka") {
                return new UnauthorizedObjectResult(false);
            }

            if (guest is null) {
                return new EmptyResult();
            }
            _guestService.AddGuest(guest);

            return new ObjectResult(true);
        }

        [HttpGet("ImportGuestList")]
        public IActionResult ImportGuestList() {
            _guestService.ImportGuestList();
            return new OkResult();
        }

        [HttpPost("UpdateGuest")]
        public IActionResult UpdateGuest([FromBody] Guest guest) {
            _guestService.UpdateGuest(guest);
            return new OkResult();
        }
    }
}
