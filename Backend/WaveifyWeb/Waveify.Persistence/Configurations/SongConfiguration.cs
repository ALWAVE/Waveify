using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Waveify.Persistence.Entities;

namespace Waveify.Persistence.Configurations
{
    public class SongConfiguration : IEntityTypeConfiguration<SongEntity>
    {
        public void Configure(EntityTypeBuilder<SongEntity> builder)
        {
            builder.HasKey(e => e.Id);
            builder.Property(e => e.Title).IsRequired().HasMaxLength(100);
            builder.Property(e => e.Author).IsRequired();
            builder.Property(e => e.UserId).IsRequired();
            builder.Property(e => e.Duration).IsRequired();
            builder.Property(e => e.CreatedAt).IsRequired();
            builder.Property(e => e.Genre).IsRequired();
            builder.Property(e => e.Vibe).IsRequired();
            builder.Property(e => e.Like).IsRequired();
            builder.Property(e => e.Rating).IsRequired();
            builder.Property(e => e.SongPath).IsRequired();
            builder.Property(e => e.ImagePath).IsRequired();

            builder.HasOne(s => s.User)
                  .WithMany(u => u.Songs)
                  .HasForeignKey(s => s.UserId)
                  .OnDelete(DeleteBehavior.Cascade); // Если удаляем User, удаляются и его Songs
                    
            builder.HasMany(e => e.Tags)
                   .WithMany()
                   .UsingEntity(j => j.ToTable("SongTags"));

        }
    }

    public class BeatConfiguration : IEntityTypeConfiguration<BeatEntity>
    {
        public void Configure(EntityTypeBuilder<BeatEntity> builder)
        {
            builder.HasBaseType<SongEntity>();
            builder.Property(b => b.BPM)
                .IsRequired();
            builder.Property(b => b.Price)
                .IsRequired();
            builder.Property(b => b.TypeBeat)
                .IsRequired();
        }
    }

    public class TrackConfiguration : IEntityTypeConfiguration<TrackEntity>
    {
        public void Configure(EntityTypeBuilder<TrackEntity> builder)
        {
            builder.HasBaseType<SongEntity>();
            builder.Property(t => t.CountAuditions)
                .IsRequired();
            builder.Property(t => t.MusicBoost)
                .IsRequired();
        }
    }
}