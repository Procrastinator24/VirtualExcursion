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
    public class TagService : ITagService
    {
        private readonly ITagRepository _repository;
        private readonly IMapper _mapper;

        public TagService(ITagRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<List<TagResponse>> Get()
        {
            var tags = await _repository.Get();
            return _mapper.Map<List<TagResponse>>(tags);
        }

        public async Task<TagResponse> GetById(int id)
        {
            var tag = await _repository.GetById(id);
            if (tag == null)
                throw new KeyNotFoundException($"Тег с id {id} не найден");

            return _mapper.Map<TagResponse>(tag);
        }

        public async Task<TagResponse> GetBySlug(string slug)
        {
            var tag = await _repository.GetBySlug(slug);
            if (tag == null)
                throw new KeyNotFoundException($"Тег с slug '{slug}' не найден");

            return _mapper.Map<TagResponse>(tag);
        }

        public async Task<TagResponse> Create(CreateTagRequest request)
        {
            if (request == null)
                throw new ArgumentNullException(nameof(request));

            // Проверка уникальности slug
            if (await _repository.ExistsBySlug(request.Slug))
                throw new InvalidOperationException($"Тег с slug '{request.Slug}' уже существует");

            var tag = _mapper.Map<Tag>(request);
            var created = await _repository.Create(tag);
            return _mapper.Map<TagResponse>(created);
        }

        public async Task<TagResponse> Update(UpdateTagRequest request)
        {
            if (request == null)
                throw new ArgumentNullException(nameof(request));

            // Проверка уникальности slug (исключая текущий тег)
            if (await _repository.ExistsBySlug(request.Slug, request.Id))
                throw new InvalidOperationException($"Тег с slug '{request.Slug}' уже существует");

            var tag = _mapper.Map<Tag>(request);
            var updated = await _repository.Update(tag);
            return _mapper.Map<TagResponse>(updated);
        }

        public async Task<bool> Delete(int id)
        {
            if (!await _repository.Exists(id))
                throw new KeyNotFoundException($"Тег с id {id} не найден");

            return await _repository.Delete(id);
        }
    }
}
