import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import ScreenWrapper from '../components/ScreenWrapper';
import CustomButton from '../components/CustomButton';
import CustomInput from '../components/CustomInput';
import { supabase } from '../services/supabaseClient';

WebBrowser.maybeCompleteAuthSession();

const LoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleGoogleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    if (error) {
      Alert.alert('Error', error.message);
      return;
    }
    console.log('Redirigiendo a Google...', data);
  };

  const handleEmailLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Campos incompletos', 'Ingresa tu correo y contraseña.');
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password.trim(),
    });

    if (error) {
      Alert.alert('Error al iniciar sesión', error.message);
      return;
    }

    if (data.user) {
      navigation.navigate('MainTabs');
    }
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Text style={styles.title}>Iniciar sesión</Text>

        <CustomInput
          placeholder="Correo electrónico"
          value={email}
          onChange={setEmail}
          type="email"
        />

        <CustomInput
          placeholder="Contraseña"
          value={password}
          onChange={setPassword}
          type="password"
        />

        <CustomButton
          title="Iniciar sesión"
          variant="primary"
          onPress={handleEmailLogin}
        />

        <CustomButton
          title="Continuar con Google"
          variant="secondary"
          onPress={handleGoogleLogin}
        />

        <CustomButton
          title="Entrar"
          variant="tertiary"
          onPress={() => navigation.navigate('MainTabs')}
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