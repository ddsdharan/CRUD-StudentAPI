import express from "express";
import bodyParser from "body-parser";
const app = express();
import mongoose from "mongoose";
import student_schema from "./models/student_schema.js";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

app.use(
    cors({
        origin: true,
    })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true, })
    .then(() => {
        console.log("Connect to MongoDB !!!");
    })
    .catch((err) => console.log(err, "SERVER not connected !!!"));

// add a student
app.post("/addstudent", (req, res) => {
    const newStudent = new student_schema({
        name: req.body.name,
        email: req.body.email,
        gender: req.body.gender,
        age: req.body.age,
    });

    newStudent.save()
        .then(() => {
            res.status(201).send("Successfully added the student record");
        })
        .catch((err) => {
            if (err.name === 'ValidationError') {
                return res.status(400).send(`Validation Error: ${err.message}`);
            }
            console.error("Error adding the student record:", err);
            res.status(500).send("Error adding the student record");
        });
});
// get a student by id
app.get("/getstudent/:id", (req, res) => {
    let id = req.params.id;
    student_schema
        .findById(id)
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.send(err, "student not found");
        });
});

// list all students
app.get("/getallstudents", (req, res) => {
    student_schema
        .find({})
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.send(err);
        });
});

// delete a student by id
app.delete("/deletestudent/:id", (req, res) => {
    let id = req.params.id;
    student_schema
        .findByIdAndDelete(id)
        .then(() => res.send("deleted a particular student"))
        .catch((err) => res.send(err));
});

// update a student details by ID
app.put("/updatestudent/:id", (req, res) => {
    let id = req.params.id;
    let { name, email, gender, age } = req.body;
    let update_record = {};
    if (name) {
        update_record.name = name;
    }
    if (email) {
        update_record.email = email;
    }
    if (gender) {
        update_record.gender = gender;
    }
    if (age) {
        update_record.age = age;
    }
    student_schema
        .findByIdAndUpdate(id, { $set: update_record })
        .then(() => res.send("sucessfully particular record updated"))
        .catch((err) => res.send(err, "error while updating !!!"));
});

app.listen(process.env.PORT, () => {
    console.log("SERVER listening on PORT", process.env.PORT);
});