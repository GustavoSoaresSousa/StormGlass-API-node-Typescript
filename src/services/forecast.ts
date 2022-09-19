import { ForecastPoint, StormGlass } from "@src/clients/stormGlass";
import { InternalError } from "@src/util/Errors/internal-error";
import { time } from "console";

export enum BeachPosition {
  S ='S',
  E = 'E',
  W = 'W',
  N = 'N',
}

export interface Beach {
  name: string;
  position: BeachPosition;
  lat: number;
  lng: number;
  user: string;
}

export interface BeachForecast extends Omit<Beach, 'user'>, ForecastPoint {}
export interface TimeForecast {
  time: string;
  forecast: BeachForecast[]
}

export class ForecastInternalError extends InternalError{
  constructor(message: string){
    super(`Unexpected error during the forecast processing: ${message}`);
  }
}


export class Forecast {
  constructor(protected stormGlass = new StormGlass()){}

  public async  processForecastForbeaches(beaches: Beach[]): Promise<TimeForecast[]>{
    try{
        const pointsWithCorrectSources:BeachForecast[]  = [];
        for(const beach of beaches){
          const points = await this.stormGlass.fetchPoints(beach.lat, beach.lng);
          const enrichedBeachData = this.enrichedBeachData(points, beach);
          pointsWithCorrectSources.push(...enrichedBeachData);
        }
        return this.mapForecastByTime(pointsWithCorrectSources);
    }catch(err){
      throw new ForecastInternalError('Error fetch data');
    }

  }

  private mapForecastByTime(forecast: BeachForecast[]) : TimeForecast[] {
    const forecastByTime: TimeForecast[] = [];
    for(const point of forecast){
      const timePoint = forecastByTime.find((f) => f.time == point.time);
      if(timePoint){
        timePoint.forecast.push(point)
      }else{
        forecastByTime.push({
          time: point.time,
          forecast: [point]
        })
      }
    }
    return forecastByTime;
  }

  private enrichedBeachData(points: ForecastPoint[], beach: Beach): BeachForecast[]{
    return points.map((e) => ({
      ...{},
      ...{
        lat: beach.lat,
        lng: beach.lng,
        name: beach.name,
        position: beach.position,
        rating: 1
      },
      ...e,
    }));
  }
}