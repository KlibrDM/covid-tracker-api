import express from 'express';
import LocationController from '../controllers/location';
import DataController from '../controllers/data';
import UserController from '../controllers/user';
import auth from "../middleware/auth";

const router = express.Router();

//Locations
router.get('/locations', LocationController.getLocations);
router.get('/locations/:code', LocationController.getLocation);
router.post('/locations', auth, LocationController.addLocation);
router.get('/load-latest-locations', auth, LocationController.loadLatestLocations);

//Data
router.get('/get-data', DataController.getData);
router.get('/load-latest-data', auth, DataController.loadLatestData);
router.get('/load-all-data', auth, DataController.loadAllData);

//User
router.post('/user/register', UserController.register);
router.post('/user/login', UserController.login);

export = router;
