const z = require("zod");

// Removed 'async' from the wrapper
const validate = (schema) => (req, res, next) => {
    try {
        req.body = schema.parse(req.body);
        return next();
    } catch (error) {
        if (error instanceof z.ZodError) {
            const errorMessages = error.errors.map(err => ({
                field: err.path.join('.'),
                message: err.message
            }));

            return res.status(400).json({
                status: "fail",
                message: "Validation failed",
                errors: errorMessages
            });
        }

        return res.status(500).json({ message: "Internal validation server error" });
    }
};

module.exports = validate;