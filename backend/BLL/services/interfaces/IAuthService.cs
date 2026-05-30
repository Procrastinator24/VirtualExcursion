using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using VirtualExcursion.BLL.DTO.Requests;
using VirtualExcursion.BLL.DTO.Responses;
using static VirtualExcursion.BLL.DTO.Requests.RegisterRequest;

namespace VirtualExcursion.BLL.services.interfaces
{
    public interface IAuthService
    {
        Task SendVerificationCodeAsync(string email);
        Task VerifyCodeAsync(string email, string code);
        Task<AuthResponse> RegisterWithCodeAsync(RegisterWithCodeRequest request);
        Task<AuthResponse> LoginAsync(LoginRequest request);
        Task<UserResponse> GetCurrentUserAsync(int userId);
    }
}
