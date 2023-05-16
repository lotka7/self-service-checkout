import { Pool } from 'pg';

async function seedData() {
  const pool = new Pool({
    user: 'self-service-checkout',
    password: 'super-secret-password',
    host: 'localhost',
    port: 5432,
    database: 'self-service-checkout',
  });

  try {
    const client = await pool.connect();

    const currenciesCountQuery = 'SELECT COUNT(*) FROM currency';
    const currenciesCountResult = await client.query(currenciesCountQuery);
    const currenciesCount = parseInt(currenciesCountResult.rows[0].count, 10);

    if (currenciesCount === 0) {
      const currencies = [
        { currency: 'USD', value: 390 },
        { currency: 'EUR', value: 382 },
      ];

      for (const currency of currencies) {
        const insertQuery = {
          text: 'INSERT INTO currency (currency, value) VALUES ($1, $2)',
          values: [currency.currency, currency.value],
        };
        await client.query(insertQuery);
      }

      console.log('Seed data inserted successfully.');
    } else {
      console.log('Seed data already exists.');
    }

    client.release();
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await pool.end();
  }
}

seedData();
