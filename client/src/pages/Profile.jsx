import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage"
import { app } from "../firebase";

export default function Profile() {
  const createRef = useRef(null);
  const curentUser = useSelector((state) => state.user.currentUser);
  const [file, setFile] = useState(undefined); 
  const [progressPer, setProgressPer] = useState(0);
  const [error, setError] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if(file){
      handleFileUpload(file);
    }
  },[file])
  
  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadImage = uploadBytesResumable(storageRef, file);
    
    uploadImage.on('state_change', 
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100 ;
        setProgressPer(Math.round(progress))
      },
      (err) => {
        setError(true);
      },
      () => {
        getDownloadURL(uploadImage.snapshot.ref).then((downloadURL) => {
          setFormData({...formData, avatar: downloadURL})
          // setFormData((prev) => [{...prev, avatar: downloadURL }])
        });
      }
    )

   
  }

  return (
    <div className="p-3 mx-auto max-w-lg">
      <h1 className="text-3xl font-semibold my-7 text-center">Profile</h1>
      <form className="flex flex-col  gap-4">
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
          src={formData?.avatar || curentUser.avatar}
          alt="profilePic"
          className="rounded-full h-24 w-24 mt-2 object-cover cursor-pointer self-center"
          onClick={() => createRef.current.click()}
        />

          <p className="self-center">
            {
              error ? 
              (<span className="text-red-700">Error Image Upload. Size should less than 2mb</span>) 
              : progressPer > 0 && progressPer < 100  
              ? (<span className="text-slate-700">{`uploading ${progressPer}%`}</span>) 
              : progressPer === 100  
              ? (<span className="text-green-700">image uploaded successfully</span>) 
              : " "
            }
          </p>

        <input
          className="p-3 border rounded-lg"
          placeholder="username"
          type="username"
          id="username"
          name="username"
          required
        />

        <input
          className="p-3 border rounded-lg"
          placeholder="email"
          type="email"
          id="email"
          name="email"
          required
        />

        <input
          className="p-3 border rounded-lg"
          placeholder="password"
          type="password"
          id="password"
          name="password"
          required
        />

        <button
          className="bg-slate-700 text-white py-3 rounded transition duration-200 hover:opacity-95 uppercase disabled:opacity-95"
          type="submit"
        >
          Update
        </button>
      </form>
      <div className="flex justify-between mt-5">
        <span className="text-red-600 cursor-pointer">Delete Account</span>
        <span className="text-red-600 cursor-pointer">Sign Out</span>
      </div>
    </div>
  );
}
