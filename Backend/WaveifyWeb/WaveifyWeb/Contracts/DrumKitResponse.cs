namespace Waveify.API.Contracts
{
    public record DrumKitResponse(Guid id,
        string title, 
        string description,
        string url, 
        decimal price);

}
