using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Waveify.Persistence.Entities
{
    public class PlaylistSongEntity
    {
        public Guid PlaylistId { get; set; }
        public PlaylistEntity Playlist { get; set; }

        public Guid SongId { get; set; }
        public SongEntity Song { get; set; }
    }

}
