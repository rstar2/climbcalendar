export type PrintOptions = {
  /**
   * CSS to be used as external link
   */
  linkCSS?: string;
  /**
   * CSS to be used as inline styles
   */
  styleCSS?: string;

  /**
   *
   */
  copyLinkCSS?: boolean;

  /**
   *
   */
  copyStyleCSS?: boolean;
};

/**
 * The default print options used when not passed
 */
const defPrintOptions: PrintOptions = {
  copyStyleCSS: true,
  copyLinkCSS: true,
};

/**
 * Show the browser's print dialog.
 * It puts desired body contents in a new window and "prints" it (browser should open the print dialog)
 * @param title the title of the print dialog
 * @param body the content of the window that will be printed
 * @param opts print options
 */
export function printBodyPopup(title: string, body: string, opts?: PrintOptions): void {
  const { linkCSS, styleCSS, copyLinkCSS, copyStyleCSS } = { ...defPrintOptions, ...opts };
  let win: Window;
  try {
    const aWin = window.open("#", title, "left=100,top=100,height=100%");
    if (!aWin) throw new Error("Cannot create a popup window for printing");
    win = aWin;
  } catch (e) {
    return alert("Print is not possible. Check if there are popup blockers installed.");
  }

  const tagsCSS: { isLink: boolean; css: string }[] = [];

  // copy all <style>...</style> and <link href="..." /> tags from the parent document
  if (copyLinkCSS || copyStyleCSS) {
    const styleAndLinkNodes = document.querySelectorAll("style, link[rel~='stylesheet']");

    styleAndLinkNodes.forEach((node) => {
      if (node.tagName.toLowerCase() === "style") {
        // <style> nodes
        const sheet = (node as HTMLStyleElement).sheet as CSSStyleSheet;
        // NOTE: for-of is not supported by IE
        try {
          let aStyleCSS = "";
          // Accessing `sheet.cssRules` on cross-origin sheets can throw
          // security exceptions in some browsers, notably Firefox
          // https://github.com/gregnb/react-to-print/issues/429
          const cssLength = sheet.cssRules.length;
          for (let j = 0; j < cssLength; ++j) {
            if (typeof sheet.cssRules[j].cssText === "string") {
              aStyleCSS += `${sheet.cssRules[j].cssText}\r\n`;
            }
          }
          tagsCSS.push({ isLink: false, css: aStyleCSS });
        } catch (error) {
          // nothing
        }
      } else {
        // <link> nodes, and any others
        const href = node.getAttribute("href");
        if (href && !node.hasAttribute("disabled")) tagsCSS.push({ isLink: true, css: href });
      }
    });
  }

  // add any explicitly desired to be put style or link CSS
  if (linkCSS) tagsCSS.push({ isLink: true, css: linkCSS });
  if (styleCSS) tagsCSS.push({ isLink: false, css: styleCSS });

  const html = `
    <html>
        <head>
            <title>${title}</title>
            ${tagsCSS
              .map(({ isLink, css }) =>
                isLink ? `<link href="${css}" rel="stylesheet" type="text/css" media="all" >` : `<style>${css}</style>`
              )
              .join(" ")}

            <script>
                function checkState() {
                    if (document.readyState === "complete") {
                        window.close()
                    } else {
                        setTimeout(checkState, 500);
                    }
                }
            </script>
        </head>
        <body style="height: auto !important;" onload="window.print(); checkState();">
            ${body}
        </body>
    </html>
    `;

  // it will auto call document.open()
  win.document.write(html);
  win.document.close();
}

/**
 * Show the browser's print dialog using iFrame approach.
 * It puts desired body contents in a new hidden iFrame window and "prints" it (browser should open the print dialog).
 * After print() exit the iframe will be auto closed/removed.
 * See https://jira2.cnexus.com/browse/FF-9364
 * Got ideas from https://developer.mozilla.org/en-US/docs/Web/Guide/Printing#using_media_queries_to_improve_layout
 * @param title the title of the print dialog
 * @param body the content of the window that will be printed
 * @param opts print options
 */
export function printBodyIFrame(title: string, body: string, opts?: PrintOptions): void {
  const { linkCSS, styleCSS, copyLinkCSS = true, copyStyleCSS = true } = { ...defPrintOptions, ...opts };

  // Remove old if exists, in theory it should be removed in closePrint but for safety
  document.getElementById("printFrame")?.remove();

  // <iframe id='printFrame' width='0' height='0'></iframe>
  const iFrame = document.createElement("iframe");
  iFrame.setAttribute("id", "printFrame");
  iFrame.setAttribute("width", "0");
  iFrame.setAttribute("height", "0");
  iFrame.setAttribute("title", title);

  // Add listener when load to inject content
  iFrame.onload = () => {
    const win = iFrame.contentWindow!;
    const doc = win.document;

    doc.title = title;
    doc.body.innerHTML = body;

    // To remove iFrame when print finished
    const closePrint = (): void => {
      iFrame.remove();
    };
    win.onbeforeunload = closePrint;
    win.onafterprint = closePrint;

    const images = doc.querySelectorAll("img");
    images.forEach((_image) => {
      // Moreover ensure proper scale when it's a single image in the body
      // Alternative of object-fit to fit image to content
      // https://stackoverflow.com/questions/15685666/changing-image-sizes-proportionally-using-css
      // I cannot make this to work on Chrome, neither object-fit works properly :(
      // if (images.length === 1 && iFrame.width > 0 && iFrame.height > 0) {
      //     var isLandscape = iFrame.width > iFrame.height;
      //     this.style.width = isLandscape ? "100%" : "auto";
      //     this.style.height = isLandscape ? "auto" : "100%";
      // }

      // image loaded - request print dlg
      checkAllLoaded();
    });
    let countLoaded = images.length;
    const checkAllLoaded = (): void => {
      countLoaded--;
      if (countLoaded <= 0) {
        //win.focus(); // Required for IE
        win.print();
      }
    };

    const addLink = (aLinkCSS: string): void => {
      countLoaded++;
      const link = doc.createElement("link");
      link.rel = "stylesheet";
      link.type = "text/css";
      link.href = aLinkCSS;
      // wait for the link to load also
      link.onload = checkAllLoaded;
      doc.head.appendChild(link);
    };
    const addStyle = (aStyleCSS: string): void => {
      const style = doc.createElement("style");
      style.innerText = aStyleCSS;
      doc.head.appendChild(style);
    };

    // copy all <style>...</style> and <link href="..." /> tags from the parent document
    if (copyLinkCSS || copyStyleCSS) {
      const styleAndLinkNodes = document.querySelectorAll("style, link[rel~='stylesheet']");

      styleAndLinkNodes.forEach((node) => {
        if (node.tagName.toLowerCase() === "style") {
          // <style> nodes
          const sheet = (node as HTMLStyleElement).sheet as CSSStyleSheet;
          // NOTE: for-of is not supported by IE
          try {
            let aStyleCSS = "";
            // Accessing `sheet.cssRules` on cross-origin sheets can throw
            // security exceptions in some browsers, notably Firefox
            // https://github.com/gregnb/react-to-print/issues/429
            const cssLength = sheet.cssRules.length;
            for (let j = 0; j < cssLength; ++j) {
              if (typeof sheet.cssRules[j].cssText === "string") {
                aStyleCSS += `${sheet.cssRules[j].cssText}\r\n`;
              }
            }
            const style = doc.createElement("style");
            style.innerText = aStyleCSS;
            doc.head.appendChild(style);
          } catch (error) {
            // nothing
          }
        } else {
          // <link> nodes, and any others
          const href = node.getAttribute("href");
          if (href && !node.hasAttribute("disabled")) addLink(href);
        }
      });
    }

    if (linkCSS) addLink(linkCSS);

    if (styleCSS) addStyle(styleCSS);

    // if not external resource (images, links) the print, otherwise the print should be triggered when
    // they are all loaded
    if (!countLoaded) checkAllLoaded();
  };

  // Add new one. Do this at the end after attach listener otherwise it does not work on Chrome
  document.body.appendChild(iFrame);
}

/**
 * Show the browser's print dialog with  the contents of a {@link HTMLElement} in the "printable" dialog.
 * See {@link printBodyPopup} and {@link printBodyIFrame}.
 * @param title the title of the print dialog
 * @param el the {@link HTMLElement} whose contents will be printed
 * @param opts print options
 * @param useIFrame whether to use IFrame or popup.
 * The popup window loads first as new window and then opens the print dialog - can print multiple pages
 * The IFrame doesn't open and immediately opens the print dialog - can print single pages, the rest are not visible for some reason
 */
export function printElement(
  title: string,
  el: HTMLElement,
  opts?: PrintOptions & { isInner?: boolean },
  useIFrame = false
): void {
  const body = opts?.isInner ? el.innerHTML : el.outerHTML;
  if (useIFrame) printBodyIFrame(title, body, opts);
  else printBodyPopup(title, body, opts);
}
