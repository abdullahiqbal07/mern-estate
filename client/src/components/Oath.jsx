/* eslint-disable no-unused-vars */
// eslint-disable-next-line no-unused-vars
import React from "react";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/UserSlice";
import { useNavigate } from "react-router-dom";

export default function Oath() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleClick = async () => {
    try {

      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);
      // console.log(result.user.email);
      // console.log(result.user.displayName);
      // console.log(result.user.photoURL);

      const response = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        }),
      });

      
      const data = await response.json();
      dispatch(signInSuccess(data));
      navigate("/")
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <button
      className="w-full bg-red-700 my-2 text-white py-3 rounded hover:opacity-95 transition duration-200"
      type="button"
      onClick={handleClick}
    >
      Continue with Google
    </button>
  );
}
