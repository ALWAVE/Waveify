using Microsoft.Extensions.Configuration;
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
        private readonly IRefreshTokenRepository _refreshTokenRepository;
        private readonly ISongRepositories _songRepository; // НОВОЕ

        private readonly IEmailSender _emailSender;
        private readonly IConfiguration _cfg;

        public UserServices(
            IPasswordHash passwordHash,
            IUserRepository userRepository,
            ISubscribeRepository subscribeRepository,
            IJwtProvider jwtProvider,
            IRefreshTokenRepository refreshTokenRepository,
            ISongRepositories songRepository,
            IEmailSender emailSender,
            IConfiguration cfg)
        {
            _passwordHasher = passwordHash;
            _usersRepository = userRepository;
            _subscribeRepository = subscribeRepository;
            _jwtProvider = jwtProvider;
            _refreshTokenRepository = refreshTokenRepository;
            _songRepository = songRepository;
            _emailSender = emailSender;
            _cfg = cfg;
        }
        public async Task Register(string userName, string email, string password)
        {
            var hashedPassword = _passwordHasher.Generate(password);

            // 1) генерим токен
            var token = GenerateUrlSafeToken(32);
            var tokenHash = EmailConfirmation.ComputeSha256(token);
            var expires = DateTime.UtcNow.AddHours(24);

            // 2) создаём пользователя и ставим pending
            var user = User.Create(Guid.NewGuid(), userName, email, hashedPassword);
            user.SetEmailConfirmationPending(tokenHash, expires);

            // 3) сохраняем
            await _usersRepository.Add(user);

            // 4) собираем ссылку и шлём письмо
            var frontendBaseUrl = _cfg["Frontend:BaseUrl"] ?? "http://localhost:3000";
            var confirmUrl =
                $"{frontendBaseUrl}/confirm-email?email={Uri.EscapeDataString(email)}&token={Uri.EscapeDataString(token)}";

            var html = $@"
                <p>Привет, {System.Net.WebUtility.HtmlEncode(userName)}!</p>
                <p>Для подтверждения e-mail перейди по ссылке (действует 24 часа):</p>
                <p><a href=""{confirmUrl}"">Подтвердить e-mail</a></p>";

            await _emailSender.SendAsync(email, "Подтверждение e-mail — Waveify", html);
        }
        private static string GenerateUrlSafeToken(int bytesLen = 32)
        {
            var bytes = System.Security.Cryptography.RandomNumberGenerator.GetBytes(bytesLen);
            return Convert.ToBase64String(bytes).TrimEnd('=').Replace('+', '-').Replace('/', '_');
        }
        public async Task<string> GenerateRefreshToken(Guid userId)
        {
            var refreshToken = new RefreshToken
            {
                Token = Guid.NewGuid().ToString(),
                UserId = userId,
                Expires = DateTime.UtcNow.AddDays(7)
            };

            await _refreshTokenRepository.SaveAsync(refreshToken); // <-- было без await
            return refreshToken.Token;
        }
        public async Task<IReadOnlyList<Song>> GetMySongsAll(Guid userId, bool onlyPublished = false)
        {
            if (onlyPublished)
                return await _songRepository.GetPublishedSongsByUserId(userId);

            return await _songRepository.GetSongsByUserId(userId);
        }

     
        public async Task<Subscription?> GetUserSubscription(Guid userId)
        {
            var user = await _usersRepository.GetById(userId);
            if (user?.SubscriptionId == null) return null;
            return await _subscribeRepository.GetSubscriptionById(user.SubscriptionId.Value);
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
            if (user == null) throw new InvalidOperationException("User not found.");

            if (!user.EmailConfirmation.IsConfirmed)
                throw new InvalidOperationException("E-mail не подтвержден. Проверьте почту.");

            var result = _passwordHasher.Verify(password, user.PasswordHash);
            if (!result) throw new InvalidOperationException("Invalid password.");

            var token = _jwtProvider.GenerateToken(user);
            return token;
        }

        public async Task<bool> ConfirmEmail(string email, string token)
        {
            var user = await _usersRepository.GetByEmail(email);
            if (user == null) return false;

            try
            {
                user.ConfirmEmail(token);     // вызывает EmailConfirmation.Confirm()
                await _usersRepository.Update(user);
                return true;
            }
            catch
            {
                return false;
            }
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
        public async Task ResendConfirmationEmail(string email)
        {
            var user = await _usersRepository.GetByEmail(email);
            if (user == null) return; // не раскрываем наличие аккаунта
            if (user.EmailConfirmation.IsConfirmed) return;

            var token = GenerateUrlSafeToken(32);
            var tokenHash = EmailConfirmation.ComputeSha256(token);
            var expires = DateTime.UtcNow.AddHours(24);

            user.SetEmailConfirmationPending(tokenHash, expires);
            await _usersRepository.Update(user);

            var frontendBaseUrl = _cfg["Frontend:BaseUrl"] ?? "http://77.94.203.78/:3000";
            var confirmUrl =
                $"{frontendBaseUrl}/confirm-email?email={Uri.EscapeDataString(email)}&token={Uri.EscapeDataString(token)}";

            var html = $@"
        <p>Для подтверждения e-mail перейдите по ссылке (действует 24 часа):</p>
        <p><a href=""{confirmUrl}"">Подтвердить e-mail</a></p>";

            await _emailSender.SendAsync(email, "Подтверждение e-mail — Waveify", html);
        }

    }
}
