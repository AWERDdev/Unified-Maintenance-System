const { z } = require("zod");

const validate = (schema, schemaName = "Unknown Schema") => (req, res, next) => {
    // 1. Hard Safety Guard: Catch import/export casing bugs immediately
    if (!schema || typeof schema.safeParse !== 'function') {
        console.error(`[CRITICAL] Validation middleware received an invalid or undefined schema for: "${schemaName}". Check your require() or module.exports statement!`);
        return res.status(500).json({ message: "Internal server configuration error" });
    }

    console.log(`[DEBUG] [${new Date().toISOString()}] Initiating validation for: ${schemaName}`);
    
    const result = schema.safeParse(req.body);

    if (!result.success) {
        // 2. Direct approach: Zod formats errors directly into an easy key-value object
        const formattedErrors = result.error.format();

        console.warn(`[WARN] Validation failed for: ${schemaName}`);
        console.dir(formattedErrors, { depth: null });

        return res.status(422).json({
            status: "fail",
            message: "Validation failed",
            errors: formattedErrors // Returns raw, clean layout directly to frontend
        });
    }

    // Validation passed perfectly
    req.body = result.data;
    console.log(`[INFO] Validation passed successfully for: ${schemaName}`);
    return next();
};

module.exports = validate;