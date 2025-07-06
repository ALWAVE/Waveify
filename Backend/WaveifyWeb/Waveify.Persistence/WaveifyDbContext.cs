using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Waveify.Core.Models;
using Waveify.Persistence.Configurations;
using Waveify.Persistence.Entities;
using static Amazon.S3.Util.S3EventNotification;
namespace Waveify.Persistence
{
    public class WaveifyDbContext : DbContext
    {
        public WaveifyDbContext(DbContextOptions<WaveifyDbContext> options) : base(options) {}
        public DbSet<DrumKitEntity> DrumKits { get; set; }
        public DbSet<UserEntity> Users { get; set; }
        public DbSet<SongEntity> Songs { get; set; }
        public DbSet<SubscribeEntity> Subscriptions { get; set; }
        public DbSet<TagEntity> Tags { get; set; }
        public DbSet<LikedSongEntity> LikedSongs { get; set; }
        public DbSet<RefreshTokenEntity> RefreshTokens { get; set; }
        public DbSet<PlaylistEntity> Playlists { get; set; }
        public DbSet<PlaylistSongEntity> PlaylistSongs { get; set; }
        public DbSet<SongReactionEntity> SongReactions { get; set; }
        public DbSet<ListeningHistoryEntity> ListeningHistories { get; set; }
        public DbSet<UserGenre> UserGenres { get; set; }
        public DbSet<ReportSongEntity> ReportSongs { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<PlaylistSongEntity>()
                .HasKey(ps => new { ps.PlaylistId, ps.SongId }); // Композитный ключ для связи

            modelBuilder.Entity<PlaylistSongEntity>()
                .HasOne(ps => ps.Playlist)
                .WithMany(p => p.PlaylistSongs)
                .HasForeignKey(ps => ps.PlaylistId);

            modelBuilder.Entity<PlaylistSongEntity>()
                .HasOne(ps => ps.Song)
                .WithMany(s => s.PlaylistSongs)
                .HasForeignKey(ps => ps.SongId);

            modelBuilder.Entity<SongReactionEntity>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.HasIndex(e => new { e.SongId, e.UserId })
                      .IsUnique(); // один пользователь - одна реакция на песню

                entity.HasOne(e => e.Song)
                      .WithMany()
                      .HasForeignKey(e => e.SongId);

                entity.HasOne(e => e.User)
                      .WithMany()
                      .HasForeignKey(e => e.UserId);
            });

            modelBuilder.ApplyConfiguration(new ReportSongConfiguration());
        }

    }
}
