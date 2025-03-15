import img from "../assets/img/about.jpg";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row justify-between items-center lg:px-32 px-5 pt-24 lg:pt-16 gap-5">
      <div className="w-full lg:w-3/4 space-y-4">
        <h1 className="text-4xl font-semibold text-center lg:text-start">About Us</h1>
        <p className="text-justify lg:text-start">
          At Gawagi Dispensary, we are more than just a healthcare provider—we are a trusted partner in your journey to better health. Established with a vision to deliver accessible and compassionate care, we strive to make a positive impact on the lives of our patients and the community we serve.
        </p>
        <p className="text-justify lg:text-start">
          Our team of dedicated healthcare professionals is committed to providing personalized, high-quality medical services tailored to meet your unique needs. From routine check-ups to specialized treatments, we ensure that every patient receives the attention and care they deserve in a warm and welcoming environment.
        </p>
        <p className="text-justify lg:text-start">
          At Gawagi Dispensary, we believe that health is a cornerstone of a thriving community. That’s why we go beyond treating illnesses—we focus on preventive care, health education, and building lasting relationships with our patients. Your well-being is our priority, and we are here to support you every step of the way.
        </p>
      </div>
      <div className="w-full lg:w-3/4">
        <img className="rounded-lg" src={img} alt="img" />
      </div>
    </div>
  );
};

export default About;