import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

interface SaleInfo {
  country: string;
  currencyCode: string;
  amount: number;
}

const PricePage: React.FC = () => {
  const [isbn, setIsbn] = useState("");
  const [country, setCountry] = useState("US");
  const [priceInfo, setPriceInfo] = useState<SaleInfo | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!isbn) {
      toast.warn("Please enter a valid ISBN.");
      return;
    }

    setLoading(true);
    setPriceInfo(null);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`/price?isbn=${isbn}&country=${country}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPriceInfo(response.data);
    } catch (error: any) {
      toast.error("❌ Could not find price for the given ISBN.");
      console.error("Error fetching price:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-lg mx-auto bg-white p-6 rounded-xl shadow-md border">
        <h1 className="text-2xl font-semibold mb-4 text-center">Book Price Finder</h1>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Enter ISBN (13 digits)"
            value={isbn}
            onChange={(e) => setIsbn(e.target.value)}
            className="w-full border rounded-md px-4 py-2"
          />

          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full border rounded-md px-4 py-2"
          >
            <option value="US">US</option>
            <option value="BR">Brazil</option>
            <option value="GB">United Kingdom</option>
            <option value="CA">Canada</option>
            <option value="DE">Germany</option>
          </select>

          <button
            onClick={handleSearch}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading ? "Searching..." : "Search Price"}
          </button>
        </div>

        {priceInfo && (
          <div className="mt-6 p-4 bg-green-100 rounded-md text-green-900">
            <p>
              <strong>Country:</strong> {priceInfo.country}
            </p>
            <p>
              <strong>Price:</strong> {priceInfo.amount} {priceInfo.currencyCode}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PricePage;
