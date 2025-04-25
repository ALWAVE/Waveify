using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Waveify.Persistence.Entities
{
    public class RefreshTokenEntity
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public Guid UserId { get; set; }

        [Required]
        public string Token { get; set; }

        public DateTime Expires { get; set; }

        public bool IsRevoked { get; set; } = false;

        [ForeignKey(nameof(UserId))]
        public UserEntity User { get; set; }
    }
}
