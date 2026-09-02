import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useRouter } from "expo-router";

import {
  collection,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";

import { db } from "../firebase";

type NotificationItem = {
  id: string;
  title?: string;
  message?: string;
  type?: string;
  bikeName?: string;
  price?: string;
  location?: string;
  createdAt?: any;
};

export default function NotificationsScreen() {
  const router = useRouter();

  const [notifications, setNotifications] = useState<
    NotificationItem[]
  >([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const notificationsQuery = query(
      collection(db, "notifications"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      notificationsQuery,
      (snapshot) => {
        const data: NotificationItem[] =
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as NotificationItem[];

        setNotifications(data);
        setLoading(false);
      },
      (error) => {
        console.log(
          "Notifications error:",
          error
        );

        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const formatDate = (timestamp: any) => {
    if (!timestamp) {
      return "";
    }

    try {
      const date = timestamp.toDate
        ? timestamp.toDate()
        : new Date(timestamp);

      return date.toLocaleString();
    } catch {
      return "";
    }
  };

  const renderNotification = ({
    item,
  }: {
    item: NotificationItem;
  }) => {
    return (
      <View style={styles.notificationCard}>
        <View style={styles.iconCircle}>
          <Text style={styles.bell}>🔔</Text>
        </View>

        <View style={styles.notificationContent}>
          <Text style={styles.notificationTitle}>
            {item.title || "BikesLand Update"}
          </Text>

          <Text style={styles.notificationMessage}>
            {item.message || ""}
          </Text>

          {item.bikeName && (
            <Text style={styles.bikeInfo}>
              🏍️ {item.bikeName}
            </Text>
          )}

          {item.price && (
            <Text style={styles.bikeInfo}>
              💰 ₹{item.price}
            </Text>
          )}

          {item.location && (
            <Text style={styles.bikeInfo}>
              📍 {item.location}
            </Text>
          )}

          <Text style={styles.date}>
            {formatDate(item.createdAt)}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Text style={styles.backText}>
            ‹
          </Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          Notifications
        </Text>

        <View style={styles.headerSpace} />
      </View>

      {/* CONTENT */}

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator
            size="large"
            color="#e50914"
          />

          <Text style={styles.loadingText}>
            Loading notifications...
          </Text>
        </View>
      ) : notifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyBell}>
            🔔
          </Text>

          <Text style={styles.emptyTitle}>
            No Notifications
          </Text>

          <Text style={styles.emptyText}>
            New BikesLand updates will appear here.
          </Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={renderNotification}
          contentContainerStyle={
            styles.listContent
          }
          showsVerticalScrollIndicator={false}
        />
      )}
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
    paddingTop: 45,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#222",
  },

  backButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#111827",
    borderWidth: 1,
    borderColor: "#292929",
    justifyContent: "center",
    alignItems: "center",
  },

  backText: {
    color: "#fff",
    fontSize: 38,
    fontWeight: "300",
    lineHeight: 40,
    marginTop: -4,
  },

  headerTitle: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "800",
  },

  headerSpace: {
    width: 52,
  },

  listContent: {
    padding: 18,
    paddingBottom: 40,
  },

  notificationCard: {
    backgroundColor: "#111827",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#292929",
    padding: 16,
    marginBottom: 14,
    flexDirection: "row",
  },

  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#1b1b1b",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 13,
  },

  bell: {
    fontSize: 24,
  },

  notificationContent: {
    flex: 1,
  },

  notificationTitle: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "800",
    marginBottom: 7,
  },

  notificationMessage: {
    color: "#ccc",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 10,
  },

  bikeInfo: {
    color: "#fff",
    fontSize: 13,
    marginTop: 3,
  },

  date: {
    color: "#777",
    fontSize: 11,
    marginTop: 10,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    color: "#888",
    marginTop: 12,
    fontSize: 13,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },

  emptyBell: {
    fontSize: 70,
    marginBottom: 25,
  },

  emptyTitle: {
    color: "#fff",
    fontSize: 25,
    fontWeight: "800",
    marginBottom: 10,
  },

  emptyText: {
    color: "#777",
    fontSize: 14,
    textAlign: "center",
  },
});