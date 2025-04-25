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
namespace Waveify.API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class SongController : ControllerBase
    {
        private readonly ISongRepositories _songRepositories;
        private readonly IAmazonS3 _s3Client;
        private readonly S3Settings _s3Settings;
        private readonly S3Service _s3Service;
        public SongController(ISongRepositories songRepositories, IAmazonS3 s3Client, IOptions<S3Settings> s3Settings, S3Service s3Service)
        {
            _songRepositories = songRepositories;
            _s3Client = s3Client;
            _s3Settings = s3Settings.Value;
            _s3Service = s3Service;
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
                request.Rating,
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
                d.Title, // Ты забыл добавить Title
                d.Author,
                d.UserID,
                d.Duration,
                d.CreatedAt,
                d.Genre,
                d.Vibe,
                d.Like,
                d.SongPath,
                d.ImagePath,
                d.Tags.Select(t => t.Id).ToList() // Добавляем список ID тегов
                //d.Awards.Select(a => a.Id).ToList() // Если есть награды, добавляем их ID
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
                song.SongPath,                
                song.ImagePath,
                song.Tags.Select(t => t.Id).ToList() // Если есть теги
            // song.Awards.Select(a => a.Id).ToList() // Если есть награды
            );

            return Ok(response);
        }
        [HttpPut("update")]
        public async Task<IActionResult> UpdateSong([FromForm] SongUpdateDto request)
        {
            var existingSong = await _songRepositories.GetSongById(request.Id);
            if (existingSong == null)
                return NotFound($"Песня с ID {request.Id} не найдена.");

            existingSong.Title = request.Title;
            existingSong.Author = request.Author;
            existingSong.Genre = request.Genre;
            existingSong.Vibe = request.Vibe;

            string imageFileUrl = existingSong.ImagePath;

            try
            {
                // Обновляем изображение, если передано новое
                if (request.Image != null && request.Image.Length > 0)
                {
                    var imageFileName = $"{Guid.NewGuid()}_{request.Image.FileName}";

                    using (var imageStream = new MemoryStream())
                    {
                        await request.Image.CopyToAsync(imageStream);
                        imageStream.Position = 0;

                        var imagePutRequest = new PutObjectRequest
                        {
                            BucketName = _s3Settings.BucketName,
                            Key = imageFileName,
                            InputStream = imageStream,
                            ContentType = request.Image.ContentType,
                            CannedACL = S3CannedACL.Private,
                            UseChunkEncoding = false
                        };

                        await _s3Client.PutObjectAsync(imagePutRequest);
                        imageFileUrl = $"{_s3Settings.ServiceUrl.TrimEnd('/')}/{_s3Settings.BucketName}/{imageFileName}";
                    }

                    existingSong.ImagePath = imageFileUrl;
                }

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
        [HttpPost("upload")]
        public async Task<IActionResult> UploadSong([FromForm] SongUploadDto songUploadDto)
        {
            if (songUploadDto.File == null || songUploadDto.File.Length == 0)
            {
                return BadRequest("No audio file uploaded.");
            }

            if (!TimeSpan.TryParse(songUploadDto.Duration, out var duration))
            {
                return BadRequest("Invalid duration format. Use hh:mm:ss");
            }

            var audioFileName = $"{Guid.NewGuid()}_{songUploadDto.File.FileName}";
            string audioFileUrl = "";
            string imageFileUrl = "";

            try
            {
                // Загрузка аудиофайла
                using (var audioStream = new MemoryStream())
                {
                    await songUploadDto.File.CopyToAsync(audioStream);
                    audioStream.Position = 0;

                    var audioPutRequest = new PutObjectRequest
                    {
                        BucketName = _s3Settings.BucketName,
                        Key = audioFileName,
                        InputStream = audioStream,
                        ContentType = songUploadDto.File.ContentType,
                        CannedACL = S3CannedACL.Private,
                        UseChunkEncoding = false
                    };

                    await _s3Client.PutObjectAsync(audioPutRequest);
                }

                audioFileUrl = $"{_s3Settings.ServiceUrl.TrimEnd('/')}/{_s3Settings.BucketName}/{audioFileName}";

                // Загрузка изображения (если есть)
                if (songUploadDto.Image != null && songUploadDto.Image.Length > 0)
                {
                    var imageFileName = $"{Guid.NewGuid()}_{songUploadDto.Image.FileName}";

                    using (var imageStream = new MemoryStream())
                    {
                        await songUploadDto.Image.CopyToAsync(imageStream);
                        imageStream.Position = 0;

                        var imagePutRequest = new PutObjectRequest
                        {
                            BucketName = _s3Settings.BucketName,
                            Key = imageFileName,
                            InputStream = imageStream,
                            ContentType = songUploadDto.Image.ContentType,
                            CannedACL = S3CannedACL.Private,
                            UseChunkEncoding = false
                        };

                        await _s3Client.PutObjectAsync(imagePutRequest);
                        imageFileUrl = $"{_s3Settings.ServiceUrl.TrimEnd('/')}/{_s3Settings.BucketName}/{imageFileName}";
                    }
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

            var tags = songUploadDto.Tags?.Select(g => new Waveify.Core.Models.Tag { Id = g }).ToList()
                 ?? new List<Waveify.Core.Models.Tag>();

            var (song, error) = Song.Create(
                Guid.NewGuid(),
                songUploadDto.Title,
                songUploadDto.Author,
                songUploadDto.UserId,
                duration,
                DateTime.UtcNow,
                songUploadDto.Genre,
                tags,
                songUploadDto.Vibe,
                0,
                0,
                audioFileUrl,
                imageFileUrl // <- тут передаётся ссылка на картинку
            );

            if (!string.IsNullOrEmpty(error))
            {
                return BadRequest(error);
            }

            await _songRepositories.Add(song);

            return Ok(new
            {
                Message = "Song and image uploaded successfully",
                SongId = song.Id,
                AudioUrl = audioFileUrl,
                ImageUrl = imageFileUrl
            });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSong(Guid id)
        {
            var song = await _songRepositories.GetSongById(id);
            if (song == null)
                return NotFound($"Песня с ID {id} не найдена.");

            try
            {
                await _s3Service.DeleteFileAsync(song.SongPath);
                await _s3Service.DeleteFileAsync(song.ImagePath);
                await _songRepositories.Delete(song.Id);

                return Ok(new { Message = "Песня и связанные файлы успешно удалены." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Ошибка при удалении: {ex.Message}");
            }
        }



    }
}
