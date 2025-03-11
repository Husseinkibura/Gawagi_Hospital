import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PhysicalCount = () => {
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    stock_quantity: '',
    quantityUsed: '',
    date: '',
  });
  const [drugs, setDrugs] = useState([]);
  const [remainingStock, setRemainingStock] = useState(null);

  // Load saved items from local storage on component mount
  useEffect(() => {
    const savedItems = JSON.parse(localStorage.getItem('pharmacyItems')) || [];
    setItems(savedItems);

    // Fetch all drugs to populate the dropdown or autocomplete
    const fetchDrugs = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/drugs');
        setDrugs(response.data);
      } catch (error) {
        console.error('Error fetching drugs:', error);
      }
    };

    fetchDrugs();
  }, []);

  // Save items to local storage whenever items change
  useEffect(() => {
    localStorage.setItem('pharmacyItems', JSON.stringify(items));
  }, [items]);

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'name') {
      try {
        // Fetch drug details by name from the backend
        const response = await axios.get(`http://localhost:5000/api/drugs/${value}`);
        if (response.data) {
          setFormData((prevState) => ({
            ...prevState,
            stock_quantity: response.data.stock_quantity,
          }));
          setRemainingStock(response.data.stock_quantity); // Initialize remaining stock
        }
      } catch (error) {
        console.error('Error fetching drug details:', error);
      }
    }

    if (name === 'quantityUsed') {
      // Calculate remaining stock dynamically
      const usedQuantity = parseFloat(value);
      const currentStock = parseFloat(formData.stock_quantity);
      if (!isNaN(usedQuantity) && !isNaN(currentStock)) {
        setRemainingStock(currentStock - usedQuantity);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate quantity used
    if (formData.quantityUsed > formData.stock_quantity) {
      alert('Quantity used cannot exceed stock quantity');
      return;
    }

    // Create new item with a serial number
    const newItem = {
      ...formData,
      id: Date.now(),
      remainingStock,
      serialNumber: items.length + 1, // Add serial number
    };

    // Add the new item to the list
    setItems([...items, newItem]);

    // Reset form data
    setFormData({ name: '', stock_quantity: '', quantityUsed: '', date: '' });
    setRemainingStock(null);

    // Update the stock quantity in the backend
    try {
      const selectedDrug = drugs.find((drug) => drug.name === newItem.name);
      if (selectedDrug) {
        await axios.post('http://localhost:5000/api/drugs/update-stock', {
          drugs: [{ id: selectedDrug.id, stock_quantity: remainingStock }],
        });
        console.log('Stock quantity updated successfully');
      }
    } catch (error) {
      console.error('Error updating stock quantity:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 nt-5">
      <h1 className="text-xl font-bold mt-5">Monthly Physical Count</h1>

      <form onSubmit={handleSubmit} className="mb-6 bg-white p-4 rounded shadow-md">
        <h2 className="text-xl font-semibold mb-4">Medication Counting</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Medication Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Stock Quantity</label>
            <input
              type="text"
              name="stock_quantity"
              value={formData.stock_quantity}
              readOnly
              className="w-full p-2 border rounded bg-gray-100"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Quantity Used</label>
            <input
              type="number"
              name="quantityUsed"
              value={formData.quantityUsed}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Remaining Stock</label>
            <input
              type="text"
              name="remainingStock"
              value={remainingStock !== null ? remainingStock : ''}
              readOnly
              className="w-full p-2 border rounded bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
        </div>
        <button
          type="submit"
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Submit
        </button>
      </form>

      <div className="bg-white p-4 rounded shadow-md">
        <h2 className="text-xl font-semibold mb-4">Physical Count Items</h2>
        {items.length === 0 ? (
          <p className="text-gray-600">No items added yet.</p>
        ) : (
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">S.No</th>
                <th className="py-2 px-4 border-b">Medication Name</th>
                <th className="py-2 px-4 border-b">Total Stock</th>
                <th className="py-2 px-4 border-b">Used Quantity</th>
                <th className="py-2 px-4 border-b">Remaining Stock</th>
                <th className="py-2 px-4 border-b">Date</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{index + 1}</td>
                  <td className="py-2 px-4 border-b">{item.name}</td>
                  <td className="py-2 px-4 border-b">{item.stock_quantity}</td>
                  <td className="py-2 px-4 border-b">{item.quantityUsed}</td>
                  <td className="py-2 px-4 border-b">{item.remainingStock}</td>
                  <td className="py-2 px-4 border-b">{new Date(item.date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default PhysicalCount;