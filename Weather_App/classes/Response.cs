namespace Weather_App.classes
{
    public class Response
    {
        private readonly string basedURL = "http://api.weatherapi.com/v1/";
        private readonly string APIKey = "e9a21ef797cc4398ab9163543251801";

        public async Task ApiResponse(string city)
        {
            try
            {
                using HttpClient client = new HttpClient();
                client.BaseAddress = new Uri(basedURL);
                HttpResponseMessage response = await client.GetAsync($"current.json?key={APIKey}&q={city}&lang=ru");

                if (response.IsSuccessStatusCode)
                {
                    string responseString = await response.Content.ReadAsStringAsync();
                    string path = Info.path;
                    WriteFile.WriteSomeFile(path,responseString);
                }
                else
                {
                    Console.WriteLine($"Ошибка: {response.StatusCode}");
                    
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Произошла ошибка: {ex.Message}");
            }
        }
    }
}