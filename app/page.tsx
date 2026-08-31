"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "./firebase";
export default function Home() {
  const [bikes, setBikes] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewName, setReviewName] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [submittingReview, setSubmittingReview] = useState(false);
  // =========================
  // FOUNDER
  // =========================
  const [founderPhoto, setFounderPhoto] = useState("");
  const [founderName, setFounderName] = useState(
    "Kandhukuru Bhupathi Santosh"
  );
  // =========================
  // LOAD WEBSITE DATA
  // =========================
  useEffect(() => {
    const loadData = async () => {
      // =========================
      // LOAD BIKES
      // =========================
      try {
        const bikeSnapshot = await getDocs(
          collection(db, "bikes")
        );
        const bikeList = bikeSnapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        }));
        setBikes(bikeList);
      } catch (error) {
        console.error("Error loading bikes:", error);
      }
      // =========================
      // LOAD REVIEWS
      // =========================
      try {
        const reviewSnapshot = await getDocs(
          collection(db, "reviews")
        );
        const reviewList = reviewSnapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        }));
        setReviews(reviewList);
      } catch (error) {
        console.error("Error loading reviews:", error);
      }
      // =========================
      // LOAD FOUNDER
      // =========================
      try {
        const founderRef = doc(
  db,
  "settings",
  "founder"
);
        const founderSnapshot = await getDoc(
          founderRef
        );
        if (founderSnapshot.exists()) {
          const founderData = founderSnapshot.data();
          if (founderData.photoUrl) {
            setFounderPhoto(founderData.photoUrl);
          }
          if (founderData.name) {
            setFounderName(founderData.name);
          }
        }
      } catch (error) {
        console.error(
          "Error loading founder:",
          error
        );
      }
    };
    loadData();
  }, []);
  // =========================
  // SUBMIT REVIEW
  // =========================
  const submitReview = async () => {
    if (
      !reviewName.trim() ||
      !reviewComment.trim()
    ) {
      alert(
        "Please enter your name and review."
      );
      return;
    }
    setSubmittingReview(true);
    try {
      await addDoc(collection(db, "reviews"), {
        name: reviewName.trim(),
        comment: reviewComment.trim(),
        rating: reviewRating,
        createdAt: serverTimestamp(),
      });
      alert(
        "Thank you! Your review has been submitted."
      );
      setReviewName("");
      setReviewComment("");
      setReviewRating(5);
      const reviewSnapshot = await getDocs(
        collection(db, "reviews")
      );
      const reviewList =
        reviewSnapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        }));
      setReviews(reviewList);
    } catch (error) {
      console.error(
        "Error submitting review:",
        error
      );
      alert(
        "Something went wrong. Please try again."
      );
    } finally {
      setSubmittingReview(false);
    }
  };
  // =========================
  // AVERAGE RATING
  // =========================
  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce(
            (total, review) =>
              total +
              Number(review.rating || 0),
            0
          ) / reviews.length
        ).toFixed(1)
      : "0.0";
  // =========================
  // SEARCH
  // =========================
  const filteredBikes = bikes.filter((bike) =>
    (bike.bikeName || "")
      .toLowerCase()
      .includes(search.toLowerCase())
  );
  return (
    <main className="min-h-screen bg-black text-white">
      {/* =========================
          NAVBAR
      ========================= */}
      <nav className="sticky top-0 z-50 bg-black border-b border-gray-800">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-5 py-0">
          <Link href="/">
            <Image
              src="/logo.png"
              alt="BikesLand Logo"
              width={300}
              height={80}
              className="w-72 sm:w-80 h-20 object-contain"
            />
          </Link>
          <div className="hidden md:flex gap-5">
            <Link
              href="/"
              className="hover:text-red-500"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="hover:text-red-500"
            >
              About
            </Link>
            <Link
              href="#bikes"
              className="hover:text-red-500"
            >
              Bikes
            </Link>
            <Link
              href="#reviews"
              className="hover:text-red-500"
            >
              Reviews
            </Link>
            <Link
              href="#contact"
              className="hover:text-red-500"
            >
              Contact
            </Link>
          </div>
        </div>
      </nav>
      {/* =========================
          HERO
      ========================= */}
      <section className="max-w-6xl mx-auto px-6 pt-6 pb-8 text-center">
        <h2 className="text-2xl md:text-5xl font-bold">
          Find Your Perfect Bike
        </h2>
        <p className="mt-3 text-gray-400 text-base">
          Buy & Sell Trusted Second-Hand Bikes with
          BikesLand
        </p>
        <div className="mt-5 flex flex-col sm:flex-row justify-center gap-4">
          <input
            type="text"
            placeholder="Search your bike..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="sm:w-96 w-full max-w-md p-3 rounded-xl bg-white text-black outline-none"
          />
          <button
            className="bg-red-600 hover:bg-red-700 px-8 py-3 rounded-xl"
          >
            Search
          </button>
        </div>
      </section>
      {/* =========================
          FOUNDER SECTION
      ========================= */}
      <section className="text-center py-10">
        <div className="flex justify-center">
          {founderPhoto ? (
            <img
              src={founderPhoto}
              alt="Founder"
              className="w-28 h-28 rounded-full mx-auto border-2 border-yellow-500 object-cover"
            />
          ) : (
            <div className="w-28 h-28 rounded-full mx-auto border-2 border-yellow-500 bg-gray-800 flex items-center justify-center">
              <span className="text-gray-500 text-sm">
                Founder
              </span>
            </div>
          )}
        </div>
        <h2 className="mt-4 text-2xl font-bold">
          {founderName}
        </h2>
        <p className="text-gray-400">
          Founder & CEO, BikesLand
        </p>
        <p className="mt-2 text-green-400">
          ✓ Building Trust in Every Ride
        </p>
      </section>
      {/* =========================
          BIKES
      ========================= */}
      <section
        id="bikes"
        className="max-w-7xl mx-auto px-6 py-10"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
          Available Bikes
        </h2>
        {filteredBikes.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-400 text-lg">
              {search
                ? "No bikes found."
                : "No bikes available right now."}
            </p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-3">
            {filteredBikes.map((bike) => (
              <div
                key={bike.id}
                className="bg-gray-900 rounded-2xl overflow-hidden shadow-lg hover:scale-105 transition"
              >
                {/* BIKE PHOTOS */}
                {Array.isArray(bike.images) &&
                bike.images.length > 0 ? (
                  <div className="relative w-full overflow-hidden">
                    <div className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth">
                      {bike.images.map(
                        (
                          image: string,
                          index: number
                        ) => (
                          <div
                            key={`${bike.id}-${index}`}
                            className="min-w-full h-56 snap-center flex-shrink-0 relative"
                          >
                            <img
                              src={image}
                              alt={`${
                                bike.bikeName ||
                                "Bike"
                              } Photo ${
                                index + 1
                              }`}
                              className="w-full h-56 object-cover"
                            />
                            <div className="absolute top-3 right-3 bg-black/80 text-white px-3 py-1 rounded-full text-xs font-bold">
                              {index + 1} /{" "}
                              {bike.images.length}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                ) : bike.image ? (
                  <img
                    src={bike.image}
                    alt={
                      bike.bikeName ||
                      "Bike"
                    }
                    className="w-full h-56 object-cover"
                  />
                ) : (
                  <div className="w-full h-56 bg-gray-800 flex items-center justify-center">
                    <p className="text-gray-500">
                      Bike Image Coming Soon
                    </p>
                  </div>
                )}
                <div className="p-5">
                  <h3 className="text-2xl font-bold">
                    {bike.bikeName}
                  </h3>
                  <p className="mt-2">
                    📅 Year: {bike.year}
                  </p>
                  <p>
                    📍 {bike.location}
                  </p>
                  {bike.kmDriven && (
                    <p>
                      🛣️ KM Driven:{" "}
                      {bike.kmDriven}
                    </p>
                  )}
                  <p className="text-yellow-500 text-xl font-bold mt-2">
                    ₹{bike.price}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-5">
                    <Link
                      href={`/bike/${bike.id}`}
                      className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg"
                    >
                      View Details
                    </Link>
                    <a
                      href="tel:+916301885817"
                      className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
                    >
                      Call
                    </a>
                    <a
                      href={`https://wa.me/916301885817?text=Hi%20I'm%20interested%20in%20${encodeURIComponent(
                        bike.bikeName ||
                          "this bike"
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg"
                    >
                      WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
      {/* =========================
          ABOUT
      ========================= */}
      <section className="max-w-5xl mx-auto px-6 py-16 text-center">
        <h2 className="text-4xl font-bold text-red-500">
          About BikesLand
        </h2>
        <p className="mt-5 text-gray-300 text-lg">
          BikesLand is a trusted second-hand bike
          buying and selling platform in Nellore.
          We provide quality bikes with easy Call
          and WhatsApp support.
        </p>
      </section>
      {/* =========================
          REVIEWS
      ========================= */}
      <section
        id="reviews"
        className="max-w-3xl mx-auto px-6 py-16"
      >
        <h2 className="text-4xl font-bold text-yellow-400">
          Customer Reviews
        </h2>
        <p className="mt-4 text-gray-300">
          ⭐⭐⭐⭐⭐ {averageRating} Rating
        </p>
        <p className="mt-2 text-gray-400">
          Based on {reviews.length} customer
          review
          {reviews.length !== 1
            ? "s"
            : ""}
        </p>
        <p className="mt-4 text-gray-300 text-center">
          Share your experience with BikesLand ⭐
        </p>
        {/* REVIEW FORM */}
        <div className="mt-8 bg-gray-900 rounded-2xl p-6">
          <input
            type="text"
            placeholder="Your Name"
            value={reviewName}
            onChange={(e) =>
              setReviewName(e.target.value)
            }
            className="w-full p-3 rounded-lg bg-white text-black outline-none"
          />
          <div className="mt-5">
            <p className="mb-2">
              Your Rating
            </p>
            <select
              value={reviewRating}
              onChange={(e) =>
                setReviewRating(
                  Number(e.target.value)
                )
              }
              className="w-full p-3 rounded-lg bg-white text-black"
            >
              <option value={5}>
                ⭐⭐⭐⭐⭐ 5 Stars
              </option>
              <option value={4}>
                ⭐⭐⭐⭐ 4 Stars
              </option>
              <option value={3}>
                ⭐⭐⭐ 3 Stars
              </option>
              <option value={2}>
                ⭐⭐ 2 Stars
              </option>
              <option value={1}>
                ⭐ 1 Star
              </option>
            </select>
          </div>
          <textarea
            placeholder="Write your review..."
            value={reviewComment}
            onChange={(e) =>
              setReviewComment(
                e.target.value
              )
            }
            className="w-full mt-5 p-3 rounded-lg bg-white text-black outline-none"
            rows={4}
          />
          <button
            onClick={submitReview}
            disabled={submittingReview}
            className="w-full mt-5 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 px-5 py-3 rounded-lg font-bold"
          >
            {submittingReview
              ? "Submitting..."
              : "Submit Review"}
          </button>
        </div>
        {/* REVIEWS LIST */}
        <div className="mt-10 space-y-5">
          {reviews.length === 0 ? (
            <p className="text-center text-gray-500">
              No reviews yet. Be the first
              customer to review BikesLand!
            </p>
          ) : (
            reviews.map((review) => (
              <div
                key={review.id}
                className="bg-gray-900 rounded-2xl p-5"
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-lg">
                    {review.name}
                  </h3>
                  <p className="text-yellow-400">
                    {"⭐".repeat(
                      Number(
                        review.rating
                      ) || 0
                    )}
                  </p>
                </div>
                <p className="mt-3 text-gray-300">
                  {review.comment}
                </p>
              </div>
            ))
          )}
        </div>
      </section>
      {/* =========================
          CONTACT
      ========================= */}
      <section
        id="contact"
        className="text-center py-16"
      >
        <h2 className="text-4xl font-bold text-red-500">
          Contact Us
        </h2>
        <p className="mt-4">
          📞 +91 6301885817
        </p>
        <p>
          📍 Nellore, Andhra Pradesh
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <a
            href="tel:+916301885817"
            className="bg-blue-600 px-5 py-3 rounded-lg"
          >
            Call Now
          </a>
          <a
            href="https://wa.me/916301885817"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-600 px-5 py-3 rounded-lg"
          >
            WhatsApp
          </a>
        </div>
      </section>
      {/* =========================
          FOOTER
      ========================= */}
      <footer className="bg-gray-950 text-white py-10 mt-10 border-t border-gray-800">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-red-500">
            🏍️ BikesLand
          </h2>
          <p className="mt-3 text-gray-400">
            Trusted Second-Hand Bikes Marketplace
          </p>
          <p className="mt-4">
            📞 +91 6301885817
          </p>
          <p>
            💬 WhatsApp: +91 6301885817
          </p>
          <p className="mt-4 text-gray-500">
            Office Coming Soon...
          </p>
          <p className="mt-6 text-gray-600 text-sm">
            ©️ 2026 BikesLand. All Rights Reserved.
          </p>
          <p className="text-gray-600 text-sm">
            Founded by Kandhukuru Bhupathi Santosh
          </p>
        </div>
      </footer>
    </main>
  );
}