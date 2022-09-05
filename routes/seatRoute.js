import express from "express";
import {getSeat, getSeatById, deleteSeat, createSeat} from "../controllers/seat.js";

const router = express.Router();

router.get('/', getSeat)

router.post('/', createSeat)

router.get('/:id', getSeatById)

router.delete('/:id', deleteSeat)


export default router;
