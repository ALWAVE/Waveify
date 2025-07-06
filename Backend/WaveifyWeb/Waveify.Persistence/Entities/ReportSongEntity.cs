using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Waveify.Persistence.Entities
{
    public class ReportSongEntity
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public Guid SongId { get; set; }
        [Required]
        public string Reason { get; set; }
        [Required]
        public string ReasonOfReport { get; set; }
        public DateTime CreateAt { get; set; }

    }
}
