import 'dotenv/config'

export default {
  expo: {
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
      package: 'winwin.app',
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#ffffff'
      },
      permissions: [
        'android.permission.ACCESS_COARSE_LOCATION',
        'android.permission.ACCESS_FINE_LOCATION',
        'android.permission.FOREGROUND_SERVICE'
      ]
    },
    web: {
      favicon: './assets/favicon.png'
    },
    experiments: {
      typedRoutes: true
    },
    plugins: [
      'expo-router',
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
}
