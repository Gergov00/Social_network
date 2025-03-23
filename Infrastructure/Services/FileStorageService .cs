using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Hosting;


namespace Infrastructure.Services
{
    

    public interface IFileStorageService
    {
        Task<string> SaveFileAndGetUrl(IFormFile file, HttpRequest request);
        Task DeleteFileByUrlAsync(string fileUrl, HttpRequest request);
    }

    public class FileStorageService : IFileStorageService
    {
        private readonly IWebHostEnvironment _env;

        public FileStorageService(IWebHostEnvironment env)
        {
            _env = env;
        }

        public async Task<string> SaveFileAndGetUrl(IFormFile file, HttpRequest request)
        {
            var fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);

            var imagesFolder = Path.Combine(_env.WebRootPath, "images");
            if (!Directory.Exists(imagesFolder))
            {
                Directory.CreateDirectory(imagesFolder);
            }
            var savePath = Path.Combine(imagesFolder, fileName);

            using (var stream = new FileStream(savePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            var fileUrl = $"{request.Scheme}://{request.Host}/images/{fileName}";
            return fileUrl;
        }

        public async Task DeleteFileByUrlAsync(string fileUrl, HttpRequest request)
        {
            if (!Uri.TryCreate(fileUrl, UriKind.Absolute, out var uri))
            {
                throw new ArgumentException("Некорректный URL.", nameof(fileUrl));
            }

            var relativePath = uri.AbsolutePath;

            if (relativePath.StartsWith("/"))
            {
                relativePath = relativePath.Substring(1);
            }

            var fullPath = Path.Combine(_env.WebRootPath, relativePath.Replace('/', Path.DirectorySeparatorChar));

            if (File.Exists(fullPath))
            {
                File.Delete(fullPath);
            }

            await Task.CompletedTask;
        }
    }

}
