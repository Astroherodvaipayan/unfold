import React, { useState } from "react";
import { Button, Input, Toast, Tag } from "@shadcn/ui";

interface Expense {
  amount: number;
  description: string;
  date: string;
  category: "personal" | "merchant" | "travel";
  location?: string; // Location name or area
}

interface ExpenseLoggerProps {
  onSubmit: (expenseData: Expense) => void;
  isLoading: boolean;
  errorMessage?: string;
}

const ExpenseLogger: React.FC<ExpenseLoggerProps> = ({
  onSubmit,
  isLoading,
  errorMessage,
}) => {
  const [amount, setAmount] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [category, setCategory] = useState<"personal" | "merchant" | "travel">(
    "personal"
  );
  const [location, setLocation] = useState<string>("");
  const [isFetchingLocation, setIsFetchingLocation] = useState<boolean>(false);

  const fetchLocation = async () => {
    if (!navigator.geolocation) {
      Toast.error("Geolocation is not supported by your browser.");
      return;
    }

    setIsFetchingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          // Reverse geocoding using Mapbox Geocoding API
          const response = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=pk.eyJ1Ijoid2lwb2RydmNlIiwiYSI6ImNsdnVzN255YzE5MDYycm55c3hheDhtdTUifQ.lEWdCkssgxZWHlg0eGNkiw`
          );

          if (response.ok) {
            const data = await response.json();

            // Extracting the place name from the response
            const place =
              data.features?.[0]?.place_name || "Unknown Location";
            setLocation(place); // Save the location as a tag
            Toast.success(`Location detected: ${place}`);
          } else {
            Toast.error("Failed to fetch location details.");
          }
        } catch (error) {
          Toast.error("Error fetching location. Please try again.");
        } finally {
          setIsFetchingLocation(false);
        }
      },
      (error) => {
        Toast.error("Failed to get your location. Please check your settings.");
        setIsFetchingLocation(false);
      }
    );
  };

  const handleSubmit = async () => {
    if (!amount || !date) {
      Toast.error("Please fill all required fields.");
      return;
    }

    const expenseData: Expense = {
      amount: parseFloat(amount),
      description,
      date,
      category,
      location, // Location is passed as part of the expense data
    };

    try {
      await onSubmit(expenseData);
      Toast.success("Expense logged successfully.");
      setAmount("");
      setDescription("");
      setDate("");
      setCategory("personal"); // Reset to default category
      setLocation(""); // Reset location after submit
    } catch {
      Toast.error("Failed to log expense. Please try again.");
    }
  };

  return (
    <div className="space-y-4">
      <Input
        label="Amount"
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Enter amount"
        required
      />
      <Input
        label="Description"
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Add a description (optional)"
      />
      <Input
        label="Date"
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
          Category
        </label>
        <select
          id="category"
          name="category"
          value={category}
          onChange={(e) => setCategory(e.target.value as "personal" | "merchant" | "travel")}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          <option value="personal">Personal</option>
          <option value="merchant">Merchant</option>
          <option value="travel">Travel</option>
        </select>
      </div>
      {location && (
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Location:</span>
          <Tag>{location}</Tag> {/* Displaying the location as a tag */}
        </div>
      )}
      <Button onClick={fetchLocation} isLoading={isFetchingLocation}>
        {isFetchingLocation ? "Detecting Location..." : "Auto Detect Location"}
      </Button>
      <Button onClick={handleSubmit} isLoading={isLoading}>
        Submit
      </Button>
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
    </div>
  );
};

export default ExpenseLogger;
