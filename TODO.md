# TODOs

- [x] Style the `FullCalendar` - with plain CSS (use the ChakraUI CSS properties)
  - [ ] ~~Support dark theme~~
- [x] Delete a competition/event - admin only - with confirm
- [x] Edit a competition/event - admin onl - with a popup
- [x] Mobile UI
- [x] Make it PWA - at least support for "standalone-app"
- [x] Show competition's info when clicked
- [ ] Localization to BG (+dates)
- [ ] Login with Facebook

## Smaller bugs/tasks

- [ ] Check/fix/remove the `Github Actions` - as it deploys also, but with old
- [x] Add "loading" UI when loading the competitions
- [x] Make balkan/international checkboxes act like radio-buttons (but allow none to be checked)
- [ ] Currently FullScreen event-click happens only on the first day of the event, but if it's longer then clicking on the other days don't call this event-handler ( I think the theres's other divs that absorb the click-event)
- [x] Make `Copyright` component be shown better - always at the normally at the bottom as last element if there is vertical scrollbar, and as fixed at the bottom otherwise

## Optional (if requested)

- [ ] Integrate `Google Calendar API` - first user has to authorize an OAuth App
  - [ ] Publish the OAuth app to Google otherwise only test users could use it
  - [x] Try to connect in the same time to Firebase if possible like if used GIS (GoogleIdentityServices)
- [ ] Search
- [ ] List view
- [ ] Multiple months on mobile when shown as single-month-calendar - e.g. show 12 months not one scrollable small widget
- [ ] Remainder - Push notifications
  
  sf