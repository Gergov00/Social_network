using API.Services;
using Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Data.Repositories;
using Domain.Entities;


namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PostsController : ControllerBase
    {
        private readonly IPostRepository _postRepository;
        private readonly IFileStorageService _fileStorageService;
        private readonly IUnitOfWork _unitOfWorkl;
        public PostsController(IPostRepository postRepository, IFileStorageService fileStorageService, IUnitOfWork unitOfWork)
        {
            _postRepository = postRepository;
            _fileStorageService = fileStorageService;
            _unitOfWorkl = unitOfWork;
        }

        [HttpGet]
        public async Task<IActionResult> GetPosts()
        {
            var posts = await _postRepository.GetAllAsync();
            return Ok(posts);
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetPostsByUserId(int userId)
        {
            var posts = await _postRepository.GetByUserIdAsync(userId);
            return Ok(posts);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetPost(int id)
        {
            var post = await _postRepository.GetByIdAsync(id);
            if (post == null) return NotFound();
            return Ok(post);
        }

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

            await _postRepository.AddAsync(post);
            await _unitOfWorkl.SaveChangesAsync();
            return CreatedAtAction(nameof(GetPost), new { id = post.Id }, post);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePost(int id, [FromBody] Post post)
        {
            if (id != post.Id) return BadRequest("ID mismatch.");
            _postRepository.Update(post);
            
            await _unitOfWorkl.SaveChangesAsync();
            

            return NoContent();
        }

        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeletePost(int id)
        {
            var post = await _postRepository.GetByIdAsync(id);
            if (post == null) return NotFound();

            if (!string.IsNullOrEmpty(post.PhotoUrl))
            {
                await _fileStorageService.DeleteFileByUrlAsync(post.PhotoUrl, Request);
            }

            _postRepository.Delete(post);
            await _unitOfWorkl.SaveChangesAsync();
            return NoContent();
        }
    }
}