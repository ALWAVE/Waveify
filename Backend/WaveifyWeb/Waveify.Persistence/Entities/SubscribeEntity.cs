using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Waveify.Persistence.Entities
{
    public class SubscribeEntity
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string SmallTitle { get; set; } = string.Empty;
        public string Color { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;    
        public int Price { get; set; }
        public string Discount { get; set; }
        public string Features {  get; set; } = string.Empty;


    }
}
