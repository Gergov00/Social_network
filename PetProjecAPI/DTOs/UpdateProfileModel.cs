namespace PetProjecAPI.DTOs;

public class UpdateProfileModel
{
    public int UserId { get; set; }
    public string FirstName { get; set; }
    public string? LastName { get; set; }
    public IFormFile? Avatar { get; set; }
    public IFormFile? Cover { get; set; }
    public string? About { get; set; }
    public bool RemoveAvatar { get; set; }
    public bool RemoveCover { get; set; }

}