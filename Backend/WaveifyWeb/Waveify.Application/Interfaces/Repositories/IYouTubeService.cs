namespace Waveify.Application.Interfaces.Repositories
{
    public sealed class YtMetadata
    {
        public string Id { get; set; } = "";
        public string Title { get; set; } = "";
        public string Uploader { get; set; } = "";
        public double? DurationSec { get; set; }
        public string? Thumbnail { get; set; }
    }

    public interface IYouTubeService
    {
        Task<(byte[]? data, string? fileName, string? contentType, string? error)>
            DownloadAudioAsync(string url, string format);

        Task<(YtMetadata? meta, string? error)>
            GetMetadataAsync(string url, CancellationToken ct = default);

        Task<(string? filePath, string? error)>
            DownloadAudioToTempAsync(string url, string format, string workingDir, CancellationToken ct = default);

        Task<(string? thumbPath, string? error)>
            DownloadThumbnailToTempAsync(string url, string workingDir, CancellationToken ct = default);
    }
}