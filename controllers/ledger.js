const Joi = require("joi");
const LedgerModel = require('../models/ledgers');



const ledger = {
    async add(req, res, next) {
        const ledgerSchema = Joi.object({
            particulars: Joi.string().required(),
            chequeOrDraft: Joi.string().required(),
            Slip: Joi.string().required(),
            debit: Joi.number().required(),
            credit: Joi.number().required(),
            balance: Joi.number().required(),
            date:Joi.date().required()
        });
        const { error } = ledgerSchema.validate(req.body);
        if (error) {
            return next(error);
        }
        const { particulars, chequeOrDraft, Slip, debit, credit, balance,date } = req.body;
        const {id} = req.params
        let ledger;
        try {
            const ledgerToAdd = new LedgerModel({
                MemberID: id,
                particulars: particulars,
                chequeORdraft: chequeOrDraft,
                Slip: Slip,
                debit: debit,
                credit: credit,
                balance: balance,
                date: date,
            });
            ledger = await ledgerToAdd.save();
        } catch (error) {
            return next(error);
        }
        res.status(200).json({ data: ledger, msg: "Ledger Added Successfully" });

    },


    async all(req, res, next) {
        const{id} = req.params;
        let ledgers;
        try {
             ledgers = await LedgerModel.find({MemberID:id}).populate({
                path:"MemberID",
                populate:{
                    path:"member_id"
                }
             });         
            
             console.log("Ledger: "+ledgers)
        } catch (error) {
            return next(error);
        }
        res.status(200).json({data:ledgers,msg:"All Ledgers of member fetched successfully"});

    },


    async getById(req, res, next) {
        const {id} = req.params;
        let ledger;
        try {
            ledger = await LedgerModel.find({_id:id}).populate('MemberID');
        } catch (error) {
            return next(error);
        }
        res.status(200).json({
            data:ledger,
            msg:"Ledger Fetched Successfully"
        });
    },


    async delete(req, res, next) {
        const {id} = req.params;
        let status;
        try {
            status = await LedgerModel.findByIdAndDelete(id)
        } catch (error) {
            return next(error);
        }
        res.status(200).json({msg:"Ledger deleted successfully", data:status });
    },

    async update(req, res, next) {
        const { id } = req.params;
        const {
            particulars, chequeOrDraft, Slip, debit, credit, balance,date
        } = req.body;
    
        try {
            // Create an object with the fields you want to update
            const updates = {
                particulars, chequeOrDraft, Slip, debit, credit, balance,date
            };
    
            // Find the document by ID and update it with the provided updates
            const updatedStatus = await LedgerModel.findByIdAndUpdate(id, updates, { new: true });
    
            if (!updatedStatus) {
                // If the document was not found, return an error
                return res.status(404).json({ msg: 'Plot not found' });
            }
    
            res.status(200).json({
                data: updatedStatus,
                msg: "Ledger updated Successfully"
            });
        } catch (error) {
            return next(error);
        }
    },
}

module.exports = ledger;
