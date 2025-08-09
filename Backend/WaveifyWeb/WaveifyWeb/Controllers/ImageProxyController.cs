using Microsoft.AspNetCore.Mvc;
using Waveify.Application.Interfaces.Repositories;

[ApiController]
[Route("api/[controller]")]
public class ImageProxyController : ControllerBase
{
    private readonly IImageProxyRepository _imageProxyService;

    public ImageProxyController(IImageProxyRepository imageProxyService)
    {
        _imageProxyService = imageProxyService;
    }

    [HttpGet]
    public async Task<IActionResult> Get([FromQuery] string url)
    {
        if (string.IsNullOrWhiteSpace(url))
            return BadRequest("URL is required");

        try
        {
            var (content, contentType) = await _imageProxyService.GetImageAsync(url);
            Response.Headers["Access-Control-Allow-Origin"] = "*";
            return File(content, contentType);
        }
        catch (Exception ex)
        {
            return StatusCode(500, ex.Message);
        }
    }
}
