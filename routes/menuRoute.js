import express from "express";
import { createMenu, getMenu, getMenuById, deleteMenu, updateMenu } from "../controllers/menu.js";


const router = express.Router();

router.get('/', getMenu)

router.post('/', createMenu)

router.get('/:id', getMenuById)

router.delete('/:id', deleteMenu)

router.patch('/:id',updateMenu)

export default router;
