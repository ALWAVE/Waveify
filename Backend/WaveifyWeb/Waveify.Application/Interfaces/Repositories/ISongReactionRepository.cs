using Waveify.Core.Models;

namespace Waveify.Application.Interfaces.Repositories
{
    public interface ISongReactionRepository
    {
        Task AddOrUpdateReaction(Guid userId, Guid songId, bool isLike);
        Task<SongReaction?> GetReaction(Guid userId, Guid songId);
        Task<int> CountLikes(Guid songId);
        Task<int> CountDislikes(Guid songId);
    }
}
