export interface CameraModalProps {
  showCamera: boolean;
  cameraType?: 'front' | 'back';
  onClose: (photo?: { path: string }) => void;
}       