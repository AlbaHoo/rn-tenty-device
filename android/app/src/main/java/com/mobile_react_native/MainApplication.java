package com.mobile_react_native;

import com.rssignaturecapture.RSSignatureCapturePackage;

import android.app.Application;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.Context;
import android.graphics.Color;
import android.os.Build;
import android.util.Log;
import android.widget.Toast;

import com.alibaba.sdk.android.push.CloudPushService;
import com.alibaba.sdk.android.push.CommonCallback;
import com.alibaba.sdk.android.push.noonesdk.PushServiceFactory;
import com.brentvatne.react.ReactVideoPackage;
import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.soloader.SoLoader;
import java.lang.reflect.InvocationTargetException;
import java.util.List;

import org.acra.*;
import org.acra.annotation.*;
import org.acra.sender.HttpSender;

@AcraCore(buildConfigClass = BuildConfig.class)
// @AcraMailSender(mailTo = "alba@tenty.co")
@AcraHttpSender(uri = "http://admin.helonenergy.cn:1234/api/v1/reports",
  httpMethod = HttpSender.Method.POST)
@AcraToast(resText=R.string.acra_toast_text, length = Toast.LENGTH_LONG)
public class MainApplication extends Application implements ReactApplication {

  @Override
  protected void attachBaseContext(Context base) {
    super.attachBaseContext(base);

    // The following line triggers the initialization of ACRA
    ACRA.init(this);
  }
  private final ReactNativeHost mReactNativeHost =
      new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
          return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
          @SuppressWarnings("UnnecessaryLocalVariable")
          List<ReactPackage> packages = new PackageList(this).getPackages();
          // Packages that cannot be autolinked yet can be added manually here, for example:
          // packages.add(new MyReactNativePackage());
          packages.add(new RegisteredPackage());
          packages.add(new RSSignatureCapturePackage());
          packages.add(new ReactVideoPackage());
          return packages;
        }

        @Override
        protected String getJSMainModuleName() {
          return "index";
        }
      };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
    initializeFlipper(this); // Remove this line if you don't want Flipper enabled
    this.initCloudChannel();
  }

  private void initCloudChannel() {
    // When you target Android 8.0 (API level 26), you must implement one or more notification channel
    this.createNotificationChannel();
    PushServiceFactory.init(this.getApplicationContext());
    CloudPushService pushService = PushServiceFactory.getCloudPushService();
    pushService.register(this.getApplicationContext(),  new CommonCallback() {
      @Override
      public void onSuccess(String s) {
        Log.i("HELONG", "init cloudchannel success");
      }
      @Override
      public void onFailed(String s, String s1) {
        Log.e("HELONG", "init cloudchannel failed. errorCode:" + s + ". errorMsg:" + s1);
      }
    });
  }

  private void createNotificationChannel() {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      NotificationManager mNotificationManager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
      // 通知渠道的id
      String id = "1";
      // 用户可以看到的通知渠道的名字.
      CharSequence name = "notification channel";
      // 用户可以看到的通知渠道的描述
      String description = "notification description";
      int importance = NotificationManager.IMPORTANCE_HIGH;
      NotificationChannel mChannel = new NotificationChannel(id, name, importance);
      // 配置通知渠道的属性
      mChannel.setDescription(description);
      // 设置通知出现时的闪灯（如果 android 设备支持的话）
      mChannel.enableLights(true);
      mChannel.setLightColor(Color.RED);
      // 设置通知出现时的震动（如果 android 设备支持的话）
      mChannel.enableVibration(true);
      mChannel.setVibrationPattern(new long[]{100, 200, 300, 400, 500, 400, 300, 200, 400});
      //最后在notificationmanager中创建该通知渠道
      mNotificationManager.createNotificationChannel(mChannel);
    }
  }

  /**
   * Loads Flipper in React Native templates.
   *
   * @param context
   */
  private static void initializeFlipper(Context context) {
    if (BuildConfig.DEBUG) {
      try {
        /*
         We use reflection here to pick up the class that initializes Flipper,
        since Flipper library is not available in release mode
        */
        Class<?> aClass = Class.forName("com.facebook.flipper.ReactNativeFlipper");
        aClass.getMethod("initializeFlipper", Context.class).invoke(null, context);
      } catch (ClassNotFoundException e) {
        e.printStackTrace();
      } catch (NoSuchMethodException e) {
        e.printStackTrace();
      } catch (IllegalAccessException e) {
        e.printStackTrace();
      } catch (InvocationTargetException e) {
        e.printStackTrace();
      }
    }
  }
}
