using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PetProjecAPI.DB;

namespace PetProjecAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PostLikesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PostLikesController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/PostLikes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PostLike>>> GetPostLikes()
        {
            return await _context.PostLikes.ToListAsync();
        }

        // GET: api/PostLikes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PostLike>> GetPostLike(int id)
        {
            var postLike = await _context.PostLikes.FindAsync(id);
            if (postLike == null) return NotFound();
            return postLike;
        }

        [HttpGet("likes/{postId}")]
        public async Task<ActionResult<IEnumerable<PostLike>>> GetLikesByPostId(int postId)
        {
            var likes = await _context.PostLikes
                .Where(e =>  e.PostId == postId)
                .ToListAsync();
            return Ok(likes);
        }

        // POST: api/PostLikes
        [HttpPost]
        public async Task<ActionResult<PostLike>> CreatePostLike([FromBody] PostLike postLike)
        {
            _context.PostLikes.Add(postLike);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetPostLike), new { id = postLike.Id }, postLike);
        }

        // PUT: api/PostLikes/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePostLike(int id, [FromBody] PostLike postLike)
        {
            if (id != postLike.Id) return BadRequest("ID mismatch.");

            _context.Entry(postLike).State = EntityState.Modified;
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PostLikeExists(id)) return NotFound();
                throw;
            }
            return NoContent();
        }

        // DELETE: api/PostLikes/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePostLike(int id)
        {
            var postLike = await _context.PostLikes.FindAsync(id);
            if (postLike == null) return NotFound();

            _context.PostLikes.Remove(postLike);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        private bool PostLikeExists(int id)
        {
            return _context.PostLikes.Any(e => e.Id == id);
        }
    }
}
