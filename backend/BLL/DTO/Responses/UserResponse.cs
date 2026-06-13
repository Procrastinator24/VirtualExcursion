using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using VirtualExcursion.DAL.models;

namespace VirtualExcursion.BLL.DTO.Responses
{
    public class UserResponse
    {
        public string Email { get; set; }
        public string Username { get; set; } 
        //public string PasswordHash { get; set; }
        public string IsAdmin { get; set; }
        public string AvatarUrl { get; set; }
        //public GuideProfile GuideProfile { get; set; }
    }
}
