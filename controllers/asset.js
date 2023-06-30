const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;
require('passport')
require('express-session')
const dbName = process.env.DB_NAME || 'cse-341-sprint23-team8-project-tesla';
const coll = 'asset';

// GET /assets
async function getAssets(req, res, next) {
    console.log('getAssets called');
    try {
        // console.log(req.session.passport)
        // if (req.user) {
            const assets = await mongodb.getDb().db(dbName).collection(coll).find().toArray()
            if (assets.length === 0) {
                res.status(404).json({ message: 'No assets found' });
            } else {
                res.status(200).json(assets);
            }
        // } else {
        //     res.status(401).json({ message: 'User not logged in' });
        // }
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

// GET /assets/:assetId
async function getAssetByAssetId(req, res, next) {
    const assetId = req.params.assetId;
    console.log('getAssetByAssetId - searching for AssetId:', assetId);
    try {
      console.log(req.session.passport)
      if (req.user) {
        const googleId = req.user.googleId;
        const asset = await mongodb.getDb().db(dbName).collection(coll).findOne({ assetId: assetId })
        if (!asset) {
            res.status(404).json({ message: 'No asset found for AssetId: ' + assetId });
          } else {
            res.status(200).json(asset);
        }
        } else {
            res.status(401).json({ message: 'User not logged in' });
        }
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

// Generic function to retrieve assets based on a given field
async function getAssetsByParam(req, res, next) {
    const { fieldName, fieldValue } = req.params;
    console.log(`getAssetsBy${fieldName} - ${fieldName}:`, fieldValue);
    try {
      const query = { [fieldName]: fieldValue };
      const assets = await mongodb.getDb().db(dbName).collection(coll).find(query).toArray();
      if (!assets || assets.length === 0) {
        res.status(404).send(`No assets found matching ${fieldName}: ${fieldValue}`);
      } else {
        res.status(200).json(assets);
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    }
}

// POST /assets
async function createAsset(req, res) {
    console.log('createAsset called - req.body:', req.body);
    try {
        console.log(req.session.passport)
        if (req.user) {
            const newAsset = req.body;
            const result = await mongodb.getDb().db(dbName).collection(coll).insertOne(newAsset);
            const createdAsset = result.ops[0];
            if (!createdAsset) {
                res.status(400).send('Failed to create asset: ' + newAsset.assetId);
            } else {
                res.status(201).json(createdAsset);
            }
        } else {
            res.status(401).json({ message: 'User not logged in' });
        }
      } catch (err) {
            console.error(err);
            if (err.code === 11000) {
                res.status(400).json({
                message: 'Duplicate assetId key violation. Asset creation failed',
                assetId: req.body.assetId,
                });
            } else {
                res.status(500).json({ message: 'Asset creation failed' });
            }
      }
  }



// PUT /update/:assetId
async function updateAsset(req, res) {
    const assetId = req.params.assetId;
    console.log('updateAsset called - assetId:', assetId);
    try {
        const updateFields = req.body;

        if (updateFields['_id']) {
            delete updateFields['_id'];
        }

        if (updateFields['assetId']) {
            delete updateFields['assetId'];
        }

        console.log('updateFields:', updateFields);

        try {
            const result = await mongodb.getDb().db(dbName).collection(coll)
                .findOneAndUpdate(
                    { _id: new ObjectId(assetId) }, 
                    { $set: updateFields },
                    { returnOriginal: false }
                );

            console.log('result:', result);

            if (result.value) {
                res.status(200).send({ message: `Asset ${assetId} updated successfully`, updatedAsset: result.value });
            } else {
                res.status(404).send({ message: `Asset ${assetId} not found` });
            }
        } catch (err) {
            console.error(err);
            res.status(500).send({ message: `Asset ${assetId} update failed` });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: `Asset ${assetId} update failed` });
    }
}


// DELETE /delete/:assetId
async function deleteAsset(req, res) {
    const assetId = req.params.assetId;
    console.log('deleteAsset called - assetId:', assetId);
    try {
        const result = await mongodb.getDb().db(dbName).collection(coll).deleteOne({ assetId: assetId });
        if (result.deletedCount > 0) {
            res.send({ message: `Asset ${assetId} deleted successfully` });
        } else {
            res.status(404).send({ message: `Asset ${assetId} not found` });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: 'Internal server error' });
    }
}



module.exports = {
    getAssets,
    getAssetByAssetId,
    getAssetsByParam,
    createAsset,
    updateAsset,
    deleteAsset,
  };

  console.log('asset.js is loaded!');

