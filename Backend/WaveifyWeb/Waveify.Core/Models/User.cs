using System;
using System.Collections.Generic;

namespace Waveify.Core.Models
{
    public class User
    {
        private User(Guid id, string userName, string email, string passwordHash, Guid? subscriptionId, DateTime? subscriptionStart, DateTime? subscriptionEnd)
        {
            Id = id;
            UserName = userName;
            Email = email;
            PasswordHash = passwordHash;
            SubscriptionId = subscriptionId;
            SubscriptionStart = subscriptionStart;
            SubscriptionEnd = subscriptionEnd;
         
        }
        public enum UserRole
        {
            User,       
            Artist,     
            Beatmaker,   
            Moderator,  
            Label 
        }


        public Guid Id { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public ICollection<Song> Songs { get; set; } = new List<Song>();

        public Guid? SubscriptionId { get; set; } // ID подписки, если есть
        public Subscription? Subscription { get; set; } // Навигационное свойство

        public DateTime? SubscriptionStart { get; set; } // Дата начала подписки
        public DateTime? SubscriptionEnd { get; set; } // Дата окончания подписки
        public EmailConfirmation EmailConfirmation { get; private set; } = default!;
        public UserRole Role { get; private set; } = UserRole.User;
        public void SetRole(UserRole role)
        {
            Role = role;
        }
        public static User Create(Guid id, string username, string email, string passwordHash) =>
           new(id, username, email, passwordHash, null, null, null)
           {
               // по умолчанию не подтвердён; токен выставит сервис регистрации
               EmailConfirmation = EmailConfirmation.CreatePending(tokenHash: "", expiresAtUtc: DateTime.UtcNow) // будет перезаписано
           };

        public static User CreateWithEmailPending(Guid id, string username, string email, string passwordHash,
                                                  string tokenHash, DateTime expiresAtUtc) =>
            new(id, username, email, passwordHash, null, null, null)
            {
                EmailConfirmation = EmailConfirmation.CreatePending(tokenHash, expiresAtUtc)
            };

        public void MarkEmailConfirmed()
       => EmailConfirmation = EmailConfirmation.CreateConfirmed();

        public void SetEmailConfirmationPending(string? tokenHash, DateTime? expiresAtUtc)
            => EmailConfirmation = EmailConfirmation.CreatePending(
                tokenHash ?? string.Empty,
                expiresAtUtc ?? DateTime.UtcNow
            );

        public void ConfirmEmail(string token) => EmailConfirmation.Confirm(token);


    }
}
