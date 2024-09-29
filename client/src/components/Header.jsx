import { useState } from "react";
import { FaSearch, FaBars, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useSelector } from 'react-redux'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const curentUser = useSelector(state => state.user.currentUser) 
  console.log(curentUser);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="bg-gray-800 text-white p-4 ">
      <div className="flex items-center justify-between max-w-6xl mx-auto">
        <Link to="/">
          <h1 className="text-lg font-bold sm:text-xl flex flex-wrap">
            <span>Local</span>
            <span className="text-blue-400">Estate</span>
          </h1>
        </Link>
        <div className="flex justify-between ">
          <div className="relative w-full sm:w-auto">
            <form>
              <input
                type="text"
                placeholder="Search..."
                className="w-28 sm:w-96 pl-10 pr-4 py-2 rounded-full bg-gray-700 text-white placeholder-gray-400 focus:outline-none"
              />
              <FaSearch className="block absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" />
            </form>
          </div>
        </div>

        {/* <ul className={`sm:flex space-x-4 hidden`}>
          <li className="hover:underline cursor-pointer">Home</li>
          <li className="hover:underline cursor-pointer">About</li>
          <li className="hover:underline cursor-pointer">Sign In</li>
        </ul> */}
        {/* {menuOpen && (
        <ul className="flex flex-col mt-4 space-y-2 sm:hidden">
          <li className="hover:underline cursor-pointer">Home</li>
          <li className="hover:underline cursor-pointer">About</li>
          <li className="hover:underline cursor-pointer">Sign In</li>
        </ul>
      )} */}

        <div className="sm:hidden">
          {menuOpen ? (
            <FaTimes className="text-xl cursor-pointer" onClick={toggleMenu} />
          ) : (
            <FaBars className="text-xl cursor-pointer" onClick={toggleMenu} />
          )}
        </div>

        <div className="">
          <ul
            className={`flex-col space-y-2 ${
              menuOpen ? "flex" : "hidden"
            } sm:flex sm:flex-row sm:space-y-0 sm:space-x-4 `}
          >
            <Link to="/">
              <li className="hover:underline cursor-pointer">Home</li>
            </Link>
            <Link to="/about">
              <li className="hover:underline cursor-pointer">About</li>
            </Link>
            <Link to="/profile">
              {curentUser ? <img src={curentUser.avatar} alt="profilePic" className="rounded-full h-7 w-7 object-cover" /> : <li className="hover:underline cursor-pointer">Sign In</li>}
            </Link>
          </ul>
        </div>
      </div>
    </header>
  );
}
