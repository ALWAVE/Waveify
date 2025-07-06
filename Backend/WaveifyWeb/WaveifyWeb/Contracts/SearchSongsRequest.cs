namespace Waveify.API.Contracts
{
    public class SearchSongsRequest
    {
        public string? Query { get; set; }
        public string? Genre { get; set; }
        public string? Vibe { get; set; }
    }
}
