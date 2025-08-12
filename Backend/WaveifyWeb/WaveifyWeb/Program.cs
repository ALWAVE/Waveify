using Amazon.S3;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;

using Waveify.API.Extensions;
using Waveify.API.Settings;
using Waveify.Application.Auth;
using Waveify.Application.Interfaces.Repositories;
using Waveify.Application.Services;
using Waveify.Infrastructure;            // JwtOptions
using Waveify.Interface.Auth;
using Waveify.Persistence;
using Waveify.Persistence.Configurations;
using Waveify.Persistence.Entities;
using Waveify.Persistence.Repositiories; // ImageProxyRepository (если у тебя так называется неймспейс)
using Waveify.Persistence.Repositories;

var builder = WebApplication.CreateBuilder(args);
var configuration = builder.Configuration;

// MVC/Controllers
builder.Services.AddControllersWithViews();
builder.Services.AddEndpointsApiExplorer();

// Swagger
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Waveify API", Version = "v1" });
    c.MapType<IFormFile>(() => new OpenApiSchema { Type = "string", Format = "binary" });
});

// ---------- JWT: одна секция, один объект опций ----------
builder.Services.Configure<JwtOptions>(configuration.GetSection("JwtOptions"));
var jwtOptions = configuration.GetSection("JwtOptions").Get<JwtOptions>();

// ---------- DI: Services & Repositories ----------
builder.Services.AddScoped<IJwtProvider, JwtProvider>();
builder.Services.AddScoped<IPasswordHash, PasswordHash>();
builder.Services.AddScoped<UserServices>();

builder.Services.AddScoped<ISongReactionRepository, SongReactionRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IDrumKitServices, DrumKitServices>();
builder.Services.AddScoped<IDrumKitRepositories, DrumKitRepositories>();
builder.Services.AddScoped<ISongRepositories, SongRepository>();
builder.Services.AddScoped<ISubscribeRepository, SubscribeRepository>();
builder.Services.AddScoped<ILikedSongsRepository, LikedSongsRepository>();
builder.Services.AddScoped<IListeningHistoryRepository, ListeningHistoryRepository>();
builder.Services.AddScoped<IPlaylistRepository, PlaylistRepository>();
builder.Services.AddScoped<IReportSongRepository, ReportSongRepository>();
builder.Services.AddScoped<IRefreshTokenRepository, RefreshTokenRepository>();
builder.Services.AddScoped<IYouTubeService, YouTubeService>();
// HttpClient для прокси изображений
builder.Services.AddHttpClient<IImageProxyRepository, ImageProxyRepository>()
    .SetHandlerLifetime(TimeSpan.FromMinutes(5));

// AutoMapper (один раз, сканируем сборку с профилем)
builder.Services.AddAutoMapper(typeof(DataBaseMapping));
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("ModeratorOnly", policy =>
        policy.RequireRole("Moderator"));
});

// Аутентификация JWT (используем ТОТ ЖЕ jwtOptions)
builder.Services.AddApiAuthentication(jwtOptions);

// БД
builder.Services.AddDbContext<WaveifyDbContext>(options =>
{
    options.UseNpgsql(configuration.GetConnectionString(nameof(WaveifyDbContext)));
});

// CORS: одна политика
builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000", "http://77.94.203.78:3000")
              .AllowCredentials()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// S3
builder.Services.Configure<S3Settings>(configuration.GetSection("S3"));
builder.Services.AddSingleton<IAmazonS3>(sp =>
{
    var s3Settings = sp.GetRequiredService<IOptions<S3Settings>>().Value;
    var amazonS3Config = new AmazonS3Config
    {
        ServiceURL = s3Settings.ServiceUrl,
        ForcePathStyle = false,
    };
    return new AmazonS3Client(s3Settings.AccessKey, s3Settings.SecretKey, amazonS3Config);
});
builder.Services.AddSingleton<S3Service>();
builder.Services.AddScoped<IYouTubeService, YouTubeService>();

var app = builder.Build();

// Swagger в Dev/Prod (как тебе удобнее)
if (app.Environment.IsDevelopment() || app.Environment.IsProduction())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Пайплайн
// app.UseHttpsRedirection(); // включай, когда перейдёшь на HTTPS
app.UseStaticFiles();

app.UseRouting();

app.UseCors("Frontend");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Роут по умолчанию (если нужен)
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();
