/* eslint-disable */
// Create the first user in the database.
// Usage: SEED_PASSWORD=yourpassword node scripts/seed-user.js
// Optional: SEED_USERNAME=admin (default: admin)
//
// Requires DATABASE_URL or POSTGRES_URL in the environment.
// You can load .env.local with: node -r dotenv/config scripts/seed-user.js
const { neon } = require('@neondatabase/serverless');
const bcrypt = require('bcryptjs');

async function seed() {
  const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!connectionString) {
    console.error('Error: DATABASE_URL is not set.');
    process.exit(1);
  }

  const username = process.env.SEED_USERNAME || 'admin';
  const password = process.env.SEED_PASSWORD;
  if (!password) {
    console.error('Error: SEED_PASSWORD environment variable is required.');
    console.error('Usage: SEED_PASSWORD=yourpassword node scripts/seed-user.js');
    process.exit(1);
  }

  const sql = neon(connectionString);

  // Ensure users table exists
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(50) NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const passwordHash = await bcrypt.hash(password, 12);

  try {
    const rows = await sql`
      INSERT INTO users (username, password_hash)
      VALUES (${username}, ${passwordHash})
      RETURNING id, username
    `;
    console.log(`✓ User "${rows[0].username}" (id: ${rows[0].id}) created successfully.`);
  } catch (err) {
    if (err.message.includes('unique') || err.message.includes('duplicate')) {
      console.log(`User "${username}" already exists. Skipping.`);
    } else {
      throw err;
    }
  }
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
