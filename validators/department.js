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

const validateDepartmentFields = (req, res, next) => {
    console.log('validateDepartmentFields called');
    const errors = [];

    if (errors.length > 0) {
        return res.status(400).json({ errors: errors });
    }
    next();
}

// Function to validate department ID
const validateDepartmentParamId = (req, res, next) => {
    console.log('validateDepartmentParamId called');
    const errors = [];

    if (req.params.departmentId && req.params.departmentId.length > 0) {
        const departmentId = req.params.departmentId.toUpperCase();
        const alphaPart = departmentId.substring(0, 2);
        const numericPart = departmentId.substring(2);

        if (!/^[A-Z]{2}$/.test(alphaPart)) {
            errors.push("Params departmentId must contain a two alpha characters in the first two positions ('AS-004').");
        }
        if (!/^[0-9]{3}$/.test(numericPart)) {
            errors.push("Params departmentId must contain three numeric characters, padded left with zeros, in the fourth, fifth and sixth positions ('AS-004')");
        }
    } else {
        errors.push('Params departmentId is required.');
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
  validateDepartmentFields,
  validateDepartmentParamId,
}