import PropTypes from "prop-types"; // Add prop-types for validation

const ServicesCard = ({ icon, title }) => {
  // Define descriptions for each service
  const descriptions = {
    "Lab Test": "Accurate and reliable diagnostic tests to help identify health issues early and guide effective treatment plans.",
    "General Consultation": "Comprehensive health check-ups and consultations with experienced doctors to address your medical concerns.",
    "Heart Health": "Specialized care for heart-related conditions, including screenings, diagnostics, and personalized treatment plans.",
  };

  return (
    <div className="group flex flex-col items-center text-center gap-2 w-full lg:w-1/3 p-5 shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] rounded-lg cursor-pointer lg:hover:-translate-y-6 transition duration-300 ease-in-out">
      <div className="bg-[#d5f2ec] p-3 rounded-full transition-colors duration-300 ease-in-out group-hover:bg-[#ade9dc]">
        {icon}
      </div>
      <h1 className="font-semibold text-lg">{title}</h1>
      <p>
        {descriptions[title] || "We provide high-quality healthcare services tailored to your needs."}
      </p>

      <h3 className="text-backgroundColor cursor-pointer hover:text-[#ade9dc] transition duration-300 ease-in-out">
        Learn more
      </h3>
    </div>
  );
};

// Add prop-types validation
ServicesCard.propTypes = {
  icon: PropTypes.node.isRequired, // Validate that `icon` is a valid React node and is required
  title: PropTypes.string.isRequired, // Validate that `title` is a string and is required
};

export default ServicesCard;