import express from 'express';
import LocationController from '../controllers/location';
import DataController from '../controllers/data';
import UserController from '../controllers/user';
import ChartController from '../controllers/chart';
import CustomLocationController from '../controllers/customLocation';
import CustomLocationDataController from '../controllers/customLocationData';
import SimulationController from '../controllers/simulation';
import ReportController from '../controllers/report';
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
router.get('/custom-locations/get-by-id/:id', auth, CustomLocationController.getCustomLocationById);
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
//Using post instead of delete because the query string may exceed the maximum length
router.post('/custom-locations/data-delete', auth, CustomLocationDataController.deleteDataSelection);

//Custom charts
router.get('/charts', auth, ChartController.getCharts);
router.get('/charts/get-public', ChartController.getPublicCharts);
router.get('/charts/get-all', auth, ChartController.getAllCharts);
router.get('/charts/:id', auth, ChartController.getChart);
router.delete('/charts/:id', auth, ChartController.deleteChart);
router.put('/charts/:id', auth, ChartController.updateChart);
router.post('/charts', auth, ChartController.addChart);

//Reports
router.get('/reports', auth, ReportController.getReports);
router.get('/reports/get-public', ReportController.getPublicReports);
router.get('/reports/get-all', auth, ReportController.getAllReports);
router.get('/reports/:id', auth, ReportController.getReport);
router.delete('/reports/:id', auth, ReportController.deleteReport);
router.put('/reports/:id', auth, ReportController.updateReport);
router.post('/reports', auth, ReportController.addReport);

//Simulation
router.get('/simulation', auth, SimulationController.getSimulations);
router.get('/simulation/get-public', SimulationController.getPublicSimulations);
router.get('/simulation/get-all', auth, SimulationController.getAllSimulations);
router.get('/simulation/:id', auth, SimulationController.getSimulation);
router.delete('/simulation/:id', auth, SimulationController.deleteSimulation);
router.put('/simulation/:id', auth, SimulationController.updateSimulation);
router.post('/simulation', SimulationController.runSimulation);
router.post('/simulation/save', auth, SimulationController.saveSimulation);

//User
router.post('/user/register', UserController.register);
router.post('/user/login', UserController.login);

export = router;
