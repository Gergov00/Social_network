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

        public UserPhotosController(AppDbContext context)
        {
            _context = context;
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
        [HttpPost]
        public async Task<ActionResult<UserPhoto>> CreateUserPhoto([FromBody] UserPhoto userPhoto)
        {
            _context.UserPhotos.Add(userPhoto);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetUserPhoto), new { id = userPhoto.Id }, userPhoto);
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
