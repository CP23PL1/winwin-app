import {
  Spacings,
  ThemeManager,
  Typography,
  Colors,
} from "react-native-ui-lib";

export class DesignSystem {
  static setup() {
    Colors.loadDesignTokens({
      primaryColor: "#FDA84B",
    });

    Colors.loadColors({
      secondaryColor: "#2C2C2C",
      lightGray: "#DCDCDC",
    });

    Typography.loadTypographies({
      h1: { fontSize: 32, fontFamily: "NotoSansThai" },
      h2: { fontSize: 26, fontFamily: "NotoSansThai" },
      h3: { fontSize: 24, fontFamily: "NotoSansThai" },
      h4: { fontSize: 20, fontFamily: "NotoSansThai" },
      h5: { fontSize: 18, fontFamily: "NotoSansThai" },
      h1B: { fontSize: 32, fontFamily: "NotoSansThaiBold" },
      h2B: { fontSize: 26, fontFamily: "NotoSansThaiBold" },
      h3B: { fontSize: 24, fontFamily: "NotoSansThaiBold" },
      h4B: { fontSize: 20, fontFamily: "NotoSansThaiBold" },
      h5B: { fontSize: 18, fontFamily: "NotoSansThaiBold" },
      body: { fontSize: 16, fontFamily: "NotoSansThai" },
      bodyB: { fontSize: 16, fontFamily: "NotoSansThaiBold" },
      caption: { fontSize: 14, fontFamily: "NotoSansThai" },
    });

    Spacings.loadSpacings({ page: 16 });

    ThemeManager.setComponentTheme("Text", (props: any) => {
      const defaultProps = {
        body: true,
        color: Colors.black,
      };

      if (props.red) {
        defaultProps.color = Colors.red30;
      }

      return defaultProps;
    });

    ThemeManager.setComponentTheme("TouchableOpacity", () => ({
      style: {
        backgroundColor: Colors.white,
        paddingVertical: 55,
        borderRadius: 10,
        elevation: 20,
        shadowColor: Colors.black,
      },
    }));

    ThemeManager.setComponentTheme("Button", (props: any) => {
      const defaultProps = {
        backgroundColor: Colors.primaryColor,
        bodyB: true,
        width: "100%",
      };

      if (props.secondary) {
        defaultProps.backgroundColor = Colors.secondaryColor;
      }

      return defaultProps;
    });

    ThemeManager.setComponentTheme("TextField", () => ({
      containerStyle: {
        borderColor: "rgba(253, 168, 75, .5)",
        borderWidth: 1,
        borderRadius: 30,
        paddingLeft: 13,
        paddingVertical: 10,
      },
      placeholderTextColor: "#898989",
      bodyB: true,
    }));
  }
}
