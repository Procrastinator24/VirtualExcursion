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
using VirtualExcursion.DAL.Repositories.interfaces;

namespace VirtualExcursion.BLL.services
{
    public class ExcursionService : IExcursionService
    {
        private readonly IExcursionRepository _excursionRepository;
        private readonly ISceneRepository _sceneRepository;
        private readonly IMapper _mapper;
        private readonly IWorkspaceMemberRepository _workspaceMemberRepository;

        public ExcursionService(
            IExcursionRepository excursionRepository,
            ISceneRepository sceneRepository,
            IMapper mapper,
            IWorkspaceMemberRepository workspaceMemberRepository)
        {
            _excursionRepository = excursionRepository;
            _sceneRepository = sceneRepository;
            _mapper = mapper;
            _workspaceMemberRepository = workspaceMemberRepository;
        }

        public async Task<List<ExcursionResponse>> Get(bool onlyPublished)
        {
            var excursions = await _excursionRepository.Get(onlyPublished);
            return _mapper.Map<List<ExcursionResponse>>(excursions);
        }

        public async Task<ExcursionResponse> GetById(int id)
        {
            var excursion = await _excursionRepository.GetById(id);
            if (excursion == null)
                throw new KeyNotFoundException($"Экскурсия с id {id} не найдена");

            return _mapper.Map<ExcursionResponse>(excursion);
        }

        public async Task<List<ExcursionResponse>> GetByWorkspaceId(int workspaceId)
        {
            var excursions = await _excursionRepository.GetByWorkspaceId(workspaceId);
            return _mapper.Map<List<ExcursionResponse>>(excursions);
        }


        public async Task<ExcursionResponse> Create(CreateExcursionRequest request, int userId)
        {
            if (request == null)
                throw new ArgumentNullException(nameof(request));

            if (!await _workspaceMemberRepository.IsMember(request.WorkspaceId, userId) & await _workspaceMemberRepository.GetUserRole(request.WorkspaceId, userId) != WorkspaceRole.Viewer)
                throw new UnauthorizedAccessException("Пользователь не имеет прав на создание контента в этом пространстве!");

            var excursion = _mapper.Map<Excursion>(request);
            excursion.CreatedAt = DateTime.UtcNow;
            excursion.UpdatedAt = DateTime.UtcNow;

            var created = await _excursionRepository.Create(excursion);

            // 2. Привязываем сцены к экскурсии
            if (request.SceneIds != null && request.SceneIds.Any())
            {
                for (int i = 0; i < request.SceneIds.Count; i++)
                {
                    var sceneId = request.SceneIds[i];
                    await _excursionRepository.AddSceneToExcursion(created.Id, sceneId, i);
                }
            }

            // 3. Привязываем теги (если есть)
            if (request.TagIds != null && request.TagIds.Any())
            {
                foreach (var tagId in request.TagIds)
                {
                    await _excursionRepository.AddTagToExcursion(created.Id, tagId);
                }
            }

            // 4. Возвращаем созданную экскурсию с привязанными данными
            var response = await _excursionRepository.GetById(created.Id);
            return _mapper.Map<ExcursionResponse>(response);
        }

        public async Task<ExcursionResponse> Update(UpdateExcursionRequest request)
        {
            if (request == null)
                throw new ArgumentNullException(nameof(request));

            if (!await _excursionRepository.Exists(request.Id))
                throw new KeyNotFoundException($"Экскурсия с id {request.Id} не найдена");

            var excursion = _mapper.Map<Excursion>(request);
            var updated = await _excursionRepository.Update(excursion);
            return _mapper.Map<ExcursionResponse>(updated);
        }

        public async Task<bool> Delete(int id)
        {
            if (!await _excursionRepository.Exists(id))
                throw new KeyNotFoundException($"Экскурсия с id {id} не найдена");

            return await _excursionRepository.Delete(id);
        }

        public async Task AddSceneToExcursion(AddSceneToExcursionRequest request)
        {
            if (!await _excursionRepository.Exists(request.ExcursionId))
                throw new KeyNotFoundException($"Экскурсия с id {request.ExcursionId} не найдена");

            //if (!await _sceneRepository.Exists(request.SceneId))
            //    throw new KeyNotFoundException($"Сцена с id {request.SceneId} не найдена");

            if (await _excursionRepository.IsSceneInExcursion(request.ExcursionId, request.SceneId))
                throw new InvalidOperationException("Эта сцена уже добавлена в экскурсию");

            await _excursionRepository.AddSceneToExcursion(request.ExcursionId, request.SceneId, request.Order);
        }

        public async Task RemoveSceneFromExcursion(int excursionId, int sceneId)
        {
            if (!await _excursionRepository.Exists(excursionId))
                throw new KeyNotFoundException($"Экскурсия с id {excursionId} не найдена");

            await _excursionRepository.RemoveSceneFromExcursion(excursionId, sceneId);
        }

        public async Task ReorderScenes(ReorderExcursionScenesRequest request)
        {
            if (!await _excursionRepository.Exists(request.ExcursionId))
                throw new KeyNotFoundException($"Экскурсия с id {request.ExcursionId} не найдена");

            foreach (var item in request.SceneOrders)
            {
                await _excursionRepository.UpdateSceneOrder(request.ExcursionId, item.SceneId, item.Order);
            }
        }

        public async Task IncrementViewCount(int id)
        {
            var excursion = await _excursionRepository.GetById(id);
            if (excursion != null)
            {
                excursion.ViewCount++;
                await _excursionRepository.Update(excursion);
            }
        }
    }
}
