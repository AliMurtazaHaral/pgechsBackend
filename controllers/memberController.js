const memberModel = require('../models/members');
const memberReg = require('../models/memberRegister');
const Role = require('../models/role');
const Joi = require('joi');
const JWTService = require('../services/JWTservice')
const bycrypt = require('bcryptjs');
const RefreshToken = require('../models/token');
const fs = require('fs');
const nodemailer = require('nodemailer');

const userMail = "";


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




const memberController = {


    async register(req, res, next) {
        const userSchema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().required(),
            role: Joi.string().required(),
            memberId: Joi.string().required()
        });
        const { error } = userSchema.validate(req.body);
        if (error) {
            return next(error);
        }
        const { email, password, role, memberId } = req.body;

        const hashedPassword = await bycrypt.hash(password, 10);
        try {
            const usernameInUse = await memberReg.exists({ email });
            if (usernameInUse) {
                const error = {
                    status: 409,
                    message: "Member already exists"
                }
                return res.status(409).json({ message: "Member Already Exists" });
            }
        } catch (error) {
            return next(error);
        }

        let accessToken;
        let refreshToken;
        let user;
        try {
            const userToRegister = new memberReg({
                email: email,
                password: hashedPassword,
                role: role,
                MemberId: memberId
            });
            user = await userToRegister.save();
            userMail = email
            sendEmail(email, 'Member Registration In PGECHS', `Your registration was successful. Here is your login information: Email: ${email} and Password: ${password}`);
            //token Generation
            accessToken = JWTService.SignAccessToken({ _id: user._id }, '30m');
            refreshToken = JWTService.SignRefreshToken({ _id: user._id }, '60m');
        } catch (error) {
            return next(error);
        }

        //store refresh token in db
        await JWTService.StoreRefreshToken(refreshToken, user._id);

        res.cookie('accessToken', accessToken, {
            maxAge: 1000 * 60 * 60 * 24,
            httpOnly: true
        });

        res.cookie('refreshToken', refreshToken, {
            maxAge: 1000 * 60 * 60 * 24,
            httpOnly: true
        });

        let rol;
        try {
            rol = await Role.findById(role).populate({
                path: "role",
            });

        } catch (error) { return next(error) }
        res.status(200).json({ Data: user, msg: `${rol.role} has been successfully registered` });
    },



    async addDetails(req, res, next) {

        const memberSchema = Joi.object({
            name: Joi.string().required(),
            address: Joi.string().required(),
            phoneNumber: Joi.string().required(),
            cnic: Joi.string().required(),
            email: Joi.string().required()
        });

        const { error } = memberSchema.validate(req.body);
        if (error) {
            console.log("In backend catched Error")
            return next(error);
        }

        const uploadedFiles = req.files;
        const { name, address, phoneNumber, cnic,email } = req.body;
        const { id } = req.params;

        try {
            const usernameInUse = await memberModel.exists({ cnic });
            if (usernameInUse) {
                const error = {
                    status: 409,
                    message: "Data already exists"
                }
                return res.status(409).json({ message: "Data Already Exists" });
            }
        } catch (error) {
            return next(error);
        }

        let member;
        try {
            const memberToRegister = new memberModel({
                name,
                address,
                phoneNumber,
                cnic,
                member_id: id,
                allotmentCertificate: uploadedFiles['allotmentCertificate'][0],
                membershipTransfer: uploadedFiles['membershipTransfer'][0],
                applicationForm: uploadedFiles['applicationForm'][0],
                underTaking: uploadedFiles['underTaking'][0],
                affidavit: uploadedFiles['affidavit'][0],
                transferImage: uploadedFiles['transferImage'][0],
                mergedPDF: uploadedFiles['mergedPDF'][0],
            });

            member = await memberToRegister.save();
        } catch (error) {
            return next(error);
        }

        let updatingApplicationStatus;
        try {
            console.log("MemberID initial " + id);
            const getMember = await memberReg.findOne({ _id: id });
            console.log("MemberID " + getMember);
            updatingApplicationStatus = await memberReg.updateOne(
                { _id: getMember },
                { $set: { ApplicationStatus: true } },
                { new: true }
            );
            
        } catch (error) {
            return next(error);
        }

        // Create an object with the file URLs
        const fileUrls = {
            allotmentCertificate: member.allotmentCertificate,
            membershipTransfer: member.membershipTransfer,
            applicationForm: member.applicationForm,
            underTaking: member.underTaking,
            affidavit: member.affidavit,
            transferImage: member.transferImage,
            mergedPDF: member.mergedPDF,
        };
        sendEmail(email, 'Congragulations, your profile has been completed.', `You can see your profile by login using given credentials.`);
        // Send the API response with file URLs
        res.status(200).json({
            data: member,
            statusUpdated: updatingApplicationStatus,
            fileUrls: fileUrls, // Include the file URLs in the response
            msg: "Member details saved successfully",
        });
    },




    async login(req, res, next) {
        const userSchema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().required("Password must be atleast 8 character")
        });
        const { error } = userSchema.validate(req.body);
        if (error) {
            return next(error);
        }
        const { email, password } = req.body;
        let user;
        try {
            user = await memberReg.findOne({ email: email });
            if (!user) {
                const error = {
                    status: 409,
                    message: "Invalid Username"
                }
                return res.status(error.status).json({ msg: error.message });
            }
            const match = await bycrypt.compare(password, user.password);
            if (!match) {
                const error = {
                    status: 409,
                    message: "Invalid Password"
                }
                return res.status(error.status).json({ msg: error.message });
            }

        } catch (error) {
            return next(error);
        }
        const accessToken = JWTService.SignAccessToken({ _id: user._id }, '30m');
        const refreshToken = JWTService.SignRefreshToken({ _id: user._id }, '30m')

        //store token in DB
        try {
            RefreshToken.updateOne({
                _id: user._id
            },
                { token: refreshToken },
                { upsert: true }
            );
        }
        catch (error) {
            return next(error);
        }

        res.cookie('accessToken', accessToken, {
            maxAge: 1000 * 60 * 60 * 24,
            httpOnly: true
        });

        res.cookie('refreshToken', refreshToken, {
            maxAge: 1000 * 60 * 60 * 24,
            httpOnly: true
        });

        let role;
        try {
            role = await Role.findById(user.role).populate({
                path: "role"
            })
        } catch (error) {
            return next(error);
        }


        let data;
        try {
            data = await memberModel.findOne({ member_id: user._id }).populate({
                path: "member_id",
                populate: {
                    path: "role",
                    populate: {
                        path: "permission.Permission_id"
                    }
                }
            });
        } catch (error) {
            return next(error);
        }

        res.status(200).json({ Data: data, msg: `Logged in as ${role.role}`, auth: true });

    },



    async all(req, res, next) {
        let users = {};
        try {
            users = await memberModel.find({}).populate({
                path: 'member_id',
            });

        } catch (error) {
            return next(error);
        }
        res.status(200).json({
            data: users,
            msg: "ALL USERS FETCHED SUCCESSFULLY"
        })
    },




    async getById(req, res, next) {
        const { id } = req.params;
        let user;
        try {
            const userExists = await memberReg.exists({ _id: id });
            if (!userExists) {
                const error = {
                    status: 404,
                    message: "Member Not Found"
                };
                return next(error);
            }
            const getUser = await memberReg.findOne({ _id: id });
            user = await memberModel.findOne({ member_id: getUser._id }).populate({
                path: "member_id",
                populate: {
                    path: "role",
                    populate: {
                        path: "permission.Permission_id"
                    }
                }
            });
        } catch (error) {
            return next(error);
        }
        res.status(200).json({ data: user, msg: "Member Information fetched successfully" });
    },



    async delete(req, res, next) {
        const { id } = req.params;
        let userReg;
        let userR;
        const {
            email,
        } = req.body;
        try {
            const findUser = await memberModel.findById(id);

            if (!findUser) {
                const error = {
                    status: 404,
                    msg: "Member Not Found - To delete"
                }
                return next(error);
            }
            const getMember = await memberReg.findOne(findUser.member_id);
            userReg = await memberReg.updateOne({ _id: getMember },
                { $set: { ApplicationStatus: false } },
                { new: true }
            );
            userR = findUser;

            findUser.deleteOne();
        } catch (error) {
            return next(error);
        }
        const filePaths = [
            userR.allotmentCertificate.path,
            userR.membershipTransfer.path,
            userR.applicationForm.path,
            userR.underTaking.path,
            userR.affidavit.path,
            userR.transferImage.path,
            userR.mergedPDF.path
        ];

        // Loop through the file paths and delete the files
        for (const filePath of filePaths) {
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error(`Error deleting file: ${filePath}`, err);
                } else {
                    console.log(`File deleted successfully: ${filePath}`);
                }
            });
        }
        sendEmail(email, 'Member Profile Deletion', `Your profile has been deleted. We will let you know when we complete it again. \nRegards\nPGECHS`);
        res.status(200).json({
            msg: "Member Data Deleted Successfully",
            data: userReg
        });
    },
    async updateTransfer(req, res, next) {
        const { id } = req.params;
        const {
            email,
        } = req.body;
        try {
            // Create an object with the fields you want to update
            const updates = {
                email
            };
    
            // Find the document by ID and update it with the provided updates
            const updatedStatus = await memberReg.findByIdAndUpdate(id, updates, { new: true });
    
            if (!updatedStatus) {
                // If the document was not found, return an error
                return res.status(404).json({ msg: 'Member not found' });
            }
            sendEmail(email, 'Member Info Transfers', `Your email has been changed you can login using your membership number and password. Thanks, \nRegards\nPGECHS`);
            
            res.status(200).json({
                data: updatedStatus,
                msg: "Email Transfer successfully"
            });
            
        } catch (error) {
            return next(error);
        }
    },

    async update(req, res, next) {
        const { id } = req.params;
        const {
            name,
            address,
            phoneNumber,
            cnic,
            email
        } = req.body;
    
        try {
            // Create an object with the fields you want to update
            const updates = {
                name,
                address,
                phoneNumber,
                cnic
            };
    
            // Find the document by ID and update it with the provided updates
            const updatedStatus = await memberModel.findByIdAndUpdate(id, updates, { new: true });
    
            if (!updatedStatus) {
                // If the document was not found, return an error
                return res.status(404).json({ msg: 'Member not found' });
            }
            sendEmail(email, 'Congragulations, your profile has been updated.', `You can see your updated details from profile dashboard by login using given credentials.`);
            res.status(200).json({
                data: updatedStatus,
                msg: "Plot Status updated Successfully"
            });
        } catch (error) {
            return next(error);
        }
    }
}





module.exports = memberController;