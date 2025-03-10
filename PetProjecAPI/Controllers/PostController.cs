using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PetProjecAPI.DB;
using PetProjecAPI.Services; // для IFileStorageService
using System;
using System.Linq;
using System.Threading.Tasks;

namespace PetProjecAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PostsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _env;
        private readonly FileStorageService _fileStorageService;

        public PostsController(AppDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
            _fileStorageService = new FileStorageService(env);
        }

        // GET: api/Posts
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Post>>> GetPosts()
        {
            return await _context.Posts.ToListAsync();
        }

        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<Post>>> GetPostsByUserId(int userId)
        {
            return await _context.Posts
                .Where(p => p.UserId == userId)
                .ToListAsync();
        }


        // GET: api/Posts/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Post>> GetPost(int id)
        {
            var post = await _context.Posts.FindAsync(id);
            if (post == null) return NotFound();
            return post;
        }

        // POST: api/Posts/create
        [HttpPost("create")]
        public async Task<ActionResult<Post>> CreatePost(
            [FromForm] IFormFile? file,
            [FromForm] int userId,
            [FromForm] string content,
            [FromForm] DateTime createdAt)
        {
            string fileUrl = "";
            if (file != null && file.Length > 0)
            {
                fileUrl = await _fileStorageService.SaveFileAndGetUrl(file, Request);
            }

            var post = new Post
            {
                UserId = userId,
                Content = content,
                PhotoUrl = fileUrl,
                CreatedAt = createdAt
            };
            _context.Posts.Add(post);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetPost), new { id = post.Id }, post);
        }

        // PUT: api/Posts/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePost(int id, [FromBody] Post post)
        {
            if (id != post.Id) return BadRequest("ID mismatch.");

            _context.Entry(post).State = EntityState.Modified;
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PostExists(id)) return NotFound();
                throw;
            }
            return NoContent();
        }

        // DELETE: api/Posts/5
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeletePost(int id)
        {
            var post = await _context.Posts.FindAsync(id);
            if (post == null) return NotFound();

            // Если у поста есть фото, удаляем его с сервера
            if (!string.IsNullOrEmpty(post.PhotoUrl))
            {
                await _fileStorageService.DeleteFileByUrlAsync(post.PhotoUrl, Request);
            }

            _context.Posts.Remove(post);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        private bool PostExists(int id)
        {
            return _context.Posts.Any(e => e.Id == id);
        }
    }
}
