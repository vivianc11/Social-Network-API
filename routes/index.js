const router = require('express').Router();

// IMPORT API ROUTES
const apiRoutes = require('./api');

// ADDING PREFEX OF `/api` TO API ROUTES
router.use('/api', apiRoutes);

router.use((req, res) => res.send('Wrong route!'));

module.exports = router;