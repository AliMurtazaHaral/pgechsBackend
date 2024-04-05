const Joi = require('joi');
const ExpenditureManagementModel = require('../models/expenditureManagement')
const expenditureController = {
    async add(req, res, next) {
        const expenditure = Joi.object({

            bankProfit: Joi.number().required(),
            whTax: Joi.number().required(),
            bankCharges: Joi.number().required(),
            date: Joi.date().required(),
        });
        const { error } = expenditure.validate(req.body);
        if (error) {
            return next(error);
        }
        const { bankProfit, whTax, bankCharges, date} = req.body;
        const { id } = req.params;
        let plot;
        try {
            const assignExpenditure = new ExpenditureManagementModel({
                bankProfit: bankProfit,
                whTax: whTax,
                bankCharges: bankCharges,
                date: date
            })
            plot = await assignExpenditure.save();

        } catch (error) {
            return next(error);
        }
        res.status(200).json({
            data: plot,
            msg: "Expenditure Management saved successfully"
        })
    },
    async all(req, res, next) {
        let user;
        try {
            user = await ExpenditureManagementModel.find({});
        } catch (error) {
            return next(error);
        }
        res.status(200).json({ data: user, msg: "All EXPENDITURE FETCHED SUCCESSFULLY" });
    },
    async delete(req, res, next) {
        const { id } = req.params;
        let status;
        try {
            status = await ExpenditureManagementModel.findById(id)
        } catch (error) {
            return next(error);
        }
        status.deleteOne();
        res.status(200).json({ msg: "expenditure deleted successfully", data: status });
    },
    async update(req, res, next) {
        const { id } = req.params;
        const {
            bankProfit,
            whTax,
            bankCharges,
            date,
        } = req.body;
    
        try {
            // Create an object with the fields you want to update
            const updates = {
                bankProfit,
                whTax,
                bankCharges,
                date
            };
    
            // Find the document by ID and update it with the provided updates
            const updatedStatus = await ExpenditureManagementModel.findByIdAndUpdate(id, updates, { new: true });
    
            if (!updatedStatus) {
                // If the document was not found, return an error
                return res.status(404).json({ msg: 'Expenditure not found' });
            }
            res.status(200).json({
                data: updatedStatus,
                msg: "Expenditure Management updated Successfully"
            });
        } catch (error) {
            return next(error);
        }
    }
    
}

module.exports = expenditureController;