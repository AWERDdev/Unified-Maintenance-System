const { z } = require("zod");

const validate = (schema, schemaName = "Unknown Schema") => (req, res, next) => {
    console.log(`[DEBUG] [${new Date().toISOString()}] Initiating validation for: ${schemaName}`);
    
    // .safeParse() returns an object: { success: true, data: ... } OR { success: false, error: ... }
    const result = schema.safeParse(req.body);

    if (!result.success) {
        // Zod guarantees result.error exists if success is false
        const errorMessages = result.error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
        }));

        console.warn(`[WARN] Validation failed for: ${schemaName}`);
        console.warn(`[WARN] Total errors found: ${errorMessages.length}`);
        console.dir(errorMessages, { depth: null });

        return res.status(422).json({ // Changed to 422 Unprocessable Entity
            status: "fail",
            message: "Validation failed",
            errors: errorMessages
        });
    }

    // If validation passed, attach the clean data and move on
    req.body = result.data;
    console.log(`[INFO] Validation passed successfully for: ${schemaName}`);
    return next();
};

module.exports = validate;