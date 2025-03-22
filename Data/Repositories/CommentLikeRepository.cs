using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Data.Repositories
{
    public interface ICommentLikeRepository
    {
        Task<IEnumerable<CommentLike>> GetAllAsync();
        Task<CommentLike?> GetByIdAsync(int id);
        Task<IEnumerable<CommentLike>> GetByCommentIdAsync(int commentId);
        Task AddAsync(CommentLike commentLike);
        void Update(CommentLike commentLike);
        void Delete(CommentLike commentLike);
        Task<bool> SaveChangesAsync();
    }

    public class CommentLikeRepository : ICommentLikeRepository
    {
        private readonly AppDbContext _context;
        public CommentLikeRepository(AppDbContext context)
        {
            _context = context;
        }
        public async Task<IEnumerable<CommentLike>> GetAllAsync() =>
            await _context.CommentLikes.ToListAsync();
        public async Task<CommentLike?> GetByIdAsync(int id) =>
            await _context.CommentLikes.FindAsync(id);
        public async Task<IEnumerable<CommentLike>> GetByCommentIdAsync(int commentId) =>
            await _context.CommentLikes.Where(cl => cl.CommentId == commentId).ToListAsync();
        public async Task AddAsync(CommentLike commentLike) =>
            await _context.CommentLikes.AddAsync(commentLike);
        public void Update(CommentLike commentLike) =>
            _context.CommentLikes.Update(commentLike);
        public void Delete(CommentLike commentLike) =>
            _context.CommentLikes.Remove(commentLike);
        public async Task<bool> SaveChangesAsync() =>
            await _context.SaveChangesAsync() > 0;
    }
}