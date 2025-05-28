using Microsoft.AspNetCore.Mvc;
using Waveify.API.DTOs;
using Waveify.API.Contracts;
using Waveify.Application.Interfaces.Repositories;

namespace Waveify.API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class YouTubeController : ControllerBase
    {
        private readonly IYouTubeService _youTubeService;

        public YouTubeController(IYouTubeService youTubeService)
        {
            _youTubeService = youTubeService;
        }

        [HttpPost("download")]
        public async Task<IActionResult> DownloadAudio([FromBody] YouTubeDownloadRequest request)
        {
            if (!request.IsPremiumUser && request.Format.ToLower() == "wav")
                return BadRequest("WAV доступен только для премиум-пользователей");

            var (data, fileName, error) = await _youTubeService.DownloadAudioAsync(request.Url, request.Format);

            if (!string.IsNullOrEmpty(error))
                return StatusCode(500, error);

            return File(data, "application/octet-stream", fileName);
        }
    }
}