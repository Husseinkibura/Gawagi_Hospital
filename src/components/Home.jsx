import Button from "../layouts/Button";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center lg:px-32 px-5 text-white bg-[url('/src/assets/img/img2.jpg')] bg-no-repeat bg-cover opacity-90">
      <div className="w-full lg:w-4/5 space-y-5 mt-10">
        <h1 className="text-5xl font-bold leading-tight">
          Welcome To Gawagi Dispensary
        </h1>
        <p>
          At Gawagi Dispensary, we are dedicated to providing high-quality healthcare services to our community. Our mission is to ensure that every patient receives compassionate, personalized care in a welcoming and supportive environment. Whether you&apos;re seeking routine medical check-ups, specialized treatments, or expert advice, our team of experienced healthcare professionals is here to help you achieve optimal health and wellness.
        </p>

        <Button title="See Services" />
      </div>
    </div>
  );
};

export default Home;