using Microsoft.AspNetCore.Mvc;
using Waveify.API.Contracts;
using Waveify.Application.Interfaces.Repositories;
using Waveify.Core.Models;

namespace Waveify.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LikedSongsController : ControllerBase
    {
        private readonly ILikedSongsRepository _likedSongsRepository;

        public LikedSongsController(ILikedSongsRepository likedSongsRepository)
        {
            _likedSongsRepository = likedSongsRepository;
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

    }



}
