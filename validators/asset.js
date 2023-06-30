const startDate = new Date('2010-01-01');
const today = new Date();
const { param, body, validationResult } = require('express-validator')

const validate = (req, res, next) => {
  const errors = validationResult(req)
  if (errors.isEmpty()) {
    return next()
  }
  const extractedErrors = []
  errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }))

  return res.status(422).json({
    errors: extractedErrors,
  })
}

const validateAssetFields = (req, res, next) => {
    console.log('validateAssetFields called');
    const errors = [];

    if (req.method === 'POST') {
        if (!req.body[0].AssetId || !/^[A-Za-z0-9-]{2,20}$/.test(req.body[0].AssetId)) {
            errors.push('AssetId is required when creating a new Asset, and must be between 2 and 20 alphanumeric characters or hyphens. ');
        }
    }

    if (!req.body[0].SerialNumber || !/^[A-Za-z0-9-]{2,30}$/.test(req.body[0].SerialNumber)) {
        errors.push('serialNumber is required, and must be between 2 and 30 alphanumeric characters or hyphens. ');
    }
    if (!req.body[0].Brand || !/^[A-Za-z0-9-]{2,30}$/.test(req.body[0].Brand)) {
        errors.push('Brand is required, and must be between 2 and 30 alphanumeric characters or hyphens. ');
    }

    const inputDate = new Date(req.body[0].PurchaseDate);
    if (!req.body[0].PurchaseDate || inputDate < startDate || inputDate > today) {
        errors.push('PurchaseDate is required, and must be a valid date later than 1/1/2010 and no later than today. ');
    }


    if (!req.body[0].Model || !/^[A-Za-z0-9-]{2,30}$/.test(req.body[0].Model)) {
        errors.push('Model is required, and must be between 2 and 30 alphanumeric characters or hyphens. ');
    }

    if (!req.body[0].ModelNum || !/^[A-Za-z0-9-]{2,30}$/.test(req.body[0].Model)) {
        errors.push('ModelNum is required, and must be between 2 and 30 alphanumeric characters or hyphens. ');
    }

    if (!req.body[0].PurchasePrice || !/^[0-9]{2,10}$/.test(req.body[0].PurchasePrice)) {
        errors.push('PurchasePrice is required, and must be between 2 and 10 numeric characters. ');
    }

    if (!req.body[0].image || !/^[\w\-\s]+\.(jpg|jpeg|png|gif)$/i.test(req.body[0].image)) {
        errors.push('image is required, and must be a valid image filename. ');
    }

    if (!req.body[0].PhysicalDescription || !/^[\w\s\p{P}]{1,255}$/u.test(req.body[0].PhysicalDescription)) {
        errors.push('PhysicalDescription is required, and must be between 1 and 255 alphanumeric characters, spaces, or punctuation. ');
    }

    if (!req.body[0].Status || !/^[A-Za-z0-9\s-]{2,30}$/.test(req.body[0].Status)) {
        errors.push('Status is required, and must be between 2 and 30 alphanumeric characters or hyphens. ');
    }

    if (!req.body[0].Condition || !/^[A-Za-z0-9\s-]{2,30}$/.test(req.body[0].Condition)) {
        errors.push('Condition is required, and must be between 2 and 30 alphanumeric characters or hyphens. ');
    }

    if (!req.body[0].Building || !/^[A-Za-z0-9\s-]{2,30}$/.test(req.body[0].Building)) {
        errors.push('Building is required, and must be between 2 and 30 alphanumeric characters, spaces or hyphens. ');
    }

    if (!req.body[0].User || !/^[A-Za-z0-9\s-]{2,50}$/.test(req.body[0].User)) {
        errors.push('User is required, and must be a correctly formatted email address.');
    }

    if (errors.length > 0) {
        return res.status(400).json({ errors: errors });
    }
    next();
}

// Function to validate asset ID
const validateAssetParamId = (req, res, next) => {
    console.log('validateAssetParamId called');
    const errors = [];

    if (req.params.assetId && req.params.assetId.length > 0) {
        const assetId = req.params.assetId.toUpperCase();
        const alphaPart = assetId.substring(0, 2);
        const numericPart = assetId.substring(2);

        if (!/^[A-Z]{2}$/.test(alphaPart)) {
            errors.push("Params assetId must contain a two alpha characters in the first two positions ('AS-004').");
        }
        if (!/^[0-9]{3}$/.test(numericPart)) {
            errors.push("Params assetId must contain three numeric characters, padded left with zeros, in the fourth, fifth and sixth positions ('AS-004')");
        }
    } else {
        errors.push('Params assetId is required.');
    }

    if (errors.length > 0) {
        return res.status(400).json({ errors: errors });
    }
    next();
}

function isValidRuntime(runtime) {
    const minutes = parseInt(runtime.substring(0, runtime.indexOf(" ")));
    return !isNaN(minutes) && minutes >= 30 && minutes <= 500;
}

module.exports = {
  validate,
  validateAssetFields,
  validateAssetParamId,
}