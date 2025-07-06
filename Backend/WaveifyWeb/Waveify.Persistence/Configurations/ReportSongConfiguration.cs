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
    public class ReportSongConfiguration : IEntityTypeConfiguration<ReportSongEntity>
    {
        public void Configure(EntityTypeBuilder<ReportSongEntity> builder)
        {
            builder.ToTable("ReportSongs");
            builder.HasKey(x => x.Id);
            builder.Property(x => x.Reason).IsRequired().HasMaxLength(255);
            builder.Property(x => x.ReasonOfReport).IsRequired().HasMaxLength(1000);
            builder.Property(x => x.CreateAt).HasDefaultValueSql("timezone('utc', now())");

        }
    }
}
