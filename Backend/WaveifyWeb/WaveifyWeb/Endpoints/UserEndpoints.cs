using Waveify.API.Contracts;
using Waveify.Application.Services; 
namespace Waveify.API.Endpoints
{
    public static class UserEndpoints
    {
        public static IEndpointRouteBuilder MapUsersEndpoints(this IEndpointRouteBuilder app)
        {
            app.MapPost("api/register", Register);
            app.MapPost("login", Login);
            return app;
        }
        private static async Task<IResult> Register(
            RegisterUserRequest request,UserServices userServices)
        {
            await userServices.Register(request.UserName, request.Email, request.Password);

            return Results.Ok();
        }
        private static async Task<IResult> Login(
            LoginUserRequest request,
            UserServices userService,
            HttpContext context
            )
        {
            var token = await userService.Login(request.Email, request.Password);
            context.Response.Cookies.Append(
                 "tasty-cookies",
                 token,
                 new CookieOptions
                 {
                     HttpOnly = true, // Не доступен через JavaScript
                     Secure = false,   // Доступен только по HTTPS
                     SameSite = SameSiteMode.Lax, // Защита от CSRF
                     Expires = DateTimeOffset.UtcNow.AddDays(7) // Время жизни куки
                 }
             );
            return Results.Ok(token);    
        }
       
    }
}
