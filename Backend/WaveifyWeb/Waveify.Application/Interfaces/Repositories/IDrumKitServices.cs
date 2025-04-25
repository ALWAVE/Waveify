using Waveify.Core.Models;

namespace Waveify.Application.Interfaces.Repositories
{
    public interface IDrumKitServices
    {
        Task<Guid> CreateDrumKit(DrumKit drumKit);
        Task<Guid> DeleteDrumKit(Guid id);
        Task<List<DrumKit>> GetAllDrumKits();
        Task<Guid> UpdateDrumKit(Guid id, string title, string desc, string url, decimal price);
    }
}