namespace Waveify.API.DTOs
{
    public sealed class SubscriptionDto
    {
        public Guid Id { get; init; }
        public string Title { get; init; }
        public string SmallTitle { get; init; }
        public string Color { get; init; }
        public string Description { get; init; }
        public int Price { get; init; }         // у тебя int
        public string Discount { get; init; }
        public string Features { get; init; }
    }
}
