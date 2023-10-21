const User = require('../models/user');
const Role = require('../models/role');
const PermissionMod = require('../models/permissions');
const Joi = require('joi');
const bycrypt = require('bcryptjs');
const RefreshToken = require('../models/token');
const JWTService = require('../services/JWTservice');
const memberRegMod = require('../models/memberRegister');
const role = require('../models/role');




  


const adminController = {
    async login(req, res, next) {
        const userSchema = Joi.object({
            username: Joi.string().min(3).max(15).required(),
            password: Joi.string().min(3).max(15).required("Password must be atleast 8 character")
        });
        const { error } = userSchema.validate(req.body);
        if (error) {
            return next(error);
        }
        const { username, password } = req.body;
        let user;
        try {
            user = await User.findOne({ username: username });
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
        res.status(200).json({ Data: user, token:accessToken ,msg: `Logged in as ${role.role}`, auth: true });

    },



    async passwordReset(req, res, next) {
        const userReq = Joi.object({
            oldPassword: Joi.string().required(),
            newPassword: Joi.string().required(),
        });
        const { error } = userReq.validate(req.body);
        if (error) {
            return next(error);
        }

        const { oldPassword, newPassword } = req.body;
        const { _id } = req.params;
        const pass = await User.findOne(_id);

        const oldHashedPassword = await bycrypt.compare(oldPassword, pass.password);
        console.log(oldHashedPassword)
        if (!oldHashedPassword) {
            return res.status(404).json({msg:"Password Doesn't match"});
        }

        const newHashedPassword = await bycrypt.hash(newPassword, 10);
        console.log("hashed password: " + newHashedPassword)
        try {
            const updatePassword = await User.updateOne({ _id: pass._id },
                { $set: { password: newHashedPassword } },
                { new: true }
            );
            res.status(200).json({ newPassword: updatePassword, msg: "Password Updated" })
        } catch (error) {
            return next(error);
        }
    },


    async permissions(req, res, next) {
        const permissionSchema = Joi.object({
            permissionName: Joi.string().required(),
        });
        const { error } = permissionSchema.validate(req.body);
        if (error) {
            return next(error);
        }
        const { permissionName } = req.body;

        try {
            const checker = await PermissionMod.exists({ permissionName })
            if (checker) {
                error = {
                    status: 409,
                    message: "Permission already exist"
                }
                return next(error);
            }
        } catch (error) {
            return next(error);
        }
        let perm;
        try {
            const result = new PermissionMod({
                permissionName
            });
            perm = await result.save()
        } catch (error) {
            return next(error);
        }
        res.status(200).json({ data: perm, msg: "Permission Added" })
    },

    async registerMember(req, res, next) {
        const memberSchema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().required(),
            MemberId: Joi.string().required(),
            role: Joi.string().required()
        });
        const { error } = memberSchema.validate(req.body);
        if (error) {
            return next(error);
        }
        const { email, password, MemberId, role } = req.body;
        const hashedPassword = await bycrypt.hash(password, 10);
        try {
            const IdInUse = await memberRegMod.exists({ MemberId });
            if (IdInUse) {
                const error = {
                    status: 409,
                    message: "Member Already Exists"
                }
                return next(error);
            }
        } catch (error) {
            return next(error);
        }

        let member;
        try {
            const memberToRegister = new memberRegMod({
                email, password: hashedPassword, MemberId, role, ApplicationStatus: false
            });
            member = await memberToRegister.save();
            
        } catch (error) {
            return next(error);
        }
        res.status(201).json({
            data: member,
            msg: "Member Registered Successfully"
        });

    },

    async role(req, res, next) {
        const roleSchema = Joi.object({
            role: Joi.string().min(2).max(15).required(),
            permission: Joi.array().required(),
            status: Joi.boolean().required()
        })
        const { error } = roleSchema.validate(req.body);
        if (error) {
            return next(error);
        }
        const { role, permission, status } = req.body;
        let user;
        try {
            const usertorole = new Role({
                role,
                permission,
                status
            });
            user = await usertorole.save();
        } catch (error) {
            return next(error);
        }
        res.status(201).json({ data: user, msg: `Role has been assigned to: ${user.role}` })
    },



    async Register(req, res, next) {
        const userSchema = Joi.object({
            username: Joi.string().required(),
            password: Joi.string().required(),
            role: Joi.string().required(),
        });
        const { error } = userSchema.validate(req.body);
        if (error) {
            return next(error);
        }
        const { username, password, role } = req.body;

        const hashedPassword = await bycrypt.hash(password, 10);
        try {
            const usernameInUse = await User.exists({ username });
            if (usernameInUse) {
                const error = {
                    status: 409,
                    message: "Username already exists"
                }
                return res.status(409).json({message:"Username Already Exists"});
            }
        } catch (error) {
            return next(error);
        }

        let accessToken;
        let refreshToken;
        let user;
        try {
            const userToRegister = new User({
                username: username,
                password: hashedPassword,
                role: role,
            });
            user = await userToRegister.save();
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
            console.log("role: " + rol);

        } catch (error) { return next(error) }
        res.status(200).json({ Data: user, msg: `${rol.role} has been successfully registered` });
    },

    async logout(req, res, next) {
        const refreshToken = req.cookies?.refreshToken;
        console.log("refresh cookie: " + refreshToken);
        //delete the refresh token from DB
        try {
            await RefreshToken.deleteOne({ token: refreshToken })

            res.clearCookie('accessToken');
            res.clearCookie('refreshToken');

        } catch (error) {
            return next(error);
        }


        //send response

        res.status(200).json({ user: null, auth: false })
    },

    async getAllRoles(req, res, next) {
        let users = {};
        try {
            users = await role.find({}).populate({

                path: 'permission.Permission_id'

            });

        } catch (error) {
            return next(error);
        }
        res.status(200).json({
            data: users,
            msg: "ALL ROLES FETCHED SUCCESSFULLY"
        })
    },

    
    async getAllUsers(req, res, next) {
        let users = {};
        try {
            users = await User.find({}).populate({

                path: 'role',
                populate: {
                    path: 'permission.Permission_id'
                }
            });

        } catch (error) {
            return next(error);
        }
        res.status(200).json({
            data: users,
            msg: "ALL USERS FETCHED SUCCESSFULLY"
        })
    },
    async getAllRegisterdMembers(req, res, next) {
        let user;
        try {

            user = await memberRegMod.find({});

        } catch (error) {
            return next(error);
        }
        res.status(200).json({ data: user, msg: "All NEWLY REGISTERED MEMBERS FETCHED SUCCESSFULLY" })
    }
}

module.exports = adminController;