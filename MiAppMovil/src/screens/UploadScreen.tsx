import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import ScreenWrapper from '../components/ScreenWrapper';
import CustomButton from '../components/CustomButton';
import { supabase } from '../services/supabaseClient';

const UploadScreen = () => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [fileUri, setFileUri] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [resultMessage, setResultMessage] = useState<string | null>(null);

  // ─── Seleccionar imagen de la galería ──────────────────────
  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permiso requerido', 'Necesitas dar permiso a la galería.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  // ─── Seleccionar archivo arbitrario ────────────────────────
  const pickFile = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: '*/*',
      copyToCacheDirectory: true,
    });

    if (!result.canceled) {
      setFileUri(result.assets[0].uri);
      setFileName(result.assets[0].name);
    }
  };

  // ─── Subir un archivo genérico a Supabase Storage ──────────
  const uploadToSupabase = async (uri: string, path: string, contentType: string) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const arrayBuffer = await new Response(blob).arrayBuffer();

    const { error } = await supabase.storage
      .from('uploads')
      .upload(path, arrayBuffer, { contentType, upsert: true });

    if (error) throw error;
  };

  // ─── Botón "Subir al servicio" ─────────────────────────────
  const handleUpload = async () => {
    if (!imageUri && !fileUri) {
      Alert.alert('Nada seleccionado', 'Selecciona una imagen o un archivo primero.');
      return;
    }

    setUploading(true);
    setResultMessage(null);

    try {
      if (imageUri) {
        const imagePath = `images/${Date.now()}.jpg`;
        await uploadToSupabase(imageUri, imagePath, 'image/jpeg');
      }

      if (fileUri && fileName) {
        const ext = fileName.split('.').pop();
        const filePath = `files/${Date.now()}.${ext}`;
        await uploadToSupabase(fileUri, filePath, 'application/octet-stream');
      }

      setResultMessage('¡Subida exitosa!');
    } catch (error: any) {
      setResultMessage(`Error: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Text style={styles.title}>Almacenamiento en la Nube</Text>

        <CustomButton title="Seleccionar imagen" variant="secondary" onPress={pickImage} />
        {imageUri && <Image source={{ uri: imageUri }} style={styles.preview} />}

        <CustomButton title="Seleccionar archivo" variant="secondary" onPress={pickFile} />
        {fileName && <Text style={styles.fileName}>{fileName}</Text>}

        <CustomButton
          title={uploading ? 'Subiendo...' : 'Subir al servicio'}
          variant="primary"
          onPress={handleUpload}
        />

        {uploading && <ActivityIndicator size="large" style={{ marginTop: 16 }} />}

        {resultMessage && (
          <Text
            style={[
              styles.result,
              { color: resultMessage.startsWith('Error') ? 'red' : 'green' },
            ]}
          >
            {resultMessage}
          </Text>
        )}
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, gap: 16 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 8 },
  preview: { width: 150, height: 150, borderRadius: 12, alignSelf: 'center' },
  fileName: { textAlign: 'center', color: '#666' },
  result: { textAlign: 'center', fontSize: 16, marginTop: 8, fontWeight: 'bold' },
});

export default UploadScreen;