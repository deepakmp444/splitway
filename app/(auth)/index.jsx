import React, { useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Platform,
    SafeAreaView,
    Keyboard,
    TouchableWithoutFeedback,
    StatusBar,
    KeyboardAvoidingView,
    ScrollView,
    ActivityIndicator,
    Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { colors } from '../../util/constant';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError } from '../../store/slices/authSlice';

const loginSchema = yup.object({
    email: yup.string()
        .required('Email is required')
        .email('Invalid email address'),
    password: yup.string()
        .required('Password is required')
        .min(6, 'Password must be at least 6 characters'),
});

export default function LoginScreen() {
    const router = useRouter();
    const dispatch = useDispatch();

    const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

    const { control, handleSubmit, formState: { errors }, watch, setValue } = useForm({
        defaultValues: {
            email: '',
            password: '',
            showPassword: false,
        },
        resolver: yupResolver(loginSchema),
        mode: 'onBlur',
    });

    useEffect(() => {
        if (error) {
            Alert.alert('Login Error', error);
            dispatch(clearError());
        }
    }, [error, dispatch]);

    useEffect(() => {
        if (isAuthenticated) {
            router.replace('/(tabs)');
        }
    }, [isAuthenticated, router]);

    const onSubmit = (data) => {
        dispatch(loginUser(data));
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardAvoid}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <ScrollView
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                        bounces={false}
                    >
                        <View style={styles.inner}>
                            <View style={styles.header}>
                                <Text style={styles.title}>Welcome Back!</Text>
                                <Text style={styles.subtitle}>Sign in to continue</Text>
                            </View>

                            <View style={styles.formContainer}>
                                <View style={styles.inputContainer}>
                                    <View style={styles.inputGroup}>
                                        <Controller
                                            control={control}
                                            name="email"
                                            render={({ field: { value, onChange, onBlur } }) => (
                                                <View style={[styles.inputWrapper, errors.email && styles.inputError]}>
                                                    <Ionicons name="mail-outline" size={20} color={colors.primary} style={styles.inputIcon} />
                                                    <TextInput
                                                        style={styles.input}
                                                        placeholder="Email"
                                                        value={value}
                                                        onChangeText={onChange}
                                                        onBlur={onBlur}
                                                        keyboardType="email-address"
                                                        autoCapitalize="none"
                                                        placeholderTextColor="#666"
                                                    />
                                                </View>
                                            )}
                                        />
                                        {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}
                                    </View>

                                    <View style={styles.inputGroup}>
                                        <Controller
                                            control={control}
                                            name="password"
                                            render={({ field: { value, onChange, onBlur } }) => (
                                                <View style={[styles.inputWrapper, errors.password && styles.inputError]}>
                                                    <Ionicons name="lock-closed-outline" size={20} color={colors.primary} style={styles.inputIcon} />
                                                    <TextInput
                                                        style={[styles.input, { flex: 1 }]}
                                                        placeholder="Password"
                                                        value={value}
                                                        onChangeText={onChange}
                                                        onBlur={onBlur}
                                                        secureTextEntry={!watch('showPassword')}
                                                        placeholderTextColor="#666"
                                                    />
                                                    <TouchableOpacity
                                                        onPress={() => setValue('showPassword', !watch('showPassword'))}
                                                        style={styles.eyeButton}
                                                    >
                                                        <Ionicons
                                                            name={watch('showPassword') ? "eye-outline" : "eye-off-outline"}
                                                            size={20}
                                                            color={colors.primary}
                                                        />
                                                    </TouchableOpacity>
                                                </View>
                                            )}
                                        />
                                        {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}
                                    </View>
                                </View>

                                <TouchableOpacity
                                    style={[styles.button, loading && styles.buttonDisabled]}
                                    onPress={handleSubmit(onSubmit)}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <ActivityIndicator color="#fff" />
                                    ) : (
                                        <Text style={styles.buttonText}>Sign In</Text>
                                    )}
                                </TouchableOpacity>

                                <View style={styles.footer}>
                                    <Text style={styles.footerText}>Don't have an account? </Text>
                                    <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
                                        <Text style={styles.footerLink}>Sign Up</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    keyboardAvoid: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
    },
    inner: {
        flex: 1,
        padding: 16,
    },
    header: {
        alignItems: 'center',
        marginTop: 60,
        marginBottom: 40,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: colors.primary,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
    },
    formContainer: {
        flex: 1,
    },
    inputContainer: {
        gap: 20,
    },
    inputGroup: {
        gap: 4,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8F8F8',
        borderRadius: 12,
        paddingHorizontal: 16,
        height: 52,
        borderWidth: 1,
        borderColor: '#E5E5E5',
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#000',
    },
    eyeButton: {
        padding: 8,
    },
    inputError: {
        borderColor: '#FF3B30',
    },
    errorText: {
        color: '#FF3B30',
        fontSize: 12,
        marginTop: 4,
        marginLeft: 4,
    },
    button: {
        backgroundColor: colors.primary,
        height: 52,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 32,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    footerText: {
        color: '#666',
        fontSize: 15,
    },
    footerLink: {
        color: colors.primary,
        fontSize: 15,
        fontWeight: '600',
    },
}); 