//REQUIRES and CONFIG
const mongoose = require('mongoose')
const dotenv = require('dotenv')

//---------------------------------------------------------------------------------------
/* Make sure to import dotenv before app */
dotenv.config({ path: './config.env' }) // dev
// dotenv.config({ path: './config.prod.env' }) // prod
//---------------------------------------------------------------------------------------
const app = require('./app')
// connect to mongodb database
mongoose
	.connect(process.env.ATLAS_DATABASE, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
		useFindAndModify: false
	})
	.then(() => {
		console.log('Connected to Atlas database succefully')
	})

/*-------------------------------------------------------------------------------------------------------------------------------------*/

const PORT = process.env.PORT || 4000
const server = app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}... 🔊 CTRL+C to stop.`)
})

// global Unhandled errors rejections from promises
process.on('unhandledRejection', (err) => {
	console.log(err.stack, err.name, err.message)
	server.close(() => {
		process.exit(1)
	})
})
