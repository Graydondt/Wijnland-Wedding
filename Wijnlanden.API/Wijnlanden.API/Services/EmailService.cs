using System.Data.Entity;
using System.Net;
using System.Net.Mail;
using System.Text;
using System.Text.RegularExpressions;
using Wijnlanden.API.Context;
using Wijnlanden.API.Context.Models;
using Wijnlanden.API.Models.Classes;
using Wijnlanden.API.Models.Enums;

namespace Wijnlanden.API.Services {
    public class EmailService {
        private readonly ILogger<EmailService> _logger;
        private string _confirmationTemplate = string.Empty;
        private string _reminderTemplate = string.Empty;

        private readonly IConfiguration _configuration;

        public EmailService(ILogger<EmailService> logger, IConfiguration configuration) {
            _logger = logger;
            _configuration = configuration;
        }

        public List<EmailModel> GetEmailsInQueue(EmailQueueType type) {
            try {
                using (var context = new EmailContext(_configuration)) {
                    return context.GetEmailQueue(type);
                }
            } catch (Exception ex) {
                _logger.LogError("Failed to Get Emails in Queue", ex);
                return new List<EmailModel>();
            }

        }

        public void QueueEmail(EmailModel email) {
            try {
                using (var context = new EmailContext(_configuration)) {
                    context.QueueEmail(email);
                    context.SaveChanges();
                }
            } catch (Exception ex) {
                _logger.LogError("Failed to Queue Email", ex);
            }

        }

        public EmailModel? GetReminderEmail(Guid guestID) {
            try {
                using (var context = new EmailContext(_configuration)) {
                    return context.GetQueuedReminderEmail(guestID);
                }
            } catch (Exception ex) {
                _logger.LogError("Failed to Get Emails in Queue", ex);
                return null;
            }

        }

        public EmailModel? GetConfirmationEmail(Guid guestID) {
            try {
                using (var context = new EmailContext(_configuration)) {
                    return context.GetQueuedConfirmationEmail(guestID);
                }
            } catch (Exception ex) {
                _logger.LogError("Failed to Get Confirmation Email", ex);
                return null;
            }

        }

        public void DeleteEmail(EmailModel email) {
            try {
                using (var context = new EmailContext(_configuration)) {
                    context.Entry(email).State = EntityState.Deleted;
                    context.SaveChanges();
                }
            } catch (Exception ex) {
                _logger.LogError("Failed to Delete Email", ex);
            }

        }

        public void UpdateEmails(List<EmailModel> emails) {
            try {
                using (var context = new EmailContext(_configuration)) {
                    foreach (var email in emails) {
                        context.UpdateEmail(email);
                    }
                    context.SaveChanges();
                }
            } catch (Exception ex) {
                _logger.LogError("Failed to Update Email", ex);
            }

        }


        public void SendEmail(EmailModel email, EmailQueueType type) {
            try {
                //Outlook
                //dutoit.wedding@outlook.com
                //wH@tL0v3r$Do

                //Gmail
                //"rsvp.wijnland.dutoits@gmail.com", "wH@tL0v3r$Do"
                using (var smtpClient = new SmtpClient("smtp-mail.outlook.com") { Port = 25, Credentials = new NetworkCredential("dutoit.wedding@outlook.com", "wH@tL0v3r$Do"), EnableSsl = true }) {
                    var message = GenerateMessage(email.Email, email.ToName, email.ToSurname, email.Code, type);
                    smtpClient.Send(message);
                }
            } catch (Exception ex) {
                _logger.LogError("Failed to Send Email", ex);
            }

        }

        public void SendTestEmail(string toEmail, string name, string surname, bool reminder = false) {
            try {
                using (var smtpClient = new SmtpClient("smtp-mail.outlook.com") { Port = 25, Credentials = new NetworkCredential("dutoit.wedding@outlook.com", "wH@tL0v3r$Do"), EnableSsl = true }) {
                    var message = GenerateMessage(toEmail, name, surname, "default code", reminder ? EmailQueueType.Reminder : EmailQueueType.Confirmation);
                    smtpClient.Send(message);
                }
            } catch (Exception ex) {
                var message = "Failed to Get Emails in Queue";
                _logger.LogError(message, ex);
                throw new Exception(message, ex);
            }

        }

        private MailMessage GenerateMessage(string toEmail, string toName, string toSurname, string code, EmailQueueType type) {

            try {
                var message = new MailMessage();
                message.To.Add(toEmail);
                message.From = new MailAddress("dutoit.wedding@outlook.com", "#DuToitWedding");
                //message.ReplyToList.Add("graydondt@gmail.com");
                var name = $"{toName} {toSurname}";


                try {
                    if (type == EmailQueueType.Reminder && string.IsNullOrWhiteSpace(_reminderTemplate)) {
                        string filePath = Path.Combine(Environment.CurrentDirectory, @"Assets\EmailTemplates", "Reminder-Template.html");
                        _reminderTemplate = File.ReadAllText(filePath);
                    } else if (string.IsNullOrWhiteSpace(_confirmationTemplate)) {
                        string filePath = Path.Combine(Environment.CurrentDirectory, @"Assets\EmailTemplates", "RSVP-Template.html");
                        _confirmationTemplate = File.ReadAllText(filePath);
                    }

                } catch (Exception ex) {
                    throw new Exception("Failed to read template", ex);
                }

                var builder = new StringBuilder();

                switch (type) {
                    case EmailQueueType.Confirmation:
                        message.Subject = $"Thank you - {name}";
                        builder.Append(_confirmationTemplate);

                        break;
                    case EmailQueueType.Reminder:
                        message.Subject = $"{name} - Remember to RSVP";
                        builder.Append(_reminderTemplate);
                        break;
                    default:
                        throw new Exception($"Queue Type {type} not supported");
                }


                var template = builder.ToString();
                Regex nameRegex = new Regex(@"\<\#[NAME]*\#\>", RegexOptions.Multiline);
                Regex codeRegex = new Regex(@"\<\#[CODE]*\#\>", RegexOptions.Multiline);

                template = nameRegex.Replace(template, name.ToUpper());
                template = codeRegex.Replace(template, code.ToUpper());


                message.Body = template;
                message.IsBodyHtml = true;

                return message;
            } catch (Exception ex) {

                throw new Exception("Failed to generate email message", ex);
            }


        }
    }
}
