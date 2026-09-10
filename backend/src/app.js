const express = require("express");
const cors = require("cors");
const User = require("./models/User");
const app = express();

app.use(cors());
app.use(express.json());

// GET
app.get("/api/users", async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching users",
            error: error.message,
        });
    }
    // res.json({
    //     id: 1,
    //     name: "Ravi Kumar",
    //     email: "raj@example.com",
    // });
});

// POST - MongoDB me user save karega
app.post("/api/users", async (req, res) => {
    try {
        const { name, email } = req.body;
        const user = new User({
            name,
            email,
        });

        const savedUser = await user.save();

        res.status(201).json({
            message: "User saved successfully",
            user: savedUser,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error saving user",
            error: error.message,
        });
    }
});

//DELETE
app.delete("/api/users/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
            return res.status(404).json({
                message: "User not found",
            });
        }
        res.json({
            message: "User deleted successfully",
            user: deletedUser,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error deleting user",
            error: error.message,
        });
    }
});

// PUT
app.put("/api/users/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email } = req.body;
        const updatedUser = await User.findByIdAndUpdate(id, { name, email }, { new: true });

        if (!updatedUser) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        res.json({
            message: "User updated successfully",
            user: updatedUser,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error updating user",
            error: error.message,
        });
    }
});

module.exports = app;

