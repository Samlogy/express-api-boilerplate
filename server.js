//REQUIRES and CONFIG
const dotenv = require('dotenv')
//---------------------------------------------------------------------------------------
/* run dotenv.config before require app because we want to change node environment  variables first */
// dotenv.config({ path: './config.dev.env' }) // dev
dotenv.config({ path: './config.prod.env' }) // prod
//---------------------------------------------------------------------------------------
const app = require('./app')
/*-------------------------------------------------------------------------------------------------------------------------------------*/

const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}... 🔊 CTRL+C to stop.`)
})
