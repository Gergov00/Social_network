using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PetProjecAPI.DB;

namespace PetProjecAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MessagesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public MessagesController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("send")]
        public async Task<IActionResult> SendMessage([FromBody] Message message)
        {
            message.SentAt = DateTime.UtcNow;
            _context.Messages.Add(message);
            await _context.SaveChangesAsync();
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
    }
}
