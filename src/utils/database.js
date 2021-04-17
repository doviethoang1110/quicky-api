import { database } from "../config";
import mongoose from "mongoose";

mongoose.connect(`mongodb+srv://${database.username}:${database.password}@${database.dbname}.mtk7q.mongodb.net/${database.dbname}?retryWrites=true&w=majority`,
    {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    }
).then(() => console.log("mongoose is connected"))
    .catch(error => console.log("error", error));
mongoose.set('debug', true);
