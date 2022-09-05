//This is just a demo for CRUD operation

import mongoose from 'mongoose';
import { connectToCluster } from "../loaders/db_conn.js";

let mongoClient = await connectToCluster()
const db = mongoClient.db("RestaurantManagementSystem")
const col = db.collection("signup")

export const getUser = async (req,  res) => {
    mongoClient.connect(async err => {
        if (err) {
            console.log("Error connecting to MongoDB Cloud:\n\t" + err.toString());
        }
        console.log("Connected to the DB!");        
        try {
            const userData = await col.find(req.body).toArray();
            console.log(userData); 
            res.json(userData);
        } catch (e) {
            console.log(e); 
            res.json({message: e});
        }
        await mongoClient.close();
    });
}

export const createUser = (req, res) =>{
    mongoClient.connect(async err => {
        if (err) {
            console.log("Error connecting to MongoDB Cloud:\n\t" + err.toString());
        }
        console.log("Connected to the DB!");        
        await col.insertOne(req.body, function (err, doc) {
            if (err) {
                console.log(err)
                res.send(`User create failed`)
            } else {
             res.status(201).send(`User with name ${req.body.firstName} added to the database`);

            }
          });
        await mongoClient.close();
    });
}

export const getUserById = (req,res) =>{
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

export const deleteUser = (req, res) =>{
    mongoClient.connect(async err => {

        if (err) {
            console.log("Error connecting to MongoDB Cloud:\n\t" + err.toString());
        }
        try {
            const DeleteParam = req.params.id
            var myquery = { _id: mongoose.Types.ObjectId(DeleteParam) }
            
            await col.deleteOne(myquery, function(err, obj) {
                if (err) throw err;
                    console.log(`User with the id ${req.params.id} deleted from the database`); 
                    res.json(`User with the id ${req.params.id} deleted from the database`);
              });    
        } catch (e) {
            console.log(e); 
            res.json({message: e});
        }
        await mongoClient.close();
    });

}

export const updateUser =  (req, res) =>{
    const { id } = req.params;
    const {firstName, lastName , age} = req.body;
    var myquery = { firstName: firstName , lastName: lastName, age: age };
    var getUserById = { _id: mongoose.Types.ObjectId(req.params.id) }

    mongoClient.connect(async err => {

        if (err) {
            console.log("Error connecting to MongoDB Cloud:\n\t" + err.toString());
        }
        try {    
            const userData = await col.findOne(getUserById)
            console.log(userData); 
            console.log(userData.firstName + "   and   " + firstName)

            await col.updateOne({firstName : userData.firstName}, {$set: { firstName : firstName}})

            res.send(`User with the id ${req.params.id} has been updated`);
        } catch (e) {
            console.log(e); 
            res.json({message: e});
        }

        await mongoClient.close();
    });
}