using Microsoft.AspNetCore.SignalR;

namespace Infrastructure.SignalR
{
    public class ChatHub: Hub
    {
        public async Task SendMessage(object message)
        {
            await Clients.All.SendAsync("ReceiveMessage", message);
        }
    }
}
