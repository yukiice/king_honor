module.exports = app => {
    const express = require('express')
    const router = express.Router({
        mergeParams: true
    })


    router.post('/', async (req, res) => {
        const model = await req.Model.create(req.body)
        res.send(model)
    })

    //分类列表接口
    router.get('/', async (req, res) => {
        // 防止接口过多的查询 加入判断条件
        const queryOptions = {}
        // 需要满足来自接口Category 才能去查询parent
        if (req.Model.modelName === 'Category') {
            queryOptions.populate = 'parent'
        }
        const items = await req.Model.find().setOptions(queryOptions).limit(10)
        res.send(items)
    })

    // 分类详情页接口
    router.get('/:id', async (req, res) => {
        const model = await req.Model.findById(req.params.id)
        res.send(model)
    })

    // 编辑保存接口
    router.put('/:id', async (req, res) => {
        const model = await req.Model.findByIdAndUpdate(req.params.id, req.body)
        res.send(model)
    })

    // 删除分类接口
    router.delete('/:id', async (req, res) => {
        await req.Model.findByIdAndDelete(req.params.id, req.body)
        res.send({
            success: true
        })
    })

    app.use('/admin/api/rest/:resource',
        // 采用中间件处理
        async (req, res, next) => {
            const modelName = require('inflection').classify(req.params.resource)
            req.Model = require(`../../models/${modelName}`)
            next()
        }, router)
}