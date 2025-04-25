using Amazon.S3;
using Amazon.S3.Model;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Http;

namespace Waveify.Application.Services
{
    public class S3Service
    {
        private readonly IAmazonS3 _s3Client;
        private readonly string _bucketName;
        private readonly string _serviceUrl;

        public S3Service(IConfiguration configuration)
        {
            _bucketName = configuration["S3:BucketName"]!;
            _serviceUrl = configuration["S3:ServiceUrl"]!;

            var config = new AmazonS3Config
            {
                ServiceURL = _serviceUrl,
                ForcePathStyle = true, // обязательно для REG.RU
          
            };

            _s3Client = new AmazonS3Client(
                configuration["S3:AccessKey"],
                configuration["S3:SecretKey"],
                config
            );
        }

        public async Task<string> UploadFileAsync(IFormFile file, string keyName)
        {
            using var memoryStream = new MemoryStream();
            await file.CopyToAsync(memoryStream);
            memoryStream.Position = 0;

            var request = new PutObjectRequest
            {
                BucketName = _bucketName,
                Key = keyName,
                InputStream = memoryStream,
                ContentType = file.ContentType,
                CannedACL = S3CannedACL.PublicRead,
                AutoCloseStream = true,
                UseChunkEncoding = false // 🔥 важно для REG.RU
            };

            await _s3Client.PutObjectAsync(request);

            return $"{_serviceUrl.TrimEnd('/')}/{_bucketName}/{keyName}";
        }
        public async Task DeleteFileAsync(string fileUrl)
        {
            if (string.IsNullOrWhiteSpace(fileUrl)) return;

            var key = GetS3KeyFromUrl(fileUrl);

            var deleteRequest = new DeleteObjectRequest
            {
                BucketName = _bucketName,
                Key = key
            };

            await _s3Client.DeleteObjectAsync(deleteRequest);
        }

        private string GetS3KeyFromUrl(string fileUrl)
        {
            var prefix = $"{_serviceUrl.TrimEnd('/')}/{_bucketName}/";
            return fileUrl.Replace(prefix, "");
        }
    }
}
