import { ClassMiddleware, Controller, Get } from '@overnightjs/core';
import { authMiddleware } from '../middlewares/auth';
import { Request, Response } from 'express';
import { Beach } from '../models/beachs';
import { Forecast } from '../services/forecast';

const forecast = new Forecast();

@Controller('forecast')
@ClassMiddleware(authMiddleware)
export class ForecastController {
  @Get('')
  public async getForecastForgeLoggedUser(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const beaches = await Beach.find({user: req.decoded?.id});
      const forecastData = await forecast.processForecastForBeaches(beaches);
      //console.log(forecastData)
      res.status(200).send(forecastData);
    } catch (error) {
      res.status(500).send({ error: 'Something went wrong' });
    }
  }
}