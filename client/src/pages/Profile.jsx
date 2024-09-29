import { useSelector } from "react-redux";

export default function Profile() {
  const curentUser = useSelector((state) => state.user.currentUser);

  return (
    <div className="p-3 mx-auto max-w-lg">
      <h1 className="text-3xl font-semibold my-7 text-center">Profile</h1>
      <form className="flex flex-col  gap-4">

        <img
          src={curentUser.avatar}
          alt="profilePic"
          className="rounded-full h-24 w-24 mt-2 object-cover cursor-pointer self-center"
        />

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
