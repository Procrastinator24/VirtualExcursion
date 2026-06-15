using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace VirtualExcursion.BLL.DTO.Responses
{
    public class AuthResponse
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Token { get; set; }
        public DateTime TokenExpiresAt { get; set; }
        public string Role { get; set; } = "User";
        public bool HasGuideProfile { get; set; }
    }
}
