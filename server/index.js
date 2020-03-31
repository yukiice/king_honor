const express = require('express')
const app = express()
const port = 3000


app.use(require('cors')())
app.use(express.json())


require('./routes/admin/index')(app)
require('./plugins/db')(app)

app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port 3000!`))