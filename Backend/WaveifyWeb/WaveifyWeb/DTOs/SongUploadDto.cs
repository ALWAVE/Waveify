using System.ComponentModel.DataAnnotations;

namespace Waveify.API.DTOs
{
    public class SongUploadDto
    {
        [Required]
        public string Title { get; set; }

        [Required]
        public string Author { get; set; }

        [Required]
        public Guid UserId { get; set; }

        [Required]
        public string Duration { get; set; } // в формате "00:03:45", потом преобразуем

        [Required]
        public string Genre { get; set; }

        public string Vibe { get; set; }

        [Required] public IFormFile File { get; set; } // MP3
        public IFormFile? Image { get; set; }
        public List<Guid> Tags { get; set; } = new List<Guid>();
    }
}