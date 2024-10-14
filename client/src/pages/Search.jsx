import React from "react";

export default function Search() {
  return (
    <main className="flex flex-col md:flex-row">
      <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen">
        <form className="flex flex-col gap-8">
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
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <span className="whitespace-nowrap font-semibold">Types: </span>
            <div className="flex gap-2">
              <input type="checkbox" id="all" className="w-4" />
              <label htmlFor="all">Rent & Sale</label>
            </div>

            <div className="flex gap-2">
              <input type="checkbox" id="rent" className="w-4" />
              <label htmlFor="rent">Rent</label>
            </div>

            <div className="flex gap-2">
              <input type="checkbox" id="sale" className="w-4" />
              <label htmlFor="sale">Sale</label>
            </div>

            <div className="flex gap-2">
              <input type="checkbox" id="offer" className="w-4" />
              <label htmlFor="offer">Offer</label>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <span className="whitespace-nowrap font-semibold">
              Ammenitites:{" "}
            </span>
            <div className="flex gap-2">
              <input type="checkbox" id="parking" className="w-4" />
              <label htmlFor="parking">Parking</label>
            </div>

            <div className="flex gap-2">
              <input type="checkbox" id="furnished" className="w-4" />
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
            <select id="sort_order" className="p-1 border rounded-md">
              <option value="">Price High to Low</option>
              <option value="">Price Low to High</option>
              <option value="">Latest</option>
              <option value="">Oldest</option>
            </select>
          </div>
          <button className="bg-slate-700 text-white py-3 w-full rounded transition duration-200 hover:opacity-95 uppercase disabled:opacity-95">
            Search
          </button>
        </form>
      </div>
      <div className="p-7">listing functionality</div>
    </main>
  );
}
