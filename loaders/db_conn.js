import { MongoClient,ServerApiVersion } from 'mongodb';

let mongoClient;
export async function connectToCluster() {
 
    try {
        
        const uri = "mongodb+srv://admin:P%40ssw0rd@cluster0.egf8hcz.mongodb.net/?retryWrites=true&w=majority";
        mongoClient = await MongoClient.connect(uri);

        console.log('Connecting to MongoDB Atlas cluster...');
        // await mongoClient.connect();
        console.log('Successfully connected to MongoDB Atlas!');
        return mongoClient;
    } catch (error) {
        console.error('Connection to MongoDB Atlas failed!', error);
        process.exit();
    }
    
 }