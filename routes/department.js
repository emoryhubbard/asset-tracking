const express = require('express');
const routes = require('express').Router();
const userController = require('../controllers/users');
const { validationResult } = require('express-validator');
const departmentsController = require('../controllers/department');
const { validateDepartmentFields, validateDepartmentParamId } = require('../validators/department');
const { param } = require('express-validator');

// All departments
routes.get('/', async (req, res, next) => {
    console.log(req, 'in GET /departments route');
    try {
        const collection = await departmentsController.getDepartments(req, res, next);
        res.send(collection);
    } catch (err) {
        next(err);
    }
});

module.exports = routes;