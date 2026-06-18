using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace VirtualExcursion.BLL.DTO.Requests
{
    public class UpdateUserRequest
    {
        public int Id { get; set; }  // ← обязательно добавить, чтобы знать, кого обновлять
        public string? Username { get; set; }
        public string? Email { get; set; }
        public string? AvatarUrl { get; set; }
        public bool? IsAdmin { get; set; }
    }
}
