using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Waveify.Core.Models;

namespace Waveify.Persistence.Entities
{
    public class TagEntity
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        = string.Empty;
        public ICollection<Song> Songs { get; set; } = new List<Song>();
    }
}
