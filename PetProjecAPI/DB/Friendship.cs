

using System.Text.Json.Serialization;

namespace PetProjecAPI.DB
{
    public class Friendship
    {
        public int Id { get; set; }
        public int UserId { get; set; }      
        public int FriendId { get; set; }    
        public DateTime? CreatedAt { get; set; }
        public string? Status { get; set; }



        [JsonIgnore]  
        public User? User { get; set; }
        [JsonIgnore]
        public User? Friend { get; set; }
    }
}
