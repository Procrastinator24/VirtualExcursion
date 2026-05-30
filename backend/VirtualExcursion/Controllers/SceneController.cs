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
        private readonly ILogger<SceneController> _logger;

        public SceneController(ISceneService service, ILogger<SceneController> logger)
        {
            _service = service;
            _logger = logger;
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
        public async Task<ActionResult<List<SceneResponse>>> GetByWorkspaceId(int workspaceId)
        {
            var result = await _service.GetByWorkspaceId(workspaceId);
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
