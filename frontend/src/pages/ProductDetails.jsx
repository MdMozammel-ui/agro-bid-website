import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const API_URL = "http://localhost:5000/api";

const productEmojis = {
  "Fresh Mango": "🥭",
  "Fresh Tomato": "🍅",
  "Fresh Potato": "🥔",
  "Organic Banana": "🍌",
  "Fresh Rice": "🌾",
  "Green Chili": "🌶️",
};

function ProductDetails() {
  const { id } = useParams();

  // ============================================================
  // CURRENT LOGGED-IN USER
  // ============================================================

  const storedUser =
    localStorage.getItem("agrobid_user");

  const currentUser = storedUser
    ? JSON.parse(storedUser)
    : null;

  // ============================================================
  // PRODUCT STATE
  // ============================================================

  const [product, setProduct] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // ============================================================
  // AUCTION STATE
  // ============================================================

  const [auction, setAuction] = useState(null);

  const [auctionLoading, setAuctionLoading] =
    useState(true);

  const [auctionError, setAuctionError] =
    useState("");

  // ============================================================
  // COUNTDOWN STATE
  // ============================================================

  const [timeLeft, setTimeLeft] = useState("");

  // ============================================================
  // BID STATE
  // ============================================================

  const [bidAmount, setBidAmount] = useState("");

  const [bidLoading, setBidLoading] =
    useState(false);

  const [bidMessage, setBidMessage] = useState("");

  const [bidError, setBidError] = useState("");

  // ============================================================
  // FETCH PRODUCT
  // ============================================================

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/products/${id}`
        );

        if (!response.ok) {
          throw new Error(
            "Failed to load product."
          );
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error(
            data.message ||
              "Failed to load product."
          );
        }

        setProduct(data.product);
      } catch (err) {
        console.error(
          "Product details loading error:",
          err
        );

        setError(
          err.message ||
            "Failed to load product."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // ============================================================
  // FETCH ACTIVE AUCTION
  // ============================================================

  const fetchAuction = async () => {
    try {
      setAuctionLoading(true);
      setAuctionError("");

      const response = await fetch(
        `${API_URL}/auctions/product/${id}`
      );

      if (!response.ok) {
        throw new Error(
          "Failed to load auction."
        );
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(
          data.message ||
            "Failed to load auction."
        );
      }

      setAuction(data.auction);
    } catch (err) {
      console.error(
        "Auction loading error:",
        err
      );

      setAuctionError(
        err.message ||
          "Failed to load auction."
      );
    } finally {
      setAuctionLoading(false);
    }
  };

  useEffect(() => {
    fetchAuction();
  }, [id]);

  // ============================================================
  // COUNTDOWN
  // ============================================================

  useEffect(() => {
    if (!auction) {
      setTimeLeft("");
      return;
    }

    const calculateTimeLeft = () => {
      const endTime = new Date(
        auction.end_time
      ).getTime();

      const now = new Date().getTime();

      const difference = endTime - now;

      if (difference <= 0) {
        setTimeLeft("Auction ended");
        return;
      }

      const totalSeconds = Math.floor(
        difference / 1000
      );

      const hours = Math.floor(
        totalSeconds / 3600
      );

      const minutes = Math.floor(
        (totalSeconds % 3600) / 60
      );

      const seconds =
        totalSeconds % 60;

      setTimeLeft(
        `${String(hours).padStart(
          2,
          "0"
        )}:${String(minutes).padStart(
          2,
          "0"
        )}:${String(seconds).padStart(
          2,
          "0"
        )}`
      );
    };

    calculateTimeLeft();

    const timer = setInterval(
      calculateTimeLeft,
      1000
    );

    return () =>
      clearInterval(timer);
  }, [auction]);

  // ============================================================
  // PLACE BID
  // ============================================================

  const handlePlaceBid = async (e) => {
    e.preventDefault();

    setBidMessage("");
    setBidError("");

    // Check login
    if (!currentUser) {
      setBidError(
        "Please login before placing a bid."
      );
      return;
    }

    // Only buyer can bid
    if (currentUser.role !== "buyer") {
      setBidError(
        "Only buyers can place bids."
      );
      return;
    }

    if (!auction) {
      setBidError(
        "There is no active auction."
      );
      return;
    }

    const amount = Number(bidAmount);

    const currentHighestBid = Number(
      auction.current_highest_bid
    );

    if (
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      setBidError(
        "Please enter a valid bid amount."
      );
      return;
    }

    if (amount <= currentHighestBid) {
      setBidError(
        `Your bid must be higher than ৳${currentHighestBid.toLocaleString()}.`
      );
      return;
    }

    try {
      setBidLoading(true);

      const response = await fetch(
        `${API_URL}/auctions/${auction.auction_id}/bid`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            bidderId: currentUser.id,
            amount,
          }),
        }
      );

      const data = await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Failed to place bid."
        );
      }

      setBidMessage(
        "Bid placed successfully! 🎉"
      );

      setBidAmount("");

      // Reload auction information
      await fetchAuction();
    } catch (err) {
      console.error(
        "Place bid error:",
        err
      );

      setBidError(
        err.message ||
          "Failed to place bid."
      );
    } finally {
      setBidLoading(false);
    }
  };

  // ============================================================
  // PRODUCT LOADING
  // ============================================================

  if (loading) {
    return (
      <div className="bg-gray-50 px-6 py-20">
        <div className="mx-auto max-w-4xl rounded-2xl border bg-white p-12 text-center">

          <div className="text-5xl">
            ⏳
          </div>

          <h1 className="mt-5 text-2xl font-bold">
            Loading Product...
          </h1>

          <p className="mt-2 text-gray-500">
            Please wait while we load the
            product details.
          </p>

        </div>
      </div>
    );
  }

  // ============================================================
  // PRODUCT ERROR
  // ============================================================

  if (error || !product) {
    return (
      <div className="bg-gray-50 px-6 py-20">
        <div className="mx-auto max-w-4xl rounded-2xl border bg-white p-12 text-center">

          <div className="text-6xl">
            😕
          </div>

          <h1 className="mt-5 text-3xl font-bold text-gray-900">
            Product Not Found
          </h1>

          <p className="mt-3 text-gray-500">
            {error ||
              "The product you are looking for does not exist."}
          </p>

          <Link
            to="/products"
            className="mt-6 inline-block rounded-lg bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700"
          >
            Back to Products
          </Link>

        </div>
      </div>
    );
  }

  // ============================================================
  // PRODUCT DATA
  // ============================================================

  const emoji =
    productEmojis[product.name] ||
    "🌱";

  const formattedHarvestDate =
    product.harvest_date
      ? new Date(
          product.harvest_date
        ).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        })
      : "Not available";

  const currentHighestBid = auction
    ? Number(
        auction.current_highest_bid
      )
    : Number(product.starting_bid);

  const isAuctionEnded =
    auction &&
    timeLeft === "Auction ended";

  // ============================================================
  // UI
  // ============================================================

  return (
    <div className="bg-gray-50">

      <div className="mx-auto max-w-7xl px-6 py-12">

        {/* ================================================== */}
        {/* BACK BUTTON */}
        {/* ================================================== */}

        <Link
          to="/products"
          className="font-semibold text-green-700 hover:text-green-800"
        >
          ← Back to Products
        </Link>

        {/* ================================================== */}
        {/* PRODUCT DETAILS */}
        {/* ================================================== */}

        <div className="mt-8 grid gap-10 rounded-2xl bg-white p-8 shadow-sm md:grid-cols-2">

          {/* PRODUCT IMAGE */}

          <div className="flex min-h-[420px] items-center justify-center overflow-hidden rounded-xl bg-green-50 text-[150px]">

            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="h-full max-h-[420px] w-full object-cover"
              />
            ) : (
              emoji
            )}

          </div>

          {/* PRODUCT INFORMATION */}

          <div>

            <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
              {product.category}
            </span>

            <h1 className="mt-5 text-4xl font-bold text-gray-900">
              {product.name}
            </h1>

            <p className="mt-4 leading-7 text-gray-600">
              {product.description ||
                "No description available."}
            </p>

            <div className="mt-7 space-y-5">

              {/* STARTING BID */}

              <div>

                <p className="text-sm text-gray-500">
                  Starting Bid
                </p>

                <p className="text-3xl font-bold text-green-700">
                  ৳
                  {Number(
                    product.starting_bid
                  ).toLocaleString()}
                </p>

              </div>

              {/* SELLER */}

              <div>

                <p className="text-sm text-gray-500">
                  Seller
                </p>

                <p className="font-semibold">
                  👨‍🌾{" "}
                  {product.seller_name}
                </p>

              </div>

              {/* LOCATION */}

              <div>

                <p className="text-sm text-gray-500">
                  Location
                </p>

                <p className="font-semibold">
                  📍 {product.location}
                </p>

              </div>

              {/* QUANTITY */}

              <div>

                <p className="text-sm text-gray-500">
                  Available Quantity
                </p>

                <p className="font-semibold">
                  📦{" "}
                  {Number(
                    product.quantity
                  ).toLocaleString()}{" "}
                  {product.unit}
                </p>

              </div>

              {/* HARVEST DATE */}

              <div>

                <p className="text-sm text-gray-500">
                  Harvest Date
                </p>

                <p className="font-semibold">
                  🌱{" "}
                  {formattedHarvestDate}
                </p>

              </div>

              {/* STATUS */}

              <div>

                <p className="text-sm text-gray-500">
                  Product Status
                </p>

                <span className="mt-1 inline-block rounded-full bg-green-100 px-3 py-1 text-sm font-semibold capitalize text-green-700">
                  {product.status}
                </span>

              </div>

            </div>

          </div>

        </div>

        {/* ================================================== */}
        {/* AUCTION SECTION */}
        {/* ================================================== */}

        <div className="mt-10 rounded-2xl border bg-white p-8 shadow-sm">

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <h2 className="text-2xl font-bold text-gray-900">
                🔨 Live Auction
              </h2>

              <p className="mt-1 text-gray-500">
                Bid directly on this product.
              </p>

            </div>

            {auction && (
              <span className="inline-flex w-fit items-center rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
                🟢 Active
              </span>
            )}

          </div>

          {/* AUCTION LOADING */}

          {auctionLoading && (
            <div className="mt-8 rounded-xl bg-gray-50 p-8 text-center">

              <div className="text-4xl">
                ⏳
              </div>

              <p className="mt-3 font-semibold text-gray-700">
                Loading auction...
              </p>

            </div>
          )}

          {/* AUCTION ERROR */}

          {!auctionLoading &&
            auctionError && (
              <div className="mt-8 rounded-xl bg-red-50 p-6 text-center">

                <p className="font-semibold text-red-700">
                  {auctionError}
                </p>

                <button
                  onClick={fetchAuction}
                  className="mt-4 rounded-lg bg-red-600 px-5 py-2 font-semibold text-white hover:bg-red-700"
                >
                  Try Again
                </button>

              </div>
            )}

          {/* NO ACTIVE AUCTION */}

          {!auctionLoading &&
            !auctionError &&
            !auction && (
              <div className="mt-8 rounded-xl border border-dashed bg-gray-50 p-10 text-center">

                <div className="text-5xl">
                  🔨
                </div>

                <h3 className="mt-4 text-xl font-bold text-gray-900">
                  No Active Auction
                </h3>

                <p className="mt-2 text-gray-500">
                  There is currently no active
                  auction for this product.
                </p>

                <Link
                  to="/auction"
                  className="mt-5 inline-block rounded-lg bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700"
                >
                  View Auctions
                </Link>

              </div>
            )}

          {/* ACTIVE AUCTION */}

          {!auctionLoading &&
            auction &&
            !isAuctionEnded && (
              <div className="mt-8">

                {/* AUCTION INFO */}

                <div className="grid gap-5 sm:grid-cols-3">

                  {/* CURRENT BID */}

                  <div className="rounded-xl bg-green-50 p-5">

                    <p className="text-sm text-gray-600">
                      Current Highest Bid
                    </p>

                    <p className="mt-2 text-3xl font-bold text-green-700">
                      ৳
                      {currentHighestBid.toLocaleString()}
                    </p>

                  </div>

                  {/* HIGHEST BIDDER */}

                  <div className="rounded-xl bg-blue-50 p-5">

                    <p className="text-sm text-gray-600">
                      Highest Bidder
                    </p>

                    <p className="mt-2 text-xl font-bold text-gray-900">
                      {auction.highest_bidder_name ||
                        "No bids yet"}
                    </p>

                  </div>

                  {/* COUNTDOWN */}

                  <div className="rounded-xl bg-orange-50 p-5">

                    <p className="text-sm text-gray-600">
                      Time Remaining
                    </p>

                    <p className="mt-2 text-2xl font-bold text-orange-600">
                      ⏱️ {timeLeft}
                    </p>

                  </div>

                </div>

                {/* BID FORM */}

                <div className="mt-8 rounded-xl border p-6">

                  <h3 className="text-xl font-bold text-gray-900">
                    Place Your Bid
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">

                    Your bid must be higher than{" "}

                    <span className="font-semibold text-green-700">
                      ৳
                      {currentHighestBid.toLocaleString()}
                    </span>

                  </p>

                  <form
                    onSubmit={handlePlaceBid}
                    className="mt-5 flex flex-col gap-3 sm:flex-row"
                  >

                    <input
                      type="number"
                      min={
                        currentHighestBid + 1
                      }
                      step="1"
                      value={bidAmount}
                      onChange={(e) =>
                        setBidAmount(
                          e.target.value
                        )
                      }
                      placeholder={`Enter more than ৳${currentHighestBid}`}
                      disabled={bidLoading}
                      className="flex-1 rounded-lg border px-4 py-3 outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
                    />

                    <button
                      type="submit"
                      disabled={bidLoading}
                      className="rounded-lg bg-green-600 px-7 py-3 font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {bidLoading
                        ? "Placing Bid..."
                        : "🔨 Place Bid"}
                    </button>

                  </form>

                  {/* SUCCESS MESSAGE */}

                  {bidMessage && (
                    <div className="mt-4 rounded-lg bg-green-50 px-4 py-3 font-semibold text-green-700">
                      {bidMessage}
                    </div>
                  )}

                  {/* ERROR MESSAGE */}

                  {bidError && (
                    <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 font-semibold text-red-700">
                      {bidError}
                    </div>
                  )}

                </div>

                {/* AUCTION ID */}

                <p className="mt-5 text-xs text-gray-400">
                  Auction ID:{" "}
                  {auction.auction_id}
                </p>

              </div>
            )}

          {/* AUCTION ENDED */}

          {!auctionLoading &&
            auction &&
            isAuctionEnded && (
              <div className="mt-8 rounded-xl bg-red-50 p-8 text-center">

                <div className="text-5xl">
                  ⏰
                </div>

                <h3 className="mt-4 text-2xl font-bold text-gray-900">
                  Auction Ended
                </h3>

                <p className="mt-2 text-gray-600">
                  This auction has ended.
                </p>

                <p className="mt-3 text-xl font-bold text-green-700">
                  Final Bid: ৳
                  {currentHighestBid.toLocaleString()}
                </p>

              </div>
            )}

        </div>

      </div>

    </div>
  );
}

export default ProductDetails;