import { View, Text, StyleSheet, Pressable, Image, Alert, ScrollView, Dimensions } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState, useCallback } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { colors } from '../../../util/constant';

const { width } = Dimensions.get('window');

// Document type icons mapping
const documentIcons = {
  'application/pdf': { icon: 'document-text', color: '#FF5252', label: 'PDF' },
  'application/msword': { icon: 'document', color: '#2196F3', label: 'DOC' },
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': { icon: 'document', color: '#2196F3', label: 'DOCX' },
  'application/vnd.ms-excel': { icon: 'grid', color: '#4CAF50', label: 'XLS' },
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': { icon: 'grid', color: '#4CAF50', label: 'XLSX' },
  'image/jpeg': { icon: 'image', color: '#9C27B0', label: 'JPEG' },
  'image/png': { icon: 'image', color: '#9C27B0', label: 'PNG' },
  'text/plain': { icon: 'document-text', color: '#607D8B', label: 'TXT' },
  'application/json': { icon: 'code', color: '#FF9800', label: 'JSON' },
  'default': { icon: 'document-attach', color: '#607D8B', label: 'FILE' }
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export default function SelectImage() {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);

  const getDocumentIcon = useCallback((mimeType) => {
    return documentIcons[mimeType] || documentIcons.default;
  }, []);

  const requestPermissions = async (type) => {
    if (type === 'camera') {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Camera access is required to take photos.',
          [{ text: 'OK' }]
        );
        return false;
      }
    } else {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Photo library access is required to select photos.',
          [{ text: 'OK' }]
        );
        return false;
      }
    }
    return true;
  };

  const takePhoto = async () => {
    const hasPermission = await requestPermissions('camera');
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 1,
        exif: true
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
        setSelectedDocument(null);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  };

  const pickImage = async () => {
    const hasPermission = await requestPermissions('library');
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 1,
        exif: true
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
        setSelectedDocument(null);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to select photo. Please try again.');
    }
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/vnd.ms-excel',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'text/plain',
          'application/json'
        ],
        copyToCacheDirectory: true,
        multiple: false
      });

      if (result.canceled) {
        return;
      }

      const file = result.assets[0];
      
      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        Alert.alert(
          'File Too Large',
          'Please select a file smaller than 10MB.',
          [{ text: 'OK' }]
        );
        return;
      }

      // Get file extension
      const fileExt = file.name.split('.').pop().toLowerCase();
      
      // Prepare file for upload
      const fileToUpload = {
        uri: file.uri,
        type: file.mimeType,
        name: file.name,
        size: file.size,
        extension: fileExt
      };

      setSelectedDocument(fileToUpload);
      setSelectedImage(null);
    } catch (error) {
      console.log('Document picker error:', error);
      Alert.alert('Error', 'Failed to select document. Please try again.');
    }
  };

  const handleDone = () => {
    if (!selectedImage && !selectedDocument) {
      Alert.alert('Error', 'Please select an image or document first.');
      return;
    }

    if (selectedImage) {
      router.push({
        pathname: "/add-expense",
        params: { imageUri: selectedImage }
      });
    } else if (selectedDocument) {
      router.push({
        pathname: "/add-expense",
        params: { 
          documentUri: selectedDocument.uri,
          documentName: selectedDocument.name,
          documentType: selectedDocument.type,
          documentSize: selectedDocument.size,
          documentExtension: selectedDocument.extension
        }
      });
    }
  };

  const renderPreview = () => {
    if (selectedImage) {
      return (
        <View style={styles.selectedPreviewContainer}>
          <Image 
            source={{ uri: selectedImage }} 
            style={styles.previewImage} 
            resizeMode="contain"
          />
          <Pressable 
            style={styles.removeButton}
            onPress={() => setSelectedImage(null)}
          >
            <Ionicons name="close-circle" size={28} color="#fff" />
          </Pressable>
        </View>
      );
    }

    if (selectedDocument) {
      const { icon, color, label } = getDocumentIcon(selectedDocument.type);
      const fileSize = (selectedDocument.size / (1024 * 1024)).toFixed(2);
      const fileExt = selectedDocument.extension.toUpperCase();
      
      return (
        <View style={styles.selectedPreviewContainer}>
          <View style={[styles.documentPreview, { backgroundColor: color + '10' }]}>
            <View style={styles.documentIconContainer}>
              <Ionicons name={icon} size={64} color={color} />
              <View style={[styles.fileTypeBadge, { backgroundColor: color }]}>
                <Text style={styles.fileTypeBadgeText}>{fileExt}</Text>
              </View>
            </View>
            <Text style={styles.documentName} numberOfLines={2}>
              {selectedDocument.name}
            </Text>
            <View style={styles.documentDetails}>
              <View style={[styles.documentBadge, { backgroundColor: color + '20' }]}>
                <Ionicons name="document" size={16} color={color} />
                <Text style={[styles.documentBadgeText, { color }]}>{label}</Text>
              </View>
              <View style={[styles.documentBadge, { backgroundColor: color + '20' }]}>
                <Ionicons name="save" size={16} color={color} />
                <Text style={[styles.documentBadgeText, { color }]}>{fileSize} MB</Text>
              </View>
            </View>
          </View>
          <Pressable 
            style={styles.removeButton}
            onPress={() => setSelectedDocument(null)}
          >
            <Ionicons name="close-circle" size={28} color="#fff" />
          </Pressable>
        </View>
      );
    }

    return (
      <View style={styles.emptyPreview}>
        <Ionicons name="cloud-upload" size={64} color={colors.primary} />
        <Text style={styles.emptyPreviewTitle}>No File Selected</Text>
        <Text style={styles.emptyPreviewSubtitle}>
          Select an image or document to preview it here
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Pressable 
            style={styles.backButton}
            onPress={() => router.push("/add-expense")}
          >
            <Ionicons name="arrow-back" size={24} color="black" />
          </Pressable>
          <Text style={styles.headerTitle}>Add Receipt</Text>
        </View>
        {(selectedImage || selectedDocument) && (
          <Pressable 
            style={styles.doneButton}
            onPress={handleDone}
          >
            <Text style={styles.doneButtonText}>Done</Text>
            <Ionicons name="checkmark" size={20} color="white" />
          </Pressable>
        )}
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {renderPreview()}

        <View style={styles.optionsContainer}>
          <Text style={styles.sectionTitle}>Select Source</Text>
          
          <Pressable 
            style={styles.option}
            onPress={takePhoto}
          >
            <View style={[styles.optionIcon, { backgroundColor: '#E3F2FD' }]}>
              <Ionicons name="camera" size={32} color="#2196F3" />
            </View>
            <View style={styles.optionInfo}>
              <Text style={styles.optionTitle}>Take Photo</Text>
              <Text style={styles.optionSubtitle}>Use camera to capture receipt</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#666" />
          </Pressable>

          <Pressable 
            style={styles.option}
            onPress={pickImage}
          >
            <View style={[styles.optionIcon, { backgroundColor: '#E8F5E9' }]}>
              <Ionicons name="images" size={32} color="#4CAF50" />
            </View>
            <View style={styles.optionInfo}>
              <Text style={styles.optionTitle}>Photo Library</Text>
              <Text style={styles.optionSubtitle}>Choose from your gallery</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#666" />
          </Pressable>

          <Pressable 
            style={styles.option}
            onPress={pickDocument}
          >
            <View style={[styles.optionIcon, { backgroundColor: '#FFF3E0' }]}>
              <Ionicons name="document-text" size={32} color="#FF9800" />
            </View>
            <View style={styles.optionInfo}>
              <Text style={styles.optionTitle}>Browse Files</Text>
              <Text style={styles.optionSubtitle}>Select PDF or other documents</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#666" />
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  doneButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: colors.primary,
    borderRadius: 8,
    gap: 4,
  },
  doneButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    gap: 24,
  },
  selectedPreviewContainer: {
    width: '100%',
    height: width * 0.7,
    backgroundColor: '#f5f5f5',
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  documentPreview: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  documentName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  documentSize: {
    fontSize: 16,
    fontWeight: '500',
  },
  removeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 14,
  },
  emptyPreview: {
    width: '100%',
    height: width * 0.7,
    backgroundColor: colors.primary + '08',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.primary + '20',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyPreviewTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.primary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyPreviewSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  optionsContainer: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    gap: 16,
    borderWidth: 1,
    borderColor: '#eee',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  optionIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionInfo: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  optionSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  documentIconContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  fileTypeBadge: {
    position: 'absolute',
    bottom: -8,
    right: -8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    minWidth: 40,
    alignItems: 'center',
  },
  fileTypeBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  documentDetails: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  documentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
  },
  documentBadgeText: {
    fontSize: 14,
    fontWeight: '500',
  },
}); 