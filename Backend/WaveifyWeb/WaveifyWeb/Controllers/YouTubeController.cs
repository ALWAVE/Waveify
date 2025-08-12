using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Amazon.S3;
using Waveify.API.Settings;
using Waveify.Application.Interfaces.Repositories;
using Waveify.Core.Enums;
using Waveify.Core.Models;
using System.Net.Http; // <-- добавь

// алиас для доменных тегов, если нужно
using DomainTag = Waveify.Core.Models.Tag;
using Waveify.API.Contracts;
using Amazon.S3.Model;
using System.Text.Json.Serialization;

namespace Waveify.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class YouTubeController : ControllerBase
    {
        private readonly IYouTubeService _youTube;
        private readonly IAmazonS3 _s3;
        private readonly S3Settings _s3s;
        private readonly ISongRepositories _songs;

        // единый http-клиент, без AddHttpClient
        private static readonly HttpClient _http = new HttpClient(new HttpClientHandler
        {
            AllowAutoRedirect = true,
            AutomaticDecompression = System.Net.DecompressionMethods.All
        });

        public YouTubeController(
            IYouTubeService youTubeService,
            IAmazonS3 s3,
            IOptions<S3Settings> s3Settings,
            ISongRepositories songs)
        {
            _youTube = youTubeService;
            _s3 = s3;
            _s3s = s3Settings.Value;
            _songs = songs;

            // базовые заголовки (на всякий)
            if (!_http.DefaultRequestHeaders.Contains("User-Agent"))
                _http.DefaultRequestHeaders.TryAddWithoutValidation(
                    "User-Agent", "Waveify/1.0 (+https://example.com)");
            if (!_http.DefaultRequestHeaders.Contains("Accept"))
                _http.DefaultRequestHeaders.TryAddWithoutValidation(
                    "Accept", "*/*");
        }

        // A) download (как было)
        [HttpPost("download")]
        public async Task<IActionResult> DownloadAudio([FromBody] YouTubeDownloadRequest request)
        {
            if (!request.IsPremiumUser && request.Format.Equals("wav", StringComparison.OrdinalIgnoreCase))
                return BadRequest("WAV доступен только для премиум-пользователей");

            var (data, fileName, contentType, error) =
                await _youTube.DownloadAudioAsync(request.Url, request.Format);

            if (error != null) return StatusCode(500, error);
            if (data == null || fileName == null) return StatusCode(500, "Download failed");

            Response.Headers["Content-Disposition"] =
                $"attachment; filename*=UTF-8''{Uri.EscapeDataString(fileName)}";
            return File(data, contentType ?? "application/octet-stream", fileName);
        }

        // B) metadata (как было)
        [HttpGet("metadata")]
        public async Task<IActionResult> Metadata([FromQuery] string url)
        {
            var (meta, err) = await _youTube.GetMetadataAsync(url);
            if (err != null) return BadRequest(err);

            var dur = TimeSpan.FromSeconds(meta!.DurationSec ?? 0);
            return Ok(new
            {
                title = meta.Title,
                author = meta.Uploader,
                duration = $"{(int)dur.TotalHours:00}:{dur.Minutes:00}:{dur.Seconds:00}",
                thumbnail = meta.Thumbnail
            });
        }

        // NEW) proxy-image: тащит миниатюру и отдаёт как файл (обходит CORS)
        [HttpGet("proxy-image")]
        public async Task<IActionResult> ProxyImage([FromQuery] string url, CancellationToken ct)
        {
            if (string.IsNullOrWhiteSpace(url))
                return BadRequest("url required");

            try
            {
                using var resp = await _http.GetAsync(url, ct);
                if (!resp.IsSuccessStatusCode)
                {
                    var msg = await resp.Content.ReadAsStringAsync(ct).ConfigureAwait(false);
                    return StatusCode((int)resp.StatusCode, string.IsNullOrWhiteSpace(msg) ? "fetch failed" : msg);
                }

                var bytes = await resp.Content.ReadAsByteArrayAsync(ct).ConfigureAwait(false);
                var contentType = resp.Content.Headers.ContentType?.MediaType ?? "image/jpeg";
                return File(bytes, contentType);
            }
            catch (TaskCanceledException)
            {
                return StatusCode(504, "proxy timeout");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"proxy error: {ex.Message}");
            }
        }

        public sealed class YouTubeImportRequest
        {
            [JsonPropertyName("url")]
            public string Url { get; set; } = default!;

            [JsonPropertyName("format")]
            public string Format { get; set; } = "mp3";

            // <-- ВАЖНО: явно указываем имя поля как на фронте
            [JsonPropertyName("titleOverride")]
            public string? TitleOverride { get; set; }

            // fallback на случай если когда-то придёт "title"
            [JsonPropertyName("title")]
            public string? Title { get; set; }

            [JsonPropertyName("genre")]
            public string? Genre { get; set; }

            [JsonPropertyName("vibe")]
            public string? Vibe { get; set; }

            [JsonPropertyName("tagIds")]
            public List<Guid>? TagIds { get; set; }

            [JsonPropertyName("thumbnailUrl")]
            public string? ThumbnailUrl { get; set; }
        }

        [HttpPost("import")]
        [Authorize]
        public async Task<IActionResult> Import([FromBody] YouTubeImportRequest req, CancellationToken ct)
        {
            if (req == null || string.IsNullOrWhiteSpace(req.Url))
                return BadRequest("Missing url");

            var userIdStr = User.FindFirst("userId")?.Value;
            if (!Guid.TryParse(userIdStr, out var userId))
                return Unauthorized("Invalid user");

            var work = Path.Combine(Path.GetTempPath(), "yt-import", Guid.NewGuid().ToString("N"));
            Directory.CreateDirectory(work);

            try
            {
                // 1) Мета
                var (meta, errM) = await _youTube.GetMetadataAsync(req.Url, ct);
                if (errM != null) return BadRequest(errM);

                // 2) Аудио
                var (audioPath, errA) = await _youTube.DownloadAudioToTempAsync(
                    req.Url, req.Format.ToLowerInvariant(), work, ct);
                if (errA != null || string.IsNullOrWhiteSpace(audioPath) || !System.IO.File.Exists(audioPath))
                    return StatusCode(500, errA ?? "audio download failed");

                // 3) Картинка: сперва пробуем req.ThumbnailUrl, затем fallback
                string? thumbPath = null;

                if (!string.IsNullOrWhiteSpace(req.ThumbnailUrl))
                {
                    try
                    {
                        using var imgResp = await _http.GetAsync(req.ThumbnailUrl, ct);
                        if (imgResp.IsSuccessStatusCode)
                        {
                            var bytes = await imgResp.Content.ReadAsByteArrayAsync(ct);
                            // выбираем расширение если можем, иначе jpg
                            var ext = "jpg";
                            var ctype = imgResp.Content.Headers.ContentType?.MediaType?.ToLowerInvariant();
                            if (ctype == "image/png") ext = "png";
                            else if (ctype == "image/webp") ext = "webp";
                            var local = Path.Combine(work, $"thumb.{ext}");
                            await System.IO.File.WriteAllBytesAsync(local, bytes, ct);
                            thumbPath = local;
                        }
                    }
                    catch { /* ок, пойдём на fallback */ }
                }

                if (thumbPath == null)
                {
                    try
                    {
                        var (tPath, _) = await _youTube.DownloadThumbnailToTempAsync(req.Url, work, ct);
                        if (!string.IsNullOrWhiteSpace(tPath) && System.IO.File.Exists(tPath))
                            thumbPath = tPath;
                    }
                    catch { /* ignore */ }
                }

                // 4) Upload audio -> S3
                var audioKey = $"{Guid.NewGuid()}_{Path.GetFileName(audioPath)}";
                await using (var fs = System.IO.File.OpenRead(audioPath))
                {
                    var put = new PutObjectRequest
                    {
                        BucketName = _s3s.BucketName,
                        Key = audioKey,
                        InputStream = fs,
                        ContentType = req.Format.Equals("wav", StringComparison.OrdinalIgnoreCase) ? "audio/wav" : "audio/mpeg",
                        CannedACL = S3CannedACL.Private,
                        UseChunkEncoding = false
                    };
                    await _s3.PutObjectAsync(put, ct);
                }
                var audioUrl = $"{_s3s.ServiceUrl.TrimEnd('/')}/{_s3s.BucketName}/{audioKey}";

                // 5) Upload image -> S3
                string? imageUrl = null;
                if (!string.IsNullOrWhiteSpace(thumbPath))
                {
                    // угадать content-type по расширению
                    var ext = Path.GetExtension(thumbPath).ToLowerInvariant();
                    var contentType = ext switch
                    {
                        ".png" => "image/png",
                        ".webp" => "image/webp",
                        _ => "image/jpeg"
                    };

                    var imgKey = $"{Guid.NewGuid()}{ext}";
                    await using var ims = System.IO.File.OpenRead(thumbPath);
                    var putImg = new PutObjectRequest
                    {
                        BucketName = _s3s.BucketName,
                        Key = imgKey,
                        InputStream = ims,
                        ContentType = contentType,
                        CannedACL = S3CannedACL.Private,
                        UseChunkEncoding = false
                    };
                    await _s3.PutObjectAsync(putImg, ct);
                    imageUrl = $"{_s3s.ServiceUrl.TrimEnd('/')}/{_s3s.BucketName}/{imgKey}";
                }

                            var userTitle = !string.IsNullOrWhiteSpace(req.TitleOverride)
                ? req.TitleOverride
                : !string.IsNullOrWhiteSpace(req.Title)
                    ? req.Title
                    : null;

                var title = (userTitle ?? meta!.Title ?? "Unknown").Trim();
                var author = meta!.Uploader ?? "Unknown";
                var duration = TimeSpan.FromSeconds(meta!.DurationSec ?? 0);
                var tags = (req.TagIds ?? new()).Select(id => new DomainTag { Id = id }).ToList();



                var (song, error) = Song.Create(
                    Guid.NewGuid(),
                    title,
                    author,
                    userId,
                    duration,
                    DateTime.UtcNow,
                    req.Genre,
                    tags,
                    req.Vibe,
                    0, 0, 0,
                    audioUrl,
                    imageUrl // <-- теперь точно не пусто, если thumbnailUrl был валидный
                );
                if (!string.IsNullOrEmpty(error)) return BadRequest(error);

                song.ModerationStatus = ModerationStatus.Pending;
                await _songs.Add(song);

                return Ok(new
                {
                    message = "Импорт завершён",
                    songId = song.Id,
                    title = song.Title,
                    audioUrl,
                    imageUrl,
                    duration = duration.ToString(@"hh\:mm\:ss")
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"import error: {ex.Message}");
            }
            finally
            {
                try { if (Directory.Exists(work)) Directory.Delete(work, true); } catch { }
            }
        }
        // ... остальные экшены (import и т.д.) остаются как у тебя
    }
}
