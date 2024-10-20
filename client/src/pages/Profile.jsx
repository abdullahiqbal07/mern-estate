import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import {
  updateStart,
  updateSuccess,
  updateFailure,
  deleteStart,
  deleteSuccess,
  deleteFailure,
  signOutStart,
  signOutSuccess,
  signOutFailure,
  tokenExpired,
} from "../redux/user/UserSlice";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { Link } from "react-router-dom";
import ConfirmationModal from "../components/ConfirmationModal";

export default function Profile() {
  const createRef = useRef(null);
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.currentUser);
  const { error, loading } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [progressPer, setProgressPer] = useState(0);
  const [errors, setError] = useState(false);
  const [formData, setFormData] = useState({});
  const [success, setSuccess] = useState(false);
  const [listings, setListings] = useState([]);
  const [showListings, setShowListings] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [showListingsError, setShowListingsError] = useState(false);
  console.log(currentUser.avatar);

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadImage = uploadBytesResumable(storageRef, file);

    uploadImage.on(
      "state_change",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgressPer(Math.round(progress));
      },
      (err) => {
        setError(true);
      },
      () => {
        getDownloadURL(uploadImage.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, avatar: downloadURL });
          // setFormData((prev) => [{...prev, avatar: downloadURL }])
        });
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    console.log(formData);
  };

  const handleClick = async (e) => {
    e.preventDefault();
    dispatch(updateStart());
    try {
      const response = await fetch(`/api/user/updateuser/${currentUser._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.status === 401) {
        // Token expired, dispatch action and handle redirection
        dispatch(tokenExpired());
        return; // Stop further execution
      }

      const data = await response.json();
      if (data.success === false) {
        console.log("you are getting error", data.message);
        dispatch(updateFailure(data.message));
        setTimeout(() => {
          dispatch(updateFailure(""));
        }, 3000);
        return;
      }

      dispatch(updateSuccess(data));
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (error) {
      dispatch(updateFailure(error.message));
      setTimeout(() => {
        dispatch(updateFailure(""));
      }, 3000);
    }
  };

  const handleDelete = async () => {
    setIsModalOpen(true); // Open the confirmation modal
  };

  const confirmDelete  = async () => {
    setIsModalOpen(false); // Close the modal after confirmation
    try {
      dispatch(deleteStart());

      const response = await fetch(`/api/user/deleteuser/${currentUser._id}`, {
        method: "DELETE",
      });

      if (response.status === 401) {
        // Token expired, dispatch action and handle redirection
        dispatch(tokenExpired());
        return; // Stop further execution
      }

      const data = await response.json();
      if (data.success === false) {
        dispatch(deleteFailure(data.message));
        return;
      }
      dispatch(deleteSuccess());
    } catch (error) {
      dispatch(deleteFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutStart());
      const response = await fetch("/api/auth/signout");
      const data = await response.json();
      if (data.success === false) {
        dispatch(signOutFailure(data.message));
        return;
      }
      dispatch(signOutSuccess());
    } catch (error) {
      dispatch(signOutFailure(error.message));
    }
  };

  const handleListings = async (e) => {
    e.preventDefault();
    if (showListings) {
      // Hide listings if they are currently visible
      setShowListings(false);
    } else {
      if (listings.length > 0) {
        setShowListings(true);
        return;
      }
      try {
        const response = await fetch(`/api/user/listings/${currentUser._id}`);

        if (response.status === 401) {
          // Token expired, dispatch action and handle redirection
          dispatch(tokenExpired());
          return; // Stop further execution
        }

        const data = await response.json();
        if (data.success === false) {
          console.log("Error: ");
          setShowListingsError(true);
          return;
        }
        setListings(data);
        setError(false);
        setShowListings(true);
        setShowListingsError(false);
      } catch (error) {
        setError(true);
      }
    }
  };

  const handleDeleteListing = async (listingId) => {
    try {
      const response = await fetch(`/api/listing/delete/${listingId}`, {
        method: "DELETE",
      });

      if (response.status === 401) {
        // Token expired, dispatch action and handle redirection
        dispatch(tokenExpired());
        return; // Stop further execution
      }

      const data = response.json();
      if (data.success === false) {
        setError(true);
        return;
      }
      setListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
      setError(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-3 mx-auto max-w-lg">
      <h1 className="text-3xl font-semibold my-7 text-center">Profile</h1>
      <form onSubmit={handleClick} className="flex flex-col gap-4">
        <input
          type="file"
          hidden
          accept="image/*"
          ref={createRef}
          onChange={(e) => {
            setFile(e.target.files[0]);
          }}
        />

        <img
          src={formData?.avatar || currentUser?.avatar}
          alt="profilePic"
          className="rounded-full h-24 w-24 mt-2 object-cover cursor-pointer self-center"
          onClick={() => createRef.current.click()}
        />

        <p className="self-center">
          {errors ? (
            <span className="text-red-700">
              Error Image Upload. Size should less than 2mb
            </span>
          ) : progressPer > 0 && progressPer < 100 ? (
            <span className="text-slate-700">{`uploading ${progressPer}%`}</span>
          ) : progressPer === 100 ? (
            <span className="text-green-700">image uploaded successfully</span>
          ) : (
            " "
          )}
        </p>

        <input
          className="p-3 border rounded-lg"
          placeholder="username"
          type="username"
          id="username"
          name="username"
          required
          onChange={handleChange}
          defaultValue={currentUser.username}
        />

        <input
          className="p-3 border rounded-lg"
          placeholder="email"
          type="email"
          id="email"
          name="email"
          required
          onChange={handleChange}
          defaultValue={currentUser.email}
        />

        <input
          className="p-3 border rounded-lg"
          placeholder="password"
          type="password"
          id="password"
          name="password"
          onChange={handleChange}
        />

        <button
          className="bg-slate-700 text-white py-3 rounded transition duration-200 hover:opacity-95 uppercase disabled:opacity-95"
          type="submit"
          disabled={loading}
        >
          {loading ? "Loading..." : "Update"}
        </button>
        <Link
          to="/create-listing"
          className="bg-green-700 text-white py-3 rounded w-full text-center transition duration-200 hover:opacity-95 uppercase disabled:opacity-95"
        >
          create Listing
        </Link>
      </form>
      <div className="flex justify-between mt-5">
        <span onClick={handleDelete} className="text-red-600 cursor-pointer">
          Delete Account
        </span>
        {/* Confirmation Modal */}
        <ConfirmationModal
            isOpen={isModalOpen}
            onConfirm={confirmDelete}
            onCancel={() => setIsModalOpen(false)}
          />
        <span onClick={handleSignOut} className="text-red-600 cursor-pointer">
          Sign Out
        </span>
      </div>
      <p>{error ? <span className="text-red-700">{error}</span> : " "}</p>
      <p>
        {success ? (
          <span className="text-green-700">
            Successfully updated your account
          </span>
        ) : (
          " "
        )}
      </p>
      <button
        onClick={handleListings}
        className="text-green-700 uppercase w-full my-3"
      >
        {showListings ? "Hide Listings" : "Show Listings"}
      </button>
      {showListingsError && "No list is added currently"}
      {showListings && listings && listings.length > 0 && (
        <div className="flex flex-col gap-2 mt-7">
          <h1 className="text-2xl font-semibold text-center my-3">
            Your Listings
          </h1>
          {listings.map((listing) => {
            return (
              <div
                key={listing._id}
                className="flex justify-between shadow-md items-center border rounded-lg p-2 gap-2 "
              >
                <Link to={`/listing/${listing._id}`}>
                  <img
                    className="w-16 h-16 object-contain"
                    src={listing.imageUrls[0]}
                    alt={listing.name}
                  />
                </Link>
                <Link
                  className="font-semibold hover:underline truncate flex-1"
                  to={`/listing/${listing._id}`}
                >
                  <p>{listing.name}</p>
                </Link>

                <div className="flex flex-col">
                  <button
                    onClick={() => handleDeleteListing(listing._id)}
                    className="text-red-700 uppercase "
                  >
                    Delete
                  </button>
                  <Link to={`/update/${listing._id}`}>
                    <button className="text-green-700 uppercase ">Edit</button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
