import dotenv from 'dotenv';
dotenv.config();

const TESTING = false;

export default {
    PORT : process.env.PORT,
    SECRET: process.env.SECRET,
    MONGO_DB_URI: TESTING
        ?   `mongodb://localhost:27017/${process.env.DB_NAME}?serverSelectionTimeoutMS=5000&connectTimeoutMS=10000&3t.uriVersion=3&3t.connection.name=Local&3t.alwaysShowAuthDB=true&3t.alwaysShowDBFromUserRole=true`
        :   `mongodb+srv://${process.env.MONGODB_CREDENTIALS}@${process.env.CLUSTER_NAME}.k1kph.mongodb.net/${process.env.DB_NAME}?retryWrites=true;`
}


// mongodb+srv://martin:<password>@a4medier.k1kph.mongodb.net/myFirstDatabase?retryWrites=true&w=majority