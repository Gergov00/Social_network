using Microsoft.EntityFrameworkCore;
using Domain.Entities;

namespace Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
           : base(options)
        {
        }

        // DbSet для каждой сущности (таблицы)
        public DbSet<User> Users { get; set; }
        public DbSet<UserPhoto> UserPhotos { get; set; }
        public DbSet<Post> Posts { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<PostLike> PostLikes { get; set; }
        public DbSet<CommentLike> CommentLikes { get; set; }
        public DbSet<Friendship> Friendships { get; set; }
        public DbSet<Message> Messages { get; set; }

        // Конфигурация моделей и связей между таблицами
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Пользователь может иметь несколько постов
            modelBuilder.Entity<User>()
                .HasMany(u => u.Posts)
                .WithOne(p => p.User)
                .HasForeignKey(p => p.UserId);

            // Пользователь может иметь несколько фотографий
            modelBuilder.Entity<User>()
                .HasMany(u => u.UserPhotos)
                .WithOne(up => up.User)
                .HasForeignKey(up => up.UserId);

            // Пост может иметь несколько комментариев
            modelBuilder.Entity<Post>()
                .HasMany(p => p.Comments)
                .WithOne(c => c.Post)
                .HasForeignKey(c => c.PostId);

            // Пост может иметь несколько лайков
            modelBuilder.Entity<Post>()
                .HasMany(p => p.PostLikes)
                .WithOne(pl => pl.Post)
                .HasForeignKey(pl => pl.PostId);

            // Комментарий может иметь несколько лайков
            modelBuilder.Entity<Comment>()
                .HasMany(c => c.CommentLikes)
                .WithOne(cl => cl.Comment)
                .HasForeignKey(cl => cl.CommentId);

            // Настройка для Friendship
            modelBuilder.Entity<Friendship>()
                .HasOne(f => f.User)
                .WithMany(u => u.Friendships) // добавьте коллекцию в User (см. ниже)
                .HasForeignKey(f => f.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Friendship>()
                .HasOne(f => f.Friend)
                .WithMany()
                .HasForeignKey(f => f.FriendId)
                .OnDelete(DeleteBehavior.Restrict);

            // Настройка для Message
            modelBuilder.Entity<Message>()
                .HasOne(m => m.Sender)
                .WithMany(u => u.SentMessages) // добавьте коллекцию в User
                .HasForeignKey(m => m.SenderId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Message>()
                .HasOne(m => m.Receiver)
                .WithMany(u => u.ReceivedMessages) // добавьте коллекцию в User
                .HasForeignKey(m => m.ReceiverId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
