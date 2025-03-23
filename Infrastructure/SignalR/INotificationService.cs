using Microsoft.AspNetCore.SignalR;

public interface INotificationService<THub> where THub : Hub
{
    Task SendNotificationToUserAsync(string userId, string method, object message);
}