import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.elfra3na.app',
  appName: 'فسيخ ورنجة الفراعنة',
  webDir: 'public',
  server: {
    url: 'https://elfra3na.vercel.app',
    cleartext: true,
  },
  android: {
    allowMixedContent: true,
    backgroundColor: '#071524',
  },
};

export default config;
