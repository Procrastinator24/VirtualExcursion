using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using VirtualExcursion.BLL.DTO.Requests;
using VirtualExcursion.BLL.DTO.Responses;

namespace VirtualExcursion.BLL.services.interfaces
{
    public interface IUserService
    {
        Task<List<UserResponse>> Get();
        Task<UserResponse> GetById(int id);
        Task<UserResponse> GetByEmail(string email);
        Task<UserResponse> Create(CreateUserRequest request);
        Task<UserResponse> Update(UpdateUserRequest request);
        Task<bool> Delete(int id);
    }
}
