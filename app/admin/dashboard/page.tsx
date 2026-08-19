"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { db, auth } from "@/app/firebase";

export default function DashboardPage() {
  const router = useRouter();

  const [bikes, setBikes] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace("/admin/login");
        return;
      }

      setCheckingAuth(false);
    });

    return () => unsubscribe();
  }, [router]);

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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchBikes();
        fetchReviews();
      }
    });

    return () => unsubscribe();
  }, []);
const handleDeleteReview = async (id: string) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this customer review?"
  );

  if (!confirmDelete) return;

  try {
    await deleteDoc(doc(db, "reviews", id));

    setReviews((previousReviews) =>
      previousReviews.filter((review) => review.id !== id)
    );

    alert("✅ Customer review deleted successfully!");
  } catch (error) {
    console.error(error);
    alert("❌ Error deleting customer review");
  }
};
  const handleDelete = async (id: string, bikeName: string) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${bikeName}?`
    );

    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "bikes", id));

      setBikes((previousBikes) =>
        previousBikes.filter((bike) => bike.id !== id)
      );

      alert("✅ Bike deleted successfully!");
    } catch (error) {
      console.error(error);
      alert("❌ Error deleting bike");
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.replace("/admin/login");
  };

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

        {/* Header */}
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

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <p className="text-zinc-400">Total Bikes</p>
            <h2 className="text-4xl font-bold mt-2">
              {bikes.length}
            </h2>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <p className="text-zinc-400">Available Bikes</p>
            <h2 className="text-4xl font-bold mt-2 text-green-500">
              {bikes.length}
            </h2>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <p className="text-zinc-400">Sold Bikes</p>
            <h2 className="text-4xl font-bold mt-2 text-red-500">
              0
            </h2>
          </div>

        </div>

        {/* Quick Actions */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-10">

          <h2 className="text-2xl font-bold mb-6">
            Quick Actions
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <button
              onClick={() => router.push("/admin/add-bike")}
              className="bg-red-600 hover:bg-red-700 p-4 rounded-xl font-bold text-lg"
            >
              ➕ Add New Bike
            </button>

            <button
              onClick={() => router.push("/")}
              className="bg-zinc-800 hover:bg-zinc-700 p-4 rounded-xl font-bold text-lg"
            >
              🌐 View Website
            </button>

          </div>

        </div>

        {/* Bike Inventory */}
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

              {bikes.map((bike) => (

                <div
                  key={bike.id}
                  className="bg-black border border-zinc-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                >

                  <div>
                    <h3 className="text-xl font-bold">
                      {bike.bikeName}
                    </h3>

                    <p className="text-gray-400 mt-1">
                      ₹{bike.price} • {bike.year} • {bike.location}
                    </p>

                    {bike.kmDriven && (
                      <p className="text-gray-500 text-sm mt-1">
                        🛣️ {bike.kmDriven} KM
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() =>
                      handleDelete(
                        bike.id,
                        bike.bikeName || "this bike"
                      )
                    }
                    className="bg-red-600 hover:bg-red-700 px-5 py-3 rounded-lg font-bold"
                  >
                    🗑️ Delete
                  </button>

                </div>

              ))}

            </div>
          )}

      

        </div>{/* Customer Reviews */}
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

              {reviews.map((review) => (

                <div
                  key={review.id}
                  className="bg-black border border-zinc-800 rounded-xl p-5"
                >

                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                    <div>

                      <h3 className="text-xl font-bold">
                        {review.name || "Customer"}
                      </h3>

                      <p className="text-yellow-400 mt-1">
                        {"★".repeat(Number(review.rating) || 0)}
                      </p>

                      <p className="text-gray-300 mt-3">
                        {review.comment}
                      </p>

                    </div>

                    <button
                      onClick={() => handleDeleteReview(review.id)}
                      className="bg-red-600 hover:bg-red-700 px-5 py-3 rounded-lg font-bold"
                    >
                      🗑️ Delete Review
                    </button>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>
      </div>
    </main>
  );
}