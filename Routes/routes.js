const express = require('express');
const route = express.Router();
const memberController = require('../controllers/memberController');
const plotController = require('../controllers/plotController');
const plotDetails = require('../controllers/plotDetails');
const accounts = require('../controllers/accounts');
const accountHead = require('../controllers/accountHead');
const accountHeadAmount = require('../controllers/accountHeadAmount');
const employee = require('../controllers/employee');
const employeeSalary = require('../controllers/employeeSalary');
const expenditure = require('../controllers/expenditure');
const expenditureTotal = require('../controllers/expenditureTotal');
const expenditureManagement = require('../controllers/expenditureManagement');
const incomeStatement = require('../controllers/incomeStatement');
const incomeTotal = require('../controllers/incomeTotal');
const ledger = require('../controllers/ledger');
const voucher = require('../controllers/voucher');
const adminController = require('../controllers/adminController');
const notificationController = require('../controllers/notification');

//Admin Routes*******************************************************************done
route.post('/admin', adminController.login);
route.post('/memberLogin', adminController.memberLogin);
route.put('/admin/passwordReset/:id', adminController.passwordReset);
route.post('/admin/permissions', adminController.permissions);
route.post('/admin/role', adminController.role);
route.get('/admin/getAllUsers', adminController.getAllUsers);
route.get('/admin/role/getAllRoles', adminController.getAllRoles);
route.post('/admin/Register', adminController.Register);
route.post('/admin/logout', adminController.logout);
route.delete('/admin/memberDelete/:id', adminController.delete);

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
route.put('/members/transfer/:id', memberController.updateTransfer);

//Delete member by id
route.delete('/members/delete/:id', memberController.delete);






//PLOTS**************************************************************
//Add Plots
route.post('/plots/add/:id', plotController.add);

//Add pLot
route.get('/plots/all/:id', plotController.all);
route.get('/plots/all', plotController.all1);

//View Plots By ID
route.get('/plots/getbyId/:id', plotController.getById);

//Delete Plots By ID
route.delete('/plots/delete/:id', plotController.delete);

//Update Plot
route.put('/plots/updateStatus/:id', plotController.update);

//PLOT DETAILS**************************************************************
//Add Plots
route.post('/plotDetails/add/:id', plotDetails.add);

//Add pLot
route.get('/plotDetails/all', plotDetails.all);

//View Plots By ID
route.get('/plotDetails/getbyId/:id', plotDetails.getById);

//Delete Plots By ID
route.delete('/plotDetails/delete/:id', plotDetails.delete);

//Update Plot
route.put('/plotDetails/updateStatus/:id', plotDetails.update);

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

//ACCOUNT HEADS**************************************************************

route.post('/accountHead/add', accountHead.add);
route.get('/accountHead/all/', accountHead.all);
route.delete('/accountHead/delete/:id', accountHead.delete);
route.put('/accountHead/update/:id', accountHead.update);
route.post('/accountHeadAmount/add/:id', accountHeadAmount.add);
route.get('/accountHeadAmount/all/:id', accountHeadAmount.all);
route.put('/accountHeadAmount/update/:id', accountHeadAmount.update);
route.delete('/accountHeadAmount/delete/:id', accountHeadAmount.delete);

//EMPLOYEES**************************************************************

route.post('/employee/add', employee.add);
route.post('/employeeSalary/add/:id', employeeSalary.add);
route.get('/employeeSalary/all/:id', employeeSalary.all);
route.put('/employeeSalary/update/:id', employeeSalary.update);
route.delete('/employeeSalary/delete/:id', employeeSalary.delete);
route.get('/employee/all/', employee.all);
route.delete('/employee/delete/:id', employee.delete);
route.put('/employee/update/:id', employee.update);

//EXPENDITURES**************************************************************

route.post('/expenditure/add', expenditure.add);
route.get('/expenditure/all/', expenditure.all);
route.delete('/expenditure/delete/:id', expenditure.delete);
route.put('/expenditure/update/:id', expenditure.update);

//EXPENDITURES TOTAL**************************************************************

route.post('/expenditureTotal/add', expenditureTotal.add);
route.get('/expenditureTotal/all', expenditureTotal.all);
route.delete('/expenditureTotal/delete/:id', expenditureTotal.delete);
route.put('/expenditureTotal/update/:id', expenditureTotal.update);

//EXPENDITURES MANAGEMENT**************************************************************

route.post('/expenditureManagement/add', expenditureManagement.add);
route.get('/expenditureManagement/all/', expenditureManagement.all);
route.delete('/expenditureManagement/delete/:id', expenditureManagement.delete);
route.put('/expenditureManagement/update/:id', expenditureManagement.update);

//INCOME STATEMENTS**************************************************************

route.post('/incomeStatement/add', incomeStatement.add);
route.get('/incomeStatement/all/', incomeStatement.all);
route.delete('/incomeStatement/delete/:id', incomeStatement.delete);
route.put('/incomeStatement/update/:id', incomeStatement.update);

//INCOME TOTAL**************************************************************

route.post('/incomeTotal/add', incomeTotal.add);
route.get('/incomeTotal/all/', incomeTotal.all);
route.delete('/incomeTotal/delete/:id', incomeTotal.delete);
route.put('/incomeTotal/update/:id', incomeTotal.update);

//VOUCHER**************************************************************

route.post('/voucher/add', voucher.add);
route.get('/voucher/all/', voucher.all);
route.delete('/voucher/delete/:id', voucher.delete);
route.put('/voucher/update/:id', voucher.update);

module.exports = route;