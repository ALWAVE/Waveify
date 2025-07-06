using System;
using AutoMapper;
using Waveify.Core.Models;
using Waveify.Persistence.Entities;
using Waveify.Core.Enums;
namespace Waveify.Persistence
{
    public class DataBaseMapping : Profile
    {
        public DataBaseMapping()
        {
            // Настройка маппинга между сущностями и моделями
            CreateMap<UserEntity, User>(); // Пример маппинга для UserEntity и User

            // Настройка маппинга для SongEntity -> Song
            CreateMap<SongEntity, Song>()
                
                  .ForMember(dest => dest.Tags, opt => opt.NullSubstitute(new List<Tag>()));
            CreateMap<SongEntity, Song>()
                .ForCtorParam("user", opt => opt.MapFrom(src => src.User));

            // Настройка маппинга для UserEntity -> Guid
            CreateMap<UserEntity, Guid>()
                .ConvertUsing(src => src.Id);
            CreateMap<User, UserEntity>()
                .ForMember(dest => dest.Role, opt => opt.MapFrom(src => src.Role.ToString()));

            

            CreateMap<User, UserEntity>()
                .ForMember(dest => dest.Role, opt => opt.MapFrom(src => src.Role.ToString()));

            CreateMap<Subscription, SubscribeEntity>().ReverseMap();
            CreateMap<Tag, Tag>();
            CreateMap<LikedSong, LikedSongEntity>();
            CreateMap<RefreshToken, RefreshTokenEntity>();
            CreateMap<Playlist, PlaylistEntity>().ReverseMap();
            CreateMap<PlaylistEntity, Playlist>().ReverseMap();
            CreateMap<SongEntity, Song>();
            CreateMap<SongReactionEntity, SongReaction>();
            CreateMap<ReportSongEntity, ReportSong>();
            CreateMap<SongEntity, Song>()
               .ForCtorParam("user", opt => opt.MapFrom(src => src.User))
               .ForMember(dest => dest.Tags, opt => opt.NullSubstitute(new List<Tag>()));


            CreateMap<Song, SongEntity>()
           .ReverseMap();
        
        }
        private static User.UserRole ParseRole(string? role)
        {
            return Enum.TryParse<User.UserRole>(role, out var parsedRole)
                ? parsedRole
                : User.UserRole.User;
        }

    }
}
