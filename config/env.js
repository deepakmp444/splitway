import { Platform } from 'react-native';

const ENV = {
  development: {
    // For iOS simulator
    apiUrl: Platform.select({
      ios: 'http://192.168.29.166:4002/api',
      // For Android use your machine's IP address
      android: 'http://192.168.29.166:4002/api', // Android Studio Emulator
      // android: 'http://YOUR_MACHINE_IP:4002/api' // For physical device, replace with your IP
    })
  },
  production: {
    apiUrl: 'https://your-production-api.com/api'
  }
};

const getEnvVars = (env = 'development') => {
  const config = env === 'production' ? ENV.production : ENV.development;
  return config;
};

export default getEnvVars(process.env.NODE_ENV || 'development'); 