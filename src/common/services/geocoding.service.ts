import { Client, Status } from '@googlemaps/google-maps-services-js';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GeocodingService {
  private readonly GOOGLE_MAPS_API_KEY: string;
  private readonly client = new Client();
  private readonly logger = new Logger(GeocodingService.name);

  constructor(private configService: ConfigService) {
    this.GOOGLE_MAPS_API_KEY = this.configService.getOrThrow<string>(
      'GOOGLE_MAPS_API_KEY'
    );
  }

  async geocode(address: string): Promise<{ lat: number; lng: number } | null> {
    try {
      const apiKey = this.GOOGLE_MAPS_API_KEY;

      if (!apiKey) {
        this.logger.error('GOOGLE_MAPS_API_KEY is not defined');
        return null;
      }

      const response = await this.client.geocode({
        params: {
          address,
          key: apiKey,
        },
      });

      if (
        response.data.status === Status.OK &&
        response.data.results.length > 0
      ) {
        const location = response.data.results[0].geometry.location;
        return { lat: location.lat, lng: location.lng };
      }

      this.logger.warn(
        `Geocoding failed for address "${address}" with status: ${response.data.status}`
      );
      return null;
    } catch (error) {
      this.logger.error(
        `Geocoding error for address "${address}": ${
          (error as Error).message ?? error
        }`
      );
      return null;
    }
  }
}
