const z = require("zod");

// Note: If you want to log the schema name dynamically, 
// you can pass an optional name string, e.g., validate(signupschema, "Signup")
const validate = (schema, schemaName = "Unknown Schema") => (req, res, next) => {
    // 1. Log entry and what payload is being validated
    console.log(`[DEBUG] [${new Date().toISOString()}] Initiating validation for: ${schemaName}`);
    
    try {
        // Run validation and reassign parsed body
        req.body = schema.parse(req.body);
        
        // 2. Log successful validation
        console.log(`[INFO] Validation passed successfully for: ${schemaName}`);
        return next();
        
    } catch (error) {
        // 3. Check if it's a specific Zod validation error
        if (error instanceof z.ZodError) {
            const errorMessages = error.errors.map(err => ({
                field: err.path.join('.'),
                message: err.message
            }));

            // 4. Log the validation failure details to the console for easy debugging
            console.warn(`[WARN] Validation failed for: ${schemaName}`);
            console.warn(`[WARN] Total errors found: ${errorMessages.length}`);
            console.dir(errorMessages, { depth: null }); // Prints the error array cleanly

            return res.status(400).json({
                status: "fail",
                message: "Validation failed",
                errors: errorMessages
            });
        }

        // 5. Catch-all for unexpected middleware system crashes
        console.error(`[ERROR] Critical error inside validation middleware during: ${schemaName}`);
        console.error(error.stack);

        return res.status(500).json({ message: "Internal validation server error" });
    }
};

module.exports = validate;