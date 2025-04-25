using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Waveify.Core.Models;
using Microsoft.EntityFrameworkCore;
using Waveify.Persistence.Entities;
using Npgsql.EntityFrameworkCore.PostgreSQL;
using Waveify.Application.Interfaces.Repositories;

namespace Waveify.Persistence.Repositories
{
    public class DrumKitRepositories : IDrumKitRepositories
    {
        private readonly WaveifyDbContext _context;

        public DrumKitRepositories(WaveifyDbContext context)
        {
            _context = context;
        }
        public async Task<List<DrumKit>> Get()
        {
            var drumKitEntities = await _context.DrumKits
               .AsNoTracking()
               .ToListAsync();
            var drumKits = drumKitEntities.
                Select(d => DrumKit.Create(d.Id, d.Title, d.Description, d.Url, d.Price).DrumKit)
                .ToList();
            return drumKits;
        }
        public async Task<Guid> Create(DrumKit drumKit)
        {
            var drimKitEntity = new DrumKitEntity
            {
                Id = drumKit.Id,
                Title = drumKit.Title,
                Description = drumKit.Description,
                Url = drumKit.Url,
                Price = drumKit.Price,
            };
            await _context.DrumKits.AddAsync(drimKitEntity);
            await _context.SaveChangesAsync();
            return drumKit.Id;

        }
        public async Task<Guid> Update(Guid id, string title, string desc, string url, decimal price)
        {
            await _context.DrumKits
                .Where(d => d.Id == id)
                .ExecuteUpdateAsync(s => s
                .SetProperty(d => d.Title, d => title)
                 .SetProperty(d => d.Description, d => desc)
                  .SetProperty(d => d.Url, d => url)
                   .SetProperty(d => d.Price, d => price));
            return id;
        }
        public async Task<Guid> Delete(Guid id)
        {
            await _context.DrumKits
                .Where(d => d.Id == id)
                .ExecuteDeleteAsync();
            return id;

        }
    }
}
