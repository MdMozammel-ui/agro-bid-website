import { useState } from "react";
import { Link } from "react-router-dom";

function AddProduct() {
  const [formData, setFormData] = useState({
    name: "",
    category: "Vegetables",
    description: "",
    quantity: "",
    unit: "Kg",
    minBid: "",
    bestPrice: "",
    harvestDate: "",
    location: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const requiredFields = [
      "name",
      "description",
      "quantity",
      "minBid",
      "bestPrice",
      "harvestDate",
      "location",
    ];

    const hasEmptyField = requiredFields.some(
      (field) => !formData[field]
    );

    if (hasEmptyField) {
      setError("Please fill in all required fields.");
      return;
    }

    if (
      Number(formData.bestPrice) <=
      Number(formData.minBid)
    ) {
      setError(
        "Best price must be greater than the minimum bid."
      );
      return;
    }

    setError("");

    alert("Product information is valid!");
  };

  return (
    <div className="bg-gray-50 px-6 py-12">

      <div className="mx-auto max-w-4xl">

        <Link
          to="/products"
          className="font-semibold text-green-700"
        >
          ← Back to Products
        </Link>

        <div className="mt-6 rounded-2xl border bg-white p-8 shadow-sm">

          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Add New Product
            </h1>

            <p className="mt-2 text-gray-500">
              List your agricultural product for buyers.
            </p>
          </div>

          {error && (
            <div className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-6"
          >

            {/* Product Name */}
            <div>
              <label className="mb-2 block text-sm font-semibold">
                Product Name *
              </label>

              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Example: Fresh Mango"
                className="w-full rounded-lg border px-4 py-3 outline-none focus:border-green-600"
              />
            </div>

            {/* Category */}
            <div>
              <label className="mb-2 block text-sm font-semibold">
                Category *
              </label>

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full rounded-lg border bg-white px-4 py-3 outline-none focus:border-green-600"
              >
                <option>Vegetables</option>
                <option>Fruits</option>
                <option>Grains</option>
                <option>Spices</option>
                <option>Root Crops</option>
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="mb-2 block text-sm font-semibold">
                Description *
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                placeholder="Describe your product..."
                className="w-full rounded-lg border px-4 py-3 outline-none focus:border-green-600"
              />
            </div>

            {/* Quantity */}
            <div className="grid gap-4 md:grid-cols-2">

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Quantity *
                </label>

                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  placeholder="Example: 100"
                  className="w-full rounded-lg border px-4 py-3 outline-none focus:border-green-600"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Unit
                </label>

                <select
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  className="w-full rounded-lg border bg-white px-4 py-3"
                >
                  <option>Kg</option>
                  <option>Ton</option>
                  <option>Piece</option>
                  <option>Bag</option>
                </select>
              </div>

            </div>

            {/* Prices */}
            <div className="grid gap-4 md:grid-cols-2">

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Minimum Bid Price *
                </label>

                <input
                  type="number"
                  name="minBid"
                  value={formData.minBid}
                  onChange={handleChange}
                  placeholder="৳ Minimum price"
                  className="w-full rounded-lg border px-4 py-3 outline-none focus:border-green-600"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Best / Instant Price *
                </label>

                <input
                  type="number"
                  name="bestPrice"
                  value={formData.bestPrice}
                  onChange={handleChange}
                  placeholder="৳ Best price"
                  className="w-full rounded-lg border px-4 py-3 outline-none focus:border-green-600"
                />
              </div>

            </div>

            {/* Harvest Date */}
            <div>
              <label className="mb-2 block text-sm font-semibold">
                Harvest Date *
              </label>

              <input
                type="date"
                name="harvestDate"
                value={formData.harvestDate}
                onChange={handleChange}
                className="w-full rounded-lg border px-4 py-3 outline-none focus:border-green-600"
              />
            </div>

            {/* Location */}
            <div>
              <label className="mb-2 block text-sm font-semibold">
                Location *
              </label>

              <input
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Example: Rajshahi"
                className="w-full rounded-lg border px-4 py-3 outline-none focus:border-green-600"
              />
            </div>

            {/* Image */}
            <div>
              <label className="mb-2 block text-sm font-semibold">
                Product Image
              </label>

              <input
                type="file"
                accept="image/*"
                className="w-full rounded-lg border bg-white px-4 py-3"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-green-600 py-3 font-semibold text-white hover:bg-green-700"
            >
              List Product
            </button>

          </form>

        </div>
      </div>
    </div>
  );
}

export default AddProduct;