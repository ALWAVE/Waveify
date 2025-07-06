using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Waveify.Core.Enums;

namespace Waveify.Core.Models
{
    public class Song
    {
        public Song() { }
        public const int MAX_TITLE_LENGTH = 100;

        protected Song(Guid id, string title, string author, Guid user, TimeSpan duration, DateTime createdAt, string genre,
                     ICollection<Tag> tags, string vibe, int like, int dislike,int plays, string songPath, string imagePath)
        {
            Id = id;
            Title = title;
            Author = author;
            UserID = user;
            Duration = duration;
            CreatedAt = createdAt;
            Genre = genre;
            Tags = tags ?? new List<Tag>();
            Vibe = vibe;
            Like = like;
            Dislike = dislike;
            Plays = plays;
            SongPath = songPath;
            ImagePath = imagePath;
        }

        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Author { get; set; } = string.Empty;
        public Guid UserID { get; set; }
        public TimeSpan Duration { get; set; }
        public DateTime CreatedAt { get; set; }
        public string Genre { get; set; } = string.Empty;
        public ICollection<Tag> Tags { get; set; } = new List<Tag>();
        public string Vibe { get; set; } = string.Empty;
        public int Like { get; set; }
        public int Dislike { get; set; }  // Добавляем поле для дизлайков
        public int Plays { get; set; }
        public string SongPath { get; set; } = string.Empty;
        public string ImagePath { get; set; } = string.Empty;
        public ModerationStatus ModerationStatus { get; set; } = ModerationStatus.Pending;

        public static (Song Song, string Error) Create(Guid id, string title, string author, Guid user, TimeSpan duration,
                                                     DateTime createdAt, string genre, ICollection<Tag> tags,
                                                     string vibe, int like, int dislike, int plays, string songPath, string imagePath)
        {
            var error = string.Empty;
            if (string.IsNullOrEmpty(title) || title.Length > MAX_TITLE_LENGTH)
            {
                error = "Title cannot be empty or exceed 100 characters.";
            }

            tags = tags ?? new List<Tag>();
            vibe = vibe ?? string.Empty;
            songPath = songPath ?? string.Empty;
            imagePath = imagePath ?? string.Empty;

            var song = new Song(id, title, author, user, duration, createdAt, genre, tags, vibe, like, dislike, plays ,songPath, imagePath);
            return (song, error);
        }
    }
}