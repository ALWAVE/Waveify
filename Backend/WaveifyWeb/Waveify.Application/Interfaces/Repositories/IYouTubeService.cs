namespace Waveify.Application.Interfaces.Repositories
{
    public interface IYouTubeService
    {
        Task<(byte[] data, string fileName, string error)> DownloadAudioAsync(string url, string format);
    }
}