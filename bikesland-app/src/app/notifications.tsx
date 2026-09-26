import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  collection,
  getDocs,
} from "firebase/firestore";

import { db } from "../../firebase";

type NotificationItem = {
  id: string;
  title: string;
  message: string;
  type: string;
  createdAt?: any;
};

const CLEARED_NOTIFICATIONS_KEY =
  "@bikesland_cleared_notifications";

export default function NotificationsScreen() {
  const router = useRouter();

  const [notifications, setNotifications] =
    useState<NotificationItem[]>([]);

  const [loading, setLoading] = useState(true);
  const [clearing, setClearing] = useState(false);

  // =========================
  // LOAD NOTIFICATIONS
  // =========================
  const loadNotifications = async () => {
    try {
      setLoading(true);

      console.log(
        "🔔 Loading BikesLand notifications..."
      );

      // Get notifications from Firestore
      const snapshot = await getDocs(
        collection(db, "notifications")
      );

      console.log(
        "🔔 Notifications found:",
        snapshot.docs.length
      );

      // =========================
      // GET LOCALLY CLEARED IDS
      // =========================
      const clearedData =
        await AsyncStorage.getItem(
          CLEARED_NOTIFICATIONS_KEY
        );

      const clearedIds: string[] =
        clearedData
          ? JSON.parse(clearedData)
          : [];

      const clearedSet =
        new Set(clearedIds);

      // =========================
      // CONVERT FIRESTORE DATA
      // =========================
      const data: NotificationItem[] =
        snapshot.docs
          .map((item) => {
            const notification =
              item.data();

            return {
              id: item.id,

              title: String(
                notification.title ||
                  "BikesLand"
              ),

              message: String(
                notification.message ||
                  notification.description ||
                  ""
              ),

              type: String(
                notification.type ||
                  "general"
              ),

              createdAt:
                notification.createdAt,
            };
          })

          // =========================
          // HIDE LOCALLY CLEARED
          // =========================
          .filter(
            (item) =>
              !clearedSet.has(item.id)
          );

      // =========================
      // SORT NEWEST FIRST
      // =========================
      data.sort((a, b) => {
        try {
          const timeA =
            a.createdAt?.toMillis?.() || 0;

          const timeB =
            b.createdAt?.toMillis?.() || 0;

          return timeB - timeA;
        } catch {
          return 0;
        }
      });

      setNotifications(data);
    } catch (error) {
      console.log(
        "❌ Notifications Error:",
        error
      );

      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // CLEAR ALL
  // =========================
  const clearAllNotifications = () => {
    if (notifications.length === 0) {
      return;
    }

    Alert.alert(
      "Clear All Notifications",
      "Clear all notifications from this device?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },

        {
          text: "Clear All",
          style: "destructive",

          onPress: async () => {
            try {
              setClearing(true);

              console.log(
                "🗑️ Clearing notifications on this device..."
              );

              // Get already cleared IDs
              const existingData =
                await AsyncStorage.getItem(
                  CLEARED_NOTIFICATIONS_KEY
                );

              const existingIds: string[] =
                existingData
                  ? JSON.parse(existingData)
                  : [];

              // Current notification IDs
              const currentIds =
                notifications.map(
                  (item) => item.id
                );

              // Combine old + current IDs
              const allClearedIds =
                Array.from(
                  new Set([
                    ...existingIds,
                    ...currentIds,
                  ])
                );

              // Save locally
              await AsyncStorage.setItem(
                CLEARED_NOTIFICATIONS_KEY,
                JSON.stringify(
                  allClearedIds
                )
              );

              // Empty current screen
              setNotifications([]);

              console.log(
                "✅ Notifications cleared on this device"
              );
            } catch (error) {
              console.log(
                "❌ Clear notifications error:",
                error
              );

              Alert.alert(
                "Error",
                "Could not clear notifications. Please try again."
              );
            } finally {
              setClearing(false);
            }
          },
        },
      ]
    );
  };

  // =========================
  // LOAD WHEN SCREEN OPENS
  // =========================
  useEffect(() => {
    loadNotifications();
  }, []);

  // =========================
  // ICON
  // =========================
  const getIcon = (type: string) => {
    switch (type) {
      case "bike":
        return "🏍️";

      case "price":
        return "💰";

      case "offer":
        return "🔥";

      default:
        return "🔔";
    }
  };

  // =========================
  // DATE
  // =========================
  const getTime = (createdAt: any) => {
    if (!createdAt) {
      return "Recently";
    }

    try {
      if (
        typeof createdAt.toDate ===
        "function"
      ) {
        const date =
          createdAt.toDate();

        return date.toLocaleDateString(
          "en-IN",
          {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }
        );
      }

      return "Recently";
    } catch {
      return "Recently";
    }
  };

  return (
    <View style={styles.container}>

      {/* =========================
          HEADER
      ========================= */}

      <View style={styles.header}>

        {/* BACK */}

        <TouchableOpacity
          style={styles.backButton}
          onPress={() =>
            router.back()
          }
          activeOpacity={0.7}
        >
          <Text style={styles.backText}>
            ‹
          </Text>
        </TouchableOpacity>

        {/* TITLE */}

        <Text style={styles.headerTitle}>
          Notifications
        </Text>

        {/* CLEAR ALL */}

        {!loading &&
          notifications.length > 0 && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={
                clearAllNotifications
              }
              disabled={clearing}
              activeOpacity={0.7}
            >
              {clearing ? (
                <ActivityIndicator
                  size="small"
                  color="#e50914"
                />
              ) : (
                <Text
                  style={styles.clearText}
                >
                  Clear All
                </Text>
              )}
            </TouchableOpacity>
          )}

      </View>

      {/* =========================
          CONTENT
      ========================= */}

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={
          false
        }
      >

        {/* LOADING */}

        {loading ? (

          <View style={styles.center}>

            <ActivityIndicator
              size="large"
              color="#e50914"
            />

            <Text
              style={styles.loadingText}
            >
              Loading notifications...
            </Text>

          </View>

        ) : notifications.length === 0 ? (

          /* EMPTY */

          <View style={styles.empty}>

            <Text
              style={styles.emptyIcon}
            >
              🔔
            </Text>

            <Text
              style={styles.emptyTitle}
            >
              No Notifications
            </Text>

            <Text
              style={styles.emptyText}
            >
              New BikesLand bikes and
              updates will appear here.
            </Text>

            <TouchableOpacity
              style={styles.refreshButton}
              onPress={loadNotifications}
            >
              <Text
                style={styles.refreshText}
              >
                🔄 Refresh
              </Text>
            </TouchableOpacity>

          </View>

        ) : (

          /* NOTIFICATIONS */

          notifications.map((item) => (

            <View
              key={item.id}
              style={styles.card}
            >

              {/* ICON */}

              <View
                style={styles.iconCircle}
              >
                <Text
                  style={styles.icon}
                >
                  {getIcon(item.type)}
                </Text>
              </View>

              {/* CONTENT */}

              <View
                style={styles.cardContent}
              >

                <Text
                  style={styles.title}
                >
                  {item.title}
                </Text>

                <Text
                  style={styles.message}
                >
                  {item.message}
                </Text>

                <Text
                  style={styles.time}
                >
                  {getTime(
                    item.createdAt
                  )}
                </Text>

              </View>

            </View>

          ))

        )}

        <View
          style={{ height: 40 }}
        />

      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#000",
  },

  header: {
    height: 105,
    paddingTop: 42,
    paddingHorizontal: 18,
    backgroundColor: "#000",
    borderBottomWidth: 1,
    borderBottomColor: "#222",
    flexDirection: "row",
    alignItems: "center",
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#111827",
    borderWidth: 1,
    borderColor: "#333",
    justifyContent: "center",
    alignItems: "center",
  },

  backText: {
    color: "#fff",
    fontSize: 30,
    lineHeight: 34,
  },

  headerTitle: {
    flex: 1,
    color: "#fff",
    fontSize: 21,
    fontWeight: "800",
    textAlign: "center",
    marginLeft: 8,
  },

  clearButton: {
    minWidth: 68,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },

  clearText: {
    color: "#e50914",
    fontSize: 11,
    fontWeight: "800",
  },

  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 18,
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#111",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#292929",
    padding: 14,
    marginBottom: 12,
  },

  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#1b1b1b",
    justifyContent: "center",
    alignItems: "center",
  },

  icon: {
    fontSize: 22,
  },

  cardContent: {
    flex: 1,
    marginLeft: 12,
  },

  title: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "800",
  },

  message: {
    color: "#aaa",
    fontSize: 11,
    lineHeight: 17,
    marginTop: 4,
  },

  time: {
    color: "#666",
    fontSize: 9,
    marginTop: 5,
  },

  center: {
    alignItems: "center",
    paddingTop: 60,
  },

  loadingText: {
    color: "#777",
    fontSize: 12,
    marginTop: 12,
  },

  empty: {
    alignItems: "center",
    paddingTop: 70,
    paddingHorizontal: 30,
  },

  emptyIcon: {
    fontSize: 45,
    marginBottom: 15,
  },

  emptyTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "800",
  },

  emptyText: {
    color: "#777",
    fontSize: 11,
    textAlign: "center",
    marginTop: 7,
    lineHeight: 17,
  },

  refreshButton: {
    marginTop: 18,
    backgroundColor: "#e50914",
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 8,
  },

  refreshText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "800",
  },

});