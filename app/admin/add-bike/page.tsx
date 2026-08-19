"use client";

import { useState } from "react";
import { db, storage } from "../../firebase";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function AddBikePage() {
  const [bikeName, setBikeName] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [year, setYear] = useState("");
  const [kmDriven, setKmDriven] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!bikeName || !price || !location || !year || !kmDriven) {
      alert("Please fill all required fields");
      return;
    }

    try {
      setSaving(true);

      let imageURL = "";

      if (imageFile) {
        const imageRef = ref(
          storage,
          "bikes/" + Date.now() + "-" + imageFile.name
        );

        await uploadBytes(imageRef, imageFile);

        imageURL = await getDownloadURL(imageRef);
      }

      await addDoc(collection(db, "bikes"), {
        bikeName: bikeName,
        price: price,
        location: location,
        year: year,
        kmDriven: kmDriven,
        image: imageURL,
        description: description,
        createdAt: new Date(),
      });

      alert("Bike Added Successfully!");

      setBikeName("");
      setPrice("");
      setLocation("");
      setYear("");
      setKmDriven("");
      setDescription("");
      setImageFile(null);

    } catch (error) {
      console.error(error);
      alert("Error adding bike");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white p-6">
      <div className="max-w-xl mx-auto bg-gray-900 p-6 rounded-xl">

        <h1 className="text-3xl font-bold text-center mb-6">
          Add Bike
        </h1>

        <div className="space-y-4">

          <input
            type="text"
            placeholder="Bike Name"
            value={bikeName}
            onChange={(e) => setBikeName(e.target.value)}
            className="w-full p-3 rounded bg-gray-800 border border-gray-700"
          />

          <input
            type="text"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full p-3 rounded bg-gray-800 border border-gray-700"
          />

          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full p-3 rounded bg-gray-800 border border-gray-700"
          />

          <input
            type="number"
            placeholder="Year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="w-full p-3 rounded bg-gray-800 border border-gray-700"
          />

          <input
            type="number"
            placeholder="KM Driven"
            value={kmDriven}
            onChange={(e) => setKmDriven(e.target.value)}
            className="w-full p-3 rounded bg-gray-800 border border-gray-700"
          />

          <div>
            <label className="block mb-2 font-semibold">
              Bike Photo
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                setImageFile(file);
              }}
              className="w-full p-3 rounded bg-gray-800 border border-gray-700"
            />
          </div>

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            className="w-full p-3 rounded bg-gray-800 border border-gray-700"
          />

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-red-600 hover:bg-red-700 p-3 rounded-lg font-bold"
          >
            {saving ? "Uploading..." : "Save Bike"}
          </button>

        </div>
      </div>
    </main>
  );
}