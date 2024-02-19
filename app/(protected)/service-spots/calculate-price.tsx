import { useState } from 'react'
import { Stack, useRouter } from 'expo-router'
import {
  Text,
  Button,
  View,
  TextField,
  Modal,
  Colors,
  TouchableOpacity
} from 'react-native-ui-lib'
import { AntDesign } from '@expo/vector-icons'

function CalPrice() {
  const [price, setPrice] = useState(0)
  const [distance, setDistance] = useState('')
  const [showCalInfo, setShowCalInfo] = useState(false)

  const calculatePrice = () => {
    const distanceToNumber = Number(distance)
    if (!distanceToNumber) {
      setPrice(0)
    } else if (distanceToNumber <= 1.1) {
      setPrice(15)
    } else if (distanceToNumber <= 1.5) {
      setPrice(20)
    } else if (distanceToNumber <= 2) {
      setPrice(25)
    } else if (distanceToNumber <= 5) {
      setPrice(25 + (distanceToNumber - 2) * 5)
    } else if (distanceToNumber <= 10) {
      const newPrice = (distanceToNumber - 5) * 10
      setPrice(40 + newPrice)
    } else {
      setDistance(String('10'))
      // Price is determined by the driver and passenger
      setPrice(90)
    }
  }

  const onDistanceChange = (value: any) => {
    setPrice(0)
    setDistance(value)
  }

  return (
    <View flex paddingH-20>
      <Stack.Screen
        options={{
          title: 'อัตราค่าบริการตามระยะทาง'
        }}
      />
      <Modal
        statusBarTranslucent
        transparent
        overlayBackgroundColor={Colors.rgba(0, 0, 0, 0.7)}
        visible={showCalInfo}
        onRequestClose={() => setShowCalInfo(false)}
        onBackgroundPress={() => setShowCalInfo(false)}
      >
        <View flex>
          <View height={'100%'} paddingH-20 center centerV>
            <View paddingH-25 backgroundColor={Colors.white} br30>
              <View center paddingV-20>
                <Text h2B>การคำนวณค่าโดยสาร</Text>
                <View paddingV-5>
                  <Text bodyB>
                    เป็นตัวช่วยในการคิดค่าโดยสารหากวินมอเตอร์ไซค์ไม่ทราบว่าต้องคิดราคาให้กับผู้ใช้งานในราคาเท่าไหร่
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      <View paddingB-10 paddingT-20>
        <TextField
          maxLength={2}
          placeholder={'ระยะทาง (กิโลเมตร)'}
          keyboardType="numeric"
          onChangeText={(e: any) => onDistanceChange(e)}
          value={distance}
        />
      </View>
      {price ? (
        <View paddingV-10 center>
          <Text h5B>
            ราคา: {price} บาท ในระยะทาง {distance} กิโลเมตร
          </Text>
        </View>
      ) : (
        ''
      )}
      <View center paddingV-10>
        <TouchableOpacity row centerV onPress={() => setShowCalInfo(true)}>
          <View paddingR-5>
            <AntDesign name="questioncircle" size={20} color="#FDA84B" />
          </View>
          <Text bodyB>การคำนวณค่าโดยสารคืออะไร?</Text>
        </TouchableOpacity>
      </View>
      <View paddingV-10>
        <Button disabled={!distance} onPress={() => calculatePrice()}>
          <Text bodyB white>
            คำนวณราคา
          </Text>
        </Button>
      </View>
    </View>
  )
}

export default CalPrice
