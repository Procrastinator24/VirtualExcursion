using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VirtualExcursion.BLL.DTO.Responses;
using VirtualExcursion.BLL.services;
using VirtualExcursion.BLL.services.interfaces;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace VirtualExcursion.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SceneController : ControllerBase
    {
        private readonly ISceneService _service;
        private readonly IWebHostEnvironment _webHostEnvironment;
        private readonly ILogger<SceneController> _logger;

        public SceneController(ISceneService service, ILogger<SceneController> logger, IWebHostEnvironment webHostEnvironment)
        {
            _service = service;
            _logger = logger;
            _webHostEnvironment = webHostEnvironment;
        }
        [HttpPost("upload-model")]
        public async Task<IActionResult> UploadModel(IFormFile file)
        {
            try
            {
                if (file == null || file.Length == 0)
                    return BadRequest(new { error = "Файл не выбран" });

                // Проверка размера (500 МБ)
                if (file.Length > 500 * 1024 * 1024)
                    return BadRequest(new { error = "Файл превышает максимальный размер (500 МБ)" });

                // Проверка типа файла
                var allowedExtensions = new[] { ".glb", ".gltf", ".obj", ".fbx", ".stl" };
                var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
                if (!allowedExtensions.Contains(extension))
                    return BadRequest(new { error = "Неподдерживаемый формат файла. Допустимые форматы: GLB, GLTF, OBJ, FBX, STL" });

                // Папка для загрузок (wwwroot/models)
                var uploadsFolder = Path.Combine(_webHostEnvironment.WebRootPath, "models");
                if (!Directory.Exists(uploadsFolder))
                    Directory.CreateDirectory(uploadsFolder);

                // Уникальное имя файла
                var uniqueFileName = $"{Guid.NewGuid()}{extension}";
                var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                // Сохраняем файл
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                // Возвращаем URL для доступа
                var url = $"/models/{uniqueFileName}";
                return Ok(new { url });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при загрузке 3D-модели");
                return StatusCode(500, new { error = "Внутренняя ошибка сервера" });
            }
        }

        /// <summary>
        /// Загрузить изображение (обложка, превью)
        /// </summary>
        [HttpPost("upload-image")]
        [Authorize]
        public async Task<IActionResult> UploadImage(IFormFile file)
        {
            try
            {
                if (file == null || file.Length == 0)
                    return BadRequest(new { error = "Файл не выбран" });

                // Проверка размера (10 МБ)
                if (file.Length > 10 * 1024 * 1024)
                    return BadRequest(new { error = "Файл превышает максимальный размер (10 МБ)" });

                // Проверка типа файла
                var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".webp" };
                var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
                if (!allowedExtensions.Contains(extension))
                    return BadRequest(new { error = "Неподдерживаемый формат файла. Допустимые форматы: JPG, JPEG, PNG, WEBP" });

                // Папка для загрузок (wwwroot/uploads)
                var uploadsFolder = Path.Combine(_webHostEnvironment.WebRootPath, "uploads");
                if (!Directory.Exists(uploadsFolder))
                    Directory.CreateDirectory(uploadsFolder);

                // Уникальное имя файла
                var uniqueFileName = $"{Guid.NewGuid()}{extension}";
                var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                // Сохраняем файл
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                // Возвращаем URL для доступа
                var url = $"/uploads/{uniqueFileName}";
                return Ok(new { url });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при загрузке изображения");
                return StatusCode(500, new { error = "Внутренняя ошибка сервера" });
            }
        }
        [HttpGet]
        public async Task<ActionResult<List<SceneResponse>>> GetAll()
        {
            try
            {
                var result = await _service.Get();
                _logger.LogInformation("Успешно получено {Count} моделей сцен", result.Count);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при получении всех моделей сцен");
                return StatusCode(500, "Внутренняя ошибка сервера");
            }
        }

        /// <summary>
        /// Получить модель сцены по id
        /// </summary>
        [HttpGet("{id:int}")]
        public async Task<ActionResult<SceneResponse>> GetById(int id)
        {
            try
            {
                var result = await _service.GetById(id);
                return Ok(result);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при получении модели сцены {Id}", id);
                return StatusCode(500, "Внутренняя ошибка сервера");
            }
        }
        [HttpGet("workspace/{workspaceId}")]

        public async Task<ActionResult<List<SceneResponse>>> GetByWorkspaceId(int workspaceId,
            [FromQuery] bool onlyPublished = true)
        {
            var result = await _service.GetByWorkspaceId(workspaceId, onlyPublished);
            return Ok(result);
        }
        [HttpGet("guide/{guideProfileId}")]
        public async Task<ActionResult<List<SceneResponse>>> GetByGuideProfileId(int guideProfileId)
        {
            try
            {
                var result = await _service.GetByGuideProfileId(guideProfileId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при получении сцен гида {GuideProfileId}", guideProfileId);
                return StatusCode(500, "Внутренняя ошибка сервера");
            }
        }


    }
}
