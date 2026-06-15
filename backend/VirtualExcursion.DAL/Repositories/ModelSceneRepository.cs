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
    public class ModelSceneRepository : IModelSceneRepository
    {
        private readonly VExContext _context;

        public ModelSceneRepository(VExContext context)
        {
            _context = context;
        }

        public async Task<List<ModelScene>> Get()
        {
            return await _context.ModelScenes
                .Include(m => m.Scene).ThenInclude(m => m.Author)
                .Include(m => m.PointsOfInterest)
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<ModelScene> GetById(int id)
        {
            return await _context.ModelScenes
                .Include(m => m.Scene).ThenInclude(m => m.Author)
                .Include(m => m.PointsOfInterest)
                .AsNoTracking()
                .FirstOrDefaultAsync(m => m.Id == id);
        }

        public async Task<ModelScene> GetBySceneId(int sceneId)
        {
            return await _context.ModelScenes
                .Include(m => m.Scene).ThenInclude(m => m.Author)
                .Include(m => m.PointsOfInterest)
                .AsNoTracking()
                .FirstOrDefaultAsync(m => m.SceneId == sceneId);
        }

        public async Task<ModelScene> Create(ModelScene modelScene)
        {
            if (modelScene == null)
                throw new ArgumentNullException(nameof(modelScene));

            await _context.ModelScenes.AddAsync(modelScene);
            await _context.SaveChangesAsync();
            return modelScene;
        }

        public async Task<ModelScene> Update(ModelScene modelScene)
        {
            if (modelScene == null)
                throw new ArgumentNullException(nameof(modelScene));

            var existing = await _context.ModelScenes
                .FirstOrDefaultAsync(m => m.Id == modelScene.Id);

            if (existing == null)
                throw new KeyNotFoundException($"Модель сцены с id {modelScene.Id} не найдена");

            existing.SceneId = modelScene.SceneId;
            existing.modelUrl = modelScene.modelUrl;
            existing.ModelFormat = modelScene.ModelFormat;
            existing.CameraStartX = modelScene.CameraStartX;
            existing.CameraStartY = modelScene.CameraStartY;
            existing.CameraStartZ = modelScene.CameraStartZ;
            existing.CameraTargetX = modelScene.CameraTargetX;
            existing.CameraTargetY = modelScene.CameraTargetY;
            existing.CameraTargetZ = modelScene.CameraTargetZ;
            existing.AmbientLightIntensity = modelScene.AmbientLightIntensity;
            existing.EnableVR = modelScene.EnableVR;

            await _context.SaveChangesAsync();
            return existing;
        }

        public async Task<bool> Delete(int id)
        {
            var modelScene = await _context.ModelScenes
                .Include(m => m.PointsOfInterest)
                .FirstOrDefaultAsync(m => m.Id == id);

            if (modelScene == null)
                return false;

            _context.ModelScenes.Remove(modelScene);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> Exists(int id)
        {
            return await _context.ModelScenes.AnyAsync(m => m.Id == id);
        }

        public async Task<bool> ExistsBySceneId(int sceneId, int? excludeId = null)
        {
            var query = _context.ModelScenes.Where(m => m.SceneId == sceneId);

            if (excludeId.HasValue)
                query = query.Where(m => m.Id != excludeId.Value);

            return await query.AnyAsync();
        }
    }
}
