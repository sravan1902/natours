const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
  console.log('UNHANDLER REJECTION! 💥 Shuting down...');
  console.log(err);
  console.log(err.name, err.message);
  process.exit(1); // shutdown
});

// const Tour = require('./models/tourModel');

// async function createManualIndex() {
//   try {
//     await Tour.collection.createIndex({ startLocation: '2dsphere' });
//     console.log('2dsphere index created manually on startLocation');

//     // Verify the index was created
//     const indexes = await Tour.collection.indexes();
//     console.log('Current indexes after manual creation:', indexes);
//   } catch (error) {
//     console.error('Error creating manual index:', error);
//   }
// }

// createManualIndex();

//connecting the config.env file from root
dotenv.config({ path: './config.env' });

const app = require('./app');

// logging the list of all environment variables
// console.log(process.env);

// mongoose
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose
  //   .connect(process.env.DATABASE_LOCAL, {
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    // console.log(con.connections);
    console.log('DB connection successful!');
  });

// const testTour = new Tour({
//   name: 'The Park Camper',
//   price: 997,
// });

// testTour
//   .save()
//   .then((doc) => {
//     console.log(doc);
//   })
//   .catch((err) => {
//     console.log('Error 💥', err);
//   });

/// SERVER
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLER REJECTION! 💥 Shuting down...');
  server.close(() => {
    process.exit(1); // shutdown
  });
});

// process.on('uncaughtException', (err) => {
//   console.log('UNHANDLER REJECTION! 💥 Shuting down...');
//   console.log(err.name, err.message);
//   server.close(() => {
//     process.exit(1); // shutdown
//   });
// });
// console.log(x);
