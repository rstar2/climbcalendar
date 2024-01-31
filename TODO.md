# TODOs

- [x] Style the `FullCalendar` - with plain CSS (use the ChakraUI CSS properties)
- [x] Delete a competition/event - admin only - with confirm
- [x] Edit a competition/event - admin onl - with a popup
- [x] Mobile UI
- [x] Make it PWA - at least support for "standalone-app"
- [x] Show competition's info when clicked
- [x] Add BG-only filter

## Bugs/Tasks

- [x] Check/fix/disable the `Github Actions` - as it deploys also, but with old
    > There are no valid environment variables (no .env files). The solution is to add such `variables` on repository level, similar to `secrets`. But no such need, so I've disabled the workflow completely in GitHub
- [x] Add "loading" UI when loading the competitions
- [x] Make balkan/international checkboxes act like radio-buttons (but allow none to be checked)
- [x] Currently FullScreen event-click happens only on the first day of the event, but if it's longer then clicking on the other days don't call this event-handler ( I think the theres's other divs that absorb the click-event)
- [x] Make `Copyright` component be shown better - always at the normally at the bottom as last element if there is vertical scrollbar, and as fixed at the bottom otherwise
- [x] Make the competition filter be more mobile friendly - open it as a drawer for instance
- [x] Add a margin at the bottom - make only the "competitions view" scrollable, not the whole page
- [x] Localize the errors for the Formik forms, e.g the Zod errors
- [x] Make the Mobile Landscape case look better - just make the whole page scrollable, not just the competitions-view
- [x] Allow Landscape mode for the PWA version
- [x] Localize the initial "loading..." fallback in the Router - use a caching layer for `i18n`

## Features

- [x] Calendar/List/Table views - options to select one and store it in localStorage
- [x] Print - only of the competitions view - add custom "Print" button
- [x] Multiple months on mobile when shown as single-month-calendar - use height="auto"
- [x] For Admins only - Click on an empty date from the calendar to trigger "Add" route with the preselected date
- [x] Localization to BG (+dates/fullcalendar/formik-errors)
- [x] Login with Facebook (works but with warn on the Facebook Login popup as the created Facebook oauth app is not "verified")
- [ ] Custom events per user - any auth user to be able to add his own ones and combine them in the calendar view. Useful for planning trips and etc...

## Optional (if requested)

- [ ] Integrate `Google Calendar API` - first user has to authorize an OAuth App
  - [ ] Publish the OAuth app to Google otherwise only test users could use it
  - [x] Try to connect in the same time to Firebase if possible like if used GIS (GoogleIdentityServices)
- [ ] Publish the Facebook OAuth app (it requires some business verification) so that the warning t go away
- [ ] Remainder for incoming competitions - Push notifications  
- [ ] Search by token in the name
- [ ] Support dark theme for the `FullCalendar`, e.g. when Chakra dark theme then apply different styles to `FullCalendar`
