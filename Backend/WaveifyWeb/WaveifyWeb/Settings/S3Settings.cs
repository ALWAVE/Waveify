namespace Waveify.API.Settings
{
    public class S3Settings
    {
        public string AccessKey { get; set; } = string.Empty;
        public string SecretKey { get; set; } = string.Empty;
        public string BucketName { get; set; } = string.Empty;
        public string ServiceUrl { get; set; } = string.Empty;
    }
}
