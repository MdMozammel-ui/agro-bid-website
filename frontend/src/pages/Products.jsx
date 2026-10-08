import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_URL = "http://localhost:5000/api";

const productEmojis = {
  "Fresh Mango": "🥭",
  "Fresh Tomato": "🍅",
  "Fresh Potato": "🥔",
  "Organic Banana": "🍌",
  "Fresh Rice": "🌾",
  "Green Chili": "🌶️",
};

function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [location, setLocation] = useState("All Locations");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/products`);

        if (!response.ok) {
          throw new Error("Failed to load products.");
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error(
            data.message || "Failed to load products."
          );
        }

        setProducts(data.products);
      } catch (err) {
        console.error("Products loading error:", err);

        setError(
          err.message ||
            "Failed to load products."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      category === "All Categories" ||
      product.category === category;

    const matchesLocation =
      location === "All Locations" ||
      product.location === location;

    return (
      matchesSearch &&
      matchesCategory &&
      matchesLocation
    );
  });

  return (
    <div className="bg-gray-50">

      {/* Header */}
      <section className="bg-green-50 px-6 py-14">
        <div className="mx-auto max-w-7xl">

          <h1 className="text-4xl font-bold text-gray-900">
            Agricultural Products
          </h1>

          <p className="mt-3 max-w-2xl text-gray-600">
            Discover fresh agricultural products directly
            from farmers and participate in transparent
            auctions.
          </p>

        </div>
      </section>

      {/* Search & Filter */}
      <div className="mx-auto max-w-7xl px-6 py-8">

        <div className="flex flex-col gap-4 md:flex-row">

          <input
            type="text"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search products..."
            className="flex-1 rounded-lg border bg-white px-4 py-3 outline-none focus:border-green-600"
          />

          <select
            value={category}
            onChange={(e) =>
              setCategory(e.target.value)
            }
            className="rounded-lg border bg-white px-4 py-3"
          >
            <option>All Categories</option>
            <option>Fruits</option>
            <option>Vegetables</option>
            <option>Grains</option>
          </select>

          <select
            value={location}
            onChange={(e) =>
              setLocation(e.target.value)
            }
            className="rounded-lg border bg-white px-4 py-3"
          >
            <option>All Locations</option>
            <option>Rajshahi</option>
            <option>Jessore</option>
            <option>Bogura</option>
            <option>Khulna</option>
            <option>Dinajpur</option>
            <option>Mymensingh</option>
          </select>

        </div>

        {!loading && !error && (
          <p className="mt-4 text-sm text-gray-500">
            Showing {filteredProducts.length} product
            {filteredProducts.length !== 1
              ? "s"
              : ""}
          </p>
        )}

      </div>

      {/* Products */}
      <section className="mx-auto max-w-7xl px-6 pb-16">

        {/* Loading */}
        {loading && (
          <div className="rounded-xl border bg-white p-12 text-center">

            <div className="text-4xl">⏳</div>

            <h2 className="mt-4 text-xl font-semibold">
              Loading products...
            </h2>

          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-xl border bg-white p-12 text-center">

            <div className="text-5xl">⚠️</div>

            <h2 className="mt-4 text-2xl font-bold">
              Failed to Load Products
            </h2>

            <p className="mt-2 text-gray-500">
              {error}
            </p>

            <button
              onClick={() =>
                window.location.reload()
              }
              className="mt-6 rounded-lg bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700"
            >
              Try Again
            </button>

          </div>
        )}

        {/* No Products */}
        {!loading &&
          !error &&
          filteredProducts.length === 0 && (
            <div className="rounded-xl border bg-white p-12 text-center">

              <div className="text-5xl">🔍</div>

              <h2 className="mt-4 text-2xl font-bold">
                No products found
              </h2>

              <p className="mt-2 text-gray-500">
                Try changing your search or filters.
              </p>

            </div>
          )}

        {/* Product Cards */}
        {!loading &&
          !error &&
          filteredProducts.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

              {filteredProducts.map((product) => (

                <div
                  key={product.id}
                  className="overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >

                  {/* Product Image */}
                  <div className="flex h-52 items-center justify-center bg-green-50 text-8xl">
                    {productEmojis[product.name] || "🌱"}
                  </div>

                  <div className="p-6">

                    <div className="flex items-center justify-between gap-3">

                      <h2 className="text-xl font-bold text-gray-900">
                        {product.name}
                      </h2>

                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                        {product.category}
                      </span>

                    </div>

                    <p className="mt-2 text-sm text-gray-500">
                      📍 {product.location}
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      👨‍🌾 {product.seller_name}
                    </p>

                    <div className="mt-5 rounded-lg bg-gray-50 p-4">

                      <p className="text-sm text-gray-600">
                        Starting Bid
                      </p>

                      <p className="text-2xl font-bold text-green-700">
                        ৳
                        {Number(
                          product.starting_bid
                        ).toLocaleString()}
                      </p>

                    </div>

                    <div className="mt-5 flex gap-3">

                      <Link
                        to={`/products/${product.id}`}
                        className="flex-1 rounded-lg border border-green-600 py-2 text-center font-semibold text-green-700 hover:bg-green-50"
                      >
                        Details
                      </Link>

                      <Link
                        to="/auction"
                        className="flex-1 rounded-lg bg-green-600 py-2 text-center font-semibold text-white hover:bg-green-700"
                      >
                        Bid Now
                      </Link>

                    </div>

                  </div>

                </div>

              ))}

            </div>
          )}

      </section>

    </div>
  );
}

export default Products;