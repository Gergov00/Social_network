using Data;
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
        private readonly ICommentLikeRepository _commentLikeRepository;
        private readonly IUnitOfWork _unitOfWorkl;

        public CommentLikesController(ICommentLikeRepository context, IUnitOfWork unitOfWorkl)
        {
            _commentLikeRepository = context;
            _unitOfWorkl = unitOfWorkl;
        }

        [HttpGet]
        public async Task<IActionResult> GetCommentLikes()
        {
            var commentLikes = await _commentLikeRepository.GetAllAsync();
            return Ok(commentLikes);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetCommentLike(int id)
        {
            var commentLike = await _commentLikeRepository.GetByIdAsync(id);
            if (commentLike == null) return NotFound();
            return Ok(commentLike);
        }

        [HttpGet("likes/{commentId}")]
        public async Task<IActionResult> GetLikeByCommentId(int commentId)
        {
            var likes = await _commentLikeRepository.GetByCommentIdAsync(commentId);
            return Ok(likes);
        }

        [HttpPost]
        public async Task<IActionResult> CreateCommentLike([FromBody] CommentLike commentLike)
        {
            _commentLikeRepository.AddAsync(commentLike);
            await _unitOfWorkl.SaveChangesAsync();
            return CreatedAtAction(nameof(GetCommentLike), new { id = commentLike.Id }, commentLike);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCommentLike(int id, [FromBody] CommentLike commentLike)
        {
            if (id != commentLike.Id) return BadRequest("ID mismatch.");

            _commentLikeRepository.Update(commentLike);
            
                await _unitOfWorkl.SaveChangesAsync();
            
           
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCommentLike(int id)
        {
            var commentLike = await _commentLikeRepository.GetByIdAsync(id);
            if (commentLike == null) return NotFound();

            _commentLikeRepository.Delete(commentLike);
            await _unitOfWorkl.SaveChangesAsync();
            return NoContent();
        }
    }
}
