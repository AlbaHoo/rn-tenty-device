package com.mobile_react_native;

import android.content.Context;
import android.util.Log;

import com.alibaba.sdk.android.push.MessageReceiver;
import com.alibaba.sdk.android.push.notification.CPushMessage;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;

import java.util.Map;

public class MyMessageReceiver extends MessageReceiver {
  public MyMessageReceiver() {
    super();
  }

  @Override
  protected void onMessage(Context context, CPushMessage cPushMessage) {
    super.onMessage(context, cPushMessage);
    WritableMap params = Arguments.createMap();
    params.putString("messageId", cPushMessage.getMessageId());
    params.putString("content", cPushMessage.getContent());
    params.putString("title", cPushMessage.getTitle());
    Log.i("TTTTT", "Sending message ...");
    PushModule.sendEvent("onMessage", params);
  }

  @Override
  protected void onNotification(Context context, String s, String s1, Map<String, String> map) {
    super.onNotification(context, s, s1, map);
    WritableMap params = Arguments.createMap();
    params.putString("content", s1);
    params.putString("title", s);
    for (Map.Entry<String, String> entry : map.entrySet()) {
      params.putString(entry.getKey(), entry.getValue());
    }
    Log.i("TTTTT", "Sending notification ...");

    PushModule.sendEvent("onNotification", params);
  }
  // 消息接收部分的LOG_TAG
  public static final String REC_TAG = "receiver";
  @Override
  public void onNotificationOpened(Context context, String title, String summary, String extraMap) {
    Log.e("MyMessageReceiver", "onNotificationOpened, title: " + title + ", summary: " + summary + ", extraMap:" + extraMap);
  }
  @Override
  protected void onNotificationClickedWithNoAction(Context context, String title, String summary, String extraMap) {
    Log.e("MyMessageReceiver", "onNotificationClickedWithNoAction, title: " + title + ", summary: " + summary + ", extraMap:" + extraMap);
  }
  @Override
  protected void onNotificationReceivedInApp(Context context, String title, String summary, Map<String, String> extraMap, int openType, String openActivity, String openUrl) {
    Log.e("MyMessageReceiver", "onNotificationReceivedInApp, title: " + title + ", summary: " + summary + ", extraMap:" + extraMap + ", openType:" + openType + ", openActivity:" + openActivity + ", openUrl:" + openUrl);
  }
  @Override
  protected void onNotificationRemoved(Context context, String messageId) {
    Log.e("MyMessageReceiver", "onNotificationRemoved");
  }
}
