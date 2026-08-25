import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";

const bikes = [
  {
    id: 0,
    name: "Classic 350",
    image: require("../../assets/images/classic1.jpg"),
    year: "2022",
    location: "Nellore",
    km: "35,000",
    price: "₹1,40,000",
  },
  {
    id: 1,
    name: "Honda Activa 6G",
    image: require("../../assets/images/activa.jpg"),
    year: "2021",
    location: "Nellore",
    km: "20,000",
    price: "₹65,000",
  },
  {
    id: 2,
    name: "Yamaha R15 V4",
    image: require("../../assets/images/r15.jpg"),
    year: "2023",
    location: "Nellore",
    km: "10,000",
    price: "₹1,80,000",
  },
];

export default function FavoritesScreen() {
  const router = useRouter();

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          FAVORITES ❤️
        </Text>

        <View style={styles.emptySpace} />
      </View>

      {/* TITLE */}
      <View style={styles.titleSection}>
        <Text style={styles.title}>
          Your Favorite Bikes
        </Text>

        <Text style={styles.subtitle}>
          Bikes you love, saved in one place.
        </Text>
      </View>

      {/* BIKE LIST */}
      <View style={styles.list}>
        {bikes.map((bike) => (
          <View
            style={styles.card}
            key={bike.id}
          >
            <Image
              source={bike.image}
              style={styles.bikeImage}
              resizeMode="contain"
            />

            <View style={styles.cardContent}>
              <View style={styles.nameRow}>
                <Text style={styles.bikeName}>
                  {bike.name}
                </Text>

                <Text style={styles.heart}>
                  ♥
                </Text>
              </View>

              <Text style={styles.info}>
                📅 {bike.year}
              </Text>

              <Text style={styles.info}>
                📍 {bike.location}
              </Text>

              <Text style={styles.info}>
                🛣️ {bike.km} KM
              </Text>

              <Text style={styles.price}>
                {bike.price}
              </Text>

              <TouchableOpacity
                style={styles.viewButton}
                onPress={() =>
                  router.push({
                    pathname: "/view-details/[id]",
                    params: {
                      id: bike.id.toString(),
                    },
                  })
                }
              >
                <Text style={styles.buttonText}>
                  View Details
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      {/* FOOTER */}
      <View style={styles.footer}>
        <Text style={styles.footerLogo}>
          BIKESLAND
        </Text>

        <Text style={styles.footerText}>
          BUY • SELL • TRUST
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },

  header: {
    height: 65,
    backgroundColor: "#000000",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#222222",
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#151515",
    justifyContent: "center",
    alignItems: "center",
  },

  backText: {
    color: "#ffffff",
    fontSize: 32,
    lineHeight: 35,
    marginTop: -4,
  },

  headerTitle: {
    color: "#e50914",
    fontSize: 17,
    fontWeight: "900",
    letterSpacing: 1,
  },

  emptySpace: {
    width: 40,
  },

  titleSection: {
    alignItems: "center",
    paddingTop: 28,
    paddingBottom: 15,
  },

  title: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "900",
  },

  subtitle: {
    color: "#777777",
    fontSize: 12,
    marginTop: 7,
  },

  list: {
    paddingHorizontal: 15,
  },

  card: {
    backgroundColor: "#111827",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#252525",
  },

  bikeImage: {
    width: "100%",
    height: 170,
    backgroundColor: "#0b0f14",
  },

  cardContent: {
    padding: 16,
  },

  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  bikeName: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "900",
  },

  heart: {
    color: "#e50914",
    fontSize: 25,
  },

  info: {
    color: "#aaaaaa",
    fontSize: 12,
    marginBottom: 6,
  },

  price: {
    color: "#ffd400",
    fontSize: 20,
    fontWeight: "900",
    marginTop: 8,
    marginBottom: 14,
  },

  viewButton: {
    backgroundColor: "#e50914",
    paddingVertical: 13,
    borderRadius: 8,
    alignItems: "center",
  },

  buttonText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "900",
  },

  footer: {
    alignItems: "center",
    paddingVertical: 35,
    marginTop: 10,
  },

  footerLogo: {
    color: "#e50914",
    fontSize: 21,
    fontWeight: "900",
    letterSpacing: 2,
  },

  footerText: {
    color: "#666666",
    fontSize: 10,
    letterSpacing: 2,
    marginTop: 5,
  },
});