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
    public class POIService : IPOIService
    {
        private readonly IPOIRepository _repository;
        private readonly IMapper _mapper;

        public POIService(IPOIRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<List<POIResponse>> Get()
        {
            var points = await _repository.Get();
            return _mapper.Map<List<POIResponse>>(points);
        }

        public async Task<List<POIResponse>> GetBySceneId(int sceneId)
        {
            var points = await _repository.GetBySceneId(sceneId);
            return _mapper.Map<List<POIResponse>>(points);
        }

        public async Task<POIResponse> GetById(int id)
        {
            var point = await _repository.GetById(id);
            if (point == null)
                throw new KeyNotFoundException($"Точка интереса с id {id} не найдена");

            return _mapper.Map<POIResponse>(point);
        }

        public async Task<POIResponse> Create(CreatePOIRequest request)
        {
            if (request == null)
                throw new ArgumentNullException(nameof(request));

            var point = _mapper.Map<POI>(request);
            var created = await _repository.Create(point);
            return _mapper.Map<POIResponse>(created);
        }

        public async Task<POIResponse> Update(UpdatePOIRequest request)
        {
            if (request == null)
                throw new ArgumentNullException(nameof(request));

            var point = _mapper.Map<POI>(request);
            var updated = await _repository.Update(point);
            return _mapper.Map<POIResponse>(updated);
        }

        public async Task<bool> Delete(int id)
        {
            if (!await _repository.Exists(id))
                throw new KeyNotFoundException($"Точка интереса с id {id} не найдена");

            return await _repository.Delete(id);
        }
    }
}
