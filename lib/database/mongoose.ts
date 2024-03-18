import mongoose, { Mongoose } from 'mongoose';

const MONGODB_URL = process.env.MONGODB_URL;
// since nextjs has serverless nature, so in order to perform any sever action we have refetch the data again and again 
// from the server .
// to perform the above action we have created an interface which will help us to cache(temporarily store) the data and use it again and again 

interface MongooseConnection {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}
// storing the cached data in the global object
let cached: MongooseConnection = (global as any).mongoose

// if the data is not then set conn and promise to null
if(!cached) {
  cached = (global as any).mongoose = { 
    conn: null, promise: null 
  }
}

// whenever the below function is called it will check if the connection is already established or not. 
// if there is no connection then it will build connection 
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