package com.example.app;

import android.webkit.CookieManager;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    // Forces a synchronous flush whenever the app is paused or backgrounded
    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        if (!hasFocus) {
            // Forces CookieManager to flush RAM cookies to disk when app loses focus
            CookieManager.getInstance().flush();
        }
    }
}
