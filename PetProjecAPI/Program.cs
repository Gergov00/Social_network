using PetProjecAPI.DB;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// ���������� ������ ����������� (��������������, ��� ��� ���������� � appsettings.json)
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// ��������� CORS � ����������� ��������. �������� URL �� ����� ������ �������.
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

// ��������� �������� CORS �� �����������
app.UseCors("AllowClientOrigin");

app.UseAuthorization();

app.MapControllers();

app.Run();
