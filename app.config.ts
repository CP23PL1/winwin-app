import { ExpoConfig } from 'expo/config'
import { withSentry } from '@sentry/react-native/expo'

const config: ExpoConfig = {
  name: process.env.APP_NAME ?? 'WinWin',
  slug: 'winwin',
  scheme: 'winwin',
  version: process.env.APP_VERSION ?? '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#F5A256'
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.cp23pl1.winwin'
  },
  android: {
    package: 'com.cp23pl1.winwin',
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#F5A256'
    },
    permissions: ['android.permission.ACCESS_FINE_LOCATION'],
    config: {
      googleMaps: {
        apiKey: 'AIzaSyCg98R2mDzaRdIeb9Cnt4o9y-cyrr5p04g'
      }
    }
  },
  web: {
    favicon: './assets/favicon.png'
  },
  plugins: [
    'expo-router',
    [
      'react-native-auth0',
      {
        domain: 'cp23pl1-kmutt.jp.auth0.com'
      }
    ],
    [
      '@sentry/react-native/expo',
      {
        organization: 'cp23pl1',
        project: 'winwin-app'
      }
    ],
    [
      'expo-location',
      {
        locationAlwaysAndWhenInUsePermission:
          'Allow $(PRODUCT_NAME) to use your location.'
      }
    ]
  ],
  owner: 'cp23pl1',
  extra: {
    router: {
      origin: false
    },
    eas: {
      projectId: 'fae1874b-ea74-4aa1-bf98-fc6f5bbdc194'
    }
  }
}

export default withSentry(config, {
  url: 'https://sentry.io/',
  project: 'winwin-app',
  organization: 'cp23pl1'
})
