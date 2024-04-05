const Joi = require("joi");
const EmployeeSalaryModel = require('../models/employeeSalary');


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
            salary: Joi.number().required(),
            dateOfSalary:Joi.date().required(),
        });
        const { error } = ledgerSchema.validate(req.body);
        if (error) {
            return next(error);
        }
        const { salary, dateOfSalary } = req.body;
        const {id} = req.params
        let ledger;
        try {
            const ledgerToAdd = new EmployeeSalaryModel({
                employeeId: id,
                salary: salary,
                dateOfSalary: dateOfSalary,
            });
            ledger = await ledgerToAdd.save();
        } catch (error) {
            return next(error);
        }
        res.status(200).json({ data: ledger, msg: "Employee Salary Added Successfully" });

    },


    async all(req, res, next) {
        const{id} = req.params;
        let ledgers;
        try {
             ledgers = await EmployeeSalaryModel.find({employeeId:id}).populate({
                path:"employeeId",
                
             });         
            
             console.log("Ledger: "+ledgers)
        } catch (error) {
            return next(error);
        }
        res.status(200).json({data:ledgers,msg:"All Salaries of employee fetched successfully"});

    },


    async getById(req, res, next) {
        const {id} = req.params;
        let ledger;
        try {
            ledger = await EmployeeSalaryModel.find({_id:id}).populate('employeeId');
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
            status = await EmployeeSalaryModel.findByIdAndDelete(id)
        } catch (error) {
            return next(error);
        }
        res.status(200).json({msg:"Ledger deleted successfully", data:status });
    },

    async update(req, res, next) {
        const { id } = req.params;
        const {
            dateOfSalary, salary
        } = req.body;
    
        try {
            // Create an object with the fields you want to update
            const updates = {
                dateOfSalary, salary
            };
    
            // Find the document by ID and update it with the provided updates
            const updatedStatus = await EmployeeSalaryModel.findByIdAndUpdate(id, updates, { new: true });
    
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