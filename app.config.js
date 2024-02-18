module.exports = {
  name: 'WinWin',
  slug: 'winwin',
  scheme: 'winwin',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff'
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true
  },
  android: {
    package: 'com.cp23pl1.winwin',
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#ffffff'
    },
    permissions: [
      'android.permission.ACCESS_COARSE_LOCATION',
      'android.permission.ACCESS_FINE_LOCATION',
      'android.permission.FOREGROUND_SERVICE',
      'android.permission.INTERNET'
    ],
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
      'expo-location',
      {
        locationAlwaysAndWhenInUsePermission:
          'Allow $(PRODUCT_NAME) to use your location.'
      }
    ],
    [
      'react-native-auth0',
      {
        domain: process.env.EXPO_PUBLIC_AUTH0_DOMAIN
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
