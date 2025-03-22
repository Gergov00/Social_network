using Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Data.Repositories;
using Domain.Entities;

namespace PetProjecAPI.Controllers
{
    [Route("api/[controller]")]
[ApiController]
public class CommentsController : ControllerBase
{
    private readonly ICommentRepository _commentRepository;
    private readonly IUnitOfWork _unitOfWorkl;

    public CommentsController(ICommentRepository commentRepository, IUnitOfWork unitOfWorkl)
    {
        _commentRepository = commentRepository;
        _unitOfWorkl = unitOfWorkl;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Comment>>> GetComments()
    {
        var comments = await _commentRepository.GetAllAsync();
        return Ok(comments);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Comment>> GetComment(int id)
    {
        var comment = await _commentRepository.GetByIdAsync(id);
        if (comment == null) return NotFound();
        return Ok(comment);
    }

    [HttpGet("comments/{postId}")]
    public async Task<ActionResult<IEnumerable<Comment>>> GetCommentsByPostId(int postId)
    {
        var comments = await _commentRepository.GetByPostIdAsync(postId);
        return Ok(comments);
    }

    [HttpPost]
    public async Task<ActionResult<Comment>> CreateComment([FromBody] Comment comment)
    {
        await _commentRepository.AddAsync(comment);
        await _unitOfWorkl.SaveChangesAsync();
        return CreatedAtAction(nameof(GetComment), new { id = comment.Id }, comment);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateComment(int id, [FromBody] Comment comment)
    {
        if (id != comment.Id) return BadRequest("ID mismatch.");
        _commentRepository.Update(comment);
        
            await _unitOfWorkl.SaveChangesAsync();
        
       
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteComment(int id)
    {
        var comment = await _commentRepository.GetByIdAsync(id);
        if (comment == null) return NotFound();
        _commentRepository.Delete(comment);
        await _unitOfWorkl.SaveChangesAsync();
        return NoContent();
    }
}

}
