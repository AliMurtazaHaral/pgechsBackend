const joi = require('joi');
const NotificationModel = require('../models/notifications');

const notificationController = {
    async addById(req,res,next){
        const notificationSchema = joi.object({
            SingleNotificationMessage:joi.string().required()
        });
        const {error} = notificationSchema.validate(req.body);
        if(error){
            return next(error);
        }
        const {id} = req.params
        const {SingleNotificationMessage} = req.body;
        let notification;
        try {
            const addNotification = new NotificationModel({
                MemberID:id,
                SingleNotificationMessage
            });
            notification = await addNotification.save();
        } catch (error) {
            return next(error);
        }
        res.status(200).json({
            data:notification,
            message:"Notification Added"
        });
    },


    async sendAll(req,res,next){
        const notificationSchema = joi.object({
            CollectiveNotificationMessage:joi.string().required()
        });
        const {error} = notificationSchema.validate(req.body);
        if(error){
            return next(error);
        }
        const {CollectiveNotificationMessage} = req.body;
        let notification;
        try {
            const addNotification = new NotificationModel({
                CollectiveNotificationMessage
            });
            notification = await addNotification.save();
        } catch (error) {
            return next(error);
        }
        res.status(200).json({
            data:notification,
            message:"Notification Added"
        });
    },

    async getById(req,res,next){
        const{id} = req.params;
        let notifications
        try {
            const findNotifications = await NotificationModel.findOne({id}).populate();
            notifications = findNotifications;
        } catch (error) {
            return next(error);
        }
       res.status(200).json({
        data:notifications,
        message:"Notification fetched successfully"
       });
    },
    async getAll(req,res,next){
        let notification ={};
        try {
            notification = await NotificationModel.find({})
        } catch (error) {
            return next (error)
        }
        res.status(200).json({data:notification,message:"Notifications Fetch Successfully"});
    }
}

module.exports = notificationController;