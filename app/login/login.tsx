import { MaterialIcons } from '@expo/vector-icons';
import { Redirect } from 'expo-router';
import type { FunctionComponent } from 'react';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { AuthProvider, useSignIn } from '@/api/auth';
import useUser from '@/hooks/useUser';

const Login: FunctionComponent = () => {
  const {mutate: signInWithSocialAuth} = useSignIn()
  const user = useUser()
  const piggyAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(piggyAnim, {
          toValue: -15,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(piggyAnim, {
          toValue: 0,
          duration: 700,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [piggyAnim]);

  if (user) {
    return <Redirect href="/" />
  }

  return (
    <View style={styles.background}>
      <View style={styles.flag}>
        {[0,1,2,3,4,5,6,7,8].map(i => (
          <View
            key={i}
            style={{
              flex: 1,
              width: '100%',
              backgroundColor: i % 2 === 0 ? '#0050a4' : '#fff',
            }}
          />
        ))}
      </View>
      <View style={styles.container}>
        <Animated.View style={{ transform: [{ translateY: piggyAnim }] }}>
          <MaterialIcons name="savings" size={64} color="#0050a4" style={{ marginBottom: 16, zIndex: 1 }} />
        </Animated.View>
        <Text style={styles.title}>Ons bin Zuunig!</Text>
        <Text style={styles.subtitle}>Jie ôk?</Text>
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => signInWithSocialAuth({provider: AuthProvider.GOOGLE})}
          activeOpacity={0.85}
        >
          <MaterialIcons name="login" size={22} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.buttonText}>Sign in met Google</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  flag: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'column',
    zIndex: 0,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    zIndex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    zIndex: 1,
    textShadowColor: '#0050a4',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 32,
    opacity: 0.95,
    textAlign: 'center',
    zIndex: 1,
    textShadowColor: '#0050a4',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 28,
    backgroundColor: '#0050a4',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 1,
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
    zIndex: 1,
    textShadowColor: '#003366',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
})

export default Login
