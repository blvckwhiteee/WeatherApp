using System.Text;
using System.Text.Json;

namespace Weather_App.classes;

public static class WriteFile
{
    public static void WriteSomeFile(string filename, string content)
    {
        try
        {
            var jsonObject = JsonSerializer.Deserialize<object>(content);
            var options = new JsonSerializerOptions
            {
                WriteIndented = true
            };
            var formattedJson = JsonSerializer.Serialize(jsonObject, options);

            StreamWriter file = new StreamWriter(filename, false, Encoding.UTF8);
            file.WriteLine(formattedJson);
            file.Close();
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
        }
    }
}