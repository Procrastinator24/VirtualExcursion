using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace VirtualExcursion.DAL.models
{
    public enum UserRole
    {
        User,      // обычный пользователь
        Guide,     // гид (может создавать экскурсии)
        Admin      // администратор
    }

    public class User
    {
        [Key]
        public int Id { get; set; }
        [Required]
        [MaxLength(100)]
        public string Username { get; set; } = string.Empty;
        [Required]
        [MaxLength(100)]
        public string Email { get; set; } = string.Empty;
        [Required]
        public string PasswordHash { get; set; } = string.Empty;
        public bool IsAdmin { get; set; } = false;

        [MaxLength(500)]
        public string? AvatarUrl {  get; set; }
        public string? RefreshToken { get; set; }
        public DateTime? RefreshTokenExpiry { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation
        public virtual ICollection<Favourite> Favourites { get; set; } = new List<Favourite>();

    }

}
