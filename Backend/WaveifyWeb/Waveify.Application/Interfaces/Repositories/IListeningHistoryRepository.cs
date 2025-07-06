using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Waveify.Core.Models;

namespace Waveify.Application.Interfaces.Repositories
{
    public interface IListeningHistoryRepository
    {
        Task AddAsync(ListeningHistory history);
        //Task<List<Song>> GetUserListeningHistory(Guid userId, int take = 20);
        Task<List<SongWithListenCountModel>> GetUserListeningHistory(Guid userId, int take = 20);
        Task<List<SongWithListenCountModel>> GetTopSongsForUserAsync(Guid userId, int take = 8);
        
    }

}
