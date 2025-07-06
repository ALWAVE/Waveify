using Amazon.S3.Model;
using Waveify.Core.Models;

namespace Waveify.Application.Interfaces.Repositories
{
    public interface ISongRepositories
    {
        Task Add(Song song);
        Task <Song>GetSongById(Guid id);
        Task<List<Song>> GetSongsByUserId(Guid userId);
        Task<List<Song>> GetAll();
        Task Update(Song song);
        Task Delete (Guid id);
        Task<List<Song>> GetAllPendingSongs();
        Task<List<Song>> GetPublishedSongsByUserId(Guid id);
        Task<List<Song>> GetSongsByIdsAsync(List<Guid> ids);
        Task<List<Song>> SearchSongsAsync(string? query, string? genre, string? vibe);

    }
}