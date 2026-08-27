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
  const [description, setDescription] = useState("");

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [saving, setSaving] = useState(false);

  // =========================
  // CLOUDINARY UPLOAD
  // =========================
  const uploadToCloudinary = async (file: File) => {
    const formData = new FormData();

    formData.append("file", file);

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

    const responseText = await response.text();

    console.log("Cloudinary Status:", response.status);
    console.log("Cloudinary Response:", responseText);

    if (!response.ok) {
      throw new Error(
        `Cloudinary ${response.status}: ${responseText}`
      );
    }

    const data = JSON.parse(responseText);

    return data.secure_url as string;
  };

  // =========================
  // ADD PHOTOS
  // =========================
  const handlePhotoSelect = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newFiles = Array.from(
      e.target.files || []
    );

    if (newFiles.length === 0) {
      return;
    }

    const totalFiles =
      imageFiles.length + newFiles.length;

    if (totalFiles > 6) {
      alert(
        `Maximum 6 photos allowed.\n\nAlready selected: ${imageFiles.length}\nYou can add only ${
          6 - imageFiles.length
        } more photo${
          6 - imageFiles.length === 1 ? "" : "s"
        }.`
      );

      e.target.value = "";
      return;
    }

    setImageFiles((previousFiles) => [
      ...previousFiles,
      ...newFiles,
    ]);

    // Reset input so the same photo can be selected again if needed
    e.target.value = "";
  };

  // =========================
  // REMOVE PHOTO
  // =========================
  const removePhoto = (index: number) => {
    setImageFiles((previousFiles) =>
      previousFiles.filter(
        (_, photoIndex) => photoIndex !== index
      )
    );
  };

  // =========================
  // SAVE BIKE
  // =========================
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

      // Upload all selected photos
      for (const file of imageFiles) {
        const imageURL =
          await uploadToCloudinary(file);

        imageURLs.push(imageURL);
      }

      // =========================
      // SAVE TO FIRESTORE
      // =========================
      await addDoc(collection(db, "bikes"), {
        bikeName: bikeName,
        name: bikeName,

        price: price,
        location: location,
        year: year,
        kmDriven: kmDriven,

        // First image
        image: imageURLs[0],

        // All images
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

      const fileInput =
        document.getElementById(
          "bikePhotos"
        ) as HTMLInputElement;

      if (fileInput) {
        fileInput.value = "";
      }
    } catch (error) {
      console.error(
        "Error adding bike:",
        error
      );

      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Unknown error occurred");
      }
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

          {/* =========================
              BIKE PHOTOS
          ========================= */}
          <div>

            <label className="block mb-2 font-semibold">
              Bike Photos
            </label>

            <p className="text-gray-400 text-sm mb-3">
              Add up to 6 photos. You can add
              photos one by one.
            </p>

            {/* SELECT PHOTOS BUTTON */}
            {imageFiles.length < 6 && (
              <label
                htmlFor="bikePhotos"
                className="block w-full text-center cursor-pointer bg-red-600 hover:bg-red-700 p-3 rounded-lg font-bold"
              >
                📷{" "}
                {imageFiles.length === 0
                  ? "Choose First Photo"
                  : "➕ Add More Photos"}
              </label>
            )}

            <input
              id="bikePhotos"
              type="file"
              accept="image/*"
              multiple
              onChange={handlePhotoSelect}
              className="hidden"
            />

            {/* PHOTO COUNT */}
            {imageFiles.length > 0 && (
              <div className="mt-3 bg-gray-800 rounded-lg p-3">
                <p className="text-green-400 font-semibold">
                  ✅ {imageFiles.length} / 6 photos selected
                </p>

                {imageFiles.length < 6 && (
                  <p className="text-gray-400 text-xs mt-1">
                    You can add{" "}
                    {6 - imageFiles.length} more
                    photo
                    {6 - imageFiles.length === 1
                      ? ""
                      : "s"}.
                  </p>
                )}
              </div>
            )}

            {/* PHOTO PREVIEWS */}
            {imageFiles.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">

                {imageFiles.map(
                  (file, index) => (

                    <div
                      key={`${file.name}-${index}`}
                      className="relative bg-black rounded-lg overflow-hidden border border-gray-700"
                    >

                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Bike Photo ${index + 1}`}
                        className="w-full h-28 object-cover"
                      />

                      {/* PHOTO NUMBER */}
                      <span className="absolute top-2 left-2 bg-black/80 px-2 py-1 rounded text-xs font-bold">
                        Photo {index + 1}
                      </span>

                      {/* REMOVE BUTTON */}
                      <button
                        type="button"
                        onClick={() =>
                          removePhoto(index)
                        }
                        className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 w-7 h-7 rounded-full font-bold"
                      >
                        ×
                      </button>

                    </div>

                  )
                )}

              </div>
            )}

          </div>

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