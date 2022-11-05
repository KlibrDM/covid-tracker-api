import express from 'express';
import LocationController from '../controllers/location';
import DataController from '../controllers/data';
import UserController from '../controllers/user';
import ChartController from '../controllers/chart';
import auth from "../middleware/auth";

const router = express.Router();

//Locations
router.get('/locations', LocationController.getLocations);
router.get('/locations/:code', LocationController.getLocation);
router.post('/locations', auth, LocationController.addLocation);
router.get('/load-latest-locations', auth, LocationController.loadLatestLocations);

//Data
router.get('/get-data', DataController.getData);
router.get('/get-latest-data', DataController.getLatestData);
router.get('/load-latest-data', auth, DataController.loadLatestData);
router.get('/load-all-data', auth, DataController.loadAllData);

//Custom charts
router.get('/charts', auth, ChartController.getCharts);
router.get('/charts/get-public', ChartController.getPublicCharts);
router.get('/charts/get-all', auth, ChartController.getAllCharts);
router.get('/charts/:id', auth, ChartController.getChart);
router.delete('/charts/:id', auth, ChartController.deleteChart);
router.put('/charts/:id', auth, ChartController.updateChart);
router.post('/charts', auth, ChartController.addChart);

//User
router.post('/user/register', UserController.register);
router.post('/user/login', UserController.login);

export = router;
