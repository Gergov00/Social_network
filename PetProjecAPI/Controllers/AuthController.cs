using Microsoft.AspNetCore.Mvc;
using Domain.Entities;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Security.Claims;
using Data;
using Microsoft.AspNetCore.Identity;
using PetProjecAPI.DTOs;
using Data.Repositories;

namespace PetProjecAPI.Controllers
{
    [Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly IUserRepository _userRepository;
    private readonly IConfiguration _configuration;
    private readonly PasswordHasher<User> _passwordHasher;
    private readonly IUnitOfWork _unitOfWorkl;

    public AuthController(IUserRepository userRepository, IConfiguration configuration, IUnitOfWork unitOfWorkl)
    {
        _userRepository = userRepository;
        _configuration = configuration;
        _passwordHasher = new PasswordHasher<User>();
        _unitOfWorkl = unitOfWorkl;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterModel model)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var existingUser = await _userRepository.GetByEmailAsync(model.Email);
        if (existingUser != null)
            return BadRequest("Пользователь с таким Email уже существует");

        var user = new User
        {
            FirstName = model.FirstName,
            LastName = model.LastName,
            Email = model.Email,
            AvatarURL = "http://www.gergovzaurb.online/images/default-avatar.png"
        };

        user.Password = _passwordHasher.HashPassword(user, model.Password);
        await _userRepository.AddAsync(user);
        await _unitOfWorkl.SaveChangesAsync();

        return Ok(new { Message = "Пользователь успешно зарегистрирован" });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginModel model)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var user = await _userRepository.GetByEmailAsync(model.Email);
        if (user == null)
            return Unauthorized("Неверный Email или пароль");

        var verificationResult = _passwordHasher.VerifyHashedPassword(user, user.Password, model.Password);
        if (verificationResult == PasswordVerificationResult.Failed)
            return Unauthorized("Неверный Email или пароль");

        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]);
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new Claim[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email)
            }),
            Expires = DateTime.UtcNow.AddHours(1),
            Issuer = _configuration["Jwt:Issuer"],
            Audience = _configuration["Jwt:Audience"],
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        var tokenString = tokenHandler.WriteToken(token);
        return Ok(new
        {
            Token = tokenString,
            User = new
            {
                user.Id,
                user.FirstName,
                user.LastName,
                user.Email,
                user.AvatarURL,
                user.About,
                user.CoverURL
            }
        });
    }
}

}

