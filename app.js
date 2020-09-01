const express = require('express')
const morgan = require('morgan')
const contactsRouter = require('./src/routes/contactsRoutes')
const usersRouter = require('./src/routes/usersRoutes')
//-------------------------------------------------------------------------------------------

// declare express
const app = express()

//-------------------------------------------------------------------------------------------
// express midlewares
app.use(morgan('dev')) // log to the console information
app.use(express.json()) // to be able to use json format in the body
app.use((req, res, next) => {
	console.log('hello from the middleware')
	next()
})
app.use((req, res, next) => {
	req.time = new Date().toISOString()
	next()
})
//-------------------------------------------------------------------------------------------
//ROUTES middlwares

// Routes  LEVEL 2
// app.get('/api/v1/services', getAllContacts)
//.............etc

// Route  LEVEL 3 (originally here but delete for level 4 ) --> ( See routes folder ( level 4))

app.use('/api/v1/contacts', contactsRouter)
app.use('/api/v1/users', usersRouter)

//-------------------------------------------------------------------------------------------

module.exports = app