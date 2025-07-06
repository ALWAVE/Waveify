using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Waveify.Application.Interfaces.Repositories;

using Waveify.Core.Models;

namespace Waveify.Application.Services
{
    public class DrumKitServices : IDrumKitServices
    {
        private readonly IDrumKitRepositories _drumKitRepository;
        public DrumKitServices(IDrumKitRepositories drumKitRepositories)
        {
            _drumKitRepository = drumKitRepositories;
        }
        public async Task<List<DrumKit>> GetAllDrumKits()
        {
            return await _drumKitRepository.Get();
        }
        public async Task<Guid> CreateDrumKit(DrumKit drumKit)
        {
            return await _drumKitRepository.Create(drumKit);
        }
        public async Task<Guid> UpdateDrumKit(Guid id, string title, string desc, string url, decimal price)
        {
            return await _drumKitRepository.Update(id, title, desc, url, price);
        }
        public async Task<Guid> DeleteDrumKit(Guid id)
        {
            return await _drumKitRepository.Delete(id);
        }

    }
}
