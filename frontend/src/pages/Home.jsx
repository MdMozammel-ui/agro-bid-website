import { Link } from "react-router-dom";

const featuredProducts = [
  {
    id: 1,
    name: "Fresh Mango",
    category: "Fruits",
    location: "Rajshahi",
    minBid: 2000,
    emoji: "🥭",
  },
  {
    id: 2,
    name: "Fresh Tomato",
    category: "Vegetables",
    location: "Jessore",
    minBid: 1200,
    emoji: "🍅",
  },
  {
    id: 5,
    name: "Fresh Rice",
    category: "Grains",
    location: "Dinajpur",
    minBid: 3000,
    emoji: "🌾",
  },
];

function Home() {
  return (
    <div className="bg-white">

      {/* ================= HERO ================= */}
      <section className="bg-gradient-to-br from-green-50 via-white to-emerald-50 px-6 py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-12 md:grid-cols-2">

          <div>
            <span className="inline-block rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
              🌱 Smart Agricultural Marketplace
            </span>

            <h1 className="mt-6 text-5xl font-extrabold leading-tight text-gray-900 md:text-6xl">
              Buy Fresh.
              <br />
              <span className="text-green-600">Sell Direct.</span>
              <br />
              Bid Smart.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-gray-600">
              AgroBid connects farmers directly with buyers through
              transparent auctions and instant purchase options.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/products"
                className="rounded-lg bg-green-600 px-6 py-3 font-semibold text-white shadow-md transition hover:bg-green-700"
              >
                Explore Products →
              </Link>

              <Link
                to="/register"
                className="rounded-lg border border-green-600 px-6 py-3 font-semibold text-green-700 transition hover:bg-green-50"
              >
                Start Selling
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-8 text-sm text-gray-600">
              <div>
                <p className="text-2xl font-bold text-green-700">100%</p>
                <p>Direct Trading</p>
              </div>

              <div>
                <p className="text-2xl font-bold text-green-700">24/7</p>
                <p>Marketplace</p>
              </div>

              <div>
                <p className="text-2xl font-bold text-green-700">Smart</p>
                <p>Trust System</p>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="flex h-[420px] w-full max-w-lg items-center justify-center rounded-3xl bg-green-100 text-[180px] shadow-inner">
              🌾
            </div>
          </div>

        </div>
      </section>

      {/* ================= CATEGORIES ================= */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-7xl">

          <div className="text-center">
            <p className="font-semibold text-green-600">
              EXPLORE
            </p>

            <h2 className="mt-2 text-3xl font-bold text-gray-900">
              Shop by Category
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-gray-600">
              Discover fresh agricultural products from farmers
              across Bangladesh.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 md:grid-cols-4">

            <Link
              to="/products"
              className="rounded-2xl border bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:border-green-300 hover:shadow-lg"
            >
              <div className="text-5xl">🥬</div>
              <h3 className="mt-4 text-lg font-bold">Vegetables</h3>
              <p className="mt-2 text-sm text-gray-500">
                Fresh vegetables
              </p>
            </Link>

            <Link
              to="/products"
              className="rounded-2xl border bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:border-green-300 hover:shadow-lg"
            >
              <div className="text-5xl">🥭</div>
              <h3 className="mt-4 text-lg font-bold">Fruits</h3>
              <p className="mt-2 text-sm text-gray-500">
                Seasonal fresh fruits
              </p>
            </Link>

            <Link
              to="/products"
              className="rounded-2xl border bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:border-green-300 hover:shadow-lg"
            >
              <div className="text-5xl">🌾</div>
              <h3 className="mt-4 text-lg font-bold">Grains</h3>
              <p className="mt-2 text-sm text-gray-500">
                Quality grains
              </p>
            </Link>

            <Link
              to="/products"
              className="rounded-2xl border bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:border-green-300 hover:shadow-lg"
            >
              <div className="text-5xl">🌶️</div>
              <h3 className="mt-4 text-lg font-bold">Spices</h3>
              <p className="mt-2 text-sm text-gray-500">
                Natural farm spices
              </p>
            </Link>

          </div>
        </div>
      </section>

      {/* ================= FEATURED PRODUCTS ================= */}
      <section className="bg-gray-50 px-6 py-16">
        <div className="mx-auto max-w-7xl">

          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">

            <div>
              <p className="font-semibold text-green-600">
                MARKETPLACE
              </p>

              <h2 className="mt-2 text-3xl font-bold text-gray-900">
                Featured Products
              </h2>

              <p className="mt-3 text-gray-600">
                Fresh products currently available for bidding.
              </p>
            </div>

            <Link
              to="/products"
              className="font-semibold text-green-700 hover:text-green-800"
            >
              View All Products →
            </Link>

          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">

            {featuredProducts.map((product) => (
              <div
                key={product.id}
                className="overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >

                <div className="flex h-48 items-center justify-center bg-green-50 text-8xl">
                  {product.emoji}
                </div>

                <div className="p-6">

                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-gray-900">
                      {product.name}
                    </h3>

                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                      {product.category}
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-gray-500">
                    📍 {product.location}
                  </p>

                  <div className="mt-5 rounded-lg bg-gray-50 p-4">

                    <p className="text-sm text-gray-500">
                      Starting Bid
                    </p>

                    <p className="text-2xl font-bold text-green-700">
                      ৳{product.minBid.toLocaleString()}
                    </p>

                  </div>

                  <Link
                    to={`/products/${product.id}`}
                    className="mt-5 block rounded-lg bg-green-600 py-3 text-center font-semibold text-white hover:bg-green-700"
                  >
                    View Details
                  </Link>

                </div>
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-7xl">

          <div className="text-center">
            <p className="font-semibold text-green-600">
              SIMPLE PROCESS
            </p>

            <h2 className="mt-2 text-3xl font-bold text-gray-900">
              How AgroBid Works
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-gray-600">
              A simple and transparent way to buy and sell
              agricultural products.
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-4">

            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-2xl font-bold text-green-700">
                01
              </div>

              <h3 className="mt-5 text-lg font-bold">
                List Products
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Farmers upload their products with price,
                quantity and other details.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-2xl font-bold text-green-700">
                02
              </div>

              <h3 className="mt-5 text-lg font-bold">
                Discover
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Buyers search and discover fresh products
                from different farmers.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-2xl font-bold text-green-700">
                03
              </div>

              <h3 className="mt-5 text-lg font-bold">
                Bid
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Buyers participate in auctions by placing
                valid bids.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-2xl font-bold text-green-700">
                04
              </div>

              <h3 className="mt-5 text-lg font-bold">
                Complete Transaction
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                The highest valid bidder wins when the
                auction ends.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ================= TRUST SECTION ================= */}
      <section className="bg-green-700 px-6 py-16 text-white">
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-2 md:items-center">

          <div>
            <p className="font-semibold text-green-200">
              TRUSTED MARKETPLACE
            </p>

            <h2 className="mt-3 text-3xl font-bold md:text-4xl">
              More Than Just Ratings
            </h2>

            <p className="mt-5 max-w-xl leading-7 text-green-50">
              AgroBid is designed to build a more trustworthy
              agricultural marketplace using transaction history,
              user feedback, seller behaviour and other
              evidence-based factors.
            </p>

            <Link
              to="/register"
              className="mt-7 inline-block rounded-lg bg-white px-6 py-3 font-semibold text-green-700 hover:bg-green-50"
            >
              Join AgroBid
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4">

            <div className="rounded-2xl bg-white/10 p-6 backdrop-blur">
              <div className="text-3xl">🤝</div>
              <h3 className="mt-3 font-bold">
                Direct Trading
              </h3>
              <p className="mt-2 text-sm text-green-100">
                Connect farmers directly with buyers.
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 p-6 backdrop-blur">
              <div className="text-3xl">🔨</div>
              <h3 className="mt-3 font-bold">
                Transparent Bidding
              </h3>
              <p className="mt-2 text-sm text-green-100">
                Fair and visible auction process.
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 p-6 backdrop-blur">
              <div className="text-3xl">⭐</div>
              <h3 className="mt-3 font-bold">
                Reliable Feedback
              </h3>
              <p className="mt-2 text-sm text-green-100">
                Ratings supported by transaction evidence.
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 p-6 backdrop-blur">
              <div className="text-3xl">🛡️</div>
              <h3 className="mt-3 font-bold">
                Trust System
              </h3>
              <p className="mt-2 text-sm text-green-100">
                Evidence-based seller trust indicators.
              </p>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
}

export default Home;