const express = require('express');
const routes = require('express').Router();
const userController = require('../controllers/users');
const { validationResult } = require('express-validator');
const assetsController = require('../controllers/asset');
const { validateAssetFields, validateAssetParamId } = require('../validators/asset');
const { param } = require('express-validator');

// All assets
routes.get('/', async (req, res, next) => {
    console.log(req, 'in GET /assets route');
    try {
        const collection = await assetsController.getAssets(req, res, next);
        res.send(collection);
    } catch (err) {
        next(err);
    }
});

// Get, Update, and Delete asset by id
routes.route('/:assetId')
    .get([
        param('assetId')
            .notEmpty()
            .withMessage('assetId is required')
            .isAlphanumeric()
            .withMessage('assetId is case insensitive, and must contain only alphanumeric characters')
            .isLength({ min: 2, max: 5 })
            .withMessage('assetId must be at least 2 characters and not exceed 5 characters')
        ], validateAssetParamId, async (req, res, next) => {
        console.log(req, 'in GET /assets/:assetId route');
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }
        try {
            const collection = await assetsController.getAssetByAssetId(req.params.assetId);
            res.send(collection);
        } catch (err) {
            next(err);
        }
    })
    .put([
        param('assetId')
            .notEmpty()
            .withMessage('assetId is required')
            .isAlphanumeric()
            .withMessage('assetId is case insensitive, and must contain only alphanumeric characters')
            .isLength({ min: 2, max: 20 })
            .withMessage('assetId must be at least 2 characters and not exceed 20 characters')
        ], validateAssetParamId, validateAssetFields, async (req, res, next) => {

        console.log(req, 'in PUT /assets/update/:assetId route');
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }
        try {
        await assetsController.updateAsset(req.params.assetId, req.body);
        } catch (err) {
        next(err);
        }
    })
    .delete([
        param('assetId')
            .notEmpty()
            .withMessage('assetId is required')
            .isAlphanumeric()
            .withMessage('assetId is case insensitive, and must contain only alphanumeric characters')
            .isLength({ min: 2, max: 20 })
            .withMessage('assetId must be at least 2 characters and not exceed 20 characters')
    ], validateAssetParamId, async (req, res, next) => {
        console.log(req, 'in POST /assets/delete/:assetId route');
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }
        try {
            await assetsController.deleteAsset(req.params.assetId);
        } catch (err) {
            next(err);
        }
    });

// Create asset
routes.post('/', validateAssetFields, async (req, res, next) => {
        console.log(req, 'in /assets/create route');
        console.log(req.body, 'in /assets/create route');
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }
        try {
            await assetsController.createAsset(req.body);
        } catch (err) {
            next(err);
        }
    });

// Get asset by different parameters
routes.get('/param/:paramType/:paramValue', [
    param('paramType').notEmpty().withMessage('Parameter type is required'),
    param('paramValue').notEmpty().withMessage('Parameter value is required')
], async (req, res, next) => {
    const { paramType, paramValue } = req.params;
    console.log(req, 'in GET /assets/param/:paramType/:paramValue route');
    try {
        const collection = await assetsController.getAssetByParam(paramType, paramValue);
        res.send(collection);
    } catch (err) {
        next(err);
    }
});

module.exports = routes;