using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Data.Repositories
{
    public interface IPostRepository
    {
        Task<IEnumerable<Post>> GetAllAsync();
        Task<IEnumerable<Post>> GetByUserIdAsync(int userId);
        Task<Post?> GetByIdAsync(int id);
        Task AddAsync(Post post);
        void Update(Post post);
        void Delete(Post post);
        Task<bool> SaveChangesAsync();
    }

    public class PostRepository : IPostRepository
    {
        private readonly AppDbContext _context;
        public PostRepository(AppDbContext context)
        {
            _context = context;
        }
        public async Task<IEnumerable<Post>> GetAllAsync() =>
            await _context.Posts.ToListAsync();
        public async Task<IEnumerable<Post>> GetByUserIdAsync(int userId) =>
           await _context.Posts
                .Where(p => p.UserId == userId)
                .ToListAsync();
        public async Task<Post?> GetByIdAsync(int id) =>
            await _context.Posts.FindAsync(id);
        public async Task AddAsync(Post post) =>
            await _context.Posts.AddAsync(post);
        public void Update(Post post) =>
            _context.Posts.Update(post);
        public void Delete(Post post) =>
            _context.Posts.Remove(post);
        public async Task<bool> SaveChangesAsync() =>
            await _context.SaveChangesAsync() > 0;
    }
}