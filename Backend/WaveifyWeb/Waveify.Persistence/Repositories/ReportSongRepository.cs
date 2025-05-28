using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Waveify.Application.Interfaces.Repositories;
using Waveify.Core.Models;
using Waveify.Persistence.Entities;
using Microsoft.EntityFrameworkCore;
namespace Waveify.Persistence.Repositories
{
    public class ReportSongRepository : IReportSongRepository
    {
        private readonly WaveifyDbContext _context;
        private readonly IMapper _mapper;

        public ReportSongRepository(WaveifyDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task AddReportAsync(ReportSong report)
        {
            var entity = _mapper.Map<ReportSongEntity>(report);
            entity.Id = Guid.NewGuid();
            entity.CreateAt = DateTime.UtcNow;

            await _context.ReportSongs.AddAsync(entity);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> HasUserReportedAsync(Guid userId, Guid songId)
        {
            return await _context.ReportSongs
                .AnyAsync(r => r.UserId == userId && r.SongId == songId);
        }
    }
}
