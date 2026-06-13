import React, { useState, useEffect } from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import { supabase } from '../services/supabaseClient';

type Product = {
  id: string;
  name: string;
  brand: string;
  category: string;
  created_at: string;
};

const CATEGORIES = ['Limpiador', 'Tónico', 'Sérum', 'Hidratante', 'Protector Solar'];

const ProductsScreen = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) { Alert.alert('Error', error.message); return; }
    if (data) setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddProduct = async () => {
    if (!name.trim() || !brand.trim()) {
      Alert.alert('Campos incompletos', 'Nombre y marca son obligatorios.');
      return;
    }
    setLoading(true);
    const { error } = await supabase
      .from('products')
      .insert([{ name: name.trim(), brand: brand.trim(), category }])
      .select();
    setLoading(false);
    if (error) { Alert.alert('Error', error.message); return; }
    setName('');
    setBrand('');
    setCategory(CATEGORIES[0]);
    setShowForm(false);
    fetchProducts();
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <View style={styles.card}>
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.productBrand}>{item.brand}</Text>
      <Text style={styles.productCategory}>{item.category}</Text>
    </View>
  );

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Text style={styles.title}>Mis Productos</Text>

        <CustomButton
          title={showForm ? 'Cancelar' : '+ Agregar Producto'}
          variant="primary"
          onPress={() => setShowForm(!showForm)}
        />

        {showForm && (
          <View style={styles.form}>
            <CustomInput
              placeholder="Nombre del producto"
              value={name}
              onChange={setName}
            />
            <CustomInput
              placeholder="Marca"
              value={brand}
              onChange={setBrand}
            />
            <CustomInput
              placeholder="Categoría"
              value={category}
              onChange={setCategory}
            />
            <CustomButton
              title={loading ? 'Guardando...' : 'Guardar Producto'}
              variant="primary"
              onPress={handleAddProduct}
            />
          </View>
        )}

        {products.length === 0 ? (
          <Text style={styles.empty}>No hay productos aún.</Text>
        ) : (
          <FlatList
            data={products}
            keyExtractor={(item) => item.id}
            renderItem={renderProduct}
            style={styles.list}
          />
        )}
      </View>
    </ScreenWrapper>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    gap: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  form: {
    gap: 12,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
  },
  list: {
    marginTop: 8,
  },
  card: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  productBrand: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  productCategory: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  empty: {
    textAlign: 'center',
    color: '#aaa',
    marginTop: 40,
    fontSize: 16,
  },
});

export default ProductsScreen;