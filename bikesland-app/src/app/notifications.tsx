import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import {
  collection,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "../../firebase";

type NotificationItem = {
  id: string;
  title: string;
  message: string;
  type: string;
  createdAt?: any;
};

export default function NotificationsScreen() {
  const router = useRouter();

  const [notifications, setNotifications] = useState<NotificationItem[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  const loadNotifications = async () => {
    try {
      setLoading(true);

      const notificationsQuery = query(
        collection(db, "notifications"),
        orderBy("createdAt", "desc")
      );

      const snapshot = await getDocs(notificationsQuery);

      const data: NotificationItem[] = snapshot.docs.map((doc) => {
        const item = doc.data();

        return {
          id: doc.id,
          title: String(item.title || "BikesLand"),
          message: String(
            item.message || item.description || ""
          ),
          type: String(item.type || "general"),
          createdAt: item.createdAt,
        };
      });

      setNotifications(data);
    } catch (error) {
      console.log("Notifications Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const getIcon = (type: string) => {
    if (type === "bike") return "🏍️";
    if (type === "price") return "💰";
    if (type === "offer") return "🔥";
    return "🔔";
  };

  const getTime = (createdAt: any) => {
    if (!createdAt) return "Recently";

    try {
      const date = createdAt.toDate();

      return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "Recently";
    }
  };

  return (
    <View style={styles.container}>

      {/* HEADER */}

      <View style={styles.header}>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          Notifications
        </Text>

      </View>

      {/* CONTENT */}

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >

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

          <View style={styles.empty}>

            <Text style={styles.emptyIcon}>
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

          notifications.map((item) => (

            <View
              key={item.id}
              style={styles.card}
            >

              <View style={styles.iconCircle}>

                <Text style={styles.icon}>
                  {getIcon(item.type)}
                </Text>

              </View>

              <View style={styles.cardContent}>

                <Text style={styles.title}>
                  {item.title}
                </Text>

                <Text style={styles.message}>
                  {item.message}
                </Text>

                <Text style={styles.time}>
                  {getTime(item.createdAt)}
                </Text>

              </View>

            </View>

          ))

        )}

        <View style={{ height: 30 }} />

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
  },

  headerTitle: {
    flex: 1,
    color: "#fff",
    fontSize: 21,
    fontWeight: "800",
    textAlign: "center",
    marginRight: 40,
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
});