const express = require('express')
const app = express()
const port = 3000

app.set('secret','i2u34y12oi3u4y8')

app.use(require('cors')())
app.use(express.json())
// 托管静态文件
app.use('/uploads', express.static(__dirname + '/uploads'))

require('./routes/admin/index')(app)
require('./plugins/db')(app)

app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port 3000!`))