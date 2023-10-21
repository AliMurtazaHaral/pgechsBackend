const mongoose = require('mongoose');
const { Schema } = mongoose;

const fileUploadSchema = new Schema({
    originalname: String,
    mimetype: String,
    filename: String,
    path: String,
    size: Number,
});

const members = new Schema({
    name: {
        type: String,
        require: true
    },
    address: {
        type: String,
        require: true
    },
    phoneNumber: {
        type: String,
        require: true
    },
    cnic: {
        type: String,
        require: true
    },
    member_id: {
        type: mongoose.SchemaTypes.ObjectId, ref: "MemberRegMod",
        require: true
    },
    // Create fields for each named file upload
    allotmentCertificate: {
        type: fileUploadSchema,
        require: true
    },
    membershipTransfer: {
        type: fileUploadSchema,
        require: true
    },
    applicationForm: {
        type: fileUploadSchema,
        require: true
    },
    underTaking: {
        type: fileUploadSchema,
        require: true
    },
    affidavit: {
        type: fileUploadSchema,
        require: true
    },
    transferImage: {
        type: fileUploadSchema,
        require: true
    },
    mergedPDF: {
        type: fileUploadSchema,
    },

    approvalStatus:{
        type:Boolean,
        default:false
    }
},
    { timestamps: true }
);
module.exports = mongoose.model('Member', members);