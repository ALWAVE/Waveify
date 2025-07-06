using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Waveify.Application.Interfaces.Repositories;
using Waveify.Core.Enums;
using Waveify.Core.Models;
using Waveify.Persistence.Repositories;

namespace Waveify.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ModeratorController : ControllerBase
    {
        private readonly ISongRepositories _songRepositories;

        public ModeratorController(ISongRepositories songRepositories)
        {
            _songRepositories = songRepositories;
        }

        // GET: api/moderator/pending
        [HttpGet("pending")]
        public async Task<IActionResult> GetPendingSongs()
        {
            var pendingSongs = await _songRepositories.GetAllPendingSongs();
            return Ok(pendingSongs);
        }

        // POST: api/moderator/{id}/moderate?action=approve|reject
        [HttpPost("{id}/moderate")]
        public async Task<IActionResult> ModerateSong(Guid id, [FromQuery] string action)
        {
            var song = await _songRepositories.GetSongById(id);
            if (song == null)
                return NotFound();

            if (action.ToLower() == "approve")
                song.ModerationStatus = ModerationStatus.Approved;
            else if (action.ToLower() == "reject")
                song.ModerationStatus = ModerationStatus.Rejected;
            else
                return BadRequest("Invalid action. Use 'approve' or 'reject'.");

            await _songRepositories.Update(song); // всё, вызываем update
            return Ok();
        }



    }
}
