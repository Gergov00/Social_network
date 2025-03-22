using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Data.Repositories
{
    public interface IUserPhotoRepository
    {
        Task<IEnumerable<UserPhoto>> GetPhotosByUserIdAsync(int userId);
        Task<UserPhoto?> GetByIdAsync(int id);
        Task AddAsync(UserPhoto userPhoto);
        void Update(UserPhoto userPhoto);
        void Delete(UserPhoto userPhoto);
    }

    public class UserPhotoRepository : IUserPhotoRepository
    {
        private readonly AppDbContext _context;
        public UserPhotoRepository(AppDbContext context)
        {
            _context = context;
        }
        public async Task<IEnumerable<UserPhoto>> GetPhotosByUserIdAsync(int userId) =>
            await _context.UserPhotos.Where(p => p.UserId == userId)
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();
        public async Task<UserPhoto?> GetByIdAsync(int id) =>
            await _context.UserPhotos.FindAsync(id);
        public async Task AddAsync(UserPhoto userPhoto) =>
            await _context.UserPhotos.AddAsync(userPhoto);
        public void Update(UserPhoto userPhoto) =>
            _context.UserPhotos.Update(userPhoto);
        public void Delete(UserPhoto userPhoto) =>
            _context.UserPhotos.Remove(userPhoto);
     
    }
}