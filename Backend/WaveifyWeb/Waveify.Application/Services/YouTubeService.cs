using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Waveify.Application.Interfaces.Repositories;


namespace Waveify.Application.Services
{
    public class YouTubeService : IYouTubeService
    {
        private readonly IConfiguration _configuration; // добавляем конфигурацию

        public YouTubeService(IConfiguration configuration)
        {
            _configuration = configuration; // инициализируем конфигурацию
        }

        public async Task<(byte[] data, string error)> DownloadAudioAsync(string url, string format)
        {
            if (string.IsNullOrWhiteSpace(url))
                return (null, "URL is empty");

            if (format != "mp3" && format != "wav")
                return (null, "Unsupported format");

            var ytDlpPath = _configuration["YouTube:YtDlpPath"];
            var tempFileName = $"{Guid.NewGuid()}.{format}";
            var outputPath = Path.Combine("D:\\WaveifyDownloads", tempFileName); // Путь для сохранения

            try
            {
                var processInfo = new ProcessStartInfo
                {
                    FileName = ytDlpPath, // полный путь к exe
                    Arguments = $"-x --audio-format {format} -o \"{outputPath}\" {url}",
                    RedirectStandardOutput = true,
                    RedirectStandardError = true,
                    UseShellExecute = false,
                    CreateNoWindow = true
                };

                using var process = Process.Start(processInfo);

                // Чтение стандартного вывода и ошибок
                var output = await process.StandardOutput.ReadToEndAsync();
                var errorOutput = await process.StandardError.ReadToEndAsync();

                // Логирование выводов
                Console.WriteLine($"yt-dlp Output: {output}");
                Console.WriteLine($"yt-dlp Error: {errorOutput}");

                // Ждем завершения процесса
                await process.WaitForExitAsync();

                // Проверяем, создался ли файл
                if (!File.Exists(outputPath))
                    return (null, "File not created");

                var bytes = await File.ReadAllBytesAsync(outputPath);
                File.Delete(outputPath);

                return (bytes, null);
            }
            catch (Exception ex)
            {
                return (null, $"Unexpected error: {ex.Message}");
            }
        }

    }
}
