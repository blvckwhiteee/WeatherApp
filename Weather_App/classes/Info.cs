namespace Weather_App.classes;

public class Info
{
    public static readonly string path = @"C:\ExDesktop\Study\CS\DobrySharpist\Weather_App\Weather_App\files\result.json";
    public string? CityName = JsonParser.JsonParse(path, "location", "name");
    public string? RegionName = JsonParser.JsonParse(path, "location", "region");
    public string? CountryName = JsonParser.JsonParse(path, "location", "country");
    public string? LocalTime = JsonParser.JsonParse(path, "location", "localtime");
}

