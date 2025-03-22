using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Data.Repositories
{
    public interface IUserRepository
    {
        Task<IEnumerable<User>> GetAllAsync();
        Task<User?> GetByIdAsync(int id);
        Task<User?> GetByEmailAsync(string email);
        Task AddAsync(User user);
        void Update(User user);
        void Delete(User user);
        Task<bool> SaveChangesAsync();
        Task<IEnumerable<User>> SearchAsync(string query);
    }

    public class UserRepository : IUserRepository
    {
        private readonly AppDbContext _context;
        public UserRepository(AppDbContext context)
        {
            _context = context;
        }
        public async Task<IEnumerable<User>> GetAllAsync() =>
            await _context.Users.ToListAsync();
        public async Task<User?> GetByIdAsync(int id) =>
            await _context.Users.FindAsync(id);
        public async Task<User?> GetByEmailAsync(string email) =>
            await _context.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == email.ToLower());
        public async Task AddAsync(User user) =>
            await _context.Users.AddAsync(user);
        public void Update(User user) =>
            _context.Users.Update(user);
        public void Delete(User user) =>
            _context.Users.Remove(user);
        public async Task<bool> SaveChangesAsync() =>
            await _context.SaveChangesAsync() > 0;
        public async Task<IEnumerable<User>> SearchAsync(string query)
        {
            if (string.IsNullOrWhiteSpace(query))
                return new List<User>();
            query = query.ToLower();
            return await _context.Users
                .Where(u => u.FirstName.ToLower().Contains(query) ||
                            (u.LastName != null && u.LastName.ToLower().Contains(query)))
                .ToListAsync();
        }
    }
}
