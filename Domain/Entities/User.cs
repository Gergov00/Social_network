﻿namespace Domain.Entities
{
    public class User
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string? LastName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string AvatarURL { get; set; }
        public string? About { get; set; }         
        public string? CoverURL { get; set; }

        public ICollection<Post>? Posts { get; set; }
        public ICollection<UserPhoto>? UserPhotos { get; set; }
        public ICollection<Comment>? Comments { get; set; }
        public ICollection<PostLike>? PostLikes { get; set; }
        public ICollection<CommentLike>? CommentLikes { get; set; }
        public ICollection<Friendship>? Friendships { get; set; }
        public ICollection<Message>? SentMessages { get; set; }
        public ICollection<Message>? ReceivedMessages { get; set; }
    }
}
