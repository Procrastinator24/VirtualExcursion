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
    public class TagRepository : ITagRepository
    {
        private readonly VExContext _context;

        public TagRepository(VExContext context)
        {
            _context = context;
        }

        public async Task<List<Tag>> Get()
        {
            return await _context.Tags
                .Include(t => t.SceneTags)
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<Tag> GetById(int id)
        {
            return await _context.Tags
                .Include(t => t.SceneTags)
                .AsNoTracking()
                .FirstOrDefaultAsync(t => t.Id == id);
        }

        public async Task<Tag> GetBySlug(string slug)
        {
            return await _context.Tags
                .Include(t => t.SceneTags)
                .AsNoTracking()
                .FirstOrDefaultAsync(t => t.Slug == slug);
        }

        public async Task<Tag> Create(Tag tag)
        {
            if (tag == null)
                throw new ArgumentNullException(nameof(tag));

            tag.CreatedAt = DateTime.UtcNow;
            await _context.Tags.AddAsync(tag);
            await _context.SaveChangesAsync();
            return tag;
        }

        public async Task<Tag> Update(Tag tag)
        {
            if (tag == null)
                throw new ArgumentNullException(nameof(tag));

            var existing = await _context.Tags
                .FirstOrDefaultAsync(t => t.Id == tag.Id);

            if (existing == null)
                throw new KeyNotFoundException($"Тег с id {tag.Id} не найден");

            existing.Name = tag.Name;
            existing.Slug = tag.Slug;
            existing.Description = tag.Description;

            await _context.SaveChangesAsync();
            return existing;
        }

        public async Task<bool> Delete(int id)
        {
            var tag = await _context.Tags
                .Include(t => t.SceneTags)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (tag == null)
                return false;

            _context.Tags.Remove(tag);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> Exists(int id)
        {
            return await _context.Tags.AnyAsync(t => t.Id == id);
        }

        public async Task<bool> ExistsBySlug(string slug, int? excludeId = null)
        {
            var query = _context.Tags.Where(t => t.Slug == slug);

            if (excludeId.HasValue)
                query = query.Where(t => t.Id != excludeId.Value);

            return await query.AnyAsync();
        }

        /// <summary>
        /// Добавить тег к сцене
        /// </summary>
        public async Task AddToScene(int sceneId, int tagId)
        {
            // Проверяем, существует ли сцена
            var sceneExists = await _context.Scenes.AnyAsync(s => s.Id == sceneId);
            if (!sceneExists)
                throw new KeyNotFoundException($"Сцена с id {sceneId} не найдена");

            // Проверяем, существует ли тег
            var tagExists = await _context.Tags.AnyAsync(t => t.Id == tagId);
            if (!tagExists)
                throw new KeyNotFoundException($"Тег с id {tagId} не найден");

            // Проверяем, не добавлен ли уже тег
            var alreadyExists = await _context.SceneTags
                .AnyAsync(st => st.SceneId == sceneId && st.TagId == tagId);

            if (alreadyExists)
                return; // Уже есть, ничего не делаем

            var sceneTag = new SceneTag
            {
                SceneId = sceneId,
                TagId = tagId
            };

            await _context.SceneTags.AddAsync(sceneTag);
            await _context.SaveChangesAsync();
        }

        /// <summary>
        /// Удалить тег у сцены
        /// </summary>
        public async Task RemoveFromScene(int sceneId, int tagId)
        {
            var sceneTag = await _context.SceneTags
                .FirstOrDefaultAsync(st => st.SceneId == sceneId && st.TagId == tagId);

            if (sceneTag != null)
            {
                _context.SceneTags.Remove(sceneTag);
                await _context.SaveChangesAsync();
            }
        }

        /// <summary>
        /// Получить все теги сцены
        /// </summary>
        public async Task<List<Tag>> GetTagsForScene(int sceneId)
        {
            return await _context.SceneTags
                .Where(st => st.SceneId == sceneId)
                .Select(st => st.Tag)
                .ToListAsync();
        }
    }
}
