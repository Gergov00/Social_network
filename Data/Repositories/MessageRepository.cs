using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Data.Repositories
{
    public interface IMessageRepository
    {
        Task AddAsync(Message message);
        Task<IEnumerable<Message>> GetConversationAsync(int userId, int friendId);
        Task<IEnumerable<dynamic>> GetChatsAsync(int userId);
        Task<bool> SaveChangesAsync();
    }

    public class MessageRepository : IMessageRepository
    {
        private readonly AppDbContext _context;
        public MessageRepository(AppDbContext context)
        {
            _context = context;
        }
        public async Task AddAsync(Message message) =>
            await _context.Messages.AddAsync(message);
        public async Task<IEnumerable<Message>> GetConversationAsync(int userId, int friendId) =>
            await _context.Messages
                .Where(m => (m.SenderId == userId && m.ReceiverId == friendId) ||
                            (m.SenderId == friendId && m.ReceiverId == userId))
                .OrderBy(m => m.SentAt)
                .ToListAsync();
        public async Task<IEnumerable<dynamic>> GetChatsAsync(int userId) =>
            await _context.Messages
                .Where(m => m.SenderId == userId || m.ReceiverId == userId)
                .GroupBy(m => m.SenderId == userId ? m.ReceiverId : m.SenderId)
                .Select(g => new
                {
                    ChatWith = g.Key,
                    LastMessage = g.OrderByDescending(m => m.SentAt).FirstOrDefault()
                })
                .ToListAsync();
        public async Task<bool> SaveChangesAsync() =>
            await _context.SaveChangesAsync() > 0;
    }
}