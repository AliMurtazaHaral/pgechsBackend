const Joi = require('joi');
const PlotsModel = require('../models/plots')

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
            email: Joi.string().required(),
        });
        const { error } = plotToRegister.validate(req.body);
        if (error) {
            return next(error);
        }
        const { plotID, plotType, dimensions, sqFeet, location, street, block, email } = req.body;
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
        sendEmail(email, 'Plot Saved successfully', `Your plot information has been saved successfully. You can see by using membership number and password. \nRegards\nPGECHS`);
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
    async all1(req, res, next) {
        const { id } = req.params;
        let plots;
        try {
            plots = await PlotsModel.find({}).populate({
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
        const {
            email,
        } = req.body;
        try {
            status = await PlotsModel.findById(id)
        } catch (error) {
            return next(error);
        }
        status.deleteOne();
        sendEmail(email, 'Plot Deleted successfully', `Your plot information has been deleted successfully. You can see by using membership number and password. \nRegards\nPGECHS`);
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
            block,
            email
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
            sendEmail(email, 'Plot Information Updated Successfully', `Your plot information has been updated successfully. You can see by using membership number and password. \nRegards\nPGECHS`);
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