using AutoMapper;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Waveify.Core.Models;
using Waveify.Persistence.Entities;
using Waveify.Application.Interfaces.Repositories;
namespace Waveify.Persistence.Repositories
{
    public class LikedSongsRepository : ILikedSongsRepository
    {
        private readonly WaveifyDbContext _context;
        private readonly IMapper _mapper;

        public LikedSongsRepository(WaveifyDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task AddLikedSongAsync(LikedSong likedSong)
        {
            var exists = await _context.LikedSongs
                .AnyAsync(x => x.UserId == likedSong.UserId && x.SongId == likedSong.SongId);

            if (!exists)
            {
                var entity = new LikedSongEntity
                {
                    UserId = likedSong.UserId,
                    SongId = likedSong.SongId,
                    CreatedAt = likedSong.CreatedAt
                };

                _context.LikedSongs.Add(entity);
                await _context.SaveChangesAsync();
            }
        }


        public async Task RemoveLikedSongAsync(Guid userId, Guid songId)
        {
            // Используем FirstOrDefaultAsync для поиска по составному ключу
            var entity = await _context.LikedSongs
                                       .FirstOrDefaultAsync(x => x.UserId == userId && x.SongId == songId);

            if (entity != null)
            {
                _context.LikedSongs.Remove(entity);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<bool> IsSongLikedAsync(Guid userId, Guid songId)
        {
            return await _context.LikedSongs.AnyAsync(x => x.UserId == userId && x.SongId == songId);
        }

        public async Task<(List<Song> Songs, int TotalCount)> GetLikedSongsForUserAsync(Guid userId, int page, int pageSize)
        {
            var query = _context.LikedSongs
                                .Where(x => x.UserId == userId)
                                 .Include(x => x.Song)
                                    .ThenInclude(s => s.User);

            var totalCount = await query.CountAsync();

            var songEntities = await query
                .OrderByDescending(x => x.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(x => x.Song)
                .ToListAsync();

            var songs = _mapper.Map<List<Song>>(songEntities);

            return (songs, totalCount);
        }
        public async Task<int> GetLikesCountForSongAsync(Guid songId)
        {
            return await _context.LikedSongs.CountAsync(x => x.SongId == songId);
        }
        public async Task<List<(Guid SongId, int LikesCount)>> GetTopSongsByLikesAsync(int top = 50)
        {
            // Предполагаем, что у вас есть таблица LikedSongs с SongId и UserId
            var query = _context.LikedSongs
                .GroupBy(l => l.SongId)
                .Select(g => new { SongId = g.Key, LikesCount = g.Count() })
                .OrderByDescending(x => x.LikesCount)
                .Take(top);

            var result = await query.ToListAsync();

            return result.Select(x => (x.SongId, x.LikesCount)).ToList();
        }


        //public async Task<List<Song>> GetLikedSongsForUserAsync(Guid userId) без пагинации
        //{
        //    return await GetLikedSongsForUserAsync(userId, 1, int.MaxValue);
        //}
    }

}
