const express = require("express");
const cors = require("cors");

require("dotenv").config();

const db = require("./config/db");
const auctionRoutes = require("./routes/auctionRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

const PORT = process.env.PORT || 5000;

// ============================================
// MIDDLEWARE
// ============================================

app.use(cors());
app.use(express.json());

// ============================================
// TEST ROUTE
// ============================================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "AgroBid Backend is running!",
  });
});

// ============================================
// PRODUCTS ROUTE
// ============================================

app.get("/api/products", async (req, res) => {
  try {
    const [products] = await db.query(`
      SELECT
        p.id,
        p.name,
        p.category,
        p.description,
        p.quantity,
        p.unit,
        p.starting_bid,
        p.harvest_date,
        p.location,
        p.image_url,
        p.status,
        p.seller_id,
        u.name AS seller_name
      FROM products p
      JOIN users u
        ON p.seller_id = u.id
      ORDER BY p.id ASC
    `);

    res.json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("Get products error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load products.",
    });
  }
});

app.get("/api/products/:id", async (req, res) => {
  try {
    const productId = Number(req.params.id);

    if (!Number.isInteger(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID.",
      });
    }

    const [products] = await db.query(
      `
      SELECT
        p.id,
        p.name,
        p.category,
        p.description,
        p.quantity,
        p.unit,
        p.starting_bid,
        p.harvest_date,
        p.location,
        p.image_url,
        p.status,
        p.seller_id,
        u.name AS seller_name
      FROM products p
      JOIN users u
        ON p.seller_id = u.id
      WHERE p.id = ?
      `,
      [productId]
    );

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    res.json({
      success: true,
      product: products[0],
    });
  } catch (error) {
    console.error("Get single product error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load product.",
    });
  }
});
// ============================================
// DATABASE TEST
// ============================================

app.get("/api/db-test", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT 1 AS result");

    res.json({
      success: true,
      message: "MySQL connected successfully!",
      data: rows,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "MySQL connection failed.",
    });
  }
});

// ============================================
// AUCTION ROUTES
// ============================================

app.use("/api/auctions", auctionRoutes);
app.use("/api/auth", authRoutes);

// ============================================
// AUTOMATIC AUCTION END PROCESS
// ============================================

async function processExpiredAuctions() {
  try {
    // Find all active auctions whose end time has passed
    const [expiredAuctions] = await db.query(`
      SELECT
        id,
        product_id,
        current_highest_bid,
        current_highest_bidder_id
      FROM auctions
      WHERE
        status = 'active'
        AND end_time <= NOW()
    `);

    // Nothing to process
    if (expiredAuctions.length === 0) {
      return;
    }

    for (const auction of expiredAuctions) {
      await db.query(
        `
        UPDATE auctions
        SET
          status = 'ended',
          winner_id = ?
        WHERE
          id = ?
          AND status = 'active'
        `,
        [
          auction.current_highest_bidder_id,
          auction.id,
        ]
      );

      console.log(
        `Auction ${auction.id} ended. Winner ID: ${
          auction.current_highest_bidder_id || "No winner"
        }`
      );
    }
  } catch (error) {
    console.error(
      "Automatic auction processing error:",
      error
    );
  }
}

// ============================================
// CHECK EXPIRED AUCTIONS EVERY 3 SECONDS
// ============================================

setInterval(() => {
  processExpiredAuctions();
}, 3000);

// ============================================
// START SERVER
// ============================================

app.listen(PORT, () => {
  console.log(
    `AgroBid server running on http://localhost:${PORT}`
  );

  console.log(
    "Automatic auction ending system is active."
  );
});