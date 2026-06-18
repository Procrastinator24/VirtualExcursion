using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace VirtualExcursion.DAL.models
{
    /// <summary>
    /// Рабочее пространство (объединяет личный профиль, команду, музей)
    /// </summary>
    public class Workspace
    {
        [Key]
        public int Id { get; set; }

        // Основная информация
        [Required]
        [MaxLength(200)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(1000)]
        public string? DescriptionShort { get; set; }
        //[MaxLength(2000)]
        //public string? DescriptionLong { get; set; }

        [MaxLength(500)]
        public string? LogoUrl { get; set; }

        [MaxLength(500)]
        public string? BannerUrl { get; set; }

        // Тип пространства (задел на будущее)
        //[MaxLength(50)]
        //public string Type { get; set; } = "personal";  // personal, team, museum, school

        // Контактная информация
        [MaxLength(200)]
        public string? Website { get; set; }

        [MaxLength(100)]
        public string? ContactEmail { get; set; }

        [MaxLength(50)]
        public string? Phone { get; set; }

        [MaxLength(300)]
        public string? Address { get; set; }
        [MaxLength(200)]
        public string? City { get; set; }

        // Данные для верификации (простые поля, пока без наследования)
        [MaxLength(200)]
        public string? Country { get; set; }
        // Данные для верификации (простые поля, пока без наследования)
        //[MaxLength(200)]
        //public string? LegalName { get; set; }           // Юридическое название (для организаций)

        //[MaxLength(20)]
        //public string? Inn { get; set; }                 // ИНН

        //[MaxLength(20)]
        //public string? Ogrn { get; set; }                // ОГРН / ОГРНИП

        //[MaxLength(20)]
        //public string? PassportSeries { get; set; }      // Серия паспорта (для физ. лиц)

        //[MaxLength(20)]
        //public string? PassportNumber { get; set; }      // Номер паспорта

        //[MaxLength(500)]
        //public string? RegistrationCertificateUrl { get; set; }  // Скан свидетельства о регистрации

        //[MaxLength(500)]
        //public string? TaxCertificateUrl { get; set; }           // Скан ИНН/свидетельства

        // Владелец
        public int OwnerId { get; set; }
        public virtual User Owner { get; set; } = null!;

        // Верификация
        public VerificationStatus VerificationStatus { get; set; } = VerificationStatus.NotSubmitted;
        public DateTime? VerifiedAt { get; set; }
        public int? VerifiedByUserId { get; set; }
        public virtual User? VerifiedBy { get; set; }
        [MaxLength(1000)]
        public string? RejectionReason { get; set; }

        // Метаданные
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        // Статистика (опционально, можно вычислять или хранить)
        //public int MembersCount { get; set; } = 1;
        //public int ExcursionsCount { get; set; } = 0;
        //public int ScenesCount { get; set; } = 0;

        // Настройки пространства
        public bool ShowContactInfo { get; set; }      
        public bool ShowExhibits { get; set; }  
        public bool ShowExcursions { get; set; }
        public bool ShowMe { get; set; }    
        public bool ShowSite { get; set; }

        // Навигация
        public virtual ICollection<WorkspaceMember> Members { get; set; } = new List<WorkspaceMember>();
        public virtual ICollection<Excursion> Excursions { get; set; } = new List<Excursion>();
        public virtual ICollection<Scene> Scenes { get; set; } = new List<Scene>();
    }

    public enum VerificationStatus
    {
        NotSubmitted,   // Заявка не подана
        Pending,        // На рассмотрении
        Approved,       // Одобрен
        Rejected        // Отклонён
    }
}
