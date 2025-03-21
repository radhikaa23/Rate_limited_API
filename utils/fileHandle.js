import fs from 'node:fs/promises';

/**
 * Function: writeToTestFile
 * -------------------------
 * Writes a log message to the 'task_log.txt' file using a writable stream.
 *
 * Parameters:
 *  - logMessage: A string that contains the message to be appended to the log file.
 *
 * Returns:
 *  - None (asynchronous function, returns a promise).
 *
 * Description:
 *  This function opens the 'task_log.txt' file in the 'logs' directory in append mode ('a'),
 *  writes the provided log message to the file, and closes both the write stream and the 
 *  file handler once writing is completed. The function handles errors during the file 
 *  opening, writing, and closing processes.
 * 
 * Errors:
 *  - Logs an error if the file cannot be opened, written to, or closed.
 */



export const writeToTestFile = async (logMessage)=>{
    try{

        const fileHandler = await fs.open('logs/task_log.txt' , 'a');
        const writeStream = fileHandler.createWriteStream();
    
        writeStream.write(logMessage)
    
        
        writeStream.on("finish", async () => {
            try {
                await fileHandler.close();
            }   catch (err) {
                console.error("Error closing file handler:", err.message);
            }
        });

             writeStream.on("error", (err) => {
            console.error("Write stream error:", err.message);
        });
    
        writeStream.end();



    }
    catch(err){
       return console.error("Error opening or handling the file:", err.message);
    }

}