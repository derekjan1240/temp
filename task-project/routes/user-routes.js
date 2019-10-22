const router = require('express').Router();
const User = require('../models/user-model');

router.get('/', async (req, res)=>{
    // list all
    try{
        const users = await User.find({});
        console.log('> List all users: ', users);
        res.status(201).send(users);
    }catch(err){
        console.log(err);
        res.status(500).send(err);
    }
});

router.get('/:id', async (req, res)=>{
    // list one

    try{
        const user = await User.findById(req.params.id);
        if(user){
            console.log('> List user: ', user);
            res.status(201).send(user);
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
    const newUser = new User(req.body);
    try{
        // await newUser.save();
        const token = await newUser.genrateAuthToken();
        console.log('> Created new user: ', newUser, token);
        res.status(201).send({newUser, token});
    }catch(err){
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
    const allowedUpdates = ['name', 'email', 'password'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if(!isValidOperation){
        return res.status(400).send({ error: "Invalid updates!"});
    }

    try {
        const userUpdate = await User.findById(req.params.id);

        if(!userUpdate){
            res.status(404).send();
        }else{
            updates.forEach((update)=>{
                userUpdate[update] = req.body[update];
            });
            await userUpdate.save();

            console.log('> Update User: ', userUpdate)
            res.status(200).send(userUpdate);
        }
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

router.delete('/:id', async (req, res)=>{
    // Delete one
    try{
        const userDeleted = await User.findOneAndDelete(req.params.id)
        if(userDeleted){
            console.log('> Delete user: ', userDeleted);
            res.status(200).send(userDeleted);
        }else{
            res.status(404).send();
        }
    }catch(err){
        console.log(err);
        res.status(500).send(err);
    }
});

router.post('/login', async(req, res)=>{
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.genrateAuthToken();
        res.send({user, token});
    } catch (err) {
        res.status(400).send();
    }
})

module.exports = router;