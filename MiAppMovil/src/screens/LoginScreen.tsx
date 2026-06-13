// src/screens/LoginScreen.tsx
import React from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import * as WebBrowser from 'expo-web-browser';  
import ScreenWrapper from '../components/ScreenWrapper';
import CustomButton from '../components/CustomButton';
import { supabase } from '../services/supabaseClient';

WebBrowser.maybeCompleteAuthSession();  

const LoginScreen = ({ navigation }: any) => {

  const handleGoogleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });

    if (error) {
      Alert.alert('Error', error.message);
      return;
    }

    // Supabase abre automáticamente el navegador para autenticarse con Google
    console.log('Redirigiendo a Google...', data);
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Text style={styles.title}>Iniciar sesión</Text>

        {/* Botón SSO Google */}
        <CustomButton
          title="Continuar con Google"
          variant="secondary"
          onPress={handleGoogleLogin}
        />
        <CustomButton
         title="Crear cuenta"
        variant="tertiary"
        onPress={() => navigation.navigate('Register')}
/>

      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    gap: 16,
    justifyContent: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
});

export default LoginScreen;