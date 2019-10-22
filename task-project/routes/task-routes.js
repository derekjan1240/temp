const router = require('express').Router();
const Task = require('../models/task-model');

router.get('/', async (req, res)=>{
    // list all
    try{
        const tasks = await Task.find({});
        console.log('> List all tasks: ', tasks);
        res.status(201).send(tasks);
    }catch(err){
        console.log(err);
        res.status(500).send(err);
    }
});

router.get('/:id', async (req, res)=>{
    // list one
    
    try{
        const task = await Task.findById(req.params.id);
        if(task){
            console.log('> List task: ', task);
            res.status(201).send(task);
        }else{
            res.status(404).send();
        }
    }catch(err){
        console.log(err);
        res.status(500).send(err);
    }
});

router.post('/', async (req, res)=>{
    // create one
    const newTask = new Task(req.body);
    try {
        await newTask.save();
        console.log('> Created new user: ', newTask);
        res.status(201).send(newTask);
    } catch(err){
        console.log(err);
        res.status(400).send(err);
    }

});

router.put('/:id', async (req, res)=>{
    // Update more

});

router.patch('/:id', async (req, res)=>{
    // Update less
    const updates = Object.keys(req.body);
    const allowedUpdates = ['description', 'completed'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if(!isValidOperation){
        return res.status(400).send({ error: "Invalid updates!"});
    }

    try {

        const taskUpdate = await Task.findById(req.params.id);

        if(!taskUpdate){
            res.status(404).send();
        }else{
            updates.forEach((update)=>{
                taskUpdate[update] = req.body[update];
            });
            await taskUpdate.save();

            console.log('> Update Task: ', taskUpdate);
            res.status(200).send(taskUpdate);
        }
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

router.delete('/:id', async (req, res)=>{
    // Delete one
    try{
        const taskDeleted = await Task.findOneAndDelete(req.params.id)
        if(taskDeleted){
            console.log('> Delete task: ', taskDeleted);
            res.status(200).send(taskDeleted);
        }else{
            res.status(404).send();
        }
    }catch(err){
        console.log(err);
        res.status(500).send(err);
    }
});

module.exports = router;