using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PetProjecAPI.DB;
using PetProjecAPI.Hubs;
using Microsoft.AspNetCore.SignalR;

namespace PetProjecAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FriendshipsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IHubContext<NotificationsHub> _hubContext;

        public FriendshipsController(AppDbContext context, IHubContext<NotificationsHub> hubContext)
        {
            _context = context;
            _hubContext = hubContext;
        }

        [HttpGet("{friendId}")]
        public async Task<ActionResult<IEnumerable<Friendship>>> GetFriendRequest(int friendId)
        {
            var requests = await _context.Friendships
                .Where(e => e.FriendId == friendId && e.Status == "pending")
                .ToListAsync();

            return Ok(requests);
        }

        [HttpGet("check")]
        public async Task<IActionResult> CheckFriendRequest([FromQuery] int senderId, [FromQuery] int receiverId)
        {
            var request = await _context.Friendships
                .FirstOrDefaultAsync(f => ((f.UserId == senderId && f.FriendId == receiverId)
                                           || (f.UserId == receiverId && f.FriendId == senderId))
                                           && (f.Status == "pending" || f.Status == "accepted"));
            return Ok(request);
        }

        [HttpPost("send")]
        public async Task<ActionResult> SendFriendRequest([FromBody] Friendship friendship)
        {
            if (friendship.UserId == friendship.FriendId)
                return BadRequest("Невозможно отправить запрос самому себе.");

            friendship.Status = "pending";
            friendship.CreatedAt = DateTime.UtcNow;

            _context.Friendships.Add(friendship);
            await _context.SaveChangesAsync();


            var notification = new
            {
                Id = friendship.Id,
                UserId = friendship.UserId,
                FriendId = friendship.FriendId,
                Message = "Новый запрос в друзья",
                CreatedAt = friendship.CreatedAt
            };

            // Отправляем уведомление всем подключенным клиентам через SignalR
            await _hubContext.Clients.User(friendship.FriendId.ToString())
                .SendAsync("ReceiveNotification", notification);

            return Ok(friendship);
        }

        [HttpPost("accept/{id}")]
        public async Task<ActionResult> AcceptFriendRequest(int id)
        {
            var friendship = await _context.Friendships.FindAsync(id);
            if (friendship == null)
                return NotFound();

            friendship.Status = "accepted";
            await _context.SaveChangesAsync();

            var notification = new
            {
                Id = friendship.Id,
                UserId = friendship.UserId,
                FrinedId = friendship.FriendId,
                Message = "Ваш запрос в друзья принят",
                CreatedAt = DateTime.UtcNow,
                Status = "accepted"
            };

            await _hubContext.Clients.User(friendship.UserId.ToString())
                .SendAsync("ReceiveNotification", notification);


            return Ok(friendship);
        }

        [HttpDelete("remove/{id}")]
        public async Task<ActionResult> RemoveFriendship(int id)
        {
            var friendship = await _context.Friendships.FindAsync(id);
            if (friendship == null)
                return NotFound();

            _context.Friendships.Remove(friendship);
            await _context.SaveChangesAsync();

            await _hubContext.Clients.All
                .SendAsync("ReceiveCancelNotification", new { Id = friendship.Id, Message = "Запрос в друзья отменен" });


            return NoContent();
        }
    }
}
