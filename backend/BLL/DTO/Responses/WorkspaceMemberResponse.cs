using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace VirtualExcursion.BLL.DTO.Responses
{
    public class WorkspaceMemberResponse
    {
        public int WorkspaceId { get; set; }
        public int UserId { get; set; }
        public string UserName { get; set; } = string.Empty;
        public string UserEmail { get; set; } = string.Empty;
        public string? UserAvatarUrl { get; set; }
        public string Role { get; set; } = "Editor";
        public DateTime JoinedAt { get; set; }
        public int? InvitedById { get; set; }
        public string? InvitedByName { get; set; }
        public string? InvitationStatus { get; set; }
    }
}
