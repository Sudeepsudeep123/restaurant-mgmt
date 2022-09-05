import express from "express";
import { createOrder, getOrder, getOrderById, deleteOrder, updateOrder, addOrder,updateQuantity} from "../controllers/order.js";
// import {getOrder, createOrder} from "../controllers/order.js";


const router = express.Router();

router.get('/', getOrder)

router.post('/', createOrder)

router.get('/:id', getOrderById)

router.delete('/:id', deleteOrder)

// router.patch('/:id',updateOrder)

router.patch('/:id',updateQuantity)

router.put('/:id',addOrder)


export default router;
