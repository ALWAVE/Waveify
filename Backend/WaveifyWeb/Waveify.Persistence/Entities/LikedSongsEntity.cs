using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Waveify.Core.Models;

namespace Waveify.Persistence.Entities
{
    public class LikedSongEntity
    {
        public int Id { get; set; }
        public Guid UserId { get; set; }
        public UserEntity User { get; set; }

        public Guid SongId { get; set; }
        public SongEntity Song { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}
