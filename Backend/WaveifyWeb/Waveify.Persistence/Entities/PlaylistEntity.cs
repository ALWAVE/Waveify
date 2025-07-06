using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Waveify.Persistence.Entities
{
    public class PlaylistEntity
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public Guid UserId { get; set; }
        public UserEntity User { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? ImagePath { get; set; }
        public ICollection<PlaylistSongEntity> PlaylistSongs { get; set; }
    }
}
