using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Waveify.Core.Models;

namespace Waveify.Persistence.Entities
{
    public class SongReactionEntity
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        public Guid SongId { get; set; }
        public SongEntity Song { get; set; } = null!;

        public Guid UserId { get; set; }
        public UserEntity User { get; set; } = null!;

        public bool IsLike { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // optional: маппинг в доменную модель
        public SongReaction ToModel()
        {
            return new SongReaction
            {
                SongId = SongId,
                UserId = UserId,
                IsLike = IsLike
            };
        }
    }
}
