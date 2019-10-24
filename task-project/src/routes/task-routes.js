const router = require('express').Router();
const Task = require('../models/task-model');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res)=>{
    // list all
    try{

        await req.user.populate('tasks').execPopulate();

        console.log('> List all tasks: ', req.user.tasks);
        res.status(201).send(req.user.tasks);
        
    }catch(err){
        console.log(err);
        res.status(500).send(err);
    }
});

router.get('/:id', auth, async (req, res)=>{
    // list one
    try{
        const task = await Task.findOne({_id: req.params.id, owner: req.user._id});
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

router.post('/', auth ,async (req, res)=>{
    // create one
    const newTask = await new Task({
        ...req.body,
        owner: req.user._id
    });

    try {
        await newTask.save();
        console.log('> Created new task: ', newTask);
        res.status(201).send(newTask);
    } catch(err){
        console.log(err);
        res.status(400).send(err);
    }

});

router.put('/:id', async (req, res)=>{
    // Update more

});

router.patch('/:id', auth, async (req, res)=>{
    // Update less
    const updates = Object.keys(req.body);
    const allowedUpdates = ['description', 'completed'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if(!isValidOperation){
        return res.status(400).send({ error: "Invalid updates!"});
    }

    try {
        const taskUpdate = await Task.findOne({_id: req.params.id, owner: req.user._id});

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

router.delete('/:id', auth ,async (req, res)=>{
    // Delete one
    try{
        const taskDeleted = Task.findOne({_id: req.params.id, owner: req.user._id})

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