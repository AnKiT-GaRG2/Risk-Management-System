import Joi from 'joi';
import JoiObjectId from 'joi-objectid'; // For validating MongoDB ObjectIDs

// Extend Joi with joi-objectid for Mongoose ObjectId validation
const myJoi = Joi.extend(JoiObjectId);

// Joi schema for validating the customer ID in risk calculation requests
// This assumes the customerId in the URL param is a MongoDB ObjectId
const calculateRiskParamsSchema = myJoi.object({
    customerId: myJoi.objectId()
        .required()
        .messages({
            'objectId.invalid': 'Invalid Customer ID format',
            'any.required': 'Customer ID is required in URL'
        })
});

// If your risk calculation endpoint accepts additional dynamic factors in the body,
// you would define a schema for that here. For now, it's based on URL param.
const calculateRiskBodySchema = Joi.object({
    // Example: if you can manually override factors
    customFactors: Joi.object().pattern(Joi.string(), Joi.number().min(0))
}).optional();

export { calculateRiskParamsSchema, calculateRiskBodySchema };
