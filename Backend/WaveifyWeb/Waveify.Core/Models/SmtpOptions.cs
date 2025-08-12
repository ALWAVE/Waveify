using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Waveify.Core.Models
{
    public class SmtpOptions
    {
        public string Host { get; set; } = default!;
        public int Port { get; set; } = 587;
        public bool UseSsl { get; set; } = true;
        public string? User { get; set; }
        public string? Password { get; set; }
        public string FromEmail { get; set; } = default!;
        public string FromName { get; set; } = "Waveify";
    }
}
