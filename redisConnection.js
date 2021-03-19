const redis = require('redis')

const client = redis.createClient({
    port: process.env.REDIS_PORT,
    host: process.env.LOCALHOST
})

client.on('connent', ()=>{
    console.log('Client connected to redis...');
})

client.on('end', ()=>{
    console.log('Client disconnected from redis...');
})

client.on('ready', ()=>{
    console.log('Client ready to be used...');
})



module.exports = client;