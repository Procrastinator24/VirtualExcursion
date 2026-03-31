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
    public class POIRepository : IPOIRepository
    {
        private readonly VExContext _context;

        public POIRepository(VExContext context)
        {
            _context = context;
        }

        public async Task<List<POI>> Get()
        {
            return await _context.PointsOfInterest
                .Include(p => p.Scene)
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<List<POI>> GetBySceneId(int sceneId)
        {
            return await _context.PointsOfInterest
                .Include(p => p.Scene)
                .Where(p => p.SceneId == sceneId)
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<POI> GetById(int id)
        {
            return await _context.PointsOfInterest
                .Include(p => p.Scene)
                .AsNoTracking()
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<POI> Create(POI POI)
        {
            if (POI == null)
                throw new ArgumentNullException(nameof(POI));

            await _context.PointsOfInterest.AddAsync(POI);
            await _context.SaveChangesAsync();
            return POI;
        }

        public async Task<POI> Update(POI POI)
        {
            if (POI == null)
                throw new ArgumentNullException(nameof(POI));

            var existing = await _context.PointsOfInterest
                .FirstOrDefaultAsync(p => p.Id == POI.Id);

            if (existing == null)
                throw new KeyNotFoundException($"Точка интереса с id {POI.Id} не найдена");

            existing.Name = POI.Name;
            existing.Description = POI.Description;
            existing.CoordinateX = POI.CoordinateX;
            existing.CoordinateY = POI.CoordinateY;
            existing.CoordinateZ = POI.CoordinateZ;
            existing.SceneId = POI.SceneId;

            await _context.SaveChangesAsync();
            return existing;
        }

        public async Task<bool> Delete(int id)
        {
            var POI = await _context.PointsOfInterest
                .FirstOrDefaultAsync(p => p.Id == id);

            if (POI == null)
                return false;

            _context.PointsOfInterest.Remove(POI);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> Exists(int id)
        {
            return await _context.PointsOfInterest.AnyAsync(p => p.Id == id);
        }
    }
}
