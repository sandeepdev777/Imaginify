import mongoose, { Mongoose } from 'mongoose';

// taking the connection string from the environment variables
const MONGODB_URL = process.env.MONGODB_URL;

// in normal express js apps we have to define the connection to the app only once since express runs on server side 
// but in next js we have to make coonection to the app each time when an api/server call is made.This is due serverless nature of next js due to which it cannot make continuous connection to the database.
// that's why we create an interface of mongoose connection which will hold the connection inside the chached object. and if the connection is lost then we will make the connection again by using 
// the promise of the mongooseconnection.
    interface MongooseConnection {
        conn: Mongoose | null;
        promise: Promise<Mongoose> | null;  
    }

// storing the connection in the global object temporarily so that it can be used in the whole app.
let cached: MongooseConnection = (global as any).mongoose

//if the coonection is not stored in cached object then make  the conn and promise to null so that it can be stored again.  
    if(!cached) {
    cached = (global as any).mongoose = { 
        conn: null, promise: null 
    }
    }

// if the cached connection is already there then return the connection else make the connection to the database and store it in the cached object.
    export const connectToDatabase = async () => {
    if(cached.conn) return cached.conn;

    if(!MONGODB_URL) throw new Error('Missing MONGODB_URL');

    cached.promise = 
        cached.promise || 
        mongoose.connect(MONGODB_URL, { 
        dbName: 'imaginify', bufferCommands: false 
        })

    cached.conn = await cached.promise;

    return cached.conn;
    }