using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using VirtualExcursion.BLL.DTO.Requests.workspace;
using VirtualExcursion.BLL.DTO.Responses;
using VirtualExcursion.DAL.models;

namespace VirtualExcursion.BLL.DTO.mappings
{
    public class WorkspaceMemberProfile : Profile
    {
        public WorkspaceMemberProfile()
        {
            // Request → Entity
            CreateMap<AddWorkspaceMemberRequest, WorkspaceMember>();

            // Entity → Response
            CreateMap<WorkspaceMember, WorkspaceMemberResponse>()
                .ForMember(dest => dest.UserName,
                    opt => opt.MapFrom(src => src.User != null ? src.User.Username : null))
                .ForMember(dest => dest.UserEmail,
                    opt => opt.MapFrom(src => src.User != null ? src.User.Email : null))
                .ForMember(dest => dest.InvitedByName,
                    opt => opt.MapFrom(src => src.InvitedBy != null ? src.InvitedBy.Username : null))
                .ForMember(dest => dest.Role,
                    opt => opt.MapFrom(src => src.Role.ToString()))
                .ForMember(dest => dest.InvitationStatus,
                    opt => opt.MapFrom(src => src.InvitationStatus.HasValue ? src.InvitationStatus.Value.ToString() : null));
        }
    }
}
