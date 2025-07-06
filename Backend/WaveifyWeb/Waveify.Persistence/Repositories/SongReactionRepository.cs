using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Waveify.Application.Interfaces.Repositories;
using Waveify.Core.Models;
using Waveify.Persistence.Entities;
using Microsoft.EntityFrameworkCore;

namespace Waveify.Persistence.Repositories
{
    public class SongReactionRepository : ISongReactionRepository
    {
        private readonly WaveifyDbContext _context;

        public SongReactionRepository(WaveifyDbContext context)
        {
            _context = context;
        }

        public async Task AddOrUpdateReaction(Guid userId, Guid songId, bool isLike)
        {
            var existing = await _context.SongReactions
                .FirstOrDefaultAsync(r => r.UserId == userId && r.SongId == songId);

            if (existing != null)
            {
                existing.IsLike = isLike;
            }
            else
            {
                _context.SongReactions.Add(new SongReactionEntity
                {
                    UserId = userId,
                    SongId = songId,
                    IsLike = isLike
                });
            }

            await _context.SaveChangesAsync();
        }

        public async Task<SongReaction?> GetReaction(Guid userId, Guid songId)
        {
            var entity = await _context.SongReactions
                .FirstOrDefaultAsync(r => r.UserId == userId && r.SongId == songId);

            return entity?.ToModel();
        }

        public async Task<int> CountLikes(Guid songId)
        {
            return await _context.SongReactions
                .CountAsync(r => r.SongId == songId && r.IsLike);
        }

        public async Task<int> CountDislikes(Guid songId)
        {
            return await _context.SongReactions
                .CountAsync(r => r.SongId == songId && !r.IsLike);
        }
    }

}
