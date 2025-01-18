namespace Weather_App.classes;

public class WeatherParse
{
    public string? WindSpeed = JsonParser.JsonParse(Info.path, "current", "wind_kph");
    public string? Humidity = JsonParser.JsonParse(Info.path, "current", "humidity");
    public string? Cloudy = JsonParser.JsonParse(Info.path, "current", "cloud");
    public string? Temperature = JsonParser.JsonParse(Info.path, "current", "temp_c");
    public string? LastUpdated = JsonParser.JsonParse(Info.path, "current", "last_updated");
    public string? FeelsLike = JsonParser.JsonParse(Info.path, "current", "feelslike_c");
}