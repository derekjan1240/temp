const mongoose = require('mongoose');
const validator = require('validator');

const Schema = mongoose.Schema;

const taskSchema = new Schema({
    description:{
        type: String,
        required: true,
        trim: true
    },
    completed:{
        type: Boolean,
        default: false
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    }
    
}, {
    timestamps: {createdAt: 'insert_date', updatedAt: 'update_date'}
});

// Middleware
taskSchema.pre('save', async function(next){
    const user = this;
    console.log('Task Saving Middleware');

    next();
});

const Task = mongoose.model('task', taskSchema);

module.exports = Task;