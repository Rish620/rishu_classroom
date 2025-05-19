const mongoose = require('mongoose');

const classroomJoinSchema = new mongoose.Schema({
    classroomId: {
        type: mongoose.Schema.Types.ObjectId, // Reference to Classroom model
        ref: 'Classroom', // Model name to refer to
        required: true, // Ensure it's always provided
    },
    studentEmail: {
        type: String,
        required: true,
    },
    code: {
        type: String,
        required: true,
    },
    classOwnerEmail: {
        type: String, // Email of the class owner
        required: true,
    }
}, { timestamps: true });

const ClassroomJoin = mongoose.model('ClassroomJoin', classroomJoinSchema);

module.exports = ClassroomJoin;
