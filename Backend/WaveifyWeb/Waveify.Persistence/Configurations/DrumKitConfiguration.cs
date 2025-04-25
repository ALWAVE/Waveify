using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Waveify.Core.Models;
using Waveify.Persistence.Entities;

namespace Waveify.Persistence.Configurations
{
    public class DrumKitConfiguration : IEntityTypeConfiguration<DrumKitEntity>
    {
        public void Configure(EntityTypeBuilder<DrumKitEntity> builder)
        {
            builder.HasKey(e => e.Id);
            builder.Property(b => b.Title)
                .IsRequired()
                .HasMaxLength(DrumKit.MAX_TITTLE_LENGHT);
            builder.Property(b => b.Description)
             .IsRequired();
            builder.Property(b => b.Url)
              .IsRequired();
            builder.Property(b => b.Price)
              .IsRequired();

        }
    }
}
