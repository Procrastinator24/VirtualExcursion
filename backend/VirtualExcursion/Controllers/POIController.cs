using Microsoft.AspNetCore.Mvc;
using VirtualExcursion.BLL.DTO.Requests;
using VirtualExcursion.BLL.DTO.Responses;
using VirtualExcursion.BLL.services.interfaces;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace VirtualExcursion.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class POIController : ControllerBase
    {
        private readonly IPOIService _service;
        private readonly ILogger<POIController> _logger;

        public POIController(IPOIService service, ILogger<POIController> logger)
        {
            _service = service;
            _logger = logger;
        }

        /// <summary>
        /// Получить все точки интереса
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<List<POIResponse>>> GetAll()
        {
            try
            {
                var result = await _service.Get();
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при получении всех точек интереса");
                return StatusCode(500, "Внутренняя ошибка сервера");
            }
        }

        /// <summary>
        /// Получить точки интереса по id сцены
        /// </summary>
        [HttpGet("scene/{sceneId}")]
        public async Task<ActionResult<List<POIResponse>>> GetBySceneId(int sceneId)
        {
            try
            {
                var result = await _service.GetBySceneId(sceneId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при получении точек интереса для сцены {SceneId}", sceneId);
                return StatusCode(500, "Внутренняя ошибка сервера");
            }
        }

        /// <summary>
        /// Получить точку интереса по id
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<POIResponse>> GetById(int id)
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
                _logger.LogError(ex, "Ошибка при получении точки интереса {Id}", id);
                return StatusCode(500, "Внутренняя ошибка сервера");
            }
        }

        /// <summary>
        /// Создать новую точку интереса
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<POIResponse>> Create([FromBody] CreatePOIRequest request)
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
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при создании точки интереса");
                return StatusCode(500, "Внутренняя ошибка сервера");
            }
        }

        /// <summary>
        /// Обновить точку интереса
        /// </summary>
        [HttpPut]
        public async Task<ActionResult<POIResponse>> Update([FromBody] UpdatePOIRequest request)
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
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при обновлении точки интереса {Id}", request.Id);
                return StatusCode(500, "Внутренняя ошибка сервера");
            }
        }

        /// <summary>
        /// Удалить точку интереса
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            try
            {
                var result = await _service.Delete(id);
                if (result)
                    return NoContent();

                return NotFound($"Точка интереса с id {id} не найдена");
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при удалении точки интереса {Id}", id);
                return StatusCode(500, "Внутренняя ошибка сервера");
            }
        }
    }
}
