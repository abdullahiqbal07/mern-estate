import React from "react";

export default function CreateListing() {
  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create Listing
      </h1>
      <form action="" className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Name"
            id="name"
            maxLength="62"
            minLength="10"
            className="rounded-lg border p-3"
            required
          />
          <textarea
            type="text"
            placeholder="Description"
            id="description"
            className="rounded-lg border p-3"
            required
          />
          <input
            type="text"
            placeholder="Address"
            id="address"
            className="rounded-lg border p-3"
            required
          />

          <div className="flex flex-wrap gap-4">
            <div className="flex gap-2 ">
              <input type="checkbox" id="sell" className="w-5" />
              <label htmlFor="sell">Sell</label>
            </div>
            <div className="flex gap-2 ">
              <input type="checkbox" id="rent" className="w-5" />
              <label htmlFor="rent">Rent</label>
            </div>
            <div className="flex gap-2 ">
              <input type="checkbox" id="parking" className="w-5" />
              <label htmlFor="parking">Parking spot</label>
            </div>
            <div className="flex gap-2 ">
              <input type="checkbox" id="furnished" className="w-5" />
              <label htmlFor="furnished">Furnished</label>
            </div>
            <div className="flex gap-2 ">
              <input type="checkbox" id="offer" className="w-5" />
              <label htmlFor="offer">Offer</label>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <input
                type="number"
                id="bedrooms"
                className="rounded-lg border-gray-300 p-3"
                min="1"
                max="10"
                required
              />
              <p>Beds</p>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="number"
                id="bathrooms"
                className="rounded-lg border-gray-300 p-3"
                min="1"
                max="10"
                required
              />
              <p>Baths</p>
            </div>
            <div className="flex items-center gap-4">
              <input
                type="number"
                id="regularPrice"
                className="rounded-lg border-gray-300 p-3"
                required
              />
              <p className="flex flex-col items-center">
                Regular Price <span className=" text-sm">($/month)</span>
              </p>
            </div>
            <div className="flex items-center gap-4">
              <input
                type="number"
                id="discountPrice"
                className="rounded-lg border-gray-300 p-3"
                required
              />
              <p className="flex flex-col items-center">
                Discount Price <span className=" text-sm">($/month)</span>
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4 flex-1">
          <p className="font-semibold">
            Images:{" "}
            <span className="font-normal text-grey-600">
              the first image will be the cover (max-6)
            </span>
          </p>
          <div className="flex flex-row gap-3">
            <input
              type="file"
              id="images"
              accept="image/*"
              multiple
              className="p-3 border border-gray-300 rounded w-full "
            />
            <button className="text-green-700 uppercase p-3 border border-green-700 rounded-lg hover:shadow-lg disabled:opacity-95">
              upload
            </button>
          </div>
          <button className="bg-slate-700 text-white py-3 rounded-lg transition duration-200 hover:opacity-95 uppercase disabled:opacity-95 my-2">
            Create Listing
          </button>
        </div>
      </form>
    </main>
  );
}
