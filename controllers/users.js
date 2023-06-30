const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;
require('express-session')

// Get user info
const getUser = async (req, res, next) => {
    try {
        if (req.user) {
            const googleId = req.user.googleId;
            const result = await mongodb.getDb().db('cse-341-sprint23-team8-project-tesla').collection('user').findOne({ googleId: googleId })
            if (result) {
                res.setHeader('Content-Type', 'application/json');
                res.status(200).json(result);
            } else {
                return res.status(404).json({ message: 'Unable to find user data'})
            }
        } else {
            return res.status(404).json({ message: 'User not logged in'})
        }
    } catch(err) {
        console.error(err)
        res.status(500).json({ message: 'Something went wrong '})
    }
}

// Delete user
const deleteUser = async (req, res, next) => {
    try {
        if (req.user) {
            const googleId = req.user.googleId;
            const result = await mongodb.getDb().db('cse-341-sprint23-team8-project-tesla').collection('user').deleteOne({ googleId: googleId })
            console.log(result);
            if (result) {
                req.logout((err) => {
                    if (err) { return next(err); }
                    res.status(200).json({ message: 'User deleted successfully ' + googleId })
                })
            } else {
                res.status(404).json({ message: 'User not found' })
            }
        } else {
            res.status(401).json({ message: 'User not logged in' });
        }
    } catch(err) {
        console.error(err);
        res.status(500).json({ message: 'Something went wrong' })
    }
}
// Edit user
const updateUser = async (req, res, next) => {
    if (req.user) {
        const userId = req.user.googleId;
        const { displayName, firstName, lastName, picture } = req.body;
        const update = { googleId: userId, displayName: displayName, firstName: firstName, lastName: lastName, picture: picture };

        const result = await mongodb.getDb().db('cse-341-sprint23-team8-project-tesla').collection('user').updateOne({ googleId: userId }, { $set: update })
        if (result.modifiedCount) {
            res.status(204).send();
        } else {
            res.status(500).json({ message: 'Something went wrong' })
        }
    } else {
        return res.status(404).json({ message: 'User not logged in' })
    }
}

module.exports = { getUser, deleteUser, updateUser}
