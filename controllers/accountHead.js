const Joi = require('joi');
const AccountHeadModel = require('../models/accountHead')
const accountHeadController = {
    async add(req, res, next) {
        const accountHead = Joi.object({
            head: Joi.string().required(),
        });
        const { error } = accountHead.validate(req.body);
        if (error) {
            return next(error);
        }
        const { head} = req.body;
        const { id } = req.params;
        let plot;
        try {
            const assignAccountHead = new AccountHeadModel({
                head: head
            })
            plot = await assignAccountHead.save();

        } catch (error) {
            return next(error);
        }
        res.status(200).json({
            data: plot,
            msg: "Account Head saved successfully"
        })
    },
    async all(req, res, next) {
        let user;
        try {
            user = await AccountHeadModel.find({});
        } catch (error) {
            return next(error);
        }
        res.status(200).json({ data: user, msg: "All ACCOUNT HEAD FETCHED SUCCESSFULLY" });
    },
    async delete(req, res, next) {
        const { id } = req.params;
        let status;
        try {
            status = await AccountHeadModel.findById(id)
        } catch (error) {
            return next(error);
        }
        status.deleteOne();
        res.status(200).json({ msg: "Account Head deleted successfully", data: status });
    },
    async update(req, res, next) {
        const { id } = req.params;
        const {
            head
        } = req.body;
        try {
            // Create an object with the fields you want to update
            const updates = {
                head
            };
            // Find the document by ID and update it with the provided updates
            const updatedStatus = await AccountHeadModel.findByIdAndUpdate(id, updates, { new: true });
    
            if (!updatedStatus) {
                // If the document was not found, return an error
                return res.status(404).json({ msg: 'Head not found' });
            }
            res.status(200).json({
                data: updatedStatus,
                msg: "Head updated Successfully"
            });
        } catch (error) {
            return next(error);
        }
    }
    
}

module.exports = accountHeadController;