using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Waveify.Core.Models;

namespace Waveify.Application.Interfaces.Repositories
{
    public interface IReportSongRepository
    {
        Task AddReportAsync(ReportSong report);
        Task<bool> HasUserReportedAsync(Guid userId, Guid songId);

        //Task<IEnumerable<ReportSong>> GetAllReportsAsync();
    }
}
