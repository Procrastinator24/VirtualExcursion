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
    public class ImageSceneRepository : IImageSceneRepository
    {
        private readonly VExContext _context;

        public ImageSceneRepository(VExContext context)
        {
            _context = context;
        }

        public async Task<ImageScene?> GetById(int id)
        {
            return await _context.ImageScenes
                .Include(t => t.Scene)
                .FirstOrDefaultAsync(t => t.Id == id);
        }

        public async Task<List<ImageScene>> GetByWorkspaceId(int workspaceId, bool onlyPublished = true)
        {
            var query = _context.ImageScenes
                .Include(t => t.Scene)
                .Where(t => t.Scene.WorkspaceId == workspaceId)
                .OrderByDescending(t => t.Scene.CreatedAt);

            if (onlyPublished)
                query = (IOrderedQueryable<ImageScene>)query.Where(t => t.Scene.IsPublished);

            return await query.AsNoTracking().ToListAsync();
        }

        public async Task<ImageScene> Create(ImageScene scene)
        {
            await _context.ImageScenes.AddAsync(scene);
            await _context.SaveChangesAsync();
            return scene;
        }

        public async Task<ImageScene> Update(ImageScene scene)
        {
            var existing = await _context.ImageScenes
                .FirstOrDefaultAsync(t => t.Id == scene.Id);

            if (existing == null)
                throw new KeyNotFoundException($"3D сцена с id {scene.Id} не найдена");

            existing.Width = scene.Width;
            existing.Height = scene.Height;
            existing.ImageUrl = scene.ImageUrl;

            await _context.SaveChangesAsync();
            return existing;
        }

        public async Task<bool> Delete(int id)
        {
            var scene = await _context.ImageScenes
                .FirstOrDefaultAsync(t => t.Id == id);

            if (scene == null)
                return false;

            _context.ImageScenes.Remove(scene);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
