const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const { connect } = require('./src/db')
const app = express()
const PORT = process.env.PORT || 3001
const router = require('./src/routes/indexRoutes')

app.use(express.json())
app.use(cors())
app.use(morgan('dev'))

app.use('/', router)

app.use((err, req, res, next) => {
    const error = err.message || err
    const status = err.status || 500
    res.status(status).json({
        status:'error',
        message:error
    });
    next()
  });


app.listen(PORT, connect.sync({force:true}).then(data => console.log('se esta escuchando en el puerto 3001')))  