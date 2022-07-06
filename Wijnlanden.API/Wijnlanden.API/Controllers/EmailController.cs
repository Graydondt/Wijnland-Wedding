using Microsoft.AspNetCore.Mvc;
using Wijnlanden.API.Services;

namespace Wijnlanden.API.Controllers {
    [Route("api/[controller]")]
    [ApiController]
    public class EmailController : ControllerBase {
        private readonly ILogger<EmailController> _logger;
        private readonly EmailService _emailService;

        public EmailController(ILogger<EmailController> logger, EmailService emailService) {
            _logger = logger;
            _emailService = emailService;
        }

        [HttpGet("SendTestEmail")]
        public IActionResult SendTestEmail(string email, string name, string surname) {
            _emailService.SendTestEmail(email, name, surname);

            return new OkResult();
        }
    }
}
