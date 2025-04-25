

using Waveify.Core.Models;

namespace Waveify.Application.Interfaces.Repositories
{
    public interface IRefreshTokenRepository
    {
        Task<RefreshToken?> GetByTokenAsync(string token);
        Task<IEnumerable<RefreshToken>> GetTokenByUserIdAsync(Guid userId);
        Task RevokeAsync(string token);
        Task SaveAsync(RefreshToken token);
    }
}