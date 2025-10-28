require('dotenv').config();

module.exports = {
	database: process.env.MONGODB_URI || process.env.database || "mongodb://localhost:27017/UFarm",
	secret: process.env.SESSION_SECRET || process.env.secret || "aronDag",
};
