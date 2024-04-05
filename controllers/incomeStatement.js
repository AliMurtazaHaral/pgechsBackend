const Joi = require('joi');
const ExpenditureModel = require('../models/incomeStatement')
const expenditureController = {
    async add(req, res, next) {
        const expenditure = Joi.object({
            date: Joi.string().required(),
            electionFee: Joi.number().required(),
            misIncome: Joi.number().required(),
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
        const { error } = expenditure.validate(req.body);
        if (error) {
            return next(error);
        }
        const { date, electionFee, misIncome, msFee, shareMoney, transferFee, pFee, masjidFund, ADC, suiGasCharges, bankProfit, cornerFee} = req.body;
        const { id } = req.params;
        let plot;
        try {
            const assignExpenditure = new ExpenditureModel({
                date: date,
                electionFee: electionFee,
                misIncome: misIncome,
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
            plot = await assignExpenditure.save();

        } catch (error) {
            return next(error);
        }
        res.status(200).json({
            data: plot,
            msg: "Income statement saved successfully"
        })
    },
    async all(req, res, next) {
        let user;
        try {
            user = await ExpenditureModel.find({});
        } catch (error) {
            return next(error);
        }
        res.status(200).json({ data: user, msg: "All INCOME STATEMENT FETCHED SUCCESSFULLY" });
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
        res.status(200).json({ msg: "income statement deleted successfully", data: status });
    },
    async update(req, res, next) {
        const { id } = req.params;
        const { date, electionFee, misIncome, msFee, shareMoney, transferFee, pFee, masjidFund, ADC, suiGasCharges, bankProfit, cornerFee} = req.body;
        try {
            // Create an object with the fields you want to update
            const updates = {
                date,
                electionFee,
                misIncome,
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
            const updatedStatus = await ExpenditureModel.findByIdAndUpdate(id, updates, { new: true });
    
            if (!updatedStatus) {
                // If the document was not found, return an error
                return res.status(404).json({ msg: 'Expenditure not found' });
            }
            res.status(200).json({
                data: updatedStatus,
                msg: "Expenditure updated Successfully"
            });
        
        } catch (error) {
            return next(error);
        }

    }
    
}

module.exports = expenditureController;