namespace Waveify.API.Contracts
{
    public class SetUserRoleRequest
    {
        public Guid UserId { get; set; }
        public string Role { get; set; }
    }
}
