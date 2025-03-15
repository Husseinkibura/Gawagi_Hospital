import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const Website = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // State for mobile menu
  const navigate = useNavigate();

  // Define the roles
  const roles = ["Admin", "Doctor", "Pharmacist", "Reception", "LabTech", "Cashier", "RCHClinic", "Patient"];

  // Refs for scrolling to sections
  const aboutRef = useRef(null);
  const contactRef = useRef(null);
  const locationRef = useRef(null);

  // Scroll to a specific section
  const scrollToSection = (ref) => {
    ref.current.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false); // Close the mobile menu after clicking a link
  };

  // Handle role click and redirect to login page
  const handleRoleClick = (role) => {
    navigate("/login", { state: { role } });
  };

  return (
    <div className="bg-[#FAF9F6] min-h-screen">
      {/* Navbar */}
      <nav className="bg-white text-black py-4 shadow-sm sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center px-4">
          <h1 className="text-2xl font-bold text-blue-600">GAWAGI PENTECOSTAL DISPENSARY</h1>
          {/* Hamburger Menu for Mobile */}
          <div className="md:hidden">
            <button onClick={() => setMenuOpen(!menuOpen)} className="text-black focus:outline-none">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
              </svg>
            </button>
          </div>
          {/* Desktop Menu */}
          <ul className={`md:flex space-x-6 ${menuOpen ? 'block' : 'hidden'} md:block`}>
            <li
              className="cursor-pointer hover:text-blue-600 transition-colors duration-300 text-lg font-semibold"
              onClick={() => scrollToSection(aboutRef)}
            >
              About Us
            </li>
            <li
              className="cursor-pointer hover:text-blue-600 transition-colors duration-300 text-lg font-semibold"
              onClick={() => scrollToSection(contactRef)}
            >
              Contact
            </li>
            <li
              className="cursor-pointer hover:text-blue-600 transition-colors duration-300 text-lg font-semibold"
              onClick={() => scrollToSection(locationRef)}
            >
              Location
            </li>
            <li
              className="relative"
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <span className="cursor-pointer hover:text-blue-600 transition-colors duration-300 text-lg font-semibold">Login</span>
              {dropdownOpen && (
                <ul className="absolute bg-white text-black shadow-lg mt-2 rounded-md z-10 w-64 transition-all duration-300 transform origin-top">
                  {roles.map((role) => (
                    <li
                      key={role}
                      className="px-4 py-2 hover:bg-gray-200 cursor-pointer transition-colors duration-300 text-md font-medium"
                      onClick={() => handleRoleClick(role)} // Redirect to login page
                    >
                      {role}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          </ul>
        </div>
      </nav>

      {/* Header Section */}
      <header className="py-24 bg-gradient-to-r from-blue-600 to-blue-500 text-white">
        <div className="container mx-auto text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-bounce">
            Welcome to GAWAGI PENTECOSTAL DISPENSARY
          </h1>
          <p className="text-lg md:text-xl font-light">Providing Quality Medical Services 24/7</p>
        </div>
      </header>

      {/* Animated Image Section with "Our Members" Card */}
      <div className="container mx-auto px-4 my-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Image on the Left */}
          <div className="flex justify-center">
            <img
              src={`${process.env.PUBLIC_URL}/images/img6.jpeg`}
              alt="Animated Image"
              className="w-full max-w-md h-auto rounded-lg shadow-lg animate-expand"
            />
          </div>

          {/* "Our Members" Card on the Right */}
          <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 animate-fade-in-up">
            <h2 className="text-3xl font-bold text-blue-600 mb-6">Our Members</h2>
            <p className="text-gray-700 text-lg mb-6">
              Our team consists of highly skilled professionals dedicated to providing the best medical care:
            </p>
            <ul className="space-y-4">
              <li className="text-gray-700 text-lg">
                <strong className="font-semibold">Doctors:</strong> Experienced and compassionate physicians providing comprehensive care.
              </li>
              <li className="text-gray-700 text-lg">
                <strong className="font-semibold">Technicians:</strong> Skilled lab and imaging technicians ensuring accurate diagnostics.
              </li>
              <li className="text-gray-700 text-lg">
                <strong className="font-semibold">Pharmacists:</strong> Experts in medication management and patient counseling.
              </li>
              <li className="text-gray-700 text-lg">
                <strong className="font-semibold">Receptionists:</strong> Friendly staff ensuring smooth patient registration and support.
              </li>
              <li className="text-gray-700 text-lg">
                <strong className="font-semibold">Cashiers:</strong> Efficient handling of billing and payments for your convenience.
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* About Section */}
      <section id="about" ref={aboutRef} className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in-left">
            <h2 className="text-4xl font-bold text-blue-600 mb-6">About Us</h2>
            <p className="text-gray-700 text-lg leading-relaxed">
              GAWAGI PENTECOSTAL DISPENSARY is a trusted healthcare provider
              offering comprehensive medical services to the community. We are
              open 24 hours a day, 7 days a week, ensuring that you receive the
              care you need whenever you need it.
            </p>
          </div>
          <div className="animate-fade-in-right">
            <img
              src={`${process.env.PUBLIC_URL}/images/img1.jpg`}
              alt="Dispensary Image"
              className="rounded-lg shadow-lg w-full hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-blue-600 text-center mb-12">
            Our Services
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Service Card 1 */}
            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 animate-fade-in-up">
              <h3 className="text-2xl font-bold text-blue-600 mb-4">
                General Consultation
              </h3>
              <p className="text-gray-700 text-lg leading-relaxed">
                Our experienced doctors provide thorough consultations to
                diagnose and treat a wide range of medical conditions.
              </p>
            </div>
            {/* Service Card 2 */}
            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 animate-fade-in-up">
              <h3 className="text-2xl font-bold text-blue-600 mb-4">
                Emergency Care
              </h3>
              <p className="text-gray-700 text-lg leading-relaxed">
                We offer 24/7 emergency care to handle critical medical
                situations promptly and effectively.
              </p>
            </div>
            {/* Service Card 3 */}
            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 animate-fade-in-up">
              <h3 className="text-2xl font-bold text-blue-600 mb-4">
                Laboratory Services
              </h3>
              <p className="text-gray-700 text-lg leading-relaxed">
                Our state-of-the-art laboratory provides accurate and timely
                diagnostic tests.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-blue-600 text-center mb-12">
          Gallery
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <img
            src={`${process.env.PUBLIC_URL}/images/img1.jpg`}
            alt="Gallery Image 1"
            className="rounded-lg shadow-lg w-full hover:scale-105 transition-transform duration-300"
          />
          <img
            src={`${process.env.PUBLIC_URL}/images/img2.jpg`}
            alt="Gallery Image 2"
            className="rounded-lg shadow-lg w-full hover:scale-105 transition-transform duration-300"
          />
          <img
            src={`${process.env.PUBLIC_URL}/images/img3.jpg`}
            alt="Gallery Image 3"
            className="rounded-lg shadow-lg w-full hover:scale-105 transition-transform duration-300"
          />
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" ref={contactRef} className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-blue-600 text-center mb-12">
            Contact Us
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold text-blue-600 mb-6">Get in Touch</h3>
              <p className="text-gray-700 text-lg mb-6">
                Have questions or need assistance? Reach out to us via phone,
                email, or visit our dispensary.
              </p>
              <ul className="space-y-4">
                <li className="text-gray-700 text-lg">
                  <strong className="font-semibold">Phone:</strong> +255 123 456 789
                </li>
                <li className="text-gray-700 text-lg">
                  <strong className="font-semibold">Email:</strong> info@gawagidispensary.com
                </li>
                <li className="text-gray-700 text-lg">
                  <strong className="font-semibold">Address:</strong> 123 Main Street, Gawagi, Tanzania
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-blue-600 mb-6">Send Us a Message</h3>
              <form className="space-y-6">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full px-6 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  className="w-full px-6 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                />
                <textarea
                  placeholder="Your Message"
                  rows="5"
                  className="w-full px-6 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                ></textarea>
                <button
                  type="submit"
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 text-lg font-semibold"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section id="location" ref={locationRef} className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-blue-600 text-center mb-12">
          Our Location
        </h2>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-gray-700 text-lg mb-6">
              Visit us at our conveniently located dispensary in Gawagi. We are
              easily accessible and offer ample parking for your convenience.
            </p>
            <ul className="space-y-4">
              <li className="text-gray-700 text-lg">
                <strong className="font-semibold">Address:</strong> 123 Main Street, Gawagi, Tanzania
              </li>
              <li className="text-gray-700 text-lg">
                <strong className="font-semibold">Hours:</strong> Open 24/7
              </li>
            </ul>
          </div>
          <div>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3987.123456789012!2d39.12345678901234!3d-6.123456789012345!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMDcnMjQuNSJTIDM5wrAwNyc0NS42IkU!5e0!3m2!1sen!2stz!4v1234567890123"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              className="rounded-lg shadow-lg"
            ></iframe>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-white text-black py-8">
        <div className="container mx-auto text-center px-4">
          <p className="text-lg">
            &copy; {new Date().getFullYear()} GAWAGI PENTECOSTAL DISPENSARY. All rights reserved.
          </p>
          <p className="text-lg mt-2">Open 24/7 | Monday to Sunday</p>
        </div>
      </footer>
    </div>
  );
};

export default Website;