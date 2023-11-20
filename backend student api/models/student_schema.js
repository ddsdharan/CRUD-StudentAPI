import mongoose, { model } from "mongoose";
const { Schema } = mongoose;
const studentSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        required: true,
    },
    age: {
        type: String,
        required: true,
    },
});

export default model("Student", studentSchema);