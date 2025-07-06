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
    public class ListeningHistoryConfiguration : IEntityTypeConfiguration<ListeningHistoryEntity>
    {
        public void Configure(EntityTypeBuilder<ListeningHistoryEntity> builder)
        {
            builder.HasKey(e => e.Id);
            builder.Property(e => e.ListenedAt).IsRequired();

            builder.HasOne(e => e.User)
                   .WithMany()
                   .HasForeignKey(e => e.UserId);

            builder.HasOne(e => e.Song)
                   .WithMany()
                   .HasForeignKey(e => e.SongId);

            builder.HasIndex(e => new { e.UserId, e.SongId }).IsUnique();
        }

    }

}
