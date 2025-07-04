class BaseService {
    constructor(className) {
        this.model = className;
    }
    createData = async(data) => {
        try {
            const modelObj = new this.model(data);
            return await modelObj.save()
        }catch(exception) {
            throw exception;
        }
    };

    getSingleRowByFilter = async(filter) => {
        try {
            const dataRow = await this.model.findOne(filter);
            return dataRow; 

        }catch(exception){
            throw exception;
        }
    }
    updateSingleRowByFilter = async(filter, data) => {
        try {
            const updatedRow = await this.model.findOneAndUpdate(filter, {$set: data}, {new: true})
            return updatedRow; 

        }catch(exception){
            throw exception;
        }
    }

    deleteRowsByFilter = async(filter) => {
        try {
            const deletedRows = await this.model.deleteMany(filter);
            return deletedRows; 
            
        }catch(exception) {
            throw exception;
        }
    }
    deleteSingleByFilter = async(filter) => {
        try {
            const deletedRows = await this.model.findOneAndDelete(filter);
            return deletedRows; 
            
        }catch(exception) {
            throw exception;
        }
    }
    }
module.exports = BaseService