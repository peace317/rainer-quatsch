import { Db, MongoClient } from 'mongodb';

declare global {
    var dbCon: Promise<MongoClient> | undefined;
}


const initializeDBCon = async () => {
    console.time(`Connecting with MongoDb ${process.env.DATABASE_URL}`);
    const conn = await MongoClient.connect(process.env.DATABASE_URL);
    console.timeEnd(`Connecting with MongoDb ${process.env.DATABASE_URL}`)
    return conn;
};

const dbcon = globalThis.dbCon || initializeDBCon();

export async function getDb(): Promise<Db> {
    const conn = await dbcon;
    return conn.db(process.env.DATABASE_SCHEMA)
}

if (process.env.NODE_ENV !== 'production') globalThis.dbCon = dbcon;

export default dbcon;
