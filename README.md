# Climb Calendar

- Setup with `Vite+React+TypeScript`
- `Firebase` "backend"
  - `Firestore` - as DB
  - `Authentication` -for login/auth
  - `Functions` - when a auth user is created to add custom claims - in this case role ADMIN to `neshev.rumenn@gmail.com` user
- `Google Calendar API` - to add the events to authorized user
  - Load the GAPI lib `https://apis.google.com/js/api.js` globally in `index.html`
  - For this `Firebase Auth` is not enough, the `Google Identity Services (GIS)` has to be used. Load the `https://accounts.google.com/gsi/client` lib again globally in `index.html`
  - A OAuth app has to be created in the Google Console and use it's CLIENT_ID
  - Then to authorize with the "implicit token flow" (the client only way - it only gives short-lived access token)
  - Connect the GoogleLogin to Firebase - use the `signInWithCredential(...)`
- Client routing with `TanStack Router`

## Configure a Firebase hosting

Configure a "better" looking firebase hosting site
    > Create a site `climbcalendar` either from the web-console or from the firebase CLI
    > Add a `target` (named main `here`) in ```firebase.json:hosing``` and apply it to the newly created site
       (e.g. exec ``firebase target:apply hosting main climbcalendar```)
    > Now the app will be accessible on https://climbcalendar.web.app not on the "uglier" https://climbcalendar-13b0d.web.app (the project ID main site)

## Local development

```npm run dev```

## Deploy

```npm run deploy```

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
}
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list
