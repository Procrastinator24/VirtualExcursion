using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace VirtualExcursion.BLL.DTO.Responses
{
    public class GuideProfileResponse
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string UserName { get; set; } // имя пользователя (из связанного User)
        public string UserEmail { get; set; } // email пользователя
        public string OrganizationName { get; set; }
        public string? Description { get; set; }
        public string? LogoUrl { get; set; }
        public string? Website { get; set; }
        public string? ContactEmail { get; set; }
        public string? Phone { get; set; }
        public string? Address { get; set; }
        public bool IsOrganization { get; set; }
        public DateTime CreatedAt { get; set; }
        public int ScenesCount { get; set; } // количество сцен у гида
    }
}
