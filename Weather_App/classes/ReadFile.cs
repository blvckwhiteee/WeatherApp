namespace Weather_App.classes;

public static class ReadFile
{
    public static void ReadSomeFile(string filename)
    {
        try
        {
            StreamReader file = new StreamReader(filename);
            string line = file.ReadLine();
            while (line != null)
            {
                Console.WriteLine(line);
                line = file.ReadLine();
            }
            file.Close();
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
        }
    }
}