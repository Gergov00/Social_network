using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Data.Repositories
{
    public interface IFriendshipRepository
    {
        Task<IEnumerable<Friendship>> GetFriendRequestsAsync(int friendId);
        Task<Friendship?> GetByIdAsync(int id);
        Task<Friendship?> GetFriendshipBetweenAsync(int userId, int friendId);
        Task AddAsync(Friendship friendship);
        void Update(Friendship friendship);
        void Delete(Friendship friendship);
        Task<IEnumerable<User>> GetFriendsAsync(int userId);
    }

    public class FriendshipRepository : IFriendshipRepository
    {
        private readonly AppDbContext _context;
        public FriendshipRepository(AppDbContext context)
        {
            _context = context;
        }
        public async Task<IEnumerable<Friendship>> GetFriendRequestsAsync(int friendId) =>
            await _context.Friendships.Where(f => f.FriendId == friendId && f.Status == "pending").ToListAsync();
        public async Task<Friendship?> GetByIdAsync(int id) =>
            await _context.Friendships.FindAsync(id);
        public async Task<Friendship?> GetFriendshipBetweenAsync(int userId, int friendId) =>
            await _context.Friendships.FirstOrDefaultAsync(f =>
                ((f.UserId == userId && f.FriendId == friendId) || (f.UserId == friendId && f.FriendId == userId)) &&
                (f.Status == "pending" || f.Status == "accepted"));
        public async Task AddAsync(Friendship friendship) =>
            await _context.Friendships.AddAsync(friendship);
        public void Update(Friendship friendship) =>
            _context.Friendships.Update(friendship);
        public void Delete(Friendship friendship) =>
            _context.Friendships.Remove(friendship);
 
        public async Task<IEnumerable<User>> GetFriendsAsync(int userId)
        {
            var friendships = await _context.Friendships
                .Where(f => (f.UserId == userId || f.FriendId == userId) && f.Status == "accepted")
                .ToListAsync();
            var friendIds = friendships.Select(f => f.UserId == userId ? f.FriendId : f.UserId).Distinct();
            return await _context.Users.Where(u => friendIds.Contains(u.Id)).ToListAsync();
        }
    }
}
