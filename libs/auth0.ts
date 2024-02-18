import Auth0 from "react-native-auth0";

const auth0 = new Auth0({
  clientId: process.env.EXPO_PUBLIC_AUTH0_CLIENT_ID!,
  domain: process.env.EXPO_PUBLIC_AUTH0_DOMAIN!,
});

export default auth0;
