"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
} from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { db, auth } from "@/app/firebase";

export default function DashboardPage() {
  const router = useRouter();

  const [bikes, setBikes] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // =========================
  // FOUNDER
  // =========================
  const [showFounder, setShowFounder] = useState(false);
  const [founderPhoto, setFounderPhoto] = useState("");
  const [founderFile, setFounderFile] = useState<File | null>(null);
  const [uploadingFounder, setUploadingFounder] = useState(false);

  // =========================
  // FETCH BIKES
  // =========================
  const fetchBikes = async () => {
    try {
      const snapshot = await getDocs(collection(db, "bikes"));

      const bikeList = snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      }));

      setBikes(bikeList);
    } catch (error) {
      console.error(error);
      alert("❌ Error loading bikes");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // FETCH REVIEWS
  // =========================
  const fetchReviews = async () => {
    try {
      const snapshot = await getDocs(collection(db, "reviews"));

      const reviewList = snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      }));

      setReviews(reviewList);
    } catch (error) {
      console.error(error);
      alert("❌ Error loading reviews");
    }
  };

  // =========================
  // FETCH FOUNDER
  // =========================
  const fetchFounder = async () => {
    try {
      const founderRef = doc(db, "settings", "founder");

      const snapshot = await getDoc(founderRef);

      if (snapshot.exists()) {
        const data = snapshot.data();

        if (data.photoUrl) {
          setFounderPhoto(data.photoUrl);
        }
      }
    } catch (error) {
      console.error(
        "Error loading founder:",
        error
      );
    }
  };

  // =========================
  // AUTH
  // =========================
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        if (!user) {
          router.replace("/admin/login");
          return;
        }

        setCheckingAuth(false);

        fetchBikes();
        fetchReviews();
        fetchFounder();
      }
    );

    return () => unsubscribe();
  }, [router]);

  // =========================
  // UPLOAD FOUNDER PHOTO
  // =========================
  const uploadFounderPhoto = async () => {
    if (!founderFile) {
      alert(
        "Please choose a founder photo first."
      );
      return;
    }

    try {
      setUploadingFounder(true);

      const formData = new FormData();

      formData.append(
        "file",
        founderFile
      );

      formData.append(
        "upload_preset",
        "bikesland_upload"
      );

      const response = await fetch(
        "https://api.cloudinary.com/v1_1/vflu9vv4/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const responseText =
        await response.text();

      if (!response.ok) {
        throw new Error(
          `Cloudinary ${response.status}: ${responseText}`
        );
      }

      const data =
        JSON.parse(responseText);

      const photoUrl =
        data.secure_url;

      // Save founder photo URL
      // to Firebase
      await setDoc(
        doc(
          db,
          "settings",
          "founder"
        ),
        {
          name:
            "Kandhukuru Bhupathi Santosh",

          role:
            "Founder & CEO, BikesLand",

          photoUrl:
            photoUrl,

          updatedAt:
            new Date(),
        },
        {
          merge: true,
        }
      );

      setFounderPhoto(photoUrl);
      setFounderFile(null);

      const fileInput =
        document.getElementById(
          "founderPhoto"
        ) as HTMLInputElement;

      if (fileInput) {
        fileInput.value = "";
      }

      alert(
        "✅ Founder added/updated successfully!"
      );
    } catch (error) {
      console.error(
        "Founder upload error:",
        error
      );

      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert(
          "❌ Founder photo upload failed."
        );
      }
    } finally {
      setUploadingFounder(false);
    }
  };

  // =========================
  // DELETE REVIEW
  // =========================
  const handleDeleteReview = async (
    id: string
  ) => {
    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this customer review?"
      );

    if (!confirmDelete) return;

    try {
      await deleteDoc(
        doc(db, "reviews", id)
      );

      setReviews(
        (previousReviews) =>
          previousReviews.filter(
            (review) =>
              review.id !== id
          )
      );

      alert(
        "✅ Customer review deleted successfully!"
      );
    } catch (error) {
      console.error(error);
      alert(
        "❌ Error deleting customer review"
      );
    }
  };

  // =========================
  // DELETE BIKE
  // =========================
  const handleDelete = async (
    id: string,
    bikeName: string
  ) => {
    const confirmDelete =
      window.confirm(
        `Are you sure you want to delete ${bikeName}?`
      );

    if (!confirmDelete) return;

    try {
      await deleteDoc(
        doc(db, "bikes", id)
      );

      setBikes(
        (previousBikes) =>
          previousBikes.filter(
            (bike) =>
              bike.id !== id
          )
      );

      alert(
        "✅ Bike deleted successfully!"
      );
    } catch (error) {
      console.error(error);
      alert(
        "❌ Error deleting bike"
      );
    }
  };

  // =========================
  // LOGOUT
  // =========================
  const handleLogout = async () => {
    await signOut(auth);

    router.replace(
      "/admin/login"
    );
  };

  // =========================
  // AUTH LOADING
  // =========================
  if (checkingAuth) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-gray-400 text-lg">
          Checking admin login...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10">

      <div className="max-w-6xl mx-auto">

        {/* =========================
            HEADER
        ========================= */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">

          <div>

            <h1 className="text-3xl md:text-4xl font-bold">
              🏍️ BikesLand Admin
            </h1>

            <p className="text-zinc-400 mt-2">
              Manage your BikesLand inventory
            </p>

          </div>

          <button
            onClick={handleLogout}
            className="bg-zinc-800 hover:bg-zinc-700 px-5 py-3 rounded-lg font-semibold"
          >
            Logout
          </button>

        </div>

        {/* =========================
            DASHBOARD CARDS
        ========================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">

            <p className="text-zinc-400">
              Total Bikes
            </p>

            <h2 className="text-4xl font-bold mt-2">
              {bikes.length}
            </h2>

          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">

            <p className="text-zinc-400">
              Available Bikes
            </p>

            <h2 className="text-4xl font-bold mt-2 text-green-500">
              {bikes.length}
            </h2>

          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">

            <p className="text-zinc-400">
              Sold Bikes
            </p>

            <h2 className="text-4xl font-bold mt-2 text-red-500">
              0
            </h2>

          </div>

        </div>

        {/* =========================
            QUICK ACTIONS
        ========================= */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-10">

          <h2 className="text-2xl font-bold mb-6">
            Quick Actions
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            <button
              onClick={() =>
                router.push(
                  "/admin/add-bike"
                )
              }
              className="bg-red-600 hover:bg-red-700 p-4 rounded-xl font-bold text-lg"
            >
              ➕ Add New Bike
            </button>

            {/* ADD FOUNDER */}
            <button
              onClick={() =>
                setShowFounder(
                  !showFounder
                )
              }
              className="bg-yellow-600 hover:bg-yellow-700 p-4 rounded-xl font-bold text-lg"
            >
              👤 Add Founder
            </button>

            <button
              onClick={() =>
                router.push("/")
              }
              className="bg-zinc-800 hover:bg-zinc-700 p-4 rounded-xl font-bold text-lg"
            >
              🌐 View Website
            </button>

          </div>

        </div>

        {/* =========================
            FOUNDER SECTION
        ========================= */}
        {showFounder && (
          <div className="bg-zinc-900 border border-yellow-700 rounded-2xl p-6 mb-10">

            <h2 className="text-2xl font-bold mb-6 text-yellow-400">
              👤 Founder Details
            </h2>

            <div className="flex flex-col items-center">

              {/* CURRENT PHOTO */}
              {founderPhoto ? (
                <img
                  src={founderPhoto}
                  alt="Founder"
                  className="w-36 h-36 rounded-full object-cover border-2 border-yellow-500"
                />
              ) : (
                <div className="w-36 h-36 rounded-full bg-zinc-800 flex items-center justify-center text-gray-500 text-center border border-zinc-700">
                  No Founder
                  <br />
                  Photo
                </div>
              )}

              <h3 className="mt-5 text-2xl font-bold text-center">
                Kandhukuru Bhupathi Santosh
              </h3>

              <p className="text-gray-400 mt-1">
                Founder & CEO, BikesLand
              </p>

              {/* CHOOSE PHOTO */}
              <label
                htmlFor="founderPhoto"
                className="mt-6 cursor-pointer bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-bold"
              >
                📷 Choose Founder Photo
              </label>

              <input
                id="founderPhoto"
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setFounderFile(
                    e.target.files?.[0] ||
                      null
                  )
                }
                className="hidden"
              />

              {/* SELECTED FILE */}
              {founderFile && (
                <p className="mt-3 text-green-400 text-sm text-center">
                  ✅ {founderFile.name}
                  {" "}
                  selected
                </p>
              )}

              {/* UPLOAD */}
              <button
                onClick={
                  uploadFounderPhoto
                }
                disabled={
                  !founderFile ||
                  uploadingFounder
                }
                className="mt-4 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 px-6 py-3 rounded-lg font-bold"
              >
                {uploadingFounder
                  ? "Uploading..."
                  : "⬆️ Upload / Update Founder"}
              </button>

            </div>

          </div>
        )}

        {/* =========================
            BIKE INVENTORY
        ========================= */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">

          <h2 className="text-2xl font-bold mb-6">
            🏍️ Bike Inventory
          </h2>

          {loading ? (

            <p className="text-gray-400">
              Loading bikes...
            </p>

          ) : bikes.length === 0 ? (

            <p className="text-gray-400">
              No bikes found.
            </p>

          ) : (

            <div className="space-y-4">

              {bikes.map(
                (bike) => (

                  <div
                    key={bike.id}
                    className="bg-black border border-zinc-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                  >

                    <div>

                      <h3 className="text-xl font-bold">
                        {bike.bikeName}
                      </h3>

                      <p className="text-gray-400 mt-1">
                        ₹{bike.price} •{" "}
                        {bike.year} •{" "}
                        {bike.location}
                      </p>

                      {bike.kmDriven && (
                        <p className="text-gray-500 text-sm mt-1">
                          🛣️{" "}
                          {bike.kmDriven}{" "}
                          KM
                        </p>
                      )}

                    </div>

                    <button
                      onClick={() =>
                        handleDelete(
                          bike.id,
                          bike.bikeName ||
                            "this bike"
                        )
                      }
                      className="bg-red-600 hover:bg-red-700 px-5 py-3 rounded-lg font-bold"
                    >
                      🗑️ Delete
                    </button>

                  </div>

                )
              )}

            </div>

          )}

        </div>

        {/* =========================
            CUSTOMER REVIEWS
        ========================= */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mt-10">

          <h2 className="text-2xl font-bold mb-6">
            ⭐ Customer Reviews
          </h2>

          {reviews.length === 0 ? (

            <p className="text-gray-400">
              No customer reviews found.
            </p>

          ) : (

            <div className="space-y-4">

              {reviews.map(
                (review) => (

                  <div
                    key={review.id}
                    className="bg-black border border-zinc-800 rounded-xl p-5"
                  >

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                      <div>

                        <h3 className="text-xl font-bold">
                          {review.name ||
                            "Customer"}
                        </h3>

                        <p className="text-yellow-400 mt-1">
                          {"★".repeat(
                            Number(
                              review.rating
                            ) || 0
                          )}
                        </p>

                        <p className="text-gray-300 mt-3">
                          {review.comment}
                        </p>

                      </div>

                      <button
                        onClick={() =>
                          handleDeleteReview(
                            review.id
                          )
                        }
                        className="bg-red-600 hover:bg-red-700 px-5 py-3 rounded-lg font-bold"
                      >
                        🗑️ Delete Review
                      </button>

                    </div>

                  </div>

                )
              )}

            </div>

          )}

        </div>

      </div>

    </main>
  );
}