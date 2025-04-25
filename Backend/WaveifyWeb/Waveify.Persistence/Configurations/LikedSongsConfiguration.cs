using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Waveify.Persistence.Entities;

namespace Waveify.Persistence.Configurations
{
    public class LikedSongConfiguration : IEntityTypeConfiguration<LikedSongEntity>
    {
        public void Configure(EntityTypeBuilder<LikedSongEntity> builder)
        {
            builder.HasKey(x => new { x.UserId, x.SongId });

            builder.HasOne(x => x.User)
                   .WithMany()  // Убрал навигацию, потому что у User может быть много любимых песен
                   .HasForeignKey(x => x.UserId)
                   .OnDelete(DeleteBehavior.Cascade);  // Если удаляем User, удаляется его LikedSongs

            builder.HasOne(x => x.Song)
                   .WithMany()  // Убрал навигацию, потому что у Song может быть много пользователей, которым она нравится
                   .HasForeignKey(x => x.SongId)
                   .OnDelete(DeleteBehavior.Cascade);  // Если удаляем Song, удаляются все LikedSongs
        }
    }
}
