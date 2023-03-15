import dotenv from 'dotenv';

dotenv.config();

export default {
    MONGO_URI: process.env.MONGO_URI,
    MONGO_DB_NAME: process.env.MONGO_DB_NAME,
    PORT: process.env.PORT,
    PRIVATE_KEY: process.env.PRIVATE_KEY,
    COOKIE_NAME: process.env.COOKIE_NAME
}