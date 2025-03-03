namespace PetProjecAPI.DB
{
    public class UserPhoto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string PhotoURL { get; set; }
        public DateTime CreatedAt { get; set; }

        public User? User { get; set; }
    }
}
