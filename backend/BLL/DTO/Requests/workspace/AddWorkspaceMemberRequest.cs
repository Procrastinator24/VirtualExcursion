using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace VirtualExcursion.BLL.DTO.Requests.workspace
{
    public class AddWorkspaceMemberRequest
    {
        [Required]
        public int WorkspaceId { get; set; }

        [Required]
        public int UserId { get; set; }

        public string Role { get; set; } = "Editor";
    }
}
