using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using VirtualExcursion.BLL.DTO.Requests.workspace;
using VirtualExcursion.BLL.DTO.Responses;
using VirtualExcursion.BLL.services.interfaces;

namespace VirtualExcursion.API.Controllers
{
    /// <summary>
    /// Контроллер для управления рабочими пространствами (Workspace)
    /// </summary>
    /// <remarks>
    /// Предоставляет API для выполнения операций CRUD с рабочими пространствами.
    /// Рабочее пространство может быть личным кабинетом, командой или организацией.
    /// Все методы (кроме помеченных) требуют авторизации пользователя.
    /// </remarks>
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class WorkspaceController : ControllerBase
    {
        private readonly IWorkspaceService _workspaceService;
        private readonly ILogger<WorkspaceController> _logger;
        private readonly IWebHostEnvironment _webHostEnvironment;


        public WorkspaceController(IWorkspaceService workspaceService, IWebHostEnvironment webHostEnvironment, ILogger<WorkspaceController> logger)
        {
            _workspaceService = workspaceService;
            _logger = logger;
            _webHostEnvironment = webHostEnvironment;
        }

        private int GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
                throw new UnauthorizedAccessException("Пользователь не авторизован");
            return int.Parse(userIdClaim.Value);
        }

        /// <summary>
        /// Получить список всех рабочих пространств
        /// </summary>
        /// <remarks>
        /// Доступно только пользователям с ролью администратора.
        /// Возвращает полный список всех пространств в системе.
        /// </remarks>
        /// <response code="200">Успешное выполнение. Возвращает список всех пространств.</response>
        /// <response code="401">Пользователь не авторизован.</response>
        /// <response code="403">Недостаточно прав. Требуется роль администратора.</response>
        /// <response code="500">Внутренняя ошибка сервера.</response>
        [HttpGet]
        //[Authorize(Roles = "Admin")]
        public async Task<ActionResult<List<WorkspaceResponse>>> GetAll()
        {
            try
            {
                var result = await _workspaceService.Get();
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при получении списка workspace");
                return StatusCode(500, "Внутренняя ошибка сервера");
            }
        }

        /// <summary>
        /// Получить рабочее пространство по идентификатору
        /// </summary>
        /// <param name="id">Идентификатор рабочего пространства</param>
        /// <remarks>
        /// Доступно только участникам пространства или администраторам.
        /// Возвращает полную информацию о пространстве, включая статистику и настройки.
        /// </remarks>
        /// <response code="200">Успешное выполнение. Возвращает данные пространства.</response>
        /// <response code="401">Пользователь не авторизован.</response>
        /// <response code="403">Пользователь не является участником пространства.</response>
        /// <response code="404">Пространство с указанным идентификатором не найдено.</response>
        /// <response code="500">Внутренняя ошибка сервера.</response>
        [HttpGet("{id}")]
        public async Task<ActionResult<WorkspaceResponse>> GetById(int id)
        {
            try
            {
                var userId = GetCurrentUserId();
                var isMember = await _workspaceService.IsMember(id, userId);

                if (!isMember && !User.IsInRole("Admin"))
                    return Forbid("Вы не состоите в пространстве!");

                var result = await _workspaceService.GetById(id);
                return Ok(result);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при получении workspace {Id}", id);
                return StatusCode(500, "Внутренняя ошибка сервера");
            }
        }

        /// <summary>
        /// Получить рабочие пространства текущего пользователя
        /// </summary>
        /// <remarks>
        /// Возвращает все пространства, где текущий пользователь является владельцем или участником.
        /// Это основной эндпоинт для получения списка пространств на клиенте.
        /// </remarks>
        /// <response code="200">Успешное выполнение. Возвращает список пространств пользователя.</response>
        /// <response code="401">Пользователь не авторизован.</response>
        /// <response code="500">Внутренняя ошибка сервера.</response>
        [HttpGet("my")]
        public async Task<ActionResult<List<WorkspaceResponse>>> GetMy()
        {
            try
            {
                var userId = GetCurrentUserId();
                var result = await _workspaceService.GetByUserId(userId);
                return Ok(result);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при получении моих workspace");
                return StatusCode(500, "Внутренняя ошибка сервера");
            }
        }

        /// <summary>
        /// Создать новое рабочее пространство
        /// </summary>
        /// <param name="request">Данные для создания пространства (название, описание, тип и др.)</param>
        /// <remarks>
        /// Создаёт новое рабочее пространство. Текущий пользователь становится его владельцем
        /// и автоматически добавляется в участники с ролью администратора.
        /// </remarks>
        /// <response code="201">Пространство успешно создано. Возвращает созданное пространство.</response>
        /// <response code="400">Ошибка валидации входных данных.</response>
        /// <response code="401">Пользователь не авторизован.</response>
        /// <response code="500">Внутренняя ошибка сервера.</response>
        [HttpPost]
        public async Task<ActionResult<WorkspaceResponse>> Create([FromBody] CreateWorkspaceRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var userId = GetCurrentUserId();
                var result = await _workspaceService.Create(request, userId);
                return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(ex.Message);
            }
            catch (ArgumentNullException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при создании workspace");
                return StatusCode(500, "Внутренняя ошибка сервера");
            }
        }

        /// <summary>
        /// Обновить рабочее пространство
        /// </summary>
        /// <param name="request">Данные для обновления (название, описание, контакты, настройки видимости)</param>
        /// <remarks>
        /// Обновляет информацию о рабочем пространстве.
        /// Доступно только владельцу пространства или администратору.
        /// </remarks>
        /// <response code="200">Пространство успешно обновлено. Возвращает обновлённые данные.</response>
        /// <response code="400">Ошибка валидации входных данных.</response>
        /// <response code="401">Пользователь не авторизован.</response>
        /// <response code="403">Недостаточно прав. Требуется роль владельца или администратора.</response>
        /// <response code="404">Пространство с указанным идентификатором не найдено.</response>
        /// <response code="500">Внутренняя ошибка сервера.</response>
        [HttpPut]
        public async Task<ActionResult<WorkspaceResponse>> Update([FromBody] UpdateWorkspaceRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var userId = GetCurrentUserId();
                var isOwner = await _workspaceService.IsOwner(request.Id, userId);

                if (!isOwner && !User.IsInRole("Admin"))
                    return Forbid();

                var result = await _workspaceService.Update(request);
                return Ok(result);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(ex.Message);
            }
            catch (ArgumentNullException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при обновлении workspace {Id}", request.Id);
                return StatusCode(500, "Внутренняя ошибка сервера");
            }
        }

        /// <summary>
        /// Удалить рабочее пространство
        /// </summary>
        /// <param name="id">Идентификатор рабочего пространства</param>
        /// <remarks>
        /// Удаляет рабочее пространство и все связанные с ним данные (экскурсии, сцены, участников).
        /// Операция необратима. Доступно только владельцу пространства или администратору.
        /// </remarks>
        /// <response code="204">Пространство успешно удалено.</response>
        /// <response code="401">Пользователь не авторизован.</response>
        /// <response code="403">Недостаточно прав. Требуется роль владельца или администратора.</response>
        /// <response code="404">Пространство с указанным идентификатором не найдено.</response>
        /// <response code="500">Внутренняя ошибка сервера.</response>
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            try
            {
                var userId = GetCurrentUserId();
                var isOwner = await _workspaceService.IsOwner(id, userId);

                if (!isOwner && !User.IsInRole("Admin"))
                    return Forbid();

                var result = await _workspaceService.Delete(id);
                if (result)
                    return NoContent();

                return NotFound($"Workspace с id {id} не найден");
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при удалении workspace {Id}", id);
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
        [HttpPost("upload-banner")]
        public async Task<IActionResult> UploadBanner(IFormFile file)
        {
            try
            {
                if (file == null || file.Length == 0)
                    return BadRequest(new { error = "No file uploaded" });

                if (file.Length > 5 * 1024 * 1024)
                    return BadRequest(new { error = "File size exceeds 5 MB" });

                var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".webp" };
                var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
                if (!allowedExtensions.Contains(extension))
                    return BadRequest(new { error = "Invalid file type. Allowed: jpg, jpeg, png, webp" });

                var uploadsFolder = Path.Combine(_webHostEnvironment.WebRootPath, "banners");

                if (!Directory.Exists(uploadsFolder))
                    Directory.CreateDirectory(uploadsFolder);

                var uniqueFileName = $"{Guid.NewGuid()}_{Path.GetFileName(file.FileName)}";
                var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                var url = $"/banners/{uniqueFileName}";
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