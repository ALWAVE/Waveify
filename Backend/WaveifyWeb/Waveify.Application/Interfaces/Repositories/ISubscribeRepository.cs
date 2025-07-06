using Waveify.Core.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Waveify.Application.Interfaces.Repositories
{
    public interface ISubscribeRepository
    {
        Task<List<Subscription>> GetAllSubscriptions();
        Task<Subscription?> GetSubscriptionById(Guid id);
        Task AddSubscription(Subscription subscription);
        Task DeleteSubscription(Guid id);
    }
}
