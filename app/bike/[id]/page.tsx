"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/app/firebase";

export default function BikeDetailsPage() {
  const params = useParams();

  const [bike, setBike] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const fetchBike = async () => {
      try {
        if (!params.id) return;

        const bikeRef = doc(db, "bikes", String(params.id));
        const bikeSnap = await getDoc(bikeRef);

        if (bikeSnap.exists()) {
          setBike({
            id: bikeSnap.id,
            ...bikeSnap.data(),
          });
        } else {
          setBike(null);
        }
      } catch (error) {
        console.error("Error loading bike:", error);
        setBike(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBike();
  }, [params.id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#050505] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-zinc-700 border-t-red-500 rounded-full animate-spin mx-auto" />

          <p className="mt-5 text-zinc-400">
            Loading bike details...
          </p>
        </div>
      </main>
    );
  }

  if (!bike) {
    return (
      <main className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center px-6">
        <div className="text-center">

          <div className="text-6xl mb-5">
            🏍️
          </div>

          <h1 className="text-3xl font-bold">
            Bike Not Found
          </h1>

          <p className="text-zinc-400 mt-3">
            This bike may no longer be available.
          </p>

          <Link
            href="/"
            className="inline-flex mt-7 bg-red-600 hover:bg-red-700 px-7 py-3 rounded-xl font-bold transition"
          >
            ← Back to BikesLand
          </Link>

        </div>
      </main>
    );
  }

  // =========================
  // BIKE PHOTOS
  // =========================

  const bikeImages =
    Array.isArray(bike.images) && bike.images.length > 0
      ? bike.images
      : bike.image
        ? [bike.image]
        : ["/bikes/classic4.jpg"];

  // =========================
  // NEXT PHOTO
  // =========================

  const nextImage = () => {
    setCurrentImage((previous) =>
      previous === bikeImages.length - 1
        ? 0
        : previous + 1
    );
  };

  // =========================
  // PREVIOUS PHOTO
  // =========================

  const previousImage = () => {
    setCurrentImage((previous) =>
      previous === 0
        ? bikeImages.length - 1
        : previous - 1
    );
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white">

      {/* =========================
          TOP NAVIGATION
      ========================= */}

      <header className="sticky top-0 z-50 bg-black/85 backdrop-blur-xl border-b border-white/10">

        <div className="max-w-6xl mx-auto px-5 py-4 flex items-center justify-between">

          <Link
            href="/"
            className="text-xl md:text-2xl font-black tracking-tight"
          >
            <span className="text-red-500">
              BIKES
            </span>

            <span className="text-white">
              LAND
            </span>
          </Link>

          <Link
            href="/"
            className="text-sm md:text-base text-zinc-300 hover:text-white transition"
          >
            ← Back to Bikes
          </Link>

        </div>

      </header>

      {/* =========================
          MAIN CONTENT
      ========================= */}

      <div className="max-w-6xl mx-auto px-5 py-8 md:py-12">

        {/* =========================
            HERO SECTION
        ========================= */}

        <section className="grid lg:grid-cols-[1.35fr_0.65fr] gap-6 items-stretch">

          {/* =========================
              BIKE IMAGE SLIDER
          ========================= */}

          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-900 to-black border border-white/10 shadow-2xl">

            {/* VERIFIED BADGE */}

            <div className="absolute top-5 left-5 z-20">

              <span className="inline-flex items-center gap-2 bg-black/75 backdrop-blur-md border border-green-500/40 text-green-400 px-4 py-2 rounded-full text-sm font-semibold">
                ✓ BikesLand Verified
              </span>

            </div>

            {/* MAIN IMAGE */}

            <div className="p-4 md:p-8">

              <div className="relative h-[320px] sm:h-[430px] lg:h-[520px] flex items-center justify-center">

                <img
                  src={bikeImages[currentImage]}
                  alt={`${bike.bikeName || "Bike"} photo ${
                    currentImage + 1
                  }`}
                  className="w-full h-full object-contain rounded-2xl"
                />

                {/* LEFT BUTTON */}

                {bikeImages.length > 1 && (
                  <button
                    onClick={previousImage}
                    aria-label="Previous photo"
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/75 hover:bg-red-600 text-white text-3xl font-bold flex items-center justify-center transition"
                  >
                    ‹
                  </button>
                )}

                {/* RIGHT BUTTON */}

                {bikeImages.length > 1 && (
                  <button
                    onClick={nextImage}
                    aria-label="Next photo"
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/75 hover:bg-red-600 text-white text-3xl font-bold flex items-center justify-center transition"
                  >
                    ›
                  </button>
                )}

              </div>

              {/* PHOTO COUNT */}

              {bikeImages.length > 1 && (
                <p className="text-center text-zinc-400 text-sm mt-3">
                  Photo {currentImage + 1} of{" "}
                  {bikeImages.length}
                </p>
              )}

              {/* THUMBNAILS */}

              {bikeImages.length > 1 && (

                <div className="flex gap-3 mt-4 overflow-x-auto pb-2">

                  {bikeImages.map(
                    (image: string, index: number) => (

                      <button
                        key={`${image}-${index}`}
                        onClick={() =>
                          setCurrentImage(index)
                        }
                        aria-label={`Open photo ${
                          index + 1
                        }`}
                        className={`flex-shrink-0 rounded-xl overflow-hidden border-2 transition ${
                          currentImage === index
                            ? "border-red-500"
                            : "border-white/10 hover:border-white/40"
                        }`}
                      >

                        <img
                          src={image}
                          alt={`Bike photo ${
                            index + 1
                          }`}
                          className="w-20 h-16 object-cover"
                        />

                      </button>

                    )
                  )}

                </div>

              )}

            </div>

          </div>

          {/* =========================
              BIKE INFORMATION
          ========================= */}

          <div className="rounded-3xl bg-gradient-to-b from-zinc-900 to-zinc-950 border border-white/10 p-6 md:p-8 flex flex-col justify-between shadow-2xl">

            <div>

              <p className="text-red-500 uppercase tracking-[0.2em] text-xs font-bold">
                Premium Pre-Owned Bike
              </p>

              <h1 className="text-3xl md:text-4xl font-black mt-3 leading-tight">
                {bike.bikeName}
              </h1>

              <div className="flex items-center gap-2 mt-4 text-zinc-400">

                <span>
                  📍
                </span>

                <span>
                  {bike.location || "Nellore"}
                </span>

              </div>

              {/* PRICE */}

              <div className="mt-8">

                <p className="text-sm text-zinc-500 uppercase tracking-wider">
                  Price
                </p>

                <p className="text-4xl md:text-5xl font-black text-yellow-400 mt-1">
                  ₹{bike.price}
                </p>

              </div>

              {/* QUICK STATS */}

              <div className="grid grid-cols-2 gap-3 mt-8">

                <div className="bg-black/50 border border-white/10 rounded-2xl p-4">

                  <p className="text-xs text-zinc-500">
                    YEAR
                  </p>

                  <p className="text-lg font-bold mt-1">
                    {bike.year || "N/A"}
                  </p>

                </div>

                <div className="bg-black/50 border border-white/10 rounded-2xl p-4">

                  <p className="text-xs text-zinc-500">
                    KM DRIVEN
                  </p>

                  <p className="text-lg font-bold mt-1">
                    {bike.kmDriven
                      ? `${bike.kmDriven} KM`
                      : "N/A"}
                  </p>

                </div>

              </div>

            </div>

            {/* HERO BUTTONS */}

            <div className="mt-8 space-y-3">

              <a
                href={`https://wa.me/916301885817?text=${encodeURIComponent(
                  `Hi BikesLand, I'm interested in ${bike.bikeName}. Price: ₹${bike.price}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-400 text-black py-4 rounded-2xl font-black transition"
              >
                💬 WhatsApp Enquiry
              </a>

              <a
                href="tel:+916301885817"
                className="flex items-center justify-center gap-2 w-full bg-white hover:bg-zinc-200 text-black py-4 rounded-2xl font-black transition"
              >
                📞 Call BikesLand
              </a>

            </div>

          </div>

        </section>

        {/* =========================
            SPECIFICATIONS
        ========================= */}

        <section className="mt-10">

          <div className="flex items-end justify-between mb-5">

            <div>

              <p className="text-red-500 text-xs font-bold uppercase tracking-[0.2em]">
                Vehicle Information
              </p>

              <h2 className="text-2xl md:text-3xl font-black mt-1">
                Bike Specifications
              </h2>

            </div>

          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">

            <div className="bg-zinc-900/80 border border-white/10 rounded-2xl p-5 hover:border-red-500/40 transition">

              <p className="text-2xl">
                📅
              </p>

              <p className="text-xs text-zinc-500 mt-4">
                YEAR
              </p>

              <p className="text-lg font-bold mt-1">
                {bike.year || "Not Available"}
              </p>

            </div>

            <div className="bg-zinc-900/80 border border-white/10 rounded-2xl p-5 hover:border-red-500/40 transition">

              <p className="text-2xl">
                🛣️
              </p>

              <p className="text-xs text-zinc-500 mt-4">
                KM DRIVEN
              </p>

              <p className="text-lg font-bold mt-1">
                {bike.kmDriven
                  ? `${bike.kmDriven} KM`
                  : "Not Available"}
              </p>

            </div>

            <div className="bg-zinc-900/80 border border-white/10 rounded-2xl p-5 hover:border-red-500/40 transition">

              <p className="text-2xl">
                📍
              </p>

              <p className="text-xs text-zinc-500 mt-4">
                LOCATION
              </p>

              <p className="text-lg font-bold mt-1 capitalize">
                {bike.location || "Not Available"}
              </p>

            </div>

            <div className="bg-zinc-900/80 border border-white/10 rounded-2xl p-5 hover:border-red-500/40 transition">

              <p className="text-2xl">
                🆔
              </p>

              <p className="text-xs text-zinc-500 mt-4">
                BIKE ID
              </p>

              <p className="text-sm font-bold mt-1 break-all text-zinc-300">
                {bike.id}
              </p>

            </div>

          </div>

        </section>

        {/* =========================
            BIKESLAND PROMISE
        ========================= */}

        <section className="mt-10">

          <div className="rounded-3xl overflow-hidden border border-red-500/20 bg-gradient-to-br from-red-950/30 via-zinc-950 to-black">

            <div className="p-6 md:p-8">

              <div className="flex items-center gap-4">

                <div className="w-12 h-12 rounded-2xl bg-red-600/15 border border-red-500/20 flex items-center justify-center text-2xl">
                  🛡️
                </div>

                <div>

                  <p className="text-xs text-red-500 uppercase tracking-[0.2em] font-bold">
                    Our Commitment
                  </p>

                  <h2 className="text-2xl font-black mt-1">
                    BikesLand Promise
                  </h2>

                </div>

              </div>

              <div className="grid md:grid-cols-2 gap-3 mt-7">

                {[
                  "Verified Bike Details",
                  "Document Verification Assistance",
                  "RC Name Transfer Assistance",
                  "Honest & Transparent Pricing",
                  "Quality Inspection by BikesLand",
                  "Dedicated Customer Support",
                ].map((item) => (

                  <div
                    key={item}
                    className="flex items-center gap-3 bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3"
                  >

                    <span className="text-green-400">
                      ✓
                    </span>

                    <span className="text-zinc-300 text-sm">
                      {item}
                    </span>

                  </div>

                ))}

              </div>

            </div>

          </div>

        </section>

        {/* =========================
            DESCRIPTION
        ========================= */}

        <section className="mt-10">

          <p className="text-red-500 text-xs font-bold uppercase tracking-[0.2em]">
            About This Bike
          </p>

          <h2 className="text-2xl md:text-3xl font-black mt-2">
            Description
          </h2>

          <div className="mt-5 bg-zinc-900/70 border border-white/10 rounded-3xl p-6 md:p-8">

            <p className="text-zinc-300 leading-8">
              {bike.description ||
                "This bike has been listed by BikesLand. Contact BikesLand for more information, inspection and purchase assistance."}
            </p>

          </div>

        </section>

        {/* =========================
            FINAL CTA
        ========================= */}

        <section className="mt-10 pb-12">

          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-red-700 via-red-600 to-red-700 p-7 md:p-10 text-center">

            <div className="relative z-10">

              <p className="text-red-100 text-sm font-semibold uppercase tracking-wider">
                Interested in this bike?
              </p>

              <h2 className="text-2xl md:text-4xl font-black mt-2">
                Make Your Next Ride Special.
              </h2>

              <p className="text-red-100 mt-3">
                Contact BikesLand today for inspection and purchase assistance.
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-3 mt-7">

                <a
                  href="tel:+916301885817"
                  className="bg-white text-black hover:bg-zinc-100 px-7 py-3.5 rounded-xl font-black transition"
                >
                  📞 Call Now
                </a>

                <a
                  href={`https://wa.me/916301885817?text=${encodeURIComponent(
                    `Hi BikesLand, I'm interested in ${bike.bikeName}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-black text-white hover:bg-zinc-900 px-7 py-3.5 rounded-xl font-black transition"
                >
                  💬 WhatsApp
                </a>

              </div>

            </div>

          </div>

        </section>

      </div>

      {/* =========================
          FOOTER
      ========================= */}

      <footer className="border-t border-white/10 py-7 text-center text-zinc-500 text-sm">
        🏍️ BikesLand — Trusted Second-Hand Bikes Marketplace
      </footer>

    </main>
  );
}