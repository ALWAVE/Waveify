namespace Waveify.API.DTOs
{
    public sealed class SongDto
    {
        public Guid Id { get; init; }
        public string Title { get; init; }
        public string Author { get; init; }
        public TimeSpan Duration { get; init; }
        public DateTime CreatedAt { get; init; }
        public string? ImagePath { get; init; }
        public string? SongPath { get; init; }
        public string ModerationStatus { get; init; }
        public IEnumerable<TagDto>? Tags { get; init; }

        public sealed class TagDto
        {
            public Guid Id { get; init; }
            public string Name { get; init; }
        }
    }
}
