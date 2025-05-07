const Hapi = require('@hapi/hapi');
const dotenv = require('dotenv');
const seedUsers = require('./seeds/userSeeder');
const seedLeaveBalances = require('./seeds/leaveBalanceSeeder');

const { initializeDatabase } = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const leaveRoutes = require('./routes/leaveRoutes');

dotenv.config();

const init = async () => {
  await initializeDatabase();
  await seedUsers();
  await seedLeaveBalances();

  const server = Hapi.server({
    port: process.env.PORT || 5000,
    host: 'localhost',
    routes: {
      cors: {
        origin: ['http://localhost:3000'],
        credentials: true,
      },
    },
  });

  server.route(authRoutes);
  server.route(leaveRoutes);

  await server.start();
  console.log('Server running on ', server.info.uri);
};

process.on('unhandledRejection', (err) => {
  console.error(err);
  process.exit(1);
});

init();
