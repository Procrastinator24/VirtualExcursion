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
    public class WorkspaceMemberRepository : IWorkspaceMemberRepository
    {
        private readonly VExContext _context;

        public WorkspaceMemberRepository(VExContext context)
        {
            _context = context;
        }

        public async Task<List<WorkspaceMember>> GetByWorkspaceId(int workspaceId)
        {
            return await _context.WorkspacesMembers
                .Include(wm => wm.User)
                .Include(wm => wm.InvitedBy)
                .Where(wm => wm.WorkspaceId == workspaceId)
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<WorkspaceMember?> GetByWorkspaceAndUser(int workspaceId, int userId)
        {
            return await _context.WorkspacesMembers
                .Include(wm => wm.User)
                .Include(wm => wm.InvitedBy)
                .FirstOrDefaultAsync(wm => wm.WorkspaceId == workspaceId && wm.UserId == userId);
        }

        public async Task<WorkspaceMember> Add(WorkspaceMember member)
        {
            member.JoinedAt = DateTime.UtcNow;
            await _context.WorkspacesMembers.AddAsync(member);
            await _context.SaveChangesAsync();
            return member;
        }

        public async Task<WorkspaceMember> UpdateRole(WorkspaceMember member)
        {
            var existing = await _context.WorkspacesMembers
                .FirstOrDefaultAsync(wm => wm.WorkspaceId == member.WorkspaceId && wm.UserId == member.UserId);

            if (existing == null)
                throw new KeyNotFoundException("Участник не найден");

            existing.Role = member.Role;
            existing.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return existing;
        }

        public async Task<bool> Remove(int workspaceId, int userId)
        {
            var member = await _context.WorkspacesMembers
                .FirstOrDefaultAsync(wm => wm.WorkspaceId == workspaceId && wm.UserId == userId);

            if (member == null)
                return false;

            _context.WorkspacesMembers.Remove(member);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> IsMember(int workspaceId, int userId)
        {
            return await _context.WorkspacesMembers
                .AnyAsync(wm => wm.WorkspaceId == workspaceId && wm.UserId == userId);
        }

        public async Task<WorkspaceRole?> GetUserRole(int workspaceId, int userId)
        {
            var member = await _context.WorkspacesMembers
                .FirstOrDefaultAsync(wm => wm.WorkspaceId == workspaceId && wm.UserId == userId);

            return member?.Role;
        }
    }
}
