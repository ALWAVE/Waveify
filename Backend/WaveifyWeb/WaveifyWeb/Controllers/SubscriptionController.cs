using Microsoft.AspNetCore.Mvc;
using Waveify.Application.Interfaces.Repositories;
using Waveify.Core.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Waveify.API.Controllers
{
    [Route("api/subscriptions")]  
    [ApiController]  
    public class SubscriptionController : ControllerBase
    {
        private readonly ISubscribeRepository _subscribeRepository;

        public SubscriptionController(ISubscribeRepository subscribeRepository)
        {
            _subscribeRepository = subscribeRepository;
        }

        [HttpGet]
        public async Task<ActionResult<List<Subscription>>> GetSubscriptions()
        {
            var subscriptions = await _subscribeRepository.GetAllSubscriptions();
            return Ok(subscriptions);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Subscription>> GetSubscription(Guid id)
        {
            var subscription = await _subscribeRepository.GetSubscriptionById(id);
            if (subscription == null)
                return NotFound();

            return Ok(subscription);
        }

        [HttpPost]  
        public async Task<ActionResult> CreateSubscription([FromBody] Subscription subscription)
        {
            if (subscription == null)
                return BadRequest("Invalid subscription data");

            await _subscribeRepository.AddSubscription(subscription);
            return CreatedAtAction(nameof(GetSubscription), new { id = subscription.Id }, subscription);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteSubscription(Guid id)
        {
            await _subscribeRepository.DeleteSubscription(id);
            return NoContent();
        }
    }
}
