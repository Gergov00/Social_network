using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Data.Repositories
{
    public interface IPostLikeRepository
    {
        Task<IEnumerable<PostLike>> GetAllAsync();
        Task<PostLike?> GetByIdAsync(int id);
        Task<IEnumerable<PostLike>> GetByPostIdAsync(int postId);
        Task AddAsync(PostLike postLike);
        void Update(PostLike postLike);
        void Delete(PostLike postLike);
    }

    public class PostLikeRepository : IPostLikeRepository
    {
        private readonly AppDbContext _context;
        public PostLikeRepository(AppDbContext context)
        {
            _context = context;
        }
        public async Task<IEnumerable<PostLike>> GetAllAsync() =>
            await _context.PostLikes.ToListAsync();
        public async Task<PostLike?> GetByIdAsync(int id) =>
            await _context.PostLikes.FindAsync(id);
        public async Task<IEnumerable<PostLike>> GetByPostIdAsync(int postId) =>
            await _context.PostLikes.Where(pl => pl.PostId == postId).ToListAsync();
        public async Task AddAsync(PostLike postLike) =>
            await _context.PostLikes.AddAsync(postLike);
        public void Update(PostLike postLike) =>
            _context.PostLikes.Update(postLike);
        public void Delete(PostLike postLike) =>
            _context.PostLikes.Remove(postLike);
    
    }
}