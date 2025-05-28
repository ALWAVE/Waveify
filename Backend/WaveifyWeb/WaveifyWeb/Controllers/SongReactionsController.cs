using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Waveify.Application.Interfaces.Repositories;
using System.Security.Claims;

namespace Waveify.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SongReactionsController : ControllerBase
    {
        private readonly ISongReactionRepository _reactionRepository;

        public SongReactionsController(ISongReactionRepository reactionRepository)
        {
            _reactionRepository = reactionRepository;
        }

        // POST: api/SongReactions/react
        [HttpPost("react")]
        [Authorize] // если нужна авторизация
        public async Task<IActionResult> ReactToSong([FromQuery] Guid songId, [FromQuery] bool isLike)
        {
            var userId = GetUserId();
            if (userId == null)
                return Unauthorized();

            await _reactionRepository.AddOrUpdateReaction(userId.Value, songId, isLike);
            return Ok(new { message = "Reaction saved." });
        }

        // GET: api/SongReactions/likes?songId=xxx
        [HttpGet("likes")]
        public async Task<IActionResult> GetLikes([FromQuery] Guid songId)
        {
            var count = await _reactionRepository.CountLikes(songId);
            return Ok(count);
        }

        // GET: api/SongReactions/dislikes?songId=xxx
        [HttpGet("dislikes")]
        public async Task<IActionResult> GetDislikes([FromQuery] Guid songId)
        {
            var count = await _reactionRepository.CountDislikes(songId);
            return Ok(count);
        }

        private Guid? GetUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return Guid.TryParse(userIdClaim, out var userId) ? userId : (Guid?)null;
        }
    }
}
