using AutoMapper;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Waveify.Application.Interfaces.Repositories;
using Waveify.Core.Models;
using Waveify.Persistence.Entities;

namespace Waveify.Persistence.Repositories
{
    public class PlaylistRepository : IPlaylistRepository
    {
        private readonly WaveifyDbContext _context;
        private readonly IMapper _mapper;

        public PlaylistRepository(WaveifyDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task AddAsync(Playlist playlist)
        {
            var entity = _mapper.Map<PlaylistEntity>(playlist);
            _context.Playlists.Add(entity);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Guid id)
        {
            var playlist = await _context.Playlists.FindAsync(id);
            if (playlist != null)
            {
                _context.Playlists.Remove(playlist);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<List<Playlist>> GetAllAsync()
        {
            var entities = await _context.Playlists
                .Include(p => p.PlaylistSongs) // Используем PlaylistSongs, а не Songs напрямую
                .ThenInclude(ps => ps.Song)   // Загружаем песню, связанную через PlaylistSongEntity
                .ToListAsync();

            return _mapper.Map<List<Playlist>>(entities);
        }

        public async Task CreateAsync(Playlist playlist)
        {
            var entity = _mapper.Map<PlaylistEntity>(playlist);
            await _context.Playlists.AddAsync(entity);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Playlist playlist)
        {
            var entity = await _context.Playlists.FindAsync(playlist.Id);
            if (entity == null) return;

            _mapper.Map(playlist, entity);
            _context.Playlists.Update(entity);
            await _context.SaveChangesAsync();
        }

        public async Task<Playlist?> GetByIdAsync(Guid id)
        {
            var entity = await _context.Playlists
                .Include(p => p.PlaylistSongs) // Используем PlaylistSongs
                .ThenInclude(ps => ps.Song)   // Загружаем связанные песни
                .FirstOrDefaultAsync(p => p.Id == id);

            return entity != null ? _mapper.Map<Playlist>(entity) : null;
        }

        public async Task<List<Playlist>> GetByUserIdAsync(Guid userId)
        {
            var entities = await _context.Playlists
                .Where(p => p.UserId == userId)
                .ToListAsync();

            return _mapper.Map<List<Playlist>>(entities);
        }

        public async Task AddSongToPlaylistAsync(Guid playlistId, Guid songId)
        {
            // Получаем плейлист
            var playlist = await _context.Playlists
                .Include(p => p.PlaylistSongs) // Загружаем PlaylistSongs
                .FirstOrDefaultAsync(p => p.Id == playlistId);

            var song = await _context.Songs.FindAsync(songId);

            if (playlist != null && song != null)
            {
                // Создаем связь в промежуточной таблице
                var playlistSongEntity = new PlaylistSongEntity
                {
                    PlaylistId = playlistId,
                    SongId = songId
                };

                // Добавляем в промежуточную таблицу
                _context.PlaylistSongs.Add(playlistSongEntity);
                await _context.SaveChangesAsync();
            }
        }

        public async Task RemoveSongFromPlaylistAsync(Guid playlistId, Guid songId)
        {
            var playlistSong = await _context.PlaylistSongs
                .FirstOrDefaultAsync(ps => ps.PlaylistId == playlistId && ps.SongId == songId);

            if (playlistSong != null)
            {
                _context.PlaylistSongs.Remove(playlistSong);
                await _context.SaveChangesAsync();
            }
        }
        public async Task<List<Song>> GetSongsByPlaylistIdAsync(Guid playlistId)
        {
            var playlistEntity = await _context.Playlists
                .Include(p => p.PlaylistSongs)
                .ThenInclude(ps => ps.Song)
                .FirstOrDefaultAsync(p => p.Id == playlistId);

            if (playlistEntity == null)
                throw new Exception("Playlist not found");

            var songEntities = playlistEntity.PlaylistSongs
                .Select(ps => ps.Song)
                .ToList();

            return _mapper.Map<List<Song>>(songEntities);
        }

    }
}
