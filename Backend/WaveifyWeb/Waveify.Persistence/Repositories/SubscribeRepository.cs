using Waveify.Core.Models;
using Waveify.Application.Interfaces.Repositories;
using Waveify.Persistence.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;

namespace Waveify.Persistence.Repositiories
{
    public class SubscribeRepository : ISubscribeRepository
    {
        private readonly WaveifyDbContext _context;
        private readonly IMapper _mapper;

        public SubscribeRepository(WaveifyDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<List<Subscription>> GetAllSubscriptions()
        {
            var subscriptions = await _context.Subscriptions.ToListAsync();
            return _mapper.Map<List<Subscription>>(subscriptions);
        }

        public async Task<Subscription> GetSubscriptionById(Guid subscriptionId)
        {
            // Получаем сущность из базы данных
            var subscriptionEntity = await _context.Subscriptions
                .FirstOrDefaultAsync(s => s.Id == subscriptionId);

            // Если сущность найдена, преобразуем её в модель
            if (subscriptionEntity != null)
            {
                return _mapper.Map<Subscription>(subscriptionEntity);
            }

            // Если подписка не найдена, возвращаем null
            return null;
        }


        public async Task AddSubscription(Subscription subscription)
        {
            var entity = _mapper.Map<SubscribeEntity>(subscription);
            await _context.Subscriptions.AddAsync(entity);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteSubscription(Guid id)
        {
            var subscription = await _context.Subscriptions.FindAsync(id);
            if (subscription != null)
            {
                _context.Subscriptions.Remove(subscription);
                await _context.SaveChangesAsync();
            }
        }
    }
}
