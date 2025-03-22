using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Data.Repositories;
using Domain.Entities;

namespace PetProjecAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CommentLikesController : ControllerBase
    {
        private readonly ICommentLikeRepository _context;

        public CommentLikesController(ICommentLikeRepository context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetCommentLikes()
        {
            var commentLikes = await _context.GetAllAsync();
            return Ok(commentLikes);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetCommentLike(int id)
        {
            var commentLike = await _context.GetByIdAsync(id);
            if (commentLike == null) return NotFound();
            return Ok(commentLike);
        }

        [HttpGet("likes/{commentId}")]
        public async Task<IActionResult> GetLikeByCommentId(int commentId)
        {
            var likes = await _context.GetByCommentIdAsync(commentId);
            return Ok(likes);
        }

        [HttpPost]
        public async Task<IActionResult> CreateCommentLike([FromBody] CommentLike commentLike)
        {
            _context.AddAsync(commentLike);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetCommentLike), new { id = commentLike.Id }, commentLike);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCommentLike(int id, [FromBody] CommentLike commentLike)
        {
            if (id != commentLike.Id) return BadRequest("ID mismatch.");

            _context.Update(commentLike);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (await _context.GetByIdAsync(id) == null)
                    return NotFound();
                throw;
            }
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCommentLike(int id)
        {
            var commentLike = await _context.GetByIdAsync(id);
            if (commentLike == null) return NotFound();

            _context.Delete(commentLike);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
