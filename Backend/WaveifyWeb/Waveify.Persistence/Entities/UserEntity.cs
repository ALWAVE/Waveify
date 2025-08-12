using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Waveify.Persistence.Entities
{
    public class UserEntity
    {
        public Guid Id { get; set; }

        [Required]
        public string UserName { get; set; }

        [Required]
        public string Email { get; set; }

        [Required]
        public string PasswordHash { get; set; }

        public ICollection<SongEntity> Songs { get; set; } = new List<SongEntity>();

        public Guid? SubscriptionId { get; set; }
        public SubscribeEntity? Subscription { get; set; }

        public DateTime? SubscriptionStart { get; set; }
        public DateTime? SubscriptionEnd { get; set; }
        public string Role { get; set; } = "User";

        public bool EmailConfirmed { get; set; }
        public string? EmailConfirmationTokenHash { get; set; }
        public DateTime? EmailConfirmationExpiresUtc { get; set; }
    }
}
