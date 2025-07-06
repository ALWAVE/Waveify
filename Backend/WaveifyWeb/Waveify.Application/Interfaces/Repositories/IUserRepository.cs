using Waveify.Core.Models;

namespace Waveify.Application.Interfaces.Repositories
{
    public interface IUserRepository
    {
        Task Add(User user);
        Task<User> GetByEmail(string email);
        Task<User> GetById(Guid id);
        Task AssignSubscription(Guid userId, Guid subscriptionId, DateTime startDate, DateTime? endDate);
        Task Update(User user);
        Task<List<Song>> GetSongsByUserId(Guid userId);

    }
}