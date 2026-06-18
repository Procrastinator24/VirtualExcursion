using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace VirtualExcursion.BLL.DTO.Responses
{
    public class WorkspaceResponse
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? DescriptionShort { get; set; }
        //public string? DescriptionLong { get; set; }
        public string? LogoUrl { get; set; }
        public string? bannerUrl { get; set; }
        //public string Type { get; set; } = "personal";
        public string? Website { get; set; }
        public string? ContactEmail { get; set; }
        public string? Phone { get; set; }
        public string? Address { get; set; }

        // Юридическая информация (для верификации)
        //public string? LegalName { get; set; }
        //public string? Inn { get; set; }
        //public string? Ogrn { get; set; }

        // Настройки видимости
        public bool ShowContactInfo { get; set; }
        public bool ShowExhibits { get; set; }
        public bool ShowExcursions { get; set; }
        public bool ShowMe { get; set; }
        public bool ShowSite { get; set; }

        // Владелец
        public int OwnerId { get; set; }
        public string OwnerName { get; set; } = string.Empty;

        // Верификация
        public string VerificationStatus { get; set; } = "NotSubmitted";
        public DateTime? VerifiedAt { get; set; }
        public string? RejectionReason { get; set; }

        // Метаданные
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        // Статистика
        public int MembersCount { get; set; }
        public int ExcursionsCount { get; set; }
        public int ScenesCount { get; set; }
    }
}
