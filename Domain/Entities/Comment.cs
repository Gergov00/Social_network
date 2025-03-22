namespace Domain.Entities
{
    public class Comment
    {
        public int Id { get; set; }
        public int PostId { get; set; }           // Пост, к которому относится комментарий
        public int UserId { get; set; }           // Автор комментария
        public string Text { get; set; }          // Текст комментария
        public DateTime CreatedAt { get; set; }   // Дата создания

        // Связи
        public Post? Post { get; set; }
        public User? User { get; set; }
        public ICollection<CommentLike>? CommentLikes { get; set; }
    }
}
