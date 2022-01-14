module.exports = app => {
    const express = require('express')
    const jwt = require('jsonwebtoken')
    const AdminUser = require('../../models/AdminUser')
    const assert = require('http-assert')
    const router = express.Router({
        mergeParams: true
    })

    // 登录校验中间件
    const authMiddleware = async (req, res, next) => {
        // 校验用户是否登录
        const token = String(req.headers.authorization || '').split(' ').pop()
        assert(token, 401, '请您先登录')
        const {
            id
        } = jwt.verify(token, app.get('secret'))
        assert(id, 401, '请您先登录')
        req.user = await AdminUser.findById(id)
        assert(req.user, 401, '请您先登录')
        await next()
    }

    // 采用中间件处理 判断用户模型
    const resourceMiddleware = async (req, res, next) => {
        const modelName = require('inflection').classify(req.params.resource)
        req.Model = require(`../../models/${modelName}`)
        next()
    }

    // 创建资源
    router.post('/', async (req, res) => {
        const model = await req.Model.create(req.body)
        res.send(model)
    })

    //资源列表
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

    // 资源详情
    router.get('/:id', async (req, res) => {
        const model = await req.Model.findById(req.params.id)
        res.send(model)
    })

    // 更新资源
    router.put('/:id', async (req, res) => {
        const model = await req.Model.findByIdAndUpdate(req.params.id, req.body)
        res.send(model)
    })

    // 删除资源
    router.delete('/:id', async (req, res) => {
        await req.Model.findByIdAndDelete(req.params.id, req.body)
        res.send({
            success: true
        })
    })

    app.use('/admin/api/rest/:resource', authMiddleware, resourceMiddleware, router)

    // multer中间件处理
    const multer = require('multer')
    const upload = multer({
        dest: __dirname + '/../../uploads'
    })
    app.post('/admin/api/upload', authMiddleware, upload.single('file'), async (req, res) => {
        const file = req.file
        file.url = `/uploads/${file.filename}`
        res.send(file)
    })
    app.post('/admin/api/login', async (req, res) => {
        const {
            username,
            password
        } = req.body
        // 根据用户名字找用户
        const user = await AdminUser.findOne({
            username
        }).select('+password')
        assert(user, 422, '用户不存在')

        // 校验密码
        const isValid = require('bcryptjs').compareSync(password, user.password)
        assert(isValid, '422', '密码错误')


        const token = jwt.sign({
            id: user._id
        }, app.get('secret'))
        res.send({
            token
        })


    })
    // 错误处理函数
    app.use(async (err, req, res, next) => {
        res.status(err.statusCode || 500).send({
            message: err.message
        })
    })
}