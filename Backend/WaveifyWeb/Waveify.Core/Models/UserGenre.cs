using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Waveify.Core.Models
{
    public class UserGenre
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public string Genre { get; set; } = null!;
    }

}
