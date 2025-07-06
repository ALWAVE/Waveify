using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Waveify.Core.Models;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.Options;
using System.Security.Claims;
using Waveify.Application.Auth;
using Waveify.Interface.Auth;

namespace Waveify.Infrastructure
{
    public class JwtProvider : IJwtProvider
    {
        private readonly JwtOptions _options;
        public JwtProvider(IOptions<JwtOptions> options)
        {
            _options = options.Value;
        }

        public string GenerateToken(User user)
        {
            // Исправлено: используется фигурные скобки для создания массива
            Claim[] claims = {
                new Claim("userId", user.Id.ToString()),
                new Claim(ClaimTypes.Role, user.Role.ToString())
            };

            var signingCredentials = new SigningCredentials(
             new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_options.SecretKey)),
             SecurityAlgorithms.HmacSha256);

                // Генерация токена
                var token = new JwtSecurityToken(
                    claims: claims,
                    signingCredentials: signingCredentials,
                    expires: DateTime.UtcNow.AddHours(_options.ExpitesHourse)
                );

                // Преобразуем токен в строку
                var tokenValue = new JwtSecurityTokenHandler().WriteToken(token);

                return tokenValue;
        }
    }
}
