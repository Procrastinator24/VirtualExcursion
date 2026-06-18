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
    public class PanoramaRepository : IPanoramaSceneRepository
    {
        private readonly VExContext _context;

        public PanoramaRepository(VExContext context)
        {
            _context = context;
        }

        public async Task<PanoramaScene?> GetById(int id)
        {
            return await _context.PanoramaScenes
                .Include(t => t.Scene)
                .FirstOrDefaultAsync(t => t.Id == id);
        }

        public async Task<List<PanoramaScene>> GetByWorkspaceId(int workspaceId, bool onlyPublished = true)
        {
            var query = _context.PanoramaScenes
                .Include(t => t.Scene)
                .Where(t => t.Scene.WorkspaceId == workspaceId)
                .OrderByDescending(t => t.Scene.CreatedAt);

            if (onlyPublished)
                query = (IOrderedQueryable<PanoramaScene>)query.Where(t => t.Scene.IsPublished);

            return await query.AsNoTracking().ToListAsync();
        }

        public async Task<PanoramaScene> Create(PanoramaScene scene)
        {
            await _context.PanoramaScenes.AddAsync(scene);
            await _context.SaveChangesAsync();
            return scene;
        }

        public async Task<PanoramaScene> Update(PanoramaScene scene)
        {
            var existing = await _context.PanoramaScenes
                .FirstOrDefaultAsync(t => t.Id == scene.Id);

            if (existing == null)
                throw new KeyNotFoundException($"3D сцена с id {scene.Id} не найдена");

           existing.PanoramaUrl = scene.PanoramaUrl;

            await _context.SaveChangesAsync();
            return existing;
        }

        public async Task<bool> Delete(int id)
        {
            var scene = await _context.PanoramaScenes
                .FirstOrDefaultAsync(t => t.Id == id);

            if (scene == null)
                return false;

            _context.PanoramaScenes.Remove(scene);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
