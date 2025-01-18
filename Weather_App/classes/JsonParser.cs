using System.Text.Json;

namespace Weather_App.classes;

public static class JsonParser
{
    public static string JsonParse(string path, string firstProperty, string lastProperty)
    {
        var json = File.ReadAllText(path);
        var jsonObject = JsonSerializer.Deserialize<JsonElement>(json);
        return jsonObject.GetProperty(firstProperty).GetProperty(lastProperty).ToString();
    }
}