import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import { supabase } from '../services/supabaseClient'; // 👈 importar el cliente

const RegisterScreen = ({ navigation }: any) => {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // 👈 para deshabilitar el botón mientras carga

  const handleRegister = async () => {
    // Validación básica (Actividad 2)
    if (!name.trim() || !phoneNumber.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Campos incompletos', 'Por favor completa todos los campos.');
      return;
    }

    
    setLoading(true);

    // Llamada a Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password: password.trim(),
    });

    setLoading(false);

    // Manejo de error
    if (error) {
      Alert.alert('Error al registrarse', error.message);
      return;
    }

    // Registro exitoso
    if (data.user) {
      Alert.alert(
        '¡Registro exitoso!',
        'Tu cuenta fue creada correctamente.',
        [
          {
            text: 'Iniciar sesión',
            onPress: () => navigation.navigate('Login'),
          },
        ]
      );
    }
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Text style={styles.title}>Crear cuenta</Text>

        <CustomInput
          placeholder="Nombre completo"
          value={name}
          onChange={setName}
        />

        <CustomInput
          placeholder="Número de teléfono"
          value={phoneNumber}
          onChange={setPhoneNumber}
          type="number"
        />

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
          title={loading ? 'Registrando...' : 'Registrarse'}
          variant="primary"
          onPress={handleRegister}
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

export default RegisterScreen;