using Weather_App.classes;

namespace Weather_App;

class Program
{
    static async Task Main()
    {
        Console.Write("Enter city name: ");
        string? cityName = Console.ReadLine();
        Response apiResponse = new Response();
        await apiResponse.ApiResponse(cityName);
        InfoOutput.AddressInfoOutput();
        InfoOutput.WeatherInfoOutput();
        
    }
}