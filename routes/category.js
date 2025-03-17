const express = require('express');
const router = express.Router();
const Category = require('../schemas/category'); // Import Category Schema

// Lấy danh sách tất cả category
router.get('/', async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json({ success: true, data: categories });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Lấy thông tin một category theo ID
router.get('/:id', async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
        res.status(200).json({ success: true, data: category });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Invalid ID format' });
    }
});

// Thêm một category mới (POST)
router.post('/', async (req, res) => {
    try {
        if (!req.body.name) {
            return res.status(400).json({ success: false, message: "Category name is required" });
        }
        const category = new Category({
            name: req.body.name,
            description: req.body.description || ""
        });

        const newCategory = await category.save();
        res.status(201).json({ success: true, data: newCategory });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

// Cập nhật category theo ID (PUT)
router.put('/:id', async (req, res) => {
    try {
        const updatedCategory = await Category.findByIdAndUpdate(
            req.params.id,
            { name: req.body.name, description: req.body.description },
            { new: true, runValidators: true }
        );
        if (!updatedCategory) return res.status(404).json({ success: false, message: 'Category not found' });
        res.status(200).json({ success: true, data: updatedCategory });
    } catch (err) {
        res.status(400).json({ success: false, message: 'Invalid ID format' });
    }
});

// Xóa category theo ID (DELETE)
router.delete('/:id', async (req, res) => {
    try {
        const deletedCategory = await Category.findByIdAndDelete(req.params.id);
        if (!deletedCategory) return res.status(404).json({ success: false, message: 'Category not found' });
        res.status(200).json({ success: true, message: 'Category deleted' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Invalid ID format' });
    }
});

module.exports = router;
