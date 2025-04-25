namespace Waveify.API.Contracts
{
    public record DrumKitRequest(
        string title,
        string description,
        string url,
        decimal price
        );

}
