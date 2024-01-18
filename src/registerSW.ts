import { registerSW } from "virtual:pwa-register";
// its type-definitions are added in vite-env.d.ts

/* const updateSW = */ registerSW({
  onRegisteredSW(_swScriptUrl, _swReg) {
    console.log("onRegisteredSW");
  },

  // Prompt for update/reload 
  //   /**
  //    * Callback called when new version of the app is ready/available.
  //    * Here we could show a special UI so user could decide whether to immediately switch to it,
  //    * (e.g. this means to make let the new SW take control).
  //    * When all browser windows/tabs with the app a closed
  //    * and then opened again the new version will take control anyway,
  //    * so this here is to make the user decide to do it immediately.
  //    */
  //   onNeedRefresh() {
  //     console.log("onNeedRefresh");
  //     updateSW();
  //   },

  // This will reload all windows/tabs once new version is detected
  // The disadvantage of using this behavior is that the user can lose data
  // in any browser windows/tabs in which the application is open and is filling in a form.
  immediate: true,
});
