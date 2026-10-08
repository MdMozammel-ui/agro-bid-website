const express = require("express");

const router = express.Router();

const db = require("../config/db");

// ============================================================
// GET ALL ACTIVE AUCTIONS
// ============================================================

router.get("/", async (req, res) => {
  try {
    const [auctions] = await db.query(`
      SELECT
        a.id AS auction_id,
        a.product_id,
        a.start_time,
        a.end_time,
        a.current_highest_bid,
        a.current_highest_bidder_id,
        a.status,

        p.name,
        p.category,
        p.starting_bid,
        p.location,
        p.description,

        u.name AS seller_name

      FROM auctions a

      JOIN products p
        ON a.product_id = p.id

      JOIN users u
        ON p.seller_id = u.id

      WHERE
        a.status = 'active'
        AND a.end_time > NOW()

      ORDER BY a.end_time ASC
    `);

    res.json({
      success: true,
      auctions,
    });
  } catch (error) {
    console.error("Get auctions error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load auctions.",
    });
  }
});

// ============================================================
// GET COMPLETED / ENDED AUCTIONS
// ============================================================

router.get("/history/completed", async (req, res) => {
  try {
    const [auctions] = await db.query(`
      SELECT
        a.id AS auction_id,
        a.product_id,
        a.start_time,
        a.end_time,
        a.current_highest_bid,
        a.current_highest_bidder_id,
        a.winner_id,
        a.status,

        p.name,
        p.category,
        p.location,

        seller.name AS seller_name,

        winner.name AS winner_name

      FROM auctions a

      JOIN products p
        ON a.product_id = p.id

      JOIN users seller
        ON p.seller_id = seller.id

      LEFT JOIN users winner
        ON a.winner_id = winner.id

      WHERE a.status = 'ended'

      ORDER BY a.end_time DESC
    `);

    res.json({
      success: true,
      auctions,
    });
  } catch (error) {
    console.error(
      "Get completed auctions error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to load completed auctions.",
    });
  }
});

// ============================================================
// GET ACTIVE AUCTION BY PRODUCT ID
// ============================================================
//
// Example:
// GET /api/auctions/product/1
//
// এটি Product Details page-এর জন্য ব্যবহার হবে।
//
// ============================================================

router.get("/product/:productId", async (req, res) => {
  try {
    const productId = Number(req.params.productId);

    // --------------------------------------------
    // Validate product ID
    // --------------------------------------------

    if (!Number.isInteger(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID.",
      });
    }

    // --------------------------------------------
    // Find latest active auction for this product
    // --------------------------------------------

    const [auctions] = await db.query(
      `
      SELECT
        a.id AS auction_id,
        a.product_id,
        a.start_time,
        a.end_time,
        a.current_highest_bid,
        a.current_highest_bidder_id,
        a.status,

        p.name,
        p.category,
        p.starting_bid,
        p.location,
        p.description,

        seller.name AS seller_name,

        bidder.name AS highest_bidder_name

      FROM auctions a

      JOIN products p
        ON a.product_id = p.id

      JOIN users seller
        ON p.seller_id = seller.id

      LEFT JOIN users bidder
        ON a.current_highest_bidder_id = bidder.id

      WHERE
        a.product_id = ?
        AND a.status = 'active'
        AND a.end_time > NOW()

      ORDER BY a.id DESC

      LIMIT 1
      `,
      [productId]
    );

    // --------------------------------------------
    // No active auction
    // --------------------------------------------

    if (auctions.length === 0) {
      return res.json({
        success: true,
        auction: null,
      });
    }

    // --------------------------------------------
    // Return active auction
    // --------------------------------------------

    res.json({
      success: true,
      auction: auctions[0],
    });
  } catch (error) {
    console.error(
      "Get active auction by product error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to load active auction.",
    });
  }
});

// ============================================================
// GET SINGLE AUCTION
// ============================================================

router.get("/:auctionId", async (req, res) => {
  try {
    const auctionId = Number(req.params.auctionId);

    if (!Number.isInteger(auctionId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid auction ID.",
      });
    }

    const [auctions] = await db.query(
      `
      SELECT
        a.id AS auction_id,
        a.product_id,
        a.start_time,
        a.end_time,
        a.current_highest_bid,
        a.current_highest_bidder_id,
        a.winner_id,
        a.status,

        p.name,
        p.category,
        p.starting_bid,
        p.location,
        p.description,

        seller.name AS seller_name,

        winner.name AS winner_name

      FROM auctions a

      JOIN products p
        ON a.product_id = p.id

      JOIN users seller
        ON p.seller_id = seller.id

      LEFT JOIN users winner
        ON a.winner_id = winner.id

      WHERE a.id = ?
      `,
      [auctionId]
    );

    if (auctions.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Auction not found.",
      });
    }

    res.json({
      success: true,
      auction: auctions[0],
    });
  } catch (error) {
    console.error(
      "Get single auction error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to load auction.",
    });
  }
});

// ============================================================
// GET BID HISTORY
// ============================================================

router.get("/:auctionId/bids", async (req, res) => {
  try {
    const auctionId = Number(req.params.auctionId);

    if (!Number.isInteger(auctionId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid auction ID.",
      });
    }

    const [bids] = await db.query(
      `
      SELECT
        b.id,
        b.bidder_id,
        b.amount,
        b.created_at,
        u.name AS bidder_name

      FROM bids b

      JOIN users u
        ON b.bidder_id = u.id

      WHERE b.auction_id = ?

      ORDER BY b.created_at DESC
      `,
      [auctionId]
    );

    res.json({
      success: true,
      bids,
    });
  } catch (error) {
    console.error(
      "Get bid history error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to load bid history.",
    });
  }
});

// ============================================================
// PLACE BID
// ============================================================

router.post("/:auctionId/bid", async (req, res) => {
  const connection = await db.getConnection();

  try {
    const auctionId = Number(req.params.auctionId);
    const bidderId = Number(req.body.bidderId);
    const amount = Number(req.body.amount);

    // --------------------------------------------
    // Basic validation
    // --------------------------------------------

    if (!Number.isInteger(auctionId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid auction ID.",
      });
    }

    if (!Number.isInteger(bidderId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid bidder ID.",
      });
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid bid amount.",
      });
    }

    // --------------------------------------------
    // Start transaction
    // --------------------------------------------

    await connection.beginTransaction();

    // --------------------------------------------
    // Get auction with row lock
    // --------------------------------------------

    const [auctions] = await connection.query(
      `
      SELECT
        a.id,
        a.product_id,
        a.current_highest_bid,
        a.current_highest_bidder_id,
        a.status,
        a.end_time,

        p.seller_id,
        p.starting_bid

      FROM auctions a

      JOIN products p
        ON a.product_id = p.id

      WHERE a.id = ?

      FOR UPDATE
      `,
      [auctionId]
    );

    if (auctions.length === 0) {
      await connection.rollback();

      return res.status(404).json({
        success: false,
        message: "Auction not found.",
      });
    }

    const auction = auctions[0];

    // --------------------------------------------
    // Check auction status
    // --------------------------------------------

    if (auction.status !== "active") {
      await connection.rollback();

      return res.status(400).json({
        success: false,
        message: "This auction is not active.",
      });
    }

    // --------------------------------------------
    // Check auction end time
    // --------------------------------------------

    if (new Date(auction.end_time) <= new Date()) {
      await connection.rollback();

      return res.status(400).json({
        success: false,
        message: "This auction has already ended.",
      });
    }

    // --------------------------------------------
    // Seller cannot bid on own product
    // --------------------------------------------

    if (Number(auction.seller_id) === bidderId) {
      await connection.rollback();

      return res.status(403).json({
        success: false,
        message:
          "Seller cannot bid on their own product.",
      });
    }

    // --------------------------------------------
    // Check bidder exists
    // --------------------------------------------

    const [users] = await connection.query(
      `
      SELECT
        id,
        name,
        role

      FROM users

      WHERE id = ?
      `,
      [bidderId]
    );

    if (users.length === 0) {
      await connection.rollback();

      return res.status(404).json({
        success: false,
        message: "Bidder not found.",
      });
    }

    // --------------------------------------------
    // Bid must be higher than current highest bid
    // --------------------------------------------

    const currentHighestBid = Number(
      auction.current_highest_bid
    );

    if (amount <= currentHighestBid) {
      await connection.rollback();

      return res.status(400).json({
        success: false,
        message:
          `Your bid must be higher than ৳${currentHighestBid}.`,
      });
    }

    // --------------------------------------------
    // Insert new bid
    // --------------------------------------------

    await connection.query(
      `
      INSERT INTO bids
      (
        auction_id,
        bidder_id,
        amount
      )

      VALUES (?, ?, ?)
      `,
      [
        auctionId,
        bidderId,
        amount,
      ]
    );

    // --------------------------------------------
    // Update highest bid
    // --------------------------------------------

    await connection.query(
      `
      UPDATE auctions

      SET
        current_highest_bid = ?,
        current_highest_bidder_id = ?

      WHERE id = ?
      `,
      [
        amount,
        bidderId,
        auctionId,
      ]
    );

    // --------------------------------------------
    // Commit
    // --------------------------------------------

    await connection.commit();

    res.json({
      success: true,
      message: "Bid placed successfully.",

      bid: {
        auctionId,
        bidderId,
        amount,
      },
    });
  } catch (error) {
    await connection.rollback();

    console.error(
      "Place bid error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to place bid.",
    });
  } finally {
    connection.release();
  }
});

// ============================================================
// CREATE NEW AUCTION
// ============================================================
//
// IMPORTANT:
// এখানে আর পুরোনো auction UPDATE করা হবে না।
//
// প্রতিবার নতুন auction তৈরি হলে:
// - নতুন auction_id হবে
// - পুরোনো auction history থাকবে
// - পুরোনো bids থাকবে
// - নতুন auction-এর নতুন bid history হবে
//
// ============================================================

router.post("/", async (req, res) => {
  const connection = await db.getConnection();

  try {
    const productId = Number(req.body.productId);

    const durationMinutes = Number(
      req.body.durationMinutes
    );

    // --------------------------------------------
    // Validation
    // --------------------------------------------

    if (!Number.isInteger(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID.",
      });
    }

    if (![2, 10, 30, 60].includes(durationMinutes)) {
      return res.status(400).json({
        success: false,
        message:
          "Duration must be 2, 10, 30, or 60 minutes.",
      });
    }

    // --------------------------------------------
    // Start transaction
    // --------------------------------------------

    await connection.beginTransaction();

    // --------------------------------------------
    // Check product
    // --------------------------------------------

    const [products] = await connection.query(
      `
      SELECT
        id,
        name,
        starting_bid,
        seller_id,
        status

      FROM products

      WHERE id = ?

      FOR UPDATE
      `,
      [productId]
    );

    if (products.length === 0) {
      await connection.rollback();

      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    const product = products[0];

    // --------------------------------------------
    // Check currently active auction
    // --------------------------------------------

    const [activeAuctions] = await connection.query(
      `
      SELECT
        id,
        status,
        end_time

      FROM auctions

      WHERE
        product_id = ?
        AND status = 'active'

      ORDER BY id DESC

      LIMIT 1

      FOR UPDATE
      `,
      [productId]
    );

    // --------------------------------------------
    // Active auction still running
    // --------------------------------------------

    if (activeAuctions.length > 0) {
      const activeAuction = activeAuctions[0];

      if (
        new Date(activeAuction.end_time) >
        new Date()
      ) {
        await connection.rollback();

        return res.status(400).json({
          success: false,
          message:
            "This product already has an active auction.",
        });
      }

      // ------------------------------------------
      // Auction expired but status is still active
      // ------------------------------------------
      //
      // Automatic processor হয়তো এখনো process করেনি।
      // তাই নতুন auction তৈরির আগে পুরোনোটাকে ended করছি.
      //

      await connection.query(
        `
        UPDATE auctions

        SET
          status = 'ended',
          winner_id = current_highest_bidder_id

        WHERE id = ?
        `,
        [activeAuction.id]
      );
    }

    // ========================================================
    // CREATE COMPLETELY NEW AUCTION
    // ========================================================

    const [result] = await connection.query(
      `
      INSERT INTO auctions
      (
        product_id,
        start_time,
        end_time,
        current_highest_bid,
        current_highest_bidder_id,
        winner_id,
        status
      )

      VALUES
      (
        ?,
        NOW(),
        DATE_ADD(
          NOW(),
          INTERVAL ? MINUTE
        ),
        ?,
        NULL,
        NULL,
        'active'
      )
      `,
      [
        productId,
        durationMinutes,
        product.starting_bid,
      ]
    );

    const newAuctionId = result.insertId;

    // --------------------------------------------
    // Commit
    // --------------------------------------------

    await connection.commit();

    res.json({
      success: true,
      message:
        "New auction created successfully.",

      auctionId: newAuctionId,
    });
  } catch (error) {
    await connection.rollback();

    console.error(
      "Create auction error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to create auction.",
    });
  } finally {
    connection.release();
  }
});

// ============================================================
// MANUAL PROCESS ENDED AUCTIONS
// ============================================================
//
// Backup/manual endpoint.
// মূল automatic system server.js থেকে প্রতি 3 sec-এ
// expired auction process করবে.
//

router.post("/process-ended", async (req, res) => {
  try {
    const [result] = await db.query(`
      UPDATE auctions

      SET
        status = 'ended',
        winner_id = current_highest_bidder_id

      WHERE
        status = 'active'
        AND end_time <= NOW()
    `);

    res.json({
      success: true,
      message:
        "Ended auctions processed successfully.",

      affectedAuctions:
        result.affectedRows,
    });
  } catch (error) {
    console.error(
      "Process ended auctions error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to process ended auctions.",
    });
  }
});

// ============================================================
// EXPORT ROUTER
// ============================================================

module.exports = router;