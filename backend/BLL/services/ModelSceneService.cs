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
    public class ModelSceneService : IModelSceneService
    {
        private readonly IModelSceneRepository _repository;
        private readonly IMapper _mapper;

        public ModelSceneService(IModelSceneRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<List<ModelSceneResponse>> Get()
        {
            var modelScenes = await _repository.Get();
            return _mapper.Map<List<ModelSceneResponse>>(modelScenes);
        }

        public async Task<ModelSceneResponse> GetById(int id)
        {
            var modelScene = await _repository.GetById(id);
            if (modelScene == null)
                throw new KeyNotFoundException($"Модель сцены с id {id} не найдена");

            return _mapper.Map<ModelSceneResponse>(modelScene);
        }

        public async Task<ModelSceneResponse> GetBySceneId(int sceneId)
        {
            var modelScene = await _repository.GetBySceneId(sceneId);
            if (modelScene == null)
                throw new KeyNotFoundException($"Модель для сцены с id {sceneId} не найдена");

            return _mapper.Map<ModelSceneResponse>(modelScene);
        }

        public async Task<ModelSceneResponse> Create(CreateModelSceneRequest request)
        {
            if (request == null)
                throw new ArgumentNullException(nameof(request));

            // Проверка: существует ли уже модель для этой сцены
            if (await _repository.ExistsBySceneId(request.SceneId))
                throw new InvalidOperationException($"Модель для сцены с id {request.SceneId} уже существует");

            var modelScene = _mapper.Map<ModelScene>(request);
            var created = await _repository.Create(modelScene);
            return _mapper.Map<ModelSceneResponse>(created);
        }

        public async Task<ModelSceneResponse> Update(UpdateModelSceneRequest request)
        {
            if (request == null)
                throw new ArgumentNullException(nameof(request));

            // Проверка: существует ли модель для другой сцены с таким же SceneId
            if (await _repository.ExistsBySceneId(request.SceneId, request.Id))
                throw new InvalidOperationException($"Модель для сцены с id {request.SceneId} уже существует");

            var modelScene = _mapper.Map<ModelScene>(request);
            var updated = await _repository.Update(modelScene);
            return _mapper.Map<ModelSceneResponse>(updated);
        }

        public async Task<bool> Delete(int id)
        {
            if (!await _repository.Exists(id))
                throw new KeyNotFoundException($"Модель сцены с id {id} не найдена");

            return await _repository.Delete(id);
        }
    }
}
