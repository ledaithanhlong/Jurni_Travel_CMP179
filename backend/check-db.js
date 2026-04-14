import db from './src/models/index.js';

async function check() {
  try {
    const [results] = await db.sequelize.query('DESCRIBE ActivityCategories;');
    console.log(results);
  } catch (error) {
    console.error(error);
  }
  process.exit();
}
check();
