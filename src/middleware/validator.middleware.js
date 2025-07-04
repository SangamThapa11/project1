const bodyValidator = (schema) => {
    return async(req, res, next) => {
        try {
            const data = req.body;
            if(!data) {
                throw {
                    code: 422,
                    message:"Data not set",
                    status: "DATA_REQUIRED"
                }
            }

            // if data set
            await schema.validateAsync(data, {abortEarly: false})
            next();  // controller

        }catch(exception) {
            let msgBag = {}
            if(exception.name === "ValidationError") {
                exception.details.map((error)=> {
                    //const field = error.path.pop();
                    //const msg = error.message;
                    msgBag[error.path.pop()] = error.message; 
                }) 
            }next({
                detail: msgBag, 
                code: exception.code || 400,
                message: exception.code || "Validation failed",
                status: "VALIDATION_FAILED"
            })
        }
    }
}

module.exports = bodyValidator; 
