namespace Waveify.API.Contracts
{
    public class YouTubeDownloadRequest
    {
        public string Url { get; set; }
        public string Format { get; set; } // "mp3" or "wav"
        public bool IsPremiumUser { get; set; }
    }
}
