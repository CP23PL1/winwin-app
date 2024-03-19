import { useCallback, useMemo, useState } from 'react'
import { Stack, useRouter } from 'expo-router'
import {
  Text,
  Button,
  View,
  TextField,
  Modal,
  Colors
} from 'react-native-ui-lib'
import { AntDesign } from '@expo/vector-icons'
import { serviceSpotUtil } from '@/utils/service-spot'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StyleSheet } from 'react-native'
import TextFieldError from '@/components/TextFieldError'

function CalPrice() {
  const [distance, setDistance] = useState(0)
  const [distanceInput, setDistanceInput] = useState('')
  const [showCalInfo, setShowCalInfo] = useState(false)
  const [error, setError] = useState('')

  const calculatedPrice = useMemo(() => {
    const nf = new Intl.NumberFormat('th-TH', {
      currency: 'THB',
      style: 'currency',
      minimumFractionDigits: 0
    })
    return nf.format(Math.round(serviceSpotUtil.calculatePrice(distance)))
  }, [distance])

  const calculatePrice = useCallback(() => {
    const parseDistance = +distanceInput
    if (isNaN(parseDistance)) {
      setError('กรุณาใส่ระยะทางเป็นตัวเลข')
      return
    }

    if (parseDistance < 0) {
      setError('ระยะทางต้องมากกว่า 0')
      return
    }

    if (parseDistance > 10) {
      setError('ระยะทางต้องน้อยกว่าหรือเท่ากับ 10')
      return
    }

    if (error) {
      setError('')
    }

    setDistance(parseDistance)
  }, [distanceInput])

  const onDistanceChange = useCallback((value: string) => {
    setDistanceInput(value)
  }, [])

  return (
    <>
      <Stack.Screen
        options={{
          title: 'อัตราค่าบริการตามระยะทาง'
        }}
      />
      <SafeAreaView style={styles.container}>
        <View flex paddingH-20>
          <View paddingB-10>
            <TextField
              placeholder="ระยะทาง (กิโลเมตร)"
              keyboardType="numeric"
              onChangeText={onDistanceChange}
            />
          </View>
          <TextFieldError errorMessage={error} />
          <View paddingV-10>
            <Button
              bg-transparent
              avoidMinWidth
              avoidInnerPadding
              onPress={() => setShowCalInfo(true)}
            >
              <View paddingR-5>
                <AntDesign name="questioncircle" size={20} color="#FDA84B" />
              </View>
              <Text bodyB>การคำนวณค่าโดยสารคืออะไร?</Text>
            </Button>
          </View>
          <View paddingV-10>
            <Button onPress={calculatePrice}>
              <Text bodyB white>
                คำนวณราคา
              </Text>
            </Button>
          </View>
          {!!calculatedPrice && (
            <View paddingV-10 center>
              <Text h5B>ระยะทาง {distance.toFixed(2)} กิโลเมตร</Text>
              <Text style={styles.calculatedPrice}>{calculatedPrice}</Text>
            </View>
          )}
        </View>
      </SafeAreaView>
      <Modal
        statusBarTranslucent
        transparent
        overlayBackgroundColor={Colors.rgba(0, 0, 0, 0.7)}
        visible={showCalInfo}
        onRequestClose={() => setShowCalInfo(false)}
        onBackgroundPress={() => setShowCalInfo(false)}
      >
        <View flex center padding-20>
          <View bg-white center padding-20 width="100%" br30 gap-12>
            <Text h2B>การคำนวณค่าโดยสาร</Text>
            <Text bodyB>
              เป็นตัวช่วยในการคิดค่าโดยสารหากวินมอเตอร์ไซค์ไม่ทราบว่าต้องคิดราคาให้กับผู้ใช้งานในราคาเท่าไหร่
            </Text>
          </View>
        </View>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  calculatedPrice: {
    fontSize: 64,
    fontWeight: 'bold',
    fontFamily: 'NotoSansThai'
  }
})

export default CalPrice
