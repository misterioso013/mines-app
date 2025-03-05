import { useEffect, useState } from 'react';
import mobileAds, { InterstitialAd, AdEventType, TestIds } from 'react-native-google-mobile-ads';

const interstitialId = process.env.EXPO_PUBLIC_ADMOB_INTERSTITIAL_ID_ANDROID ?? TestIds.INTERSTITIAL;

let playCount = 0;
let nextAdThreshold = Math.floor(Math.random() * (10 - 7 + 1)) + 7;

export const useAds = () => {
  const [interstitialAd, setInterstitialAd] = useState<InterstitialAd | null>(null);

  useEffect(() => {
    mobileAds()
      .initialize()
      .then(adapterStatuses => {
        // Inicialização concluída
      });
  }, []);

  const loadInterstitial = () => {
    const interstitial = InterstitialAd.createForAdRequest(interstitialId, {
      keywords: ['game', 'casual', 'mines'],
    });

    interstitial.addAdEventListener(AdEventType.LOADED, () => {
      setInterstitialAd(interstitial);
    });

    interstitial.addAdEventListener(AdEventType.CLOSED, () => {
      setInterstitialAd(null);
    });

    interstitial.load();
  };

  const showInterstitialIfReady = async () => {
    playCount++;
    
    if (playCount >= nextAdThreshold) {
      if (!interstitialAd) {
        loadInterstitial();
        return;
      }

      if (interstitialAd.loaded) {
        await interstitialAd.show();
        playCount = 0;
        nextAdThreshold = Math.floor(Math.random() * (10 - 7 + 1)) + 7;
      }
    }
  };

  useEffect(() => {
    loadInterstitial();
    return () => {
      interstitialAd?.removeAllListeners();
    };
  }, []);

  return {
    showInterstitialIfReady
  };
}; 