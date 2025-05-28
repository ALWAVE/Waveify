using System;
using System.Collections.Generic;
using Waveify.Core.Enums;
using Waveify.Core.Models;

namespace Waveify.Persistence.Entities
{
    public class SongEntity
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Author { get; set; } = string.Empty;
        public Guid UserId { get; set; } // Внешний ключ
        public UserEntity User { get; set; } = null!; // Навигационное свойство

        public TimeSpan Duration { get; set; }
        public DateTime CreatedAt { get; set; }
        public string Genre { get; set; } = string.Empty;
        public string Vibe { get; set; } = string.Empty;
        public int Like { get; set; }
        public int Dislike { get; set; }
        public int Plays { get; set; }
        public int Rating { get; set; }
        public string SongPath { get; set; } = string.Empty;
        public string ImagePath { get; set; } = string.Empty;
        public ICollection<TagEntity> Tags { get; set; } = new List<TagEntity>();
        public ICollection<PlaylistSongEntity> PlaylistSongs { get; set; }
        public ModerationStatus ModerationStatus { get; set; } = ModerationStatus.Pending;

    }

    public class BeatEntity : SongEntity
    {
        public int BPM { get; set; }
        public int Price { get; set; }
        public string TypeBeat { get; set; } = string.Empty;
    }

    public class TrackEntity : SongEntity
    {
        public int CountAuditions { get; set; }
        public int MusicBoost { get; set; }
    }
}
