import { Router } from 'express';
import { getForecast, getGeocoding } from './weather.controller';

const weatherRouter = Router();

weatherRouter.get('/forecast', getForecast);
weatherRouter.get('/geocoding', getGeocoding);

export default weatherRouter;
