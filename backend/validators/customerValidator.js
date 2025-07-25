import Joi from 'joi';

// Joi schema for creating a new customer
const createCustomerSchema = Joi.object({
    customerId: Joi.string()
        .required()
        .messages({
            'string.empty': 'Customer ID cannot be empty',
            'any.required': 'Customer ID is required'
        }),
    name: Joi.string()
        .min(3)
        .required()
        .messages({
            'string.min': 'Customer name must be at least 3 characters long',
            'string.empty': 'Customer name cannot be empty',
            'any.required': 'Customer name is required'
        }),
    email: Joi.string()
        .email()
        .messages({
            'string.email': 'Please provide a valid email address'
        }),
    address: Joi.string().allow(''), // Address can be an empty string
    totalOrders: Joi.number()
        .integer()
        .min(0)
        .default(0)
        .messages({
            'number.base': 'Total orders must be a number',
            'number.integer': 'Total orders must be an integer',
            'number.min': 'Total orders cannot be negative'
        }),
    totalReturns: Joi.number()
        .integer()
        .min(0)
        .default(0)
        .messages({
            'number.base': 'Total returns must be a number',
            'number.integer': 'Total returns must be an integer',
            'number.min': 'Total returns cannot be negative'
        })
});

// Joi schema for updating an existing customer
// All fields are optional as it's a partial update
const updateCustomerSchema = Joi.object({
    name: Joi.string().min(3).messages({
        'string.min': 'Customer name must be at least 3 characters long'
    }),
    email: Joi.string().email().messages({
        'string.email': 'Please provide a valid email address'
    }),
    address: Joi.string().allow(''),
    totalOrders: Joi.number()
        .integer()
        .min(0)
        .messages({
            'number.base': 'Total orders must be a number',
            'number.integer': 'Total orders must be an integer',
            'number.min': 'Total orders cannot be negative'
        }),
    totalReturns: Joi.number()
        .integer()
        .min(0)
        .messages({
            'number.base': 'Total returns must be a number',
            'number.integer': 'Total returns must be an integer',
            'number.min': 'Total returns cannot be negative'
        }),
    lastReturnDate: Joi.date().iso().messages({
        'date.iso': 'Last return date must be a valid ISO 8601 date string'
    })
}).min(1); // At least one field must be provided for update

export { createCustomerSchema, updateCustomerSchema };
