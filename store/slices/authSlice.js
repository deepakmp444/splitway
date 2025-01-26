import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import env from '../../config/env';
import { storage } from '../../util/storage';

// Create axios instance with interceptor
const api = axios.create();

// Add a request interceptor to add token to all requests
api.interceptors.request.use(
  async (config) => {
    const token = await storage.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("Token added to request headers:", token);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Create async thunk for user registration
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const apiUrl = `${env.apiUrl}/auth/register`;
      const response = await api.post(apiUrl, userData);
      return response.data;
    } catch (error) {
      if (error.response) {
        return rejectWithValue(error.response.data.message || 'Server error occurred');
      } else if (error.request) {
        return rejectWithValue('No response from server. Please check your connection.');
      } else {
        return rejectWithValue(error.message || 'An error occurred during registration');
      }
    }
  }
);

// Create async thunk for email verification
export const verifyEmail = createAsyncThunk(
  'auth/verifyEmail',
  async (verificationData, { rejectWithValue }) => {
    try {
      const apiUrl = `${env.apiUrl}/auth/verify-email`;
      const response = await api.post(apiUrl, verificationData);

      // Store token and user data on successful verification
      if (response.data.token) {
        await storage.setToken(response.data.token);
      }
      if (response.data.user) {
        await storage.setUser(response.data.user);
      }

      return response.data;
    } catch (error) {
      if (error.response) {
        return rejectWithValue(error.response.data.message || 'Verification failed');
      } else if (error.request) {
        return rejectWithValue('No response from server. Please check your connection.');
      } else {
        return rejectWithValue(error.message || 'An error occurred during verification');
      }
    }
  }
);

// Check auth status
export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const [token, user] = await Promise.all([
        storage.getToken(),
        storage.getUser()
      ]);

      if (token && user) {
        return { token, user };
      }
      return rejectWithValue('No auth data found');
    } catch (error) {
      return rejectWithValue('Failed to check auth status');
    }
  }
);

// Create async thunk for login
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (loginData, { rejectWithValue }) => {
    try {
      const apiUrl = `${env.apiUrl}/auth/login`;
      const response = await api.post(apiUrl, loginData);

      // Store token and user data on successful login
      if (response.data.token) {
        await storage.setToken(response.data.token);
      }
      if (response.data.user) {
        await storage.setUser(response.data.user);
      }

      return response.data;
    } catch (error) {
      if (error.response) {
        return rejectWithValue(error.response.data.message || 'Login failed');
      } else if (error.request) {
        return rejectWithValue('No response from server. Please check your connection.');
      } else {
        return rejectWithValue(error.message || 'An error occurred during login');
      }
    }
  }
);

const initialState = {
  user: null,
  token: null,
  loading: false,
  error: null,
  isSignup: false,    // indicates successful signup but needs verification
  isVerified: false,  // indicates email is verified
  userId: "",
  verificationLoading: false,
  verificationError: null,
  isAuthenticated: false, // indicates fully authenticated (verified and has token)
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isSignup = false;
      state.isVerified = false;
      state.isAuthenticated = false;
      state.error = null;
      state.verificationError = null;
      // Clear stored auth data
      storage.clearAuth();
    },
    clearError: (state) => {
      state.error = null;
      state.verificationError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Registration reducers
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isSignup = true;
        state.userId = action.payload.userId;
        state.isAuthenticated = false; // Ensure not authenticated until verified
        state.isVerified = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      // Email verification reducers
      .addCase(verifyEmail.pending, (state) => {
        state.verificationLoading = true;
        state.verificationError = null;
      })
      .addCase(verifyEmail.fulfilled, (state, action) => {
        state.verificationLoading = false;
        state.isVerified = true;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.verificationLoading = false;
        state.verificationError = action.payload;
        state.isAuthenticated = false;
      })
      // Check auth reducers
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.isVerified = true;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isAuthenticated = false;
        state.isVerified = false;
      })
      // Login reducers
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer; 