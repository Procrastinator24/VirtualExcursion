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
        public string UserName { get; set; } = string.Empty;
        public string UserEmail { get; set; } = string.Empty;

        // GuideProfile поля
        public string OrganizationName { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? LogoUrl { get; set; }
        public string? Website { get; set; }
        public string? ContactEmail { get; set; }
        public string? Phone { get; set; }
        public string? Address { get; set; }
        public bool IsOrganization { get; set; }
        public DateTime CreatedAt { get; set; }

        // Дополнительные поля
        public int ScenesCount { get; set; }
        public int? Rating { get; set; }  // пока null, потом добавишь логику
        public int ExcursionsCount { get; set; }  // количество экскурсий гида
    }
}
