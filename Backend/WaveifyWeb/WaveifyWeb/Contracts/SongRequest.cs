namespace Waveify.API.Contracts
{
    public record SongRequest(
        string Title,
        string Author,
        Guid UserId,
        TimeSpan Duraction,
        DateTime CreateAt,
        string Genre,
        string Vibe,
        int Like,
        int Dislike,
        int Plays,
        string SongPath,
        string ImagePath,
       
        List<Guid> TagIds  // Добавляем список ID тегов
   
        );
    
}
