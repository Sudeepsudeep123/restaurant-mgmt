import { MongoClient } from 'mongodb';
import mongoose from 'mongoose';
import { connectToCluster } from "../loaders/db_conn.js";

let mongoClient = await connectToCluster()
const db = mongoClient.db("RestaurantManagementSystem")
const col = db.collection("seat")

export const getSeat = async (req,  res) => {
        if (err) {
            console.log("Error connecting to MongoDB Cloud:\n\t" + err.toString());
        }
        console.log("Connected to the DB!");        
        try {
            const seatData = await col.find(req.body).toArray();
            console.log(getSeat.length - 1)
            console.log(seatData); 
            res.json(seatData);
        } catch (e) {
            console.log(e); 
            res.json({message: e});
        }
}

async function getlastSeatId(){
    const result = await col.find().sort({
        $natural: -1
    }).limit(1).toArray()
    console.log(result[0].seatId)
    return result[0].seatId
}

export const createSeat = async (req, res) =>{
    const seatCount = await getlastSeatId()

        await col.insertOne({
            "seatId" : seatCount +1,
            "reserved" : false
        }, function (err, doc) {
            if (err) {
                console.log(err)
                res.send(`seat create failed`)
            } else {
             res.status(201).send(`seat with name ${seatCount +1} added to the database`);
            }

          });
}

export const getSeatById = (req,res) =>{
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

export const deleteSeat = (req, res) =>{
    mongoClient.connect(async err => {

        if (err) {
            console.log("Error connecting to MongoDB Cloud:\n\t" + err.toString());
        }
        try {
            const DeleteParam = req.params.id
            var myquery = { _id: mongoose.Types.ObjectId(DeleteParam) }
            
            await col.deleteOne(myquery, function(err, obj) {
                if (err) throw err;
                    console.log(`seat with the id ${req.params.id} deleted from the database`); 
                    res.json(`seat with the id ${req.params.id} deleted from the database`);
              });    
        } catch (e) {
            console.log(e); 
            res.json({message: e});
        }
        await mongoClient.close();
    });

}