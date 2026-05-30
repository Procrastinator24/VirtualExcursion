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
    public class SceneRepository : ISceneRepository
    {
        private readonly VExContext _context;
        public SceneRepository(VExContext context) {
            _context = context;
        }

        public async Task<List<Scene>> Get()
        {
            return await _context.Scenes
                .Include(m => m.SceneTags)
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<Scene> GetById(int id)
        {
            return await _context.Scenes
                .Include(m => m.SceneTags)
                .AsNoTracking()
                .FirstOrDefaultAsync(m => m.Id == id);
        }
        public async Task<List<Scene>> GetByWorkspaceId(int workspaceId)
        {
            return await _context.Scenes
                .Where(s => s.WorkspaceId == workspaceId)
                .OrderByDescending(s => s.CreatedAt)
                .AsNoTracking()
                .ToListAsync();
        }
        public async Task<List<Scene>> GetByGuideProfileId(int guideProfileId)
        {
            return await _context.Scenes
                .Where(s => s.AuthorId == guideProfileId)
                .Include(s => s.PointsOfInterest)
                .AsNoTracking()
                .ToListAsync();
        }
    }
}
