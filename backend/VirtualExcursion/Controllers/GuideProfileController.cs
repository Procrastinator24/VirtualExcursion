using Microsoft.AspNetCore.Mvc;
using VirtualExcursion.BLL.DTO.Requests;
using VirtualExcursion.BLL.DTO.Responses;
using VirtualExcursion.BLL.services.interfaces;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace VirtualExcursion.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GuideProfileController : ControllerBase
    {
        private readonly IGuideProfileService _service;
        private readonly ILogger<GuideProfileController> _logger;

        public GuideProfileController(IGuideProfileService service, ILogger<GuideProfileController> logger)
        {
            _service = service;
            _logger = logger;
        }

        /// <summary>
        /// Получить все профили гидов
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<List<GuideProfileResponse>>> GetAll()
        {
            try
            {
                var result = await _service.Get();
                _logger.LogInformation("Успешно получено {Count} профилей гидов", result.Count);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при получении всех профилей гидов");
                return StatusCode(500, "Внутренняя ошибка сервера");
            }
        }

        /// <summary>
        /// Получить профиль гида по id
        /// </summary>
        [HttpGet("{id:int}")]
        public async Task<ActionResult<GuideProfileResponse>> GetById(int id)
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
                _logger.LogError(ex, "Ошибка при получении профиля гида {Id}", id);
                return StatusCode(500, "Внутренняя ошибка сервера");
            }
        }

        /// <summary>
        /// Получить профиль гида по id пользователя
        /// </summary>
        [HttpGet("user/{userId:int}")]
        public async Task<ActionResult<GuideProfileResponse>> GetByUserId(int userId)
        {
            try
            {
                var result = await _service.GetByUserId(userId);
                return Ok(result);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при получении профиля гида для пользователя {UserId}", userId);
                return StatusCode(500, "Внутренняя ошибка сервера");
            }
        }

        /// <summary>
        /// Создать новый профиль гида
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<GuideProfileResponse>> Create([FromBody] CreateGuideProfileRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var result = await _service.Create(request);
                return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
            }
            catch (ArgumentNullException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при создании профиля гида");
                return StatusCode(500, "Внутренняя ошибка сервера");
            }
        }

        /// <summary>
        /// Обновить профиль гида
        /// </summary>
        [HttpPut]
        public async Task<ActionResult<GuideProfileResponse>> Update([FromBody] UpdateGuideProfileRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var result = await _service.Update(request);
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
            catch (InvalidOperationException ex)
            {
                return Conflict(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при обновлении профиля гида {Id}", request.Id);
                return StatusCode(500, "Внутренняя ошибка сервера");
            }
        }

        /// <summary>
        /// Удалить профиль гида
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            try
            {
                var result = await _service.Delete(id);
                if (result)
                    return NoContent();

                return NotFound($"Профиль гида с id {id} не найден");
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при удалении профиля гида {Id}", id);
                return StatusCode(500, "Внутренняя ошибка сервера");
            }
        }
    }
}
