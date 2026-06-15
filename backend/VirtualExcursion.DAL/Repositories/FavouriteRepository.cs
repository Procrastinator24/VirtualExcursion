using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using VirtualExcursion.DAL.context;
using VirtualExcursion.DAL.models;
using VirtualExcursion.DAL.Repositories.interfaces;

namespace VirtualExcursion.DAL.Repositories
{
    public class FavouriteRepository : IFavouriteRepository
    {
        private readonly VExContext _context;

        public FavouriteRepository(VExContext context)
        {
            _context = context;
        }

        public async Task<List<Favourite>> GetByUserId(int userId)
        {
            return await _context.Favourite
                .Include(f => f.User)
                .Include(f => f.Excursion)
                .Include(f => f.Scene)
                .Where(f => f.UserId == userId)
                .OrderByDescending(f => f.CreatedAt)
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<Favourite?> GetByUserAndExcursion(int userId, int excursionId)
        {
            return await _context.Favourite
                .FirstOrDefaultAsync(f => f.UserId == userId && f.ExcursionId == excursionId);
        }

        public async Task<Favourite?> GetByUserAndScene(int userId, int sceneId)
        {
            return await _context.Favourite
                .FirstOrDefaultAsync(f => f.UserId == userId && f.SceneId == sceneId);
        }

        public async Task<Favourite> Create(Favourite favourite)
        {
            favourite.CreatedAt = DateTime.UtcNow;
            await _context.Favourite.AddAsync(favourite);
            await _context.SaveChangesAsync();
            return favourite;
        }

        public async Task<bool> Delete(int id)
        {
            var favourite = await _context.Favourite.FindAsync(id);
            if (favourite == null)
                return false;

            _context.Favourite.Remove(favourite);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> IsFavourite(int userId, int? excursionId, int? sceneId)
        {
            if (excursionId.HasValue)
            {
                return await _context.Favourite
                    .AnyAsync(f => f.UserId == userId && f.ExcursionId == excursionId);
            }
            if (sceneId.HasValue)
            {
                return await _context.Favourite
                    .AnyAsync(f => f.UserId == userId && f.SceneId == sceneId);
            }
            return false;
        }
    }
}
