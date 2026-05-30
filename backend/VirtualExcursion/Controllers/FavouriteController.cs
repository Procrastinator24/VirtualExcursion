using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using VirtualExcursion.BLL.DTO.Requests;
using VirtualExcursion.BLL.DTO.Responses;
using VirtualExcursion.BLL.services.interfaces;
using VirtualExcursion.DAL.models;

namespace VirtualExcursion.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    //[Authorize]
    public class FavouriteController : ControllerBase
    {
        private readonly IFavouriteService _favouriteService;
        private readonly ILogger<FavouriteController> _logger;

        public FavouriteController(IFavouriteService favouriteService, ILogger<FavouriteController> logger)
        {
            _favouriteService = favouriteService;
            _logger = logger;
        }

        private int GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
                throw new UnauthorizedAccessException("Пользователь не авторизован");
            return int.Parse(userIdClaim.Value);
        }

        /// <summary>
        /// Получить избранное текущего пользователя
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<List<FavouriteResponse>>> GetUserFavourites()
        {   //TODO: доделать позже авторизацию и вернуть правильную реализацию контроллера
            var result = await _favouriteService.GetUserFavourites(1);
            return Ok(result);
            //try
            //{
            //    var userId = GetCurrentUserId();
            //    var result = await _favouriteService.GetUserFavourites(userId);
            //    return Ok(result);
            //}
            //catch (UnauthorizedAccessException ex)
            //{
            //    return Unauthorized(ex.Message);
            //}
            //catch (Exception ex)
            //{
            //    _logger.LogError(ex, "Ошибка при получении избранного");
            //    return StatusCode(500, "Внутренняя ошибка сервера");
            //}
        }

        /// <summary>
        /// Добавить в избранное
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<FavouriteResponse>> AddFavourite([FromBody] CreateFavouriteRequest request)
        {
            try
            {
                var userId = GetCurrentUserId();
                var result = await _favouriteService.AddFavourite(userId, request);
                return CreatedAtAction(nameof(GetUserFavourites), new { id = result.Id }, result);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(ex.Message);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(ex.Message);
            }
            catch (ArgumentNullException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при добавлении в избранное");
                return StatusCode(500, "Внутренняя ошибка сервера");
            }
        }

        /// <summary>
        /// Удалить из избранного
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<ActionResult> RemoveFavourite(int id)
        {
            try
            {
                var result = await _favouriteService.RemoveFavourite(id);
                if (result)
                    return NoContent();

                return NotFound($"Запись в избранном с id {id} не найдена");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при удалении из избранного {Id}", id);
                return StatusCode(500, "Внутренняя ошибка сервера");
            }
        }

        /// <summary>
        /// Проверить, находится ли объект в избранном
        /// </summary>
        [HttpGet("check")]
        public async Task<ActionResult<bool>> IsFavourite([FromQuery] int? excursionId, [FromQuery] int? sceneId)
        {
            try
            {
                var userId = GetCurrentUserId();
                var result = await _favouriteService.IsFavourite(userId, excursionId, sceneId);
                return Ok(result);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при проверке избранного");
                return StatusCode(500, "Внутренняя ошибка сервера");
            }
        }
    }
}
