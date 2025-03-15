import { Link } from "react-scroll";

const Footer = () => {
  return (
    <div className="bg-backgroundColor text-white rounded-t-3xl mt-8 md:mt-0">
      <div className="flex flex-col md:flex-row justify-between p-8 md:px-32 px-5">
        <div className="w-full md:w-1/4">
          <h1 className="font-semibold text-xl pb-4">Gawagi Dispensary</h1>
          <p className="text-sm">
            At Gawagi Dispensary, we are committed to providing high-quality healthcare services to our community. Our team of experienced professionals is dedicated to ensuring your well-being.
          </p>
        </div>
        <div>
          <h1 className="font-medium text-xl pb-4 pt-5 md:pt-0">About Us</h1>
          <nav className="flex flex-col gap-2">
            <Link
              to="about"
              spy={true}
              smooth={true}
              duration={500}
              className="hover:text-hoverColor transition-all cursor-pointer"
            >
              About
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
          </nav>
        </div>
        <div>
          <h1 className="font-medium text-xl pb-4 pt-5 md:pt-0">Services</h1>
          <nav className="flex flex-col gap-2">
            <Link
              to="services"
              spy={true}
              smooth={true}
              duration={500}
              className="hover:text-hoverColor transition-all cursor-pointer"
            >
              Lab Test
            </Link>
            <Link
              to="services"
              spy={true}
              smooth={true}
              duration={500}
              className="hover:text-hoverColor transition-all cursor-pointer"
            >
              General Consultation
            </Link>
            <Link
              to="services"
              spy={true}
              smooth={true}
              duration={500}
              className="hover:text-hoverColor transition-all cursor-pointer"
            >
              Heart Health
            </Link>
          </nav>
        </div>
        <div className="w-full md:w-1/4">
          <h1 className="font-medium text-xl pb-4 pt-5 md:pt-0">Contact Us</h1>
          <nav className="flex flex-col gap-2">
            <p>Dar es Salaam, Tanzania</p>
            <p>gawagidispensary.co.tz</p>
            <p>+255 673 910 791</p>
          </nav>
        </div>
      </div>
      <div>
        <p className="text-center py-4">
          @copyright developed by
          <span className="text-hoverColor"> Gawagi Dispensary</span> | All rights reserved
        </p>
      </div>
    </div>
  );
};

export default Footer;