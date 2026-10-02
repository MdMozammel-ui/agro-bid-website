import { Link, useParams } from "react-router-dom";

const products = [
  {
    id: 1,
    name: "Fresh Mango",
    category: "Fruits",
    location: "Rajshahi",
    minBid: 2000,
    seller: "Rahim Agro Farm",
    emoji: "🥭",
    description:
      "Fresh seasonal mangoes directly sourced from farmers in Rajshahi.",
  },
  {
    id: 2,
    name: "Fresh Tomato",
    category: "Vegetables",
    location: "Jessore",
    minBid: 1200,
    seller: "Green Field Farm",
    emoji: "🍅",
    description:
      "Fresh locally grown tomatoes suitable for household and commercial use.",
  },
  {
    id: 3,
    name: "Fresh Potato",
    category: "Vegetables",
    location: "Bogura",
    minBid: 1500,
    seller: "Bogura Farmers",
    emoji: "🥔",
    description:
      "Quality potatoes collected directly from farmers in Bogura.",
  },
  {
    id: 4,
    name: "Organic Banana",
    category: "Fruits",
    location: "Khulna",
    minBid: 1000,
    seller: "Fresh Harvest",
    emoji: "🍌",
    description:
      "Fresh bananas supplied directly from local agricultural farms.",
  },
  {
    id: 5,
    name: "Fresh Rice",
    category: "Grains",
    location: "Dinajpur",
    minBid: 3000,
    seller: "Dinajpur Agro",
    emoji: "🌾",
    description:
      "Quality rice produced and supplied by farmers from Dinajpur.",
  },
  {
    id: 6,
    name: "Green Chili",
    category: "Vegetables",
    location: "Mymensingh",
    minBid: 800,
    seller: "Village Fresh",
    emoji: "🌶️",
    description:
      "Fresh green chili collected from local farmers in Mymensingh.",
  },
];

function ProductDetails() {
  const { id } = useParams();

  const product = products.find(
    (item) => item.id === Number(id)
  );

  if (!product) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-20 text-center">

        <div className="text-6xl">😕</div>

        <h1 className="mt-5 text-3xl font-bold">
          Product Not Found
        </h1>

        <p className="mt-3 text-gray-500">
          The product you are looking for does not exist.
        </p>

        <Link
          to="/products"
          className="mt-6 inline-block rounded-lg bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700"
        >
          Back to Products
        </Link>

      </div>
    );
  }

  return (
    <div className="bg-gray-50">

      <div className="mx-auto max-w-7xl px-6 py-12">

        <Link
          to="/products"
          className="font-semibold text-green-700 hover:text-green-800"
        >
          ← Back to Products
        </Link>

        <div className="mt-8 grid gap-10 rounded-2xl bg-white p-8 shadow-sm md:grid-cols-2">

          {/* Product Image */}
          <div className="flex min-h-[420px] items-center justify-center rounded-xl bg-green-50 text-[150px]">
            {product.emoji}
          </div>

          {/* Product Information */}
          <div>

            <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
              {product.category}
            </span>

            <h1 className="mt-5 text-4xl font-bold text-gray-900">
              {product.name}
            </h1>

            <p className="mt-4 leading-7 text-gray-600">
              {product.description}
            </p>

            <div className="mt-7 space-y-5">

              {/* Starting Bid */}
              <div>
                <p className="text-sm text-gray-500">
                  Starting Bid
                </p>

                <p className="text-3xl font-bold text-green-700">
                  ৳{product.minBid.toLocaleString()}
                </p>
              </div>

              {/* Seller */}
              <div>
                <p className="text-sm text-gray-500">
                  Seller
                </p>

                <p className="font-semibold">
                  👨‍🌾 {product.seller}
                </p>
              </div>

              {/* Location */}
              <div>
                <p className="text-sm text-gray-500">
                  Location
                </p>

                <p className="font-semibold">
                  📍 {product.location}
                </p>
              </div>

            </div>

            {/* Auction Action */}
            <div className="mt-8">

              <Link
                to="/auction"
                className="block w-full rounded-lg bg-green-600 py-3 text-center font-semibold text-white hover:bg-green-700"
              >
                🔨 Go to Auction & Bid
              </Link>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;