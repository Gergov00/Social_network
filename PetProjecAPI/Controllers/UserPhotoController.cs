using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PetProjecAPI.DB;

namespace PetProjecAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserPhotosController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _env;

        public UserPhotosController(AppDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        // GET: api/UserPhotos
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserPhoto>>> GetUserPhotos()
        {
            return await _context.UserPhotos.ToListAsync();
        }

        // GET: api/UserPhotos/5
        [HttpGet("{id}")]
        public async Task<ActionResult<UserPhoto>> GetUserPhoto(int id)
        {
            var userPhoto = await _context.UserPhotos.FindAsync(id);
            if (userPhoto == null) return NotFound();
            return userPhoto;
        }

        // POST: api/UserPhotos
        [HttpPost("upload")]
        public async Task<IActionResult> UploadUserPhoto([FromForm] IFormFile file, [FromForm] int userId)
        {
            if (file == null || file.Length == 0)
                return BadRequest("Файл не выбран");

            // Генерация уникального имени для файла, чтобы избежать коллизий
            var fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);

            // Формирование пути для сохранения файла в папке wwwroot/images
            var imagesFolder = Path.Combine(_env.WebRootPath, "images");
            if (!Directory.Exists(imagesFolder))
            {
                Directory.CreateDirectory(imagesFolder);
            }
            var savePath = Path.Combine(imagesFolder, fileName);

            // Сохранение файла на диск
            using (var stream = new FileStream(savePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            // Формирование URL файла
            // Например: http://localhost:8000/images/{fileName} или с доменом
            var fileUrl = $"{Request.Scheme}://{Request.Host}/images/{fileName}";

            // Создание новой записи UserPhoto с URL
            var userPhoto = new UserPhoto
            {
                UserId = userId,
                PhotoURL = fileUrl,
                CreatedAt = DateTime.UtcNow
            };

            _context.UserPhotos.Add(userPhoto);
            await _context.SaveChangesAsync();

            return Ok(userPhoto);
        }

        // PUT: api/UserPhotos/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUserPhoto(int id, [FromBody] UserPhoto userPhoto)
        {
            if (id != userPhoto.Id) return BadRequest("ID mismatch.");

            _context.Entry(userPhoto).State = EntityState.Modified;
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserPhotoExists(id)) return NotFound();
                throw;
            }
            return NoContent();
        }

        // DELETE: api/UserPhotos/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUserPhoto(int id)
        {
            var userPhoto = await _context.UserPhotos.FindAsync(id);
            if (userPhoto == null) return NotFound();

            _context.UserPhotos.Remove(userPhoto);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        private bool UserPhotoExists(int id)
        {
            return _context.UserPhotos.Any(e => e.Id == id);
        }
    }
}
