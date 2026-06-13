using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using VirtualExcursion.BLL.DTO.Responses;
using VirtualExcursion.BLL.services.interfaces;
using VirtualExcursion.DAL.Repositories;
using VirtualExcursion.DAL.Repositories.interfaces;

namespace VirtualExcursion.BLL.services
{
    public class SceneService : ISceneService
    {
        private readonly ISceneRepository _repository;
        private readonly IMapper _mapper;
        public SceneService(ISceneRepository repository, IMapper mapper) { 
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<List<SceneResponse>> Get()
        {
            var modelScenes = await _repository.Get();
            return _mapper.Map<List<SceneResponse>>(modelScenes);
        }

        public async Task<SceneResponse> GetById(int id)
        {
            var modelScene = await _repository.GetById(id);
            if (modelScene == null)
                throw new KeyNotFoundException($"Модель сцены с id {id} не найдена");

            return _mapper.Map<SceneResponse>(modelScene);
        }
        public async Task<List<SceneResponse>> GetByWorkspaceId(int workspaceId, bool onlyPublished)
        {
            var scenes = await _repository.GetByWorkspaceId(workspaceId, onlyPublished);
            return _mapper.Map<List<SceneResponse>>(scenes);
        }
        public async Task<List<SceneResponse>> GetByGuideProfileId(int guideProfileId)
        {
            var scenes = await _repository.GetByGuideProfileId(guideProfileId);
            return _mapper.Map<List<SceneResponse>>(scenes);
        }
    }
}
