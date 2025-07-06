namespace Waveify.API.Contracts
{
    public class LikeRequest
    {
        public Guid UserId { get; set; }
        public Guid SongId { get; set; }
    }
}
