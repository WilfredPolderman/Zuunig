import { CameraModalProps } from '@/models/modals/cameraModal';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import { SwitchCamera as IconSwitchCamera, X as IconX } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Camera, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';

// Placeholder NoPermissionDialog
const NoPermissionDialog = ({ isOpen, onCancel }: { isOpen: boolean; onCancel: () => void }) => {
  if (!isOpen) return null;
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.7)', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
      <View style={{ backgroundColor: 'white', padding: 24, borderRadius: 12, alignItems: 'center' }}>
        <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 12 }}>Geen toestemming voor camera</Text>
        <Text style={{ marginBottom: 20, textAlign: 'center' }}>
          We hebben toestemming nodig om de camera te gebruiken. Geef toestemming in de instellingen en probeer opnieuw.
        </Text>
        <TouchableOpacity onPress={onCancel} style={{ backgroundColor: '#222', padding: 10, borderRadius: 8 }}>
          <Text style={{ color: 'white' }}>Annuleren</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const iconSize = 28;

const CameraModal: React.FC<CameraModalProps> = ({ showCamera, cameraType = 'back', onClose }) => {
  const { hasPermission, requestPermission } = useCameraPermission();
  const [haveRequestedCameraPermission, setHaveRequestedCameraPermission] = useState(false);
  const [activeCamera, setActiveCamera] = useState<'front' | 'back'>(cameraType);
  const cameraDevice = useCameraDevice(activeCamera);
  const camera = useRef<Camera>(null);

  useEffect(() => {
    if (showCamera && !hasPermission) {
      void requestPermission().then(() => setHaveRequestedCameraPermission(true));
    }
  }, [hasPermission, requestPermission, showCamera]);

  if (!hasPermission && haveRequestedCameraPermission) {
    return <NoPermissionDialog isOpen={showCamera} onCancel={() => onClose(undefined)} />;
  }

  if (!showCamera || !hasPermission || !cameraDevice) {
    return null;
  }

  const handleTakePhoto = async () => {
    try {
      const photo = await camera.current?.takePhoto();
      if (photo) {
        const galleryPhoto = await CameraRoll.saveAsset(`file://${photo.path}`, { type: 'photo' });
        onClose({ path: galleryPhoto.node.image.uri });
      } else {
        onClose(undefined);
      }
    } catch (e) {
      onClose(undefined);
    }
  };

  return (
    <Modal visible={showCamera} animationType="slide" transparent>
      <View style={styles.container}>
        <Camera
          ref={camera}
          device={cameraDevice}
          isActive={showCamera}
          style={styles.absoluteFill}
          photo
        />
        <TouchableOpacity
          style={[styles.iconButton, { right: 32, top: 32, position: 'absolute' }]}
          onPress={() => onClose(undefined)}
        >
          <IconX color="white" size={iconSize} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.iconButton, { right: 32, bottom: 120, position: 'absolute' }]}
          onPress={() => setActiveCamera(activeCamera === 'front' ? 'back' : 'front')}
        >
          <IconSwitchCamera color="white" size={iconSize} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.captureButton}
          onPress={handleTakePhoto}
        >
          <Text style={{ color: 'white', fontWeight: 'bold' }}>Take Photo</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  absoluteFill: {
    ...StyleSheet.absoluteFillObject,
  },
  iconButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 28,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureButton: {
    borderWidth: 2,
    borderColor: '#222',
    borderRadius: 48,
    height: 96,
    width: 96,
    position: 'absolute',
    bottom: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(60,60,60,0.7)',
    opacity: 0.8,
  },
});

export default CameraModal;
