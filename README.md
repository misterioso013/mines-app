# Mines Game

Um jogo de Mines desenvolvido com React Native e Expo.

## Configuração

1. Clone o repositório
2. Instale as dependências:
```bash
pnpm install
```

3. Configure as variáveis de ambiente:
- Copie o arquivo `.env.example` para `.env`
- Preencha as variáveis com seus IDs do AdMob:
  - `EXPO_PUBLIC_ADMOB_ANDROID_APP_ID`: ID do aplicativo Android no AdMob
  - `EXPO_PUBLIC_ADMOB_INTERSTITIAL_ID_ANDROID`: ID do anúncio intersticial Android

## Desenvolvimento

Para desenvolvimento local com hot reload:

```bash
pnpm start
```

## Gerando o App Nativo (Android)

1. Gere os arquivos nativos do Android usando o Expo Prebuild:
```bash
npx expo prebuild --platform android
```

2. Execute o app no Android:
```bash
npx expo run:android
```

Para gerar uma nova build limpa (recomendado após alterações na configuração):
```bash
npx expo prebuild --platform android --clean
```

## Build de Produção

Para gerar um APK de release:

1. Certifique-se de ter gerado os arquivos nativos (passo anterior)
2. Execute:
```bash
cd android
./gradlew assembleRelease
```

O APK será gerado em: `android/app/build/outputs/apk/release/app-release.apk`

## Funcionalidades

- Sistema de apostas com saldo virtual
- Multiplayer de ganhos baseado na quantidade de minas
- Estatísticas de jogadas
- Anúncios intersticiais a cada 7-10 jogadas (Android)
- Sons e animações
- Interface moderna e responsiva

## Tecnologias

- React Native
- Expo
- TypeScript
- Zustand (Gerenciamento de Estado)
- React Native Google Mobile Ads
- Expo AV (Sons)
- AsyncStorage (Persistência de dados)
