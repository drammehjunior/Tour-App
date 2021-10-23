const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
const mongoose = require('mongoose');

const Tour = require("../../models/tourModel");


const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log("connection to database successful")).catch(err => console.log(`Connection to database was NOT successfull ${err}`));
 
//read json file

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'));

  //console.log(tours);

// import data into database

const importData = async () => {
    try{
        await Tour.create(tours);
        console.log("data is successfully loaded");
    }catch(err){
        console.log(err);
    }
    process.exit();
};

//delete all data from collection
const deleteData = async () => {
    try{
        await Tour.deleteMany();
        console.log('data successfully deleted');
    }catch(err){
        console.log(err);
    }
    process.exit();
};

if(process.argv[2] === '--import'){
    importData();
}else if(process.argv[2] === '--delete'){
    deleteData();
}

console.log(process.argv);