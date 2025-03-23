using Microsoft.AspNetCore.SignalR;

namespace API.Hubs
{
    public class ChatHub: Hub
    {
        public async Task SendMessage(object message)
        {
            // Рассылаем сообщение всем подключенным клиентам
            await Clients.All.SendAsync("ReceiveMessage", message);
        }
    }
}
