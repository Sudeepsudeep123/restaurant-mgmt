import { connectToCluster } from "../loaders/db_conn.js";
import mongoose from 'mongoose';

let mongoClient = await connectToCluster()
const db = mongoClient.db("RestaurantManagementSystem")
const col = db.collection("signup")


export const loginUser = (req, res) =>{
    mongoClient.connect(async err => {
        if (err) {
            console.log("Error connecting to MongoDB Cloud:\n\t" + err.toString());
        }
        console.log("Connected to the DB!");        
        try {
            if(req.body.email != null && req.body.password != null){
                const userData = await col.find(req.body).toArray();
                console.log(userData)

                var count = Object.keys(userData).length;
                console.log(count)
                if(count == 1){
                    res.status(201).json({"message": `Login Success.`}); 
                }
                else{
                    res.status(401).send({"message": `Username or Password incorrect.`}); 
                }
            }
            else{
                res.status(401).send({"message": `Username or Password incorrect.`}); 

            }
            }   catch (e) {
                console.log(e); 
                res.json({message: e});
                }
            await mongoClient.close();

    });
}