const express = require('express');
const route = express.Router();
const memberController = require('../controllers/memberController');
const plotController = require('../controllers/plotController');
const accounts = require('../controllers/accounts');
const ledger = require('../controllers/ledger');
const adminController = require('../controllers/adminController');
const notificationController = require('../controllers/notification');

//Admin Routes*******************************************************************done
route.post('/admin', adminController.login);
route.put('/admin/passwordReset/:id', adminController.passwordReset);
route.post('/admin/permissions', adminController.permissions);
route.post('/admin/role', adminController.role);
route.get('/admin/getAllUsers', adminController.getAllUsers);
route.get('/admin/role/getAllRoles', adminController.getAllRoles);
route.post('/admin/Register', adminController.Register);
route.post('/admin/logout', adminController.logout);

//Get all  registered members by admin
route.get('/admin/getAllRegisterdMembers', adminController.getAllRegisterdMembers);


//MEMBERS MANAGEMENT******************************************************done

//Members login Route
route.post('/members', memberController.login);

//Members Register Route
route.post('/members/membersRegister', memberController.register);



const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'LocalStorage/'); // Specify the upload destination folder
    },
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}-${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage: storage });

route.post('/members/addDetails/:id', upload.fields([
    { name: 'allotmentCertificate', maxCount: 1 },
    { name: 'membershipTransfer', maxCount: 1 },
    { name: 'applicationForm', maxCount: 1 },
    { name: 'underTaking', maxCount: 1 },
    { name: 'affidavit', maxCount: 1 },
    { name: 'transferImage', maxCount: 1 },
    { name: 'mergedPDF', maxCount: 1 },
]), memberController.addDetails);







//View ALL members
route.get('/members/all', memberController.all);

//View member by id
route.get('/members/getbyid/:id', memberController.getById);

//Edit member by id
route.put('/members/update/:id', memberController.update);

//Delete member by id
route.delete('/members/delete/:id', memberController.delete);






//PLOTS**************************************************************done
//Add Plots
route.post('/plots/add/:id', plotController.add);

//Add pLot
route.get('/plots/all/:id', plotController.all);

//View Plots By ID
route.get('/plots/getbyId/:id', plotController.getById);

//Delete Plots By ID
route.delete('/plots/delete/:id', plotController.delete);

//Update Plot
route.put('/plots/updateStatus/:id', plotController.update);

//Accounts*****************************************************************
route.post('/accounts', accounts.add);
route.get('/accounts/all', accounts.all);
route.get('/getAccountById/:id', accounts.getById);
route.put('/accounts/:id', accounts.update);
route.delete('/account/:id', accounts.delete);

//LEDGERS**********************************************************************done
route.post('/ledger/add/:id', ledger.add);
route.get('/ledger/all/:id', ledger.all);
route.get('/ledger/getById/:id', ledger.getById);
route.put('/ledger/updateStatus/:id', ledger.update);
route.delete('/ledger/delete/:id', ledger.delete);

//Notifications************************************************************************done
route.post('/notification/addById/:id',notificationController.addById);
route.post('/notification/sendAll',notificationController.sendAll);
route.get('/notification/getById/:id',notificationController.getById);
route.get('/notification/getAll',notificationController.getAll);


module.exports = route;