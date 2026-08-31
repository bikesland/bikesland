import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function registerForPushNotificationsAsync() {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "BikesLand",
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
    });
  }

  const { status: existingStatus } =
    await Notifications.getPermissionsAsync();

  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } =
      await Notifications.requestPermissionsAsync();

    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    console.log("Notification permission not granted");
    return;
  }

  return true;
}

export async function showNewBikeNotification(
  bikeName: string
) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "🔔 BikesLand",
      body: `New bike added! ${bikeName} is now available.`,
      sound: "default",
    },
    trigger: null,
  });
}

export async function showPriceUpdatedNotification(
  bikeName: string,
  price: string
) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "💰 BikesLand",
      body: `${bikeName} price has been updated to ${price}.`,
      sound: "default",
    },
    trigger: null,
  });
}