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
    public class ExcursionRepository : IExcursionRepository
    {
        private readonly VExContext _context;

        public ExcursionRepository(VExContext context)
        {
            _context = context;
        }

        public async Task<List<Excursion>> Get(bool onlyPublished)
        {
            return await _context.Excursion
                .Where(ex => onlyPublished ? ex.IsPublished : true)
                .Include(e => e.ExcursionScenes)
                    .ThenInclude(es => es.Scene)
                .Include(e => e.Favourites)
                .Include(e => e.Workspace)
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<Excursion?> GetById(int id)
        {
            return await _context.Excursion
                .Include(e => e.ExcursionScenes)
                    .ThenInclude(es => es.Scene)
                .Include(e => e.Favourites)
                .Include(e => e.Workspace)
                .AsNoTracking()
                .FirstOrDefaultAsync(e => e.Id == id);
        }

        public async Task<List<Excursion>> GetByWorkspaceId(int workspaceId)
        {
            return await _context.Excursion
                .Include(e => e.Workspace)
                .Include(e => e.ExcursionScenes)
                    .ThenInclude(es => es.Scene)
                .Include(e => e.ExcursionTags)
                    .ThenInclude(et => et.Tag)
                .Where(e => e.WorkspaceId == workspaceId)
                .OrderByDescending(e => e.CreatedAt)
                .AsNoTracking()
                .ToListAsync();
        }

        //public async Task<List<Excursion>> GetByGuideId(int guideId)
        //{
        //    return await _context.Excursion
        //        .Include(e => e.ExcursionScenes)
        //            .ThenInclude(es => es.Scene)
        //        .Include(e => e.Favourites)
        //        .AsNoTracking()
        //        .ToListAsync();
        //}

        public async Task<Excursion> Create(Excursion excursion)
        {
            excursion.CreatedAt = DateTime.UtcNow;
            await _context.Excursion.AddAsync(excursion);
            await _context.SaveChangesAsync();
            return excursion;
        }

        public async Task<Excursion> Update(Excursion excursion)
        {
            var existing = await _context.Excursion
                .FirstOrDefaultAsync(e => e.Id == excursion.Id);

            if (existing == null)
                throw new KeyNotFoundException($"Экскурсия с id {excursion.Id} не найдена");

            existing.Title = excursion.Title;
            existing.Description = excursion.Description;
            existing.ThumbnailUrl = excursion.ThumbnailUrl;
            existing.Duration = excursion.Duration;
            existing.IsPublished = excursion.IsPublished;
            existing.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return existing;
        }

        public async Task<bool> Delete(int id)
        {
            var excursion = await _context.Excursion
                .Include(e => e.ExcursionScenes)
                .Include(e => e.Favourites)
                .FirstOrDefaultAsync(e => e.Id == id);

            if (excursion == null)
                return false;

            _context.Excursion.Remove(excursion);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> Exists(int id)
        {
            return await _context.Excursion.AnyAsync(e => e.Id == id);
        }

        public async Task AddSceneToExcursion(int excursionId, int sceneId, int order)
        {
            var excursionScene = new ExcursionScene
            {
                ExcursionId = excursionId,
                SceneId = sceneId,
                Order = order
            };
            await _context.ExcursionScene.AddAsync(excursionScene);
            await _context.SaveChangesAsync();
        }
        public async Task AddTagToExcursion(int excursionId, int tagId)
        {
            var excursionTag = new ExcursionTag
            {
                ExcursionId = excursionId,
                TagId = tagId
            };
            await _context.ExcursionTag.AddAsync(excursionTag);
            await _context.SaveChangesAsync();
        }
        public async Task RemoveSceneFromExcursion(int excursionId, int sceneId)
        {
            var excursionScene = await _context.ExcursionScene
                .FirstOrDefaultAsync(es => es.ExcursionId == excursionId && es.SceneId == sceneId);

            if (excursionScene != null)
            {
                _context.ExcursionScene.Remove(excursionScene);
                await _context.SaveChangesAsync();
            }
        }

        public async Task UpdateSceneOrder(int excursionId, int sceneId, int order)
        {
            var excursionScene = await _context.ExcursionScene
                .FirstOrDefaultAsync(es => es.ExcursionId == excursionId && es.SceneId == sceneId);

            if (excursionScene != null)
            {
                excursionScene.Order = order;
                await _context.SaveChangesAsync();
            }
        }

        public async Task<bool> IsSceneInExcursion(int excursionId, int sceneId)
        {
            return await _context.ExcursionScene
                .AnyAsync(es => es.ExcursionId == excursionId && es.SceneId == sceneId);
        }
    }
}
