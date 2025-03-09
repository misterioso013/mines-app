import { useEffect, useState, useRef } from 'react';
import mobileAds, { InterstitialAd, AdEventType, TestIds } from 'react-native-google-mobile-ads';
import { Platform } from 'react-native';

// ID do anúncio baseado no ambiente
const adUnitId = __DEV__ 
  ? TestIds.INTERSTITIAL 
  : process.env.EXPO_PUBLIC_ADMOB_INTERSTITIAL_ID_ANDROID || TestIds.INTERSTITIAL;

console.log(`🔧 Ambiente: ${__DEV__ ? 'Desenvolvimento' : 'Produção'}`);
console.log(`📱 Plataforma: ${Platform.OS}`);
console.log(`📢 ID do anúncio: ${adUnitId}`);

const AD_INTERVAL = 1 * 60 * 1000; // 2 minutos em milissegundos

export const useAds = () => {
  const [loaded, setLoaded] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const interstitialRef = useRef<InterstitialAd | null>(null);

  useEffect(() => {
    // Cria uma nova instância do anúncio
    interstitialRef.current = InterstitialAd.createForAdRequest(adUnitId, {
      keywords: ['game', 'casual', 'mines'],
    });

    const loadAd = () => {
      if (!interstitialRef.current) return;
      
      console.log('📥 Carregando novo anúncio...');
      interstitialRef.current.load();
    };

    const unsubscribeLoaded = interstitialRef.current.addAdEventListener(AdEventType.LOADED, () => {
      console.log('✅ Anúncio carregado com sucesso');
      setLoaded(true);
      
      // Mostra o anúncio assim que carregar pela primeira vez
      if (!timerRef.current) {
        showAd();
      }
    });

    const unsubscribeError = interstitialRef.current.addAdEventListener(AdEventType.ERROR, (error) => {
      console.error('❌ Erro ao carregar anúncio:', error);
      setLoaded(false);
      // Tenta carregar novamente após erro
      setTimeout(loadAd, 5000);
    });

    const unsubscribeClosed = interstitialRef.current.addAdEventListener(AdEventType.CLOSED, () => {
      console.log('🔒 Anúncio fechado');
      setLoaded(false);
      loadAd(); // Carrega o próximo anúncio
    });

    // Inicializa o AdMob e carrega o primeiro anúncio
    const init = async () => {
      try {
        await mobileAds().initialize();
        console.log('✅ AdMob inicializado');
        loadAd();
      } catch (error) {
        console.error('❌ Erro ao inicializar AdMob:', error);
      }
    };

    init();

    // Configura o timer para mostrar anúncios periodicamente
    timerRef.current = setInterval(() => {
      console.log('⏰ Timer: Verificando anúncio...');
      if (loaded) {
        showAd();
      } else {
        loadAd();
      }
    }, AD_INTERVAL);

    return () => {
      unsubscribeLoaded();
      unsubscribeError();
      unsubscribeClosed();
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const showAd = async () => {
    if (!loaded || !interstitialRef.current) {
      console.log('⚠️ Anúncio não está pronto ainda');
      return;
    }

    try {
      console.log('🎯 Exibindo anúncio...');
      await interstitialRef.current.show();
    } catch (error) {
      console.error('❌ Erro ao exibir anúncio:', error);
      setLoaded(false);
    }
  };

  return {
    showAd: loaded ? showAd : null
  };
}; 