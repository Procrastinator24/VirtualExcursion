using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using VirtualExcursion.BLL.DTO.Requests.workspace;
using VirtualExcursion.BLL.DTO.Responses;
using VirtualExcursion.BLL.services.interfaces;

namespace VirtualExcursion.API.Controllers
{
    [ApiController]
    [Route("api/workspaces/{workspaceId}/[controller]")]
    [Authorize]
    public class WorkspaceMemberController : ControllerBase
    {
        private readonly IWorkspaceMemberService _memberService;
        private readonly IWorkspaceService _workspaceService;
        private readonly ILogger<WorkspaceMemberController> _logger;

        public WorkspaceMemberController(
            IWorkspaceMemberService memberService,
            IWorkspaceService workspaceService,
            ILogger<WorkspaceMemberController> logger)
        {
            _memberService = memberService;
            _workspaceService = workspaceService;
            _logger = logger;
        }

        private int GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
                throw new UnauthorizedAccessException("Пользователь не авторизован");
            return int.Parse(userIdClaim.Value);
        }

        private async Task<bool> CanManageMembers(int workspaceId)
        {
            var userId = GetCurrentUserId();
            // Админ может всё
            if (User.IsInRole("Admin"))
                return true;

            // Владелец или админ пространства может управлять участниками
            var role = await _memberService.GetUserRole(workspaceId, userId);
            return role == "admin";
        }

        /// <summary>
        /// Получить всех участников пространства
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<List<WorkspaceMemberResponse>>> GetMembers(int workspaceId)
        {
            try
            {
                var userId = GetCurrentUserId();
                var isMember = await _memberService.IsMember(workspaceId, userId);

                if (!isMember && !User.IsInRole("Admin"))
                    return Forbid();

                var result = await _memberService.GetMembers(workspaceId);
                return Ok(result);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при получении участников workspace {WorkspaceId}", workspaceId);
                return StatusCode(500, "Внутренняя ошибка сервера");
            }
        }

        /// <summary>
        /// Получить информацию об участнике
        /// </summary>
        [HttpGet("{userId}")]
        public async Task<ActionResult<WorkspaceMemberResponse>> GetMember(int workspaceId, int userId)
        {
            try
            {
                var currentUserId = GetCurrentUserId();
                var isMember = await _memberService.IsMember(workspaceId, currentUserId);

                if (!isMember && !User.IsInRole("Admin"))
                    return Forbid();

                var result = await _memberService.GetMember(workspaceId, userId);
                if (result == null)
                    return NotFound("Участник не найден");

                return Ok(result);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при получении участника {UserId} в workspace {WorkspaceId}", userId, workspaceId);
                return StatusCode(500, "Внутренняя ошибка сервера");
            }
        }

        /// <summary>
        /// Добавить участника в пространство
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<WorkspaceMemberResponse>> AddMember(int workspaceId, [FromBody] AddWorkspaceMemberRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (request.WorkspaceId != workspaceId)
                    return BadRequest("ID пространства в URL и теле запроса не совпадают");

                if (!await CanManageMembers(workspaceId))
                    return Forbid();

                var userId = GetCurrentUserId();
                var result = await _memberService.AddMember(request, userId);
                return Ok(result);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(ex.Message);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при добавлении участника в workspace {WorkspaceId}", workspaceId);
                return StatusCode(500, "Внутренняя ошибка сервера");
            }
        }

        /// <summary>
        /// Обновить роль участника
        /// </summary>
        [HttpPut("{userId}/role")]
        public async Task<ActionResult<WorkspaceMemberResponse>> UpdateRole(int workspaceId, int userId, [FromBody] UpdateWorkspaceMemberRoleRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (request.WorkspaceId != workspaceId || request.UserId != userId)
                    return BadRequest("ID в URL и теле запроса не совпадают");

                if (!await CanManageMembers(workspaceId))
                    return Forbid();

                // Нельзя менять роль владельца
                if (await _workspaceService.IsOwner(workspaceId, userId))
                    return BadRequest("Нельзя изменить роль владельца пространства");

                var result = await _memberService.UpdateRole(request);
                return Ok(result);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при обновлении роли участника {UserId} в workspace {WorkspaceId}", userId, workspaceId);
                return StatusCode(500, "Внутренняя ошибка сервера");
            }
        }

        /// <summary>
        /// Удалить участника из пространства
        /// </summary>
        [HttpDelete("{userId}")]
        public async Task<ActionResult> RemoveMember(int workspaceId, int userId)
        {
            try
            {
                var currentUserId = GetCurrentUserId();

                // Участник может удалить сам себя
                if (userId != currentUserId && !await CanManageMembers(workspaceId))
                    return Forbid();

                var result = await _memberService.RemoveMember(workspaceId, userId);
                if (!result)
                    return NotFound("Участник не найден");

                return NoContent();
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при удалении участника {UserId} из workspace {WorkspaceId}", userId, workspaceId);
                return StatusCode(500, "Внутренняя ошибка сервера");
            }
        }
    }
}
