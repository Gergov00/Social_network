using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PetProjecAPI.DB;

namespace PetProjecAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CommentLikesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CommentLikesController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/CommentLikes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CommentLike>>> GetCommentLikes()
        {
            return await _context.CommentLikes.ToListAsync();
        }

        // GET: api/CommentLikes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<CommentLike>> GetCommentLike(int id)
        {
            var commentLike = await _context.CommentLikes.FindAsync(id);
            if (commentLike == null) return NotFound();
            return commentLike;
        }

        // POST: api/CommentLikes
        [HttpPost]
        public async Task<ActionResult<CommentLike>> CreateCommentLike([FromBody] CommentLike commentLike)
        {
            _context.CommentLikes.Add(commentLike);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetCommentLike), new { id = commentLike.Id }, commentLike);
        }

        // PUT: api/CommentLikes/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCommentLike(int id, [FromBody] CommentLike commentLike)
        {
            if (id != commentLike.Id) return BadRequest("ID mismatch.");

            _context.Entry(commentLike).State = EntityState.Modified;
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CommentLikeExists(id)) return NotFound();
                throw;
            }
            return NoContent();
        }

        // DELETE: api/CommentLikes/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCommentLike(int id)
        {
            var commentLike = await _context.CommentLikes.FindAsync(id);
            if (commentLike == null) return NotFound();

            _context.CommentLikes.Remove(commentLike);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        private bool CommentLikeExists(int id)
        {
            return _context.CommentLikes.Any(e => e.Id == id);
        }
    }
}
