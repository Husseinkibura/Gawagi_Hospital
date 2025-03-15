import { useState } from "react";
import { Link } from "react-scroll";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Contact from "../../models/Contact";

const ClonedNavbar = () => {
  const [menu, setMenu] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showLoginDropdown, setShowLoginDropdown] = useState(false); // State for login dropdown
  const navigate = useNavigate(); // Hook for navigation

  const handleChange = () => {
    setMenu(!menu);
  };

  const closeMenu = () => {
    setMenu(false);
  };

  const openForm = () => {
    setShowForm(true);
    setMenu(false);
  };

  const closeForm = () => {
    setShowForm(false);
  };

  const handleLoginRedirect = () => {
    navigate("/login"); // Redirect to the login page
  };

  return (
    <div className="fixed w-full z-10 text-white">
      <div>
        <div className="flex flex-row justify-between p-3 md:px-24 px-4 bg-backgroundColor shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]">
          <div className="flex flex-row items-center cursor-pointer">
            <Link to="home" spy={true} smooth={true} duration={500}>
              <h1 className="text-xl font-semibold">Gawagi Dispensary.</h1>
            </Link>
          </div>

          <nav className="hidden lg:flex flex-row items-center text-base font-medium gap-6">
            <Link
              to="home"
              spy={true}
              smooth={true}
              duration={500}
              className="hover:text-hoverColor transition-all cursor-pointer"
            >
              Home
            </Link>
            <Link
              to="about"
              spy={true}
              smooth={true}
              duration={500}
              className="hover:text-hoverColor transition-all cursor-pointer"
            >
              About Us
            </Link>
            <Link
              to="services"
              spy={true}
              smooth={true}
              duration={500}
              className="hover:text-hoverColor transition-all cursor-pointer"
            >
              Services
            </Link>
            <Link
              to="doctors"
              spy={true}
              smooth={true}
              duration={500}
              className="hover:text-hoverColor transition-all cursor-pointer"
            >
              Doctors
            </Link>
            <Link
              to="blog"
              spy={true}
              smooth={true}
              duration={500}
              className="hover:text-hoverColor transition-all cursor-pointer"
            >
              Blog
            </Link>
          </nav>

          <div className="hidden lg:flex items-center gap-6">
            <div
              className="relative"
              onMouseEnter={() => setShowLoginDropdown(true)} // Show dropdown on hover
              onMouseLeave={() => setShowLoginDropdown(false)} // Hide dropdown when cursor leaves
            >
              <button
                className="bg-brightColor text-white px-3 py-1 rounded-md hover:bg-hoverColor transition duration-300 ease-in-out"
              >
                Login
              </button>
              {/* Dropdown with sliding animation */}
              <div
                className={`absolute right-0 mt-2 w-48 bg-white text-black rounded-lg shadow-lg transform transition-all duration-300 ease-in-out ${
                  showLoginDropdown
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 -translate-y-2"
                }`}
              >
                <ul className="py-2">
                  {[
                    "Admin",
                    "Doctor",
                    "Receptionist",
                    "Pharmacist",
                    "Technician",
                    "Cashier",
                    "RCHClinic",
                    "Patient",
                  ].map((role) => (
                    <li
                      key={role}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={handleLoginRedirect}
                    >
                      {role}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <button
              className="bg-brightColor text-white px-3 py-1 rounded-md hover:bg-hoverColor transition duration-300 ease-in-out"
              onClick={openForm}
            >
              Contact Us
            </button>
          </div>

          {showForm && <Contact closeForm={closeForm} />}

          <div className="lg:hidden flex items-center">
            {menu ? (
              <AiOutlineClose size={24} onClick={handleChange} />
            ) : (
              <AiOutlineMenu size={24} onClick={handleChange} />
            )}
          </div>
        </div>
        <div
          className={`${
            menu ? "translate-x-0" : "-translate-x-full"
          } lg:hidden flex flex-col absolute bg-backgroundColor text-white left-0 top-14 font-semibold text-xl text-center pt-6 pb-3 gap-6 w-full h-fit transition-transform duration-300`}
        >
          <Link
            to="home"
            spy={true}
            smooth={true}
            duration={500}
            className="hover:text-hoverColor transition-all cursor-pointer"
            onClick={closeMenu}
          >
            Home
          </Link>
          <Link
            to="about"
            spy={true}
            smooth={true}
            duration={500}
            className="hover:text-hoverColor transition-all cursor-pointer"
            onClick={closeMenu}
          >
            About Us
          </Link>
          <Link
            to="services"
            spy={true}
            smooth={true}
            duration={500}
            className="hover:text-hoverColor transition-all cursor-pointer"
            onClick={closeMenu}
          >
            Services
          </Link>
          <Link
            to="doctors"
            spy={true}
            smooth={true}
            duration={500}
            className="hover:text-hoverColor transition-all cursor-pointer"
            onClick={closeMenu}
          >
            Doctors
          </Link>
          <Link
            to="blog"
            spy={true}
            smooth={true}
            duration={500}
            className="hover:text-hoverColor transition-all cursor-pointer"
            onClick={closeMenu}
          >
            Blog
          </Link>

          {/* Login Dropdown for Mobile */}
          <div className="lg:hidden">
            <button
              className="bg-brightColor text-white px-3 py-1 rounded-md hover:bg-hoverColor transition duration-300 ease-in-out"
              onClick={() => setShowLoginDropdown(!showLoginDropdown)}
            >
              Login
            </button>
            {showLoginDropdown && (
              <div className="mt-2 bg-white text-black rounded-lg shadow-lg">
                <ul className="py-2">
                  {[
                    "Admin",
                    "Doctor",
                    "Receptionist",
                    "Pharmacist",
                    "Technician",
                    "Cashier",
                    "RCHClinic",
                    "Patient",
                  ].map((role) => (
                    <li
                      key={role}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={handleLoginRedirect}
                    >
                      {role}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="lg:hidden">
            <button
              className="bg-brightColor text-white px-3 py-1 rounded-md hover:bg-hoverColor transition duration-300 ease-in-out"
              onClick={openForm}
            >
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClonedNavbar;