import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import SwiperCore from "swiper";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkerAlt,
  FaShare,
} from "react-icons/fa";
import { FaSquareParking } from "react-icons/fa6";
import { useSelector } from "react-redux";
import Contact from "../components/Contact";

export default function Listing() {
  const { listingId } = useParams();
  const [listing, setListing] = useState({});
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copy, setCopy] = useState(false);
  const [contact, setContact] = useState(false);
  const currentUser = useSelector((state) => state.user.currentUser);
  //   SwiperCore.use([Navigation])

  useEffect(() => {
    console.log("Loading");
    const fetchList = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/listing/get/${listingId}`);
        const data = await response.json();
        if (data.success === false) {
          console.log(data.message);
          setError(true);
          setLoading(false);
          return;
        }
        setListing({ ...listing, ...data });
        setError(false);
        setLoading(false);
      } catch (error) {
        setError(true);
        setLoading(false);
        console.log(error);
      }
    };

    fetchList();
  }, []);

  return (
    <main>
      {loading && (
        <p className="text-3xl text-center font-semibold my-7">Loading....</p>
      )}
      {error && (
        <p className="text-3xl text-center font-semibold my-7">
          Something went wrong OOPS!
        </p>
      )}
      {listing && !error && !loading && (
        <>
          <Swiper
            navigation
            modules={[Navigation, Pagination]}
            pagination={{ clickable: true }}
            className="mySwiper"
          >
            {listing?.imageUrls?.map((url) => (
              <SwiperSlide key={url} className="bg-black">
                <div
                  className="h-[400px]"
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: "contain",
                    backgroundPosition: "center",
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
        </>
      )}
      <div className="fixed top-[16%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer">
        <FaShare
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            setCopy(true);
            setTimeout(() => {
              setCopy(false);
            }, 2000);
          }}
          className="text-slate-600"
        />
      </div>
      {copy && (
        <p className="fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2">
          Link copied!
        </p>
      )}
      <div className="flex flex-col max-w-4xl mx-auto my-7 p-3 gap-4">
        <p className="font-semibold text-2xl ">
          {listing.name} - ${" "}
          {listing?.offer
            ? listing?.discountPrice?.toLocaleString("en-US") || "N/A"
            : listing?.regularPrice?.toLocaleString("en-US") || "N/A"}
          {listing.type === "rent" && " / month"}
        </p>
        <p className="flex flex-row gap-2 items-center mt-4 text-sm text-slate-600">
          <FaMapMarkerAlt className="text-green-700" />
          {listing.address}
        </p>
        <div className="flex gap-4">
          <p className="bg-red-900 text-white p-2 rounded-lg w-full max-w-[200px] text-center">
            {listing.type === "rent" ? "For Rent" : "For Sale"}
          </p>

          {listing.offer && (
            <p className="bg-green-900 text-white p-2 rounded-lg w-full max-w-[200px] text-center">
              ${+listing.regularPrice - +listing.discountPrice} OFF
            </p>
          )}
        </div>
        <p className="mt-2 text-slate-800">
          <span className="font-semibold text-black">Description - </span>
          {listing.description}
        </p>
        <ul className="text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6">
          <li className="flex items-center gap-2">
            <FaBed />
            {listing.bedrooms > 1
              ? listing.bedrooms + " bedrooms"
              : listing.bedrooms + " bedroom"}
          </li>

          <li className="flex items-center gap-2">
            <FaBath />
            {listing.bathrooms > 1
              ? listing.bathrooms + " bathrooms"
              : listing.bathrooms + " bathroom"}
          </li>

          <li className="flex items-center gap-2">
            <FaSquareParking />
            {listing.parking ? " parking" : " no parking"}
          </li>

          <li className="flex items-center gap-2">
            <FaChair />
            {listing.furnished ? " furnished" : " not furnished"}
          </li>
        </ul>
        {currentUser && listing.userRef !== currentUser._id && !contact && (
          <button
            onClick={() => setContact(true)}
            className="bg-slate-700 text-white my-7 py-3 rounded transition duration-200 hover:opacity-95 uppercase disabled:opacity-95"
          >
            Contact LandLoard
          </button>
        )}
        {contact && <Contact listing={listing} />}
      </div>
    </main>
  );
}
