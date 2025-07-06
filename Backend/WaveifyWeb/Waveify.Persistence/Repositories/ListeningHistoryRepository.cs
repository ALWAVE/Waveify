using AutoMapper;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Waveify.Application.Interfaces.Repositories;
using Waveify.Core.Models;
using Waveify.Persistence.Entities;


namespace Waveify.Persistence.Repositories
{
    public class ListeningHistoryRepository : IListeningHistoryRepository
    {
        private readonly WaveifyDbContext _context;
        private readonly IMapper _mapper;

        public ListeningHistoryRepository(WaveifyDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task AddAsync(ListeningHistory history)
        {
            var existingEntity = await _context.ListeningHistories
                .FirstOrDefaultAsync(x => x.UserId == history.UserId && x.SongId == history.SongId);

            if (existingEntity == null)
            {
                var entity = new ListeningHistoryEntity
                {
                    Id = Guid.NewGuid(),
                    UserId = history.UserId,
                    SongId = history.SongId,
                    ListenCount = 1,
                    ListenedAt = DateTime.UtcNow
                };

                _context.ListeningHistories.Add(entity);
            }
            else
            {
                existingEntity.ListenCount++;
                existingEntity.ListenedAt = DateTime.UtcNow;
                _context.ListeningHistories.Update(existingEntity);
            }

            await _context.SaveChangesAsync();
        }


        public async Task<List<SongWithListenCountModel>> GetTopSongsForUserAsync(Guid userId, int take = 8)
        {
            return await _context.ListeningHistories
                .Where(x => x.UserId == userId)
                .Include(x => x.Song) // <--- ВАЖНО: Подгружаем связанную песню
                .GroupBy(x => x.SongId)
                .OrderByDescending(g => g.Sum(x => x.ListenCount))
                .Take(take)
                .Select(g => new SongWithListenCountModel
                {
                    Id = g.Key,
                    Title = g.First().Song.Title,
                    Author = g.First().Song.Author,
                    ListenCount = g.Sum(x => x.ListenCount),

                    // ⬇️ Добавь сюда недостающие поля:
                    ImagePath = g.First().Song.ImagePath,
                   
                })
                .ToListAsync();
        }

        public async Task<List<SongWithListenCountModel>> GetUserListeningHistory(Guid userId, int take = 20)
        {
            var history = await _context.ListeningHistories
                .Where(x => x.UserId == userId)
                .Include(x => x.Song)
                .OrderByDescending(x => x.ListenedAt)
                .Take(take)
                .Select(x => new SongWithListenCountModel
                {
                    Id = x.Song.Id,
                    Title = x.Song.Title,
                    Author = x.Song.Author,
                    ListenCount = x.ListenCount
                })
                .ToListAsync();

            return history;
        }


    }

}
