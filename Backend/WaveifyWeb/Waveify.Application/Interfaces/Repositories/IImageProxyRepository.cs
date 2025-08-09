using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Waveify.Application.Interfaces.Repositories
{
    public interface IImageProxyRepository
    {
        Task<(byte[] Content, string ContentType)> GetImageAsync(string url);
    }
}
