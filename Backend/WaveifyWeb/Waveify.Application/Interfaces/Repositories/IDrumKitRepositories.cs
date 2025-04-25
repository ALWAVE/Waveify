using Waveify.Core.Models;

namespace Waveify.Application.Interfaces.Repositories
{
    public interface IDrumKitRepositories
    {
        Task<Guid> Create(DrumKit drumKit);
        Task<Guid> Delete(Guid id);
        Task<List<DrumKit>> Get();
        Task<Guid> Update(Guid id, string title, string desc, string url, decimal price);
    }
}