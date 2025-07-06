using Waveify.Core.Models;

namespace Waveify.Application.Interfaces.Repositories
{
    public interface ILikedSongsRepository
    {
        Task AddLikedSongAsync(LikedSong likedSong);
        Task<(List<Song> Songs, int TotalCount)> GetLikedSongsForUserAsync(Guid userId, int page, int pageSize);

        Task<bool> IsSongLikedAsync(Guid userId, Guid songId);
        Task RemoveLikedSongAsync(Guid userId, Guid songId);
        Task<int> GetLikesCountForSongAsync(Guid songId);
        Task<List<(Guid SongId, int LikesCount)>> GetTopSongsByLikesAsync(int top = 50);


    }
}