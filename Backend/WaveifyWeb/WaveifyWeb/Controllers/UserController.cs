using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Waveify.API.Contracts;
using Waveify.API.DTOs;
using Waveify.Application.Interfaces.Repositories;
using Waveify.Application.Services;
using Waveify.Core.Models;
using Waveify.Infrastructure;
using Waveify.Interface.Auth;
using Waveify.Persistence.Repositiories;
using Waveify.Persistence.Repositories;
namespace Waveify.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        public record ConfirmEmailRequest(string Email, string Token);
        public record ResendConfirmationRequest(string Email);
        private readonly UserServices _userServices;
        private readonly IRefreshTokenRepository _refreshTokenRepository;
        private readonly IJwtProvider _jwtProvider;
        private readonly ISongRepositories _songRepo;
        private readonly IUserRepository _usersRepository;
        private readonly IEmailSender _emailSender;
        private readonly IConfiguration _configuration;

        public UserController(
            UserServices userServices,
            IRefreshTokenRepository refreshTokenRepository,
            IJwtProvider jwtProvider,
            ISongRepositories songRepo,
            IUserRepository usersRepository,
            IEmailSender emailSender,
            IConfiguration configuration)
        {
            _userServices = userServices;
            _refreshTokenRepository = refreshTokenRepository;
            _jwtProvider = jwtProvider;
            _songRepo = songRepo;
            _usersRepository = usersRepository;
            _emailSender = emailSender;
            _configuration = configuration;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterUserRequest request)
        {
            await _userServices.Register(request.UserName, request.Email, request.Password);

            return Ok();
        }
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginUserRequest request)
        {
            var token = await _userServices.Login(request.Email, request.Password);
            var user = await _userServices.GetUserByEmail(request.Email);
            var refreshToken = await _userServices.GenerateAndSaveRefreshToken(user.Id);

            // DEV/HTTP: Secure=false, SameSite=Lax (т.к. без HTTPS)
            var accessCookie = new CookieOptions
            {
                HttpOnly = true,
                Secure = false,
                SameSite = SameSiteMode.Lax,
                Expires = DateTime.UtcNow.AddMinutes(15),
                Path = "/"
            };
            var refreshCookie = new CookieOptions
            {
                HttpOnly = true,
                Secure = false,
                SameSite = SameSiteMode.Lax,
                Expires = refreshToken.Expires,
                Path = "/"
            };


            Response.Cookies.Append("jwt", token, accessCookie);
            Response.Cookies.Append("refreshToken", refreshToken.Token, refreshCookie);

            return Ok(new { message = "Logged in successfully" });
        }
        [HttpPost("confirm-email")]
        [AllowAnonymous]
        public async Task<IActionResult> ConfirmEmail([FromBody] ConfirmEmailRequest req)
        {
            var ok = await _userServices.ConfirmEmail(req.Email, req.Token);
            return ok ? Ok(new { message = "E-mail подтвержден" })
                      : BadRequest(new { message = "Неверный или истекший токен" });
        }

        [HttpPost("resend-confirmation")]
        [AllowAnonymous]
        public async Task<IActionResult> ResendConfirmation([FromBody] ResendConfirmationRequest req)
        {
            await _userServices.ResendConfirmationEmail(req.Email);
            return Ok(new { message = "Письмо отправлено" });
        }
        private static string GenerateUrlSafeToken(int bytesLen = 32)
        {
            var bytes = System.Security.Cryptography.RandomNumberGenerator.GetBytes(bytesLen);
            return Convert.ToBase64String(bytes).TrimEnd('=').Replace('+', '-').Replace('/', '_');
        }

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var user = await _userServices.GetUserById(id);
            if (user == null) return NotFound();
            return Ok(user);
        }
        //[HttpPost("user/{userId}/genres")]
        //public async Task<IActionResult> SetUserGenres(Guid userId, [FromBody] List<string> genres)
        //{
        //    var existing = await _context.UserGenres
        //        .Where(g => g.UserId == userId)
        //    .ToListAsync();

        //    _context.UserGenres.RemoveRange(existing);

        //    var newGenres = genres
        //        .Distinct()
        //        .Select(name => new UserGenre
        //        {
        //            Id = Guid.NewGuid(),
        //            UserId = userId,
        //            Genre = name
        //        });

        //    await _context.UserGenres.AddRangeAsync(newGenres);
        //    await _context.SaveChangesAsync();

        //    return Ok();
        //}
        [HttpGet("me")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> GetCurrentUser(
        [FromServices] ISongRepositories songRepo,
        [FromQuery] bool onlyPublished = false)
        {
            var userIdClaim = User.FindFirst("userId");
            if (userIdClaim == null) return Unauthorized();

            var userId = Guid.Parse(userIdClaim.Value);
            var user = await _userServices.GetUserById(userId);
            if (user == null) return NotFound();

            var songs = onlyPublished
                ? await songRepo.GetPublishedSongsByUserId(userId)
                : await songRepo.GetSongsByUserId(userId);

            return Ok(new
            {
                id = user.Id,
                userName = user.UserName,
                email = user.Email,

                // Роль явно строкой
                role = user.Role.ToString(),

                // Подписка: id + даты
                subscriptionId = user.SubscriptionId,
                subscriptionStart = user.SubscriptionStart, // <-- начало
                subscriptionEnd = user.SubscriptionEnd,     // <-- конец

                // Бейдж
                subscriptionTitle = user.Subscription?.Title,
                subscriptionColor = user.Subscription?.Color,

                // Песни (как у тебя и было)
                songs
            });
        }



        [HttpGet("me/songs")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> GetMySongs([FromQuery] bool onlyPublished = true)
        {
            var userId = Guid.Parse(User.FindFirst("userId")!.Value);
            var songs = onlyPublished
                ? await _songRepo.GetPublishedSongsByUserId(userId) // фильтр Approved
                : await _songRepo.GetSongsByUserId(userId);

            // отдай все поля, которые ждёт UI
            var dto = songs.Select(s => new {
                id = s.Id,
                title = s.Title,
                author = s.Author,
                duration = s.Duration,
                createdAt = s.CreatedAt,
                imagePath = s.ImagePath,
                songPath = s.SongPath,
                tags = s.Tags?.Select(t => new { id = t.Id, name = t.Name }),
                moderationStatus = s.ModerationStatus.ToString()
            });

            return Ok(dto);
        }

        [HttpGet("me/subscription")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> GetMySubscription()
        {
            var userId = Guid.Parse(User.FindFirst("userId")!.Value);
            var sub = await _userServices.GetUserSubscription(userId);
            if (sub == null) return NoContent();

            var dto = new SubscriptionDto
            {
                Id = sub.Id,
                Title = sub.Title,
                SmallTitle = sub.SmallTitle,
                Color = sub.Color,
                Description = sub.Description,
                Price = sub.Price,
                Discount = sub.Discount,
                Features = sub.Features
            };
            return Ok(dto);
        }
        [HttpPost("logout")]
        public IActionResult Logout()
        {
            Response.Cookies.Delete("jwt", new CookieOptions { Path = "/" });
            Response.Cookies.Delete("refreshToken", new CookieOptions { Path = "/" });
            return Ok(new { message = "Выход выполнен" });
        }

        [HttpGet("debug-cookies")]
        [AllowAnonymous]
        public IActionResult DebugCookies()
        {
            var hasJwt = Request.Cookies.ContainsKey("jwt");
            var hasRt = Request.Cookies.ContainsKey("refreshToken");

            var jwt = hasJwt ? Request.Cookies["jwt"] : null;
            var rt = hasRt ? Request.Cookies["refreshToken"] : null;

            return Ok(new
            {
                hasJwtCookie = hasJwt,
                jwtLen = jwt?.Length ?? 0,
                hasRefreshCookie = hasRt,
                refreshLen = rt?.Length ?? 0,
                refreshPreview = rt?.Length > 8 ? rt[..8] + "..." : rt
            });
        }


        [HttpPost("refresh-token")]
        [AllowAnonymous]
        public async Task<IActionResult> RefreshToken()
        {
            var incoming = Request.Cookies["refreshToken"];

            // ✍️ Логируем что пришло
            Console.WriteLine($"[RT] incoming cookie = '{incoming}'");

            if (string.IsNullOrEmpty(incoming))
                return Unauthorized("No refresh token found.");

            // ⚠️ не используем сразу revoke, сначала пытаемся найти
            var existing = await _refreshTokenRepository.GetByTokenAsync(incoming);

            if (existing == null)
            {
                Console.WriteLine("[RT] repo returned null for token");
                return Unauthorized("Invalid or expired refresh token.");
            }

            Console.WriteLine($"[RT] db hit: user={existing.UserId}, expires(UTC)={existing.Expires:o}, revoked={existing.IsRevoked}");

            // чуть воздуха на рассинхрон часов
            if (existing.Expires <= DateTime.UtcNow.AddSeconds(-5) || existing.IsRevoked)
                return Unauthorized("Invalid or expired refresh token.");

            var user = await _userServices.GetUserById(existing.UserId);
            if (user == null)
                return Unauthorized("User not found.");

            // 1) Генерим новый jwt + refresh
            var newJwt = _jwtProvider.GenerateToken(user);
            var newRefresh = await _userServices.GenerateAndSaveRefreshToken(user.Id);

            // 2) Ставим куки (ВАЖНО: одинаковые опции в login/refresh)
            var accessCookie = new CookieOptions
            {
                HttpOnly = true,
                Secure = false,              // dev (http). В prod -> true + SameSite=None
                SameSite = SameSiteMode.Lax, // dev
                Expires = DateTime.UtcNow.AddMinutes(15),
                Path = "/"
            };
            var refreshCookie = new CookieOptions
            {
                HttpOnly = true,
                Secure = false,
                SameSite = SameSiteMode.Lax,
                Expires = newRefresh.Expires,
                Path = "/"
            };

            Response.Cookies.Append("jwt", newJwt, accessCookie);
            Response.Cookies.Append("refreshToken", newRefresh.Token, refreshCookie);

            // 3) Теперь можно отозвать старый RT
            await _refreshTokenRepository.RevokeAsync(incoming);

            Console.WriteLine($"[RT] rotated: newRT={newRefresh.Token}, exp={newRefresh.Expires:o}");
            return Ok(new { message = "Token refreshed" });
        }

        [HttpGet("debug-refresh")]
        [AllowAnonymous]
        public async Task<IActionResult> DebugRefresh([FromServices] IRefreshTokenRepository repo)
        {
            var incoming = Request.Cookies["refreshToken"];
            var found = string.IsNullOrEmpty(incoming) ? null : await repo.GetByTokenAsync(incoming);

            return Ok(new
            {
                incoming,
                hasCookie = !string.IsNullOrEmpty(incoming),
                dbFound = found != null,
                db = found == null ? null : new
                {
                    userId = found.UserId,
                    expiresUtc = found.Expires.ToString("o"),
                    isRevoked = found.IsRevoked
                },
                nowUtc = DateTime.UtcNow.ToString("o")
            });
        }


        [HttpGet("debug-auth")]
        [AllowAnonymous]
        public IActionResult DebugAuth()
        {
            var hasJwtCookie = Request.Cookies.ContainsKey("jwt");
            var jwtLen = hasJwtCookie ? (Request.Cookies["jwt"]?.Length ?? 0) : 0;
            var authHeader = Request.Headers["Authorization"].ToString();
            var isAuth = User?.Identity?.IsAuthenticated ?? false;
            var claims = User?.Claims?.Select(c => new { c.Type, c.Value });

            return Ok(new
            {
                hasJwtCookie,
                jwtLen,
                authHeader,
                isAuth,
                claims
            });
        }


        //[Authorize(Roles = "Moderator")] // или временно убери защиту, пока тестишь
        [HttpPost("set-role")]
        public async Task<IActionResult> SetRole([FromBody] SetUserRoleRequest request)
        {
            await _userServices.SetUserRole(request.UserId, request.Role);
            return Ok(new { message = "Роль установлена!" });
        }
       
        [HttpGet("is-moderator")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<IActionResult> IsModerator()
        {
            var userIdClaim = User.FindFirst("userId");
            if (userIdClaim == null)
                return Unauthorized();

            var userId = Guid.Parse(userIdClaim.Value);
            var isModerator = await _userServices.IsUserModerator(userId);

            return Ok(new { isModerator });
        }


        [HttpPost("{userId}/subscribe/{subscriptionId}")]
        public async Task<IActionResult> AssignSubscription(Guid userId, Guid subscriptionId, [FromBody] SubscriptionDurationDto durationDto)
        {
            await _userServices.AssignSubscription(userId, subscriptionId, durationDto.StartDate, durationDto.EndDate);
            return Ok(new { Message = "Subscription assigned successfully!" });
        }

    }
}


