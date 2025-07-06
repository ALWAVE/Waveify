using System.ComponentModel.DataAnnotations;

namespace Waveify.API.Contracts
{
    public record LoginUserRequest(
        [Required]string Email,
        [Required]string Password);
    
}
