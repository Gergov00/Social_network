using Microsoft.AspNetCore.SignalR;

namespace API.Providers
{
    public class NameUserIdProvider : IUserIdProvider
    {
        public string GetUserId(HubConnectionContext connection)
        {
            var id = connection.User?.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            Console.WriteLine($"Подключился пользователь с Id: {id}");
            return id;
        }

    }
}
