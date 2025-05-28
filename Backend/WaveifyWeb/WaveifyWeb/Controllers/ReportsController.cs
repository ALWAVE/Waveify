using Microsoft.AspNetCore.Mvc;
using Waveify.Application.Interfaces.Repositories;
using Waveify.Core.Models;
using Waveify.API.DTOs;
[Route("api/[controller]")]
[ApiController]
public class ReportsController : ControllerBase
{
    private readonly IReportSongRepository _reportRepo;

    public ReportsController(IReportSongRepository reportRepo)
    {
        _reportRepo = reportRepo;
    }

    //[HttpGet]
    //public async Task<IActionResult> GetReports()
    //{
    //    var reports = await _reportRepo.GetAllReportsAsync();
    //    return Ok(reports);
    //}

    [HttpPost]
    public async Task<IActionResult> ReportSong([FromBody] ReportSongDto dto)
    {
        // Тут должен быть userId из токена, пока временно мок:
        var userId = Guid.Parse("00000000-0000-0000-0000-000000000001");

        var alreadyReported = await _reportRepo.HasUserReportedAsync(userId, dto.SongId);
        if (alreadyReported)
        {
            return BadRequest("Вы уже отправили жалобу на эту песню.");
        }

        var report = new ReportSong
        {
            UserId = userId,
            SongId = dto.SongId,
            Reason = dto.Reason,
            ReasonOfReport = dto.ReasonOfReport,
            CreateAt = DateTime.UtcNow
        };

        await _reportRepo.AddReportAsync(report);

        return Ok("Жалоба отправлена.");
    }
}
