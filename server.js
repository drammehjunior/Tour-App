process.on('uncaughtException', (err) => {
  console.log("UNCAUGHT EXEPTION💥 System shutting down...");
  console.log(err.stack);
  console.log()
  process.exit(1);
});

const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
const mongoose = require('mongoose');

const app = require('./app');

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log("connection to database successful"));
 
const port = process.env.PORT;

const server = app.listen(port, () => {
  console.log(`App running on port ${port}....`);
});

process.on('unhandledRejection', (err) => {
  console.log( err.name, err.message);
  console.log("UNHANDLED REJECTION! 💥 System shutting down...");
  server.close(() => {
    process.exit(1);
  });
});



