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
using Waveify.Persistence.Repositories;
namespace Waveify.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly UserServices _userServices;
        private readonly RefreshTokenRepository _refreshTokenRepository;
        private readonly JwtProvider _jwtProvider;

        public UserController(UserServices userServices)
        {
            _userServices = userServices;
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

            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = false, // Временно! Для продакшна — true
                SameSite = SameSiteMode.Lax, // Lax или None
                Expires = DateTime.UtcNow.AddHours(2)
            };


            var refreshTokenOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = false, // Временно! Для продакшна — true
                SameSite = SameSiteMode.Lax, // Lax или None
                Expires = refreshToken.Expires
            };

            // Сохраняем оба токена в cookies
            Response.Cookies.Append("jwt", token, cookieOptions);
            Response.Cookies.Append("refreshToken", refreshToken.Token, refreshTokenOptions);

            Console.WriteLine("✅ Кука с JWT и RefreshToken отправлена клиенту");

            return Ok(new { message = "Logged in successfully" });
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
        [Authorize]
        public async Task<IActionResult> GetCurrentUser()
        {
            Console.WriteLine("🔍 Запрос на /me");

            var cookie = Request.Cookies["refreshToken"];
            Console.WriteLine($"🍪 Полученная кука: {cookie}");

            var userIdClaim = User.FindFirst("userId");
            if (userIdClaim == null)
            {
                return Unauthorized("Invalid token.");
            }

            var userId = Guid.Parse(userIdClaim.Value);
            var user = await _userServices.GetUserById(userId);

            return Ok(user);
        }
        [HttpPost("logout")]
        public IActionResult Logout()
        {
            Console.WriteLine("📢 Выход пользователя...");

            Response.Cookies.Delete("jwt");

            return Ok(new { message = "Выход выполнен" });
        }
        [HttpGet("refresh-token")]
        public async Task<IActionResult> RefreshToken()
        {
            var refreshToken = Request.Cookies["refreshToken"];
            if (string.IsNullOrEmpty(refreshToken))
            {
                return Unauthorized("No refresh token found.");
            }

            var existingToken = await _refreshTokenRepository.GetByTokenAsync(refreshToken);
            if (existingToken == null || existingToken.Expires < DateTime.UtcNow)
            {
                return Unauthorized("Invalid or expired refresh token.");
            }

            // Генерация нового JWT
            var user = await _userServices.GetUserById(existingToken.UserId);
            var newJwtToken = _jwtProvider.GenerateToken(user);

            // Генерация нового refresh token
            var newRefreshToken = await _userServices.GenerateAndSaveRefreshToken(user.Id);

            // Настройки для JWT
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = DateTime.UtcNow.AddHours(1) // Новый срок действия JWT
            };

            // Отправляем новый JWT в куки
            Response.Cookies.Append("jwt", newJwtToken, cookieOptions);

            // Настройки для refresh token
            var refreshTokenOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = newRefreshToken.Expires
            };

            // Отправляем новый refresh token в куки
            Response.Cookies.Append("refreshToken", newRefreshToken.Token, refreshTokenOptions);

            return Ok(new { message = "Token refreshed" });
        }



        //[Authorize(Roles = "Moderator")] // или временно убери защиту, пока тестишь
        [HttpPost("set-role")]
        public async Task<IActionResult> SetRole([FromBody] SetUserRoleRequest request)
        {
            await _userServices.SetUserRole(request.UserId, request.Role);
            return Ok(new { message = "Роль установлена!" });
        }
       
        [HttpGet("is-moderator")]
        [Authorize]
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


