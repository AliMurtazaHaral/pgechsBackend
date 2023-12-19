const Joi = require("joi");
const LedgerModel = require('../models/ledgers');


const nodemailer = require('nodemailer');

// Create a transporter using your SMTP server configuration
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465, // or 587 for TLS
    secure: true, // true for SSL, false for TLS
    auth: {
        user: 'pgechs.com.pk@gmail.com',
        pass: 'owyf vzwy gsog wnpt',
    },
});

// Define a function to send an email
async function sendEmail(recipientEmail, subject, message) {
    try {
        // Send mail with defined transport object
        const info = await transporter.sendMail({
            from: 'pgechs.com.pk@gmail.com',
            to: recipientEmail,
            subject: subject,
            text: message,
        });

        console.log('Email sent: %s', info.messageId);
    } catch (error) {
        console.error('Error sending email:', error);
    }
}
const ledger = {
    async add(req, res, next) {
        const ledgerSchema = Joi.object({
            particulars: Joi.string().required(),
            chequeORdraft: Joi.string().required(),
            Slip: Joi.string().required(),
            debit: Joi.number().required(),
            credit: Joi.number().required(),
            extraCharges: Joi.string(),
            date:Joi.date().required(),
            email: Joi.string().required(),
        });
        const { error } = ledgerSchema.validate(req.body);
        if (error) {
            return next(error);
        }
        const { particulars, chequeORdraft, Slip, debit, credit, extraCharges,date, email } = req.body;
        const {id} = req.params
        let ledger;
        try {
            const ledgerToAdd = new LedgerModel({
                MemberID: id,
                particulars: particulars,
                chequeORdraft: chequeORdraft,
                Slip: Slip,
                debit: debit,
                credit: credit,
                extraCharges: extraCharges,
                date: date,
            });
            ledger = await ledgerToAdd.save();
        } catch (error) {
            return next(error);
        }
        sendEmail(email, 'Ledger Added Successfully', `Your Ledger information has been saved successfully. You can see by using membership number and password. \nRegards\nPGECHS`);
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
        const {
            email,
        } = req.body;
        try {
            status = await LedgerModel.findByIdAndDelete(id)
        } catch (error) {
            return next(error);
        }
        sendEmail(email, 'Ledger Deleted successfully', `Your Ledger information has been deleted successfully. You can see by using membership number and password. \nRegards\nPGECHS`);
        res.status(200).json({msg:"Ledger deleted successfully", data:status });
    },

    async update(req, res, next) {
        const { id } = req.params;
        const {
            particulars, chequeORdraft, Slip, debit, credit, extraCharges,date, email
        } = req.body;
    
        try {
            // Create an object with the fields you want to update
            const updates = {
                particulars, chequeORdraft, Slip, debit, credit, extraCharges,date
            };
    
            // Find the document by ID and update it with the provided updates
            const updatedStatus = await LedgerModel.findByIdAndUpdate(id, updates, { new: true });
    
            if (!updatedStatus) {
                // If the document was not found, return an error
                return res.status(404).json({ msg: 'Plot not found' });
            }
            sendEmail(email, 'Ledger Updated Successfully', `Your Ledger information has been updated successfully. You can see by using membership number and password. \nRegards\nPGECHS`);
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