namespace Weather_App.classes;

public static class InfoOutput
{
    public static void AddressInfoOutput()
    {
        Info info = new Info();
        Console.WriteLine($"{info.CityName} | {info.RegionName} | {info.CountryName}");
        Console.WriteLine($"Current local time: {info.LocalTime}");
    }

    public static void WeatherInfoOutput()
    {
        Info info = new Info();
        WeatherParse weather = new WeatherParse();
        Console.WriteLine($"Information was last updated at {weather.LastUpdated}");
        Console.WriteLine(
            $"Temperature {weather.Temperature}\u00b0C in {info.CityName} feels like {weather.FeelsLike}\u00b0C");
        Console.WriteLine($"Wind speed is {weather.WindSpeed} km per hour");
        Console.WriteLine($"Cloudy is {weather.Cloudy} % | Humidity is {weather.Humidity} %");
    }
}