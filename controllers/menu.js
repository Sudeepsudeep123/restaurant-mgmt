import mongoose from 'mongoose';
import { connectToCluster } from "../loaders/db_conn.js";

let mongoClient = await connectToCluster()
const db = mongoClient.db("RestaurantManagementSystem")
const col = db.collection("item")

export const getMenu = async (req,  res) => {
    mongoClient.connect(async err => {
        if (err) {
            console.log("Error connecting to MongoDB Cloud:\n\t" + err.toString());
        }
        console.log("Connected to the DB!");        
        try {

            const MenuData = await col.find(req.body).toArray();
            console.log(MenuData); 
            res.json(MenuData);
            console.log(MenuData.length)     

        } catch (e) {
            console.log(e); 
            res.json({message: e});
        }
        await mongoClient.close();
    });
}

async function getlastSeatId(){
    const result = await col.find().sort({
        $natural: -1
    }).limit(1).toArray()
    console.log(result[0].item_id)
    // await mongoClient.close();
    return result[0].item_id
}

export const createMenu = async (req, res) =>{
    const menuCount = await getlastSeatId()
       
    await col.insertOne({   
            "item_id" : menuCount + 1, 
            "item_name" : req.body.item_name, 
            "price" : req.body.price, 
            "catrgory_name" : req.body.catrgory_name 
        }
        , function (err, doc) {
            if (err) {
                console.log(err)
                res.send(`Menu create failed`)
            } else {
             res.status(201).send(`Menu with name ${req.body.item_name} added to the database`);
            }
          });
}

export const getMenuById = (req,res) =>{
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

export const deleteMenu = (req, res) =>{
    mongoClient.connect(async err => {

        if (err) {
            console.log("Error connecting to MongoDB Cloud:\n\t" + err.toString());
        }
        try {
            const DeleteParam = req.params.id
            var myquery = { _id: mongoose.Types.ObjectId(DeleteParam) }
            
            await col.deleteOne(myquery, function(err, obj) {
                if (err) throw err;
                    console.log(`Menu with the id ${req.params.id} deleted from the database`); 
                    res.json(`Menu with the id ${req.params.id} deleted from the database`);
              });    
        } catch (e) {
            console.log(e); 
            res.json({message: e});
        }
        await mongoClient.close();
    });

}

export const updateMenu =  (req, res) =>{
    const { id } = req.params;
    const {item_name, price , catrgory_name} = req.body;
    var myquery = { item_name: item_name , price: price, catrgory_name: catrgory_name };
    var getMenuById = { _id: mongoose.Types.ObjectId(req.params.id) }

    mongoClient.connect(async err => {

        if (err) {
            console.log("Error connecting to MongoDB Cloud:\n\t" + err.toString());
        }
        try {    
            const MenuData = await col.findOne(getMenuById)
            console.log(MenuData); 
            await col.updateOne({price : MenuData.price}, {$set: { price : price}})

            res.send(`Menu with the id ${req.params.id} has been updated`);
        } catch (e) {
            console.log(e); 
            res.json({message: e});
        }

        await mongoClient.close();
    });
}