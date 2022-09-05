import express from "express";
import { createCategory, getCategory, getCategoryById, deleteCategory, updateCategory } from "../controllers/category.js";


const router = express.Router();

router.get('/', getCategory)

router.post('/', createCategory)

router.get('/:id', getCategoryById)

router.delete('/:id', deleteCategory)

router.patch('/:id',updateCategory)

export default router;
