using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PetProjecAPI.DB;
using PetProjecAPI.Services;

namespace PetProjecAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _env;
        private readonly FileStorageService _fileStorageService;

        public UsersController(AppDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
            _fileStorageService = new FileStorageService(env);
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
        public async Task<IActionResult> UpdateProfile([FromForm] UpdateProfileModel model)
        {
            var user = await _context.Users.FindAsync(model.UserId);
            if (user == null)
                return NotFound("Пользователь не найден.");

            user.FirstName = model.FirstName;
            user.LastName = model.LastName;
            user.About = model.About;

            if (model.RemoveAvatar)
            {
                if (!string.IsNullOrEmpty(user.AvatarURL) && !user.AvatarURL.Contains("default-avatar.png"))
                {
                    await _fileStorageService.DeleteFileByUrlAsync(user.AvatarURL, Request);
                }
                user.AvatarURL = "http://gergovzaurbek.online/images/default-avatar.png";
            }
            else if (model.Avatar != null && model.Avatar.Length > 0)
            {
                if (!string.IsNullOrEmpty(user.AvatarURL) && !user.AvatarURL.Contains("default-avatar.png"))
                {
                    await _fileStorageService.DeleteFileByUrlAsync(user.AvatarURL, Request);
                }
                user.AvatarURL = await _fileStorageService.SaveFileAndGetUrl(model.Avatar, Request);
            }

            if (model.RemoveCover)
            {
                if (!string.IsNullOrEmpty(user.CoverURL))
                {
                    await _fileStorageService.DeleteFileByUrlAsync(user.CoverURL, Request);
                }
                user.CoverURL = ""; 
            }
            else if (model.Cover != null && model.Cover.Length > 0)
            {
                if (!string.IsNullOrEmpty(user.CoverURL))
                {
                    await _fileStorageService.DeleteFileByUrlAsync(user.CoverURL, Request);
                }
                user.CoverURL = await _fileStorageService.SaveFileAndGetUrl(model.Cover, Request);
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
