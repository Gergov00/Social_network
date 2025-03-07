using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PetProjecAPI.DB;

namespace PetProjecAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _env;

        public UsersController(AppDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        // GET: api/Users
        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            return await _context.Users.ToListAsync();
        }

        // GET: api/Users/5
        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound();
            return user;
        }

        // POST: api/Users
        [HttpPost]
        public async Task<ActionResult<User>> CreateUser([FromBody] User user)
        {
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            // Возвращаем код 201 Created с информацией о созданном пользователе
            return CreatedAtAction(nameof(GetUser), new { id = user.Id }, user);
        }


        [HttpPut("UpdateProfile")]
        public async Task<IActionResult> UpdateProfile(
    [FromForm] int userId,
    [FromForm] string firstName,
    [FromForm] string lastName,
    [FromForm] IFormFile? avatar)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                return NotFound("Пользователь не найден.");

            // Обновляем имя и фамилию
            user.FirstName = firstName;
            user.LastName = lastName;

            // Если передана аватарка, обновляем и её
            if (avatar != null && avatar.Length > 0)
            {
                // Константа, указывающая URL стандартной аватарки
                const string defaultAvatarUrl = "http://www.gergovzaurbek.online/images/default-avatar.png";

                // Удаляем старый файл, если он есть и не является стандартным
                if (!string.IsNullOrEmpty(user.AvatarURL) && !user.AvatarURL.Equals(defaultAvatarUrl, StringComparison.OrdinalIgnoreCase))
                {
                    try
                    {
                        // Извлекаем имя файла из полного URL
                        var oldFileName = Path.GetFileName(new Uri(user.AvatarURL).AbsolutePath);
                        var oldFilePath = Path.Combine(_env.WebRootPath, "images", oldFileName);

                        if (System.IO.File.Exists(oldFilePath))
                        {
                            System.IO.File.Delete(oldFilePath);
                        }
                    }
                    catch (Exception ex)
                    {
                        // Логируем ошибку, но не прерываем выполнение
                        Console.WriteLine($"Ошибка при удалении старого файла: {ex.Message}");
                    }
                }

                // Генерируем уникальное имя для нового файла
                var fileName = Guid.NewGuid().ToString() + Path.GetExtension(avatar.FileName);
                var imagesFolder = Path.Combine(_env.WebRootPath, "images");
                if (!Directory.Exists(imagesFolder))
                {
                    Directory.CreateDirectory(imagesFolder);
                }
                var savePath = Path.Combine(imagesFolder, fileName);

                // Сохраняем новый файл на диск
                using (var stream = new FileStream(savePath, FileMode.Create))
                {
                    await avatar.CopyToAsync(stream);
                }

                // Формируем URL для доступа к новому файлу
                var fileUrl = $"{Request.Scheme}://{Request.Host}/images/{fileName}";
                user.AvatarURL = fileUrl;
            }

            _context.Entry(user).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return Ok(user);
        }



        // PUT: api/Users/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] User user)
        {
            if (id != user.Id) return BadRequest("ID mismatch.");

            _context.Entry(user).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id)) return NotFound();
                throw;
            }
            return NoContent();
        }

        // DELETE: api/Users/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound();

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        private bool UserExists(int id)
        {
            return _context.Users.Any(e => e.Id == id);
        }
    }
}
