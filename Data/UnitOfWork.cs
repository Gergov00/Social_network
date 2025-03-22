using Microsoft.EntityFrameworkCore;
 // пространство имён, где находится AppDbContext
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace Data
{
    public interface IUnitOfWork
    {
        Task<bool> SaveChangesAsync();
    }

    public class UnitOfWork : IUnitOfWork
    {
        private readonly AppDbContext _context;
        public UnitOfWork(AppDbContext context)
        {
            _context = context;
        }
        
        public async Task<bool> SaveChangesAsync()
        {
            try
            {
                return await _context.SaveChangesAsync() > 0;
            }
            catch (DbUpdateConcurrencyException ex)
            {
                // Логирование ошибки или дополнительная обработка
                // Можно выбросить собственное исключение для обработки выше
                throw new ConcurrencyException("Ошибка параллельного обновления данных. Попробуйте повторить операцию.", ex);
            }
        }
    }

    // Можно создать собственное исключение для удобства обработки
    public class ConcurrencyException : Exception
    {
        public ConcurrencyException(string message, Exception innerException)
            : base(message, innerException)
        {
        }
    }
}