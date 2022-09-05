import { connectToCluster } from "../loaders/db_conn.js";

let mongoClient = await connectToCluster()
const db = mongoClient.db("RestaurantManagementSystem")
const col = db.collection("signup")

export const signupUser = (req, res) =>{
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
             res.status(201).send(`New user ${req.body.firstName} created`);

            }
          });
        await mongoClient.close();
    });
}