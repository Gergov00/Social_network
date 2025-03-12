

namespace PetProjecAPI.DB
{
    public class Friendship
    {
        public int Id { get; set; }
        public int UserId { get; set; }      
        public int FriendId { get; set; }    
        public DateTime? CreatedAt { get; set; }
        public string? Status { get; set; }  



        public User? User { get; set; }
        public User? Friend { get; set; }
    }
}
