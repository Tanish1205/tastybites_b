require('dotenv').config();
const mongoose = require('mongoose');
const { use } = require('react');
const mongoURI = process.env.MONGOURL; 

const mongoDB = async () => {
    try {
      await mongoose.connect(mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("connected to mongo successfully");
      const fetched_data =  mongoose.connection.db.collection("food-items");
      
      // await fetched_data.find({}).toArray(async (err, data) => {
      //   const food_category =  mongoose.connection.db.collection("food-category");
      //   food_category.find({}).toArray((err, categoryData) => {
      //     if (err) console.log(err);
      //     else {
      //       global.food_items = data;
      //       global.foodCategory = categoryData; 
      //     }
          
      //   })
      // });
      const data = await fetched_data.find({}).toArray();
      const food_category = await mongoose.connection.db.collection("food-category");
      const categorydata = await food_category.find({}).toArray();
      global.food_items = data; 
      global.foodCategory = categorydata;

    } catch (error) {
      console.error("Error connecting to mongo:", error);
    }
  };

  module.exports = mongoDB;