using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using VirtualExcursion.BLL.DTO.Requests;
using VirtualExcursion.BLL.DTO.Responses;
using VirtualExcursion.BLL.services.interfaces;

namespace VirtualExcursion.API.Controllers
{
    /// <summary>
    /// Контроллер для управления экскурсиями
    /// </summary>
    /// <remarks>
    /// Предоставляет API для выполнения операций CRUD с экскурсиями,
    /// управления сценами в экскурсии и загрузки обложек.
    /// </remarks>
    [ApiController]
    [Route("api/[controller]")]
    public class ExcursionController : ControllerBase
    {
        private readonly IExcursionService _excursionService;
        private readonly IFavouriteService _favouriteService;
        private readonly IWebHostEnvironment _webHostEnvironment;
        private readonly ILogger<ExcursionController> _logger;

        public ExcursionController(
            IExcursionService excursionService,
            IFavouriteService favouriteService,
            IWebHostEnvironment webHostEnvironment,
            ILogger<ExcursionController> logger)
        {
            _excursionService = excursionService;
            _favouriteService = favouriteService;
            _webHostEnvironment = webHostEnvironment;
            _logger = logger;
        }

        private int? GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            return userIdClaim != null ? int.Parse(userIdClaim.Value) : null;
        }

        /// <summary>
        /// Получить список всех экскурсий
        /// </summary>
        /// <remarks>
        /// Возвращает все доступные экскурсии. Для авторизованных пользователей дополнительно
        /// отмечает, какие экскурсии добавлены в избранное.
        /// </remarks>
        /// <response code="200">Успешное выполнение. Возвращает список экскурсий.</response>
        /// <response code="500">Внутренняя ошибка сервера.</response>
        [HttpGet]
        public async Task<ActionResult<List<ExcursionResponse>>> GetAll()
        {
            try
            {
                var result = await _excursionService.Get();
                var userId = GetCurrentUserId();

                // Добавляем информацию об избранном для каждого пользователя
                if (userId.HasValue)
                {
                    foreach (var excursion in result)
                    {
                        excursion.IsFavourite = await _favouriteService.IsFavourite(userId.Value, excursion.Id, null);
                    }
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при получении экскурсий");
                return StatusCode(500, "Внутренняя ошибка сервера");
            }
        }

        /// <summary>
        /// Получить экскурсию по идентификатору
        /// </summary>
        /// <param name="id">Идентификатор экскурсии</param>
        /// <remarks>
        /// Возвращает полную информацию об экскурсии, включая список сцен.
        /// При каждом вызове увеличивается счётчик просмотров экскурсии.
        /// </remarks>
        /// <response code="200">Успешное выполнение. Возвращает данные экскурсии.</response>
        /// <response code="404">Экскурсия с указанным идентификатором не найдена.</response>
        /// <response code="500">Внутренняя ошибка сервера.</response>
        [HttpGet("{id}")]
        public async Task<ActionResult<ExcursionResponse>> GetById(int id)
        {
            try
            {
                var result = await _excursionService.GetById(id);
                var userId = GetCurrentUserId();

                if (userId.HasValue)
                {
                    result.IsFavourite = await _favouriteService.IsFavourite(userId.Value, id, null);
                }

                // Увеличиваем счётчик просмотров
                await _excursionService.IncrementViewCount(id);

                return Ok(result);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при получении экскурсии {Id}", id);
                return StatusCode(500, "Внутренняя ошибка сервера");
            }
        }


        /// <summary>
        /// Получить все экскурсии рабочего пространства
        /// </summary>
        /// <param name="workspaceId">Идентификатор рабочего пространства</param>
        /// <remarks>
        /// Возвращает список экскурсий, созданных в указанном рабочем пространстве.
        /// </remarks>
        /// <response code="200">Успешное выполнение. Возвращает список экскурсий пространства.</response>
        /// <response code="500">Внутренняя ошибка сервера.</response>
        [HttpGet("workspace/{workspaceId}")]
        public async Task<ActionResult<List<ExcursionResponse>>> GetByWorkspaceId(int workspaceId)
        {
            try
            {
                var result = await _excursionService.GetByWorkspaceId(workspaceId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при получении экскурсий для workspace {WorkspaceId}", workspaceId);
                return StatusCode(500, "Внутренняя ошибка сервера");
            }
        }

        ///// <summary>
        ///// Получить экскурсии гида
        ///// </summary>
        //[HttpGet("guide/{guideId}")]
        //public async Task<ActionResult<List<ExcursionResponse>>> GetByGuideId(int guideId)
        //{
        //    try
        //    {
        //        var result = await _excursionService.GetByGuideId(guideId);
        //        return Ok(result);
        //    }
        //    catch (Exception ex)
        //    {
        //        _logger.LogError(ex, "Ошибка при получении экскурсий гида {GuideId}", guideId);
        //        return StatusCode(500, "Внутренняя ошибка сервера");
        //    }
        //}

        /// <summary>
        /// Создать новую экскурсию
        /// </summary>
        /// <param name="request">Данные для создания экскурсии (название, описание, обложка)</param>
        /// <remarks>
        /// Создаёт новую экскурсию и привязывает её к текущему пользователю.
        /// Требует авторизации.
        /// </remarks>
        /// <response code="201">Экскурсия успешно создана. Возвращает созданную экскурсию.</response>
        /// <response code="400">Ошибка валидации входных данных.</response>
        /// <response code="401">Пользователь не авторизован.</response>
        /// <response code="500">Внутренняя ошибка сервера.</response>
        //[Authorize]
        [HttpPost]
        public async Task<ActionResult<ExcursionResponse>> Create([FromBody] CreateExcursionRequest request)
        {
            try
            {
                var userId = GetCurrentUserId();

                if (!userId.HasValue)
                    return Unauthorized();

                var result = await _excursionService.Create(request, userId.Value);
                return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
            }
            catch (ArgumentNullException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при создании экскурсии");
                return StatusCode(500, "Внутренняя ошибка сервера");
            }
        }

        /// <summary>
        /// Обновить существующую экскурсию
        /// </summary>
        /// <param name="request">Данные для обновления (название, описание, статус публикации)</param>
        /// <remarks>
        /// Обновляет информацию об экскурсии. Доступно только автору или администратору.
        /// </remarks>
        /// <response code="200">Экскурсия успешно обновлена.</response>
        /// <response code="400">Ошибка валидации входных данных.</response>
        /// <response code="404">Экскурсия с указанным идентификатором не найдена.</response>
        /// <response code="500">Внутренняя ошибка сервера.</response>
        //[Authorize]
        [HttpPut]
        public async Task<ActionResult<ExcursionResponse>> Update([FromBody] UpdateExcursionRequest request)
        {
            try
            {
                var result = await _excursionService.Update(request);
                return Ok(result);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (ArgumentNullException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при обновлении экскурсии {Id}", request.Id);
                return StatusCode(500, "Внутренняя ошибка сервера");
            }
        }

        /// <summary>
        /// Удалить экскурсию
        /// </summary>
        /// <param name="id">Идентификатор экскурсии</param>
        /// <remarks>
        /// Удаляет экскурсию и все связанные с ней записи (связи со сценами, избранное, теги).
        /// Доступно только автору или администратору.
        /// </remarks>
        /// <response code="204">Экскурсия успешно удалена.</response>
        /// <response code="404">Экскурсия с указанным идентификатором не найдена.</response>
        /// <response code="500">Внутренняя ошибка сервера.</response>
        //[Authorize]
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            try
            {
                var result = await _excursionService.Delete(id);
                if (result)
                    return NoContent();

                return NotFound($"Экскурсия с id {id} не найдена");
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при удалении экскурсии {Id}", id);
                return StatusCode(500, "Внутренняя ошибка сервера");
            }
        }

        /// <summary>
        /// Добавить сцену в экскурсию
        /// </summary>
        /// <param name="excursionId">Идентификатор экскурсии</param>
        /// <param name="sceneId">Идентификатор сцены</param>
        /// <param name="order">Порядковый номер сцены в экскурсии (по умолчанию 0)</param>
        /// <remarks>
        /// Добавляет существующую сцену в экскурсию с указанным порядковым номером.
        /// Одна сцена может входить в несколько экскурсий.
        /// </remarks>
        /// <response code="204">Сцена успешно добавлена в экскурсию.</response>
        /// <response code="404">Экскурсия или сцена не найдены.</response>
        /// <response code="409">Сцена уже добавлена в эту экскурсию.</response>
        /// <response code="500">Внутренняя ошибка сервера.</response>
        //[Authorize]
        [HttpPost("{excursionId}/scenes/{sceneId}")]
        public async Task<ActionResult> AddSceneToExcursion(int excursionId, int sceneId, [FromQuery] int order = 0)
        {
            try
            {
                var request = new AddSceneToExcursionRequest
                {
                    ExcursionId = excursionId,
                    SceneId = sceneId,
                    Order = order
                };
                await _excursionService.AddSceneToExcursion(request);
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при добавлении сцены {SceneId} в экскурсию {ExcursionId}", sceneId, excursionId);
                return StatusCode(500, "Внутренняя ошибка сервера");
            }
        }

        /// <summary>
        /// Удалить сцену из экскурсии
        /// </summary>
        /// <param name="excursionId">Идентификатор экскурсии</param>
        /// <param name="sceneId">Идентификатор сцены</param>
        /// <remarks>
        /// Удаляет связь между сценой и экскурсией. Сама сцена и экскурсия не удаляются.
        /// </remarks>
        /// <response code="204">Сцена успешно удалена из экскурсии.</response>
        /// <response code="404">Экскурсия или сцена не найдены.</response>
        /// <response code="500">Внутренняя ошибка сервера.</response>
        //[Authorize]
        [HttpDelete("{excursionId}/scenes/{sceneId}")]
        public async Task<ActionResult> RemoveSceneFromExcursion(int excursionId, int sceneId)
        {
            try
            {
                await _excursionService.RemoveSceneFromExcursion(excursionId, sceneId);
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при удалении сцены {SceneId} из экскурсии {ExcursionId}", sceneId, excursionId);
                return StatusCode(500, "Внутренняя ошибка сервера");
            }
        }

        /// <summary>
        /// Изменить порядок сцен в экскурсии
        /// </summary>
        /// <param name="request">Массив с идентификаторами сцен и новыми порядковыми номерами</param>
        /// <remarks>
        /// Позволяет переупорядочить сцены в рамках одной экскурсии.
        /// </remarks>
        /// <response code="204">Порядок сцен успешно обновлён.</response>
        /// <response code="404">Экскурсия с указанным идентификатором не найдена.</response>
        /// <response code="500">Внутренняя ошибка сервера.</response>
        //[Authorize]
        [HttpPost("reorder")]
        public async Task<ActionResult> ReorderScenes([FromBody] ReorderExcursionScenesRequest request)
        {
            try
            {
                await _excursionService.ReorderScenes(request);
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при изменении порядка сцен в экскурсии {ExcursionId}", request.ExcursionId);
                return StatusCode(500, "Внутренняя ошибка сервера");
            }
        }
        /// <summary>
        /// Загрузить обложку для экскурсии
        /// </summary>
        /// <param name="file">Файл изображения (JPG, JPEG, PNG, WEBP)</param>
        /// <remarks>
        /// Загружает изображение на сервер и возвращает URL для доступа к нему.
        /// Максимальный размер файла — 5 МБ.
        /// </remarks>
        /// <response code="200">Файл успешно загружен. Возвращает URL загруженного файла.</response>
        /// <response code="400">Ошибка: файл не выбран, превышен размер или недопустимый формат.</response>
        /// <response code="500">Внутренняя ошибка сервера.</response>
        [HttpPost("upload-thumbnail")]
        public async Task<IActionResult> UploadThumbnail(IFormFile file)
        {
            try
            {
                if (file == null || file.Length == 0)
                    return BadRequest(new { error = "No file uploaded" });

                // Проверка размера (например, 5 MB)
                if (file.Length > 5 * 1024 * 1024)
                    return BadRequest(new { error = "File size exceeds 5 MB" });

                // Проверка типа файла
                var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".webp" };
                var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
                if (!allowedExtensions.Contains(extension))
                    return BadRequest(new { error = "Invalid file type. Allowed: jpg, jpeg, png, webp" });

                // Папка для загрузок (wwwroot/thumbnails)
                var uploadsFolder = Path.Combine(_webHostEnvironment.WebRootPath, "thumbnails");

                // Создаём папку, если её нет
                if (!Directory.Exists(uploadsFolder))
                    Directory.CreateDirectory(uploadsFolder);

                // Уникальное имя файла
                var uniqueFileName = $"{Guid.NewGuid()}_{Path.GetFileName(file.FileName)}";
                var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                // Сохраняем файл
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                // Возвращаем URL для доступа
                var url = $"/thumbnails/{uniqueFileName}";
                return Ok(new { url });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error uploading thumbnail");
                return StatusCode(500, new { error = "Internal server error" });
            }
        }
    }
}
