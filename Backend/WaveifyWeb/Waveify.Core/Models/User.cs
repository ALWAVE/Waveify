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
     
        public UserRole Role { get; private set; } = UserRole.User;
        public void SetRole(UserRole role)
        {
            Role = role;
        }
        public static User Create(Guid id, string username, string email, string passwordHash)
        {
            return new User(id, username, email, passwordHash, null, null, null);
        }
    }
}
