using Data;
using Microsoft.AspNetCore.Mvc;
using Data.Repositories;
using Domain.Entities;
using PetProjecAPI.Hubs;
using Microsoft.AspNetCore.SignalR;


namespace PetProjecAPI.Controllers
{
    [Route("api/[controller]")]
[ApiController]
public class FriendshipsController : ControllerBase
{
    private readonly IFriendshipRepository _friendshipRepository;
    private readonly IHubContext<NotificationsHub> _hubContext;
    private readonly IUnitOfWork _unitOfWorkl;

    public FriendshipsController(IUnitOfWork unitOfWork, IFriendshipRepository friendshipRepository, IHubContext<NotificationsHub> hubContext)
    {
        _unitOfWorkl = unitOfWork;
        _friendshipRepository = friendshipRepository;
        _hubContext = hubContext;
    }

    [HttpGet("{friendId}")]
    public async Task<ActionResult<IEnumerable<Friendship>>> GetFriendRequest(int friendId)
    {
        var requests = await _friendshipRepository.GetFriendRequestsAsync(friendId);
        return Ok(requests);
    }

    [HttpGet("check")]
    public async Task<IActionResult> CheckFriendRequest([FromQuery] int senderId, [FromQuery] int receiverId)
    {
        var friendship = await _friendshipRepository.GetFriendshipBetweenAsync(senderId, receiverId);
        return Ok(friendship);
    }

    [HttpPost("send")]
    public async Task<ActionResult> SendFriendRequest([FromBody] Friendship friendship)
    {
        if (friendship.UserId == friendship.FriendId)
            return BadRequest("Невозможно отправить запрос самому себе.");

        friendship.Status = "pending";
        friendship.CreatedAt = DateTime.UtcNow;
        await _friendshipRepository.AddAsync(friendship);
        await _unitOfWorkl.SaveChangesAsync();

        var notification = new
        {
            Id = friendship.Id,
            UserId = friendship.UserId,
            FriendId = friendship.FriendId,
            Message = "Новый запрос в друзья",
            CreatedAt = friendship.CreatedAt
        };

        await _hubContext.Clients.User(friendship.FriendId.ToString())
            .SendAsync("ReceiveNotification", notification);

        return Ok(friendship);
    }

    [HttpPost("accept/{id}")]
    public async Task<ActionResult> AcceptFriendRequest(int id)
    {
        var friendship = await _friendshipRepository.GetByIdAsync(id);
        if (friendship == null) return NotFound();

        friendship.Status = "accepted";
        await _unitOfWorkl.SaveChangesAsync();

        var notification = new
        {
            Id = friendship.Id,
            UserId = friendship.UserId,
            FriendId = friendship.FriendId,
            Message = "Ваш запрос в друзья принят",
            CreatedAt = DateTime.UtcNow,
            Status = "accepted"
        };

        var notification2 = new
        {
            Id = friendship.Id,
            UserId = friendship.UserId,
            FriendId = friendship.FriendId,
            Message = "Вы приняли запрос в друзья",
            CreatedAt = DateTime.UtcNow,
            Status = "accepted"
        };

        await _hubContext.Clients.User(friendship.UserId.ToString())
            .SendAsync("ReceiveNotification", notification);
        await _hubContext.Clients.User(friendship.FriendId.ToString())
            .SendAsync("ReceiveNotification", notification2);

        return Ok(friendship);
    }

    [HttpDelete("remove/{id}")]
    public async Task<ActionResult> RemoveFriendship(int id)
    {
        var friendship = await _friendshipRepository.GetByIdAsync(id);
        if (friendship == null) return NotFound();

        _friendshipRepository.Delete(friendship);
        await _unitOfWorkl.SaveChangesAsync();

        await _hubContext.Clients.User(friendship.FriendId.ToString())
            .SendAsync("ReceiveCancelNotification", new { Id = friendship.Id, Message = "Запрос в друзья отменен" });

        return NoContent();
    }

    [HttpGet("friends")]
    public async Task<ActionResult<IEnumerable<User>>> GetFriends([FromQuery] int userId)
    {
        var friends = await _friendshipRepository.GetFriendsAsync(userId);
        return Ok(friends);
    }
}

}
