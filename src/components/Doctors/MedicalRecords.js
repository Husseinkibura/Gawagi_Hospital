import { useState } from 'react';

const MedicalRecords = () => {
  const [searchId, setSearchId] = useState('');
  const [patient, setPatient] = useState(null);
  const [drugs, setDrugs] = useState([]);
  const [diseases, setDiseases] = useState([]);
  const [labTests, setLabTests] = useState([]);
  const [bills, setBills] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const calculateAge = (dateOfBirth) => {
    const birthDate = new Date(dateOfBirth);
    const difference = Date.now() - birthDate.getTime();
    const ageDate = new Date(difference);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchId.trim()) return;

    setIsLoading(true);
    setError('');
    setPatient(null);
    setDrugs([]);
    setDiseases([]);
    setLabTests([]);
    setBills([]);

    try {
      // Fetch patient data
      const patientResponse = await fetch(`http://localhost:5000/api/patients/${searchId}`);

      if (!patientResponse.ok) {
        throw new Error(
          patientResponse.status === 404
            ? 'Patient not found. Please check the ID and try again.'
            : 'Failed to fetch patient data'
        );
      }

      const patientData = await patientResponse.json();

      // Transform patient data for UI
      const processedPatientData = {
        ...patientData,
        age: calculateAge(patientData.DateOfBirth),
        lastVisit: new Date(patientData.createdAt).toLocaleDateString(),
        address: patientData.address,
        contact: `${patientData.mobile} | ${patientData.username}@example.com`,
      };

      setPatient(processedPatientData);

      // Fetch all services for the patient
      const servicesResponse = await fetch(`http://localhost:5000/api/patients/${searchId}/services`);
      if (!servicesResponse.ok) {
        throw new Error('Failed to fetch patient services');
      }

      const servicesData = await servicesResponse.json();

      // Update state with fetched services
      setDrugs(Array.isArray(servicesData.drugs) ? servicesData.drugs : []);
      setDiseases(Array.isArray(servicesData.diseases) ? servicesData.diseases : []);
      setLabTests(Array.isArray(servicesData.labTests) ? servicesData.labTests : []);
      setBills(Array.isArray(servicesData.bills) ? servicesData.bills : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Search Section */}
        <div className="mb-8 bg-white rounded-xl p-6 shadow-md">
          <h1 className="text-xl font-bold text-gray-800 mb-4">Patient Record Lookup</h1>
          <form onSubmit={handleSearch} className="flex gap-4">
            <input
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="Enter Patient ID (e.g., 1, 2, 11)"
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
            >
              {isLoading ? 'Searching...' : 'Search'}
            </button>
          </form>
          {error && <p className="text-red-600 mt-2">{error}</p>}
        </div>

        {/* Patient Data Display */}
        {patient && (
          <div className="space-y-6">
            {/* Personal Information */}
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Patient Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InfoCard label="Patient ID" value={patient.PatientId} />
                <InfoCard label="Full Name" value={patient.fullname} />
                <InfoCard label="Age" value={`${patient.age} years`} />
                <InfoCard label="Date of Birth" value={new Date(patient.DateOfBirth).toLocaleDateString()} />
                <InfoCard label="Role" value={patient.role} />
                <InfoCard label="Registered On" value={new Date(patient.createdAt).toLocaleDateString()} />
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-md">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Contact Details</h3>
                <InfoField label="Mobile Number" value={patient.mobile} />
                <InfoField label="Email" value={`${patient.username}@example.com`} />
                <InfoField label="Address" value={patient.address} />
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Account Information</h3>
                <InfoField label="Username" value={patient.username} />
                <InfoField label="Registration Date" value={new Date(patient.createdAt).toLocaleDateString()} />
                {patient.profileImage && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-500 mb-2">Profile Image</p>
                    <img
                      src={patient.profileImage}
                      alt="Profile"
                      className="w-32 h-32 rounded-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Medical Information Section */}
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Medical Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-sm font-semibold text-gray-500 mb-2">Medical History</h4>
                  <p className="text-gray-600">No medical history recorded</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-sm font-semibold text-gray-500 mb-2">Allergies</h4>
                  <p className="text-gray-600">No allergies recorded</p>
                </div>
              </div>
            </div>

            {/* Drugs Information */}
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Drugs</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {drugs.map((drug) => (
                  <div key={drug.id} className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="text-sm font-semibold text-gray-500 mb-2">{drug.name}</h4>
                    <p className="text-gray-600">Brand: {drug.brand_name}</p>
                    <p className="text-gray-600">Category: {drug.category}</p>
                    <p className="text-gray-600">Price: ${drug.price}</p>
                    <p className="text-gray-600">Expiry Date: {new Date(drug.expiry_date).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Diseases Information */}
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Diseases</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {diseases.map((disease, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="text-sm font-semibold text-gray-500 mb-2">Disease {index + 1}</h4>
                    <p className="text-gray-600">{disease.disease_name}</p>
                    <p className="text-gray-600">Description: {disease.description}</p>
                    <p className="text-gray-600">Treatment: {disease.treatment}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Lab Tests Information */}
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Lab Tests</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {labTests.map((test, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="text-sm font-semibold text-gray-500 mb-2">Test {index + 1}</h4>
                    <p className="text-gray-600">Test Type: {test.test_type}</p>
                    <p className="text-gray-600">Results: {test.results}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Bills Information */}
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Bills</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {bills.map((bill, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="text-sm font-semibold text-gray-500 mb-2">Bill {index + 1}</h4>
                    <p className="text-gray-600">Amount: ${bill.totalTestPrice + bill.totalDrugPrice}</p>
                    <p className="text-gray-600">Status: {bill.status}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Reusable Components
const InfoCard = ({ label, value }) => (
  <div className="bg-gray-50 p-4 rounded-lg">
    <p className="text-sm text-gray-500 mb-1">{label}</p>
    <p className="font-medium text-gray-800">{value}</p>
  </div>
);

const InfoField = ({ label, value }) => (
  <div className="mb-3">
    <p className="text-sm text-gray-500">{label}</p>
    <p className="text-gray-800">{value}</p>
  </div>
);

export default MedicalRecords;