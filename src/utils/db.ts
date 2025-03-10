import mongoose from 'mongoose';

export const dbConnect = async (): Promise<void> => {
    try {
        await mongoose.connect(process.env.DB_URL as string);
    } catch (error) {
        console.log("DB connection error:", (error as Error).message);
    }
};