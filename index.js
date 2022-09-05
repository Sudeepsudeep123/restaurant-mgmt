import express from 'express';
import bodyParser from 'body-parser';
import userRoutes from './routes/user.js';
import signupRoutes from './routes/signupRoutes.js';
import loginRoute from './routes/loginRoute.js';
import seatRoute from './routes/seatRoute.js';
import menuRoute from './routes/menuRoute.js'
import categoryRoute from './routes/catrgoryRoute.js'
import orderRoute from './routes/orderRoute.js'

import { connectToCluster } from './loaders/db_conn.js';

const app = express();
const PORT = 5000;

await connectToCluster()
app.use(bodyParser.json());
app.use('/users', userRoutes);
app.use('/signup', signupRoutes);
app.use('/login', loginRoute);
app.use('/seat', seatRoute);
app.use('/menu', menuRoute);
app.use('/category', categoryRoute);
app.use('/order', orderRoute);


app.listen(PORT, () => console.log(`Server runnning on port: http://localhost: ${PORT}`));