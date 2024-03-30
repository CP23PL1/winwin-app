import { Stack, usePathname } from 'expo-router'
import { useEffect } from 'react'

export default function MainLayout() {
  const pathname = usePathname()

  useEffect(() => {
    console.log(pathname)
  }, [pathname])

  return (
    <Stack
      screenOptions={{ headerShown: false, animation: 'slide_from_bottom' }}
    />
  )
}
