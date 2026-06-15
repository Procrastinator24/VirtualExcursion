using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace VirtualExcursion.BLL.DTO.Requests
{
    public class RegisterRequest
    {
        public class RegisterWithCodeRequest
        {
            [Required]
            [EmailAddress]
            public string Email { get; set; } = string.Empty;

            [Required]
            [MinLength(4)]
            [MaxLength(4)]
            public string Code { get; set; } = string.Empty;

            [Required]
            [MinLength(2)]
            [MaxLength(100)]
            public string Name { get; set; } = string.Empty;

            //[Required]
            //[MinLength(2)]
            //[MaxLength(100)]
            //public string LastName { get; set; } = string.Empty;

            [Required]
            [MinLength(6)]
            public string Password { get; set; } = string.Empty;
        }
    }
}
