using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Waveify.Persistence.Entities;

namespace Waveify.Persistence.Configurations
{
    public class UserConfiguration : IEntityTypeConfiguration<UserEntity>
    {
        public void Configure(EntityTypeBuilder<UserEntity> builder)
        {
            builder.HasKey(e => e.Id);
            builder.Property(b => b.UserName).IsRequired();
            builder.Property(b => b.Email).IsRequired();
            builder.Property(b => b.PasswordHash).IsRequired();

            builder.HasOne(u => u.Subscription)
                   .WithMany()
                   .HasForeignKey(u => u.SubscriptionId)
                   .OnDelete(DeleteBehavior.SetNull);
        }
    }
}
