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
    public class WorkspaceProfile : Profile
    {
        public WorkspaceProfile()
        {
            // Request → Entity
            CreateMap<CreateWorkspaceRequest, Workspace>();
            CreateMap<UpdateWorkspaceRequest, Workspace>();

            // Entity → Response
            CreateMap<Workspace, WorkspaceResponse>()
                .ForMember(dest => dest.OwnerName,
                    opt => opt.MapFrom(src => src.Owner != null ? src.Owner.Username : null))
                .ForMember(dest => dest.VerificationStatus,
                    opt => opt.MapFrom(src => src.VerificationStatus.ToString()))
                .ForMember(dest => dest.MembersCount,
                    opt => opt.MapFrom(src => src.Members != null ? src.Members.Count : 0))
                .ForMember(dest => dest.ExcursionsCount,
                    opt => opt.MapFrom(src => src.Excursions != null ? src.Excursions.Count : 0))
                .ForMember(dest => dest.ScenesCount,
                    opt => opt.MapFrom(src => src.Scenes != null ? src.Scenes.Count : 0));
        }
    }
}
