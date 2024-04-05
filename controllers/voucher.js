const Joi = require('joi');
const EmployeeModel = require('../models/voucher')
const expenditureController = {
    async add(req, res, next) {
        const employee = Joi.object({
            name: Joi.string().required(),
            vNo: Joi.number().required(),
            date: Joi.date().required(),
            amount: Joi.number().required(),
        });
        const { error } = employee.validate(req.body);
        if (error) {
            return next(error);
        }
        const { name, vNo, date, amount} = req.body;
        const { id } = req.params;
        let plot;
        try {
            const assignEmployee = new EmployeeModel({
                name: name,
                vNo: vNo,
                date: date,
                amount: amount
            })
            plot = await assignEmployee.save();

        } catch (error) {
            return next(error);
        }
        res.status(200).json({
            data: plot,
            msg: "Voucher saved successfully"
        })
    },
    async all(req, res, next) {
        let user;
        try {
            user = await EmployeeModel.find({});
        } catch (error) {
            return next(error);
        }
        res.status(200).json({ data: user, msg: "All EMPLOYEE PAY'S FETCHED SUCCESSFULLY" });
    },
    async delete(req, res, next) {
        const { id } = req.params;
        let status;
        try {
            status = await EmployeeModel.findById(id)
        } catch (error) {
            return next(error);
        }
        status.deleteOne();
        res.status(200).json({ msg: "employee information deleted successfully", data: status });
    },
    async update(req, res, next) {
        const { id } = req.params;
        const { name, date, amount, vNo} = req.body;
    
        try {
            // Create an object with the fields you want to update
            const updates = {
                name,
                date,
                amount, 
                vNo
            };
            // Find the document by ID and update it with the provided updates
            const updatedStatus = await EmployeeModel.findByIdAndUpdate(id, updates, { new: true });
    
            if (!updatedStatus) {
                // If the document was not found, return an error
                return res.status(404).json({ msg: 'Vocuher not found' });
            }
            res.status(200).json({
                data: updatedStatus,
                msg: "Voucher updated Successfully"
            });
        } catch (error) {
            return next(error);
        }
    }
}

module.exports = expenditureController;