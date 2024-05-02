import mongoose from "mongoose";

let isConnected = false; //tracks connection to DB

export const connectDB = async () => {
    mongoose.set('strictQuery', true);

    if (isConnected) {
        console.log('MongoDB is already connected');
        return;
    };

    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: "PromptApp",
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })

        isConnected = true;
        console.log('MongoDB connected')

    } catch (error) {

        console.log(error)
    }
}