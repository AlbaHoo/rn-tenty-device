package com.mobile_react_native;

import android.util.Log;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.mobile_react_native.utils.NetworkUtils;

import anet.channel.util.ALog;


public class UtilityModule extends ReactContextBaseJavaModule {
  private static ReactApplicationContext reactContext;

  public UtilityModule(ReactApplicationContext context) {
    super(context);
    reactContext = context;
  }

  @Override
  public String getName() {
    return "Utility";
  }

  @ReactMethod
  public void getMacAddress(Promise promise) {
    promise.resolve(NetworkUtils.getMacAddress("wlan0"));
  }

  @ReactMethod
  public void getIpAddress(Promise promise){
    promise.resolve(NetworkUtils.getIpAddress(true));
  }
}