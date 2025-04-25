using Amazon;
using Amazon.S3;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using Microsoft.OpenApi.Models;
using Waveify.API.Endpoints;
using Waveify.API.Extensions;
using Waveify.API.Settings;
using Waveify.Application.Auth;

using Waveify.Application.Interfaces.Repositories;
//using Waveify.Application.Interfaces.Repositiories;
//using Waveify.Application.Repositiories;
using Waveify.Application.Services;
using Waveify.Infrastructure;
using Waveify.Interface.Auth;
using Waveify.Persistence;
using Waveify.Persistence.Configurations;
using Waveify.Persistence.Entities;
using Waveify.Persistence.Repositiories;
using Waveify.Persistence.Repositories;

var builder = WebApplication.CreateBuilder(args);


var configuration = builder.Configuration;

// Add services to the container.
builder.Services.AddControllersWithViews();



builder.Services.AddScoped<IJwtProvider, JwtProvider>();
builder.Services.AddScoped<IPasswordHash, PasswordHash>();

builder.Services.AddScoped<UserServices>();
builder.Services.Configure<JwtOptions>(configuration.GetSection(nameof(JwtOptions)));

builder.Services.AddAutoMapper(typeof(DataBaseMapping));
builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IDrumKitServices, DrumKitServices>();
builder.Services.AddScoped<IDrumKitRepositories, DrumKitRepositories>();
builder.Services.AddScoped<ISongRepositories, SongRepository>();
builder.Services.AddScoped<ISubscribeRepository, SubscribeRepository>();
builder.Services.AddScoped<ILikedSongsRepository, LikedSongsRepository>();
builder.Services.AddScoped<IEntityTypeConfiguration<LikedSongEntity>, LikedSongConfiguration>();
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.Configure<JwtOptions>(builder.Configuration.GetSection("JwtOptions"));
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Waveify API", Version = "v1" });
    c.MapType<IFormFile>(() => new OpenApiSchema { Type = "string", Format = "binary" });
});

builder.Services.AddScoped<IRefreshTokenRepository, RefreshTokenRepository>();
builder.Services.AddScoped<RefreshTokenRepository>();
builder.Services.Configure<S3Settings>(builder.Configuration.GetSection("S3"));
builder.Services.AddScoped<IYouTubeService, YouTubeService>();
builder.Services.AddSingleton<IAmazonS3>(sp =>
{
    var s3Settings = sp.GetRequiredService<IOptions<S3Settings>>().Value;
    var amazonS3Config = new AmazonS3Config
    {
        ServiceURL = s3Settings.ServiceUrl,
        ForcePathStyle = false, // Отключение ForcePathStyle
        //RegionEndpoint = RegionEndpoint.GetBySystemName(s3Settings.Region)
    };

    return new AmazonS3Client(s3Settings.AccessKey, s3Settings.SecretKey, amazonS3Config);
});



builder.Services.AddSingleton<S3Service>();
// Регистрируем IJwtProvider
builder.Services.AddScoped<IJwtProvider, JwtProvider>();

// Подключаем аутентификацию
builder.Services.AddApiAuthentication(builder.Configuration.GetSection("JwtOptions").Get<JwtOptions>());

builder.Services.Configure<JwtOptions>(configuration.GetSection(nameof(JwtOptions)));
builder.Services.AddSingleton<JwtOptions>(sp =>
    sp.GetRequiredService<IConfiguration>().GetSection(nameof(JwtOptions)).Get<JwtOptions>());


builder.Services.AddDbContext<WaveifyDbContext>(options =>
{
    options.UseNpgsql(builder.Configuration.GetConnectionString(nameof(WaveifyDbContext)));
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000") //  Разрешаем фронтенд
              .AllowCredentials()                    //  ОБЯЗАТЕЛЬНО!
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{

    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI();
}
//else
//{
//    app.UseExceptionHandler("/Home/Error");
//    app.UseHsts();
//}
app.UseHttpsRedirection();
app.UseRouting();
app.UseCors("AllowFrontend");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.UseHttpsRedirection();
app.UseStaticFiles();


app.Use(async (context, next) =>
{
    var authHeader = context.Request.Headers["Authorization"].ToString();
    Console.WriteLine($"Authorization Header: '{authHeader}'");

    if (authHeader?.StartsWith("Bearer ") == true)
    {
        var token = authHeader.Substring("Bearer ".Length).Trim();
        Console.WriteLine($"Extracted Token: '{token}'");
    }

    await next();
});


app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");
app.Run();