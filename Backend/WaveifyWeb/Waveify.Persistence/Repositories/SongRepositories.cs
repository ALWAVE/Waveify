using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Waveify.Application.Interfaces.Repositories;
using Waveify.Core.Enums;
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
                Dislike = song.Dislike,
                Plays = song.Plays,
                SongPath = song.SongPath,
                ImagePath = song.ImagePath,
                ModerationStatus = song.ModerationStatus
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
            var songEntities = await _context.Songs
                .Where(s => s.ModerationStatus == ModerationStatus.Approved)
                .Include(s => s.User)
                .ToListAsync();

            return _mapper.Map<List<Song>>(songEntities);
        }

        public async Task<List<Song>> GetAllPendingSongs()
        {
            var pendingSongs = await _context.Songs
                .Where(s => s.ModerationStatus == ModerationStatus.Pending)
                .Include(s => s.User)
                .ToListAsync();

            return _mapper.Map<List<Song>>(pendingSongs);
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
        public async Task<List<Song>> GetPublishedSongsByUserId(Guid userId)
        {
            var songEntities = await _context.Songs
                .Where(s => s.UserId == userId && s.ModerationStatus == ModerationStatus.Approved)
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
            var existingEntity = await _context.Songs.FirstOrDefaultAsync(s => s.Id == song.Id);

            if (existingEntity == null)
                throw new InvalidOperationException($"Песня с Id = {song.Id} не найдена");

            // Обновляем только нужные поля
            existingEntity.ModerationStatus = song.ModerationStatus;

            // При желании — другие поля
            // existingEntity.Title = song.Title;
            // existingEntity.Author = song.Author;
            // ...

            await _context.SaveChangesAsync();
        }
        public async Task<List<Song>> SearchSongsAsync(string? query, string? genre, string? vibe)
        {
            var queryable = _context.Songs
                .Where(s => s.ModerationStatus == ModerationStatus.Approved)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(query))
            {
                var lowered = query.ToLower();
                queryable = queryable.Where(s => s.Title.ToLower().Contains(lowered) || s.Author.ToLower().Contains(lowered));
            }

            if (!string.IsNullOrWhiteSpace(genre))
            {
                var loweredGenre = genre.ToLower();
                queryable = queryable.Where(s => s.Genre.ToLower() == loweredGenre);
            }

            if (!string.IsNullOrWhiteSpace(vibe))
            {
                var loweredVibe = vibe.ToLower();
                queryable = queryable.Where(s => s.Vibe.ToLower() == loweredVibe);
            }


            var songs = await queryable
                .Include(s => s.User)
                .Include(s => s.Tags)
                .ToListAsync();

            return _mapper.Map<List<Song>>(songs);
        }
    

        public async Task<List<Song>> GetSongsByIdsAsync(List<Guid> ids)
        {
            var songEntities = await _context.Songs
                .Where(s => ids.Contains(s.Id))
                .Include(s => s.Tags)
                .ToListAsync();

            var songs = songEntities.Select(se => new Song
            {
                Id = se.Id,
                Title = se.Title,
                Author = se.Author,
                UserID = se.UserId,
                Duration = se.Duration,
                CreatedAt = se.CreatedAt,
                Genre = se.Genre,
                Vibe = se.Vibe,
                Like = se.Like,
                Dislike = se.Dislike,
                Plays = se.Plays,
                SongPath = se.SongPath,
                ImagePath = se.ImagePath,
                ModerationStatus = se.ModerationStatus,
                Tags = se.Tags.Select(t => new Tag { Id = t.Id, Name = t.Name }).ToList()
            }).ToList();

            return songs;
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
