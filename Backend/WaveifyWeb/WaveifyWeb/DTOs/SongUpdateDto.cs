namespace Waveify.API.DTOs
{
    public class SongUpdateDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Author { get; set; } = string.Empty;
        public string Genre { get; set; } = string.Empty;
        public string Vibe { get; set; } = string.Empty;
        public IFormFile? Image { get; set; }
    }

}
