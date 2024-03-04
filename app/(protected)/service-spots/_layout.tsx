import { Stack, router } from 'expo-router'
import { Colors, Text } from 'react-native-ui-lib'
import { Entypo } from '@expo/vector-icons'
import { StyleSheet } from 'react-native'

export default function ServiceSpotsLayout() {
  return (
    <Stack
      screenOptions={{
        headerLeft: (props) =>
          props.canGoBack && (
            <Entypo
              name="chevron-thin-left"
              size={24}
              color="white"
              onPress={router.back}
            />
          ),
        headerTitle: (props) => (
          <Text h4 white>
            {props?.children || 'Loading...'}
          </Text>
        ),
        headerStyle: {
          backgroundColor: Colors.$backgroundPrimaryHeavy
        },
        headerBackVisible: false,
        headerTitleAlign: 'center',
        headerShadowVisible: false,
        statusBarTranslucent: true,
        navigationBarHidden: true,
        contentStyle: [styles.container]
      }}
    />
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F0F0F0'
  }
})
