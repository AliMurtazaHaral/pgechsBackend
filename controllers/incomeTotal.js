const Joi = require('joi');
const ExpenditureModel = require('../models/incomeTotal')
const expenditureController = {
    async add(req, res, next) {
        const expenditureTotal = Joi.object({
            date: Joi.date().required(),
            income: Joi.string().required(),
            amount: Joi.number().required(),
        });
        const { error } = expenditureTotal.validate(req.body);
        if (error) {
            return next(error);
        }
        const { income, amount, date} = req.body;
        const { id } = req.params;
        let plot;
        try {
            const assignExpenditure = new ExpenditureModel({
                income: income,
                amount: amount,
                date: date
            })
            plot = await assignExpenditure.save();

        } catch (error) {
            return next(error);
        }
        res.status(200).json({
            data: plot,
            msg: "Income total saved successfully"
        })
    },
    async all(req, res, next) {
        let user;
        try {
            user = await ExpenditureModel.find({});
        } catch (error) {
            return next(error);
        }
        res.status(200).json({ data: user, msg: "All INCOME STATEMENTS FETCHED SUCCESSFULLY" });
    },
    async delete(req, res, next) {
        const { id } = req.params;
        let status;
        try {
            status = await ExpenditureModel.findById(id)
        } catch (error) {
            return next(error);
        }
        status.deleteOne();
        res.status(200).json({ msg: "income deleted successfully", data: status });
    },
    async update(req, res, next) {
        const { id } = req.params;
        const {
            income,
            amount,
            date
        } = req.body;
    
        try {
            // Create an object with the fields you want to update
            const updates = {
                income,
                amount,
                date
            };
    
            // Find the document by ID and update it with the provided updates
            const updatedStatus = await ExpenditureModel.findByIdAndUpdate(id, updates, { new: true });
    
            if (!updatedStatus) {
                // If the document was not found, return an error
                return res.status(404).json({ msg: 'Income not found' });
            }
            res.status(200).json({
                data: updatedStatus,
                msg: "Income updated Successfully"
            });
        } catch (error) {
            return next(error);
        }
    }
    
}

module.exports = expenditureController;