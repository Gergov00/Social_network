using PetProjecAPI.DB;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Добавление строки подключения (предполагается, что она определена в appsettings.json)
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Добавляем CORS и настраиваем политику. Замените URL на адрес вашего клиента.
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowClientOrigin", policy =>
    {
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();

// Применяем политику CORS до авторизации
app.UseCors("AllowClientOrigin");

app.UseAuthorization();

app.MapControllers();

app.Run();
