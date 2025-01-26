import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../util/constant';
import { useDispatch, useSelector } from 'react-redux';
import { verifyEmail, clearError } from '../../store/slices/authSlice';

export default function EmailVerifyScreen() {
    const router = useRouter();
    const dispatch = useDispatch();
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const inputRefs = useRef([]);

    const {
        verificationLoading,
        verificationError,
        isVerified,
        userId
    } = useSelector((state) => state.auth);

    useEffect(() => {
        if (verificationError) {
            Alert.alert('Verification Error', verificationError);
            dispatch(clearError());
        }
    }, [verificationError, dispatch]);

    useEffect(() => {
        if (isVerified) {
            router.replace('/(tabs)');
        }
    }, [isVerified, router]);

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
        if (verificationCode.length !== 6) {
            Alert.alert('Invalid Code', 'Please enter a valid 6-digit verification code');
            return;
        }

        dispatch(verifyEmail({
            userId,
            verificationCode
        }));
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
                        style={[styles.codeInput, digit && styles.filledInput]}
                        maxLength={1}
                        keyboardType="number-pad"
                        value={digit}
                        onChangeText={(text) => handleCodeChange(text, index)}
                    />
                ))}
            </View>

            <TouchableOpacity
                style={[styles.button, verificationLoading && styles.buttonDisabled]}
                onPress={handleVerify}
                disabled={verificationLoading}
            >
                {verificationLoading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>Verify Email</Text>
                )}
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
    filledInput: {
        borderColor: colors.primary,
        backgroundColor: '#fff',
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
    buttonDisabled: {
        opacity: 0.7,
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