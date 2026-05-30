using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace VirtualExcursion.DAL.models
{
    public class GuideProfile
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string OrganizationName { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? LogoUrl { get; set; }
        public string? Website { get; set; }
        public string? ContactEmail { get; set; }
        public string? Phone { get; set; }
        public string? Address { get; set; }
        public bool IsOrganization { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public User User { get; set; } = null!;
        public ICollection<Scene> Scenes { get; set; } = new List<Scene>();
        public virtual ICollection<Excursion> Excursions { get; set; } = new List<Excursion>();

    }
}
