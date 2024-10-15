import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import ListingItems from "../components/ListingItems";

export default function Search() {
  const [searchData, setSearchData] = useState({
    searchTerm: "",
    type: "all",
    offer: false,
    parking: false,
    furnished: false,
    sort: "createdAt",
    order: "desc",
  });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  console.log(listings);

  const handleChange = (event) => {
    if (
      event.target.id === "sale" ||
      event.target.id === "rent" ||
      event.target.id === "all"
    ) {
      setSearchData({ ...searchData, type: event.target.id });
    }

    if (event.target.id === "searchTerm") {
      setSearchData({ ...searchData, searchTerm: event.target.value });
    }

    if (
      event.target.id === "parking" ||
      event.target.id === "furnished" ||
      event.target.id === "offer"
    ) {
      setSearchData({
        ...searchData,
        [event.target.id]:
          event.target.checked || event.target.checked === "true"
            ? true
            : false,
      });
    }

    if (event.target.id === "sort_order") {
      const sort = event.target.value.split("_")[0] || "createdAt";

      const order = event.target.value.split("_")[1] || "desc";
      setSearchData({ ...searchData, sort, order });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", searchData.searchTerm);
    urlParams.set("sort", searchData.sort);
    urlParams.set("order", searchData.order);
    urlParams.set("parking", searchData.parking);
    urlParams.set("offer", searchData.offer);
    urlParams.set("furnished", searchData.furnished);
    urlParams.set("type", searchData.type);

    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermUrl = urlParams.get("searchTerm");
    const parkingUrl = urlParams.get("parking");
    const offerUrl = urlParams.get("offer");
    const furnishedUrl = urlParams.get("furnished");
    const typeUrl = urlParams.get("type");
    const sortUrl = urlParams.get("sort");
    const orderUrl = urlParams.get("order");

    if (
      searchTermUrl ||
      sortUrl ||
      orderUrl ||
      typeUrl ||
      furnishedUrl ||
      offerUrl ||
      parkingUrl
    ) {
      setSearchData({
        searchTerm: searchTermUrl || "",
        parking: parkingUrl === "true" ? true : false,
        offer: offerUrl === "true" ? true : false,
        furnished: furnishedUrl === "true" ? true : false,
        type: typeUrl || "all",
        sort: sortUrl || "createdAt",
        order: orderUrl || "desc",
      });
    }

    const fetchListings = async () => {
      setLoading(true);
      const searchQuery = urlParams.toString();
      const response = await fetch(`/api/listing/get?${searchQuery}`);
      const data = await response.json();
      setLoading(false);
      setListings(data);
    };

    fetchListings();
  }, [location.search]);

  return (
    <main className="flex flex-col md:flex-row">
      <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen">
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div className="flex items-center gap-2">
            <label
              htmlFor="searchTerm"
              className="whitespace-nowrap font-semibold"
            >
              Search Terms:
            </label>
            <input
              type="text"
              id="searchTerm"
              placeholder="Search..."
              className="p-2 border rounded-lg w-full"
              onChange={handleChange}
              value={searchData.searchTerm}
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <span className="whitespace-nowrap font-semibold">Types: </span>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="all"
                className="w-4"
                onChange={handleChange}
                checked={searchData.type === "all"}
              />
              <label htmlFor="all">Rent & Sale</label>
            </div>

            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                className="w-4"
                onChange={handleChange}
                checked={searchData.type === "rent"}
              />
              <label htmlFor="rent">Rent</label>
            </div>

            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sale"
                className="w-4"
                onChange={handleChange}
                checked={searchData.type === "sale"}
              />
              <label htmlFor="sale">Sale</label>
            </div>

            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-4"
                onChange={handleChange}
                checked={searchData.offer}
              />
              <label htmlFor="offer">Offer</label>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <span className="whitespace-nowrap font-semibold">
              Ammenitites:{" "}
            </span>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-4"
                onChange={handleChange}
                checked={searchData.parking}
              />
              <label htmlFor="parking">Parking</label>
            </div>

            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-4"
                onChange={handleChange}
                checked={searchData.furnished}
              />
              <label htmlFor="furnished">Furnished</label>
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <label
              htmlFor="sort_order"
              className=" font-semibold whitespace-nowrap"
            >
              Sort:
            </label>
            <select
              id="sort_order"
              className="p-1 border rounded-md"
              onChange={handleChange}
              defaultValue="createdAt_desc"
            >
              <option value="regularPrice_desc">Price High to Low</option>
              <option value="regularPrice_asc">Price Low to High</option>
              <option value="createdAt_desc">Latest</option>
              <option value="createdAt_asc">Oldest</option>
            </select>
          </div>
          <button className="bg-slate-700 text-white py-3 w-full rounded transition duration-200 hover:opacity-95 uppercase disabled:opacity-95">
            Search
          </button>
        </form>
      </div>
      <div className="flex-1 flex flex-col">
        <h1 className="text-3xl text-slate-600 p-7 w-full font-semibold border-b-2">
          Listings Results:
        </h1>
        <div className="p-7 flex flex-row flex-wrap gap-4 w-full justify-between">
          {loading && (
            <p className="text-3xl font-semibold text-center mt-14">
              Loading...
            </p>
          )}

          {!loading && listings?.length === 0 && (
            <p className="text-3xl font-semibold text-center mt-14">
              No list is found...
            </p>
          )}
          {!loading &&
            listings &&
            listings?.map((listing) => (
              <ListingItems key={listing._id} listing={listing} />
            ))}
        </div>
      </div>
    </main>
  );
}
