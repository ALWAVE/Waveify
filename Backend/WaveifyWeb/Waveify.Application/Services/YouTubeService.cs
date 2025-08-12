using System.Diagnostics;
using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Configuration;
using Waveify.Application.Interfaces.Repositories;

namespace Waveify.Application.Services
{
    public class YouTubeService : IYouTubeService
    {
        private readonly string _ytDlpPath;
        private readonly string _ffmpegPath;

        public YouTubeService(IConfiguration cfg)
        {
            _ytDlpPath = ResolvePathSmart(cfg["YouTube:YtDlpPath"]) ?? "yt-dlp";
            _ffmpegPath = ResolvePathSmart(cfg["YouTube:FfmpegPath"]) ?? "ffmpeg";
        }

        // ===== A) Скачать пользователю (байты + имя + content-type) =====
        public async Task<(byte[]? data, string? fileName, string? contentType, string? error)>
            DownloadAudioAsync(string url, string format)
        {
            if (string.IsNullOrWhiteSpace(url)) return (null, null, null, "URL is empty");
            format = (format ?? "mp3").ToLowerInvariant();
            if (format != "mp3" && format != "wav") return (null, null, null, "Unsupported format");

            var downloadsPath = @"D:\WaveifyDownloads";
            Directory.CreateDirectory(downloadsPath);

            var outTpl = Path.Combine(downloadsPath, "%(title)s.%(ext)s");

            if (!LooksLikeCommand(_ytDlpPath) && !File.Exists(_ytDlpPath))
                return (null, null, null, $"yt-dlp not found at '{_ytDlpPath}'");
            if (!LooksLikeCommand(_ffmpegPath) && !File.Exists(_ffmpegPath))
                return (null, null, null, $"ffmpeg not found at '{_ffmpegPath}'");

            try
            {
                var psi = MakePsi(
                    $"--ffmpeg-location \"{_ffmpegPath}\" -x --audio-format {format} -o \"{outTpl}\" \"{url}\""
                );
                using var p = Process.Start(psi)!;
                _ = await p.StandardOutput.ReadToEndAsync();
                var err = await p.StandardError.ReadToEndAsync();
                await p.WaitForExitAsync();

                if (p.ExitCode != 0)
                    return (null, null, null, $"yt-dlp download failed: {err}");

                var downloadedFile = Directory.GetFiles(downloadsPath, "*." + format)
                                              .OrderByDescending(File.GetCreationTimeUtc)
                                              .FirstOrDefault();
                if (downloadedFile == null)
                    return (null, null, null, "File not created");

                var originalTitle = Path.GetFileNameWithoutExtension(downloadedFile);
                var newFileName = $"Waveify - {SanitizeFileName(originalTitle)}.{format}";
                var newFilePath = Path.Combine(downloadsPath, newFileName);

                File.Move(downloadedFile, newFilePath, overwrite: true);
                var bytes = await File.ReadAllBytesAsync(newFilePath);
                File.Delete(newFilePath);

                var contentType = format == "wav" ? "audio/wav" : "audio/mpeg";
                return (bytes, newFileName, contentType, null);
            }
            catch (Exception ex)
            {
                return (null, null, null, $"Unexpected error: {ex.Message}");
            }
        }

        // ===== B) Метаданные для модалки =====
        public async Task<(YtMetadata? meta, string? error)> GetMetadataAsync(string url, CancellationToken ct = default)
        {
            if (!LooksLikeCommand(_ytDlpPath) && !File.Exists(_ytDlpPath))
                return (null, $"yt-dlp not found at '{_ytDlpPath}'");

            var psi = MakePsi($"--no-playlist --dump-json \"{url}\"");
            using var p = Process.Start(psi)!;
            string stdout = await p.StandardOutput.ReadToEndAsync();
            string stderr = await p.StandardError.ReadToEndAsync();
            await p.WaitForExitAsync();

            if (p.ExitCode != 0) return (null, $"yt-dlp metadata failed: {stderr}");

            using var doc = JsonDocument.Parse(stdout);
            var root = doc.RootElement;

            var meta = new YtMetadata
            {
                Id = root.TryGetProperty("id", out var id) ? id.GetString() ?? Guid.NewGuid().ToString("N") : Guid.NewGuid().ToString("N"),
                Title = root.TryGetProperty("title", out var t) ? t.GetString() ?? "Unknown Title" : "Unknown Title",
                Uploader = root.TryGetProperty("uploader", out var u) ? (u.GetString() ?? "Unknown") : "Unknown",
                DurationSec = root.TryGetProperty("duration", out var d) ? d.GetDouble() : null,
                Thumbnail = root.TryGetProperty("thumbnail", out var th) ? th.GetString() : null
            };
            return (meta, null);
        }

        // ===== C) Server-side: во временную папку + thumbnail =====
        public async Task<(string? filePath, string? error)> DownloadAudioToTempAsync(string url, string format, string workingDir, CancellationToken ct = default)
        {
            Directory.CreateDirectory(workingDir);
            var outTpl = Path.Combine(workingDir, "%(id)s.%(ext)s");

            if (!LooksLikeCommand(_ytDlpPath) && !File.Exists(_ytDlpPath))
                return (null, $"yt-dlp not found at '{_ytDlpPath}'");
            if (!LooksLikeCommand(_ffmpegPath) && !File.Exists(_ffmpegPath))
                return (null, $"ffmpeg not found at '{_ffmpegPath}'");

            var psi = MakePsi($"--no-playlist -x --ffmpeg-location \"{_ffmpegPath}\" --audio-format {format} -o \"{outTpl}\" \"{url}\"", workingDir);
            using var p = Process.Start(psi)!;
            _ = await p.StandardOutput.ReadToEndAsync();
            var err = await p.StandardError.ReadToEndAsync();
            await p.WaitForExitAsync();

            if (p.ExitCode != 0) return (null, $"yt-dlp download failed: {err}");

            var created = Directory.GetFiles(workingDir, $"*.{format}")
                                   .OrderByDescending(File.GetCreationTimeUtc)
                                   .FirstOrDefault();
            if (created == null) return (null, "audio file not found");
            return (created, null);
        }

        public async Task<(string? thumbPath, string? error)> DownloadThumbnailToTempAsync(string url, string workingDir, CancellationToken ct = default)
        {
            Directory.CreateDirectory(workingDir);
            var outTpl = Path.Combine(workingDir, "%(id)s.%(ext)s");

            if (!LooksLikeCommand(_ytDlpPath) && !File.Exists(_ytDlpPath))
                return (null, $"yt-dlp not found at '{_ytDlpPath}'");

            var psi = MakePsi($"--no-playlist --skip-download --write-thumbnail --convert-thumbnails jpg -o \"{outTpl}\" \"{url}\"", workingDir);
            using var p = Process.Start(psi)!;
            _ = await p.StandardOutput.ReadToEndAsync();
            var err = await p.StandardError.ReadToEndAsync();
            await p.WaitForExitAsync();

            if (p.ExitCode != 0) return (null, $"yt-dlp thumb failed: {err}");

            var img = Directory.GetFiles(workingDir, $"*.jpg")
                               .OrderByDescending(File.GetCreationTimeUtc)
                               .FirstOrDefault();
            if (img == null) return (null, "thumbnail not found");
            return (img, null);
        }

        // ===== helpers =====

        private ProcessStartInfo MakePsi(string args, string? cwd = null) => new()
        {
            FileName = _ytDlpPath,   // запускаем ИМЕННО yt-dlp.exe
            Arguments = args,
            WorkingDirectory = cwd ?? AppContext.BaseDirectory,
            RedirectStandardOutput = true,
            RedirectStandardError = true,
            UseShellExecute = false,
            CreateNoWindow = true,
            StandardOutputEncoding = Encoding.UTF8,
            StandardErrorEncoding = Encoding.UTF8
        };

        // Если путь относительный — пробуем разные базы + подъём вверх по дереву
        private static string? ResolvePathSmart(string? configuredPath)
        {
            if (string.IsNullOrWhiteSpace(configuredPath)) return null;

            // простое имя (yt-dlp / ffmpeg) — пусть ищется в PATH
            if (LooksLikeCommand(configuredPath)) return configuredPath;

            // абсолютный
            if (Path.IsPathRooted(configuredPath))
                return configuredPath;

            // кандидаты базовых директорий
            var bases = new List<string?>
            {
                AppContext.BaseDirectory,
                Directory.GetCurrentDirectory()
            };

            // пробуем сочетания
            foreach (var b in bases)
            {
                if (string.IsNullOrWhiteSpace(b)) continue;
                var p = Path.GetFullPath(Path.Combine(b, configuredPath));
                if (File.Exists(p)) return p;
            }

            // поднимаемся вверх от bin на несколько уровней (до 6)
            var probe = AppContext.BaseDirectory;
            for (int i = 0; i < 6 && !string.IsNullOrEmpty(probe); i++)
            {
                probe = Directory.GetParent(probe)?.FullName;
                if (string.IsNullOrEmpty(probe)) break;
                var p = Path.GetFullPath(Path.Combine(probe, configuredPath));
                if (File.Exists(p)) return p;
            }

            // если не нашли — вернём абсолют от bin (для понятного логирования)
            return Path.GetFullPath(Path.Combine(AppContext.BaseDirectory, configuredPath));
        }

        private static bool LooksLikeCommand(string pathOrName)
        {
            // не содержит слешей — значит просто имя; пусть ОС ищет в PATH
            return !(pathOrName.Contains('\\') || pathOrName.Contains('/'));
        }

        private static string SanitizeFileName(string name)
        {
            foreach (var c in Path.GetInvalidFileNameChars()) name = name.Replace(c, '_');
            return name.Trim();
        }
    }
}
