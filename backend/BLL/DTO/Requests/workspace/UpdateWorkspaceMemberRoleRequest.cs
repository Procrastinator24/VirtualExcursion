using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace VirtualExcursion.BLL.DTO.Requests.workspace
{
    public class UpdateWorkspaceMemberRoleRequest
    {
        [Required]
        public int WorkspaceId { get; set; }

        [Required]
        public int UserId { get; set; }

        [Required]
        public string Role { get; set; } = string.Empty;
    }
}
