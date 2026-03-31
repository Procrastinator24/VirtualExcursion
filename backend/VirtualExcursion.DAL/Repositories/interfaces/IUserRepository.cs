using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using VirtualExcursion.DAL.models;

namespace VirtualExcursion.DAL.Repositories.interfaces
{
    public interface IUserRepository
    {
        Task<List<User>> GetUsers();
        Task<User> GetById(int id);
        Task<User> GetByEmail(string email);
        Task<bool> Delete(int id);
        Task<User> Create(User user);
        Task<User> Update(User user);
    }
}
