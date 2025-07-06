namespace Waveify.API.DTOs
{
    public class PlaylistUploadDto
    {
        public string Name { get; set; } = null!;
        public Guid UserId { get; set; }
        public IFormFile? Image { get; set; }
    }

}
