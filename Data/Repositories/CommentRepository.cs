using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Data.Repositories
{
    public interface ICommentRepository
    {
        Task<IEnumerable<Comment>> GetAllAsync();
        Task<Comment?> GetByIdAsync(int id);
        Task<IEnumerable<Comment>> GetByPostIdAsync(int postId);
        Task AddAsync(Comment comment);
        void Update(Comment comment);
        void Delete(Comment comment);
    }

    public class CommentRepository : ICommentRepository
    {
        private readonly AppDbContext _context;
        public CommentRepository(AppDbContext context)
        {
            _context = context;
        }
        public async Task<IEnumerable<Comment>> GetAllAsync() =>
            await _context.Comments.ToListAsync();
        public async Task<Comment?> GetByIdAsync(int id) =>
            await _context.Comments.FindAsync(id);
        public async Task<IEnumerable<Comment>> GetByPostIdAsync(int postId) =>
            await _context.Comments.Where(c => c.PostId == postId).ToListAsync();
        public async Task AddAsync(Comment comment) =>
            await _context.Comments.AddAsync(comment);
        public void Update(Comment comment) =>
            _context.Comments.Update(comment);
        public void Delete(Comment comment) =>
            _context.Comments.Remove(comment);
  
    }
}