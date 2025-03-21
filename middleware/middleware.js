import { rateLimitTask , queueTask ,processTask, processQueue } from '../utils/utils.js';

/**
 * Function: taskComplete
 * -----------------------
 * Handles incoming requests to process a task for a specific user.
 *
 * Parameters:
 *  - req: The HTTP request object, expected to contain `user_id` in the body.
 *  - res: The HTTP response object.
 *
 * Returns:
 *  - Sends an HTTP response indicating whether the task was completed or queued.
 *
 * Description:
 *  This function first validates if `user_id` is provided in the request body. 
 *  It checks the rate limit for the user using `rateLimitTask`. If the rate limit is 
 *  exceeded, the task is added to a Redis queue for later processing via `queueTask`, 
 *  and `processQueue(user_id)` is triggered to process the user's queue if not already.

 */


export const taskComplete = async (req , res)=>{

    try{
        const { user_id } = req.body;

        if (!user_id) return res.status(400).send('User ID is required');
    
        const canProcessTask = await rateLimitTask(user_id);
    
        if (!canProcessTask) {
            await queueTask(user_id);
    
            processQueue(user_id);
         
            return res.status(429).send('Rate limit exceeded. Task queued.');
        }
    
        await processTask(user_id);
    
        res.send(`Task completed`);

    }

    catch(err){

        return console.error(err.message);

    }
    


}