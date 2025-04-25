using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Waveify.Application.Interfaces.Repositories;
using Waveify.Core.Models;
using Waveify.Persistence.Entities;

namespace Waveify.Persistence.Repositories
{
    public class RefreshTokenRepository : IRefreshTokenRepository
    {
        private readonly WaveifyDbContext _context;
        private readonly IMapper _mapper;

        public RefreshTokenRepository(WaveifyDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task SaveAsync(RefreshToken token)
        {
            var entity = _mapper.Map<RefreshTokenEntity>(token);
            await _context.RefreshTokens.AddAsync(entity);
            await _context.SaveChangesAsync();
        }

        public async Task<RefreshToken?> GetByTokenAsync(string token)
        {
            var entity = await _context.RefreshTokens
                .FirstOrDefaultAsync(rt => rt.Token == token && !rt.IsRevoked);

            return entity == null ? null : _mapper.Map<RefreshToken>(entity);
        }

        public async Task<IEnumerable<RefreshToken>> GetTokenByUserIdAsync(Guid userId)
        {
            var entities = await _context.RefreshTokens
                .Where(rt => rt.UserId == userId && !rt.IsRevoked)
                .ToListAsync();

            return _mapper.Map<IEnumerable<RefreshToken>>(entities);
        }

        public async Task RevokeAsync(string token)
        {
            var entity = await _context.RefreshTokens
                .FirstOrDefaultAsync(rt => rt.Token == token && !rt.IsRevoked);

            if (entity != null)
            {
                entity.IsRevoked = true;
                await _context.SaveChangesAsync();
            }
        }
    }
}
