using Wijnlanden.API.Models.Enums;

namespace Wijnlanden.API.Context.Models {
    public class EmailModel {
        public Guid ID { get; set; } = Guid.NewGuid();
        public string Email { get; set; } = string.Empty;
        public string ToName { get; set; } = String.Empty;
        public string ToSurname { get; set; } = String.Empty;
        public string Code { get; set; } = String.Empty;
        public EmailQueueType QueueType { get; set; } = EmailQueueType.Confirmation;
        public EmailStatus Status { get; set; } = EmailStatus.Pending;
        public string StatusReason { get; set; } = string.Empty;

        public DateTime Created { get; set; } = DateTime.Now;

        public Guid Guest_ID { get; set; }
    }
}
