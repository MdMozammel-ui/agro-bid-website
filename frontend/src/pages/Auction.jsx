import { useEffect, useState } from "react";

const API_URL = "http://localhost:5000/api";

// Buyer One = 2
// Buyer Two = 3
// Buyer Three = 4
const CURRENT_BUYER_ID = 4;

// ============================================================
// COUNTDOWN
// ============================================================

function getTimeLeft(endTime) {
  const difference =
    new Date(endTime).getTime() -
    new Date().getTime();

  if (difference <= 0) {
    return "Ended";
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

  const seconds = totalSeconds % 60;

  return `${String(hours).padStart(2, "0")}:${String(
    minutes
  ).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

// ============================================================
// COUNTDOWN COMPONENT
// ============================================================

function Countdown({ endTime }) {
  const [timeLeft, setTimeLeft] = useState(
    getTimeLeft(endTime)
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft(endTime));
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime]);

  return (
    <span
      className={
        timeLeft === "Ended"
          ? "font-bold text-red-600"
          : "font-bold text-green-600"
      }
    >
      {timeLeft}
    </span>
  );
}

// ============================================================
// MAIN COMPONENT
// ============================================================

function Auction() {
  const [auctions, setAuctions] = useState([]);

  const [completedAuctions, setCompletedAuctions] =
    useState([]);

  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [selectedAuction, setSelectedAuction] =
    useState(null);

  const [bidHistory, setBidHistory] = useState([]);

  const [bidAmount, setBidAmount] = useState("");

  const [bidLoading, setBidLoading] =
    useState(false);

  const [showCreateForm, setShowCreateForm] =
    useState(false);

  const [productId, setProductId] = useState("");

  const [duration, setDuration] = useState("10");

  const [createLoading, setCreateLoading] =
    useState(false);

  const [createMessage, setCreateMessage] =
    useState("");

  // ============================================================
  // FETCH PRODUCTS
  // ============================================================

  const fetchProducts = async () => {
    try {
      const response = await fetch(
        `${API_URL}/products`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to load products."
        );
      }

      const productList = Array.isArray(data)
        ? data
        : data.products || [];

      setProducts(productList);

      if (
        productList.length > 0 &&
        !productId
      ) {
        setProductId(
          String(productList[0].id)
        );
      }
    } catch (error) {
      console.error(
        "Fetch products error:",
        error
      );
    }
  };

  // ============================================================
  // FETCH ACTIVE AUCTIONS
  // ============================================================

  const fetchAuctions = async () => {
    try {
      const response = await fetch(
        `${API_URL}/auctions`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to load auctions."
        );
      }

      setAuctions(data.auctions || []);

      setError("");
    } catch (error) {
      console.error(
        "Fetch auctions error:",
        error
      );

      setError(
        "Failed to load active auctions."
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // FETCH COMPLETED AUCTIONS
  // ============================================================

  const fetchCompletedAuctions = async () => {
    try {
      const response = await fetch(
        `${API_URL}/auctions/history/completed`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to load auction history."
        );
      }

      setCompletedAuctions(
        data.auctions || []
      );
    } catch (error) {
      console.error(
        "Fetch completed auctions error:",
        error
      );
    }
  };

  // ============================================================
  // FETCH SINGLE AUCTION
  // ============================================================

  const fetchSingleAuction = async (
    auctionId
  ) => {
    try {
      const response = await fetch(
        `${API_URL}/auctions/${auctionId}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to load auction."
        );
      }

      setSelectedAuction(data.auction);
    } catch (error) {
      console.error(
        "Fetch single auction error:",
        error
      );
    }
  };

  // ============================================================
  // FETCH BID HISTORY
  // ============================================================

  const fetchBidHistory = async (
    auctionId
  ) => {
    try {
      const response = await fetch(
        `${API_URL}/auctions/${auctionId}/bids`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to load bid history."
        );
      }

      setBidHistory(data.bids || []);
    } catch (error) {
      console.error(
        "Fetch bid history error:",
        error
      );
    }
  };

  // ============================================================
  // INITIAL LOAD
  // ============================================================

  useEffect(() => {
    fetchProducts();
    fetchAuctions();
    fetchCompletedAuctions();

    const interval = setInterval(() => {
      fetchAuctions();
      fetchCompletedAuctions();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // ============================================================
  // OPEN AUCTION
  // ============================================================

  const openAuction = async (auction) => {
    setSelectedAuction(auction);

    setBidAmount("");

    await Promise.all([
      fetchSingleAuction(
        auction.auction_id
      ),
      fetchBidHistory(
        auction.auction_id
      ),
    ]);
  };

  // ============================================================
  // CLOSE AUCTION
  // ============================================================

  const closeAuction = () => {
    setSelectedAuction(null);
    setBidHistory([]);
    setBidAmount("");
  };

  // ============================================================
  // PLACE BID
  // ============================================================

  const handleBid = async (e) => {
    e.preventDefault();

    if (!selectedAuction) {
      return;
    }

    const amount = Number(bidAmount);

    if (!Number.isFinite(amount)) {
      alert(
        "Please enter a valid bid amount."
      );
      return;
    }

    const currentHighest = Number(
      selectedAuction.current_highest_bid
    );

    if (amount <= currentHighest) {
      alert(
        `Your bid must be higher than ৳${currentHighest}.`
      );
      return;
    }

    try {
      setBidLoading(true);

      const response = await fetch(
        `${API_URL}/auctions/${selectedAuction.auction_id}/bid`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            bidderId: CURRENT_BUYER_ID,
            amount,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to place bid."
        );
      }

      alert(
        "Bid placed successfully! 🎉"
      );

      setBidAmount("");

      await fetchSingleAuction(
        selectedAuction.auction_id
      );

      await fetchBidHistory(
        selectedAuction.auction_id
      );

      await fetchAuctions();
    } catch (error) {
      console.error(
        "Place bid error:",
        error
      );

      alert(error.message);
    } finally {
      setBidLoading(false);
    }
  };

  // ============================================================
  // CREATE / RESTART AUCTION
  // ============================================================

  const handleCreateAuction = async (e) => {
    e.preventDefault();

    if (!productId) {
      alert("Please select a product.");
      return;
    }

    try {
      setCreateLoading(true);

      setCreateMessage("");

      const response = await fetch(
        `${API_URL}/auctions`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            productId: Number(productId),
            durationMinutes: Number(duration),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to create auction."
        );
      }

      setCreateMessage(
        data.message ||
          "Auction created successfully."
      );

      await fetchAuctions();
      await fetchCompletedAuctions();
    } catch (error) {
      console.error(
        "Create auction error:",
        error
      );

      setCreateMessage(error.message);
    } finally {
      setCreateLoading(false);
    }
  };

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl font-semibold">
          Loading auctions...
        </p>
      </div>
    );
  }

  // ============================================================
  // UI
  // ============================================================

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">

      <div className="max-w-6xl mx-auto">

        {/* ================================================== */}
        {/* HEADER */}
        {/* ================================================== */}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              🌾 Auctions
            </h1>

            <p className="text-gray-600 mt-2">
              Bid on fresh agricultural products
              directly from farmers.
            </p>
          </div>

          <button
            onClick={() =>
              setShowCreateForm(
                !showCreateForm
              )
            }
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-lg font-semibold"
          >
            {showCreateForm
              ? "Close Form"
              : "+ Create Auction"}
          </button>

        </div>

        {/* ================================================== */}
        {/* CREATE AUCTION FORM */}
        {/* ================================================== */}

        {showCreateForm && (
          <div className="bg-white rounded-xl shadow p-6 mb-10">

            <h2 className="text-xl font-bold mb-5">
              Create / Restart Auction
            </h2>

            <form
              onSubmit={handleCreateAuction}
              className="space-y-5"
            >

              <div>
                <label className="block font-semibold mb-2">
                  Select Product
                </label>

                <select
                  value={productId}
                  onChange={(e) =>
                    setProductId(
                      e.target.value
                    )
                  }
                  className="w-full border rounded-lg px-4 py-3"
                >

                  <option value="">
                    Select a product
                  </option>

                  {products.map((product) => (
                    <option
                      key={product.id}
                      value={product.id}
                    >
                      {product.name} - ৳
                      {product.starting_bid}
                    </option>
                  ))}

                </select>
              </div>

              <div>
                <label className="block font-semibold mb-2">
                  Auction Duration
                </label>

                <select
                  value={duration}
                  onChange={(e) =>
                    setDuration(
                      e.target.value
                    )
                  }
                  className="w-full border rounded-lg px-4 py-3"
                >

                  <option value="3">
                    3 Minutes
                  </option>

                  <option value="10">
                    10 Minutes
                  </option>

                  <option value="60">
                    1 Hour
                  </option>

                </select>
              </div>

              <button
                type="submit"
                disabled={createLoading}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-5 py-3 rounded-lg font-semibold"
              >
                {createLoading
                  ? "Creating..."
                  : "Start Auction"}
              </button>

              {createMessage && (
                <p className="text-sm font-medium">
                  {createMessage}
                </p>
              )}

            </form>
          </div>
        )}

        {/* ================================================== */}
        {/* ERROR */}
        {/* ================================================== */}

        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* ================================================== */}
        {/* ACTIVE AUCTIONS */}
        {/* ================================================== */}

        <h2 className="text-2xl font-bold mb-5">
          🔴 Live Auctions
        </h2>

        {auctions.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-8 text-center mb-12">

            <p className="text-xl font-semibold text-gray-700">
              No Active Auctions
            </p>

            <p className="text-gray-500 mt-2">
              Create an auction to start bidding.
            </p>

          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">

            {auctions.map((auction) => (
              <div
                key={auction.auction_id}
                className="bg-white rounded-xl shadow overflow-hidden"
              >

                <div className="h-40 bg-green-100 flex items-center justify-center">
                  <span className="text-6xl">
                    🌾
                  </span>
                </div>

                <div className="p-5">

                  <h3 className="text-xl font-bold">
                    {auction.name}
                  </h3>

                  <p className="text-gray-500">
                    {auction.category}
                  </p>

                  <p className="text-gray-600 mt-3">
                    📍 {auction.location}
                  </p>

                  <p className="text-gray-600">
                    👨‍🌾 {auction.seller_name}
                  </p>

                  <div className="mt-4">

                    <p className="text-sm text-gray-500">
                      Current Highest Bid
                    </p>

                    <p className="text-2xl font-bold text-green-600">
                      ৳
                      {Number(
                        auction.current_highest_bid
                      ).toLocaleString()}
                    </p>

                  </div>

                  <div className="mt-4">

                    <p className="text-sm text-gray-500">
                      Time Remaining
                    </p>

                    <Countdown
                      endTime={
                        auction.end_time
                      }
                    />

                  </div>

                  <button
                    onClick={() =>
                      openAuction(auction)
                    }
                    className="w-full mt-5 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold"
                  >
                    View Auction
                  </button>

                </div>
              </div>
            ))}

          </div>
        )}

        {/* ================================================== */}
        {/* COMPLETED AUCTIONS */}
        {/* ================================================== */}

        <div className="border-t pt-10">

          <div className="mb-6">

            <h2 className="text-2xl font-bold text-gray-900">
              🏁 Completed Auctions
            </h2>

            <p className="text-gray-500 mt-1">
              Previous auctions and their winners.
            </p>

          </div>

          {completedAuctions.length === 0 ? (
            <div className="bg-white rounded-xl shadow p-8 text-center">

              <p className="text-gray-500">
                No completed auctions yet.
              </p>

            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

              {completedAuctions.map(
                (auction) => (
                  <div
                    key={auction.auction_id}
                    className="bg-white rounded-xl shadow overflow-hidden"
                  >

                    <div className="h-32 bg-gray-100 flex items-center justify-center">

                      <span className="text-5xl">
                        🏁
                      </span>

                    </div>

                    <div className="p-5">

                      <div className="flex items-center justify-between">

                        <h3 className="text-xl font-bold">
                          {auction.name}
                        </h3>

                        <span className="text-xs font-bold bg-gray-200 px-2 py-1 rounded">
                          ENDED
                        </span>

                      </div>

                      <p className="text-gray-500 mt-1">
                        {auction.category}
                      </p>

                      <p className="text-gray-600 mt-3">
                        📍 {auction.location}
                      </p>

                      <p className="text-gray-600">
                        👨‍🌾 {auction.seller_name}
                      </p>

                      <div className="mt-5 bg-green-50 border border-green-200 rounded-lg p-4">

                        {auction.winner_id ? (
                          <>
                            <p className="text-sm text-gray-500">
                              🏆 Winner
                            </p>

                            <p className="text-lg font-bold text-green-700">
                              {auction.winner_name ||
                                `Buyer #${auction.winner_id}`}
                            </p>

                            <p className="text-sm text-gray-500 mt-3">
                              Winning Bid
                            </p>

                            <p className="text-xl font-bold text-green-700">
                              ৳
                              {Number(
                                auction.current_highest_bid
                              ).toLocaleString()}
                            </p>
                          </>
                        ) : (
                          <>
                            <p className="font-bold text-yellow-700">
                              No Winner
                            </p>

                            <p className="text-sm text-gray-600 mt-1">
                              No valid bid was placed.
                            </p>
                          </>
                        )}

                      </div>

                      <p className="text-xs text-gray-400 mt-4">
                        Ended:{" "}
                        {new Date(
                          auction.end_time
                        ).toLocaleString()}
                      </p>

                    </div>
                  </div>
                )
              )}

            </div>
          )}

        </div>

        {/* ================================================== */}
        {/* AUCTION MODAL */}
        {/* ================================================== */}

        {selectedAuction && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">

            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

              <div className="flex items-center justify-between p-6 border-b">

                <div>
                  <h2 className="text-2xl font-bold">
                    {selectedAuction.name}
                  </h2>

                  <p className="text-gray-500">
                    {selectedAuction.location}
                  </p>
                </div>

                <button
                  onClick={closeAuction}
                  className="text-2xl text-gray-500 hover:text-black"
                >
                  ✕
                </button>

              </div>

              <div className="p-6">

                {/* ========================================= */}
                {/* ENDED */}
                {/* ========================================= */}

                {selectedAuction.status ===
                "ended" ? (
                  <div className="bg-gray-100 rounded-xl p-6 mb-6 text-center">

                    <div className="text-5xl mb-3">
                      🏁
                    </div>

                    <h3 className="text-2xl font-bold">
                      Auction Ended
                    </h3>

                    {selectedAuction.winner_id ? (
                      <div className="mt-5 bg-green-50 border border-green-200 rounded-xl p-5">

                        <p className="text-sm text-gray-500">
                          🏆 Winner
                        </p>

                        <p className="text-2xl font-bold text-green-700 mt-1">
                          {selectedAuction.winner_name ||
                            `Buyer #${selectedAuction.winner_id}`}
                        </p>

                        <p className="text-sm text-gray-500 mt-4">
                          Winning Bid
                        </p>

                        <p className="text-2xl font-bold text-green-700">
                          ৳
                          {Number(
                            selectedAuction.current_highest_bid
                          ).toLocaleString()}
                        </p>

                      </div>
                    ) : (
                      <div className="mt-5 bg-yellow-50 border border-yellow-200 rounded-xl p-5">

                        <p className="text-lg font-semibold text-yellow-700">
                          No Winner
                        </p>

                        <p className="text-gray-600">
                          No valid bids were placed.
                        </p>

                      </div>
                    )}

                  </div>
                ) : (
                  /* ========================================= */
                  /* ACTIVE */
                  /* ========================================= */

                  <div className="bg-green-50 rounded-xl p-5 mb-6">

                    <div className="flex justify-between">

                      <div>
                        <p className="text-sm text-gray-500">
                          Time Remaining
                        </p>

                        <Countdown
                          endTime={
                            selectedAuction.end_time
                          }
                        />
                      </div>

                      <div className="text-right">

                        <p className="text-sm text-gray-500">
                          Current Highest Bid
                        </p>

                        <p className="text-2xl font-bold text-green-700">
                          ৳
                          {Number(
                            selectedAuction.current_highest_bid
                          ).toLocaleString()}
                        </p>

                      </div>

                    </div>

                  </div>
                )}

                {/* ========================================= */}
                {/* BID FORM */}
                {/* ========================================= */}

                {selectedAuction.status ===
                  "active" && (
                  <form
                    onSubmit={handleBid}
                    className="mb-8"
                  >

                    <label className="block font-semibold mb-2">
                      Enter Your Bid
                    </label>

                    <div className="flex gap-3">

                      <input
                        type="number"
                        min={
                          Number(
                            selectedAuction.current_highest_bid
                          ) + 1
                        }
                        value={bidAmount}
                        onChange={(e) =>
                          setBidAmount(
                            e.target.value
                          )
                        }
                        placeholder={`Minimum ৳${
                          Number(
                            selectedAuction.current_highest_bid
                          ) + 1
                        }`}
                        className="flex-1 border rounded-lg px-4 py-3"
                        required
                      />

                      <button
                        type="submit"
                        disabled={bidLoading}
                        className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-5 py-3 rounded-lg font-semibold"
                      >
                        {bidLoading
                          ? "Bidding..."
                          : "Place Bid"}
                      </button>

                    </div>
                  </form>
                )}

                {/* ========================================= */}
                {/* BID HISTORY */}
                {/* ========================================= */}

                <div>

                  <h3 className="text-xl font-bold mb-4">
                    Bid History
                  </h3>

                  {bidHistory.length === 0 ? (
                    <div className="bg-gray-50 rounded-lg p-5 text-center text-gray-500">
                      No bids yet.
                    </div>
                  ) : (
                    <div className="space-y-3">

                      {bidHistory.map(
                        (bid) => (
                          <div
                            key={bid.id}
                            className="flex items-center justify-between bg-gray-50 rounded-lg p-4"
                          >

                            <div>

                              <p className="font-semibold">
                                {bid.bidder_name}
                              </p>

                              <p className="text-sm text-gray-500">
                                {new Date(
                                  bid.created_at
                                ).toLocaleTimeString()}
                              </p>

                            </div>

                            <p className="font-bold text-green-600">
                              ৳
                              {Number(
                                bid.amount
                              ).toLocaleString()}
                            </p>

                          </div>
                        )
                      )}

                    </div>
                  )}

                </div>

              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default Auction;