import Button from "../layouts/Button";
import { RiMicroscopeLine } from "react-icons/ri";
import ServicesCard from "../layouts/ServicesCard";
import { MdHealthAndSafety } from "react-icons/md";
import { FaHeartbeat } from "react-icons/fa";

const Services = () => {
  const icon1 = (
    <RiMicroscopeLine size={35} className=" text-backgroundColor" />
  );
  const icon2 = (
    <MdHealthAndSafety size={35} className=" text-backgroundColor" />
  );
  const icon3 = <FaHeartbeat size={35} className=" text-backgroundColor" />;

  return (
    <div className="min-h-screen flex flex-col justify-center lg:px-32 px-5 pt-24 lg:pt-16">
      <div className="flex flex-col items-center lg:flex-row justify-between">
        <div>
          <h1 className="text-4xl font-semibold text-center lg:text-start">
            Our Services
          </h1>
          <p className="mt-2 text-center lg:text-start">
            At Gawagi Dispensary, we offer a wide range of healthcare services designed to meet your needs. From diagnostic tests to specialized consultations, our team is dedicated to providing you with the best care possible.
          </p>
        </div>
        <div className="mt-4 lg:mt-0">
          <Button title="See Services" />
        </div>
      </div>
      <div className="flex flex-col lg:flex-row gap-5 pt-14">
        <ServicesCard
          icon={icon1}
          title="Lab Tests"
          description="Accurate and reliable diagnostic tests to help identify health issues early and guide effective treatment plans."
        />
        <ServicesCard
          icon={icon2}
          title="General Consultation"
          description="Comprehensive health check-ups and consultations with experienced doctors to address your medical concerns."
        />
        <ServicesCard
          icon={icon3}
          title="Heart Health"
          description="Specialized care for heart-related conditions, including screenings, diagnostics, and personalized treatment plans."
        />
      </div>
    </div>
  );
};

export default Services;