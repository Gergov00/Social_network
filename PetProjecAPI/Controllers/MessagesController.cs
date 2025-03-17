using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using PetProjecAPI.DB;
using PetProjecAPI.Hubs;

namespace PetProjecAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MessagesController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IHubContext<ChatHub> _hubContext;

        public MessagesController(AppDbContext context, IHubContext<ChatHub> hubContext)
        {
            _context = context;
            _hubContext = hubContext;
        }

        [HttpPost("send")]
        public async Task<IActionResult> SendMessage([FromBody] Message message)
        {
            message.SentAt = DateTime.UtcNow;
            _context.Messages.Add(message);
            await _context.SaveChangesAsync();
            Console.WriteLine($"Отправка уведомления пользователю {message.ReceiverId}");

            await _hubContext.Clients.User(message.ReceiverId.ToString())
                .SendAsync("ReceiveMessage", message);

            return Ok(message);
        }

        [HttpGet("conversation")]
        public async Task<IActionResult> GetConversation(int userId, int friendId)
        {
            var messages = await _context.Messages
                .Where(m => (m.SenderId == userId && m.ReceiverId == friendId) ||
                            (m.SenderId == friendId && m.ReceiverId == userId))
                .OrderBy(m => m.SentAt)
                .ToListAsync();
            return Ok(messages);
        }

        [HttpGet("chats")]
        public async Task<IActionResult> GetChats(int userId)
        {
            // Выбираем все сообщения, где пользователь является либо отправителем, либо получателем.
            var chats = await _context.Messages
                .Where(m => m.SenderId == userId || m.ReceiverId == userId)
                // Группируем по идентификатору собеседника (если пользователь является отправителем – собеседник = ReceiverId, иначе – SenderId)
                .GroupBy(m => m.SenderId == userId ? m.ReceiverId : m.SenderId)
                .Select(g => new
                {
                    ChatWith = g.Key,
                    LastMessage = g.OrderByDescending(m => m.SentAt).FirstOrDefault()
                })
                .ToListAsync();

            return Ok(chats);
        }
    }
}
