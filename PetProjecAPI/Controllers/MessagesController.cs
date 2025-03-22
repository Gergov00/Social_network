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
    public class MessagesController : ControllerBase
    {
        private readonly IMessageRepository _messageRepository;
        private readonly IHubContext<ChatHub> _hubContext;
        private readonly IUnitOfWork _unitOfWorkl;
        

        public MessagesController(IMessageRepository messageRepository, IHubContext<ChatHub> hubContext, IUnitOfWork unitOfWorkl)
        {
            _messageRepository = messageRepository;
            _hubContext = hubContext;
            _unitOfWorkl = unitOfWorkl;
        }

        [HttpPost("send")]
        public async Task<IActionResult> SendMessage([FromBody] Message message)
        {
            message.SentAt = DateTime.UtcNow;
            await _messageRepository.AddAsync(message);
            await _unitOfWorkl.SaveChangesAsync();
            await _hubContext.Clients.User(message.ReceiverId.ToString())
                .SendAsync("ReceiveMessage", message);
            return Ok(message);
        }

        [HttpGet("conversation")]
        public async Task<IActionResult> GetConversation(int userId, int friendId)
        {
            var messages = await _messageRepository.GetConversationAsync(userId, friendId);
            return Ok(messages);
        }

        [HttpGet("chats")]
        public async Task<IActionResult> GetChats(int userId)
        {
            var chats = await _messageRepository.GetChatsAsync(userId);
            return Ok(chats);
        }
    }

}
