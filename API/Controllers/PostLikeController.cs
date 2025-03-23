using Data;
using Microsoft.AspNetCore.Mvc;
using Data.Repositories;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
   [Route("api/[controller]")]
[ApiController]
public class PostLikesController : ControllerBase
{
    private readonly IPostLikeRepository _postLikeRepository;
    private readonly IUnitOfWork _unitOfWorkl;

    public PostLikesController(IPostLikeRepository postLikeRepository, IUnitOfWork unitOfWorkl)
    {
        _postLikeRepository = postLikeRepository;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<PostLike>>> GetPostLikes()
    {
        var likes = await _postLikeRepository.GetAllAsync();
        return Ok(likes);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<PostLike>> GetPostLike(int id)
    {
        var like = await _postLikeRepository.GetByIdAsync(id);
        if (like == null) return NotFound();
        return Ok(like);
    }

    [HttpGet("likes/{postId}")]
    public async Task<ActionResult<IEnumerable<PostLike>>> GetLikesByPostId(int postId)
    {
        var likes = await _postLikeRepository.GetByPostIdAsync(postId);
        return Ok(likes);
    }

    [HttpPost]
    public async Task<ActionResult<PostLike>> CreatePostLike([FromBody] PostLike postLike)
    {
        await _postLikeRepository.AddAsync(postLike);
        await _unitOfWorkl.SaveChangesAsync();
        return CreatedAtAction(nameof(GetPostLike), new { id = postLike.Id }, postLike);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdatePostLike(int id, [FromBody] PostLike postLike)
    {
        if (id != postLike.Id) return BadRequest("ID mismatch.");
        _postLikeRepository.Update(postLike);
        
            await _unitOfWorkl.SaveChangesAsync();
        
       
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePostLike(int id)
    {
        var postLike = await _postLikeRepository.GetByIdAsync(id);
        if (postLike == null) return NotFound();
        _postLikeRepository.Delete(postLike);
        await _unitOfWorkl.SaveChangesAsync();
        return NoContent();
    }
}

}
