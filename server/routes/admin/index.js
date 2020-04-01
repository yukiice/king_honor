module.exports = app => {
    const express = require('express')
    const router = express.Router()
    const Category = require('../../models/Category')

    router.post('/categories', async (req, res) => {
        const model = await Category.create(req.body)
        res.send(model)
    })

    //分类列表接口
    router.get('/categories', async (req, res) => {
        const items = await Category.find().populate('parent').limit(10)
        res.send(items)
    })

    // 分类详情页接口
    router.get('/categories/:id', async (req, res) => {
        const model = await Category.findById(req.params.id)
        res.send(model)
    })

    // 编辑保存接口
    router.put('/categories/:id', async (req, res) => {
        const model = await Category.findByIdAndUpdate(req.params.id, req.body)
        res.send(model)
    })

    // 删除分类接口
    router.delete('/categories/:id', async (req, res) => {
        await Category.findByIdAndDelete(req.params.id, req.body)
        res.send({
            success: true
        })
    })

    app.use('/admin/api', router)
}