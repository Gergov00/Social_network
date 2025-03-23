using Data;
using Microsoft.AspNetCore.Mvc;
using Data.Repositories;
using Domain.Entities;
using Infrastructure.SignalR;


namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MessagesController : ControllerBase
    {
        private readonly IMessageRepository _messageRepository;
        private readonly INotificationService<ChatHub> _notificationService;
        private readonly IUnitOfWork _unitOfWorkl;
        

        public MessagesController(IMessageRepository messageRepository, INotificationService<ChatHub> notificationService, IUnitOfWork unitOfWorkl)
        {
            _messageRepository = messageRepository;
            _notificationService = notificationService;
            _unitOfWorkl = unitOfWorkl;
        }

        [HttpPost("send")]
        public async Task<IActionResult> SendMessage([FromBody] Message message)
        {
            message.SentAt = DateTime.UtcNow;
            await _messageRepository.AddAsync(message);
            await _unitOfWorkl.SaveChangesAsync();
            await _notificationService.SendNotificationToUserAsync(
                message.ReceiverId.ToString(),
                "ReceiveMessage", 
                message);
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
