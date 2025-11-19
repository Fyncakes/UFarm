/**
 * Standardized API Response Helpers
 * Ensures consistent JSON response format across all API endpoints
 */

/**
 * Success response
 * @param {Object} res - Express response object
 * @param {*} data - Response data
 * @param {String} message - Success message
 * @param {Number} statusCode - HTTP status code (default: 200)
 */
function success(res, data = null, message = 'Success', statusCode = 200) {
	res.status(statusCode).json({
		success: true,
		message,
		data,
		timestamp: new Date().toISOString()
	});
}

/**
 * Error response
 * @param {Object} res - Express response object
 * @param {String} message - Error message
 * @param {Number} statusCode - HTTP status code (default: 400)
 * @param {*} errors - Additional error details
 */
function error(res, message = 'An error occurred', statusCode = 400, errors = null) {
	const response = {
		success: false,
		message,
		timestamp: new Date().toISOString()
	};
	
	if (errors) {
		response.errors = errors;
	}
	
	res.status(statusCode).json(response);
}

/**
 * Not found response
 * @param {Object} res - Express response object
 * @param {String} resource - Resource name (e.g., "Product", "Order")
 */
function notFound(res, resource = 'Resource') {
	error(res, `${resource} not found`, 404);
}

/**
 * Unauthorized response
 * @param {Object} res - Express response object
 * @param {String} message - Custom message
 */
function unauthorized(res, message = 'Unauthorized access') {
	error(res, message, 401);
}

/**
 * Forbidden response
 * @param {Object} res - Express response object
 * @param {String} message - Custom message
 */
function forbidden(res, message = 'Forbidden: Insufficient permissions') {
	error(res, message, 403);
}

/**
 * Validation error response
 * @param {Object} res - Express response object
 * @param {Object} errors - Validation errors object
 */
function validationError(res, errors) {
	error(res, 'Validation failed', 422, errors);
}

module.exports = {
	success,
	error,
	notFound,
	unauthorized,
	forbidden,
	validationError
};

