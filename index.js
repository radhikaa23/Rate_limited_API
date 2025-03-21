import cluster from 'node:cluster';
import express from 'express';
import { taskComplete } from './middleware/middleware.js';

const numberOfInstances = 2;

if(cluster.isPrimary){
    for(let i = 1 ; i <= numberOfInstances ; i++){
        cluster.fork();
    }

    cluster.on('exit', (worker) => {
        console.log(`Worker ${worker.process.pid} died`);
    });

}
else{

    const app = express();

    app.use(express.json());

    app.post('/api/v1/task' , taskComplete )


    app.listen(5000, (err) => {
        if(err) return console.error(err.message);
        
        console.log(`Worker ${process.pid} started`);
    });


}