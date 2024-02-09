const getMobileDetect = (userAgent: string) => {
  const isMobile = Boolean(userAgent.match(/Android|BlackBerry|iPhone|iPod|Opera Mini|IEMobile|WPDesktop/i));
  const isAndroid = Boolean(userAgent.match(/Android/i));
  const isIos = Boolean(userAgent.match(/iPhone|iPad|iPod/i));

  const isSSR = Boolean(userAgent.match(/SSR/i));

  const isDesktop = !isMobile && !isSSR;

  return {
    isSSR,
    isMobile,
    isDesktop,
    isAndroid,
    isIos,
  };
};

const supportTouch =
  "ontouchstart" in window ||
  ("DocumentTouch" in window &&
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    document instanceof (window as any).DocumentTouch);

const userAgent = typeof navigator === "undefined" ? "SSR" : navigator.userAgent;

const result = {
  ...getMobileDetect(userAgent),
  supportTouch,
};

/**
 * Actually this acts as a static utility, not a real hook as "result" is never changing,
 * but later could update it to have such logic.
 */
export default function useMobileDetect() {
  return result;
}
