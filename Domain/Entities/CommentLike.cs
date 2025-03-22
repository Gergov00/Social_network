namespace Domain.Entities
{
    public class CommentLike
    {
        public int Id { get; set; }
        public int CommentId { get; set; }        // Комментарий, которому поставлен лайк
        public int UserId { get; set; }           // Пользователь, поставивший лайк
        public DateTime CreatedAt { get; set; }   // Дата лайка

        public Comment? Comment { get; set; }
        public User? User { get; set; }
    }
}
