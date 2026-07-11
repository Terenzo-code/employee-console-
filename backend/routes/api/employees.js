
const express = require('express');
const router = express.Router();
const employeesController = require('../../controllers/employeesControl');
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');

router.route('/')
    .get( employeesController.getAllEmployees)
    .post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), employeesController.createNewEmployee) 
    .put(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),  employeesController.updateEmployee)
    .delete(verifyRoles(ROLES_LIST.Admin),employeesController.deleteEmployee);

    /*
router.route('/id{.:ext}')

    .get((req, res) =>{
        res.json({"id": req.params.id});
    })*/

// Add the colon ':' before 'id' to turn it into a route parameter
// Notice no string quotes, and we use a capture group (\d+)
/*
router.get(/^\/(\d+)$/, (req, res) => {
    // In raw regex routes, Express places capture groups in numbered indexes
    res.json({ "id": req.params[0] }); 
});
*/

router.get((/^\/(\d+)$/), employeesController.getEmployee)




module.exports = router;
