import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  collection,
  doc,
  getDoc,
  getDocs,
} from "firebase/firestore";
import { db } from "../../../firebase";

const { width } = Dimensions.get("window");

type Bike = {
  id: string;
  name: string;
  imageUrl?: string;
  images?: string[];
  year: string;
  location: string;
  km: string;
  price: string;
  description: string;
};

export default function ViewDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [bike, setBike] = useState<Bike | null>(null);
  const [suggestedBikes, setSuggestedBikes] = useState<Bike[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadBike = async () => {
      try {
        setLoading(true);
        setError("");

        if (!id) {
          setError("Bike ID not found");
          return;
        }

        console.log("Loading bike ID:", id);

        // -----------------------------
        // LOAD SELECTED BIKE
        // -----------------------------

        const bikeRef = doc(db, "bikes", String(id));
        const bikeSnap = await getDoc(bikeRef);

        if (!bikeSnap.exists()) {
          console.log("Bike not found:", id);
          setError("This bike is no longer available.");
          return;
        }

        const data = bikeSnap.data();

        console.log("Selected bike:", data);

        let images: string[] = [];

        if (Array.isArray(data.images)) {
          images = data.images
            .filter((img: any) => img)
            .map((img: any) => {
              const image = String(img);

              if (image.startsWith("http")) {
                return image;
              }

              return `https://bikesland.in${image}`;
            });
        }

        const singleImage = data.image
          ? String(data.image).startsWith("http")
            ? String(data.image)
            : `https://bikesland.in${data.image}`
          : "";

        if (images.length === 0 && singleImage) {
          images = [singleImage];
        }

        const firebaseBike: Bike = {
          id: bikeSnap.id,

          name: String(
            data.name ||
              data.bikeName ||
              data.bikename ||
              "Bike"
          ),

          imageUrl: singleImage,

          images,

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
            data.description ||
              "This bike is available at BikesLand."
          ),
        };

        setBike(firebaseBike);

        // -----------------------------
        // LOAD SUGGESTED BIKES
        // -----------------------------

        const bikesSnapshot = await getDocs(
          collection(db, "bikes")
        );

        const otherBikes: Bike[] = [];

        bikesSnapshot.forEach((bikeDoc) => {
          // Current bike ni exclude chestham
          if (bikeDoc.id === bikeSnap.id) {
            return;
          }

          const bikeData = bikeDoc.data();

          let suggestedImages: string[] = [];

          if (Array.isArray(bikeData.images)) {
            suggestedImages = bikeData.images
              .filter((img: any) => img)
              .map((img: any) => {
                const image = String(img);

                if (image.startsWith("http")) {
                  return image;
                }

                return `https://bikesland.in${image}`;
              });
          }

          const suggestedSingleImage = bikeData.image
            ? String(bikeData.image).startsWith("http")
              ? String(bikeData.image)
              : `https://bikesland.in${bikeData.image}`
            : "";

          if (
            suggestedImages.length === 0 &&
            suggestedSingleImage
          ) {
            suggestedImages = [suggestedSingleImage];
          }

          const suggestedBike: Bike = {
            id: bikeDoc.id,

            name: String(
              bikeData.name ||
                bikeData.bikeName ||
                bikeData.bikename ||
                "Bike"
            ),

            imageUrl: suggestedSingleImage,

            images: suggestedImages,

            year: String(bikeData.year || ""),

            location: String(
              bikeData.location || ""
            ),

            km: String(
              bikeData.km ||
                bikeData.kmDriven ||
                bikeData.kilometers ||
                ""
            ),

            price: String(
              bikeData.price || ""
            ),

            description: String(
              bikeData.description ||
                "This bike is available at BikesLand."
            ),
          };

          otherBikes.push(suggestedBike);
        });

        // Maximum 6 suggested bikes
        setSuggestedBikes(otherBikes.slice(0, 6));
      } catch (err: any) {
        console.log("View details error:", err);

        setError(
          err?.message ||
            "Unable to load bike details."
        );
      } finally {
        setLoading(false);
      }
    };

    loadBike();
  }, [id]);

  // -----------------------------
  // CALL
  // -----------------------------

  const callNow = () => {
    Linking.openURL("tel:+916301885817");
  };

  // -----------------------------
  // WHATSAPP
  // -----------------------------

  const whatsapp = () => {
    if (!bike) return;

    const message =
      `Hi BikesLand, I am interested in ${bike.name}`;

    Linking.openURL(
      `https://wa.me/916301885817?text=${encodeURIComponent(
        message
      )}`
    );
  };

  // -----------------------------
  // LOADING
  // -----------------------------

  if (loading) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator
          size="large"
          color="#e50914"
        />

        <Text style={styles.loadingText}>
          Loading bike details...
        </Text>
      </View>
    );
  }

  // -----------------------------
  // ERROR
  // -----------------------------

  if (error || !bike) {
    return (
      <View style={styles.loadingScreen}>
        <Text style={styles.errorTitle}>
          Bike Not Found
        </Text>

        <Text style={styles.errorText}>
          {error || "Unable to load this bike."}
        </Text>

        <TouchableOpacity
          style={styles.backHomeButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backHomeText}>
            Go Back
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* =========================
          TOP BAR
      ========================= */}

      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backText}>
            ‹
          </Text>
        </TouchableOpacity>

        <Text style={styles.topTitle}>
          BIKESLAND
        </Text>

        <View style={styles.rightSpace} />
      </View>

      {/* =========================
          BIKE PHOTOS
      ========================= */}

      <View style={styles.gallery}>
        {bike.images &&
        bike.images.length > 0 ? (
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
          >
            {bike.images.map(
              (image, index) => (
                <View
                  key={`${bike.id}-${index}`}
                  style={styles.photoContainer}
                >
                  <Image
                    source={{ uri: image }}
                    style={styles.bikeImage}
                    resizeMode="cover"
                  />

                  <View
                    style={styles.photoCounter}
                  >
                    <Text
                      style={
                        styles.photoCounterText
                      }
                    >
                      {index + 1} /{" "}
                      {bike.images?.length || 1}
                    </Text>
                  </View>
                </View>
              )
            )}
          </ScrollView>
        ) : (
          <View style={styles.noImage}>
            <Text style={styles.noImageText}>
              No Bike Image
            </Text>
          </View>
        )}
      </View>

      {/* =========================
          MAIN CONTENT
      ========================= */}

      <View style={styles.content}>

        {/* NAME */}

        <Text style={styles.name}>
          {bike.name}
        </Text>

        {/* PRICE */}

        <Text style={styles.price}>
          {bike.price}
        </Text>

        {/* LOCATION */}

        <View style={styles.locationRow}>
          <Text style={styles.location}>
            📍 {bike.location}
          </Text>

          <View style={styles.listedBadge}>
            <Text style={styles.listedText}>
              ✓ BikesLand Listing
            </Text>
          </View>
        </View>

        {/* =========================
            DETAILS
        ========================= */}

        <View style={styles.infoBox}>

          <View style={styles.infoItem}>
            <Text style={styles.icon}>
              📅
            </Text>

            <Text style={styles.label}>
              YEAR
            </Text>

            <Text style={styles.value}>
              {bike.year}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoItem}>
            <Text style={styles.icon}>
              🛣️
            </Text>

            <Text style={styles.label}>
              KM DRIVEN
            </Text>

            <Text style={styles.value}>
              {bike.km}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoItem}>
            <Text style={styles.icon}>
              📍
            </Text>

            <Text style={styles.label}>
              LOCATION
            </Text>

            <Text style={styles.value}>
              {bike.location}
            </Text>
          </View>

        </View>

        {/* =========================
            ABOUT
        ========================= */}

        <Text style={styles.heading}>
          About this bike
        </Text>

        <Text style={styles.description}>
          {bike.description}
        </Text>

        {/* =========================
            BIKESLAND PROMISE
        ========================= */}

        <View style={styles.promiseBox}>

          <View style={styles.promiseHeader}>
            <View style={styles.promiseIconBox}>
              <Text style={styles.promiseIcon}>
                🛡️
              </Text>
            </View>

            <View style={styles.promiseHeaderText}>
              <Text style={styles.promiseTitle}>
                BikesLand Promise
              </Text>

              <Text style={styles.promiseSubtitle}>
                Trust that goes beyond the ride.
              </Text>
            </View>
          </View>

          <View style={styles.promiseDivider} />

          <View style={styles.promiseItem}>
            <Text style={styles.promiseCheck}>
              ✓
            </Text>

            <View style={styles.promiseItemText}>
              <Text style={styles.promiseItemTitle}>
                Transparent Bike Details
              </Text>

              <Text style={styles.promiseItemDescription}>
                Clear information about the bike
                is provided in every listing.
              </Text>
            </View>
          </View>

          <View style={styles.promiseItem}>
            <Text style={styles.promiseCheck}>
              ✓
            </Text>

            <View style={styles.promiseItemText}>
              <Text style={styles.promiseItemTitle}>
                Genuine Listing Photos
              </Text>

              <Text style={styles.promiseItemDescription}>
                We focus on giving customers
                useful photos of the listed bike.
              </Text>
            </View>
          </View>

          <View style={styles.promiseItem}>
            <Text style={styles.promiseCheck}>
              ✓
            </Text>

            <View style={styles.promiseItemText}>
              <Text style={styles.promiseItemTitle}>
                Clear & Honest Pricing
              </Text>

              <Text style={styles.promiseItemDescription}>
                Listed price is shown clearly
                without unnecessary confusion.
              </Text>
            </View>
          </View>

          <View style={styles.promiseItem}>
            <Text style={styles.promiseCheck}>
              ✓
            </Text>

            <View style={styles.promiseItemText}>
              <Text style={styles.promiseItemTitle}>
                Customer-First Service
              </Text>

              <Text style={styles.promiseItemDescription}>
                Our focus is to make your bike
                search simple and comfortable.
              </Text>
            </View>
          </View>

          <View style={styles.promiseItem}>
            <Text style={styles.promiseCheck}>
              ✓
            </Text>

            <View style={styles.promiseItemText}>
              <Text style={styles.promiseItemTitle}>
                Easy Support
              </Text>

              <Text style={styles.promiseItemDescription}>
                Contact BikesLand easily through
                Call or WhatsApp.
              </Text>
            </View>
          </View>

          <View style={styles.promiseBottom}>
            <Text style={styles.promiseBottomText}>
              BikesLand — Find your bike with confidence.
            </Text>
          </View>

        </View>

        {/* =========================
            SUGGESTED BIKES
        ========================= */}

        {suggestedBikes.length > 0 && (
          <View style={styles.suggestedSection}>

            <View style={styles.suggestedHeader}>
              <View>
                <Text style={styles.heading}>
                  Suggested Bikes
                </Text>

                <Text style={styles.suggestedSubtitle}>
                  You may also like these bikes
                </Text>
              </View>

              <Text style={styles.suggestedCount}>
                {suggestedBikes.length}
              </Text>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={
                styles.suggestedScroll
              }
            >
              {suggestedBikes.map(
                (suggestedBike) => {

                  const suggestedImage =
                    suggestedBike.images &&
                    suggestedBike.images.length > 0
                      ? suggestedBike.images[0]
                      : suggestedBike.imageUrl;

                  return (
                    <TouchableOpacity
                      key={suggestedBike.id}
                      style={styles.suggestedCard}
                      activeOpacity={0.85}
                      onPress={() =>
                        router.push(
                          `/view-details/${suggestedBike.id}`
                        )
                      }
                    >

                      <View style={styles.suggestedImageBox}>

                        {suggestedImage ? (
                          <Image
                            source={{
                              uri: suggestedImage,
                            }}
                            style={
                              styles.suggestedImage
                            }
                            resizeMode="cover"
                          />
                        ) : (
                          <View
                            style={
                              styles.suggestedNoImage
                            }
                          >
                            <Text
                              style={
                                styles.suggestedNoImageText
                              }
                            >
                              No Image
                            </Text>
                          </View>
                        )}

                      </View>

                      <View
                        style={
                          styles.suggestedCardContent
                        }
                      >

                        <Text
                          style={
                            styles.suggestedBikeName
                          }
                          numberOfLines={1}
                        >
                          {suggestedBike.name}
                        </Text>

                        <Text
                          style={
                            styles.suggestedPrice
                          }
                          numberOfLines={1}
                        >
                          {suggestedBike.price}
                        </Text>

                        <Text
                          style={
                            styles.suggestedDetails
                          }
                          numberOfLines={1}
                        >
                          {suggestedBike.year} •{" "}
                          {suggestedBike.km} KM
                        </Text>

                        <Text
                          style={
                            styles.suggestedLocation
                          }
                          numberOfLines={1}
                        >
                          📍 {suggestedBike.location}
                        </Text>

                        <View
                          style={
                            styles.viewBikeButton
                          }
                        >
                          <Text
                            style={
                              styles.viewBikeText
                            }
                          >
                            View Details →
                          </Text>
                        </View>

                      </View>

                    </TouchableOpacity>
                  );
                }
              )}
            </ScrollView>

          </View>
        )}

        {/* =========================
            CONTACT
        ========================= */}

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

        {/* INTERESTED */}

        <TouchableOpacity
          style={styles.interestedButton}
          activeOpacity={0.8}
          onPress={whatsapp}
        >
          <Text style={styles.interestedText}>
            I'm Interested in This Bike
          </Text>
        </TouchableOpacity>

        {/* =========================
            FOOTER
        ========================= */}

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

  loadingScreen: {
    flex: 1,
    backgroundColor: "#000000",
    justifyContent: "center",
    alignItems: "center",
    padding: 25,
  },

  loadingText: {
    color: "#999999",
    marginTop: 15,
    fontSize: 14,
  },

  errorTitle: {
    color: "#e50914",
    fontSize: 24,
    fontWeight: "900",
    marginBottom: 10,
  },

  errorText: {
    color: "#aaaaaa",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
  },

  backHomeButton: {
    backgroundColor: "#e50914",
    paddingHorizontal: 25,
    paddingVertical: 13,
    borderRadius: 10,
  },

  backHomeText: {
    color: "#ffffff",
    fontWeight: "800",
  },

  /* =========================
     TOP BAR
  ========================= */

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

  /* =========================
     GALLERY
  ========================= */

  gallery: {
    width: "100%",
    height: 300,
    backgroundColor: "#0b0f14",
  },

  photoContainer: {
    width: width,
    height: 300,
    position: "relative",
    backgroundColor: "#0b0f14",
  },

  bikeImage: {
    width: "100%",
    height: "100%",
  },

  photoCounter: {
    position: "absolute",
    right: 15,
    top: 15,
    backgroundColor: "rgba(0,0,0,0.75)",
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 18,
  },

  photoCounterText: {
    color: "#ffffff",
    fontSize: 11,
    fontWeight: "800",
  },

  noImage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  noImageText: {
    color: "#666666",
    fontSize: 14,
  },

  /* =========================
     CONTENT
  ========================= */

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
    flex: 1,
  },

  listedBadge: {
    backgroundColor: "#171717",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#303030",
  },

  listedText: {
    color: "#20c463",
    fontSize: 10,
    fontWeight: "800",
  },

  /* =========================
     DETAILS
  ========================= */

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

  /* =========================
     ABOUT
  ========================= */

  heading: {
    color: "#ffffff",
    fontSize: 21,
    fontWeight: "900",
    marginBottom: 7,
  },

  description: {
    color: "#aaaaaa",
    fontSize: 14,
    lineHeight: 23,
    marginBottom: 25,
  },

  /* =========================
     BIKESLAND PROMISE
  ========================= */

  promiseBox: {
    backgroundColor: "#0d1117",
    borderRadius: 18,
    padding: 17,
    borderWidth: 1,
    borderColor: "#2a2a2a",
    marginBottom: 30,
  },

  promiseHeader: {
    flexDirection: "row",
    alignItems: "center",
  },

  promiseIconBox: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: "#171717",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#303030",
  },

  promiseIcon: {
    fontSize: 22,
  },

  promiseHeaderText: {
    flex: 1,
  },

  promiseTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 3,
  },

  promiseSubtitle: {
    color: "#888888",
    fontSize: 12,
  },

  promiseDivider: {
    height: 1,
    backgroundColor: "#252525",
    marginVertical: 17,
  },

  promiseItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },

  promiseCheck: {
    width: 25,
    height: 25,
    borderRadius: 13,
    backgroundColor: "#122719",
    color: "#20c463",
    textAlign: "center",
    lineHeight: 25,
    fontSize: 13,
    fontWeight: "900",
    marginRight: 10,
  },

  promiseItemText: {
    flex: 1,
  },

  promiseItemTitle: {
    color: "#eeeeee",
    fontSize: 13,
    fontWeight: "800",
    marginBottom: 3,
  },

  promiseItemDescription: {
    color: "#777777",
    fontSize: 11,
    lineHeight: 17,
  },

  promiseBottom: {
    backgroundColor: "#151515",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 10,
    marginTop: 2,
  },

  promiseBottomText: {
    color: "#dddddd",
    fontSize: 11,
    fontWeight: "700",
    textAlign: "center",
  },

  /* =========================
     SUGGESTED BIKES
  ========================= */

  suggestedSection: {
    marginBottom: 28,
  },

  suggestedHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },

  suggestedSubtitle: {
    color: "#777777",
    fontSize: 12,
    marginBottom: 14,
    marginTop: -2,
  },

  suggestedCount: {
    color: "#e50914",
    fontSize: 14,
    fontWeight: "900",
    backgroundColor: "#171717",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 15,
  },

  suggestedScroll: {
    paddingRight: 10,
  },

  suggestedCard: {
    width: 215,
    backgroundColor: "#111111",
    borderRadius: 16,
    marginRight: 14,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#292929",
  },

  suggestedImageBox: {
    width: "100%",
    height: 145,
    backgroundColor: "#0b0f14",
  },

  suggestedImage: {
    width: "100%",
    height: "100%",
  },

  suggestedNoImage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  suggestedNoImageText: {
    color: "#666666",
    fontSize: 12,
  },

  suggestedCardContent: {
    padding: 13,
  },

  suggestedBikeName: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "900",
    marginBottom: 5,
  },

  suggestedPrice: {
    color: "#ffd400",
    fontSize: 17,
    fontWeight: "900",
    marginBottom: 5,
  },

  suggestedDetails: {
    color: "#888888",
    fontSize: 11,
    marginBottom: 5,
  },

  suggestedLocation: {
    color: "#888888",
    fontSize: 11,
    marginBottom: 11,
  },

  viewBikeButton: {
    backgroundColor: "#e50914",
    borderRadius: 9,
    paddingVertical: 9,
    alignItems: "center",
  },

  viewBikeText: {
    color: "#ffffff",
    fontSize: 11,
    fontWeight: "900",
  },

  /* =========================
     CONTACT
  ========================= */

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

  /* =========================
     FOOTER
  ========================= */

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