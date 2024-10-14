import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Contact({ listing }) {
  console.log(listing);
  const [userdata, setUserData] = useState(null);
  const [message, setMessage] = useState("");
  console.log(userdata);
  useEffect(() => {
    const getUser = async () => {
      const response = await fetch(`/api/user/get/${listing.userRef}`);
      const data = await response.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setUserData(data);
    };
    getUser();
  }, []);
  return (
    <div>
      {userdata && (
        <div className="flex flex-col gap-2">
          <p>
            Contact{" "}
            <span className="text-black font-semibold">
              {userdata.username}
            </span>{" "}
            for{" "}
            <span className="text-black font-semibold">
              {listing.name.toLowerCase()}
            </span>{" "}
            property
          </p>
          <textarea
            name="message"
            id="message"
            value={message}
            rows={2}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full rounded-lg p-2 my-2 border"
            placeholder="Enter your message here..."
          ></textarea>
          <Link
            to={`mailto:${userdata.email}?subject=Regarding ${listing.name}&body=${message}`}
            className="bg-slate-700 text-center text-white py-3 rounded transition duration-200 hover:opacity-95 uppercase disabled:opacity-95"
          >
            Send Message
          </Link>
        </div>
      )}
    </div>
  );
}
