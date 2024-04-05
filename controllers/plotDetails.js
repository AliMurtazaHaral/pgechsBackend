const Joi = require('joi');
const PlotsModel = require('../models/plotDetails');
const plotController = {
    async add(req, res, next) {

        const plotToRegister = Joi.object({

            date: Joi.string().required(),
            otherIncome: Joi.number().required(),
            slipNo: Joi.number().required(),
            msFee: Joi.number().required(),
            shareMoney: Joi.number().required(),
            transferFee: Joi.number().required(),
            pFee: Joi.number().required(),
            masjidFund: Joi.number().required(),
            ADC: Joi.number().required(),
            suiGasCharges: Joi.number().required(),
            bankProfit: Joi.number().required(),
            cornerFee: Joi.number().required(),
        });
        const { error } = plotToRegister.validate(req.body);
        if (error) {
            return next(error);
        }
        const { date, otherIncome, slipNo, msFee, shareMoney, transferFee, pFee, masjidFund,
        ADC, suiGasCharges, bankProfit, cornerFee } = req.body;
        const { id } = req.params;
        let plot;
        try {

            const plotExists = await PlotsModel.exists({ slipNo });


            if (plotExists) {
                const error = {
                    status: 409,
                    message: "Plot details already exists/possessed"
                }
                return next(error);
            }

            const assignPlot = new PlotsModel({
                memberId: id,
                date: date,
                otherIncome: otherIncome,
                slipNo: slipNo,
                msFee: msFee,
                shareMoney: shareMoney,
                transferFee: transferFee,
                pFee: pFee,
                masjidFund: masjidFund,
                ADC: ADC,
                suiGasCharges: suiGasCharges,
                bankProfit: bankProfit,
                cornerFee: cornerFee,
            })
            plot = await assignPlot.save();

        } catch (error) {
            return next(error);
        }
        res.status(200).json({
            data: plot,
            msg: "PLOT DETAILS ASSIGNED TO PLOT"
        })


    },


    async all(req, res, next) {
        const { id } = req.params;
        let plots;
        try {
            plots = await PlotsModel.find({}).populate({
                path: "memberId",
                populate: {
                    path: "MemberID",
                    populate: {
                        path: "member_id",
                        
                    }
                },
                
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
            plots = await PlotsModel.find({ memberId: id }).populate({
                path: "memberId",
                populate: {
                    path: "MemberID",
                    populate: {
                        path: "member_id",
                        
                    }
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
        const {
            email,
        } = req.body;
        try {
            status = await PlotsModel.findById(id)
        } catch (error) {
            return next(error);
        }
        status.deleteOne();
        res.status(200).json({ msg: "plot Details deleted successfully", data: status });
    },
    async update(req, res, next) {
        const { id } = req.params;
        const {
            date,
                otherIncome,
                slipNo,
                msFee,
                shareMoney,
                transferFee,
                pFee,
                masjidFund,
                ADC,
                suiGasCharges,
                bankProfit,
                cornerFee
        } = req.body;
    
        try {
            // Create an object with the fields you want to update
            const updates = {
                date,
                otherIncome,
                slipNo,
                msFee,
                shareMoney,
                transferFee,
                pFee,
                masjidFund,
                ADC,
                suiGasCharges,
                bankProfit,
                cornerFee
            };
    
            // Find the document by ID and update it with the provided updates
            const updatedStatus = await PlotsModel.findByIdAndUpdate(id, updates, { new: true });
    
            if (!updatedStatus) {
                // If the document was not found, return an error
                return res.status(404).json({ msg: 'Plot Details not found' });
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