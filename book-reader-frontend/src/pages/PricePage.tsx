import React, { useState } from "react";
import { toast } from "react-toastify";
import { getBookPrice } from "../services/BookService";

interface SaleInfo {
  country: string;
  currencyCode?: string;
  amount?: number;
  saleability?: string;
}

const PricePage: React.FC = () => {
  const [isbn, setIsbn] = useState("");
  const [country, setCountry] = useState("US");
  const [priceInfo, setPriceInfo] = useState<SaleInfo | null>(null);
  const [loading, setLoading] = useState(false);

  const isValidIsbn = (value: string) => /^\d{13}$/.test(value);

  const handleSearch = async () => {
    if (!isValidIsbn(isbn)) {
      toast.warn("📕 Please enter a valid 13-digit ISBN.");
      return;
    }

    setLoading(true);
    setPriceInfo(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("❌ Authentication token not found.");
        return;
      }

      const data = await getBookPrice(token, isbn, country);

      if (!data.retailPrice || !data.retailPrice.amount || !data.retailPrice.currencyCode) {
        toast.info("ℹ️ This book is not available for sale in the selected country.");
      } else {
        toast.success("✅ Price found successfully!");
      }

      setPriceInfo({
        country: country,
        currencyCode: data.retailPrice?.currencyCode,
        amount: data.retailPrice?.amount,
        saleability: data.saleability,
      });
    } catch (error: any) {
      console.error("Error fetching price:", error);
      const message =
        error?.response?.data?.error ||
        "❌ Could not find price for the given ISBN. Please try again later.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-lg mx-auto bg-white p-6 rounded-2xl shadow-md border border-gray-200">
        <h1 className="text-2xl font-semibold mb-2 text-center text-blue-700">💰 Book Price Finder</h1>

        <p className="text-center text-sm text-gray-500 mb-6">
          Enter a valid ISBN-13 and select the country to check pricing from Google Books.
        </p>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">ISBN</label>
            <input
              type="text"
              placeholder="example: 9789355432728"
              value={isbn}
              onChange={(e) => setIsbn(e.target.value)}
              className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              maxLength={13}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Country</label>
            <div className="relative">
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full border rounded-md px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
              >
                <option value="US">🇺🇸 United States</option>
                <option value="BR">🇧🇷 Brazil</option>
                <option value="GB">🇬🇧 United Kingdom</option>
                <option value="CA">🇨🇦 Canada</option>
                <option value="DE">🇩🇪 Germany</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500">
                ▼
              </div>
            </div>
          </div>

          <button
            onClick={handleSearch}
            className={`w-full py-2 text-white rounded-md font-medium transition ${
              isValidIsbn(isbn)
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-300 cursor-not-allowed"
            }`}
            disabled={!isValidIsbn(isbn) || loading}
          >
            {loading ? "Searching..." : "Search Price"}
          </button>
        </div>

        {priceInfo && (
          <div className="mt-6 p-4 rounded-md text-center shadow-inner bg-gray-100">
            {priceInfo.amount && priceInfo.currencyCode ? (
              <>
                <p className="text-lg text-green-700">
                  💰 <strong>Price:</strong> {priceInfo.amount} {priceInfo.currencyCode}
                </p>
                <p className="text-sm text-gray-700 mt-1">
                  Country: {priceInfo.country}
                </p>
              </>
            ) : (
              <p className="text-red-700 font-medium">
                ⚠️ This book is not available for sale in {country}.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PricePage;
