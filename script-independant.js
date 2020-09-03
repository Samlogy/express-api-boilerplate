const dotenv = require('dotenv')
const mongoose = require('mongoose')
const fs = require('fs')

const Contact = require('./src/models/contactModel')
//---------------------------------------------------------------------------------------
dotenv.config({ path: './config.dev.env' })

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
	.catch((err) => console.log(err))

// Load fake database Json ---------------------------------------------------------------------------------------
const localContacts = JSON.parse(fs.readFileSync(`${__dirname}/db.json`))

// add and delete functions to Atlas DB ---------------------------------------------------------------------------------------
const addAllContactsToDb = async () => {
	try {
		await Contact.create(localContacts)
		console.log('data succefully loaded to Atlas DB')
	} catch (err) {
		console.log(err)
	}
	process.exit()
}

const deleteAllDataInAtlasDb = async () => {
	try {
		await Contact.deleteMany()
		console.log('all data succefully deleted !')
	} catch (err) {
		console.log(err)
	}
	process.exit()
}
// Shell commands to match---------------------------------------------------------------------------------------

if (process.argv[2] === '--importAll') {
	addAllContactsToDb()
} else if (process.argv[2] === '--deleteAll') {
	deleteAllDataInAtlasDb()
} else {
	console.log('Invalid option be sure to use [--importAll, --deleteAll]')
	process.exit()
}
//---------------------------------------------------------------------------------------
