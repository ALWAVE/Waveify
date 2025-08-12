using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Text;
using Waveify.API.Endpoints;
using Waveify.Infrastructure;
namespace Waveify.API.Extensions
{
    public static class ApiExtensions
    {
        public static void AddMapeedEndpoints(this IEndpointRouteBuilder app)
        {
            app.MapUsersEndpoints();
        }
        public static void AddApiAuthentication(this IServiceCollection services, JwtOptions jwtOptions)
        {
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
        .AddJwtBearer(JwtBearerDefaults.AuthenticationScheme, options =>
        {
            options.Events = new JwtBearerEvents
            {
                OnMessageReceived = ctx =>
                {
                    if (string.IsNullOrEmpty(ctx.Token) &&
                        ctx.HttpContext.Request.Cookies.ContainsKey("jwt"))
                    {
                        ctx.Token = ctx.HttpContext.Request.Cookies["jwt"];
                    }
                    return Task.CompletedTask;
                },
                OnAuthenticationFailed = ctx =>
                {
                    Console.WriteLine("JWT auth failed: " + ctx.Exception?.Message);
                    return Task.CompletedTask;
                }
            };

            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = false,
                ValidateAudience = false,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwtOptions.SecretKey)),
                ClockSkew = TimeSpan.FromSeconds(30), // чуть воздуха на рассинхрон
                RoleClaimType = ClaimTypes.Role
            };
        });

            services.AddAuthorization();

        }


    }
}
