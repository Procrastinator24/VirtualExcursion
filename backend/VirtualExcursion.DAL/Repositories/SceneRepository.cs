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

        public async Task<List<Scene>> Get(bool onlyPublished)
        {
            return await _context.Scenes
                .Where(s => (onlyPublished ? s.IsPublished : true))
                .Include(s => s.ModelScene)
                .Include(s => s.ImageScene)
                .Include(s => s.VideoScene)
                .Include(s => s.PanoramaScene)
                .Include(s => s.PointsOfInterest)
                .Include(s => s.SceneTags)
                .AsNoTracking()
                .ToListAsync();
        }
        public async Task<Scene> Create(Scene scene)
        {
            scene.CreatedAt = DateTime.UtcNow;
            await _context.Scenes.AddAsync(scene);
            await _context.SaveChangesAsync();
            return scene;
        }

        public async Task<Scene> GetById(int id)
        {
            return await _context.Scenes
                .Include(s => s.ModelScene)
                .Include(s => s.ImageScene)
                .Include(s => s.VideoScene)
                .Include(s => s.PanoramaScene)
                .Include(s => s.PointsOfInterest)
                .Include(s => s.SceneTags)
                .AsNoTracking()
                .FirstOrDefaultAsync(m => m.Id == id);
        }
        public async Task<bool> Exists(int id)
        {
            return await _context.Scenes.AnyAsync(e => e.Id == id);
        }
        public async Task<List<Scene>> GetByWorkspaceId(int workspaceId, bool onlyPublished)
        {
            return await _context.Scenes
                .Where(s => s.WorkspaceId == workspaceId && (onlyPublished ? s.IsPublished : true))
                .OrderByDescending(s => s.CreatedAt)
                .AsNoTracking()
                .ToListAsync();
        }
        public async Task<Scene?> GetByIdWithDetails(int id)
        {
            return await _context.Scenes
                .Include(s => s.ModelScene)
                    .ThenInclude(m => m.PointsOfInterest)
                .Include(s => s.ImageScene)
                .Include(s => s.VideoScene)
                .Include(s => s.PanoramaScene)
                .Include(s => s.SceneTags)
                    .ThenInclude(st => st.Tag)
                .Include(s => s.ExcursionScenes)
                    .ThenInclude(es => es.Excursion)
                .FirstOrDefaultAsync(s => s.Id == id);
        }
    }
}
