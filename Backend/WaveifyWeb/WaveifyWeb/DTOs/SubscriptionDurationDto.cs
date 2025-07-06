namespace Waveify.API.DTOs
{
    public class SubscriptionDurationDto
    {
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; } // null, если подписка Lifetime
    }
}
