namespace Domain.Entities
{
    public class PostLike
    {
        public int Id { get; set; }
        public int PostId { get; set; }           // Пост, которому поставлен лайк
        public int UserId { get; set; }           // Пользователь, поставивший лайк
        public DateTime CreatedAt { get; set; }   // Дата лайка

        public Post? Post { get; set; }
        public User? User { get; set; }
    }
}
