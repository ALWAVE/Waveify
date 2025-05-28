namespace Waveify.API.DTOs
{
    public class ReportSongDto
    {
        public Guid SongId { get; set; }
        public string Reason { get; set; } = string.Empty;
        public string ReasonOfReport { get; set; } = string.Empty;
    }

}
