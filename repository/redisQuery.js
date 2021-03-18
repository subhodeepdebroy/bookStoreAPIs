const redisClient = require('../redisConnection')
const { promisify } = require('util')

const zaddAsync = promisify(redisClient.zadd).bind(redisClient);
const zrevrangeAsync = promisify(redisClient.zrevrange).bind(redisClient);
const zscanAsync = promisify(redisClient.zscan).bind(redisClient);
const zincrbyAsync = promisify(redisClient.zincrby).bind(redisClient);



const addToSortedSets = async(parameter)=>{
    try {
        const result = await zaddAsync('author', 0, JSON.stringify(parameter));
        return result;
    } catch (error) {
        throw error;
    }

}

const rangeOnSortedSets = async()=>{
    try {
        const result = await zrevrangeAsync('author', 0, -1);
        return result;
    } catch (error) {
        throw error;
    }

}

const scanSortedSets = async(parameter)=>{
    try {
        const output = await zscanAsync('author', 0, 'MATCH', '*' + parameter + '*');
        return output
    } catch (error) {
        throw error;
    }

}

const increaseScoreInSortedSets = async(parameter)=>{
    try {
        const newScore = await zincrbyAsync('author', 1, parameter);
        return;
    } catch (error) {
        throw error;
    }

}

module.exports = {addToSortedSets, rangeOnSortedSets, scanSortedSets, increaseScoreInSortedSets};