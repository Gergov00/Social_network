using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.SignalR;



namespace Infrastructure.SignalR;

public static class SignalRServiceCollectionExtensions
{
    public static IServiceCollection AddSignalRInfrastructure(this IServiceCollection services)
    {
        // Регистрируем SignalR и связанные с ним зависимости
        services.AddSignalR();
        services.AddSingleton<IUserIdProvider, NameUserIdProvider>();
        return services;
    }
}