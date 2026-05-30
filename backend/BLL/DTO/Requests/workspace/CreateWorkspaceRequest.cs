using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace VirtualExcursion.BLL.DTO.Requests.workspace
{
    public class CreateWorkspaceRequest
    {
        [Required(ErrorMessage = "Название обязательно")]
        [MaxLength(200)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(1000)]
        public string? DescriptionShort { get; set; }

        [MaxLength(2000)]
        public string? DescriptionLong { get; set; }

        [MaxLength(500)]
        public string? LogoUrl { get; set; }

        [MaxLength(50)]
        public string? Type { get; set; } = "personal";

        [MaxLength(200)]
        public string? Website { get; set; }

        [MaxLength(100)]
        public string? ContactEmail { get; set; }

        [MaxLength(50)]
        public string? Phone { get; set; }

        [MaxLength(300)]
        public string? Address { get; set; }

        // Настройки видимости
        public bool ShowContactInfo { get; set; } = true;
        public bool ShowExhibits { get; set; } = true;
        public bool ShowExcursions { get; set; } = true;
        public bool ShowMe { get; set; } = true;
        public bool ShowSite { get; set; } = true;
    }
}
