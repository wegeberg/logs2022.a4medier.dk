import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import constants from "./helpers/constants";
import cors from "./helpers/allowCors";

import maillogRouter from './routes/maillog';
import artikellogRouter from './routes/artikellog';
import brugerlogRouter from './routes/brugerlog';
import maillogKommunenRouter from './routes/maillog-kommunen';
import rootRouter from './routes';

const { PORT, MONGO_DB_URI } = constants;

const app = express();
app.use(cors());
// if (process.env.NODE_ENV === "development") {
    app.use(morgan('dev'));
// }
app.use(express.json()); // Erstatter body-parser (der er deprecated)

// app.use(authenticate);

app.use('/', rootRouter);
app.use('/maillog', maillogRouter);
app.use('/artikellog', artikellogRouter);
app.use('/brugerlog', brugerlogRouter);
app.use('/maillog-kommunen', maillogKommunenRouter);


// const uri = `mongodb+srv://${MONGODB_CREDENTIALS}@dksites.k1kph.mongodb.net/${DB_NAME}?retryWrites=true;`;
// const uri = `mongodb://localhost:27017/${DB_NAME}?serverSelectionTimeoutMS=5000&connectTimeoutMS=10000&3t.uriVersion=3&3t.connection.name=Local&3t.alwaysShowAuthDB=true&3t.alwaysShowDBFromUserRole=true`;

mongoose.connect(
    MONGO_DB_URI, 
    {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true
    }
);
// mongoose.set('debug', true);
const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB database connection established successfully");
    console.log('uri', MONGO_DB_URI);
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`http://localhost:${PORT}`);
    console.log(`logs.a4medier.dk is running on PORT: ${PORT}`);
})