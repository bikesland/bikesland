import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import {
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Dimensions,
} from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";

const { width } = Dimensions.get("window");

type Bike = {
  id: string;
  name: string;
  image?: any;
  imageUrl?: string;
  images?: string[];
  year: string;
  location: string;
  km: string;
  price: string;
  description?: string;
};

export default function HomeScreen() {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [loading, setLoading] = useState(true);
  const [firebaseError, setFirebaseError] = useState("");

  // FIREBASE NUNCHI BIKES LOAD
  useEffect(() => {
    const loadBikes = async () => {
      try {
        setLoading(true);
        setFirebaseError("");

        const snapshot = await getDocs(collection(db, "bikes"));

        console.log("Firebase bikes count:", snapshot.size);

        const firebaseBikes: Bike[] = snapshot.docs.map((doc) => {
          const data = doc.data();

          console.log("Bike data:", doc.id, data);

          // MULTIPLE IMAGES
          let multipleImages: string[] = [];

          if (Array.isArray(data.images)) {
            multipleImages = data.images
              .filter((img: any) => img)
              .map((img: any) => {
                const image = String(img);

                if (image.startsWith("http")) {
                  return image;
                }

                return `https://bikesland.in${image}`;
              });
          }

          // OLD SINGLE IMAGE SUPPORT
          const singleImage = data.image
            ? String(data.image).startsWith("http")
              ? String(data.image)
              : `https://bikesland.in${data.image}`
            : "";

          // If images array is empty, use old image
          if (multipleImages.length === 0 && singleImage) {
            multipleImages = [singleImage];
          }

          return {
            id: doc.id,

            name: String(
              data.name ||
                data.bikeName ||
                data.bikename ||
                "Bike"
            ),

            imageUrl: singleImage,

            images: multipleImages,

            year: String(data.year || ""),

            location: String(data.location || ""),

            km: String(
              data.km ||
                data.kmDriven ||
                data.kilometers ||
                ""
            ),

            price: String(data.price || ""),

            description: String(
              data.description || ""
            ),
          };
        });

        setBikes(firebaseBikes);
      } catch (error: any) {
        console.log("Firebase bikes error:", error);

        setFirebaseError(
          error?.message ||
            "Unable to load bikes from Firebase"
        );
      } finally {
        setLoading(false);
      }
    };

    loadBikes();
  }, []);

  // CALL
  const callNow = () => {
    Linking.openURL("tel:+916301885817");
  };

  // WHATSAPP
  const whatsapp = (bikeName: string) => {
    const message =
      `Hi BikesLand, I am interested in ${bikeName}`;

    Linking.openURL(
      `https://wa.me/916301885817?text=${encodeURIComponent(
        message
      )}`
    );
  };

  // SEARCH
  const filteredBikes = bikes.filter((bike) =>
    bike.name
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <Image
          source={require("../../assets/images/logo.png")}
          style={styles.logoImage}
          resizeMode="contain"
        />

        <Text style={styles.tagline}>
          BUY • SELL • TRUST
        </Text>
      </View>

      {/* HERO */}
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>
          Find Your Perfect Bike
        </Text>

        <Text style={styles.heroSubtitle}>
          Buy & Sell Trusted Second-Hand Bikes with BikesLand
        </Text>

        {/* SEARCH */}
        <View style={styles.searchBox}>
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search your bike..."
            placeholderTextColor="#888"
            style={styles.input}
          />

          <TouchableOpacity style={styles.searchButton}>
            <Text style={styles.searchText}>
              Search
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* FOUNDER */}
      <View style={styles.founderSection}>
        <View style={styles.founderCircle}>
          <Image
            source={require("../../assets/images/founder.jpg")}
            style={styles.founderImage}
            resizeMode="cover"
          />
        </View>

        <Text style={styles.founderName}>
          Kandhukuru Bhupathi Santosh
        </Text>

        <Text style={styles.founderRole}>
          Founder & CEO, BikesLand
        </Text>

        <Text style={styles.trustText}>
          ✓ Building Trust in Every Ride
        </Text>
      </View>

      {/* AVAILABLE BIKES */}
      <Text style={styles.sectionTitle}>
        Available Bikes
      </Text>

      <View style={styles.bikesContainer}>
        {/* LOADING */}
        {loading ? (
          <Text style={styles.noBike}>
            Loading bikes...
          </Text>
        ) : firebaseError ? (
          /* FIREBASE ERROR */
          <View style={styles.errorBox}>
            <Text style={styles.errorTitle}>
              Firebase Error
            </Text>

            <Text style={styles.errorText}>
              {firebaseError}
            </Text>

            <Text style={styles.errorHint}>
              Please check Firebase Firestore connection
              and Rules.
            </Text>
          </View>
        ) : filteredBikes.length === 0 ? (
          /* NO BIKES */
          <Text style={styles.noBike}>
            {search
              ? "No bikes found"
              : "No bikes available"}
          </Text>
        ) : (
          /* BIKES */
          filteredBikes.map((bike) => (
            <View
              style={styles.card}
              key={bike.id}
            >
              {/* MULTIPLE PHOTO GALLERY */}
              {bike.images &&
              bike.images.length > 0 ? (
                <View>
                  <ScrollView
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    nestedScrollEnabled
                  >
                    {bike.images.map(
                      (image, index) => (
                        <View
                          key={`${bike.id}-${index}`}
                          style={styles.photoContainer}
                        >
                          <Image
                            source={{
                              uri: image,
                            }}
                            style={styles.bikeImage}
                            resizeMode="cover"
                          />

                          {/* PHOTO NUMBER */}
                          <View style={styles.photoCounter}>
                            <Text
                              style={styles.photoCounterText}
                            >
                              {index + 1} /{" "}
                              {bike.images?.length || 1}
                            </Text>
                          </View>
                        </View>
                      )
                    )}
                  </ScrollView>

                  {/* SWIPE HINT */}
                  {bike.images.length > 1 && (
                    <View style={styles.swipeHint}>
                      <Text style={styles.swipeText}>
                        ‹ Swipe to view photos ›
                      </Text>
                    </View>
                  )}
                </View>
              ) : bike.imageUrl ? (
                /* OLD SINGLE IMAGE */
                <Image
                  source={{
                    uri: bike.imageUrl,
                  }}
                  style={styles.bikeImage}
                  resizeMode="cover"
                />
              ) : (
                /* NO IMAGE */
                <View style={styles.noImage}>
                  <Text style={styles.noImageText}>
                    Bike Image
                  </Text>
                </View>
              )}

              {/* CARD CONTENT */}
              <View style={styles.cardContent}>
                <Text style={styles.bikeName}>
                  {bike.name}
                </Text>

                <Text style={styles.info}>
                  📅 Year: {bike.year}
                </Text>

                <Text style={styles.info}>
                  📍 {bike.location}
                </Text>

                <Text style={styles.info}>
                  🛣 KM Driven: {bike.km}
                </Text>

                <Text style={styles.price}>
                  {bike.price}
                </Text>

                {/* BUTTONS */}
                <View style={styles.buttons}>
                  {/* VIEW DETAILS */}
                  <TouchableOpacity
                    style={styles.viewButton}
                    onPress={() =>
                      router.push({
                        pathname:
                          "/view-details/[id]",
                        params: {
                          id: bike.id,
                        },
                      })
                    }
                  >
                    <Text style={styles.buttonText}>
                      View Details
                    </Text>
                  </TouchableOpacity>

                  {/* CALL */}
                  <TouchableOpacity
                    style={styles.callButton}
                    onPress={callNow}
                  >
                    <Text style={styles.buttonText}>
                      Call
                    </Text>
                  </TouchableOpacity>

                  {/* WHATSAPP */}
                  <TouchableOpacity
                    style={styles.whatsappButton}
                    onPress={() =>
                      whatsapp(bike.name)
                    }
                  >
                    <Text style={styles.buttonText}>
                      WhatsApp
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))
        )}
      </View>

      {/* ABOUT */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          About BikesLand
        </Text>

        <Text style={styles.description}>
          BikesLand is a trusted platform for quality
          second-hand bikes. Our goal is to make every
          bike purchase simple, transparent and
          trustworthy.
        </Text>
      </View>

      {/* REVIEWS */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Customer Reviews
        </Text>

        <View style={styles.reviewCard}>
          <Text style={styles.stars}>
            ★★★★★
          </Text>

          <Text style={styles.reviewText}>
            "Good service and genuine bikes."
          </Text>

          <Text style={styles.reviewName}>
            — BikesLand Customer
          </Text>
        </View>
      </View>

      {/* FOOTER */}
      <View style={styles.footer}>
        <Text style={styles.footerLogo}>
          BIKESLAND
        </Text>

        <Text style={styles.footerText}>
          Trusted Second-Hand Bikes
        </Text>

        <Text style={styles.copyright}>
          © 2026 BikesLand. All Rights Reserved.
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
    paddingTop: 55,
    paddingBottom: 18,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#222",
  },

  logoImage: {
    width: 142,
    height: 42,
  },

  tagline: {
    color: "#777",
    fontSize: 8,
    letterSpacing: 3,
    marginTop: 3,
  },

  hero: {
    alignItems: "center",
    paddingHorizontal: 18,
    paddingTop: 35,
    paddingBottom: 20,
  },

  heroTitle: {
    color: "#ffffff",
    fontSize: 27,
    fontWeight: "800",
    textAlign: "center",
  },

  heroSubtitle: {
    color: "#999",
    fontSize: 12,
    marginTop: 8,
    textAlign: "center",
  },

  searchBox: {
    width: "100%",
    flexDirection: "row",
    marginTop: 22,
  },

  input: {
    flex: 1,
    height: 48,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    paddingHorizontal: 15,
    color: "#000",
  },

  searchButton: {
    height: 48,
    backgroundColor: "#e50914",
    marginLeft: 8,
    paddingHorizontal: 18,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },

  searchText: {
    color: "#fff",
    fontWeight: "700",
  },

  founderSection: {
    alignItems: "center",
    paddingVertical: 25,
  },

  founderCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: "#e50914",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#171717",
    overflow: "hidden",
  },

  founderImage: {
    width: "100%",
    height: "100%",
    borderRadius: 35,
  },

  founderName: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    marginTop: 10,
  },

  founderRole: {
    color: "#888",
    fontSize: 11,
    marginTop: 3,
  },

  trustText: {
    color: "#20c463",
    fontSize: 11,
    marginTop: 7,
    fontWeight: "600",
  },

  sectionTitle: {
    color: "#ffffff",
    fontSize: 23,
    fontWeight: "800",
    textAlign: "center",
    marginVertical: 18,
  },

  bikesContainer: {
    paddingHorizontal: 8,
  },

  card: {
    backgroundColor: "#111827",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#252525",
  },

  /* PHOTO GALLERY */
  photoContainer: {
    width: width - 16,
    height: 230,
    backgroundColor: "#0b0f14",
    position: "relative",
  },

  bikeImage: {
    width: "100%",
    height: 230,
    backgroundColor: "#0b0f14",
  },

  photoCounter: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "rgba(0,0,0,0.75)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 15,
  },

  photoCounterText: {
    color: "#ffffff",
    fontSize: 11,
    fontWeight: "700",
  },

  swipeHint: {
    position: "absolute",
    bottom: 10,
    alignSelf: "center",
    backgroundColor: "rgba(0,0,0,0.65)",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 15,
  },

  swipeText: {
    color: "#ffffff",
    fontSize: 10,
    fontWeight: "600",
  },

  noImage: {
    width: "100%",
    height: 230,
    backgroundColor: "#0b0f14",
    justifyContent: "center",
    alignItems: "center",
  },

  noImageText: {
    color: "#666",
    fontSize: 14,
  },

  cardContent: {
    padding: 16,
  },

  bikeName: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 10,
  },

  info: {
    color: "#bdbdbd",
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

  buttons: {
    flexDirection: "row",
    gap: 7,
  },

  viewButton: {
    flex: 1.5,
    backgroundColor: "#e50914",
    paddingVertical: 12,
    borderRadius: 7,
    alignItems: "center",
  },

  callButton: {
    flex: 0.8,
    backgroundColor: "#1677ff",
    paddingVertical: 12,
    borderRadius: 7,
    alignItems: "center",
  },

  whatsappButton: {
    flex: 1.2,
    backgroundColor: "#16a34a",
    paddingVertical: 12,
    borderRadius: 7,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "800",
  },

  noBike: {
    color: "#aaa",
    textAlign: "center",
    padding: 30,
    fontSize: 14,
  },

  /* FIREBASE ERROR */
  errorBox: {
    backgroundColor: "#241010",
    borderWidth: 1,
    borderColor: "#e50914",
    borderRadius: 12,
    padding: 18,
    marginHorizontal: 10,
    marginVertical: 10,
  },

  errorTitle: {
    color: "#ff4444",
    fontSize: 18,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 10,
  },

  errorText: {
    color: "#ffffff",
    fontSize: 13,
    textAlign: "center",
    lineHeight: 20,
  },

  errorHint: {
    color: "#999",
    fontSize: 11,
    textAlign: "center",
    marginTop: 12,
  },

  section: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },

  description: {
    color: "#aaa",
    fontSize: 14,
    lineHeight: 23,
    textAlign: "center",
  },

  reviewCard: {
    backgroundColor: "#111827",
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#222",
  },

  stars: {
    color: "#ffd400",
    fontSize: 20,
    textAlign: "center",
  },

  reviewText: {
    color: "#ddd",
    fontSize: 14,
    textAlign: "center",
    marginTop: 10,
  },

  reviewName: {
    color: "#777",
    fontSize: 11,
    textAlign: "center",
    marginTop: 8,
  },

  footer: {
    alignItems: "center",
    paddingVertical: 35,
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#222",
  },

  footerLogo: {
    color: "#e50914",
    fontSize: 22,
    fontWeight: "900",
    letterSpacing: 2,
  },

  footerText: {
    color: "#777",
    marginTop: 5,
  },

  copyright: {
    color: "#444",
    fontSize: 10,
    marginTop: 15,
  },
});