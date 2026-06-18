using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using VirtualExcursion.BLL.DTO.Requests;
using VirtualExcursion.BLL.DTO.Responses;
using VirtualExcursion.BLL.services.interfaces;
using VirtualExcursion.DAL.models;
using VirtualExcursion.DAL.Repositories;
using VirtualExcursion.DAL.Repositories.interfaces;

namespace VirtualExcursion.BLL.services
{
    //public class GuideProfileService : IGuideProfileService
    //{
    //    private readonly IGuideProfileRepository _repository;
    //    private readonly IMapper _mapper;

    //    public GuideProfileService(IGuideProfileRepository repository, IMapper mapper)
    //    {
    //        _repository = repository;
    //        _mapper = mapper;
    //    }

    //    public async Task<List<GuideProfileResponse>> Get()
    //    {
    //        var profiles = await _repository.Get();
    //        return _mapper.Map<List<GuideProfileResponse>>(profiles);
    //    }
    //    public async Task<List<GuideProfileResponse>> GetIndividuals()
    //    {
    //        var profiles = await _repository.Get(gp => !gp.IsOrganization);
    //        return _mapper.Map<List<GuideProfileResponse>>(profiles);
    //    }

    //    public async Task<List<GuideProfileResponse>> GetOrganizations()
    //    {
    //        var profiles = await _repository.Get(gp => gp.IsOrganization);
    //        return _mapper.Map<List<GuideProfileResponse>>(profiles);
    //    }

    //    public async Task<GuideProfileResponse> GetById(int id)
    //    {
    //        var profile = await _repository.GetById(id);
    //        if (profile == null)
    //            throw new KeyNotFoundException($"Профиль гида с id {id} не найден");

    //        return _mapper.Map<GuideProfileResponse>(profile);
    //    }

    //    public async Task<GuideProfileResponse> GetByUserId(int userId)
    //    {
    //        var profile = await _repository.GetByUserId(userId);
    //        if (profile == null)
    //            throw new KeyNotFoundException($"Профиль гида для пользователя с id {userId} не найден");

    //        return _mapper.Map<GuideProfileResponse>(profile);
    //    }

    //    public async Task<GuideProfileResponse> Create(CreateGuideProfileRequest request)
    //    {
    //        if (request == null)
    //            throw new ArgumentNullException(nameof(request));

    //        // Проверка: существует ли уже профиль у этого пользователя
    //        if (await _repository.ExistsByUserId(request.UserId))
    //            throw new InvalidOperationException($"Профиль гида для пользователя с id {request.UserId} уже существует");

    //        var profile = _mapper.Map<GuideProfile>(request);
    //        var created = await _repository.Create(profile);
    //        return _mapper.Map<GuideProfileResponse>(created);
    //    }

    //    public async Task<GuideProfileResponse> Update(UpdateGuideProfileRequest request)
    //    {
    //        if (request == null)
    //            throw new ArgumentNullException(nameof(request));

    //        // Проверка: существует ли профиль у другого пользователя с таким же UserId
    //        if (await _repository.ExistsByUserId(request.UserId, request.Id))
    //            throw new InvalidOperationException($"Профиль гида для пользователя с id {request.UserId} уже существует");

    //        var profile = _mapper.Map<GuideProfile>(request);
    //        var updated = await _repository.Update(profile);
    //        return _mapper.Map<GuideProfileResponse>(updated);
    //    }

    //    public async Task<bool> Delete(int id)
    //    {
    //        if (!await _repository.Exists(id))
    //            throw new KeyNotFoundException($"Профиль гида с id {id} не найден");

    //        return await _repository.Delete(id);
    //    }
    //}
}
