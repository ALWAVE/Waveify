using System.Data;
using System.Security.Cryptography;
using Waveify.Application.Auth;
using Waveify.Application.Interfaces.Repositories;
using Waveify.Core.Models;
using Waveify.Interface.Auth;

namespace Waveify.Application.Services
{
    public class UserServices
    {
        private readonly IPasswordHash _passwordHasher;
        private readonly IUserRepository _usersRepository;
        private readonly ISubscribeRepository _subscribeRepository;
        private readonly IJwtProvider _jwtProvider;
        private readonly IRefreshTokenRepository _refreshTokenRepository; // 👈 Добавлено

        public UserServices(
            IPasswordHash passwordHash,
            IUserRepository userRepository,
            ISubscribeRepository subscribeRepository,
            IJwtProvider jwtProvider,
            IRefreshTokenRepository refreshTokenRepository) // 👈 Добавлено
        {
            _passwordHasher = passwordHash;
            _usersRepository = userRepository;
            _subscribeRepository = subscribeRepository;
            _jwtProvider = jwtProvider;
            _refreshTokenRepository = refreshTokenRepository; // 👈 Сохраняем зависимость
        }

        public async Task Register(string userName, string email, string password)
        {
            var hashedPassword = _passwordHasher.Generate(password);
            var user = User.Create(Guid.NewGuid(), userName, email, hashedPassword);
            await _usersRepository.Add(user);
        }

        public string GenerateRefreshToken(Guid userId)
        {
            var refreshToken = new RefreshToken
            {
                Token = Guid.NewGuid().ToString(),
                UserId = userId,
                Expires = DateTime.UtcNow.AddDays(7) // токен должен иметь срок действия
            };

            _refreshTokenRepository.SaveAsync(refreshToken);
            return refreshToken.Token;
        }
        public async Task<User?> GetUserByEmail(string email)
        {
            return await _usersRepository.GetByEmail(email);
        }
        public async Task<RefreshToken> GenerateAndSaveRefreshToken(Guid userId)
        {
            // Генерация нового Refresh Token
            var refreshToken = new RefreshToken
            {
                UserId = userId,
                Token = Guid.NewGuid().ToString(),
                Expires = DateTime.UtcNow.AddDays(7) // Токен живет 7 дней
            };

            await _refreshTokenRepository.SaveAsync(refreshToken);
            return refreshToken;
        }
        public async Task<User?> GetUserByRefreshToken(string token)
        {
            // Получаем refresh token из базы данных
            var refreshToken = await _refreshTokenRepository.GetByTokenAsync(token);  // Исправили на GetByTokenAsync
            if (refreshToken == null || refreshToken.Expires < DateTime.UtcNow)
            {
                return null; // Токен либо отсутствует, либо истёк
            }

            // Получаем пользователя, связанного с этим токеном
            var user = await _usersRepository.GetById(refreshToken.UserId);
            return user;
        }

        public string GenerateJwtToken(User user)
        {
            return _jwtProvider.GenerateToken(user); // Генерация нового JWT токена
        }

        public async Task<string> Login(string email, string password)
        {
            var user = await _usersRepository.GetByEmail(email);
            if (user == null)
            {
                throw new InvalidOperationException("User not found.");
            }

            var result = _passwordHasher.Verify(password, user.PasswordHash);
            if (!result)
            {
                throw new InvalidOperationException("Invalid password.");
            }

            var token = _jwtProvider.GenerateToken(user);
            return token;
        }

        public async Task<User?> GetUserById(Guid userId)
        {
            var user = await _usersRepository.GetById(userId);
            if (user == null) return null;

            user.Songs = await _usersRepository.GetSongsByUserId(userId);

            if (user.SubscriptionEnd.HasValue && user.SubscriptionEnd.Value < DateTime.UtcNow)
            {
                user.SubscriptionId = null;
                user.Subscription = null;
                user.SubscriptionStart = null;
                user.SubscriptionEnd = null;
                await _usersRepository.Update(user);
            }

            return user;
        }

        public async Task AssignSubscription(Guid userId, Guid subscriptionId, DateTime startDate, DateTime? endDate)
        {
            var user = await _usersRepository.GetById(userId);
            if (user == null)
                throw new InvalidOperationException("User not found.");

            if (user.SubscriptionId.HasValue)
            {
                var subscription = await _subscribeRepository.GetSubscriptionById(user.SubscriptionId.Value);
                if (subscription != null &&
                    user.SubscriptionEnd.HasValue &&
                    user.SubscriptionEnd.Value < DateTime.UtcNow)
                {
                    user.SubscriptionId = null;
                    user.SubscriptionStart = null;
                    user.SubscriptionEnd = null;
                }
            }

            var subscriptionToAssign = await _subscribeRepository.GetSubscriptionById(subscriptionId);
            if (subscriptionToAssign == null)
                throw new InvalidOperationException($"Subscription with ID {subscriptionId} not found.");

            user.SubscriptionId = subscriptionId;
            user.SubscriptionStart = startDate;
            user.SubscriptionEnd = endDate;

            await _usersRepository.Update(user);
        }
        public async Task SetUserRole(Guid userId, string role)
        {
            var user = await _usersRepository.GetById(userId);
            if (user == null) throw new Exception("User not found");

            if (!Enum.TryParse<User.UserRole>(role, out var parsedRole))
                throw new Exception("Invalid role");

            user.SetRole(parsedRole);
            await _usersRepository.Update(user);
        }
        public async Task<bool> IsUserModerator(Guid userId)
        {
            var user = await _usersRepository.GetById(userId);
            if (user == null)
                throw new Exception("User not found");

            return user.Role == User.UserRole.Moderator; // если enum
                                                // или: return user.Role == "Moderator"; // если строка
                                                // или: return user.Role == 3; // если int
        }

    }
}
