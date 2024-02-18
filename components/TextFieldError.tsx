import { Text, View } from 'react-native-ui-lib'

type Props = {
  errorMessage?: string
}

export default function TextFieldError({ errorMessage }: Props) {
  return (
    errorMessage && (
      <View paddingL-10>
        <Text color="red" style={{ fontSize: 12 }}>
          {errorMessage}
        </Text>
      </View>
    )
  )
}
