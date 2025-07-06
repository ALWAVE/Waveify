using Microsoft.AspNetCore.Mvc;
using Waveify.API.Contracts;
using Waveify.Application.Interfaces.Repositories;
using Waveify.Core.Models;
using Waveify.Persistence.Repositories;

namespace Waveify.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LikedSongsController : ControllerBase
    {
        private readonly ILikedSongsRepository _likedSongsRepository;
        private readonly ISongRepositories _songRepositories;

        public LikedSongsController(ILikedSongsRepository likedSongsRepository, ISongRepositories songRepositories)
        {
            _likedSongsRepository = likedSongsRepository;
            _songRepositories = songRepositories;
        }

        [HttpPost("like")]
        public async Task<IActionResult> LikeSong([FromBody] LikeRequest request)
        {
            var likedSong = LikedSong.Create(request.UserId, request.SongId);
            await _likedSongsRepository.AddLikedSongAsync(likedSong);
            return Ok("Liked");
        }

        [HttpDelete("unlike")]
        public async Task<IActionResult> UnlikeSong([FromBody] LikeRequest request)
        {
            await _likedSongsRepository.RemoveLikedSongAsync(request.UserId, request.SongId);
            return Ok("Unliked");
        }

        [HttpGet("{userId}")]
        public async Task<IActionResult> GetLikedSongs(
            Guid userId,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            if (page <= 0 || pageSize <= 0)
                return BadRequest("Page and pageSize must be greater than zero.");

            var (songs, totalCount) = await _likedSongsRepository.GetLikedSongsForUserAsync(userId, page, pageSize);

            return Ok(new
            {
                Songs = songs,
                TotalCount = totalCount,
                Page = page,
                PageSize = pageSize
            });

        }
        [HttpGet("{songId}/likesCount")]
        public async Task<IActionResult> GetLikesCount(Guid songId)
        {
            var count = await _likedSongsRepository.GetLikesCountForSongAsync(songId);
            return Ok(new { SongId = songId, LikesCount = count });
        }
        [HttpPost("likesCounts")]
        public async Task<IActionResult> GetLikesCounts([FromBody] Guid[] songIds)
        {
            var counts = new Dictionary<Guid, int>();
            foreach (var id in songIds)
            {
                counts[id] = await _likedSongsRepository.GetLikesCountForSongAsync(id);
            }
            return Ok(counts);
        }
        [HttpGet("top-charts")]
        public async Task<IActionResult> GetTopCharts([FromQuery] int top = 50)
        {
            if (top <= 0) top = 50;
            if (top > 100) top = 100; // ограничение сверху

            // Получаем топ песен с лайками
            var topSongs = await _likedSongsRepository.GetTopSongsByLikesAsync(top);

            // Получаем список идентификаторов песен из топа
            var songIds = topSongs.Select(t => t.SongId).ToList();

            // Получаем сами песни по идентификаторам
            var songs = await _songRepositories.GetSongsByIdsAsync(songIds);

            // Объединяем данные песен и лайков
            var response = topSongs.Join(songs,
                t => t.SongId,
                s => s.Id,
                (t, s) => new
                {
                    SongId = s.Id,
                    s.Title,
                    s.Author,
                    s.UserID,
                    s.Duration,
                    s.CreatedAt,
                    s.Genre,
                    s.Vibe,
                    LikesCount = t.LikesCount,
                    s.Dislike,
                    s.Plays,
                    s.SongPath,
                    s.ImagePath,
                    Tags = s.Tags.Select(tag => tag.Id).ToList()
                })
                .OrderByDescending(x => x.LikesCount)
                .ToList();

            return Ok(response);
        }




    }



}
