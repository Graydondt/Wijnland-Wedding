using Wijnlanden.API.Models.Enums;

namespace Wijnlanden.API.Services {
    public class EmailPollingService {
        private readonly ILogger<EmailPollingService> _logger;
        private readonly EmailService _emailService;
        private readonly DateTime reminderDate = new DateTime(2022, 5, 23, 12, 0, 0);
        public EmailPollingService(ILogger<EmailPollingService> logger, EmailService emailService) {
            _logger = logger;
            _emailService = emailService;
        }

        public void PollEmailMessages() {
            try {
                new Thread(() => {
                    while (true) {
                        try {
                            this.PollConfirmations();
                        } catch (Exception ex) {
                            _logger.LogError("Failed to Poll confirmation Messages", ex);
                        }

                        try {
                            var currentDate = DateTime.Now;
                            if (currentDate.Date == reminderDate.Date && currentDate.Hour >= reminderDate.Hour) {
                                this.PollReminders();
                            }

                        } catch (Exception ex) {
                            _logger.LogError("Failed to Poll Reminder Messages", ex);
                        }

                        Thread.Sleep(60000);
                    }
                }).Start();
            } catch (Exception ex) {
                _logger.LogError("Failed to Poll Messages", ex);
            }

        }

        private void PollConfirmations() {
            var mails = _emailService.GetEmailsInQueue(EmailQueueType.Confirmation);
            if (mails is not null && mails.Count != 0) {
                foreach (var mail in mails) {
                    try {
                        _emailService.SendEmail(mail, EmailQueueType.Confirmation);
                        mail.Status = EmailStatus.Sent;
                    } catch (Exception ex) {
                        mail.Status = EmailStatus.Failed;
                        mail.StatusReason = ex.Message;
                    }
                }
                _emailService.UpdateEmails(mails);
            }
        }

        private void PollReminders() {
            var mails = _emailService.GetEmailsInQueue(EmailQueueType.Reminder);
            if (mails is not null && mails.Count != 0) {
                foreach (var mail in mails) {
                    try {
                        _emailService.SendEmail(mail, EmailQueueType.Reminder);
                        mail.Status = EmailStatus.Sent;
                    } catch (Exception ex) {
                        mail.Status = EmailStatus.Failed;
                        mail.StatusReason = ex.Message;
                    }
                }
                _emailService.UpdateEmails(mails);
            }
        }
    }
}
