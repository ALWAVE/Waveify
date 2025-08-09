using System.Net.Http.Headers;
using Waveify.Application.Interfaces.Repositories;

public class ImageProxyRepository : IImageProxyRepository
{
    private readonly HttpClient _httpClient;

    public ImageProxyRepository(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<(byte[] Content, string ContentType)> GetImageAsync(string url)
    {
        var request = new HttpRequestMessage(HttpMethod.Get, url);
        request.Headers.UserAgent.Add(new ProductInfoHeaderValue("Mozilla", "5.0"));

        var response = await _httpClient.SendAsync(request);

        if (!response.IsSuccessStatusCode)
            throw new Exception($"Failed to fetch image. Status: {response.StatusCode}");

        var contentType = response.Content.Headers.ContentType?.ToString() ?? "image/jpeg";
        var bytes = await response.Content.ReadAsByteArrayAsync();

        return (bytes, contentType);
    }
}
