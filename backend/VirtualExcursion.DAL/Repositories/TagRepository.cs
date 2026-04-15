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
    }
}
