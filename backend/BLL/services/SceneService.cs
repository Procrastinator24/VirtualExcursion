using AutoMapper;
using VirtualExcursion.BLL.DTO.Requests;
using VirtualExcursion.BLL.DTO.Responses;
using VirtualExcursion.BLL.services.interfaces;
using VirtualExcursion.DAL.models;
using VirtualExcursion.DAL.Repositories.interfaces;

namespace VirtualExcursion.BLL.services
{
    public class SceneService : ISceneService
    {
        private readonly ISceneRepository _repository;
        private readonly IThreeDSceneRepository _threeDRepository;
        private readonly IImageSceneRepository _imageRepository;
        private readonly IVideoSceneRepository _videoRepository;
        private readonly IPanoramaSceneRepository _panoramaRepository;
        private readonly ITagRepository _tagRepository;
        private readonly IPOIRepository _poiRepository;
        private readonly IExcursionRepository _excursionRepository;
        private readonly IMapper _mapper;
        public SceneService(ISceneRepository repository, IPanoramaSceneRepository panoramaSceneRepository, 
            IVideoSceneRepository videoSceneRepository, IImageSceneRepository imageSceneRepository, IExcursionRepository excursionRepository,
            IMapper mapper, IPOIRepository pOIRepository, ITagRepository tagRepository, IThreeDSceneRepository threeDSceneRepository) { 
            _repository = repository;
            _mapper = mapper;
            _poiRepository = pOIRepository;
            _tagRepository = tagRepository;
            _threeDRepository = threeDSceneRepository;
            _imageRepository = imageSceneRepository;
            _videoRepository = videoSceneRepository;
            _panoramaRepository = panoramaSceneRepository;
            _excursionRepository = excursionRepository;
        }

        public async Task<List<SceneResponse>> Get(bool onlyPublished)
        {
            var modelScenes = await _repository.Get(onlyPublished);
            return _mapper.Map<List<SceneResponse>>(modelScenes);
        }

        public async Task<SceneResponse> GetById(int id)
        {
            var scene = await _repository.GetByIdWithDetails(id);
            if (scene == null)
                throw new KeyNotFoundException($"Сцена с id {id} не найдена");

            return MapToResponse(scene);
        }
        public async Task<List<SceneResponse>> GetByWorkspaceId(int workspaceId, bool onlyPublished)
        {
            var scenes = await _repository.GetByWorkspaceId(workspaceId, onlyPublished);
            return _mapper.Map<List<SceneResponse>>(scenes);
        }
       

        public async Task<SceneResponse> Create(CreateSceneRequest request)
        {
            // 1. Создаём базовую Scene (общие поля)
            var baseScene = new Scene
            {
                Title = request.Title,
                Description = request.Description,
                ThumbnailUrl = request.ThumbnailUrl,
                ContentType = request.ContentType,
                WorkspaceId = request.WorkspaceId,
                IsPublished = request.IsPublished,
                //Period = request.Period,
                //Region = request.Region,
                CreatedAt = DateTime.UtcNow
            };

            var createdBase = await _repository.Create(baseScene);

            // 2. Создаём специфичную сущность через фабричный метод
            var sceneEntity = CreateSceneEntity(request, createdBase.Id);

            // 3. Сохраняем специфичную сущность в зависимости от типа
            object created = null;

            switch (request.ContentType)
            {
                case "3d":
                    created = await _threeDRepository.Create((ModelScene)sceneEntity);
                    break;
                case "image":
                    created = await _imageRepository.Create((ImageScene)sceneEntity);
                    break;
                case "video":
                    created = await _videoRepository.Create((VideoScene)sceneEntity);
                    break;
                case "panorama":
                    created = await _panoramaRepository.Create((PanoramaScene)sceneEntity);
                    break;
                default:
                    throw new ArgumentException($"Unknown content type: {request.ContentType}");
            }

            // 4. Добавляем точки интереса (только для 3D)
            if (request.ContentType == "3d" && request.PointsOfInterest?.Any() == true)
            {
                foreach (var poiRequest in request.PointsOfInterest)
                {
                    var poi = new POI
                    {
                        Name = poiRequest.Name,
                        Description = poiRequest.Description,
                        CoordinateX = poiRequest.X,
                        CoordinateY = poiRequest.Y,
                        CoordinateZ = poiRequest.Z,
                        //MediaUrl = poiRequest.,
                        SceneId = createdBase.Id
                    };
                    await _poiRepository.Create(poi);
                }
            }

            // 5. Добавляем теги
            if (request.TagIds?.Any() == true)
            {
                foreach (var tagId in request.TagIds)
                {
                    await _tagRepository.AddToScene(createdBase.Id, tagId);
                }
            }

            if (request.excursionIds?.Any() == true)
            {
                for (int i = 0; i < request.excursionIds.Count(); i++)
                {
                    await _excursionRepository.AddSceneToExcursion(request.excursionIds[i], createdBase.Id, i+1);
                }
            }

            // 6. Маппим результат (в зависимости от типа)
            return MapToResponse(baseScene);
        }
        /// <summary>
        /// Фабричный метод: создаёт экземпляр конкретной сцены на основе ContentType
        /// </summary>
        private object CreateSceneEntity(CreateSceneRequest request, int sceneId)
        {
            return request.ContentType switch
            {
                "3d" => new ModelScene
                {
                    SceneId = sceneId,
                    modelUrl = request.ModelUrl,
                    ModelFormat = request.ModelFormat ?? "glb",
                    CameraStartX = request.CameraStartX ?? 0,
                    CameraStartY = request.CameraStartY ?? 0,
                    CameraStartZ = request.CameraStartZ ?? 5,
                    CameraTargetX = request.CameraTargetX ?? 0,
                    CameraTargetY = request.CameraTargetY ?? 0,
                    CameraTargetZ = request.CameraTargetZ ?? 0,
                    AmbientLightIntensity = request.AmbientLightIntensity ?? 0.7f,
                    EnableVR = request.EnableVR ?? false
                },
                "image" => new ImageScene
                {
                    SceneId = sceneId,
                    ImageUrl = request.MediaUrl
                },
                "video" => new VideoScene
                {
                    SceneId = sceneId,
                    VideoUrl = request.MediaUrl,
                    DurationSeconds = request.DurationSeconds
                },
                "panorama" => new PanoramaScene
                {
                    SceneId = sceneId,
                    PanoramaUrl = request.MediaUrl
                },
                _ => throw new ArgumentException($"Unknown content type: {request.ContentType}")
            };
        }

        /// <summary>
        /// Маппинг результата в DTO (в зависимости от типа)
        /// </summary>
        private SceneResponse MapToResponse(Scene scene)
        {
            // Базовый маппинг
            var response = _mapper.Map<SceneResponse>(scene);

            // Маппинг специфичных полей через навигационные свойства
            switch (scene.ContentType?.ToLower())
            {
                case "3d":
                    if (scene.ModelScene != null)
                    {
                        _mapper.Map(scene.ModelScene, response);
                        response.PointsOfInterest = _mapper.Map<List<POIResponse>>(
                            scene.ModelScene.PointsOfInterest
                        );
                    }
                    break;

                case "image":
                    if (scene.ImageScene != null)
                        _mapper.Map(scene.ImageScene, response);
                    break;

                case "video":
                    if (scene.VideoScene != null)
                        _mapper.Map(scene.VideoScene, response);
                    break;

                case "panorama":
                    if (scene.PanoramaScene != null)
                        _mapper.Map(scene.PanoramaScene, response);
                    break;
            }

            return response;
        }
    }
}
