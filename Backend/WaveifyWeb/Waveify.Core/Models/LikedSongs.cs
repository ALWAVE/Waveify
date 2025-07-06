using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
namespace Waveify.Core.Models
{
    public class LikedSong
    {
        public Guid UserId { get; set; }
        public Guid SongId { get; set; }
        public DateTime CreatedAt { get; set; }

        public static LikedSong Create(Guid userId, Guid songId)
        {
            return new LikedSong
            {
                UserId = userId,
                SongId = songId,
                CreatedAt = DateTime.UtcNow
            };
        }
    }
}
