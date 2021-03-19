const redis = require('redis')


const client = redis.createClient({
    port: process.env.REDIS_PORT,
    host: process.env.LOCALHOST
})

client.on('connent', () => {
    console.log('redis Client connected to redis...');
})

client.on('end', () => {
    console.log('redis Client disconnected from redis...');
})

client.on('ready', () => {
    console.log('redis Client ready to be used...');
})

client.on('error', (err, res) => {
    console.log(err);
    process.exit(1);
})


module.exports = client;