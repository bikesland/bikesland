import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  Linking,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useRouter } from "expo-router";
import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase";

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
  description?: string;
};

type Review = {
  id: string;
  name: string;
  review: string;
  rating: number;
};

export default function HomeScreen() {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [loading, setLoading] = useState(true);
  const [firebaseError, setFirebaseError] = useState("");

  /* =========================
     FILTER STATES
  ========================= */

  const [filterVisible, setFilterVisible] = useState(false);

  const [selectedBrand, setSelectedBrand] = useState("All");
  const [selectedYear, setSelectedYear] = useState("All");
  const [selectedPrice, setSelectedPrice] = useState("All");

  const [tempBrand, setTempBrand] = useState("All");
  const [tempYear, setTempYear] = useState("All");
  const [tempPrice, setTempPrice] = useState("All");

  const brandOptions = [
    "All",
    "Royal Enfield",
    "Yamaha",
    "Honda",
    "KTM",
    "TVS",
    "Bajaj",
    "Suzuki",
    "Hero",
  ];

  const yearOptions = [
    "All",
    "2026",
    "2025",
    "2024",
    "2023",
    "2022",
    "2021",
    "2020",
    "2019",
    "2018",
  ];

  const priceOptions = [
    "All",
    "Under ₹50K",
    "₹50K - ₹1L",
    "₹1L - ₹1.5L",
    "₹1.5L - ₹2L",
    "Above ₹2L",
  ];

  /* =========================
     REVIEW STATES
  ========================= */

  const [reviewName, setReviewName] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(0);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewLoading, setReviewLoading] = useState(false);

  /* =========================
     LOAD REVIEWS
  ========================= */

  const loadReviews = async () => {
    try {
      const reviewsQuery = query(
        collection(db, "reviews"),
        orderBy("createdAt", "desc")
      );

      const snapshot = await getDocs(reviewsQuery);

      const firebaseReviews: Review[] = snapshot.docs.map((doc) => {
        const data = doc.data();

        return {
          id: doc.id,
          name: String(data.name || "Customer"),
          review: String(
            data.comment || data.review || ""
          ),
          rating: Number(data.rating || 5),
        };
      });

      setReviews(firebaseReviews);
    } catch (error) {
      console.log("Reviews Error:", error);
    }
  };

  /* =========================
     LOAD BIKES
  ========================= */

  useEffect(() => {
    const loadBikes = async () => {
      try {
        setLoading(true);
        setFirebaseError("");

        const snapshot = await getDocs(
          collection(db, "bikes")
        );

        const firebaseBikes: Bike[] = snapshot.docs.map(
          (doc) => {
            const data = doc.data();

            let images: string[] = [];

            if (Array.isArray(data.images)) {
              images = data.images
                .filter((img: unknown) => img)
                .map((img: unknown) => {
                  const image = String(img);

                  return image.startsWith("http")
                    ? image
                    : `https://bikesland.in${image}`;
                });
            }

            const singleImage = data.image
              ? String(data.image).startsWith("http")
                ? String(data.image)
                : `https://bikesland.in${data.image}`
              : "";

            if (
              images.length === 0 &&
              singleImage
            ) {
              images = [singleImage];
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
              images,

              year: String(data.year || ""),

              location: String(
                data.location || ""
              ),

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
          }
        );

        setBikes(firebaseBikes);
      } catch (error: any) {
        console.log(
          "Firebase Error:",
          error
        );

        setFirebaseError(
          error?.message ||
            "Unable to load bikes"
        );
      } finally {
        setLoading(false);
      }
    };

    loadBikes();
    loadReviews();
  }, []);

  /* =========================
     CALL
  ========================= */

  const callNow = () => {
    Linking.openURL(
      "tel:+916301885817"
    );
  };

  /* =========================
     WHATSAPP
  ========================= */

  const whatsapp = (bikeName: string) => {
    const message =
      `Hi BikesLand, I am interested in ${bikeName}`;

    Linking.openURL(
      `https://wa.me/916301885817?text=${encodeURIComponent(
        message
      )}`
    );
  };

  /* =========================
     SUBMIT REVIEW
  ========================= */

  const submitReview = async () => {
    if (!reviewName.trim()) {
      alert("Please enter your name");
      return;
    }

    if (reviewRating === 0) {
      alert("Please select your rating");
      return;
    }

    if (!reviewText.trim()) {
      alert("Please write your review");
      return;
    }

    try {
      setReviewLoading(true);

      await addDoc(
        collection(db, "reviews"),
        {
          name: reviewName.trim(),
          review: reviewText.trim(),
          rating: reviewRating,
          createdAt: serverTimestamp(),
        }
      );

      setReviewName("");
      setReviewText("");
      setReviewRating(0);

      await loadReviews();

      alert(
        "Thank you! Your review has been submitted."
      );
    } catch (error) {
      console.log(
        "Submit Review Error:",
        error
      );

      alert(
        "Unable to submit review. Please try again."
      );
    } finally {
      setReviewLoading(false);
    }
  };

  /* =========================
     FILTER FUNCTIONS
  ========================= */

  const getPriceNumber = (price: string) => {
    const cleaned = price
      .replace(/₹/g, "")
      .replace(/,/g, "")
      .replace(/[^\d.]/g, "");

    const value = Number(cleaned);

    return Number.isNaN(value) ? 0 : value;
  };

  const matchesPrice = (price: string) => {
    const value = getPriceNumber(price);

    switch (selectedPrice) {
      case "Under ₹50K":
        return value < 50000;

      case "₹50K - ₹1L":
        return value >= 50000 && value <= 100000;

      case "₹1L - ₹1.5L":
        return value > 100000 && value <= 150000;

      case "₹1.5L - ₹2L":
        return value > 150000 && value <= 200000;

      case "Above ₹2L":
        return value > 200000;

      default:
        return true;
    }
  };

  const filteredBikes = bikes.filter((bike) => {
    const searchMatch = bike.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const brandMatch =
      selectedBrand === "All" ||
      bike.name
        .toLowerCase()
        .includes(
          selectedBrand.toLowerCase()
        );

    const yearMatch =
      selectedYear === "All" ||
      bike.year === selectedYear;

    const priceMatch =
      matchesPrice(bike.price);

    return (
      searchMatch &&
      brandMatch &&
      yearMatch &&
      priceMatch
    );
  });

  const openFilters = () => {
    setTempBrand(selectedBrand);
    setTempYear(selectedYear);
    setTempPrice(selectedPrice);
    setFilterVisible(true);
  };

  const applyFilters = () => {
    setSelectedBrand(tempBrand);
    setSelectedYear(tempYear);
    setSelectedPrice(tempPrice);
    setFilterVisible(false);
  };

  const clearFilters = () => {
    setTempBrand("All");
    setTempYear("All");
    setTempPrice("All");

    setSelectedBrand("All");
    setSelectedYear("All");
    setSelectedPrice("All");

    setFilterVisible(false);
  };

  /* =========================
     RETURN
  ========================= */

  return (
    <View style={styles.container}>

      {/* =========================
          HEADER
      ========================= */}

      <View style={styles.header}>

        <Image
          source={require(
            "../../assets/images/logo.png"
          )}
          style={styles.logo}
          resizeMode="contain"
        />

        {/* NOTIFICATION BELL */}

        <TouchableOpacity
          style={styles.notificationButton}
          onPress={() =>
            router.push("/notifications")
          }
          activeOpacity={0.7}
        >
          <Text style={styles.notificationIcon}>
            🔔
          </Text>
        </TouchableOpacity>

      </View>

      {/* =========================
          CONTENT
      ========================= */}

      <ScrollView
        style={styles.contentScroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >

        {/* HERO */}

        <View style={styles.hero}>

          <Text style={styles.heroTitle}>
            Find Your Perfect Bike
          </Text>

          <Text style={styles.heroSubtitle}>
            Buy & Sell Trusted Second-Hand Bikes
            {"\n"}
            with BikesLand
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

            <TouchableOpacity
              style={styles.searchButton}
            >
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
              source={require(
                "../../assets/images/founder.jpg"
              )}
              style={styles.founderImage}
              resizeMode="cover"
            />

          </View>

          <View style={styles.founderInfo}>

            <Text style={styles.founderLabel}>
              FOUNDER & CEO | BIKESLAND
            </Text>

            <Text style={styles.founderName}>
              Kandhukuru Bhupathi Santosh
            </Text>

            <Text style={styles.founderTrust}>
              ✓ Building Trust in Every Ride
            </Text>

          </View>

        </View>

        {/* =========================
            AVAILABLE BIKES HEADER
        ========================= */}

        <View style={styles.availableHeader}>

          <Text style={styles.sectionTitle}>
            Available Bikes
          </Text>

          <TouchableOpacity
            style={styles.filterButton}
            onPress={openFilters}
            activeOpacity={0.8}
          >
            <Text style={styles.filterButtonText}>
              ⚙ Filter
            </Text>
          </TouchableOpacity>

        </View>

        {/* =========================
            FILTER MODAL
        ========================= */}

        <Modal
          visible={filterVisible}
          transparent
          animationType="slide"
          onRequestClose={() =>
            setFilterVisible(false)
          }
        >

          <View style={styles.modalOverlay}>

            <View style={styles.filterModal}>

              {/* FILTER HEADER */}

              <View style={styles.filterHeader}>

                <Text style={styles.filterTitle}>
                  Filter Bikes
                </Text>

                <TouchableOpacity
                  onPress={() =>
                    setFilterVisible(false)
                  }
                >
                  <Text style={styles.closeButton}>
                    ✕
                  </Text>
                </TouchableOpacity>

              </View>

              {/* BRAND */}

              <Text style={styles.filterLabel}>
                🏍️ Brand
              </Text>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.optionScroll}
              >

                {brandOptions.map(
                  (brand) => (

                    <TouchableOpacity
                      key={brand}
                      style={[
                        styles.optionButton,
                        tempBrand === brand &&
                          styles.optionButtonActive,
                      ]}
                      onPress={() =>
                        setTempBrand(brand)
                      }
                    >

                      <Text
                        style={[
                          styles.optionText,
                          tempBrand === brand &&
                            styles.optionTextActive,
                        ]}
                      >
                        {brand}
                      </Text>

                    </TouchableOpacity>

                  )
                )}

              </ScrollView>

              {/* YEAR */}

              <Text style={styles.filterLabel}>
                📅 Year
              </Text>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.optionScroll}
              >

                {yearOptions.map(
                  (year) => (

                    <TouchableOpacity
                      key={year}
                      style={[
                        styles.optionButton,
                        tempYear === year &&
                          styles.optionButtonActive,
                      ]}
                      onPress={() =>
                        setTempYear(year)
                      }
                    >

                      <Text
                        style={[
                          styles.optionText,
                          tempYear === year &&
                            styles.optionTextActive,
                        ]}
                      >
                        {year}
                      </Text>

                    </TouchableOpacity>

                  )
                )}

              </ScrollView>

              {/* PRICE */}

              <Text style={styles.filterLabel}>
                💰 Price Range
              </Text>

              <View style={styles.priceOptions}>

                {priceOptions.map(
                  (price) => (

                    <TouchableOpacity
                      key={price}
                      style={[
                        styles.priceOption,
                        tempPrice === price &&
                          styles.optionButtonActive,
                      ]}
                      onPress={() =>
                        setTempPrice(price)
                      }
                    >

                      <Text
                        style={[
                          styles.optionText,
                          tempPrice === price &&
                            styles.optionTextActive,
                        ]}
                      >
                        {price}
                      </Text>

                    </TouchableOpacity>

                  )
                )}

              </View>

              {/* ACTION BUTTONS */}

              <View style={styles.filterActions}>

                <TouchableOpacity
                  style={styles.clearFilterButton}
                  onPress={clearFilters}
                >
                  <Text
                    style={styles.clearFilterText}
                  >
                    Clear All
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.applyFilterButton}
                  onPress={applyFilters}
                >
                  <Text
                    style={styles.applyFilterText}
                  >
                    Apply Filters
                  </Text>
                </TouchableOpacity>

              </View>

            </View>

          </View>

        </Modal>

        {/* =========================
            BIKES
        ========================= */}

        <View style={styles.bikesContainer}>

          {loading ? (

            <Text style={styles.message}>
              Loading bikes...
            </Text>

          ) : firebaseError ? (

            <Text style={styles.error}>
              Firebase Error: {firebaseError}
            </Text>

          ) : filteredBikes.length === 0 ? (

            <Text style={styles.message}>
              {search ||
              selectedBrand !== "All" ||
              selectedYear !== "All" ||
              selectedPrice !== "All"
                ? "No bikes found"
                : "No bikes available"}
            </Text>

          ) : (

            filteredBikes.map(
              (bike) => (

                <View
                  key={bike.id}
                  style={styles.card}
                >

                  {/* BIKE IMAGES */}

                  {bike.images &&
                  bike.images.length > 0 ? (

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
                            style={
                              styles.photoContainer
                            }
                          >

                            <Image
                              source={{
                                uri: image,
                              }}
                              style={
                                styles.bikeImage
                              }
                              resizeMode="cover"
                            />

                            <View
                              style={
                                styles.counter
                              }
                            >

                              <Text
                                style={
                                  styles.counterText
                                }
                              >
                                {index + 1} /{" "}
                                {bike.images
                                  ?.length || 1}
                              </Text>

                            </View>

                          </View>

                        )
                      )}

                    </ScrollView>

                  ) : (

                    <View
                      style={styles.noImage}
                    >

                      <Text
                        style={
                          styles.noImageText
                        }
                      >
                        Bike Image
                      </Text>

                    </View>

                  )}

                  {/* CARD CONTENT */}

                  <View
                    style={styles.cardContent}
                  >

                    <Text
                      style={styles.bikeName}
                    >
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

                      <TouchableOpacity
                        style={
                          styles.viewButton
                        }
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

                        <Text
                          style={
                            styles.buttonText
                          }
                        >
                          View Details
                        </Text>

                      </TouchableOpacity>

                      <TouchableOpacity
                        style={
                          styles.callButton
                        }
                        onPress={callNow}
                      >

                        <Text
                          style={
                            styles.buttonText
                          }
                        >
                          Call
                        </Text>

                      </TouchableOpacity>

                      <TouchableOpacity
                        style={
                          styles.whatsappButton
                        }
                        onPress={() =>
                          whatsapp(
                            bike.name
                          )
                        }
                      >

                        <Text
                          style={
                            styles.buttonText
                          }
                        >
                          WhatsApp
                        </Text>

                      </TouchableOpacity>

                    </View>

                  </View>

                </View>

              )
            )

          )}

        </View>

        {/* =========================
            ABOUT
        ========================= */}

        <View style={styles.aboutSection}>

          <Text style={styles.bottomTitle}>
            About BikesLand
          </Text>

          <Text style={styles.bottomText}>
            BikesLand is a trusted platform
            for buying and selling quality
            second-hand bikes. Our goal is
            to make every bike purchase
            simple, transparent and
            trustworthy.
          </Text>

          <Text style={styles.promise}>
            🏍️ Quality Bikes  •  🤝 Trusted Service
          </Text>

        </View>

        {/* =========================
            REVIEWS
        ========================= */}

        <View style={styles.reviewsSection}>

          <Text style={styles.bottomTitle}>
            Customer Reviews
          </Text>

          {/* REVIEW FORM */}

          <View style={styles.reviewForm}>

            <Text style={styles.formLabel}>
              Your Name
            </Text>

            <TextInput
              value={reviewName}
              onChangeText={setReviewName}
              placeholder="Enter your name"
              placeholderTextColor="#777"
              style={styles.reviewInput}
            />

            <Text style={styles.formLabel}>
              Your Rating
            </Text>

            <View style={styles.ratingRow}>

              {[1, 2, 3, 4, 5].map(
                (star) => (

                  <TouchableOpacity
                    key={star}
                    onPress={() =>
                      setReviewRating(star)
                    }
                  >

                    <Text
                      style={[
                        styles.ratingStar,
                        {
                          color:
                            star <=
                            reviewRating
                              ? "#ffd400"
                              : "#555",
                        },
                      ]}
                    >
                      ★
                    </Text>

                  </TouchableOpacity>

                )
              )}

            </View>

            <Text style={styles.formLabel}>
              Your Review
            </Text>

            <TextInput
              value={reviewText}
              onChangeText={setReviewText}
              placeholder="Write your review..."
              placeholderTextColor="#777"
              multiline
              numberOfLines={4}
              style={styles.reviewTextInput}
            />

            <TouchableOpacity
              style={
                styles.submitReviewButton
              }
              onPress={submitReview}
              disabled={reviewLoading}
            >

              <Text
                style={
                  styles.submitReviewText
                }
              >
                {reviewLoading
                  ? "Submitting..."
                  : "Submit Review"}
              </Text>

            </TouchableOpacity>

          </View>

          {/* REVIEWS LIST */}

          {reviews.length === 0 ? (

            <Text style={styles.noReviews}>
              No reviews yet. Be the first
              to review BikesLand!
            </Text>

          ) : (

            reviews.map((item) => {

              const rating = Math.min(
                5,
                Math.max(
                  0,
                  Number(
                    item.rating || 0
                  )
                )
              );

              return (
                <View
                  key={item.id}
                  style={
                    styles.reviewCard
                  }
                >

                  <Text
                    style={styles.stars}
                  >
                    {"★".repeat(rating)}
                    {"☆".repeat(
                      5 - rating
                    )}
                  </Text>

                  <Text
                    style={
                      styles.reviewText
                    }
                  >
                    "{item.review}"
                  </Text>

                  <Text
                    style={styles.reviewer}
                  >
                    — {item.name}
                  </Text>

                </View>
              );
            })

          )}

        </View>

        {/* =========================
            CONTACT
        ========================= */}

        <View
          style={styles.contactSection}
        >

          <Text style={styles.bottomTitle}>
            Contact Us
          </Text>

          <Text style={styles.contactText}>
            Have a question about a bike?
          </Text>

          <TouchableOpacity
            style={styles.contactCall}
            onPress={callNow}
          >

            <Text
              style={
                styles.contactButtonText
              }
            >
              📞 Call Us
            </Text>

          </TouchableOpacity>

          <TouchableOpacity
            style={
              styles.contactWhatsapp
            }
            onPress={() =>
              whatsapp("a bike")
            }
          >

            <Text
              style={
                styles.contactButtonText
              }
            >
              💬 WhatsApp Us
            </Text>

          </TouchableOpacity>

          <Text
            style={styles.contactNumber}
          >
            +91 63018 85817
          </Text>

        </View>

        {/* =========================
            FOOTER
        ========================= */}

        <View style={styles.footer}>

          <Text style={styles.footerLogo}>
            🏍️ BikesLand
          </Text>

          <Text style={styles.footerText}>
            BUY • SELL • TRUST
          </Text>

          <View style={styles.footerLinks}>

            <TouchableOpacity>
              <Text
                style={styles.footerLink}
              >
                About
              </Text>
            </TouchableOpacity>

            <Text style={styles.footerDot}>
              •
            </Text>

            <TouchableOpacity>
              <Text
                style={styles.footerLink}
              >
                Reviews
              </Text>
            </TouchableOpacity>

            <Text style={styles.footerDot}>
              •
            </Text>

            <TouchableOpacity
              onPress={callNow}
            >
              <Text
                style={styles.footerLink}
              >
                Contact
              </Text>
            </TouchableOpacity>

          </View>

          <Text
            style={styles.footerPhone}
          >
            📞 +91 6301885817
          </Text>

          <Text
            style={styles.copyright}
          >
            © 2026 BikesLand
          </Text>

          <Text
            style={styles.founded}
          >
            Founded by Kandhukuru
            Bhupathi Santosh
          </Text>

        </View>

      </ScrollView>

    </View>
  );
}

/* =========================
   STYLES
========================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },

  header: {
    height: 95,
    paddingTop: 55,
    paddingBottom: 8,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#222",
    backgroundColor: "#000000",
    position: "relative",
    zIndex: 10,
  },

  logo: {
    width: 150,
    height: 43,
    position: "absolute",
    left: 18,
    top: 48,
  },

  tagline: {
    color: "#777",
    fontSize: 8,
    letterSpacing: 3,
    marginTop: 1,
  },

  /* NOTIFICATION */

  notificationButton: {
    position: "absolute",
    right: 18,
    top: 65,
  },

  notificationIcon: {
    fontSize: 18,
  },

  contentScroll: {
    flex: 1,
  },

  /* HERO */

  hero: {
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 16,
  },

  heroTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "800",
    textAlign: "center",
  },

  heroSubtitle: {
    color: "#999",
    fontSize: 11,
    marginTop: 8,
    textAlign: "center",
    lineHeight: 14,
  },

  /* SEARCH */

  searchBox: {
    width: "100%",
    flexDirection: "row",
    marginTop: 16,
  },

  input: {
    flex: 1,
    height: 40,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 14,
    color: "#000",
    fontSize: 14,
  },

  searchButton: {
    height: 40,
    backgroundColor: "#e50914",
    marginLeft: 8,
    paddingHorizontal: 18,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  searchText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "800",
  },

  /* FOUNDER */

  founderSection: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 18,
    marginTop: 5,
    marginBottom: 18,
    padding: 12,
    backgroundColor: "#111",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#292929",
  },

  founderCircle: {
    width: 70,
    height: 70,
    borderRadius: 37.5,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#d4af37",
  },

  founderImage: {
    width: "100%",
    height: "100%",
  },

  founderInfo: {
    flex: 1,
    marginLeft: 12,
  },

  founderLabel: {
    color: "#d4af37",
    fontSize: 10,
    fontWeight: "800",
  },

  founderName: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "800",
    marginTop: 4,
  },

  founderTrust: {
    color: "#20c463",
    fontSize: 10,
    fontWeight: "600",
    marginTop: 4,
  },

  /* AVAILABLE BIKES */

  availableHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginTop: 8,
    marginBottom: 12,
  },

  sectionTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "800",
  },

  filterButton: {
  backgroundColor: "#1a1a1a",
  paddingHorizontal: 15,
  paddingVertical: 9,
  borderRadius: 9,
  borderWidth: 1,
  borderColor: "#444",
},

  filterButtonText: {
    color: "#f6fafa",
    fontSize: 12,
    fontWeight: "800",
  },

  /* FILTER MODAL */

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.75)",
    justifyContent: "flex-end",
  },

  filterModal: {
    backgroundColor: "#111827",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 30,
    borderWidth: 1,
    borderColor: "#292929",
  },

  filterHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  filterTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "900",
  },

  closeButton: {
    color: "#aaa",
    fontSize: 22,
    fontWeight: "700",
  },

  filterLabel: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "800",
    marginTop: 8,
    marginBottom: 10,
  },

  optionScroll: {
    marginBottom: 10,
  },

  optionButton: {
    backgroundColor: "#222",
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#333",
  },

  optionButtonActive: {
    backgroundColor: "#e50914",
    borderColor: "#e50914",
  },

  optionText: {
    color: "#aaa",
    fontSize: 11,
    fontWeight: "700",
  },

  optionTextActive: {
    color: "#fff",
    fontWeight: "900",
  },

  priceOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 18,
  },

  priceOption: {
    backgroundColor: "#222",
    paddingHorizontal: 13,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#333",
  },

  filterActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
  },

  clearFilterButton: {
    flex: 1,
    backgroundColor: "#222",
    paddingVertical: 13,
    borderRadius: 9,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#444",
  },

  clearFilterText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "800",
  },

  applyFilterButton: {
    flex: 1.5,
    backgroundColor: "#e50914",
    paddingVertical: 13,
    borderRadius: 9,
    alignItems: "center",
  },

  applyFilterText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "900",
  },

  /* BIKES */

  bikesContainer: {
    paddingHorizontal: 16,
  },

  card: {
    backgroundColor: "#111827",
    borderRadius: 13,
    overflow: "hidden",
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#292929",
  },

  photoContainer: {
    width: width - 32,
    height: 220,
    position: "relative",
    backgroundColor: "#fff",
  },

  bikeImage: {
    width: "100%",
    height: 220,
    backgroundColor: "#fff",
  },

  counter: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.75)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 15,
  },

  counterText: {
    color: "#fff",
    fontSize: 9,
    fontWeight: "800",
  },

  cardContent: {
    padding: 11,
  },

  bikeName: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "800",
    marginBottom: 7,
  },

  info: {
    color: "#bbb",
    fontSize: 11,
    marginBottom: 4,
  },

  price: {
    color: "#ffd400",
    fontSize: 18,
    fontWeight: "900",
    marginTop: 5,
    marginBottom: 9,
  },

  buttons: {
    flexDirection: "row",
    gap: 5,
  },

  viewButton: {
    flex: 1.5,
    backgroundColor: "#e50914",
    paddingVertical: 9,
    borderRadius: 6,
    alignItems: "center",
  },

  callButton: {
    flex: 0.8,
    backgroundColor: "#1677ff",
    paddingVertical: 9,
    borderRadius: 6,
    alignItems: "center",
  },

  whatsappButton: {
    flex: 1.2,
    backgroundColor: "#16a34a",
    paddingVertical: 9,
    borderRadius: 6,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "800",
  },

  noImage: {
    height: 220,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#111",
  },

  noImageText: {
    color: "#777",
    fontSize: 13,
  },

  /* ABOUT */

  aboutSection: {
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 18,
    padding: 16,
    backgroundColor: "#111",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#292929",
  },

  bottomTitle: {
    color: "#fff",
    fontSize: 21,
    fontWeight: "800",
    marginBottom: 10,
  },

  bottomText: {
    color: "#aaa",
    fontSize: 12,
    lineHeight: 18,
  },

  promise: {
    color: "#d4af37",
    fontSize: 11,
    fontWeight: "700",
    marginTop: 12,
  },

  /* REVIEWS */

  reviewsSection: {
    marginHorizontal: 16,
    marginBottom: 18,
  },

  reviewForm: {
    backgroundColor: "#111",
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#292929",
  },

  formLabel: {
    color: "#aaa",
    fontSize: 11,
    fontWeight: "700",
    marginBottom: 6,
    marginTop: 5,
  },

  reviewInput: {
    height: 44,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 12,
    color: "#000",
    fontSize: 12,
  },

  ratingRow: {
    flexDirection: "row",
    marginBottom: 8,
  },

  ratingStar: {
    fontSize: 27,
    marginRight: 5,
  },

  reviewTextInput: {
    minHeight: 80,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingTop: 10,
    color: "#000",
    fontSize: 12,
    textAlignVertical: "top",
  },

  submitReviewButton: {
    backgroundColor: "#e50914",
    marginTop: 12,
    paddingVertical: 11,
    borderRadius: 7,
    alignItems: "center",
  },

  submitReviewText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "800",
  },

  noReviews: {
    color: "#777",
    fontSize: 11,
    textAlign: "center",
    paddingVertical: 15,
  },

  reviewCard: {
    backgroundColor: "#111",
    borderRadius: 12,
    padding: 13,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#292929",
  },

  stars: {
    color: "#ffd400",
    fontSize: 15,
    marginBottom: 6,
  },

  reviewText: {
    color: "#ccc",
    fontSize: 12,
    lineHeight: 18,
  },

  reviewer: {
    color: "#777",
    fontSize: 10,
    marginTop: 7,
  },

  /* CONTACT */

  contactSection: {
    marginHorizontal: 16,
    marginBottom: 20,
    padding: 16,
    backgroundColor: "#111",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#292929",
    alignItems: "center",
  },

  contactText: {
    color: "#aaa",
    fontSize: 12,
    marginBottom: 12,
  },

  contactCall: {
    width: "100%",
    backgroundColor: "#1677ff",
    paddingVertical: 11,
    borderRadius: 7,
    alignItems: "center",
    marginBottom: 8,
  },

  contactWhatsapp: {
    width: "100%",
    backgroundColor: "#16a34a",
    paddingVertical: 11,
    borderRadius: 7,
    alignItems: "center",
  },

  contactButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "800",
  },

  contactNumber: {
    color: "#777",
    fontSize: 11,
    marginTop: 10,
  },

  /* FOOTER */

  footer: {
    alignItems: "center",
    paddingTop: 18,
    paddingBottom: 30,
    backgroundColor: "#050505",
    borderTopWidth: 1,
    borderTopColor: "#222",
  },

  footerLogo: {
    color: "#e50914",
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: 2,
  },

  footerText: {
    color: "#666",
    fontSize: 8,
    letterSpacing: 3,
    marginTop: 4,
  },

  footerLinks: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
  },

  footerLink: {
    color: "#aaa",
    fontSize: 11,
    fontWeight: "700",
  },

  footerDot: {
    color: "#444",
    marginHorizontal: 10,
  },

  footerPhone: {
    color: "#777",
    fontSize: 10,
    marginTop: 14,
  },

  copyright: {
    color: "#444",
    fontSize: 9,
    marginTop: 10,
  },

  founded: {
    color: "#333",
    fontSize: 8,
    marginTop: 4,
  },

  /* MESSAGES */

  message: {
    color: "#aaa",
    textAlign: "center",
    padding: 25,
  },

  error: {
    color: "#ff4444",
    textAlign: "center",
    padding: 18,
  },
});