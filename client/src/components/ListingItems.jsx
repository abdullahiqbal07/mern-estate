import React from "react";
import { Link } from "react-router-dom";
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkerAlt,
  FaShare,
} from "react-icons/fa";
import { FaSquareParking } from "react-icons/fa6";

export default function ListingItems({ listing, home=false }) {
  const homeStyle = 'bg-white max-w-[500px] flex flex-col shadow-md transition-shadow duration-300 hover:shadow-lg rounded-lg overflow-hidden w-full sm:w-[330px]';
  const defaultStyle = 'bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[330px] lg:w-[48%]';

  return (
    <div className={home ? homeStyle : defaultStyle}>
      <Link to={`/listing/${listing._id}`}>
        <img
          src={
            listing.imageUrls[0] ||
            "https://53.fs1.hubspotusercontent-na1.net/hub/53/hubfs/Sales_Blog/real-estate-business-compressor.jpg?width=595&height=400&name=real-estate-business-compressor.jpg"
          }
          alt="back cover"
          className="w-full hover:scale-105 object-cover h-[320px] sm:h-[220px]"
        />
        <div className="flex flex-col gap-2 p-3">
          <p className="font-semibold truncate">{listing.name}</p>
          <div className="flex items-center gap-2">
            <FaMapMarkerAlt className="text-green-700" />
            <p className="text-sm text-slate-600 w-full truncate">
              {listing.address}
            </p>
          </div>
          <p className="text-sm text-slate-600 line-clamp-2">
            {listing.description}
          </p>
          <p className="font-semibold text-slate-600">
            ${" "}
            {listing?.offer
              ? listing?.discountPrice.toLocaleString("en-US")
              : listing?.regularPrice.toLocaleString("en-US")}
            {listing.type === "rent" && " / month"}
          </p>
          <ul className="text-green-900 font-semibold text-sm flex flex-wrap items-center gap-2 sm:gap-4">
            <li className="flex items-center gap-2 ">
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

            <li className="sm:flex items-center gap-2 hidden">
              <FaSquareParking />
              {listing.parking ? " parking" : " no parking"}
            </li>

            <li className="sm:flex items-center gap-2 hidden">
              <FaChair />
              {listing.furnished ? " furnished" : " not furnished"}
            </li>
          </ul>
        </div>
      </Link>
    </div>
  );
}
