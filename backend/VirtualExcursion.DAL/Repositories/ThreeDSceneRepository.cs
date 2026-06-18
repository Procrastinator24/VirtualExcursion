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
    public class ThreeDSceneRepository : IThreeDSceneRepository
    {
        private readonly VExContext _context;

        public ThreeDSceneRepository(VExContext context)
        {
            _context = context;
        }

        public async Task<ModelScene?> GetById(int id)
        {
            return await _context.ModelScenes
                .Include(t => t.Scene).ThenInclude(t => t.Workspace)
                .Include(t => t.PointsOfInterest)
                .FirstOrDefaultAsync(t => t.Id == id);
        }

        public async Task<List<ModelScene>> GetByWorkspaceId(int workspaceId, bool onlyPublished = true)
        {
            var query = _context.ModelScenes
                .Include(t => t.Scene)
                .Where(t => t.Scene.WorkspaceId == workspaceId)
                .OrderByDescending(t => t.Scene.CreatedAt);

            if (onlyPublished)
                query = (IOrderedQueryable<ModelScene>)query.Where(t => t.Scene.IsPublished);

            return await query.AsNoTracking().ToListAsync();
        }

        public async Task<ModelScene> Create(ModelScene scene)
        {
            await _context.ModelScenes.AddAsync(scene);
            await _context.SaveChangesAsync();
            return scene;
        }

        public async Task<ModelScene> Update(ModelScene scene)
        {
            var existing = await _context.ModelScenes
                .FirstOrDefaultAsync(t => t.Id == scene.Id);

            if (existing == null)
                throw new KeyNotFoundException($"3D сцена с id {scene.Id} не найдена");

            existing.modelUrl = scene.modelUrl;
            existing.ModelFormat = scene.ModelFormat;
            existing.CameraStartX = scene.CameraStartX;
            existing.CameraStartY = scene.CameraStartY;
            existing.CameraStartZ = scene.CameraStartZ;
            existing.CameraTargetX = scene.CameraTargetX;
            existing.CameraTargetY = scene.CameraTargetY;
            existing.CameraTargetZ = scene.CameraTargetZ;
            existing.AmbientLightIntensity = scene.AmbientLightIntensity;
            existing.EnableVR = scene.EnableVR;

            await _context.SaveChangesAsync();
            return existing;
        }

        public async Task<bool> Delete(int id)
        {
            var scene = await _context.ModelScenes
                .Include(t => t.PointsOfInterest)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (scene == null)
                return false;

            _context.ModelScenes.Remove(scene);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
