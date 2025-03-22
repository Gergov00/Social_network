using Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Data.Repositories;
using Domain.Entities;
using PetProjecAPI.Services;

namespace PetProjecAPI.Controllers
{
    [Route("api/[controller]")]
[ApiController]
public class UserPhotosController : ControllerBase
{
    private readonly IUserPhotoRepository _userPhotoRepository;
    private readonly IFileStorageService _fileStorageService;
    private readonly IUnitOfWork _unitOfWorkl;

    public UserPhotosController(IUnitOfWork unitOfWorkl, IUserPhotoRepository userPhotoRepository, IFileStorageService fileStorageService)
    {
        _unitOfWorkl = unitOfWorkl;
        _userPhotoRepository = userPhotoRepository;
        _fileStorageService = fileStorageService;
    }

    [HttpGet("{userId}")]
    public async Task<ActionResult<IEnumerable<UserPhoto>>> GetUserPhotos(int userId)
    {
        var photos = await _userPhotoRepository.GetPhotosByUserIdAsync(userId);
        if (photos == null || !photos.Any()) return NotFound();
        return Ok(photos);
    }

    [HttpGet("photos/{id}")]
    public async Task<ActionResult<UserPhoto>> GetUserPhoto(int id)
    {
        var photo = await _userPhotoRepository.GetByIdAsync(id);
        if (photo == null) return NotFound();
        return Ok(photo);
    }

    [HttpPost("upload")]
    public async Task<IActionResult> UploadUserPhoto([FromForm] IFormFile file, [FromForm] int userId)
    {
        if (file == null || file.Length == 0)
            return BadRequest("Файл не выбран");

        string fileUrl = await _fileStorageService.SaveFileAndGetUrl(file, Request);
        var userPhoto = new UserPhoto
        {
            UserId = userId,
            PhotoURL = fileUrl,
            CreatedAt = DateTime.UtcNow
        };
        await _userPhotoRepository.AddAsync(userPhoto);
        await _unitOfWorkl.SaveChangesAsync();
        return Ok(userPhoto);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateUserPhoto(int id, [FromBody] UserPhoto userPhoto)
    {
        if (id != userPhoto.Id) return BadRequest("ID mismatch.");
        _userPhotoRepository.Update(userPhoto);
        
            await _unitOfWorkl.SaveChangesAsync();
        
        
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteUserPhoto(int id)
    {
        var userPhoto = await _userPhotoRepository.GetByIdAsync(id);
        if (userPhoto == null) return NotFound();

        await _fileStorageService.DeleteFileByUrlAsync(userPhoto.PhotoURL, Request);
        _userPhotoRepository.Delete(userPhoto);
        await _unitOfWorkl.SaveChangesAsync();
        return NoContent();
    }
}

}
