import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'Todo App',
  webDir: 'build',
  server:{
    appStartPath:"/todos.html"
  },
};

export default config;
