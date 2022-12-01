import express from 'express';
import LocationController from '../controllers/location';
import DataController from '../controllers/data';
import UserController from '../controllers/user';
import ChartController from '../controllers/chart';
import CustomLocationController from '../controllers/customLocation';
import CustomLocationDataController from '../controllers/customLocationData';
import auth from "../middleware/auth";

const router = express.Router();

//Locations
router.get('/locations', LocationController.getLocations);
router.get('/locations/:code', LocationController.getLocation);
router.post('/locations', auth, LocationController.addLocation);
router.get('/load-latest-locations', auth, LocationController.loadLatestLocations);

//Custom locations
router.get('/custom-locations', auth, CustomLocationController.getCustomLocations);
router.get('/custom-locations/get-public', CustomLocationController.getPublicCustomLocations);
router.get('/custom-locations/get-all', auth, CustomLocationController.getAllCustomLocations);
router.get('/custom-locations/:code', auth, CustomLocationController.getCustomLocation);
router.delete('/custom-locations/:code', auth, CustomLocationController.deleteCustomLocation);
router.put('/custom-locations/:code', auth, CustomLocationController.updateCustomLocation);
router.post('/custom-locations', auth, CustomLocationController.addCustomLocation);

//Data
router.get('/get-data', DataController.getData);
router.get('/get-latest-data', DataController.getLatestData);
router.get('/load-latest-data', auth, DataController.loadLatestData);
router.get('/load-all-data', auth, DataController.loadAllData);

//Custom locations data
router.post('/custom-locations/data', auth, CustomLocationDataController.addData);
router.patch('/custom-locations/data', auth, CustomLocationDataController.updateData);

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
