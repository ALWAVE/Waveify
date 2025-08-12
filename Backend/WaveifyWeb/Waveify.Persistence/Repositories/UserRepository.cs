using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Waveify.Core.Models;
using Waveify.Application.Interfaces.Repositories;
using System.IO.MemoryMappedFiles;
using System.Globalization;
using Waveify.Persistence.Entities;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
namespace Waveify.Persistence.Repositiories
{
    public class UserRepository : IUserRepository
    {
        private readonly WaveifyDbContext _context;
        private readonly SubscribeRepository _subscribeRepository;
        private readonly IMapper _mapper;
        public UserRepository(WaveifyDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        private async Task<bool> UserNameExists(string userName)
        {
            return await _context.Users.AnyAsync(u => u.UserName == userName);
        }
        private async Task<bool> EmailExists(string email)
        {
            return await _context.Users.AnyAsync(u => u.Email == email);
        }
        public async Task Add(User user)
        {
            if (await UserNameExists(user.UserName))
            {
                throw new ArgumentException("Пользователь с таким UserName уже существует!");

            }
            if (await EmailExists(user.Email))
            {
                throw new ArgumentException(
                    "Пользователь с таким Email уже существует!");
            }

            var userEntity = new UserEntity()
            {
                Id = user.Id,
                UserName = user.UserName,
                PasswordHash = user.PasswordHash,
                Email = user.Email
            };


            await _context.Users.AddAsync(userEntity);
            await _context.SaveChangesAsync();

        }
        public async Task<User> GetByEmail(string email)
        {

            var userEntity = await _context.Users
                 .Include(u => u.Songs)

                 .Include(u => u.Subscription)
                .FirstOrDefaultAsync(u => u.Email == email);

            if (userEntity == null)
            {
                // Можно вернуть null или выбросить более специфическое исключение
                return null; // Или throw new KeyNotFoundException($"User  with email {email} not found.");
            }

            return _mapper.Map<User>(userEntity);
        }

        public async Task AssignSubscription(Guid id, Guid subscriptionId, DateTime startDate, DateTime? endDate)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) throw new Exception("User not found");

            var subscription = await _context.Subscriptions.FindAsync(subscriptionId);
            if (subscription == null) throw new Exception("Subscription not found");

            user.SubscriptionId = subscriptionId;
            user.SubscriptionStart = startDate;
            user.SubscriptionEnd = endDate;


            await _context.SaveChangesAsync();
        }
        public async Task Update(User user)
        {
            var userEntity = await _context.Users.FindAsync(user.Id);
            if (userEntity == null)
            {
                throw new Exception("User not found");
            }

            userEntity.UserName = user.UserName;
            userEntity.PasswordHash = user.PasswordHash;
            userEntity.Email = user.Email;
            userEntity.SubscriptionId = user.SubscriptionId;
            userEntity.SubscriptionStart = user.SubscriptionStart;
            userEntity.SubscriptionEnd = user.SubscriptionEnd;
            userEntity.Role = user.Role.ToString();
            await _context.SaveChangesAsync();
        }

        public async Task<User?> GetById(Guid id)
        {
            var userEntity = await _context.Users
                .AsNoTracking()
                .Include(u => u.Subscription)   // <-- обязательно
                .FirstOrDefaultAsync(u => u.Id == id);

            return userEntity == null ? null : _mapper.Map<User>(userEntity);
        }

        public async Task<List<Song>> GetSongsByUserId(Guid userId)
        {
            var songEntities = await _context.Songs
                .Where(s => s.UserId == userId)
                 .Include(s => s.User)
                .ToListAsync();

            // Преобразуем List<SongEntity> в List<Song>
            return _mapper.Map<List<Song>>(songEntities);
        }
        public async Task<List<Song>> GetSongsByPlaylistId(Guid playlistId)
        {
            var playlistEntity = await _context.Playlists
                .Include(p => p.PlaylistSongs)
                .ThenInclude(ps => ps.Song)
                .FirstOrDefaultAsync(p => p.Id == playlistId);

            if (playlistEntity == null)
                throw new Exception("Playlist not found");

            // Маппим Songs из PlaylistSongs
            var songs = playlistEntity.PlaylistSongs
                .Select(ps => ps.Song)
                .ToList();

            return _mapper.Map<List<Song>>(songs); // Используем AutoMapper
        }
        public async Task<RefreshToken?> GetByTokenAsync(string token)
        {
            var entity = await _context.RefreshTokens
                .AsNoTracking()
                .FirstOrDefaultAsync(rt => rt.Token == token && !rt.IsRevoked);

            return entity == null ? null : _mapper.Map<RefreshToken>(entity);
        }

    }
}