using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Waveify.Core.Models
{
    public class Playlist
    {
        public Guid Id { get; set; }
        public string Name { get; set; }  = string.Empty;
        public Guid UserId { get; set; }
        public DateTime CreateAt { get; set; }
        public string? ImagePath { get; set; }
        public static Playlist Create(Guid id, string name, Guid userId)
        {
            return new Playlist { 
                Id = id, 
                Name = name, 
                UserId = userId,
                CreateAt = DateTime.UtcNow,
            };
        }

    }

}
