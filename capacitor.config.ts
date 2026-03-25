import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.lucks.homecode',
  appName: 'HomeCode',
  webDir: 'web/out',
  server: {
    cleartext: true,
    allowNavigation: ['174.138.65.46'],
  },
};

export default config;
