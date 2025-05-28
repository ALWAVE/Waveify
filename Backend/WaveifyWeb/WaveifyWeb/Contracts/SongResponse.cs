namespace Waveify.API.Contracts
{
    public record SongResponse(
        Guid id,
        string Title,
        string Author,
        Guid UserId,
        TimeSpan Duration,
        DateTime CreateAt,
        string Genre,
        string Vibe,
        int Like,
        int Dislike,
        int Plays,
        string SongPath,
        string ImagePath,
      
        List<Guid> TagIds // Здесь добавлена запятая
                          //List<Guid> AwardIds
    );
}
