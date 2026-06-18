using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
using VirtualExcursion.DAL.context;
using VirtualExcursion.DAL.models;
using VirtualExcursion.DAL.Repositories.interfaces;

namespace VirtualExcursion.DAL.Repositories
{
    //public class GuideProfileRepository : IGuideProfileRepository
    //{
    //    private readonly VExContext _context;

    //    public GuideProfileRepository(VExContext context)
    //    {
    //        _context = context;
    //    }

    //    public async Task<List<GuideProfile>> Get()
    //    {
    //        return await _context.GuideProfiles
    //            .Include(g => g.User)
    //            .Include(g => g.Scenes)
    //            .Include(gp => gp.Excursions)
    //            .AsNoTracking()
    //            .ToListAsync();
    //    }
    //    public async Task<List<GuideProfile>> Get(Expression<Func<GuideProfile, bool>> predicate)
    //    {
    //        return await _context.GuideProfiles
    //            .Include(gp => gp.User)
    //            .Where(predicate)
    //            .AsNoTracking()
    //            .ToListAsync();
    //    }

    //    public async Task<GuideProfile> GetById(int id)
    //    {
    //        return await _context.GuideProfiles
    //            .Include(g => g.User)
    //            .Include(g => g.Scenes)
    //            .Include(gp => gp.Excursions)
    //            .AsNoTracking()
    //            .FirstOrDefaultAsync(g => g.Id == id);
    //    }

    //    public async Task<GuideProfile> GetByUserId(int userId)
    //    {
    //        return await _context.GuideProfiles
    //            .Include(g => g.User)
    //            .Include(g => g.Scenes)
    //            .AsNoTracking()
    //            .FirstOrDefaultAsync(g => g.UserId == userId);
    //    }

    //    public async Task<GuideProfile> Create(GuideProfile guideProfile)
    //    {
    //        if (guideProfile == null)
    //            throw new ArgumentNullException(nameof(guideProfile));

    //        guideProfile.CreatedAt = DateTime.UtcNow;
    //        await _context.GuideProfiles.AddAsync(guideProfile);
    //        await _context.SaveChangesAsync();
    //        return guideProfile;
    //    }

    //    public async Task<GuideProfile> Update(GuideProfile guideProfile)
    //    {
    //        if (guideProfile == null)
    //            throw new ArgumentNullException(nameof(guideProfile));

    //        var existing = await _context.GuideProfiles
    //            .FirstOrDefaultAsync(g => g.Id == guideProfile.Id);

    //        if (existing == null)
    //            throw new KeyNotFoundException($"Профиль гида с id {guideProfile.Id} не найден");

    //        existing.UserId = guideProfile.UserId;
    //        existing.OrganizationName = guideProfile.OrganizationName;
    //        existing.Description = guideProfile.Description;
    //        existing.LogoUrl = guideProfile.LogoUrl;
    //        existing.Website = guideProfile.Website;
    //        existing.ContactEmail = guideProfile.ContactEmail;
    //        existing.Phone = guideProfile.Phone;
    //        existing.Address = guideProfile.Address;
    //        existing.IsOrganization = guideProfile.IsOrganization;

    //        await _context.SaveChangesAsync();
    //        return existing;
    //    }

    //    public async Task<bool> Delete(int id)
    //    {
    //        var guideProfile = await _context.GuideProfiles
    //            .FirstOrDefaultAsync(g => g.Id == id);

    //        if (guideProfile == null)
    //            return false;

    //        _context.GuideProfiles.Remove(guideProfile);
    //        await _context.SaveChangesAsync();
    //        return true;
    //    }

    //    public async Task<bool> Exists(int id)
    //    {
    //        return await _context.GuideProfiles.AnyAsync(g => g.Id == id);
    //    }

    //    public async Task<bool> ExistsByUserId(int userId, int? excludeId = null)
    //    {
    //        var query = _context.GuideProfiles.Where(g => g.UserId == userId);

    //        if (excludeId.HasValue)
    //            query = query.Where(g => g.Id != excludeId.Value);

    //        return await query.AnyAsync();
    //    }
    //}
}
