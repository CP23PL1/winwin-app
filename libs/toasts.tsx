import { ToastConfig, BaseToast, ErrorToast } from 'react-native-toast-message'

export const toastConfig: ToastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      text1Style={{ fontFamily: 'NotoSansThaiBold' }}
      text2Style={{ fontFamily: 'NotoSansThai' }}
    />
  ),
  error: (props) => (
    <ErrorToast
      {...props}
      text1Style={{ fontFamily: 'NotoSansThaiBold' }}
      text2Style={{ fontFamily: 'NotoSansThai' }}
    />
  )
}
