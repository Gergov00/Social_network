using Microsoft.AspNetCore.SignalR;

public class NotificationService<THub> : INotificationService<THub> where THub : Hub
{
    private readonly IHubContext<THub> _hubContext;

    public NotificationService(IHubContext<THub> hubContext)
    {
        _hubContext = hubContext;
    }

    public async Task SendNotificationToUserAsync(string userId, string method, object message)
    {
        await _hubContext.Clients.User(userId).SendAsync(method, message);
    }
}