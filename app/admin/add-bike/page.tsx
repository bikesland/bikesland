"use client";

import { useState } from "react";
import { db } from "../../firebase";
import { collection, addDoc } from "firebase/firestore";

export default function AddBikePage() {
  const [bikeName, setBikeName] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [year, setYear] = useState("");
  const [kmDriven, setKmDriven] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!bikeName || !price || !location || !year || !kmDriven) {
      alert("⚠️ Please fill all required fields");
      return;
    }

    try {
      setSaving(true);

      await addDoc(collection(db, "bikes"), {
        bikeName,
        price,
        location,
        year,
        kmDriven,
        image,
        description,
        createdAt: new Date(),
      });

      alert("✅ Bike Added Successfully!");

      setBikeName("");
      setPrice("");
      setLocation("");
      setYear("");
      setKmDriven("");
      setImage("");
      setDescription("");
    } catch (error) {
      console.error(error);
      alert("❌ Error adding bike");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white p-6">

      <div className="max-w-xl mx-auto bg-gray-900 p-6 rounded-xl shadow-lg">

        <h1 className="text-3xl font-bold text-center mb-6">
          ➕ Add Bike
        </h1>

        <div className="space-y-4">

          {/* Bike Name */}
          <input
            type="text"
            placeholder="Bike Name"
            value={bikeName}
            onChange={(e) => setBikeName(e.target.value)}
            className="w-full p-3 rounded bg-gray-800 border border-gray-700"
          />

          {/* Price */}
          <input
            type="text"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full p-3 rounded bg-gray-800 border border-gray-700"
          />

          {/* Location */}
          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full p-3 rounded bg-gray-800 border border-gray-700"
          />

          {/* Year */}
          <input
            type="number"
            placeholder="Year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="w-full p-3 rounded bg-gray-800 border border-gray-700"
          />

          {/* KM Driven */}
          <input
            type="number"
            placeholder="KM Driven"
            value={kmDriven}
            onChange={(e) => setKmDriven(e.target.value)}
            className="w-full p-3 rounded bg-gray-800 border border-gray-700"
          />

          {/* Image Path */}
          <input
            type="text"
            placeholder="Image Path (example: /bikes/activa.jpg)"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            className="w-full p-3 rounded bg-gray-800 border border-gray-700"
          />

          {/* Description */}
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            className="w-full p-3 rounded bg-gray-800 border border-gray-700"
          />

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-600 p-3 rounded-lg font-bold"
          >
            {saving ? "Saving..." : "Save Bike"}
          </button>

        </div>
      </div>

    </main>
  );
}