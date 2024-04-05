const Joi = require("joi");
const AccountHeadAmount = require('../models/accountHeadAmount');


const ledger = {
    async add(req, res, next) {
        const ledgerSchema = Joi.object({
            amount: Joi.number().required(),
            date:Joi.date().required(),
        });
        const { error } = ledgerSchema.validate(req.body);
        if (error) {
            return next(error);
        }
        const { amount, date } = req.body;
        const {id} = req.params;
        let ledger;
        try {
            const ledgerToAdd = new AccountHeadAmount({
                accountHeadId: id,
                date: date,
                amount: amount
            });
            ledger = await ledgerToAdd.save();
        } catch (error) {
            return next(error);
        }
        res.status(200).json({ data: ledger, msg: "Accout Head Added Successfully" });

    },


    async all(req, res, next) {
        const{id} = req.params;
        let ledgers;
        try {
             ledgers = await AccountHeadAmount.find({accountHeadId:id}).populate({
                path:"accountHeadId",
                
             });         
            
             console.log("Ledger: "+ledgers)
        } catch (error) {
            return next(error);
        }
        res.status(200).json({data:ledgers,msg:"All Account Head fetched successfully"});

    },


    async getById(req, res, next) {
        const {id} = req.params;
        let ledger;
        try {
            ledger = await AccountHeadAmount.find({_id:id}).populate('accountHeadId');
        } catch (error) {
            return next(error);
        }
        res.status(200).json({
            data:ledger,
            msg:"Salaries Fetched Successfully"
        });
    },


    async delete(req, res, next) {
        const {id} = req.params;
        let status;
        const {
        } = req.body;
        try {
            status = await AccountHeadAmount.findByIdAndDelete(id)
        } catch (error) {
            return next(error);
        }
        res.status(200).json({msg:"Ledger deleted successfully", data:status });
    },

    async update(req, res, next) {
        const { id } = req.params;
        const {
            amount, date
        } = req.body;
    
        try {
            // Create an object with the fields you want to update
            const updates = {
                amount, date
            };
    
            // Find the document by ID and update it with the provided updates
            const updatedStatus = await AccountHeadAmount.findByIdAndUpdate(id, updates, { new: true });
    
            if (!updatedStatus) {
                // If the document was not found, return an error
                return res.status(404).json({ msg: 'Employee not found' });
            }
            res.status(200).json({
                data: updatedStatus,
                msg: "Employee Salary updated Successfully"
            });
        } catch (error) {
            return next(error);
        }
    },
}

module.exports = ledger;