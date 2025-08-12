using Microsoft.AspNetCore.Mvc;
using Waveify.API.Contracts;
using Waveify.Application.Interfaces.Repositories;
using Waveify.Application.Services;
using Waveify.Core.Models;
using Waveify.Persistence.Repositories;
using Amazon.S3;
using Microsoft.Extensions.Hosting;
using Waveify.API.DTOs;
using Amazon.S3.Model;
using Waveify.API.Settings;
using Microsoft.Extensions.Options;
using Waveify.Core.Enums;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using System.Net.Http.Headers;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace Waveify.API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class SongController : ControllerBase
    {
        private readonly ISongRepositories _songRepositories;
        private readonly IListeningHistoryRepository _listeningHistoryRepository;
        private readonly IAmazonS3 _s3Client;
        private readonly S3Settings _s3Settings;
        private readonly S3Service _s3Service;
        public SongController(ISongRepositories songRepositories, IAmazonS3 s3Client, IOptions<S3Settings> s3Settings, S3Service s3Service, IListeningHistoryRepository listeningHistoryRepository)
        {
            _songRepositories = songRepositories;
            _s3Client = s3Client;
            _s3Settings = s3Settings.Value;
            _s3Service = s3Service;
            _listeningHistoryRepository = listeningHistoryRepository;
        }
        [HttpPost]
        public async Task<ActionResult<Guid>> CreateSong([FromBody] SongRequest request)
        {
            var (song, error) = Song.Create(Guid.NewGuid(),
                request.Title,
                request.Author,
                request.UserId,
                request.Duraction,
                request.CreateAt,
                request.Genre,
                new List<Waveify.Core.Models.Tag>(),
                request.Vibe,
                request.Like,
                request.Dislike,
                request.Plays,
                request.SongPath,
                request.ImagePath
            );

            if (!string.IsNullOrEmpty(error))
            {
                return BadRequest(error);
            }

            // Добавляем в репозиторий (если у тебя есть метод для сохранения)
            await _songRepositories.Add(song);

            return Ok(song.Id);
        }
     
        [HttpGet]
        public async Task<ActionResult<List<SongResponse>>> GetSongs()
        {
            var songs = await _songRepositories.GetAll();
            var response = songs.Select(d => new SongResponse(
      d.Id,
      d.Title,
      d.Author,
      d.UserID,
      d.Duration,
      d.CreatedAt,
      d.Genre,
      d.Vibe,
      d.Like,
      d.Dislike,
      d.Plays,
      d.SongPath,
      d.ImagePath,
     
      d.Tags.Select(t => t.Id).ToList() // передаем список тегов
  ));



            return Ok(response);
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<SongResponse>> GetSongById(Guid id)
        {
            var song = await _songRepositories.GetSongById(id);

            if (song == null)
            {
                return NotFound($"Песня с ID {id} не найдена.");
            }

            var response = new SongResponse(
                song.Id,
                song.Title,
                song.Author,
                song.UserID,
                song.Duration,
                song.CreatedAt,
                song.Genre,
                song.Vibe,
                song.Like,
                song.Dislike,
                song.Plays,
                song.SongPath,                
                song.ImagePath,
              
                song.Tags.Select(t => t.Id).ToList() // Если есть теги
            // song.Awards.Select(a => a.Id).ToList() // Если есть награды
            );

            return Ok(response);
        }
        [HttpPut("update")]
        [Authorize] // доступ только авторизованным
        public async Task<IActionResult> UpdateSong([FromForm] SongUpdateDto request)
        {
            // 1) находим песню

            var existingSong = await _songRepositories.GetSongById(request.Id);
            if (existingSong == null)
                return NotFound($"Песня с ID {request.Id} не найдена.");

            // 2) авторизация: владелец или модератор
            var callerUserId = User.FindFirst("userId")?.Value;
            var isModerator = User.IsInRole("Moderator");

            if (!isModerator && (callerUserId == null || existingSong.UserID.ToString() != callerUserId))
                return Forbid(); // 403

            // 3) обновляем ТОЛЬКО метаданные (без статуса!)
            if (!string.IsNullOrWhiteSpace(request.Title))
                existingSong.Title = request.Title.Trim();

            if (!string.IsNullOrWhiteSpace(request.Author))
                existingSong.Author = request.Author.Trim();

            if (!string.IsNullOrWhiteSpace(request.Genre))
                existingSong.Genre = request.Genre.Trim();

            if (!string.IsNullOrWhiteSpace(request.Vibe))
                existingSong.Vibe = request.Vibe.Trim();

            // 4) картинка: если пришла — валидируем и загружаем в S3
            try
            {
                if (request.Image != null && request.Image.Length > 0)
                {
                    // базовая валидация типа и размера (по желанию подстрой лимиты)
                    var allowed = new[] { "image/jpeg", "image/png", "image/webp" };
                    if (!allowed.Contains(request.Image.ContentType))
                        return BadRequest("Допустимы только изображения JPEG/PNG/WEBP.");

                    // например, до 5 МБ
                    const long maxBytes = 5 * 1024 * 1024;
                    if (request.Image.Length > maxBytes)
                        return BadRequest("Изображение слишком большое (макс. 5МБ).");

                    var imageFileName = $"{Guid.NewGuid()}_{request.Image.FileName}";

                    using (var imageStream = new MemoryStream())
                    {
                        await request.Image.CopyToAsync(imageStream);
                        imageStream.Position = 0;

                        var putReq = new PutObjectRequest
                        {
                            BucketName = _s3Settings.BucketName,
                            Key = imageFileName,
                            InputStream = imageStream,
                            ContentType = request.Image.ContentType,
                            CannedACL = S3CannedACL.Private,
                            UseChunkEncoding = false
                        };

                        await _s3Client.PutObjectAsync(putReq);
                    }

                    var imageFileUrl = $"{_s3Settings.ServiceUrl.TrimEnd('/')}/{_s3Settings.BucketName}/{imageFileName}";
                    existingSong.ImagePath = imageFileUrl;
                }

                // 5) СТАТУС НЕ ТРОГАЕМ ЗДЕСЬ!
                // existingSong.ModerationStatus = ...  // <-- запрещено, только модераторский контроллер

                await _songRepositories.Update(existingSong);

                return Ok(new
                {
                    Message = "Песня успешно обновлена",
                    SongId = existingSong.Id,
                    ImageUrl = existingSong.ImagePath
                });
            }
            catch (AmazonS3Exception ex)
            {
                return StatusCode(500, $"Ошибка S3: {ex.Message}, Код: {ex.ErrorCode}, Запрос: {ex.RequestId}");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Неожиданная ошибка: {ex.Message}");
            }
        }

        [HttpGet("user/{userId}/published")]
        public async Task<ActionResult<List<SongResponse>>> GetPublishedSongsByUserId(Guid userId)
        {
            var songs = await _songRepositories.GetPublishedSongsByUserId(userId);

            var response = songs.Select(d => new SongResponse(
                d.Id,
                d.Title,
                d.Author,
                d.UserID,
                d.Duration,
                d.CreatedAt,
                d.Genre,
                d.Vibe,
                d.Like,
                d.Dislike,
                d.Plays,
                d.SongPath,
                d.ImagePath,
                d.Tags.Select(t => t.Id).ToList()
            ));

            return Ok(response);
        }


        [HttpPost("upload")]
        [Authorize] // ⬅️ только авторизованные
        public async Task<IActionResult> UploadSong([FromForm] SongUploadDto dto)
        {
            // 1) автор
            var callerUserIdStr = User.FindFirst("userId")?.Value;
            if (string.IsNullOrEmpty(callerUserIdStr) || !Guid.TryParse(callerUserIdStr, out var callerUserId))
                return Unauthorized("Invalid user.");

            // 2) базовая валидация
            if (dto.File == null || dto.File.Length == 0)
                return BadRequest("No audio file uploaded.");

            if (!TimeSpan.TryParse(dto.Duration, out var duration))
                return BadRequest("Invalid duration format. Use hh:mm:ss");

            // нормализуем поля, чтобы не прокатывало "undefined"
            var title = (dto.Title ?? string.Empty).Trim();
            var author = (dto.Author ?? string.Empty).Trim();
            var genre = string.IsNullOrWhiteSpace(dto.Genre) || dto.Genre == "undefined" ? null : dto.Genre.Trim();
            var vibe = string.IsNullOrWhiteSpace(dto.Vibe) || dto.Vibe == "undefined" ? null : dto.Vibe.Trim();

            if (string.IsNullOrWhiteSpace(title) || string.IsNullOrWhiteSpace(author))
                return BadRequest("Title and Author are required.");

            // 3) ограничения по типу/размеру
            var audioAllowed = new[] { "audio/mpeg", "audio/mp3", "audio/wav", "audio/x-wav", "audio/flac", "audio/ogg" };
            if (!audioAllowed.Contains(dto.File.ContentType))
                return BadRequest("Unsupported audio format.");

            const long maxAudio = 25L * 1024 * 1024; // 25MB
            if (dto.File.Length > maxAudio)
                return BadRequest("Audio file is too large (max 25MB).");

            string audioFileUrl;
            string? imageFileUrl = null;

            // 4) загрузка в S3
            try
            {
                // audio
                var audioFileName = $"{Guid.NewGuid()}_{Path.GetFileName(dto.File.FileName)}";
                using (var audioStream = new MemoryStream())
                {
                    await dto.File.CopyToAsync(audioStream);
                    audioStream.Position = 0;

                    var audioPutRequest = new PutObjectRequest
                    {
                        BucketName = _s3Settings.BucketName,
                        Key = audioFileName,
                        InputStream = audioStream,
                        ContentType = dto.File.ContentType,
                        CannedACL = S3CannedACL.Private,
                        UseChunkEncoding = false
                    };
                    await _s3Client.PutObjectAsync(audioPutRequest);
                }
                audioFileUrl = $"{_s3Settings.ServiceUrl.TrimEnd('/')}/{_s3Settings.BucketName}/{audioFileName}";

                // image (опционально)
                if (dto.Image != null && dto.Image.Length > 0)
                {
                    var allowedImg = new[] { "image/jpeg", "image/png", "image/webp" };
                    if (!allowedImg.Contains(dto.Image.ContentType))
                        return BadRequest("Unsupported image format (jpeg/png/webp).");

                    const long maxImg = 5L * 1024 * 1024; // 5MB
                    if (dto.Image.Length > maxImg)
                        return BadRequest("Image is too large (max 5MB).");

                    var imageFileName = $"{Guid.NewGuid()}_{Path.GetFileName(dto.Image.FileName)}";
                    using (var imageStream = new MemoryStream())
                    {
                        await dto.Image.CopyToAsync(imageStream);
                        imageStream.Position = 0;

                        var imagePutRequest = new PutObjectRequest
                        {
                            BucketName = _s3Settings.BucketName,
                            Key = imageFileName,
                            InputStream = imageStream,
                            ContentType = dto.Image.ContentType,
                            CannedACL = S3CannedACL.Private,
                            UseChunkEncoding = false
                        };
                        await _s3Client.PutObjectAsync(imagePutRequest);
                    }
                    imageFileUrl = $"{_s3Settings.ServiceUrl.TrimEnd('/')}/{_s3Settings.BucketName}/{imageFileName}";
                }
            }
            catch (AmazonS3Exception ex)
            {
                return StatusCode(500, $"S3 upload failed: {ex.Message}, ErrorCode: {ex.ErrorCode}, RequestId: {ex.RequestId}");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Unexpected error: {ex.Message}");
            }

            // 5) теги
            var tags = dto.Tags?.Select(id => new Waveify.Core.Models.Tag { Id = id }).ToList()
                      ?? new List<Waveify.Core.Models.Tag>();

            // 6) создаём доменную модель (UserId — из токена!)
            var (song, error) = Song.Create(
                Guid.NewGuid(),
                title,
                author,
                callerUserId,        // ⬅️ не берем из dto.UserId
                duration,
                DateTime.UtcNow,
                genre,
                tags,
                vibe,
                0, 0, 0,
                audioFileUrl,
                imageFileUrl
            );

            if (!string.IsNullOrEmpty(error))
                return BadRequest(error);

            // 7) обязательная модерация
            song.ModerationStatus = Waveify.Core.Enums.ModerationStatus.Pending;

            await _songRepositories.Add(song);

            return Ok(new
            {
                message = "Song uploaded successfully",
                songId = song.Id,
                audioUrl = audioFileUrl,
                imageUrl = imageFileUrl,
                moderationStatus = song.ModerationStatus.ToString()
            });
        }


        [HttpDelete("{id:guid}")]
        [Authorize] // доступ только аутентифицированным
        public async Task<IActionResult> DeleteSong(Guid id)
        {
            var song = await _songRepositories.GetSongById(id);
            if (song == null)
                return NotFound($"Песня с ID {id} не найдена.");

            // кто пришёл
            var userIdStr = User.FindFirstValue("userId");
            var role = User.FindFirstValue(ClaimTypes.Role);
            var isModerator = string.Equals(role, "Moderator", StringComparison.OrdinalIgnoreCase);
            var isOwner = Guid.TryParse(userIdStr, out var uid) && uid == song.UserID;

            // правило: удалять может владелец или модератор
            if (!isModerator && !isOwner)
                return Forbid();

            // (опционально) запретим владельцу удалять уже опубликованное
            // if (!isModerator && song.ModerationStatus == ModerationStatus.Approved)
            //     return Forbid();

            try
            {
                // 1) удаляем запись в БД
                await _songRepositories.Delete(song.Id);

                // 2) пробуем удалить файлы в S3 — не валим запрос, если их уже нет
                var tasks = new List<Task>();

                if (!string.IsNullOrWhiteSpace(song.SongPath))
                    tasks.Add(SafeDeleteS3Async(song.SongPath));

                if (!string.IsNullOrWhiteSpace(song.ImagePath))
                    tasks.Add(SafeDeleteS3Async(song.ImagePath));

                await Task.WhenAll(tasks);

                return Ok(new { Message = "Песня и связанные файлы успешно удалены." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Ошибка при удалении: {ex.Message}");
            }
        }

        /// <summary>
        /// Тихое удаление файла из S3: игнорим NotFound и другие мягкие ошибки,
        /// логируем по желанию.
        /// </summary>
        private async Task SafeDeleteS3Async(string absoluteUrl)
        {
            try
            {
                // если у тебя уже есть _s3Service.DeleteFileAsync(url) — используй его
                await _s3Service.DeleteFileAsync(absoluteUrl);
            }
            catch (AmazonS3Exception s3ex) when (s3ex.StatusCode == System.Net.HttpStatusCode.NotFound)
            {
                // файл уже отсутствует — ок
            }
            catch
            {
                // тут можно сделать лог, но не ронять основной сценарий
            }
        }
        [HttpGet("search")]
        public async Task<ActionResult<List<SongResponse>>> SearchSongs([FromQuery] SearchSongsRequest request)
        {
            var songs = await _songRepositories.SearchSongsAsync(request.Query, request.Genre, request.Vibe);

            var response = songs.Select(d => new SongResponse(
                d.Id,
                d.Title,
                d.Author,
                d.UserID,
                d.Duration,
                d.CreatedAt,
                d.Genre,
                d.Vibe,
                d.Like,
                d.Dislike,
                d.Plays,
                d.SongPath,
                d.ImagePath,
                d.Tags.Select(t => t.Id).ToList()
            ));

            return Ok(response);
        }

        [HttpGet("by-vibe")]
        public async Task<ActionResult<List<SongResponse>>> GetSongsByVibe([FromQuery] List<string> vibes)
        {
            // Получаем все песни из репозитория
            var songs = await _songRepositories.GetAll();

            // Фильтруем песни по вайбам
            var filteredSongs = songs.Where(song => vibes.Contains(song.Vibe)).ToList();

            // Формируем ответ
            var response = filteredSongs.Select(d => new SongResponse(
                d.Id,
                d.Title,
                d.Author,
                d.UserID,
                d.Duration,
                d.CreatedAt,
                d.Genre,
                d.Vibe,
                d.Like,
                d.Dislike,
                d.Plays,
                d.SongPath,
                d.ImagePath,
                d.Tags.Select(t => t.Id).ToList()
            ));

            return Ok(response);
        }


        [HttpPost("listen")]
        public async Task<IActionResult> RegisterListen([FromBody] ListenDto dto)
        {
            var history = new ListeningHistory
            {
                UserId = dto.UserId,
                SongId = dto.SongId
            };

            await _listeningHistoryRepository.AddAsync(history);
            return Ok("Registered");
        }

        [HttpGet("user/{userId}/history")]
        public async Task<ActionResult<List<SongWithListenCountDto>>> GetUserListeningHistory(Guid userId)
        {
            var historyModels = await _listeningHistoryRepository.GetUserListeningHistory(userId);

            var historyDtos = historyModels.Select(x => new SongWithListenCountDto
            {
                Id = x.Id,
                Title = x.Title,
                Author = x.Author,
                ListenCount = x.ListenCount
            }).ToList();

            return Ok(historyDtos);
        }
        [HttpGet("user/{userId}/top-for-you")]
        public async Task<IActionResult> GetTopSongsForUser(Guid userId)
        {   
            var topSongs = await _listeningHistoryRepository.GetTopSongsForUserAsync(userId, 8);
            return Ok(topSongs);
        }
        [HttpGet("stream/{id}")]
        public async Task<IActionResult> StreamSong(Guid id, CancellationToken ct)
        {
            var song = await _songRepositories.GetSongById(id);
            if (song == null) return NotFound();

            // Получаем bucket/key из полного URL, как у тебя и было
            var prefix = $"{_s3Settings.ServiceUrl.TrimEnd('/')}/{_s3Settings.BucketName}/";
            var s3Key = song.SongPath.Replace(prefix, "");

            // Парсим Range от клиента (например: "bytes=0-" или "bytes=1000-2000")
            var rangeHeader = Request.Headers["Range"].ToString();
            (long? from, long? to) = ParseRange(rangeHeader);

            // Если пришёл открытый диапазон "bytes=from-", надо знать общий размер
            long? totalLength = null;
            if (from.HasValue && !to.HasValue)
            {
                var meta = await _s3Client.GetObjectMetadataAsync(_s3Settings.BucketName, s3Key, ct);
                totalLength = meta.ContentLength;
                to = (totalLength ?? 1) - 1;
            }

            var req = new Amazon.S3.Model.GetObjectRequest
            {
                BucketName = _s3Settings.BucketName,
                Key = s3Key
            };
            if (from.HasValue && to.HasValue)
                req.ByteRange = new Amazon.S3.Model.ByteRange(from.Value, to.Value);

            var obj = await _s3Client.GetObjectAsync(req, ct);

            // Готовим заголовки ответа
            Response.Headers["Accept-Ranges"] = "bytes";
            Response.Headers["Access-Control-Allow-Origin"] = "http://77.94.203.78:3000"; // или "*"
            Response.Headers["Vary"] = "Origin";
            Response.Headers["Access-Control-Expose-Headers"] = "Content-Length, Content-Range, Accept-Ranges";

            var contentType = string.IsNullOrEmpty(obj.Headers.ContentType) ? "audio/mpeg" : obj.Headers.ContentType;

            // Если это частичный контент — ставим 206 и Content-Range
            if (from.HasValue && to.HasValue)
            {
                var total = totalLength ?? obj.Headers.ContentLength + from.Value; // запасной вариант
                Response.StatusCode = StatusCodes.Status206PartialContent;
                Response.Headers["Content-Range"] = $"bytes {from}-{to}/{total}";
                Response.ContentType = contentType;
                return new FileStreamResult(obj.ResponseStream, contentType);
            }
            else
            {
                // Полный файл (200 OK)
                Response.StatusCode = StatusCodes.Status200OK;
                Response.ContentType = contentType;
                if (obj.Headers.ContentLength > 0)
                    Response.Headers["Content-Length"] = obj.Headers.ContentLength.ToString();
                return new FileStreamResult(obj.ResponseStream, contentType);
            }
        }

        // простенький парсер Range: "bytes=start-end" или "bytes=start-"
        private static (long? from, long? to) ParseRange(string? rangeHeader)
        {
            if (string.IsNullOrWhiteSpace(rangeHeader)) return (null, null);
            if (!rangeHeader.StartsWith("bytes=", StringComparison.OrdinalIgnoreCase)) return (null, null);
            var value = rangeHeader.Substring(6);
            var parts = value.Split('-', 2);
            if (parts.Length != 2) return (null, null);

            bool hasFrom = long.TryParse(parts[0], out var from);
            bool hasTo = long.TryParse(parts[1], out var to);
            return (hasFrom ? from : null, hasTo ? to : null);
        }

    }
}
