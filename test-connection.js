const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://moondooo:twx1v7CbQMPZ2Kxj@cluster0.um0vi.mongodb.net/myFirstDatabse?retryWrites=true&w=majority";

const client = new MongoClient(uri);

async function run(){
    await client.connect();
    const adminDB = client.db('test').admin();
    const listDatabases = await adminDB.listDatabases();
    console.log(listDatabases);
    return "OK";
}

run()
    .then(console.log)
    .catch(console.error)
    .finally(() => client.close());
    