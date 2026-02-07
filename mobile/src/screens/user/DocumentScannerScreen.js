import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { documentAPI } from '../../services/api';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '../../styles/theme';

export default function DocumentScannerScreen() {
  const [image, setImage] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);

  const { isDark } = useTheme();
  const { strings } = useLanguage();

  const requestCameraPermission = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === 'granted');
    return status === 'granted';
  };

  const takePhoto = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      Alert.alert('Permission Denied', 'Camera permission is required');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      uploadDocument(result.assets[0].uri);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Photo library permission is required');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      uploadDocument(result.assets[0].uri);
    }
  };

  const uploadDocument = async (uri) => {
    setLoading(true);
    setExtractedText('');

    try {
      const formData = new FormData();
      formData.append('file', {
        uri,
        type: 'image/jpeg',
        name: 'document.jpg',
      });

      const response = await documentAPI.uploadDocument(formData);
      setExtractedText(response.data.extracted_text || 'No text found');
    } catch (error) {
      Alert.alert('Error', 'Failed to process document');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: isDark ? Colors.backgroundDark : Colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="scan" size={48} color={Colors.primary} />
        <Text style={[styles.title, { color: isDark ? Colors.textDark : Colors.text }]}>
          {strings.scanDocument}
        </Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.actionButton, isDark ? styles.cardDark : styles.cardLight]}
          onPress={takePhoto}
        >
          <Ionicons name="camera" size={32} color={Colors.primary} />
          <Text style={[styles.actionButtonText, { color: isDark ? Colors.textDark : Colors.text }]}>
            {strings.takePhoto}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, isDark ? styles.cardDark : styles.cardLight]}
          onPress={pickImage}
        >
          <Ionicons name="images" size={32} color={Colors.primary} />
          <Text style={[styles.actionButtonText, { color: isDark ? Colors.textDark : Colors.text }]}>
            {strings.chooseFromGallery}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Image Preview */}
      {image && (
        <View style={[styles.imageContainer, isDark ? styles.cardDark : styles.cardLight]}>
          <Image source={{ uri: image }} style={styles.image} />
        </View>
      )}

      {/* Loading */}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={[styles.loadingText, { color: isDark ? Colors.textDark : Colors.text }]}>
            {strings.loading}
          </Text>
        </View>
      )}

      {/* Extracted Text */}
      {extractedText && (
        <View style={[styles.textContainer, isDark ? styles.cardDark : styles.cardLight]}>
          <Text style={[styles.textTitle, { color: isDark ? Colors.textDark : Colors.text }]}>
            {strings.extractedText}
          </Text>
          <Text style={[styles.extractedText, { color: isDark ? Colors.textDark : Colors.text }]}>
            {extractedText}
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    padding: Spacing.xl,
  },
  title: {
    fontSize: Typography.h3,
    fontWeight: 'bold',
    marginTop: Spacing.md,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  actionButton: {
    width: '45%',
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    ...Shadows.md,
  },
  cardLight: {
    backgroundColor: Colors.cardBackground,
  },
  cardDark: {
    backgroundColor: Colors.cardBackgroundDark,
  },
  actionButtonText: {
    marginTop: Spacing.sm,
    fontSize: Typography.body,
    fontWeight: '600',
    textAlign: 'center',
  },
  imageContainer: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    ...Shadows.md,
  },
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'contain',
  },
  loadingContainer: {
    alignItems: 'center',
    padding: Spacing.xl,
  },
  loadingText: {
    marginTop: Spacing.md,
    fontSize: Typography.body,
  },
  textContainer: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    ...Shadows.md,
  },
  textTitle: {
    fontSize: Typography.h5,
    fontWeight: '600',
    marginBottom: Spacing.md,
  },
  extractedText: {
    fontSize: Typography.body,
    lineHeight: 22,
  },
});
