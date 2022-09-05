import mongoose from 'mongoose';
import { connectToCluster } from "../loaders/db_conn.js";

let mongoClient = await connectToCluster()
const db = mongoClient.db("RestaurantManagementSystem")
const col = db.collection("category")

export const getCategory = async (req,  res) => {
    mongoClient.connect(async err => {
        if (err) {
            console.log("Error connecting to MongoDB Cloud:\n\t" + err.toString());
        }
        console.log("Connected to the DB!");        
        try {

            const categoryData = await col.find(req.body).toArray();
            console.log(categoryData); 
            res.json(categoryData);
        } catch (e) {
            console.log(e); 
            res.json({message: e});
        }
        await mongoClient.close();
    });
}

async function getlastCategoryId(){
    const result = await col.find().sort({
        $natural: -1
    }).limit(1).toArray()
    console.log(result[0].category_id)
    // await mongoClient.close();
    return result[0].category_id
}

export const createCategory = async (req, res) =>{
    const categoryCount = await getlastCategoryId()

        await col.insertOne({   
            "category_id" : categoryCount + 1, 
            "category_name" : req.body.category_name 
        }
        , function (err, doc) {
            if (err) {
                console.log(err)
                res.status(422).json({"message":`Category create failed`})
            } else {
             res.status(201).json({"message": `Category with name ${req.body.category_name} added to the database`});

            }
          });
}

export const getCategoryById = (req,res) =>{
    mongoClient.connect(async err => {
        if (err) {
            console.log("Error connecting to MongoDB Cloud:\n\t" + err.toString());
        }
        console.log("Connected to the DB!");        
        try {
            var myquery = { _id: mongoose.Types.ObjectId(req.params.id) }

            const specificData = await col.findOne(myquery)
            console.log(specificData); 
            res.json(specificData);
        } catch (e) {
            console.log(e); 
            res.json({message: e});
        }
        await mongoClient.close();
    });
   
}

export const deleteCategory = (req, res) =>{
    mongoClient.connect(async err => {

        if (err) {
            console.log("Error connecting to MongoDB Cloud:\n\t" + err.toString());
        }
        try {
            const DeleteParam = req.params.id
            var myquery = { _id: mongoose.Types.ObjectId(DeleteParam) }
            
            await col.deleteOne(myquery, function(err, obj) {
                if (err) throw err;
                    res.json({"message":`Category with the id ${req.params.id} deleted from the database`});
              });    
        } catch (e) {
            console.log(e); 
            res.json({message: e});
        }
        await mongoClient.close();
    });

}

export const updateCategory =  (req, res) =>{
    const { id } = req.params;
    const {item_name, price , category_name} = req.body;
    var myquery = { item_name: item_name , price: price, category_name: category_name };
    var getCategoryById = { _id: mongoose.Types.ObjectId(req.params.id) }

    mongoClient.connect(async err => {

        if (err) {
            console.log("Error connecting to MongoDB Cloud:\n\t" + err.toString());
        }
        try {    
            const categoryData = await col.findOne(getCategoryById)
            console.log(categoryData); 
            await col.updateOne({category_name : categoryData.category_name}, {$set: { category_name : category_name}})
            res.send(`Category with the id ${req.params.id} has been updated`);
        } catch (e) {
            console.log(e); 
            res.json({message: e});
        }

        await mongoClient.close();
    });
}