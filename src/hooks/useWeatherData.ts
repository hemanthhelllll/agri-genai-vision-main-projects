import { useState, useEffect } from 'react';

interface WeatherData {
  temperature: number;
  rainfall: number;
  humidity: number;
  location: string;
}

interface UseWeatherDataProps {
  latitude?: number;
  longitude?: number;
  enabled?: boolean;
}

export const useWeatherData = ({ latitude, longitude, enabled = false }: UseWeatherDataProps = {}) => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled || !latitude || !longitude) return;

    const fetchWeather = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch current weather and forecast data from Open-Meteo API
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m&daily=precipitation_sum&timezone=auto`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch weather data');
        }

        const data = await response.json();

        // Get location name from geocoding API
        const geoResponse = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?latitude=${latitude}&longitude=${longitude}&count=1`
        );
        const geoData = await geoResponse.json();
        const locationName = geoData.results?.[0]?.name || 'Unknown Location';

        setWeatherData({
          temperature: Math.round(data.current.temperature_2m),
          rainfall: Math.round(data.daily.precipitation_sum[0] || 0),
          humidity: Math.round(data.current.relative_humidity_2m),
          location: locationName,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [latitude, longitude, enabled]);

  return { weatherData, loading, error };
};
