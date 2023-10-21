const Joi = require('joi');
const PlotsModel = require('../models/plots')



const plotController = {
    async add(req, res, next) {

        const plotToRegister = Joi.object({

            plotID: Joi.string().required(),
            plotType: Joi.string().required(),
            dimensions: Joi.string().required(),
            sqFeet: Joi.string().required(),
            location: Joi.string().required(),
            street: Joi.string().required(),
            block: Joi.string().required(),
        });
        const { error } = plotToRegister.validate(req.body);
        if (error) {
            return next(error);
        }
        const { plotID, plotType, dimensions, sqFeet, location, street, block } = req.body;
        const { id } = req.params;
        let plot;
        try {

            const plotExists = await PlotsModel.exists({ plotID });


            if (plotExists) {
                const error = {
                    status: 409,
                    message: "Plot already exists/possessed"
                }
                return next(error);
            }

            const assignPlot = new PlotsModel({
                MemberID: id,
                plotID: plotID,
                plotType: plotType,
                dimensions: dimensions,
                sqFeet: sqFeet,
                location: location,
                street: street,
                block: block
            })
            plot = await assignPlot.save();

        } catch (error) {
            return next(error);
        }
        res.status(200).json({
            data: plot,
            msg: "PLOTS ASSIGNED TO MEMBER"
        })


    },


    async all(req, res, next) {
        const { id } = req.params;
        let plots;
        try {
            plots = await PlotsModel.find({ MemberID: id }).populate({
                path: "MemberID",
                populate: {
                    path: "member_id"
                }
            });

            console.log("Plots: " + plots)
        } catch (error) {
            return next(error);
        }
        res.status(200).json({ data: plots, msg: "All plots of member fetched successfully" });
    },


    
    async getById(req, res, next) {
        const { id } = req.params;
        let plots;
        try {
            plots = await PlotsModel.find({ _id: id }).populate({
                path: "MemberID",
                populate: {
                    path: "member_id"
                }
            });
        } catch (error) {
            return next(error);
        }
        res.status(200).json({
            data: plots,
            msg: "Plot Details Fetched Successfully"
        });
    },
    async delete(req, res, next) {
        const { id } = req.params;
        let status;
        try {
            status = await PlotsModel.findById(id)
        } catch (error) {
            return next(error);
        }
        status.deleteOne();
        res.status(200).json({ msg: "plot deleted successfully", data: status });
    },
    async update(req, res, next) {
        const { id } = req.params;
        const {
            plotID,
            plotType,
            dimensions,
            sqFeet,
            location,
            street,
            block
        } = req.body;
    
        try {
            // Create an object with the fields you want to update
            const updates = {
                plotID,
                plotType,
                dimensions,
                sqFeet,
                location,
                street,
                block
            };
    
            // Find the document by ID and update it with the provided updates
            const updatedStatus = await PlotsModel.findByIdAndUpdate(id, updates, { new: true });
    
            if (!updatedStatus) {
                // If the document was not found, return an error
                return res.status(404).json({ msg: 'Plot not found' });
            }
    
            res.status(200).json({
                data: updatedStatus,
                msg: "Plot Status updated Successfully"
            });
        } catch (error) {
            return next(error);
        }
    }
    
}

module.exports = plotController;