﻿using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Data.Repositories;
using Domain.Entities;
using PetProjecAPI.Services;
using PetProjecAPI.DTOs;

namespace PetProjecAPI.Controllers
{
    [Route("api/[controller]")]
[ApiController]
public class UsersController : ControllerBase
{
    private readonly IUserRepository _userRepository;
    private readonly IFileStorageService _fileStorageService;

    public UsersController(IUserRepository userRepository, IFileStorageService fileStorageService)
    {
        _userRepository = userRepository;
        _fileStorageService = fileStorageService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<User>>> GetUsers()
    {
        var users = await _userRepository.GetAllAsync();
        return Ok(users);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<User>> GetUser(int id)
    {
        var user = await _userRepository.GetByIdAsync(id);
        if (user == null) return NotFound();
        return Ok(user);
    }

    [HttpPost]
    public async Task<ActionResult<User>> CreateUser([FromBody] User user)
    {
        await _userRepository.AddAsync(user);
        await _userRepository.SaveChangesAsync();
        return CreatedAtAction(nameof(GetUser), new { id = user.Id }, user);
    }

    [HttpPut("UpdateProfile")]
    public async Task<IActionResult> UpdateProfile([FromForm] UpdateProfileModel model)
    {
        var user = await _userRepository.GetByIdAsync(model.UserId);
        if (user == null)
            return NotFound("Пользователь не найден.");

        user.FirstName = model.FirstName;
        user.LastName = model.LastName;
        user.About = model.About;

        if (model.RemoveAvatar)
        {
            if (!string.IsNullOrEmpty(user.AvatarURL) && !user.AvatarURL.Contains("default-avatar.png"))
            {
                await _fileStorageService.DeleteFileByUrlAsync(user.AvatarURL, Request);
            }
            user.AvatarURL = "http://gergovzaurb.online/images/default-avatar.png";
        }
        else if (model.Avatar != null && model.Avatar.Length > 0)
        {
            if (!string.IsNullOrEmpty(user.AvatarURL) && !user.AvatarURL.Contains("default-avatar.png"))
            {
                await _fileStorageService.DeleteFileByUrlAsync(user.AvatarURL, Request);
            }
            user.AvatarURL = await _fileStorageService.SaveFileAndGetUrl(model.Avatar, Request);
        }

        if (model.RemoveCover)
        {
            if (!string.IsNullOrEmpty(user.CoverURL))
            {
                await _fileStorageService.DeleteFileByUrlAsync(user.CoverURL, Request);
            }
            user.CoverURL = "";
        }
        else if (model.Cover != null && model.Cover.Length > 0)
        {
            if (!string.IsNullOrEmpty(user.CoverURL))
            {
                await _fileStorageService.DeleteFileByUrlAsync(user.CoverURL, Request);
            }
            user.CoverURL = await _fileStorageService.SaveFileAndGetUrl(model.Cover, Request);
        }

        _userRepository.Update(user);
        await _userRepository.SaveChangesAsync();
        return Ok(user);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateUser(int id, [FromBody] User user)
    {
        if (id != user.Id) return BadRequest("ID mismatch.");
        _userRepository.Update(user);
        try
        {
            await _userRepository.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (await _userRepository.GetByIdAsync(id) == null)
                return NotFound();
            throw;
        }
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteUser(int id)
    {
        var user = await _userRepository.GetByIdAsync(id);
        if (user == null) return NotFound();
        _userRepository.Delete(user);
        await _userRepository.SaveChangesAsync();
        return NoContent();
    }

    [HttpGet("search")]
    public async Task<ActionResult<IEnumerable<User>>> SearchUsers(string query)
    {
        if (string.IsNullOrWhiteSpace(query))
            return BadRequest("Параметр запроса не может быть пустым.");
        var users = await _userRepository.SearchAsync(query);
        return Ok(users);
    }
}

}
