using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Waveify.Application.Interfaces.Repositories;

using Waveify.Core.Models;
using Waveify.Persistence.Entities;

namespace Waveify.Persistence.Repositories
{
    public class SongRepository : ISongRepositories
    {
        private readonly WaveifyDbContext _context;
        private readonly IMapper _mapper;

        public SongRepository(WaveifyDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task Add(Song song)
        {
            var songEntity = new SongEntity
            {
                Id = song.Id,
                Title = song.Title,
                Author = song.Author,
                UserId = song.UserID,
                Duration = song.Duration,
                CreatedAt = song.CreatedAt,
                Genre = song.Genre,
                Vibe = song.Vibe,
                Like = song.Like,             
                SongPath = song.SongPath,
                ImagePath = song.ImagePath
            };

            await _context.Songs.AddAsync(songEntity);
            await _context.SaveChangesAsync();
        }

        public async Task<Song?> GetById(Guid id)
        {
            var songEntity = await _context.Songs
                .Include(s => s.User) // Подгружаем информацию о пользователе
                .FirstOrDefaultAsync(s => s.Id == id);

            return songEntity == null ? null : _mapper.Map<Song>(songEntity);
        }

        public async Task<List<Song>> GetAll()
        {
            var songEntities = await _context.Songs.ToListAsync();
            return _mapper.Map<List<Song>>(songEntities);
        }

        public async Task<Song?> GetSongById(Guid id)
        {
            var songEntity = await _context.Songs
                .Include(s => s.User) // Загружаем связанного пользователя
                .FirstOrDefaultAsync(s => s.Id == id);


            return songEntity == null ? null : _mapper.Map<Song>(songEntity);
        }

        // Правильное название метода для поиска песен по UserId
        public async Task<List<Song>> GetSongsByUserId(Guid userId)
        {
            var songEntities = await _context.Songs
                .Where(s => s.UserId == userId)
                .Include(s => s.User)
                .ToListAsync();

            return songEntities.Any() ? _mapper.Map<List<Song>>(songEntities) : new List<Song>();
        }

        public Task<List<Song>> GetAllMusic()
        {
            throw new NotImplementedException();
        }
        public async Task Update(Song song)
        {
            var songEntity = _mapper.Map<SongEntity>(song);

            _context.Songs.Update(songEntity);
            await _context.SaveChangesAsync();
        }
        public async Task Delete(Guid id)
        {
            var song = await _context.Songs.FindAsync(id);
            if (song != null)
            {
                _context.Songs.Remove(song);
                await _context.SaveChangesAsync();
            }
        }
    }
}
