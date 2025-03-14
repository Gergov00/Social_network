﻿using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PetProjecAPI.DB;

namespace PetProjecAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CommentsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CommentsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Comments
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Comment>>> GetComments()
        {
            return await _context.Comments.ToListAsync();
        }

        // GET: api/Comments/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Comment>> GetComment(int id)
        {
            var comment = await _context.Comments.FindAsync(id);
            if (comment == null) return NotFound();
            return comment;
        }

        [HttpGet("comments/{postId}")]
        public async Task<ActionResult<IEnumerable<Comment>>> GetCommentsByPostId(int postId)
        {
            var comments = await _context.Comments
                .Where(e => e.PostId == postId)
                .ToArrayAsync();
            return Ok(comments);
        }

        // POST: api/Comments
        [HttpPost]
        public async Task<ActionResult<Comment>> CreateComment([FromBody] Comment comment)
        {
            _context.Comments.Add(comment);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetComment), new { id = comment.Id }, comment);
        }

        // PUT: api/Comments/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateComment(int id, [FromBody] Comment comment)
        {
            if (id != comment.Id) return BadRequest("ID mismatch.");

            _context.Entry(comment).State = EntityState.Modified;
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CommentExists(id)) return NotFound();
                throw;
            }
            return NoContent();
        }

        // DELETE: api/Comments/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteComment(int id)
        {
            var comment = await _context.Comments.FindAsync(id);
            if (comment == null) return NotFound();

            _context.Comments.Remove(comment);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        private bool CommentExists(int id)
        {
            return _context.Comments.Any(e => e.Id == id);
        }
    }
}
