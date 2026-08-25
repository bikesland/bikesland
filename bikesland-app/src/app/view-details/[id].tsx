import React from "react";
import {
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

const bikes = [
  {
    name: "Classic 350",
    image: require("../../../assets/images/classic1.jpg"),
    year: "2022",
    location: "Nellore",
    km: "35,000",
    price: "₹1,40,000",
    description:
      "Royal Enfield Classic 350 in good condition. Well maintained and ready to ride.",
  },
  {
    name: "Honda Activa 6G",
    image: require("../../../assets/images/activa.jpg"),
    year: "2021",
    location: "Nellore",
    km: "20,000",
    price: "₹65,000",
    description:
      "Honda Activa 6G in good condition. Smooth performance and suitable for daily use.",
  },
  {
    name: "Yamaha R15 V4",
    image: require("../../../assets/images/r15.jpg"),
    year: "2023",
    location: "Nellore",
    km: "10,000",
    price: "₹1,80,000",
    description:
      "Yamaha R15 V4 in excellent condition with regular service history.",
  },
];

export default function ViewDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const currentId = Number(id);
  const bike = bikes[currentId] || bikes[0];

  const callNow = () => {
    Linking.openURL("tel:+916301885817");
  };

  const whatsapp = () => {
    Linking.openURL(
      `https://wa.me/916301885817?text=Hi%20BikesLand,%20I%20am%20interested%20in%20${encodeURIComponent(
        bike.name
      )}`
    );
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* TOP BAR */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>

        <Text style={styles.topTitle}>BIKESLAND</Text>

        <View style={styles.rightSpace} />
      </View>

      {/* BIKE IMAGE */}
      <View style={styles.imageBox}>
        <Image
          source={bike.image}
          style={styles.bikeImage}
          resizeMode="contain"
        />
      </View>

      {/* MAIN CONTENT */}
      <View style={styles.content}>
        {/* NAME */}
        <Text style={styles.name}>{bike.name}</Text>

        {/* PRICE */}
        <Text style={styles.price}>{bike.price}</Text>

        {/* LOCATION + VERIFIED */}
        <View style={styles.locationRow}>
          <Text style={styles.location}>
            📍 {bike.location}
          </Text>

          <View style={styles.verifiedBadge}>
            <Text style={styles.verifiedText}>
              ✓ Verified
            </Text>
          </View>
        </View>

        {/* DETAILS */}
        <View style={styles.infoBox}>
          <View style={styles.infoItem}>
            <Text style={styles.icon}>📅</Text>
            <Text style={styles.label}>YEAR</Text>
            <Text style={styles.value}>{bike.year}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoItem}>
            <Text style={styles.icon}>🛣️</Text>
            <Text style={styles.label}>KM DRIVEN</Text>
            <Text style={styles.value}>{bike.km}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoItem}>
            <Text style={styles.icon}>📍</Text>
            <Text style={styles.label}>LOCATION</Text>
            <Text style={styles.value}>{bike.location}</Text>
          </View>
        </View>

        {/* ABOUT */}
        <Text style={styles.heading}>
          About this bike
        </Text>

        <Text style={styles.description}>
          {bike.description}
        </Text>

        {/* TRUST */}
        <View style={styles.trustBox}>
          <Text style={styles.trustTitle}>
            ✓ BikesLand Verified Bike
          </Text>

          <Text style={styles.trustDescription}>
            Quality checked and listed by BikesLand.
          </Text>
        </View>

        {/* SUGGESTED BIKES */}
        <View style={styles.suggestedHeader}>
          <Text style={styles.heading}>
            You may also like
          </Text>

          <Text style={styles.suggestedSubtitle}>
            More bikes from BikesLand
          </Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.suggestedContainer}
        >
          {bikes
            .map((suggestedBike, suggestedIndex) => ({
              bike: suggestedBike,
              index: suggestedIndex,
            }))
            .filter((item) => item.index !== currentId)
            .map((item) => (
              <TouchableOpacity
                key={item.bike.name}
                style={styles.suggestedCard}
                activeOpacity={0.85}
                onPress={() =>
                  router.push({
                    pathname: "/view-details/[id]",
                    params: {
                      id: item.index.toString(),
                    },
                  })
                }
              >
                {/* SUGGESTED IMAGE */}
                <View style={styles.suggestedImageBox}>
                  <Image
                    source={item.bike.image}
                    style={styles.suggestedImage}
                    resizeMode="contain"
                  />
                </View>

                {/* SUGGESTED CONTENT */}
                <View style={styles.suggestedContent}>
                  <Text
                    style={styles.suggestedName}
                    numberOfLines={1}
                  >
                    {item.bike.name}
                  </Text>

                  <Text style={styles.suggestedPrice}>
                    {item.bike.price}
                  </Text>

                  <Text style={styles.suggestedLocation}>
                    📍 {item.bike.location}
                  </Text>

                  <View style={styles.smallViewButton}>
                    <Text style={styles.smallViewText}>
                      View Details
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
        </ScrollView>

        {/* CONTACT */}
        <Text style={styles.contactHeading}>
          Interested in this bike?
        </Text>

        {/* CALL */}
        <TouchableOpacity
          style={styles.callButton}
          activeOpacity={0.8}
          onPress={callNow}
        >
          <Text style={styles.buttonText}>
            📞 Call Now
          </Text>
        </TouchableOpacity>

        {/* WHATSAPP */}
        <TouchableOpacity
          style={styles.whatsappButton}
          activeOpacity={0.8}
          onPress={whatsapp}
        >
          <Text style={styles.buttonText}>
            💬 WhatsApp
          </Text>
        </TouchableOpacity>

        {/* I'M INTERESTED */}
        <TouchableOpacity
          style={styles.interestedButton}
          activeOpacity={0.8}
          onPress={whatsapp}
        >
          <Text style={styles.interestedText}>
            I'm Interested in This Bike
          </Text>
        </TouchableOpacity>

        {/* FOOTER */}
        <View style={styles.footer}>
          <Text style={styles.footerLogo}>
            BIKESLAND
          </Text>

          <Text style={styles.footerText}>
            BUY • SELL • TRUST
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },

  /* TOP BAR */
  topBar: {
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

  topTitle: {
    color: "#e50914",
    fontSize: 17,
    fontWeight: "900",
    letterSpacing: 2,
  },

  rightSpace: {
    width: 40,
  },

  /* IMAGE */
  imageBox: {
    width: "100%",
    height: 280,
    backgroundColor: "#0b0f14",
    justifyContent: "center",
    alignItems: "center",
  },

  bikeImage: {
    width: "100%",
    height: "100%",
  },

  /* CONTENT */
  content: {
    padding: 20,
  },

  name: {
    color: "#ffffff",
    fontSize: 28,
    fontWeight: "900",
    marginBottom: 7,
  },

  price: {
    color: "#ffd400",
    fontSize: 25,
    fontWeight: "900",
    marginBottom: 12,
  },

  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  location: {
    color: "#bdbdbd",
    fontSize: 14,
  },

  verifiedBadge: {
    backgroundColor: "#102719",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },

  verifiedText: {
    color: "#20c463",
    fontSize: 11,
    fontWeight: "800",
  },

  /* DETAILS */
  infoBox: {
    backgroundColor: "#111827",
    borderRadius: 16,
    paddingVertical: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    borderWidth: 1,
    borderColor: "#252525",
    marginBottom: 25,
  },

  infoItem: {
    flex: 1,
    alignItems: "center",
  },

  icon: {
    fontSize: 18,
    marginBottom: 7,
  },

  label: {
    color: "#777777",
    fontSize: 9,
    fontWeight: "800",
    marginBottom: 5,
  },

  value: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "800",
  },

  divider: {
    width: 1,
    height: 45,
    backgroundColor: "#333333",
  },

  /* ABOUT */
  heading: {
    color: "#ffffff",
    fontSize: 21,
    fontWeight: "900",
    marginBottom: 10,
  },

  description: {
    color: "#aaaaaa",
    fontSize: 14,
    lineHeight: 23,
    marginBottom: 20,
  },

  /* TRUST */
  trustBox: {
    backgroundColor: "#111827",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: "#252525",
    marginBottom: 28,
  },

  trustTitle: {
    color: "#20c463",
    fontSize: 14,
    fontWeight: "800",
    marginBottom: 5,
  },

  trustDescription: {
    color: "#888888",
    fontSize: 12,
  },

  /* SUGGESTED */
  suggestedHeader: {
    marginBottom: 4,
  },

  suggestedSubtitle: {
    color: "#777777",
    fontSize: 12,
    marginTop: -5,
    marginBottom: 14,
  },

  suggestedContainer: {
    paddingRight: 10,
    paddingBottom: 28,
  },

  suggestedCard: {
    width: 190,
    backgroundColor: "#111827",
    borderRadius: 15,
    marginRight: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#252525",
  },

  suggestedImageBox: {
    width: "100%",
    height: 125,
    backgroundColor: "#0b0f14",
    justifyContent: "center",
    alignItems: "center",
  },

  suggestedImage: {
    width: "100%",
    height: "100%",
  },

  suggestedContent: {
    padding: 12,
  },

  suggestedName: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "800",
  },

  suggestedPrice: {
    color: "#ffd400",
    fontSize: 15,
    fontWeight: "900",
    marginTop: 5,
  },

  suggestedLocation: {
    color: "#888888",
    fontSize: 11,
    marginTop: 5,
    marginBottom: 10,
  },

  smallViewButton: {
    backgroundColor: "#e50914",
    borderRadius: 8,
    paddingVertical: 9,
    alignItems: "center",
  },

  smallViewText: {
    color: "#ffffff",
    fontSize: 11,
    fontWeight: "800",
  },

  /* CONTACT */
  contactHeading: {
    color: "#ffffff",
    fontSize: 19,
    fontWeight: "800",
    marginBottom: 14,
  },

  callButton: {
    backgroundColor: "#e50914",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
  },

  whatsappButton: {
    backgroundColor: "#16a34a",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
  },

  interestedButton: {
    backgroundColor: "#ffffff",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e50914",
  },

  interestedText: {
    color: "#e50914",
    fontSize: 15,
    fontWeight: "900",
  },

  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "900",
  },

  /* FOOTER */
  footer: {
    alignItems: "center",
    paddingVertical: 35,
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