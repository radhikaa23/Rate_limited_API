import { writeToTestFile } from "./fileHandle.js";
import { getRedisInstance } from "./redis.js";

const redis = getRedisInstance()



/**
 * Function: rateLimitTask
 * -----------------------
 * Checks and enforces task rate limits for a specific user.
 *
 * Parameters:
 *  - user_id: A unique identifier for the user.
 *
 * Returns:
 *  - Boolean: `true` if the user is allowed to proceed with a task, `false` if rate limits are exceeded.
 *
 * Description:
 *  This function checks the number of tasks a user has performed in the last second and the last minute
 *  using Redis sorted sets. If the user exceeds the limit (1 task per second or 20 tasks per minute), it returns `false`.
 *  Otherwise, it updates Redis with the current task and allows the user to proceed.
 */



export const rateLimitTask = async (user_id)=>{

    try {

        const currentTime = Date.now();
        const oneSecondAgo = currentTime - 1000;
        const oneMinuteAgo = currentTime - 60000;
    
        const tasksLastSecond = await redis.zcount(`tasks:${user_id}`, oneSecondAgo, currentTime);
        const tasksLastMinute = await redis.zcount(`tasks:${user_id}`, oneMinuteAgo, currentTime);
        
    
        if (tasksLastSecond >= 1 || tasksLastMinute >= 20) {
            return false;
        }
    
        await redis.zadd(`tasks:${user_id}`, currentTime, currentTime);
        return true;
        
    } catch (error) {

        return console.error(err.message)
        
    }


}


/**
 * Function: queueTask
 * -------------------
 * Adds a task to the user's task queue in Redis.
 *
 * Parameters:
 *  - user_id: A unique identifier for the user.
 *
 * Returns:
 *  - None (asynchronous function).
 *
 * Description:
 *  This function pushes the current timestamp to the user's Redis task queue using the `rpush` command.
 *  The task is added to the end of the queue, and it will be processed later.
 */


export const queueTask = async (user_id)=>{

    try{
        const currentTime = Date.now();
        await redis.rpush(`queue:${user_id}`, currentTime);
    }

    catch(err){
        return console.error(err.message)
    }

 

}


/**
 * Function: processTask
 * ---------------------
 * Logs task completion for a specific user.
 *
 * Parameters:
 *  - user_id: A unique identifier for the user.
 *
 * Returns:
 *  - None (asynchronous function).
 *
 * Description:
 *  This function calls `writeToTestFile` to log the task completion message for the user.
 *  It catches and logs any errors that occur during the process.
 */


export const processTask = async (user_id)=> {

    try{

        const logMessage = `${user_id}-task completed at-${Date.now()}\n`;
        await writeToTestFile(logMessage);

    }
    catch(err){
       return console.error(err.message);
    }

}



/**
 * Function: processQueue
 * -----------------------
 * Continuously processes tasks from a Redis queue for a specific user.
 *
 * Parameters:
 *  - user_id: A unique identifier for the user whose tasks are being processed.
 *
 * Returns:
 *  - None (asynchronous function).
 *
 * Description:
 *  This function enters an infinite loop where it checks if the user can process a task
 *  based on rate limiting. If the user is allowed to process a task, it retrieves a task
 *  from the Redis queue associated with the user_id. If a task is found, it calls the 
 *  `processTask` function to handle the task. The loop pauses for one second before 
 *  repeating. Errors encountered during execution are logged to the console.
 */





export const  processQueue = async (user_id)=>{
    
    try{
        while (true) {

            const canProcessTask = await rateLimitTask(user_id);
            const queueLength = await redis.llen(`queue:${user_id}`);

            if (queueLength === 0) {
                console.log(`Queue is empty for user ${user_id}. Stopping processor.`);
                break; 
            }

            
            if (canProcessTask) {
                const task = await redis.lpop(`queue:${user_id}`);
                if (task) {
                 await processTask(user_id);
                }

            }
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

    }

    catch(err){

        return console.error(err.message);

    }

}