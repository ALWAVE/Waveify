namespace Waveify.API.DTOs
{
    public sealed class UserMeDto
    {
        public Guid Id { get; init; }
        public string UserName { get; init; }
        public string Email { get; init; }
        public string Role { get; init; }

        public Guid? SubscriptionId { get; init; }
        public DateTime? SubscriptionStart { get; init; }
        public DateTime? SubscriptionEnd { get; init; }

        // вычисляемое, чтобы фронт показывал бейдж
        public int? DaysLeft { get; init; }
        public string? SubscriptionTitle { get; init; }
        public string? SubscriptionColor { get; init; }

        public IEnumerable<SongDto>? Songs { get; init; }
    }
}