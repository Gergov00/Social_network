using PetProjecAPI.DB;
using Microsoft.EntityFrameworkCore;
using PetProjecAPI.Hubs;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowClientOrigin", policy =>
    {
        policy.WithOrigins("http://www.gergovzaurbek.online", "http://gergovzaurbek.online", "http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddSignalR();

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();

app.UseCors("AllowClientOrigin");

app.UseStaticFiles();

app.UseAuthorization();

app.MapControllers();

app.MapHub<NotificationsHub>("/notificationsHub");

app.Run();
