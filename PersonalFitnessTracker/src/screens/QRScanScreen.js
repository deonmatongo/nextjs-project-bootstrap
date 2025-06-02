import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Alert } from 'react-native';
import { RNCamera } from 'react-native-camera';

export default function QRScanScreen() {
  const [scanned, setScanned] = useState(false);

  const onBarCodeRead = ({ data }) => {
    if (!scanned) {
      setScanned(true);
      Alert.alert('QR Code Scanned', `Data: ${data}`, [
        { text: 'OK', onPress: () => setScanned(false) },
      ]);
    }
  };

  return (
    <View style={styles.container}>
      <RNCamera
        style={styles.camera}
        onBarCodeRead={onBarCodeRead}
        captureAudio={false}
        barCodeTypes={[RNCamera.Constants.BarCodeType.qr]}
      >
        <View style={styles.overlay}>
          <Text style={styles.instruction}>Align QR code within frame to scan</Text>
        </View>
      </RNCamera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  camera: { flex: 1, justifyContent: 'flex-end', alignItems: 'center' },
  overlay: {
    position: 'absolute',
    top: 20,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 8,
  },
  instruction: { color: 'white', fontSize: 16 },
});
