import React, { useEffect, useState } from "react";
import { app } from "../firebase";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

export default function UpdateListing() {
  const [file, setFile] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "",
    parking: false,
    furnished: false,
    offer: false,
    regularPrice: 50,
    discountPrice: 0,
    bathrooms: 1,
    bedrooms: 1,
  });
  const [uploadError, setUploadError] = useState("");
  const [error, setError] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const currentUser = useSelector((state) => state.user.currentUser);
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { listingId } = useParams();
  console.log(formData);

  useEffect(() => {
    const fetchList = async () => {
      try {
        const response = await fetch(`/api/listing/get/${listingId}`);
        const data = await response.json();
        if (data.success === false) {
          console.log(data.message);
          setApiError(data.message);
          return;
        }
        setFormData(data);
        setApiError("");
      } catch (error) {
        setApiError(error);
        console.log(error);
      }
    };

    fetchList();
  }, []);

  const handleUpload = () => {
    if (file.length > 0 && file.length + formData.imageUrls.length < 7) {
      setUploadSuccess(true);
      const promises = [];
      for (let i = 0; i < file.length; i++) {
        promises.push(storeImage(file[i]));
      }
      console.log(promises);
      Promise.all(promises)
        .then((url) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(url),
          });
          setError(false);
          setUploadSuccess(false);
          setUploadError("");
        })
        .catch((error) => {
          setError(true);
          setUploadSuccess(false);
          setUploadError("Image size should be less than 2mb");
        });
    } else {
      setError(true);
      setUploadSuccess(false);
      setUploadError("upload images should be less than 6");
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadImage = uploadBytesResumable(storageRef, file);
      console.log(":");
      uploadImage.on(
        "state_change",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("here we upload");
          console.log(progress);
        },
        (err) => {
          reject(err);
        },
        () => {
          getDownloadURL(uploadImage.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleDelete = (index) => {
    setFormData((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((url, i) => i !== index), // use 'prev' here to access the previous state correctly
    }));
  };

  const handleChange = (event) => {
    if (event.target.id === "sell" || event.target.id === "rent") {
      setFormData({ ...formData, type: event.target.id });
    }

    if (
      event.target.id === "parking" ||
      event.target.id === "furnished" ||
      event.target.id === "offer"
    ) {
      setFormData({ ...formData, [event.target.id]: event.target.checked });
    }

    if (event.target.type === "number") {
      setFormData({ ...formData, [event.target.id]: event.target.value });
    }

    if (
      event.target.id === "name" ||
      event.target.id === "description" ||
      event.target.id === "address"
    ) {
      setFormData({ ...formData, [event.target.id]: event.target.value });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (+formData.regularPrice < +formData.discountPrice) {
        return setApiError(
          "discountPrice should be less than " + formData.regularPrice
        );
      }
      if (formData.imageUrls.length < 1) {
        return setApiError("you should have at least one image");
      }
      setLoading(true);
      const response = await fetch(`/api/listing/update/${listingId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });
      const data = await response.json();
      console.log(data);
      setLoading(false);
      if (data.success === false) {
        console.log("you are getting error", data.message);
        setApiError(data.message);
        return;
      }
      setApiError("");
      navigate(`/listing/${data._id}`);
    } catch (error) {
      setLoading(false);
      setApiError("");
    }
  };

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Update Listing
      </h1>
      <form
        action=""
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Name"
            id="name"
            maxLength="62"
            minLength="10"
            className="rounded-lg border p-3"
            required
            onChange={handleChange}
            value={formData.name}
          />
          <textarea
            type="text"
            placeholder="Description"
            id="description"
            className="rounded-lg border p-3"
            required
            onChange={handleChange}
            value={formData.description}
          />
          <input
            type="text"
            placeholder="Address"
            id="address"
            className="rounded-lg border p-3"
            required
            onChange={handleChange}
            value={formData.address}
          />

          <div className="flex flex-wrap gap-4">
            <div className="flex gap-2 ">
              <input
                type="checkbox"
                id="sell"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === "sell"}
              />
              <label htmlFor="sell">Sell</label>
            </div>
            <div className="flex gap-2 ">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === "rent"}
              />
              <label htmlFor="rent">Rent</label>
            </div>
            <div className="flex gap-2 ">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                onChange={handleChange}
                checked={formData.parking}
              />
              <label htmlFor="parking">Parking spot</label>
            </div>
            <div className="flex gap-2 ">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={handleChange}
                checked={formData.furnished}
              />
              <label htmlFor="furnished">Furnished</label>
            </div>
            <div className="flex gap-2 ">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={handleChange}
                checked={formData.offer}
              />
              <label htmlFor="offer">Offer</label>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <input
                type="number"
                id="bedrooms"
                className="rounded-lg border-gray-300 p-3"
                min="1"
                max="10"
                required
                onChange={handleChange}
                value={formData.bedrooms}
              />
              <p>Beds</p>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="number"
                id="bathrooms"
                className="rounded-lg border-gray-300 p-3"
                min="1"
                max="10"
                required
                onChange={handleChange}
                value={formData.bathrooms}
              />
              <p>Baths</p>
            </div>
            <div className="flex items-center gap-4">
              <input
                type="number"
                id="regularPrice"
                className="rounded-lg border-gray-300 p-3"
                required
                onChange={handleChange}
                value={formData.regularPrice}
              />
              <p className="flex flex-col items-center">
                Regular Price{" "}
                <span className=" text-sm" hidden={formData.type === "sell"}>
                  ($/month)
                </span>
              </p>
            </div>
            {formData.offer && (
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  id="discountPrice"
                  className="rounded-lg border-gray-300 p-3"
                  required
                  onChange={handleChange}
                  value={formData.discountPrice}
                />
                <p className="flex flex-col items-center">
                  Discount Price{" "}
                  <span className=" text-sm" hidden={formData.type === "sell"}>
                    ($/month)
                  </span>
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-4 flex-1">
          <p className="font-semibold">
            Images:{" "}
            <span className="font-normal text-grey-600">
              the first image will be the cover (max-6)
            </span>
          </p>
          <div className="flex flex-row gap-3">
            <input
              type="file"
              id="images"
              accept="image/*"
              multiple
              className="p-3 border border-gray-300 rounded w-full "
              onChange={(e) => setFile(e.target.files)}
            />
            <button
              className="text-green-700 uppercase p-3 border border-green-700 rounded-lg hover:shadow-lg disabled:opacity-95"
              type="button"
              onClick={() => handleUpload()}
              disabled={uploadSuccess}
            >
              {uploadSuccess ? "uploading..." : "upload"}
            </button>
          </div>
          <p>{error && <span className="text-red-700">{uploadError}</span>}</p>
          {formData.imageUrls?.length > 0 &&
            formData.imageUrls.map((image, index) => {
              return (
                <div
                  key={image}
                  className="flex justify-between border items-center p-2 shadow-md "
                >
                  <img
                    src={image}
                    alt={image}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => handleDelete(index)}
                    className="text-red-700 uppercase p-3 hover:opacity-95"
                  >
                    Delete
                  </button>
                </div>
              );
            })}
          <button
            disabled={loading || uploadSuccess}
            type="submit"
            className="bg-slate-700 text-white py-3 rounded-lg transition duration-200 hover:opacity-95 uppercase disabled:opacity-95 my-2"
          >
            {loading ? "Updating" : "Update Listing"}
          </button>
          <p>{apiError && <span className="text-red-700">{apiError}</span>}</p>
        </div>
      </form>
    </main>
  );
}
