using Waveify.Core.Models;

namespace Waveify.Interface.Auth;

public interface IJwtProvider
{
    string GenerateToken(User user);
} 