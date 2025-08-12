using System;
using System.Collections.Generic;
using AutoMapper;
using Waveify.Core.Models;
using Waveify.Persistence.Entities;

namespace Waveify.Persistence
{
    public class DataBaseMapping : Profile
    {
        public DataBaseMapping()
        {
            // ---------- USER ----------
            // Entity -> Domain
            CreateMap<UserEntity, User>()
                .ConstructUsing(src => User.Create(src.Id, src.UserName, src.Email, src.PasswordHash))
                .AfterMap((src, dest) =>
                {
                    dest.SetRole(ParseRole(src.Role));

                    if (src.EmailConfirmed)
                    {
                        dest.MarkEmailConfirmed(); // ✅ вместо присваивания свойства
                    }
                    else
                    {
                        dest.SetEmailConfirmationPending(
                            src.EmailConfirmationTokenHash,
                            src.EmailConfirmationExpiresUtc
                        ); // ✅ вместо присваивания свойства
                    }
                });

            CreateMap<User, UserEntity>()
                .ForMember(e => e.Role, opt => opt.MapFrom(d => d.Role.ToString()))
                .ForMember(e => e.EmailConfirmed, opt => opt.MapFrom(d => d.EmailConfirmation.IsConfirmed))
                .ForMember(e => e.EmailConfirmationTokenHash, opt => opt.MapFrom(d => d.EmailConfirmation.TokenHash))
                .ForMember(e => e.EmailConfirmationExpiresUtc, opt => opt.MapFrom(d => d.EmailConfirmation.ExpiresAtUtc));


            // Иногда удобно иметь прямую проекцию UserEntity -> Guid (Id)
            CreateMap<UserEntity, Guid>().ConvertUsing(src => src.Id);

            // ---------- SONG ----------
            // Убрал дубли — оставляем один раз.
            CreateMap<SongEntity, Song>()
                .ForMember(dest => dest.Tags, opt => opt.NullSubstitute(new List<Tag>()));

            CreateMap<Song, SongEntity>().ReverseMap();

            // ---------- SUBSCRIPTION ----------
            CreateMap<SubscribeEntity, Subscription>().ReverseMap();

            // ---------- REFRESH TOKEN ----------
            CreateMap<RefreshTokenEntity, RefreshToken>()
                .ForMember(d => d.Token, m => m.MapFrom(s => s.Token))
                .ForMember(d => d.UserId, m => m.MapFrom(s => s.UserId))
                .ForMember(d => d.Expires, m => m.MapFrom(s => s.Expires))
                .ForMember(d => d.IsRevoked, m => m.MapFrom(s => s.IsRevoked));

            CreateMap<RefreshToken, RefreshTokenEntity>()
                .ForMember(d => d.Token, m => m.MapFrom(s => s.Token))
                .ForMember(d => d.UserId, m => m.MapFrom(s => s.UserId))
                .ForMember(d => d.Expires, m => m.MapFrom(s => s.Expires))
                .ForMember(d => d.IsRevoked, m => m.MapFrom(s => s.IsRevoked));

            // ---------- PLAYLIST / REACTIONS / REPORTS ----------
            CreateMap<PlaylistEntity, Playlist>().ReverseMap();
            CreateMap<SongReactionEntity, SongReaction>();
            CreateMap<ReportSongEntity, ReportSong>();
            // Если Tag у тебя одна и та же модель для домена и персистенса — маппинг не нужен.
            // Если есть TagEntity — замени на CreateMap<TagEntity, Tag>().ReverseMap();
        }

        private static User.UserRole ParseRole(string? role)
        {
            return Enum.TryParse<User.UserRole>(role, out var parsedRole)
                ? parsedRole
                : User.UserRole.User;
        }
    }
}
