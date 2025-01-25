import React, { useState } from 'react';
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
  ScrollView
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { colors } from '../util/constant';

const signupSchema = yup.object({
  name: yup.string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters'),
  email: yup.string()
    .required('Email is required')
    .email('Invalid email address'),
  password: yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters')
    .max(50, 'Password must be less than 50 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
});

export default function SignupScreen() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  
  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
    resolver: yupResolver(signupSchema),
    mode: 'onBlur',
  });

  const onSubmit = (data) => {
    console.log(data);
    router.push('/email-verify');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Create Account</Text>
      </View>

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
            <View style={styles.formContainer}>
              <View style={styles.inputContainer}>
                <View style={styles.inputGroup}>
                  <Controller
                    control={control}
                    name="name"
                    render={({ field: { value, onChange, onBlur } }) => (
                      <View style={[styles.inputWrapper, errors.name && styles.inputError]}>
                        <Ionicons name="person-outline" size={20} color={colors.primary} style={styles.inputIcon} />
                        <TextInput
                          style={styles.input}
                          placeholder="Full Name"
                          value={value}
                          onChangeText={onChange}
                          onBlur={onBlur}
                          autoCapitalize="words"
                          placeholderTextColor="#666"
                        />
                      </View>
                    )}
                  />
                  {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}
                </View>

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
                          secureTextEntry={!showPassword}
                          placeholderTextColor="#666"
                        />
                        <TouchableOpacity 
                          onPress={() => setShowPassword(!showPassword)}
                          style={styles.eyeButton}
                        >
                          <Ionicons 
                            name={showPassword ? "eye-outline" : "eye-off-outline"} 
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
                style={styles.button}
                onPress={handleSubmit(onSubmit)}
              >
                <Text style={styles.buttonText}>Continue</Text>
              </TouchableOpacity>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 10 : 0,
    height: Platform.OS === 'android' ? 72 : 52,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    backgroundColor: '#fff',
    marginTop: 16,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  formContainer: {
    flex: 1,
    padding: 16,
  },
  inputContainer: {
    gap: 20,
    marginTop: 8,
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
}); 