import mongoose from "mongoose";
const DB = "mongodb+srv://tusharkumar9871:XUT934rimcNC2WOq@cluster0.hmpr2hk.mongodb.net/mernt?retryWrites=true&w=majority"
mongoose.connect(DB).then(() => {
    console.log("connection successful with db");
}).catch((err) => {
    console.log(err);
})