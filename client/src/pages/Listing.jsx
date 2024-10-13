import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import SwiperCore from "swiper";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

export default function Listing() {
  const { listingId } = useParams();
  const [listing, setListing] = useState({});
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  //   SwiperCore.use([Navigation])
  console.log(listing.imageUrls);

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
          ;
        </>
      )}
    </main>
  );
}
