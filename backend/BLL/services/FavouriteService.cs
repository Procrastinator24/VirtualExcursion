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
    public class FavouriteService : IFavouriteService
    {
        private readonly IFavouriteRepository _favouriteRepository;
        private readonly IExcursionRepository _excursionRepository;
        private readonly ISceneRepository _sceneRepository;
        private readonly IMapper _mapper;

        public FavouriteService(
            IFavouriteRepository favouriteRepository,
            IExcursionRepository excursionRepository,
            ISceneRepository sceneRepository,
            IMapper mapper)
        {
            _favouriteRepository = favouriteRepository;
            _excursionRepository = excursionRepository;
            _sceneRepository = sceneRepository;
            _mapper = mapper;
        }

        public async Task<List<FavouriteResponse>> GetUserFavourites(int userId)
        {
            var favourites = await _favouriteRepository.GetByUserId(userId);
            return _mapper.Map<List<FavouriteResponse>>(favourites);
        }

        public async Task<FavouriteResponse> AddFavourite(int userId, CreateFavouriteRequest request)
        {
            if (request == null)
                throw new ArgumentNullException(nameof(request));

            // Проверяем, что существует либо экскурсия, либо сцена
            if (request.ExcursionId.HasValue && !await _excursionRepository.Exists(request.ExcursionId.Value))
                throw new KeyNotFoundException($"Экскурсия с id {request.ExcursionId} не найдена");

            if (request.SceneId.HasValue && !await _sceneRepository.Exists(request.SceneId.Value))
                throw new KeyNotFoundException($"Сцена с id {request.SceneId} не найдена");

            // Проверяем, не добавлено ли уже в избранное
            if (request.ExcursionId.HasValue)
            {
                var existing = await _favouriteRepository.GetByUserAndExcursion(userId, request.ExcursionId.Value);
                if (existing != null)
                    throw new InvalidOperationException("Эта экскурсия уже в избранном");
            }
            else if (request.SceneId.HasValue)
            {
                var existing = await _favouriteRepository.GetByUserAndScene(userId, request.SceneId.Value);
                if (existing != null)
                    throw new InvalidOperationException("Эта сцена уже в избранном");
            }

            var favourite = new Favourite
            {
                UserId = userId,
                ExcursionId = request.ExcursionId,
                SceneId = request.SceneId,
                CreatedAt = DateTime.UtcNow
            };

            var created = await _favouriteRepository.Create(favourite);
            return _mapper.Map<FavouriteResponse>(created);
        }

        public async Task<bool> RemoveFavourite(int favouriteId)
        {
            return await _favouriteRepository.Delete(favouriteId);
        }

        public async Task<bool> IsFavourite(int userId, int? excursionId, int? sceneId)
        {
            return await _favouriteRepository.IsFavourite(userId, excursionId, sceneId);
        }
    }
}
