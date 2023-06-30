const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;
require('passport')
require('express-session')
const dbName = process.env.DB_NAME || 'cse-341-sprint23-team8-project-tesla';
const coll = 'department';

// GET /departments
async function getDepartments(req, res, next) {
    console.log('getDepartments called');
    try {
        // console.log(req.session.passport)
        // if (req.user) {
            const departments = await mongodb.getDb().db(dbName).collection(coll).find().toArray()
            if (departments.length === 0) {
                res.status(404);
                return { message: 'No departments found' };
            } else {
                res.status(200);
                return departments;
            }
        // } else {
        //     res.status(401).json({ message: 'User not logged in' });
        // }
    } catch (err) {
      console.error(err);
      res.status(500);
      return { message: 'Internal server error' };
    }
  }

module.exports = {
    getDepartments,
    /*
    getDepartmentByDepartmentId,
    getDepartmentsByParam,
    createDepartment,
    updateDepartment,
    deleteDepartment,
    */
  };

  console.log('department.js is loaded!');