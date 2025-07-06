namespace Waveify.API.DTOs
{
    public class SongWithListenCountDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = null!;
        public string Author { get; set; } = null!;
        public int ListenCount { get; set; }
    }

}
