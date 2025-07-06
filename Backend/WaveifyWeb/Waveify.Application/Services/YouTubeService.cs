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
        private readonly IConfiguration _configuration; 

        public YouTubeService(IConfiguration configuration)
        {
            _configuration = configuration; 
        }

        public async Task<(byte[] data, string fileName, string error)> DownloadAudioAsync(string url, string format)
        {
            if (string.IsNullOrWhiteSpace(url))
                return (null, null, "URL is empty");

            if (format != "mp3" && format != "wav")
                return (null, null, "Unsupported format");

            var ytDlpPath = _configuration["YouTube:YtDlpPath"];
            var ffmpegPath = _configuration["YouTube:FfmpegPath"];
            var downloadsPath = "D:\\WaveifyDownloads";
            var fileTemplate = "%(title)s.%(ext)s";
            var outputPathTemplate = Path.Combine(downloadsPath, fileTemplate);

            try
            {
                var processInfo = new ProcessStartInfo
                {
                    FileName = ytDlpPath,
                    Arguments = $"--ffmpeg-location \"{ffmpegPath}\" -x --audio-format {format} -o \"{outputPathTemplate}\" {url}",
                    RedirectStandardOutput = true,
                    RedirectStandardError = true,
                    UseShellExecute = false,
                    CreateNoWindow = true
                };

                using var process = Process.Start(processInfo);
                var output = await process.StandardOutput.ReadToEndAsync();
                var errorOutput = await process.StandardError.ReadToEndAsync();
                await process.WaitForExitAsync();

                var downloadedFile = Directory.GetFiles(downloadsPath, "*." + format)
                     .OrderByDescending(File.GetCreationTime)
                     .FirstOrDefault();

                if (downloadedFile == null)
                    return (null, null, $"File not created. yt-dlp error: {errorOutput}");

                var originalTitle = Path.GetFileNameWithoutExtension(downloadedFile);
                var newFileName = $"Waveify - {originalTitle}.{format}";
                var newFilePath = Path.Combine(downloadsPath, newFileName);

                File.Move(downloadedFile, newFilePath);

                var bytes = await File.ReadAllBytesAsync(newFilePath);
                File.Delete(newFilePath);

                return (bytes, newFileName, null);
            }
            catch (Exception ex)
            {
                return (null, null, $"Unexpected error: {ex.Message}");
            }
        }

    }

}


    

