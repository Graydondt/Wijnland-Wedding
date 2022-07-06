using System.Data.Entity;
using System.Data.Entity.Migrations;
using Wijnlanden.API.Context.Models;
using Wijnlanden.API.Models.Enums;

namespace Wijnlanden.API.Context {
    public class EmailContext : DbContext {
        public DbSet<EmailModel> Emails { get; set; }
        public EmailContext(IConfiguration configuration) : base(configuration.GetConnectionString("DefaultConnection")) {

        }

        public void QueueEmail(EmailModel email) {
            email.Status = EmailStatus.Pending;
            Emails.Add(email);
        }

        public void UpdateEmail(EmailModel email) {
            Emails.AddOrUpdate(email);
        }

        public List<EmailModel> GetEmailQueue(EmailQueueType type) {
            return Emails.AsNoTracking().Where(email => email.Status == EmailStatus.Pending && email.QueueType == type).ToList();
        }

        public EmailModel? GetQueuedReminderEmail(Guid guestID) {
            return Emails.AsNoTracking().FirstOrDefault(email => email.Guest_ID == guestID && email.QueueType == EmailQueueType.Reminder);
        }

        public EmailModel? GetQueuedConfirmationEmail(Guid guestID) {
            return Emails.AsNoTracking().FirstOrDefault(email => email.Guest_ID == guestID && email.QueueType == EmailQueueType.Confirmation);
        }
    }
}
