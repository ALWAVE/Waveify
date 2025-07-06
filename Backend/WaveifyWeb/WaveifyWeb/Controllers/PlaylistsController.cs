using Amazon.S3.Model;
using Amazon.S3;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Waveify.API.DTOs;
using Waveify.API.Settings;
using Waveify.Application.Interfaces.Repositories;
using Waveify.Core.Models;
using Waveify.Application.Services;
using Microsoft.Extensions.Options;


namespace WaveifyWeb.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PlaylistsController : ControllerBase
    {
        private readonly IPlaylistRepository _playlistService;
        private readonly IAmazonS3 _s3Client;
        private readonly S3Settings _s3Settings;
        private readonly S3Service _s3Service;
        public PlaylistsController(IPlaylistRepository playlistService, IAmazonS3 s3Client, IOptions<S3Settings> s3Settings, S3Service s3Service)
        {
            _playlistService = playlistService;
            _s3Client = s3Client;
            _s3Settings = s3Settings.Value;
            _s3Service = s3Service;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Playlist>>> GetAllPlaylists()
        {
            var playlists = await _playlistService.GetAllAsync();
            return Ok(playlists);
        }

        [HttpGet("{id:guid}")]
        public async Task<ActionResult<Playlist>> GetPlaylistById(Guid id)
        {
            var playlist = await _playlistService.GetByIdAsync(id);
            if (playlist == null)
                return NotFound();

            return Ok(playlist);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreatePlaylist([FromBody] Playlist playlist)
        {
            await _playlistService.CreateAsync(playlist);
            return Ok();
        }
        [HttpPost("upload")]
        [Authorize]
        public async Task<IActionResult> CreatePlaylistWithImage([FromForm] PlaylistUploadDto dto)
        {
            string imagePath = null!;

            if (dto.Image != null && dto.Image.Length > 0)
            {
                var imageFileName = $"{Guid.NewGuid()}_{dto.Image.FileName}";

                using var imageStream = new MemoryStream();
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
                imagePath = $"{_s3Settings.ServiceUrl.TrimEnd('/')}/{_s3Settings.BucketName}/{imageFileName}";
            }

            var playlist = new Playlist
            {
                Id = Guid.NewGuid(),
                Name = dto.Name,
                UserId = dto.UserId,
                CreateAt = DateTime.UtcNow,
                ImagePath = imagePath
            };

            await _playlistService.CreateAsync(playlist);

            return Ok(new
            {
                Message = "Плейлист создан",
                PlaylistId = playlist.Id,
                ImageUrl = imagePath
            });
        }

        [HttpPut("{id:guid}")]
        [Authorize]
        public async Task<IActionResult> UpdatePlaylist(Guid id, [FromBody] Playlist updatedPlaylist)
        {
            updatedPlaylist.Id = id;
            await _playlistService.UpdateAsync(updatedPlaylist);
            return NoContent();
        }

        [HttpDelete("{id:guid}")]
        [Authorize]
        public async Task<IActionResult> DeletePlaylist(Guid id)
        {
            await _playlistService.DeleteAsync(id);
            return NoContent();
        }
        [HttpPost("{playlistId:guid}/songs/{songId:guid}")]
        [Authorize]
        public async Task<IActionResult> AddSongToPlaylist(Guid playlistId, Guid songId)
        {
            await _playlistService.AddSongToPlaylistAsync(playlistId, songId);
            return Ok(new { Message = "Песня добавлена в плейлист." });
        }
        [HttpDelete("{playlistId:guid}/songs/{songId:guid}")]
        [Authorize]
        public async Task<IActionResult> RemoveSongFromPlaylist(Guid playlistId, Guid songId)
        {
            await _playlistService.RemoveSongFromPlaylistAsync(playlistId, songId);
            return Ok(new { Message = "Песня удалена из плейлиста." });
        }
        [HttpGet("{playlistId:guid}/songs")]
        public async Task<ActionResult<IEnumerable<Song>>> GetSongsByPlaylistId(Guid playlistId)
        {
            try
            {
                var songs = await _playlistService.GetSongsByPlaylistIdAsync(playlistId);
                return Ok(songs);
            }
            catch (Exception ex)
            {
                return NotFound(new { Message = ex.Message });
            }
        }


    }
}
