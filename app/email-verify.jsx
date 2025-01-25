import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '../util/constant';
import { Ionicons } from '@expo/vector-icons';

export default function EmailVerifyScreen() {
  const router = useRouter();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);

  const handleCodeChange = (text, index) => {
    if (text.length <= 1) {
      const newCode = [...code];
      newCode[index] = text;
      setCode(newCode);
      
      if (text.length === 1 && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleVerify = () => {
    const verificationCode = code.join('');
    console.log('Verification code:', verificationCode);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="mail" size={60} color={colors.primary} />
        <Text style={styles.title}>Verify Your Email</Text>
        <Text style={styles.subtitle}>
          We've sent a 6-digit code to your email address
        </Text>
      </View>

      <View style={styles.codeContainer}>
        {code.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => (inputRefs.current[index] = ref)}
            style={styles.codeInput}
            maxLength={1}
            keyboardType="number-pad"
            value={digit}
            onChangeText={(text) => handleCodeChange(text, index)}
          />
        ))}
      </View>

      <TouchableOpacity 
        style={styles.button}
        onPress={handleVerify}
      >
        <Text style={styles.buttonText}>Verify Email</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.resendContainer}>
        <Text style={styles.resendText}>Didn't receive the code? </Text>
        <Text style={styles.resendLink}>Resend</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginTop: 20,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 30,
  },
  codeInput: {
    width: 50,
    height: 60,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    fontSize: 24,
    textAlign: 'center',
    backgroundColor: '#F8F8F8',
    color: colors.primary,
    fontWeight: '600',
  },
  button: {
    backgroundColor: colors.primary,
    padding: 18,
    borderRadius: 12,
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  resendText: {
    color: '#666',
    fontSize: 15,
  },
  resendLink: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: '600',
  },
}); 