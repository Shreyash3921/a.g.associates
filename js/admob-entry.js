import { AdMob, BannerAdPosition, BannerAdSize } from "@capacitor-community/admob";
import { Capacitor } from "@capacitor/core";

const adUnitId = "ca-app-pub-5426211879614797/4380905113";

async function showTopBanner() {
  if (!Capacitor.isNativePlatform() || Capacitor.getPlatform() !== "android") return;

  try {
    await AdMob.initialize();
    await AdMob.addListener("bannerAdSizeChanged", ({ height }) => {
      document.body.style.paddingTop = `${height}px`;
    });
    await AdMob.addListener("bannerAdFailedToLoad", error => {
      console.error("AdMob banner failed to load", error);
    });
    await AdMob.showBanner({
      adId: adUnitId,
      adSize: BannerAdSize.ADAPTIVE_BANNER,
      position: BannerAdPosition.TOP_CENTER,
      isTesting: true
    });
  } catch (error) {
    console.error("Unable to initialize the AdMob banner", error);
  }
}

void showTopBanner();
