using System.Data.Entity;
using Wijnlanden.API.Context;
using Wijnlanden.API.Context.Models;
using Wijnlanden.API.Models.Classes;
using Wijnlanden.API.Models.Enums;

namespace Wijnlanden.API.Services {
    public class GuestService {
        private readonly ImportService _importService;
        private readonly IConfiguration _configuration;
        private readonly EmailService _emailService;

        public static List<string> codes = new List<string>();
        public GuestService(ImportService importService, IConfiguration configuration, EmailService emailService) {
            _importService = importService;
            _configuration = configuration;
            _emailService = emailService;
        }

        public Guest? GetGuest(string code) {
            try {
                using (var context = new GuestContext(_configuration)) {
                    var model = context.GetGuestByCode(code);
                    if (model is null) { return null; }
                    codes.Add(model.Code);
                    var guest = (Guest)model;
                    if (model.Partner_ID.HasValue) {
                        Guid partnerID = Guid.Parse(model.Partner_ID.ToString()!);
                        var partnerModel = context.GetGuestByID(partnerID);
                        if (partnerModel is not null) {
                            guest.Partner = (Guest)partnerModel;
                            if (guest.Partner.AddedFromRSVP) {
                                guest.Partner.Done = true;
                            }
                        }
                    }
                    return guest;
                }
            } catch (Exception) {

                throw;
            }
        }

        public void AddGuest(Guest guest) {
            try {
                using (var context = new GuestContext(_configuration)) {
                    var model = (GuestModel)guest;
                    context.AddGuest(model);
                    context.SaveChanges();
                }
            } catch (Exception) {
                throw;
            }
        }


        public List<Guest> GetAllGuests() {
            try {
                var guests = new List<Guest>();
                using (var context = new GuestContext(_configuration)) {
                    var model = context.AllGuests();
                    foreach (var guestModel in model) {
                        var guest = (Guest)guestModel;
                        guests.Add(guest);
                    }
                    return guests;
                }
            } catch (Exception) {

                throw;
            }
        }

        public void UpdateGuest(Guest guest, bool firstIteration = true) {
            try {
                using (var context = new GuestContext(_configuration)) {
                    GuestModel model;
                    EmailModel existingReminderEmail;
                    if (guest.Done) {
                        model = context.GetGuestByID(guest.ID);
                        switch (guest.RSVP) {
                            case Rsvp.Yes:
                                if (model.RSVP == guest.RSVP) {
                                    break;
                                }

                                existingReminderEmail = _emailService.GetReminderEmail(guest.ID)!;

                                if (existingReminderEmail is not null && existingReminderEmail.Status == EmailStatus.Pending) {
                                    _emailService.DeleteEmail(existingReminderEmail);
                                }

                                guest.sendReminder = false;
                                var confirmEmail = new EmailModel() {
                                    Email = model.Email,
                                    Guest_ID = model.ID,
                                    ToName = model.Name,
                                    ToSurname = model.Surname,
                                    Code = model.Code,
                                    QueueType = EmailQueueType.Confirmation
                                };

                                _emailService.QueueEmail(confirmEmail);
                                break;

                            case Rsvp.No:
                                guest.sendReminder = false;
                                existingReminderEmail = _emailService.GetReminderEmail(guest.ID)!;

                                if (existingReminderEmail is not null && existingReminderEmail.Status == EmailStatus.Pending) {
                                    _emailService.DeleteEmail(existingReminderEmail);
                                }

                                break;
                            case Rsvp.Maybe:
                                if (model.RSVP == guest.RSVP) {
                                    break;
                                }

                                existingReminderEmail = _emailService.GetReminderEmail(guest.ID)!;
                                if (guest.sendReminder) {

                                    if (existingReminderEmail is not null && (existingReminderEmail.Status == EmailStatus.Failed)) {
                                        existingReminderEmail.Status = EmailStatus.Pending;
                                        existingReminderEmail.StatusReason = String.Empty;
                                        var eList = new List<EmailModel>() { existingReminderEmail };
                                        _emailService.UpdateEmails(eList);
                                    } else if (existingReminderEmail is null) {
                                        var reminderEmail = new EmailModel() {
                                            Email = model.Email,
                                            Guest_ID = model.ID,
                                            ToName = model.Name,
                                            ToSurname = model.Surname,
                                            Code = model.Code,
                                            QueueType = EmailQueueType.Reminder
                                        };

                                        _emailService.QueueEmail(reminderEmail);
                                    }
                                } else if (guest.sendReminder == false && existingReminderEmail is not null && existingReminderEmail.Status == EmailStatus.Pending) {
                                    _emailService.DeleteEmail(existingReminderEmail);
                                }
                                break;
                            case Rsvp.Unknown:
                            default:
                                break;
                        }
                    }

                    model = (GuestModel)guest;

                    context.Entry(model).State = EntityState.Modified;
                    if (string.IsNullOrWhiteSpace(model.Email)) {
                        context.Entry(model).Property(prop => prop.Email).IsModified = false;
                    } else if (!string.IsNullOrWhiteSpace(model.Email)) {
                        var email = new EmailModel() { Email = guest.Email, Guest_ID = guest.ID, ToName = guest.Name, ToSurname = guest.Surname, Code = guest.Code };
                        if (guest.sendReminder) {
                            email.QueueType = EmailQueueType.Reminder;
                        }
                        _emailService.QueueEmail(email);
                    }

                    if (model.Partner_ID is null) {

                        context.Entry(model).Property(prop => prop.Partner_ID).IsModified = false;
                    }

                    context.Update(model);
                    context.SaveChanges();
                    if (firstIteration && guest.Partner is not null && (!guest.Partner.Done || guest.Partner.AddedFromRSVP)) {
                        if (guest.Partner.AddedFromRSVP) {
                            guest.Partner.RSVP = guest.RSVP;
                        }
                        if (guest.Partner.Partner is null) {
                            guest.Partner.Partner = guest;
                        }
                        this.UpdateGuest(guest.Partner, false);
                    }

                }
            } catch (Exception) {

                throw;
            }
        }

        public void ImportGuestList() {
            try {
                var guests = _importService.ImportGuestList();
                using (var context = new GuestContext(_configuration)) {
                    var models = guests.Select(guest => (GuestModel)guest).ToList();
                    context.AddGuests(models);
                    context.SaveChanges();
                }
            } catch (Exception) {

                throw;
            }

        }
    }
}
