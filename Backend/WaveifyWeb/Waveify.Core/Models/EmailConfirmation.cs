using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Security.Cryptography;
namespace Waveify.Core.Models
{
    public class EmailConfirmation
    {
        public bool IsConfirmed { get; private set; }
        public string? TokenHash { get; private set; }
        public DateTime? ExpiresAtUtc { get; private set; }

        private EmailConfirmation() { }

        public static EmailConfirmation CreatePending(string tokenHash, DateTime expiresAtUtc) =>
            new EmailConfirmation { IsConfirmed = false, TokenHash = tokenHash, ExpiresAtUtc = expiresAtUtc };

        // ✨ ДОБАВЬ ЭТО
        public static EmailConfirmation CreateConfirmed() =>
            new EmailConfirmation { IsConfirmed = true, TokenHash = null, ExpiresAtUtc = null };

        public void Confirm(string token)
        {
            if (IsConfirmed) throw new InvalidOperationException("Already confirmed");
            if (ExpiresAtUtc is null || ExpiresAtUtc <= DateTime.UtcNow) throw new InvalidOperationException("Token expired");
            if (!string.Equals(TokenHash, ComputeSha256(token), StringComparison.Ordinal))
                throw new InvalidOperationException("Invalid token");

            IsConfirmed = true;
            TokenHash = null;
            ExpiresAtUtc = null;
        }

        public static string ComputeSha256(string s)
        {
            using var sha = SHA256.Create();
            return Convert.ToHexString(sha.ComputeHash(Encoding.UTF8.GetBytes(s)));
        }
    }
}
