using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Waveify.Application.Interfaces.Repositories;
using Waveify.Core.Enums;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Moderator")]
public class ModeratorController : ControllerBase
{
    private readonly ISongRepositories _songs;
    public ModeratorController(ISongRepositories songs) => _songs = songs;

    [HttpGet("pending")]
    public async Task<IActionResult> GetPending()
        => Ok(await _songs.GetAllPendingSongs());

    public sealed class SetStatusDto
    {
        public string? Status { get; set; } // "Approved" / "Rejected"
        public int? StatusCode { get; set; } // опционально
    }

    [HttpPost("song/{id:guid}/status")]
    public async Task<IActionResult> SetStatus(Guid id, [FromBody] SetStatusDto dto)
    {
        var song = await _songs.GetSongById(id);
        if (song == null) return NotFound();

        ModerationStatus status;
        if (dto.StatusCode.HasValue)
        {
            status = (ModerationStatus)dto.StatusCode.Value;
        }
        else if (!string.IsNullOrWhiteSpace(dto.Status) &&
                 Enum.TryParse(dto.Status, true, out ModerationStatus parsed))
        {
            status = parsed;
        }
        else
        {
            return BadRequest("Invalid status");
        }

        song.ModerationStatus = status;
        await _songs.Update(song);
        return Ok(new { message = "Status updated", status = (int)status });
    }
}
