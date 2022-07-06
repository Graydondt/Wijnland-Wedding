# Wijnland
This project was created to allow guests to RSVP for a wedding in a simple and fun way. Special care was taken to alow for this website to function smoothly on mobile devices as well as desktop.
## Technical
UI = Angular 13.2.0<br>
API = C# .Net 6

Angular Material was used for styling.

## Configuration
You can find a appsettings.json file in the `Wijnlanden.UI` assets folder with the following properties:

| Property | Description |
| ----------- | ----------- |
| api_url | This property should be the URL of where your `Wijnlanden.API` project is hosted |
| google_maps_api_key | This property is used to register your instance of the google maps library to your google account |


# Login
Login is handled by entering a pre-generated code that is unique to each guest. This code gets generated at the point where your guest list gets imported.

Your login code gets cached so you don’t need to log in again after initial login.

After a successful login and the guest has already RSVP'd, they will be redirected to the Home page, else they will be redirected to the RSVP wizard.

![Mobile login](/Readme%20assets/Mobile_Login.gif)

# RSVP Wizard
## Guest confirmation
If the guest has a partner, both the guest and the partner's name will be visible and changes to dialog options.
I.e., If you have a partner, you are allowed to RSVP for that partner and vote for food on that partners behalf. But only the partner can change their choices after the initial RSVP.

If the guest has the option to add a +1, a button will appear where they can then capture their +1's details and will then on next login appear as the guest's partner.

There are 3 RSVP options:

1. Yes
2. No
3. Maybe

![Guest confirmation](/Readme%20assets/RSVP_Main.JPG)

If they selected 'Maybe', the guest will be prompted to indicate if they want a reminder sent to them via email.
If they select 'No', the guest will be returned to the login screen
If they select 'Yes', the guest will be allowed to continue with the wizard to the Food Selection step

## Food Selection
Here the guest can cast his/her vote for what foods they would like to eat at the venue.
![Food choices](/Readme%20assets/RSVP_Food_Choices.JPG)
![voting](/Readme%20assets/RSVP_Food_Vote.JPG)

## Quiz
Here the guest will partake in a small quiz about the couple, to give the guest some insight into the couple's lives and also sets up precedent to win a prize.
*Note - This quiz is limited to only one play

After successful completion, a confirmation email is sent to the guest and will then be routed to the home page.
![Email template](/Readme%20assets/RSVP_Email_Confirmation.JPG)

# Home
Here the guest will be presented with a countdown till the day of the wedding, along with nice to know information about the wedding (i.e., The Venue location, time, date, etc...)

The home page is split into 4 sections:

![Mobile home page](/Readme%20assets/Mobile_Home_Page.gif)

### About
The number of days left and the ability to change your rsvp details

### Results
The real time results for each food category that other guests have voted for
![Food results](/Readme%20assets/Main_Food_Results.JPG)

### Venue
Details about the venue with a location using google maps

### Lodging
All nearby hotels/air bnb's close to the venue, complete with stats on how far the venue is, as well as a button to open a google maps page with the coords already populated.
This section is completely done using google maps api.

