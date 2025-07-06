
namespace Waveify.Application.Auth;

public interface IPasswordHash
{
    string Generate(string password);
    bool Verify(string password, string hashedPassword);
}