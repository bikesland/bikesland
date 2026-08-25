"use client";

import { useState } from "react";
import { db, storage } from "../../firebase";
import { collection, addDoc } from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

export default function AddBikePage() {
  const [bikeName, setBikeName] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [year, setYear] = useState("");
  const [kmDriven, setKmDriven] = useState("");
  const [description, setDescription] = useState("");

  // MULTIPLE PHOTOS
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (
      !bikeName ||
      !price ||
      !location ||
      !year ||
      !kmDriven
    ) {
      alert("Please fill all required fields");
      return;
    }

    if (imageFiles.length === 0) {
      alert("Please select at least 1 bike photo");
      return;
    }

    if (imageFiles.length > 6) {
      alert("Please select maximum 6 photos");
      return;
    }

    try {
      setSaving(true);

      const imageURLs: string[] = [];

      // UPLOAD ALL PHOTOS
      for (const file of imageFiles) {
        const imageRef = ref(
          storage,
          `bikes/${Date.now()}-${file.name}`
        );

        await uploadBytes(imageRef, file);

        const downloadURL =
          await getDownloadURL(imageRef);

        imageURLs.push(downloadURL);
      }

      // FIRESTORE
      await addDoc(collection(db, "bikes"), {
        bikeName: bikeName,
        name: bikeName,

        price: price,
        location: location,
        year: year,
        kmDriven: kmDriven,

        // OLD SINGLE IMAGE SUPPORT
        image: imageURLs[0],

        // NEW MULTIPLE IMAGES
        images: imageURLs,

        description: description,

        createdAt: new Date(),
      });

      alert(
        `Bike Added Successfully!\n${imageURLs.length} photos uploaded.`
      );

      // RESET
      setBikeName("");
      setPrice("");
      setLocation("");
      setYear("");
      setKmDriven("");
      setDescription("");
      setImageFiles([]);

      // Reset file input
      const fileInput =
        document.getElementById(
          "bikePhotos"
        ) as HTMLInputElement;

      if (fileInput) {
        fileInput.value = "";
      }

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

          {/* BIKE NAME */}
          <input
            type="text"
            placeholder="Bike Name"
            value={bikeName}
            onChange={(e) =>
              setBikeName(e.target.value)
            }
            className="w-full p-3 rounded bg-gray-800 border border-gray-700"
          />

          {/* PRICE */}
          <input
            type="text"
            placeholder="Price"
            value={price}
            onChange={(e) =>
              setPrice(e.target.value)
            }
            className="w-full p-3 rounded bg-gray-800 border border-gray-700"
          />

          {/* LOCATION */}
          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) =>
              setLocation(e.target.value)
            }
            className="w-full p-3 rounded bg-gray-800 border border-gray-700"
          />

          {/* YEAR */}
          <input
            type="number"
            placeholder="Year"
            value={year}
            onChange={(e) =>
              setYear(e.target.value)
            }
            className="w-full p-3 rounded bg-gray-800 border border-gray-700"
          />

          {/* KM */}
          <input
            type="number"
            placeholder="KM Driven"
            value={kmDriven}
            onChange={(e) =>
              setKmDriven(e.target.value)
            }
            className="w-full p-3 rounded bg-gray-800 border border-gray-700"
          />

          {/* MULTIPLE PHOTOS */}
          <div>
            <label className="block mb-2 font-semibold">
              Bike Photos (Maximum 6)
            </label>

            <input
              id="bikePhotos"
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => {
                const files = Array.from(
                  e.target.files || []
                );

                if (files.length > 6) {
                  alert(
                    "Please select maximum 6 photos"
                  );

                  e.target.value = "";
                  setImageFiles([]);
                  return;
                }

                setImageFiles(files);
              }}
              className="w-full p-3 rounded bg-gray-800 border border-gray-700"
            />

            {/* SELECTED PHOTO COUNT */}
            {imageFiles.length > 0 && (
              <p className="text-green-400 mt-2 text-sm">
                ✅ {imageFiles.length} photo
                {imageFiles.length > 1 ? "s" : ""} selected
              </p>
            )}
          </div>

          {/* PHOTO PREVIEW */}
          {imageFiles.length > 0 && (
            <div className="grid grid-cols-3 gap-3">

              {imageFiles.map(
                (file, index) => (
                  <div
                    key={`${file.name}-${index}`}
                    className="relative"
                  >
                    <img
                      src={URL.createObjectURL(
                        file
                      )}
                      alt={`Bike ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg border border-gray-700"
                    />

                    <span className="absolute bottom-1 left-1 bg-black/70 px-2 py-1 rounded text-xs">
                      {index + 1}
                    </span>
                  </div>
                )
              )}

            </div>
          )}

          {/* DESCRIPTION */}
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
            rows={5}
            className="w-full p-3 rounded bg-gray-800 border border-gray-700"
          />

          {/* SAVE */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-600 p-3 rounded-lg font-bold"
          >
            {saving
              ? `Uploading ${imageFiles.length} photos...`
              : "Save Bike"}
          </button>

        </div>
      </div>
    </main>
  );
}