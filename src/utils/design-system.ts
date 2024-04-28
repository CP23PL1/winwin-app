import { Spacings, ThemeManager, Typography, Colors } from 'react-native-ui-lib'

export class DesignSystem {
  static setup() {
    Colors.loadDesignTokens({
      primaryColor: '#F5A256'
    })

    Colors.loadColors({
      secondaryColor: '#2C2C2C',
      lightGray: '#DCDCDC'
    })

    Typography.loadTypographies({
      h1: { fontSize: 32, fontFamily: 'NotoSansThai' },
      h2: { fontSize: 26, fontFamily: 'NotoSansThai' },
      h3: { fontSize: 24, fontFamily: 'NotoSansThai' },
      h4: { fontSize: 20, fontFamily: 'NotoSansThai' },
      h5: { fontSize: 18, fontFamily: 'NotoSansThai' },
      h1B: { fontSize: 32, fontFamily: 'NotoSansThaiBold' },
      h2B: { fontSize: 26, fontFamily: 'NotoSansThaiBold' },
      h3B: { fontSize: 24, fontFamily: 'NotoSansThaiBold' },
      h4B: { fontSize: 20, fontFamily: 'NotoSansThaiBold' },
      h5B: { fontSize: 18, fontFamily: 'NotoSansThaiBold' },
      body: { fontSize: 16, fontFamily: 'NotoSansThai' },
      bodyB: { fontSize: 16, fontFamily: 'NotoSansThaiBold' },
      caption: { fontSize: 14, fontFamily: 'NotoSansThai' }
    })

    Spacings.loadSpacings({ page: 16 })

    ThemeManager.setComponentTheme('Text', (props: any) => {
      const defaultProps = {
        body: true,
        color: Colors.black
      }

      if (props.primary) {
        defaultProps.color = Colors.$textPrimary
      }

      if (props.red) {
        defaultProps.color = Colors.red30
      }

      if (props.white) {
        defaultProps.color = Colors.white
      }

      return defaultProps
    })

    ThemeManager.setComponentTheme('Button', (props: any) => {
      const defaultProps = {
        backgroundColor: Colors.primaryColor,
        bodyB: true,
        width: '100%',
        paddingVertical: 0,
        borderRadius: 25
      }

      if (props.secondary) {
        defaultProps.backgroundColor = Colors.secondaryColor
      }

      if (props.whiteStyle) {
        defaultProps.backgroundColor = Colors.white
        defaultProps.paddingVertical = 15
        defaultProps.borderRadius = 15
      }
      if (props.none) {
        defaultProps.backgroundColor = Colors.transparent
        defaultProps.width = '0%'
      }
      if (props.closeJob) {
        defaultProps.backgroundColor = Colors.white
        defaultProps.borderRadius = 5
      }

      return defaultProps
    })

    ThemeManager.setComponentTheme('TextField', () => ({
      containerStyle: {
        borderColor: 'rgba(245, 162, 86, .5)',
        borderWidth: 1,
        borderRadius: 30,
        paddingLeft: 13,
        paddingVertical: 10
      },
      placeholderTextColor: '#898989',
      bodyB: true
    }))
  }
}
