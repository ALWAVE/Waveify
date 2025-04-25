using System.ComponentModel.DataAnnotations;

namespace Waveify.API.Contracts
{
    public record RegisterUserRequest(
        [Required] string UserName,
        [Required] string Password,
        [Required] string Email);
    
}
