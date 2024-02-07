const express = require('express');
const router = express.Router();
const { apiHealthCheck } =require('../controllers/healthzController');

router.all('/', apiHealthCheck);

module.exports = router;
