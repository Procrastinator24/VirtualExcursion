using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace VirtualExcursion.BLL.DTO.Requests.workspace
{
    public class UpdateWorkspaceRequest
    {
        [Required]
        public int Id { get; set; }

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
        public string? Type { get; set; }

        [MaxLength(200)]
        public string? Website { get; set; }

        [MaxLength(100)]
        public string? ContactEmail { get; set; }

        [MaxLength(50)]
        public string? Phone { get; set; }

        [MaxLength(300)]
        public string? Address { get; set; }

        // Настройки видимости
        public bool ShowContactInfo { get; set; }
        public bool ShowExhibits { get; set; }
        public bool ShowExcursions { get; set; }
        public bool ShowMe { get; set; }
        public bool ShowSite { get; set; }
    }
}
