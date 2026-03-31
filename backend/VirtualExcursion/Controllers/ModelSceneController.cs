using Microsoft.AspNetCore.Mvc;
using VirtualExcursion.BLL.DTO.Requests;
using VirtualExcursion.BLL.DTO.Responses;
using VirtualExcursion.BLL.services.interfaces;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace VirtualExcursion.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ModelSceneController : ControllerBase
    {
        private readonly IModelSceneService _service;
        private readonly ILogger<ModelSceneController> _logger;

        public ModelSceneController(IModelSceneService service, ILogger<ModelSceneController> logger)
        {
            _service = service;
            _logger = logger;
        }

        /// <summary>
        /// Получить все модели сцен
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<List<ModelSceneResponse>>> GetAll()
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
        public async Task<ActionResult<ModelSceneResponse>> GetById(int id)
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

        /// <summary>
        /// Получить модель сцены по id сцены
        /// </summary>
        [HttpGet("scene/{sceneId:int}")]
        public async Task<ActionResult<ModelSceneResponse>> GetBySceneId(int sceneId)
        {
            try
            {
                var result = await _service.GetBySceneId(sceneId);
                return Ok(result);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при получении модели для сцены {SceneId}", sceneId);
                return StatusCode(500, "Внутренняя ошибка сервера");
            }
        }

        /// <summary>
        /// Создать новую модель сцены
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<ModelSceneResponse>> Create([FromBody] CreateModelSceneRequest request)
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
                _logger.LogError(ex, "Ошибка при создании модели сцены");
                return StatusCode(500, "Внутренняя ошибка сервера");
            }
        }

        /// <summary>
        /// Обновить модель сцены
        /// </summary>
        [HttpPut]
        public async Task<ActionResult<ModelSceneResponse>> Update([FromBody] UpdateModelSceneRequest request)
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
                _logger.LogError(ex, "Ошибка при обновлении модели сцены {Id}", request.Id);
                return StatusCode(500, "Внутренняя ошибка сервера");
            }
        }

        /// <summary>
        /// Удалить модель сцены
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            try
            {
                var result = await _service.Delete(id);
                if (result)
                    return NoContent();

                return NotFound($"Модель сцены с id {id} не найдена");
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при удалении модели сцены {Id}", id);
                return StatusCode(500, "Внутренняя ошибка сервера");
            }
        }
    }
}
