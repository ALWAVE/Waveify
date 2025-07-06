using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Waveify.Core.Models
{
    public class ListeningHistory
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public Guid SongId { get; set; }
        public int ListenCount { get; set; } = 1;
        public DateTime ListenedAt { get; set; } = DateTime.UtcNow;
    }
}
