const router = require('express').Router();
const User = require('../models/user-model');
const auth = require('../middleware/auth');
const multer  = require('multer');
const sharp = require('sharp');
const { sendWelcomeEmail, sendCancelationEmail } = require('../emails/account');

const upload = multer({
    limits:{
        fileSize: 1000000 // 1MB
    },
    fileFilter(req, file, cb){
        
        if(!file.originalname.match(/\.(jpg|png|jpeg)$/)){
            return cb(new Error('File must be an image'));
        }
        cb(undefined, true);
    }
})

router.get('/', async (req, res)=>{
    // list all
    try{
        const users = await User.find({});
        // console.log('> List all users: ', users);
        res.status(201).send(users);
    }catch(err){
        console.log(err);
        res.status(500).send(err);
    }
});

router.get('/me',auth, (req, res)=>{
    res.send(req.user);
})

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
        await newUser.save();
        sendWelcomeEmail(newUser.email, newUser.name);
        const token = await newUser.genrateAuthToken();
        console.log('> Created new user: ', newUser, token);
        res.status(201).send({newUser, token});
    }catch(err){
        console.log(err);
        res.status(400).send(err);
    }
});

router.patch('/me', auth, async (req, res)=>{
    // Update less
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if(!isValidOperation){
        return res.status(400).send({ error: "Invalid updates!"});
    }

    try{
        updates.forEach((update)=>{
            req.user[update] = req.body[update];
        });

        await req.user.save();
        console.log('> Update user: ', req.user);
        res.status(200).send(req.user);
        
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

router.delete('/me', auth, async (req, res)=>{
    // Delete one
    try{
        console.log('> Delete user: ', req.user);
        await req.user.remove();
        sendCancelationEmail(req.user.email, req.user.name);

        res.status(200).send(req.user);
        
    }catch(err){
        console.log(err);
        res.status(500).send(err);
    }
});

router.post('/login', async(req, res)=>{
    try {
        let user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.genrateAuthToken();
        // user = await user.getPublicProfile();
        console.log('> Login user: ', user);
        res.send({ user, token });
    } catch (err) {
        res.status(400).send();
    }
});

router.post('/logout', auth, async (req, res)=>{
    try {
        /** Like Netflix A count can share more people so have token array */
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token !== req.token;
        });
        await req.user.save();
        res.send();

    } catch (err) {
        res.status(500).send("");
    }
});

router.post('/logoutAll', auth, async (req, res)=>{
    /** If account online people beyond limit kick all*/
    try {
        req.user.tokens = [];
        await req.user.save();
        console.log('> Logout all: ', req.user);

        res.status(200).send();

    } catch (err) {
        res.status(500).send();
    }
});


// User Avatar 

router.post('/me/avater',  auth, upload.single('avater'), async (req, res)=>{
    if(!req.file){
        throw new Error('No file!')
    }

    const buffer = await sharp(req.file.buffer).resize(250, 250).png().toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    console.log('> Upload avatar: success');

    res.send();
}, (err, req, res ,next)=>{
    res.status(400).send({error: err.message});
});

router.delete('/me/avatar', auth, async (req, res)=>{
    req.user.avatar = undefined;
    await req.user.save();
    console.log('> Delete avatar: success');

    res.send();
});

router.get('/:id/avatar', async(req, res)=>{
    try {
        const user = await User.findById(req.params.id)
        
        if(!user || !user.avatar){
            throw new Error('Not exist!');
        }

        res.set('Content-Type', 'image/png');
        res.send(user.avatar);

    } catch (err) {
        res.status(404).send();
    }
});

module.exports = router;