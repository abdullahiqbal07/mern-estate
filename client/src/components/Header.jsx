import { useEffect, useState, useRef } from "react";
import { FaSearch, FaBars, FaTimes } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchMessage, setSearchMessage] = useState("");
  const curentUser = useSelector((state) => state.user.currentUser);
  const navigate = useNavigate();
  const menuRef = useRef(null); // Reference to the menu container

  const handleSubmit = (e) => {
    e.preventDefault();
    let urlParams = new URLSearchParams(window.location.search);
    urlParams.set("searchTerm", searchMessage);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    let urlParams = new URLSearchParams(window.location.search);
    const message = urlParams.get("searchTerm");
    if (message) {
      setSearchMessage(message);
    }
  }, [location.search]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle menu item click
  const handleMenuItemClick = () => {
    setMenuOpen(false);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="bg-gray-800 text-white p-4 " ref={menuRef}>
      <div className="flex items-center justify-between max-w-6xl mx-auto">
        <Link to="/">
          <h1 className="text-lg font-bold sm:text-xl flex flex-wrap">
            <span>Local</span>
            <span className="text-blue-400">Estate</span>
          </h1>
        </Link>
        <div className="flex justify-between ">
          <div className="relative w-full sm:w-auto">
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Search..."
                className="w-28 sm:w-96 pl-10 pr-4 py-2 rounded-full bg-gray-700 text-white placeholder-gray-400 focus:outline-none"
                onChange={(e) => setSearchMessage(e.target.value)}
                value={searchMessage}
              />
              <FaSearch
                onClick={handleSubmit}
                className="block absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500"
              />
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
            className={`absolute top-16 left-0 w-full bg-gray-800 text-white shadow-md sm:static sm:flex sm:bg-transparent sm:shadow-none p-4 sm:p-0 border-b-2 sm:border-none border-slate-600 sm:w-auto flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 ${
              menuOpen ? "flex" : "hidden"
            } z-20`}
          >
            <Link to="/" onClick={handleMenuItemClick}>
              <li className="hover:underline cursor-pointer">Home</li>
            </Link>
            <Link to="/about" onClick={handleMenuItemClick}>
              <li className="hover:underline cursor-pointer">About</li>
            </Link>
            <Link to="/profile" onClick={handleMenuItemClick}>
              {curentUser ? (
                <img
                  src={curentUser.avatar}
                  alt="profilePic"
                  className="rounded-full h-7 w-7 object-cover"
                />
              ) : (
                <li className="hover:underline cursor-pointer">Sign In</li>
              )}
            </Link>
          </ul>
        </div>
      </div>
    </header>
  );
}
