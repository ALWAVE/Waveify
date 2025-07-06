using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Waveify.Core.Models
{
    public class SongReaction
    {
        public Guid UserId { get; set; }
        public Guid SongId { get; set; }
        public bool IsLike { get; set; }
    }
}
