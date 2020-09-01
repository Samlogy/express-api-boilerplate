const app = require('./app')

const PORT = 4000
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}... 🔊 CTRL+C to stop.`)
})
