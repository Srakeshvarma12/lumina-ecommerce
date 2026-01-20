require("dotenv").config();
// const fetch = require("node-fetch");
const pool = require("../src/config/db");

const categories = [
  "smartphones"
];

async function importProducts() {
  try {
    console.log("🔄 Fetching products from API...");

    for (const cat of categories) {
      const res = await fetch(`https://dummyjson.com/products/category/${cat}`);
      const data = await res.json();

      for (const p of data.products) {
        await pool.query(
          `
          INSERT INTO products
          (name, description, price, stock, image_url, category)
          VALUES ($1,$2,$3,$4,$5,$6)
          `,
          [
            p.title,
            p.description,
            p.price,
            Math.floor(Math.random() * 60) + 20, // stock 20–80
            p.thumbnail,
            cat
          ]
        );
      }

      console.log(`✅ Imported category: ${cat}`);
    }

    console.log("🎉 ALL PRODUCTS IMPORTED SUCCESSFULLY");
    process.exit();

  } catch (err) {
    console.error("❌ Import failed:", err.message);
    process.exit(1);
  }
}

importProducts();
