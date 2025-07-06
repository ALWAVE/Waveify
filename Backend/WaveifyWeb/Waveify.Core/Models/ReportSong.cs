using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Waveify.Core.Models
{
    public class ReportSong
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public Guid SongId { get; set; }
        public string Reason { get; set; }
        public string ReasonOfReport { get; set; }
        public DateTime CreateAt { get; set; }

    }
}
