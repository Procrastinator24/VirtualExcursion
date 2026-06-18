using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using VirtualExcursion.DAL.Repositories.interfaces;
using System.Threading.Tasks;
using VirtualExcursion.DAL.models;
using VirtualExcursion.DAL.context;
using Microsoft.EntityFrameworkCore;

namespace VirtualExcursion.DAL.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly VExContext _context;

        public UserRepository(VExContext context)
        {
            _context = context;
        }
        public async Task<User> Create(User user)
        {
            if (user == null)
                throw new ArgumentNullException("user");

            user.CreatedAt = DateTime.Now;
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync(); 
            return user;
        }
        public async Task<bool> ExistsByEmail(string email)
        {
            return await _context.Users.AnyAsync(u => u.Email == email);
        }

        public async Task<bool> Delete(int id)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == id);
            if (user == null)
                return false;
            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<User> GetByEmail(string email)
        {
            return await _context.Users
                .AsNoTracking()
                .FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task<User> GetById(int id)
        {
            return await _context.Users
                .AsNoTracking()
                .FirstOrDefaultAsync(u => u.Id == id);
        }

        public async Task<List<User>> GetUsers()
        {
            return await _context.Users
                .AsNoTracking().ToListAsync();
        }

        public async Task<User> Update(User user)
        {
            if (user == null)
                throw new ArgumentNullException(nameof(user));

            var existing = await _context.Users.FirstOrDefaultAsync(u => u.Id == user.Id);
            if (existing == null)
                throw new KeyNotFoundException($"Пользователь с id {user.Id} не найден");

            // Обновляем только те поля, которые были изменены
            existing.Username = user.Username;
            existing.Email = user.Email;
            existing.IsAdmin = user.IsAdmin;
            existing.AvatarUrl = user.AvatarUrl;

            // Не обновляем:
            // - PasswordHash (отдельный метод для смены пароля)
            // - RefreshToken и RefreshTokenExpiry (отдельный метод)
            // - CreatedAt (не должно меняться)

            await _context.SaveChangesAsync();
            return existing;
        }
    }
}
