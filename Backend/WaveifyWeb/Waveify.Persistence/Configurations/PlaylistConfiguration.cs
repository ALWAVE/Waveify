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
    public class PlaylistConfiguration : IEntityTypeConfiguration<PlaylistEntity>
    {
        public void Configure(EntityTypeBuilder<PlaylistEntity> builder)
        {
            builder.HasKey(p => p.Id);

            // Один Playlist имеет много PlaylistSongs
            builder.HasMany(p => p.PlaylistSongs)
                   .WithOne(ps => ps.Playlist)
                   .HasForeignKey(ps => ps.PlaylistId);
        }
    }

}
