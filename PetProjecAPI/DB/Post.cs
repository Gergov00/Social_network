namespace PetProjecAPI.DB
{
    public class Post
    {
        public int Id { get; set; }
        public int UserId { get; set; }           // Автор поста
        public string Content { get; set; }       // Текст поста
        public string PhotoUrl { get; set; }      // Опционально, URL фото к посту
        public DateTime CreatedAt { get; set; }   // Дата создания
        public DateTime? UpdatedAt { get; set; }  // Дата обновления, если редактируется

        // Связь с пользователем (автором)
        public User? User { get; set; }
        // Навигационные свойства для комментариев и лайков
        public ICollection<Comment>? Comments { get; set; }
        public ICollection<PostLike>? PostLikes { get; set; }
    }
}
