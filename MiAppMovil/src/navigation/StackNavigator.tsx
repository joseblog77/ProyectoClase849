import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import TabNavigator from "./TabsNavigator";
import ProductDetailScreen from "../screens/ProductDetailScreen";
import { useTheme } from "../contexts/ThemeContext";
import RegisterScreen from "../screens/RegisterScreen";

//1. declarar tipado para pantallas y sus parametros
export type RootStackParamList = {
  Login: undefined;
  Register: undefined; 
  MainTabs: undefined;
  ProductDetail: { productId: string };
};

//2. crear el stack navigator el cual va a manejar la navegacion
const Stack = createNativeStackNavigator<RootStackParamList>();

//3. utilizar el stack 
export default function StackNavigator() {
  const {colors} = useTheme();
  
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{ headerShown: true,
         headerStyle:{ backgroundColor: colors.headerBackground},
        headerTintColor: colors.headerText
       }}
    >
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ title: "Skincare Tracker" }}
      />
      <Stack.Screen
        name="MainTabs"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={{ title: "Detalle del producto" }}
      />
    </Stack.Navigator>
  );
}
