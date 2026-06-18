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
    public class WorkspaceRepository : IWorkspaceRepository
    {
        private readonly VExContext _context;

        public WorkspaceRepository(VExContext context)
        {
            _context = context;
        }

        public async Task<List<Workspace>> Get()
        {
            return await _context.Workspaces
                .Include(w => w.Owner)
                .Include(w => w.Members)
                .ThenInclude(m => m.User)
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<Workspace?> GetById(int id)
        {
            return await _context.Workspaces
                .Include(w => w.Excursions) .Include(w => w.Scenes)
                .Include(w => w.Owner)
                .Include(w => w.Members)
                .ThenInclude(m => m.User)
                .AsNoTracking()
                .FirstOrDefaultAsync(w => w.Id == id);
        }

        public async Task<List<Workspace>> GetByOwnerId(int ownerId)
        {
            return await _context.Workspaces
                .Include(w => w.Owner)
                .Include(w => w.Members)
                .Where(w => w.OwnerId == ownerId)
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<List<Workspace>> GetByUserId(int userId)
        {
            return await _context.Workspaces
                .Include(w => w.Owner)
                .Include(w => w.Members)
                .Where(w => w.OwnerId == userId || w.Members.Any(m => m.UserId == userId))
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<Workspace> Create(Workspace workspace)
        {
            workspace.CreatedAt = DateTime.UtcNow;
            await _context.Workspaces.AddAsync(workspace);
            await _context.SaveChangesAsync();
            return workspace;
        }

        public async Task<Workspace> Update(Workspace workspace)
        {
            var existing = await _context.Workspaces
                .FirstOrDefaultAsync(w => w.Id == workspace.Id);

            if (existing == null)
                throw new KeyNotFoundException($"Workspace с id {workspace.Id} не найден");

            existing.Name = workspace.Name;
            existing.DescriptionShort = workspace.DescriptionShort;
            //existing.DescriptionLong = workspace.DescriptionLong;
            existing.LogoUrl = workspace.LogoUrl;
            existing.BannerUrl = workspace.BannerUrl;
            existing.Website = workspace.Website;
            existing.ContactEmail = workspace.ContactEmail;
            existing.Phone = workspace.Phone;
            existing.Address = workspace.Address;
            existing.ShowContactInfo = workspace.ShowContactInfo;
            existing.ShowExhibits = workspace.ShowExhibits;
            existing.ShowExcursions = workspace.ShowExcursions;
            existing.ShowMe = workspace.ShowMe;
            existing.ShowSite = workspace.ShowSite;
            existing.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return existing;
        }

        public async Task<bool> Delete(int id)
        {
            var workspace = await _context.Workspaces
                .Include(w => w.Members)
                .FirstOrDefaultAsync(w => w.Id == id);

            if (workspace == null)
                return false;

            _context.Workspaces.Remove(workspace);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> Exists(int id)
        {
            return await _context.Workspaces.AnyAsync(w => w.Id == id);
        }

        public async Task<bool> IsOwner(int workspaceId, int userId)
        {
            return await _context.Workspaces
                .AnyAsync(w => w.Id == workspaceId && w.OwnerId == userId);
        }

        public async Task<bool> IsMember(int workspaceId, int userId)
        {
            return await _context.WorkspacesMembers
                .AnyAsync(wm => wm.WorkspaceId == workspaceId && wm.UserId == userId);
        }
    }
}
