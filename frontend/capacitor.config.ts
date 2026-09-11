import type { CapacitorConfig } from '@capacitor/cli';


const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'Todo App',
  webDir: 'build',
  server:{
    appStartPath:"/todos.html",
    androidScheme:process.env.NODE_ENV?.trim()==='debug'?'http':'https',
  }
};

export default config;
