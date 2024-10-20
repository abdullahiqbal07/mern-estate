import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Navigation, Pagination } from "swiper/modules";
import SwiperCore from "swiper";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import ListingItems from "../components/ListingItems";
import { Link } from "react-router-dom";

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  // SwiperCore.use([Navigation]);

  useEffect(() => {
    const fetchoffers = async () => {
      try {
        const response = await fetch(`/api/listing/get?offer=true&limit=4`);
        const data = await response.json();
        setOfferListings(data);
        fetchrents();
      } catch (error) {
        console.error(error);
      }
    };

    const fetchrents = async () => {
      try {
        const response = await fetch(`/api/listing/get?type=rent&limit=4`);
        const data = await response.json();
        setRentListings(data);
        fetchsales();
      } catch (error) {
        console.error(error);
      }
    };

    const fetchsales = async () => {
      try {
        const response = await fetch(`/api/listing/get?type=sale&limit=4`);
        const data = await response.json();
        setSaleListings(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchoffers();
  }, []);

  return (
    <div className="">
      {/* intro */}
      <div className="max-w-6xl mx-auto py-28 px-3 flex flex-col gap-6">
        <h1 className="text-3xl text-slate-700 sm:text-6xl font-bold">
          Find your next <span className="text-slate-500">perfect </span>
          <br />
          place with ease
        </h1>
        <p className="text-xs text-slate-600 sm:text-sm ">
          Local Estate will help you find your home fast, easy and comfortable.{" "}
          <br />
          Our expert support are always available.
        </p>
        <Link
          to={'/search'}
          className="text-blue-700 font-bold underline hover:no-underline cursor-pointer"
        >
          Let's get started...
        </Link>
      </div>

      {/* swipper */}

      <Swiper
        navigation
        modules={[Navigation, Pagination]}
        pagination={{ clickable: true }}
        className="mySwiper"
      >
        {offerListings &&
          offerListings.length > 0 &&
          offerListings.map((listing) => (
            <SwiperSlide key={listing._id} className="bg-slate-700">
              <div
                className="h-[400px]"
                style={{
                  background: `url(${listing.imageUrls[0]}) center no-repeat`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              ></div>
            </SwiperSlide>
          ))}
      </Swiper>

      {/* for rent, sale and offer */}

      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
        <div className="my-3">
          <h2 className="text-2xl font-semibold text-slate-600">
            Recent offers
          </h2>
          <Link
            className="text-sm text-blue-800 hover:underline"
            to={"/search?offer=true"}
          >
            Show more offers
          </Link>
        </div>
        <div className="flex flex-wrap gap-4 ">
          {offerListings &&
            offerListings?.map((listing) => (
              <ListingItems home={true} key={listing._id} listing={listing} />
            ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
        <div className="my-3">
          <h2 className="text-2xl font-semibold text-slate-600">
            Recent Rents
          </h2>
          <Link
            className="text-sm text-blue-800 hover:underline"
            to={"/search?type=rent"}
          >
            Show more Rents
          </Link>
        </div>
        <div className="flex flex-wrap gap-4 ">
          {rentListings &&
            rentListings?.map((listing) => (
              <ListingItems home={true} key={listing._id} listing={listing} />
            ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
        <div className="my-3">
          <h2 className="text-2xl font-semibold text-slate-600">
            Recent Sale
          </h2>
          <Link
            className="text-sm text-blue-800 hover:underline"
            to={"/search?type=sale"}
          >
            Show more Sales
          </Link>
        </div>
        <div className="flex flex-wrap gap-4 ">
          {saleListings &&
            saleListings?.map((listing) => (
              <ListingItems home={true} key={listing._id} listing={listing} />
            ))}
        </div>
        <div>
          {(saleListings.length < 1 ||
            rentListings.length < 1 ||
            offerListings.length < 1) && (
            <p className="text-lg text-slate-800  text-center">
              Available Soon....
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
