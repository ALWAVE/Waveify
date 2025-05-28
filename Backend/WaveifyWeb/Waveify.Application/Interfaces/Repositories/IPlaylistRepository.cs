using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Waveify.Core.Models;

namespace Waveify.Application.Interfaces.Repositories
{
    public interface IPlaylistRepository
    {
        Task AddAsync(Playlist playlist);
        Task DeleteAsync(Guid id);
        Task<Playlist?> GetByIdAsync(Guid id);
        Task<List<Playlist>> GetByUserIdAsync(Guid userId);
        Task<List<Playlist>> GetAllAsync();
        Task AddSongToPlaylistAsync(Guid playlistId, Guid songId);
        Task RemoveSongFromPlaylistAsync(Guid playlistId, Guid songId);
        Task CreateAsync(Playlist playlist);
        Task UpdateAsync(Playlist playlist);
        Task<List<Song>> GetSongsByPlaylistIdAsync(Guid playlistId);
    }

}
