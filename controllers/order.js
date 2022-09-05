import mongoose from 'mongoose';
import { connectToCluster } from "../loaders/db_conn.js";

let mongoClient = await connectToCluster()
const db = mongoClient.db("RestaurantManagementSystem")
const col = db.collection("order")

export const getOrder = async (req,  res) => {
    mongoClient.connect(async err => {
        if (err) {
            console.log("Error connecting to MongoDB Cloud:\n\t" + err.toString());
        }
        console.log("Connected to the DB!");        
        try {
            const orderData = await col.find(req.body).toArray();
            // console.log(orderData); 
            res.json(orderData);
        } catch (e) {
            console.log(e); 
            res.json({message: e});
        }
        await mongoClient.close();
    });
}

export const createOrder = async (req, res) =>{
        await col.insertOne({   
            "seat_id" : req.body.seat_id, 
            "order_items" : req.body.order_items,
            "total" : req.body.total,
            "date_time":  req.body.date_time
        }
        , function (err, doc) {
            if (err) {
                console.log(err)
                res.send(`Order create failed`)
            } else {
             res.status(201).send(`Order for seat ${req.body.seat_id} created`);
            console.log(req.body.order_items)
            }
          });
}

export const updateOrder =  (req, res) =>{
    const { id } = req.params;
    const {item_name, price , catrgory_name} = req.body;
    var myquery = { item_name: item_name , price: price, catrgory_name: catrgory_name };
    var getOrderById = { _id: mongoose.Types.ObjectId(req.params.id) }

    mongoClient.connect(async err => {

        if (err) {
            console.log("Error connecting to MongoDB Cloud:\n\t" + err.toString());
        }
        try {    
            const orderData = await col.findOne(getOrderById)
            console.log(orderData); 
            await col.updateOne({price : orderData.price}, {$set: { price : price}})

            res.send(`Order with the id ${req.params.id} has been updated`);
        } catch (e) {
            console.log(e); 
            res.json({message: e});
        }

        await mongoClient.close();
    });
}

export const updateQuantity =  (req, res) =>{
    const { id } = req.params;
    const {order_items, total , reserved} = req.body;
    var myquery = { order_items: order_items , total: total, reserved: reserved };
    var getOrderById = { _id: mongoose.Types.ObjectId(req.params.id) }

    mongoClient.connect(async err => {

        if (err) {
            console.log("Error connecting to MongoDB Cloud:\n\t" + err.toString());
        }
        try {    
            const orderData = await col.findOne(getOrderById)
            console.log(getOrderById);
            if(orderData){

                await col.updateOne({_id: mongoose.Types.ObjectId(req.params.id), "order_items.item": req.body.order_items[0].item }, {$set: { "order_items.$.quantity" : req.body.order_items[0].quantity}})
               
                res.status(201).json({"message": `Order for quantity of ${req.body.order_items[0].item} updated`});
            }
            else{
                res.status(422).json({"message" :`Order Id not found`});
            }

        } catch (e) {
            console.log(e); 
            res.json({message: e});
        }

        await mongoClient.close();
    });
}


export const getOrderById = (req,res) =>{
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

export const addOrder = (req,res) =>{
    mongoClient.connect(async err => {
        if (err) {
            console.log("Error connecting to MongoDB Cloud:\n\t" + err.toString());
        }
        console.log("Connected to the DB!");        
        try {
            var myquery = { _id: mongoose.Types.ObjectId(req.params.id) }
            const orderData = await col.findOne(myquery)
            console.log(orderData)
            if(orderData){
                for(let i = 0; i< req.body.order_items.length; i++){    
                    await col.updateOne({ _id: mongoose.Types.ObjectId(req.params.id) }, {$push: { order_items : req.body.order_items[i]}})
                }
                res.status(201).json({"message": `Order for seat ${mongoose.Types.ObjectId(req.params.id)} updated`});
            }
            else{
                res.status(422).json({"message" :`Order Id not found`});
            }
        
        } catch (e) {
            console.log(e); 
            res.json({message: e});
        }
        await mongoClient.close();
    });
}

export const deleteOrder = (req, res) =>{
    mongoClient.connect(async err => {

        if (err) {
            console.log("Error connecting to MongoDB Cloud:\n\t" + err.toString());
        }
        try {
            const DeleteParam = req.params.id
            var myquery = { _id: mongoose.Types.ObjectId(DeleteParam) }
            
            await col.deleteOne(myquery, function(err, obj) {
                if (err) throw err;
                    console.log(`Order with the id ${req.params.id} deleted from the database`); 
                    res.json(`Order with the id ${req.params.id} deleted from the database`);
              });    
        } catch (e) {
            console.log(e); 
            res.json({message: e});
        }
        await mongoClient.close();
    });

}