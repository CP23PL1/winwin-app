import { Stack } from 'expo-router'

type Props = {}
export default function DriveRequestsLayout({}: Props) {
  return (
    <Stack
      screenOptions={{
        animation: 'slide_from_right',
        headerTitleAlign: 'center',
        headerTitleStyle: {
          fontFamily: 'NotoSansThai'
        }
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'ประวัติการโดยสาร'
        }}
      />
      <Stack.Screen
        name="[slug]"
        options={{
          title: 'รายละเอียดการโดยสาร'
        }}
      />
    </Stack>
  )
}
