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
} from "../redux/user/UserSlice";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";

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
  console.log(formData);

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
    console.log(formData);
    try {
      const response = await fetch(`/api/user/updateuser/${currentUser._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log(data);
      if (data.success === false) {
        console.log("you are getting error", data.message);
        dispatch(updateFailure(data.message));
        return;
      }

      dispatch(updateSuccess(data));
      setSuccess(true);
    } catch (error) {
      dispatch(updateFailure(error.message));
    }
  };

  const handleDelete = async() => {
    try {
      dispatch(deleteStart())

      const response = await fetch(`/api/user/deleteuser/${currentUser._id}`,{
        method: 'DELETE'
      })

      const data = await response.json();
      if(data.success === false) {
        dispatch(deleteFailure(data.message));
        return;  
      }
      dispatch(deleteSuccess());

    } catch (error) {
      dispatch(deleteFailure(error.message));
    }
  }

  const handleSignOut = async() => {
    try {
      dispatch(signOutStart());
      const response = await fetch("/api/auth/signout");
      const data = await response.json();
      if(data.success === false) {
        dispatch(signOutFailure(data.message));
        return;  
      }
      dispatch(signOutSuccess());
    } catch (error) {
      dispatch(signOutFailure(error.message));
    }
  }

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
          src={formData?.avatar || currentUser.avatar}
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
      </form>
      <div className="flex justify-between mt-5">
        <span onClick={handleDelete} className="text-red-600 cursor-pointer">Delete Account</span>
        <span onClick={handleSignOut} className="text-red-600 cursor-pointer">Sign Out</span>
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
    </div>
  );
}
